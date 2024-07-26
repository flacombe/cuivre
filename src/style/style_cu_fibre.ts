import { LayerSpecificationWithZIndex } from './types.js'
import {dotRadius_p, dotStroke_p} from './common.js';

const fibreColor = '#1c9100';


const layers: LayerSpecificationWithZIndex[] = [
  {
    zorder: 400,
    id: 'fibre_adresses',
    type: 'circle',
    source: 'cuivre',
    minzoom: 11,
    'source-layer': 'fibre_adresses',
    paint: {
      'circle-radius': dotRadius_p,
      'circle-color': fibreColor,
      'circle-stroke-color': "#9C9C9C",
      'circle-stroke-width': dotStroke_p
    }
  }

];

export {layers as fibreLayers, fibreColor};
