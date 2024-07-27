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

const poleRadius_p: ExpressionSpecification = ['interpolate', ['linear'], ['zoom'],
  5, 0,
  14, 2,
  17, 5.5
];

/*
const lot_scale = {
  "Expe1":"#DD0000",
  "Expe2":"#ffc107",
  "ExpeZTD":"#ffc107",
  "1":"#17a2b8",
  "2":"#17a2b8",
  "3":"#17a2b8",
  "4":"#17a2b8",
  "5":"#17a2b8",
  "6":"#17a2b8",
  "Preselectionlot4":"#17a2b8"
};
*/

// Function to assign opacity to lines according to zoom
const lineOpacity_p: ExpressionSpecification = ['interpolate', ['linear'], ['zoom'], 9, 1, 10, 0.6, 14, 0.3]

const font = ['Noto Sans Regular']

export {scale_color, text_paint, operator_text, poleRadius_p, lineOpacity_p, font }