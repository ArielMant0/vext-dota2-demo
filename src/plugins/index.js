/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import pinia from '../store'
import router from '../router'
import { createVextPlugin } from '@nullbuild/vext'

import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css';

export function registerPlugins (app) {
  loadFonts()
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .component("vue-json-pretty", VueJsonPretty) // add the VueJsonPretty component
    .use(createVextPlugin())                     // add VEXT components
}
