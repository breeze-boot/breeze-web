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
      if (state.dict.some(d => d.dictCode === dict.dictCode)) {
        return
      }
      state.dict.push(dict)
    }
  },
  actions: {},
  getters: {
    getDict (state) {
      return function (dictCode) {
        let item = []
        state.dict.forEach(dict => {
          if (dict.dictCode === dictCode) {
            item = dict.dictValue
          }
        })
        return item
      }
    }
  }
}
