import { IControl } from 'maplibre-gl'
import {el, mount, list, setStyle, RedomElement} from 'redom';
import {svgLine, svgRect, svgCircleFromLayer} from './svg.js';
import './key.css';
// @ts-expect-error Vite virtual module
import { manifest } from 'virtual:render-svg'
import {lotColor_scale} from '../style/common.js';
import {cuivreLayers} from '../style/style_cu_cuivre.js';
import {fibreLayers} from '../style/style_cu_fibre.js';

class Td {
  el: HTMLTableCellElement
  constructor() {
    this.el = el('td')
  }
  update(data: string | RedomElement) {
    if (typeof data == 'string') {
      this.el.innerHTML = data
    } else if (!data) {
      return
    } else {
      mount(this.el, data)
    }
  }
}

const Tr = list.extend('tr', Td)

class KeyControl implements IControl {
  _map: maplibregl.Map | undefined
  _control!: HTMLButtonElement
  _container!: HTMLDivElement
  _pane: RedomElement | undefined
  onAdd(map: maplibregl.Map) {
    this._map = map

    this._control = el('button', {
      class: 'maplibregl-ctrl-icon oim-key-control'
    })

    this._container = el('div', { class: 'maplibregl-ctrl oim-key-panel' })

    this.populate()

    this._control.onclick = () => {
      this._container.style.display = 'block'
      this._control.style.display = 'none'
    }

    setTimeout(() => this.resize(), 100)
    this._map.on('resize', () => this.resize())
    return el('div', this._control, this._container, {
      class: 'maplibregl-ctrl maplibregl-ctrl-group'
    })
  }

  onRemove(): void {
    this._map = undefined
    this._container.remove()
    this._control.remove()
    this._pane = undefined
  }

  resize() {
    if (!this._pane) {
      return
    }
    // Set max-height of key depending on window style
    const map_style = window.getComputedStyle(this._map!.getContainer())
    let cont_style
    if (this._control.style.display != 'none') {
      cont_style = this._control.getBoundingClientRect()
    } else {
      cont_style = this._container.getBoundingClientRect()
    }
    const height = parseInt(map_style.height) - cont_style.top - 100 + 'px'
    setStyle(this._pane, { 'max-height': height })
  }

  header() {
    const close_button = el('.oim-key-close', '×')

    close_button.onclick = () => {
      this._container.style.display = 'none'
      this._control.style.display = 'block'
    }
    return el('.oim-key-header', el('h2', 'Légende'), close_button)
  }

  async populate() {
    mount(this._container, this.header());

    let pane = el('.oim-key-pane');
    pane.appendChild(el('h4', 'Communes'));
    mount(pane, this.communeTable());
    pane.appendChild(el('h4', 'Cuivre'));
    mount(pane, this.cuivreTable());
    pane.appendChild(el('h4', 'Fibre'));
    mount(pane, this.fibreTable());
    this._pane = pane;

    mount(this._container, pane);
  }

  async sprite(name: string, size = 25) {
    const spriteDiv = el('img.oim-plant-sprite', {
      src: manifest['svg'][name],
      height: size
    })
    setStyle(spriteDiv, {
      'max-width': size + 'px'
    })
    return spriteDiv as unknown as SVGElement
  }

  communeTable() {
    let rows = [];
    for (let row of lotColor_scale) {
      let label = row[0];
      if (row[1] == null){
        continue;
      }
      if (label === null) {
        label = 'Non programmée';
      } else {
        label = `Lot ${label}`;
      }

      rows.push([label, row[1]]);
    }

    rows = rows.map(row => [row[0], svgRect(row[1], 'grey', 1)]);

    let table = list('table', Tr);
    table.update(rows);
    return table;
  }

  cuivreTable() {
    const rows = [
      ['Adresse', svgCircleFromLayer(cuivreLayers, 'cuivre_adresses')],
      ['Recoupement direct', svgLine("#666666", 5)],
      ['Recoupement réseau', svgLine("#A9A9A9", 5)]
    ]

    const table = list('table', Tr)
    table.update(rows)
    return table
  }

  fibreTable() {
    const rows = [
      ['Adresse', svgCircleFromLayer(fibreLayers, 'fibre_adresses')]
    ]
    
    const table = list('table', Tr)
    table.update(rows)
    return table
  }
}

export {KeyControl as default};
