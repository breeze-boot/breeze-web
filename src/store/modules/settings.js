import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    theme: 'default',
    type: 'tab'
  },
  getters: {
    getType: (state) => state.type,
    getTheme: (state) => state.theme
  },
  mutations: {
    setTheme (state, theme) {
      state.theme = theme
    },
    setType (state, type) {
      state.type = type
    }
  }
}
