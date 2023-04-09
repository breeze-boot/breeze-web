import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    display: 'none',
    clickTabName: 'welcome',
    left: '0px'
  },
  getters: {
    getDisplay: (state) => state.display,
    getClickTabName: (state) => state.clickTabName,
    getLeft: (state) => state.left
  },
  mutations: {
    setDisplay (state, display) {
      state.display = display
    },
    setClickTabName (state, clickTabName) {
      state.clickTabName = clickTabName.replace('tab-', '')
    },
    setLeft (state, left) {
      state.left = left
    }
  }
}
