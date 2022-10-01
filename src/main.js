import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import svg from './assets/icon'

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  svg,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
