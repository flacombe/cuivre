
import { LayerSpecificationWithZIndex } from './types.js'

const layers: LayerSpecificationWithZIndex[] = [
  {
    zorder: 400,
    id: 'fibre_adresses',
    type: 'fill',
    source: 'cuivre',
    minzoom: 11,
    'source-layer': 'fibre_adresses',
    paint: {
      'fill-opacity': 0.65,
      'fill-color': "#3e6651",
      'fill-outline-color': "#003519"
    },
  }

];

export {layers as fibreLayers};
