import { StyleSpecification } from 'maplibre-gl'

const style: StyleSpecification = {
  version: 8,
  name: "Infosreseaux-cuivre",
  sources: {
    /*
    Disabled due to affluence
    openmaptiles: {
      type: "vector",
      url: "https://api.maptiler.com/tiles/v3/tiles.json?key=2raHq2ahXwNHsKorHH5t"
    },*/
    greyscale: {
      type: 'raster',
      tiles: [
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      ],
      tileSize: 256,
      attribution: 'Fond par la Fondation OpenStreetMap',
    },
    cuivre: {
      type: "vector",
      url: "https://cuivre.infos-reseaux.com/map.json"
    }
  },
  glyphs: '/fonts/{fontstack}/{range}.pbf',
  layers: [
  ]
}

export default style