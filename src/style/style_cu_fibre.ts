import { LayerSpecificationWithZIndex } from './types.js'
import {dotRadius_p, dotStroke_p} from './common.js';

const colour_fibre_deploye = '#1c9100';
const colour_fibre_prevu = '#2f492a';
const colour_fibre_demande = '#1e74fd';
const colour_fibre_abandonne = '#777777';
const colour_fibre_nocopper = '#7dff7d';

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
      'circle-color': ["match",
        ["get", "fibre_imb_etat"],
          "deploye", colour_fibre_deploye,
          "signe", colour_fibre_prevu,
          "raccordable demande", colour_fibre_demande,
          "en cours de deploiement", colour_fibre_prevu,
          "cible", colour_fibre_prevu,
          "abandonne", colour_fibre_abandonne,
          colour_fibre_prevu
      ],
      'circle-stroke-color': ["match",
        ["get", "fibre_fc_cuivre"],
          "1", colour_fibre_nocopper,
          "#9C9C9C"
      ],
      'circle-stroke-width': dotStroke_p
    }
  }

];

export {layers as fibreLayers, colour_fibre_deploye, colour_fibre_prevu, colour_fibre_demande, colour_fibre_abandonne};
