import { LayerSpecificationWithZIndex } from './types.ts'
// Raster style, OSM-carto to greyscale

const layers: LayerSpecificationWithZIndex[] = [
  {
    id: 'background',
    type: 'background',
    paint: {
      'background-color': 'rgb(255, 255, 255)'
    }
  },
  {
    id: 'backmap',
    source: 'greyscale',
    type: 'raster',
    paint: {
      'raster-saturation': -1,
      'raster-opacity': 0.75
    }
  }
]

export default layers