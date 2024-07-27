import { LayerSpecificationWithZIndex } from './types.js'
import {poleRadius_p} from './common.js';

const cuivreColor = '#ff8900';

const layers: LayerSpecificationWithZIndex[] = [
  {
    zorder: 300,
    id: 'cuivre_adresses',
    type: 'circle',
    source: 'cuivre',
    minzoom: 10,
    'source-layer': 'cuivre_adresses',
    paint: {
      'circle-radius': poleRadius_p,
      'circle-color': cuivreColor,
      'circle-stroke-color': "#9C9C9C",
      'circle-stroke-width': ['interpolate', ['linear'], ['zoom'],
          5, 0,
          6, 0.1,
          14, 0.5,
          17, 3
      ]
    }
  },
  {
    zorder:305,
    id: 'cuivre_fibre_path',
    type: 'line',
    source: 'cuivre',
    'source-layer': 'cuivre_fibre_liens',
    minzoom: 0,
    paint: {
      'line-color': "#666666",
      'line-width': 1.5,
      'line-opacity': 1,
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    }
  }
];

export {layers as cuivreLayers};
