import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import svg from './assets/icon'
import { has } from '@/utils/has-per'
import '@/assets/iconFont/index'
import MsgPlugin from '@/plugin/index'

import '../package/theme/element-variables.scss'
import 'highlight.js/styles/atom-one-dark-reasonable.css'
import MyPD from '../package/index.js'
import { vuePlugin } from '../package/highlight'
import '../package/theme/index.scss'
import 'bpmn-js/dist/assets/diagram-js.css'

import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'

Vue.use(MyPD)
Vue.use(vuePlugin)
Vue.use(MsgPlugin)
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  MsgPlugin,
  has,
  svg,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
