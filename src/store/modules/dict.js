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
      if (state.dict.some(item => item.key === dict.key)) {
        return
      }
      state.dict.push(dict)
    }
  },
  actions: {},
  getters: {
    getDict (state) {
      let result = []
      return function (key) {
        state.dict.forEach(dict => {
          if (dict.key === key) {
            result = dict.value
          }
        })
        return result
      }
    },
    getTableDictLabel (state) {
      return function (row, column, key) {
        if (!row || !column) {
          return
        }
        let label = ''
        state.dict.forEach(dict => {
          if (dict.key === key) {
            dict.value.forEach(item => {
              if (item.value === row[column.property] + '') {
                label = item.label
              }
            })
          }
        })
        return label
      }
    },
    getDescriptionsDictLabel (state) {
      return function (row, columnName, key) {
        if (!row || !columnName) {
          return
        }
        let label = ''
        state.dict.forEach(dict => {
          if (dict.key === key) {
            debugger
            dict.value.forEach(item => {
              if (item.value === row[columnName] + '') {
                label = item.label
              }
            })
          }
        })
        return label
      }
    }
  }
}
