import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    dict: []
  },
  mutations: {
    setDict (state, dict) {
      debugger
      if (state.dict.some(item => item.key === dict.key)) {
        return
      }
      state.dict.push(dict)
    }
  },
  actions: {},
  getters: {
    getDict (state) {
      return function (key) {
        let reuslt = []
        state.dict.forEach(dict => {
          if (dict.key === key) {
            reuslt = dict.value
          }
        })
        return reuslt
      }
    }
  }
}
