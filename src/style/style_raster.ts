import { LayerSpecificationWithZIndex } from './types.ts'
// Raster style, OSM-carto to greyscale

const layers: LayerSpecificationWithZIndex[] = [
  {
    id: 'background',
    source: 'greyscale',
    type: 'raster',
    paint: {
      'raster-saturation': -1
    }
  }
]

export default layers