import Vue from 'vue'
import Vuex from 'vuex'
import menu from '@/store/modules/menu'
import msg from '@/store/modules/msg'
import dict from '@/store/modules/dict'
import userInfo from '@/store/modules/userInfo'
import tab from '@/store/modules/Tab'
import rightMenu from '@/store/modules/rightMenu'
import settings from '@/store/modules/settings'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    menu,
    userInfo,
    msg,
    dict,
    tab,
    rightMenu,
    settings
  }
})
