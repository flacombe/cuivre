import { LayerSpecificationWithZIndex } from './types.js'
import {dotRadius_p, dotStroke_p} from './common.js';

const cuivreColor = '#ff8900';

const layers: LayerSpecificationWithZIndex[] = [
  {
    zorder: 305,
    id: 'cuivre_adresses',
    type: 'circle',
    source: 'cuivre',
    minzoom: 10,
    'source-layer': 'cuivre_adresses',
    paint: {
      'circle-radius': dotRadius_p,
      'circle-color': cuivreColor,
      'circle-stroke-color': "#9C9C9C",
      'circle-stroke-width': dotStroke_p
    }
  },
  {
    zorder:300,
    id: 'cuivre_fibre_path',
    type: 'line',
    source: 'cuivre',
    'source-layer': 'cuivre_fibre_liens',
    minzoom: 0,
    paint: {
      'line-color': "#666666",
      'line-width': 1,
      'line-opacity': 1,
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    }
  }
];

export {layers as cuivreLayers, cuivreColor};
