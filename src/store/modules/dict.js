import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    dict: new Map()
  },
  mutations: {
    setDict (state, dict) {
      if (state.dict.has(dict.dictCode)) {
        return
      }
      state.dict.set(dict.dictCode, dict.dict)
    }
  },
  actions: {},
  getters: {
    dict (state) {
      return function (dictCode) {
        let result = new Map()
        state.dict.forEach((dict, code) => {
          if (code === dictCode) {
            result = dict
          }
        })
        return result
      }
    },
    column (state) {
      return function (row, column, dictCode) {
        if (!row || !column.property) {
          return
        }
        let _label = ''
        state.dict.forEach((dict, code) => {
          if (code === dictCode) {
            dict.forEach(item => {
              if (item.value === row[column.property] + '') {
                _label = item.label
              }
            })
          }
        })
        return _label
      }
    },
    descriptions (state) {
      return function (row, columnName, dictCode) {
        if (!row || !columnName) {
          return
        }
        let _label = ''
        state.dict.forEach((dict, code) => {
          if (code === dictCode) {
            dict.forEach(item => {
              if (item.value === row[columnName] + '') {
                _label = item.label
              }
            })
          }
        })
        return _label
      }
    }
  }
}
