import { DataDrivenPropertyValueSpecification, ExpressionSpecification } from 'maplibre-gl'
import { local_name_tags } from '../l10n.ts'

export const local_name: ExpressionSpecification = (['coalesce'] as any).concat(
  local_name_tags.map((tag) => ['get', tag])
) as ExpressionSpecification

const text_paint = {
  'text-halo-width': 4,
  'text-halo-blur': 2,
  'text-halo-color': 'rgba(230, 230, 230, 1)'
}

const operator_text: ExpressionSpecification = [
  'step',
  ['zoom'],
  ['get', 'name'],
  14,
  ['case', ['has', 'operator'], ['concat', ['get', 'name'], ' (', ['get', 'operator'], ')'], ['get', 'name']]
]

// Colors
function scale_color(tag: string, scale: { [key: string]: any }[]): DataDrivenPropertyValueSpecification<string> {
  let result: any = ['match', ["get", tag]];
  
  for (let row of scale) {
    if (row[0] == null){
      result.push(row[1]);
      continue;
    }
    result.push(row[0]);
    result.push(row[1]);
  }

  return result;
}

const dotRadius_p: ExpressionSpecification = ['interpolate', ['linear'], ['zoom'],
  5, 0,
  14, 2,
  17, 5.5
];

const dotStroke_p:ExpressionSpecification = ['interpolate', ['linear'], ['zoom'],
  10, 0.1,
  14, 0.5,
  17, 1
]

const lotColor_scale = [
  ["Expe1", "#006cff"],
  ["Expe2", "#0094ff"],
  ["ExpeZTD", "#76c578"],
  ["1", "#ffd7bd"],
  ["2", "#ffc39c"],
  ["3", "#ffaf7b"],
  ["4", "#ff9754"],
  ["5", "#ff802e"],
  ["6", "#ff761e"],
  ["7", "#ff5500"],
  ["Preselectionlot1", "#d40000"],
  ["Preselectionlot2", "#d40000"],
  ["Preselectionlot3", "#d40000"],
  ["Preselectionlot4", "#d40000"],
  ["Preselectionlot5", "#d40000"],
  ["Preselectionlot6", "#d40000"],
  ["Preselectionlot7", "#d40000"],
  [null,"#303030"]
];

// Function to assign opacity to lines according to zoom


const font = ['Noto Sans Regular']

export {scale_color, text_paint, operator_text, lotColor_scale, dotRadius_p, dotStroke_p, font }