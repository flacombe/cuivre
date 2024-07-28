import { LayerSpecificationWithZIndex } from './types.js'
import { ExpressionSpecification } from 'maplibre-gl'
import {scale_color, lotColor_scale} from './common.js';


const communeOpacity_p: ExpressionSpecification = ['interpolate', ['linear'], ['zoom'], 9, 1, 10, 0.6, 14, 0.3]

const layers: LayerSpecificationWithZIndex[] = [
  {
    zorder: 100,
    id: 'commune_area',
    type: 'fill',
    source: 'cuivre',
    'source-layer': 'communes',
    minzoom: 7,
    paint: {
      'fill-opacity': communeOpacity_p,
      'fill-color': scale_color("com_lot", lotColor_scale),
      'fill-outline-color': 'rgba(0, 0, 0, 1)',
    }
  },
  {
    zorder: 101,
    id: 'commune_point',
    type: 'circle',
    source: 'cuivre',
    maxzoom: 8,
    'source-layer': 'communes_points',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'],
        5, 0,
        14, 2,
        17, 5.5
      ],
      'circle-color': scale_color("com_lot", lotColor_scale),
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

export {layers as communesLayers};
