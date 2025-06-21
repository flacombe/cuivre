import { LayerSpecificationWithZIndex } from './types.js'
import {scale_color, dotRadius_p, dotStroke_p} from './common.js';

const cuivreColor = '#ff8900';
const cuivreNoFtthColor = '#ff2a00'

const catReco_scale = [
  [1, "#666666"],
  [2, "#A9A9A9"],
  [null,"#DD0000"]
];

const errorReco_scale = [
  ['length', "#ff5efe"],
  ['link_street', "#ffd900"],
  [null,"#DD0000"]
];

const layers: LayerSpecificationWithZIndex[] = [
  {
    zorder: 305,
    id: 'cuivre_adresses_ftth',
    type: 'circle',
    source: 'cuivre',
    minzoom: 11,
    'source-layer': 'cuivre_adresses',
    filter: ['==', ['get', 'fibre_absente'], false],
    paint: {
      'circle-radius': dotRadius_p,
      'circle-color': cuivreColor,
      'circle-stroke-color': "#9C9C9C",
      'circle-stroke-width': dotStroke_p,
      'circle-opacity': ["match",
        ["get", "cuivre_point_scale"],
        "ftth", 0.5,
        "locality", 0.5,
        "municipality", 0.5,
        1
      ]
    }
  },
  {
    zorder: 500,
    id: 'cuivre_adresses_noftth',
    type: 'circle',
    source: 'cuivre',
    minzoom: 10,
    'source-layer': 'cuivre_adresses',
    filter: ['==', ['get', 'fibre_absente'], true],
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'],
        5, 0,
        14, 2.5,
        17, 7
      ],
      'circle-color': cuivreNoFtthColor,
      'circle-stroke-color': "#9C9C9C",
      'circle-stroke-width': dotStroke_p,
      'circle-opacity': ["match",
        ["get", "cuivre_point_scale"],
        "ftth", 0.5,
        "locality", 0.5,
        "municipality", 0.5,
        1
      ]
    }
  },
  {
    zorder:300,
    id: 'cuivre_fibre_path',
    type: 'line',
    source: 'cuivre',
    'source-layer': 'cuivre_fibre_liens',
    filter: ['!', ['has', 'error']],
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
  },
  {
    zorder:301,
    id: 'cuivre_fibre_path_error',
    type: 'line',
    source: 'cuivre',
    'source-layer': 'cuivre_fibre_liens',
    filter: ['has', 'error'],
    minzoom: 13,
    paint: {
      'line-color': scale_color("error", errorReco_scale),
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
