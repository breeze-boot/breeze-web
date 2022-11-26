import Vue from 'vue'
import Vuex from 'vuex'
import menu from '@/store/modules/menu'
import msg from '@/store/modules/msg'
import userInfo from '@/store/modules/userInfo'
import tag from '@/store/modules/Tag'
import tabs from '@/store/modules/Tabs'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    menu,
    userInfo,
    msg,
    tag,
    tabs
  }
})
