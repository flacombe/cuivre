import { LayerSpecificationWithZIndex } from './types.js'


const layers: LayerSpecificationWithZIndex[] = [
  {
    zorder: 100,
    id: 'commune_area',
    type: 'fill',
    source: 'cuivre',
    'source-layer': 'communes',
    minzoom: 7,
    paint: {
      'fill-opacity': 0.5,
      'fill-color': "#999999",
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
      'circle-color': "#999999",
      'circle-stroke-color': "#666666",
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
