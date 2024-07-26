import { Plugin, ResolvedConfig } from 'vite'
import { promises as fs } from 'fs'
import fg from 'fast-glob'
import path from 'path'
import chokidar from 'chokidar'
import { Resvg } from '@resvg/resvg-js'
import { createHash } from 'crypto'
import { join } from 'path'
import encode from '@wasm-codecs/oxipng'
import { OutputAsset } from 'rollup'

const PLUGIN_NAME = 'vite-plugin-render-svg'
const VIRTUAL_MODULE_ID = 'virtual:render-svg'

export interface RenderSVGOptions {
  pattern: string
  urlPrefix: string
  scales?: number[]
  outputOriginal?: boolean
}

export interface Manifest {
  [scale: string]: {
    [name: string]: string
  }
}

// @ts-expect-error Vite virtual module
declare module 'virtual:render-svg' {
  export const manifest: Manifest
}

interface FileMeta {
  path: string
  name: string
  hash?: string
}

async function renderFile(svg: Buffer, scale: number = 1, optimise: boolean = false): Promise<Buffer> {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'zoom',
      value: scale
    }
  })
  let data = resvg.render().asPng()
  if (optimise) {
    data = encode(data, { level: 3 })
  }
  return data
}

async function getFiles(pattern: string, hash: boolean = false): Promise<Map<string, FileMeta>> {
  const files = fg.sync(pattern)
  const map = new Map<string, FileMeta>()
  for (const file of files) {
    const meta: FileMeta = {
      path: file,
      name: path.basename(file, '.svg')
    }
    if (hash) {
      meta.hash = createHash('md5')
        .update(await fs.readFile(file))
        .digest('hex')
    }
    map.set(meta.name, meta)
  }
  return map
}

function getFileName(fileMeta: FileMeta, scale: number, ext: string): string {
  let suffix = ''
  if (scale > 1) {
    suffix = `@${scale}x`
  }
  let hash = ''
  if (fileMeta.hash) {
    hash = `-${fileMeta.hash.substring(0, 8)}`
  }
  return `${fileMeta.name}${hash}.${ext}${suffix}`
}

export function renderSVG({
  pattern,
  urlPrefix,
  scales = [1, 2],
  outputOriginal: copyOriginal = false
}: RenderSVGOptions): Plugin[] {
  let config: ResolvedConfig
  let watcher: chokidar.FSWatcher

  let pattern_path: string
  let files: Map<string, FileMeta>

  function resolveId(id: string) {
    if (id === VIRTUAL_MODULE_ID) {
      return '\0' + VIRTUAL_MODULE_ID
    }
  }

  function generateManifest() {
    const manifest: Manifest = {}
    for (const scale of scales) {
      manifest[scale.toString()] = {}
      for (const [name, fileMeta] of files) {
        manifest[scale.toString()][name] = urlPrefix + getFileName(fileMeta, scale, 'png')
      }
    }

    if (copyOriginal) {
      manifest['svg'] = {}
      for (const [name, fileMeta] of files) {
        manifest['svg'][name] = urlPrefix + getFileName(fileMeta, 1, 'svg')
      }
    }
    return manifest
  }

  return [
    {
      name: `${PLUGIN_NAME}:build`,
      apply: 'build',
      async configResolved(_config: ResolvedConfig) {
        config = _config
        pattern_path = join(config.root, pattern)
        files = await getFiles(pattern_path, true)
      },
      resolveId,
      load(id) {
        if (id === '\0' + VIRTUAL_MODULE_ID) {
          return `export const manifest = ${JSON.stringify(generateManifest())}`
        }
      },
      async generateBundle(this, _options, bundle) {
        // Rollup doesn't allow us to pass file paths into emitFile, only file names,
        // so I copied this pattern from rollup-plugin-postcss...
        for (const file of files.values()) {
          const svg_data = await fs.readFile(file.path)
          if (copyOriginal) {
            const filepath = urlPrefix + getFileName(file, 1, 'svg')
            const outputAsset: OutputAsset = {
              type: 'asset',
              fileName: filepath,
              source: svg_data,
              needsCodeReference: false,
              name: filepath
            }
            bundle[outputAsset.fileName] = outputAsset
          }

          for (const scale of scales) {
            const png = await renderFile(svg_data, scale)
            const filepath = urlPrefix + getFileName(file, scale, 'png')
            const outputAsset: OutputAsset = {
              type: 'asset',
              fileName: filepath,
              source: png,
              needsCodeReference: false,
              name: filepath
            }
            bundle[outputAsset.fileName] = outputAsset
          }
        }
      }
    },
    {
      name: `${PLUGIN_NAME}:serve`,
      apply: 'serve',
      async configResolved(_config: ResolvedConfig) {
        config = _config
        pattern_path = join(config.root, pattern)
        files = await getFiles(pattern_path)
      },
      resolveId,
      load(id) {
        if (id !== '\0' + VIRTUAL_MODULE_ID) {
          return
        }
        return `export const manifest = ${JSON.stringify(generateManifest())}`
      },
      async configureServer(server) {
        async function onChange() {
          server.ws.send({ type: 'full-reload', path: '*' })
          files = await getFiles(pattern_path)
        }

        watcher = chokidar
          .watch(pattern, {
            cwd: config.root,
            ignoreInitial: true
          })
          .on('add', onChange)
          .on('change', onChange)
          .on('unlink', onChange)

        // Insert a handler to respond to URL requests with live-rendered PNGs
        server.middlewares.use(async (req, res, next) => {
          if (!req.url?.startsWith('/' + urlPrefix)) {
            return next()
          }
          const match = req.url.match(/.*\/(?<name>[^/]*)\.(?<filetype>png|svg)(@(?<scale>[0-9])x)?$/)
          if (!match || !files.has(match.groups!.name!)) {
            return next()
          }
          const name = match.groups!.name!
          const scale = match.groups?.scale ? parseInt(match.groups?.scale) : 1

          if (!scales.includes(scale)) {
            return next()
          }

          const file_meta = files.get(name)
          if (!file_meta) {
            return next()
          }
          let data: Buffer = undefined!
          try {
            data = await fs.readFile(file_meta.path)
          } catch (e) {
            console.error(`Error reading SVG file: ${file_meta.path}`, e)
            return next()
          }

          if (match.groups!.filetype === 'svg' && copyOriginal === false) {
            // Request for an SVG file which we wouldn't serve in production
            return next()
          }

          // Hash file to produce an ETag
          const hash = createHash('md5').update(data).digest('hex')

          if (req.headers['if-none-match'] === hash) {
            res.writeHead(304)
            return res.end()
          }

          if (match.groups!.filetype === 'svg') {
            res.writeHead(200, {
              'Content-Type': 'image/svg+xml',
              ETag: hash,
              'Cache-Control': 'no-cache'
            })
            res.end(data)
            return
          }

          let svg: Buffer = undefined!
          try {
            svg = await renderFile(data, scale)
          } catch (e) {
            console.error(`Error rendering SVG file: ${file_meta.path}`, e)
            return next()
          }

          res.writeHead(200, {
            'Content-Type': 'image/png',
            ETag: hash,
            'Cache-Control': 'no-cache'
          })
          res.end(svg)
        })
      },
      async closeBundle() {
        await watcher.close()
      }
    }
  ]
}
