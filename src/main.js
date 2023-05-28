import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import 'element-ui/lib/theme-chalk/index.css'
import svg from '@/assets/icon'
import { has } from '@/directive/has-permission'
import { rightMenu } from '@/directive/right-menu'
import '@/assets/icon-fonts'
import BaseContainer from '@/components/main/BaseContainer.vue'
import ElementUI from 'element-ui'
import '../theme/index.scss'
import Dict from '@/plugin/dict/index'
import 'animate.css'

Vue.use(ElementUI, { size: 'small' })
Vue.use(Dict)
Vue.use(svg)
Vue.component('base-container', BaseContainer)

Vue.config.productionTip = false

new Vue({
  has,
  rightMenu,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
