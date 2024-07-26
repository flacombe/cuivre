import { StyleSpecification } from 'maplibre-gl'

const style: StyleSpecification = {
  version: 8,
  name: "Infosreseaux-cuivre",
  sources: {
    openmaptiles: {
      type: "vector",
      url: "https://api.maptiler.com/tiles/v3/tiles.json?key=2raHq2ahXwNHsKorHH5t"
    },
    cuivre: {
      type: "vector",
      url: "https://cuivre.infos-reseaux.com/map.json"
    }
  },
  glyphs: '/fonts/{fontstack}/{range}.pbf',
  layers: []
}

export default style