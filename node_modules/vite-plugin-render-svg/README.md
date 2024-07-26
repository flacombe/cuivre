# vite-plugin-render-svg

A [Vite](https://vitejs.dev) plugin to render SVG files to PNG. This is useful for generating map symbols for [Maplibre GL JS](https://maplibre.org/maplibre-gl-js). It supports the `@2x` suffix for generating Retina/high-DPI images, and tagging the filenames with a hash when deployed in production.

In development mode, PNG files are rendered on the fly by the dev server. When building for production, the rendered PNG files are optimised with oxipng.

## Installation

```bash
$ npm install -D vite-plugin-render-svg
```

## Usage

Add the plugin to your Vite config:

```js
import { renderSVG } from 'vite-plugin-render-svg'

export default defineConfig({
  plugins: [
    renderSVG({
      pattern: 'src/icons/*.svg',
      urlPrefix: 'icons/',
      outputOriginal: true
    })
  ]
})
```

In your application javascript, you can now get the manifest of rendered PNG files:

```js
import { manifest } from 'virtual:render-svg'
```

Assuming you have one SVG file called `example.svg`, the manifest structure will be in a format like:

```json
{
  "1": {
    "example": "/icons/example-abc1234.png"
  },
  "2": {
    "example": "/icons/example-abc1234.png@2x"
  },
  "svg": {
    "example": "/icons/example-abc1234.svg"
  }
}
```

The first level of nesting is the scale level (or "svg" for the original file).

## Options

| Option           | Type                 | Description                                                                         |
| ---------------- | -------------------- | ----------------------------------------------------------------------------------- |
| `pattern`        | `string`             | A glob pattern that specifies which SVG files to process.                           |
| `urlPrefix`      | `string`             | The prefix which the resulting PNG files will be rendered at (without leading `/`). |
| `scales`         | `int[]` (optional)   | A list of scale factors which the PNG files will be rendered at (default: `[1, 2]`) |
| `outputOriginal` | `boolean` (optional) | Whether the original SVG files are also output.                                     |
