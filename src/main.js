import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import 'element-ui/lib/theme-chalk/index.css'
import svg from '@/assets/icon'
import { has } from '@/directive/has-permission'
import { rightMenu } from '@/directive/right-menu'
import '@/assets/icon-fonts'
import Main from '@/components/main/Main'
import ElementUI from 'element-ui'
import '../theme/index.scss'
import MsgPlugin from '@/plugin/index'
import 'animate.css'

Vue.use(ElementUI, { size: 'small' })
Vue.use(MsgPlugin)
Vue.use(ElementUI)
Vue.component('base-main', Main)

Vue.config.productionTip = false

new Vue({
  MsgPlugin,
  has,
  rightMenu,
  svg,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
