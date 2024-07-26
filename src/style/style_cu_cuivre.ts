import { LayerSpecificationWithZIndex } from './types.js'
import {scale_color, dotRadius_p, dotStroke_p} from './common.js';

const cuivreColor = '#ff8900';

const catReco_scale = [
  [1, "#666666"],
  [2, "#A9A9A9"],
  [null,"#DD0000"]
];

const layers: LayerSpecificationWithZIndex[] = [
  {
    zorder: 305,
    id: 'cuivre_adresses',
    type: 'circle',
    source: 'cuivre',
    minzoom: 11,
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
    minzoom: 11,
    paint: {
      'line-color': scale_color("cuivre_catreco", catReco_scale),
      'line-width': 1.5,
      'line-opacity': 1,
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    }
  }
];

export {layers as cuivreLayers, cuivreColor};
