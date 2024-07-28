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

const lotColor_scale = [
  ["Expe1", "#006cff"],
  ["Expe2", "#0094ff"],
  ["ExpeZTD", "#ffc107"],
  ["1", "#ffc39c"],
  ["2", "#ffaf7b"],
  ["3", "#ff9754"],
  ["4", "#ff802e"],
  ["5", "#ff761e"],
  ["6", "#c95e19"],
  ["7", "#ff6600"],
  ["Preselectionlot1", "#ff6600"],
  ["Preselectionlot2", "#ff6600"],
  ["Preselectionlot3", "#ff6600"],
  ["Preselectionlot4", "#ff6600"],
  ["Preselectionlot5", "#ff6600"],
  ["Preselectionlot6", "#ff6600"],
  ["Preselectionlot7", "#ff6600"],
  [null,"#17a2b8"]
];

// Function to assign opacity to lines according to zoom


const font = ['Noto Sans Regular']

export {scale_color, text_paint, operator_text, lotColor_scale, dotRadius_p, font }