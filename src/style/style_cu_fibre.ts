import { LayerSpecificationWithZIndex } from './types.js'
import {poleRadius_p} from './common.js';

const fibreColor = '#1c9100';


const layers: LayerSpecificationWithZIndex[] = [
  {
    zorder: 400,
    id: 'fibre_adresses',
    type: 'circle',
    source: 'cuivre',
    minzoom: 10,
    'source-layer': 'fibre_adresses',
    paint: {
      'circle-radius': poleRadius_p,
      'circle-color': fibreColor,
      'circle-stroke-color': "#9C9C9C",
      'circle-stroke-width': ['interpolate', ['linear'], ['zoom'],
          5, 0,
          6, 0.1,
          14, 0.5,
          17, 3
      ]
    }
  }

];

export {layers as fibreLayers};
