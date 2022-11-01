import Vue from 'vue'
import Vuex from 'vuex'
import menu from '@/store/modules/menu'
import userInfo from '@/store/modules/userInfo'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    menu,
    userInfo
  }
})
