import './index.css'
import maplibregl from 'maplibre-gl'

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-slider';
import 'bootstrap-slider/dist/css/bootstrap-slider.min.css';

import LayerSwitcher from '@russss/maplibregl-layer-switcher'
import URLHash from '@russss/maplibregl-layer-switcher/urlhash'
import { LayerSpecificationWithZIndex } from './style/types.js'

import InfoPopup from './infopopup.js'
import KeyControl from './key/key.js'

import map_style from './style/style.js'
import style_base from './style/style_base.ts'
import style_labels from './style/style_labels.js'
import {communesLayers as style_cu_communes} from './style/style_cu_communes.js';
import {cuivreLayers as style_cu_cuivre} from './style/style_cu_cuivre.js'
import {fibreLayers as style_cu_fibre} from './style/style_cu_fibre.js'
import loadIcons from './loadIcons.js'

function init() {
  /*if (!maplibregl.supported({failIfMajorPerformanceCaveat: true})) {
    const infobox = new InfoBox('Warning');
    infobox.update(
      'Your browser may have performance or functionality issues with OpenInfraMap.<br/>' +
        '<a href="http://webglreport.com">WebGL</a> with hardware acceleration is required for this site ' +
        'to perform well.',
    );
    mount(document.body, infobox);
  }*/

  const cu_layers: LayerSpecificationWithZIndex[] = [
    ...style_cu_communes,
    ...style_cu_cuivre,
    ...style_cu_fibre
  ];

  cu_layers.sort((a, b) => {
    if (!a.zorder || !b.zorder) return 0
    if (a.zorder < b.zorder) return -1
    if (a.zorder > b.zorder) return 1
    return 0
  })

  const layers = {
    'Communes': 'communes_',
    'Cuivre': 'cuivre_',
    'Fibre': 'fibre_',
  };
  const layers_enabled = ['Electricité', 'Télécoms'];
  const layer_switcher = new LayerSwitcher(layers, layers_enabled);
  var url_hash = new URLHash(layer_switcher);
  layer_switcher.urlhash = url_hash;

  map_style.layers = style_base.concat(cu_layers, style_labels);

  layer_switcher.setInitialVisibility(map_style);

  const map = new maplibregl.Map(
    url_hash.init({
      container: 'map',
      style: map_style,
      minZoom: 2,
      maxZoom: 20.9,
      center: [2.727, 46.125],
      zoom:4.9,
      localIdeographFontFamily: "'Apple LiSung', 'Noto Sans', 'Noto Sans CJK SC', sans-serif"
    })
  )

  loadIcons(map)

  map.dragRotate.disable()
  map.touchZoomRotate.disableRotation()

  url_hash.enable(map)
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
  map.addControl(
    new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    })
  )

  map.addControl(new maplibregl.ScaleControl({}), 'bottom-left')

  map.addControl(new KeyControl(), 'top-right')
  map.addControl(layer_switcher, 'top-right')
  new InfoPopup(
    cu_layers.map((layer: { [x: string]: any }) => layer['id']),
    9
  ).add(map);
}

if (document.readyState != 'loading') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}
