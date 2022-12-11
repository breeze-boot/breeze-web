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
      return function (key) {
        let result = []
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
        let value = ''
        state.dict.forEach(dict => {
          if (dict.key === key) {
            dict.value.forEach(item => {
              if (item.key === row[column.property] + '') {
                value = item.value
              }
            })
          }
        })
        return value
      }
    },
    getDescriptionsDictLabel (state) {
      return function (row, columnName, key) {
        if (!row || !columnName) {
          return
        }
        let value = ''
        state.dict.forEach(dict => {
          if (dict.key === key) {
            dict.value.forEach(item => {
              if (item.key === row[columnName] + '') {
                value = item.value
              }
            })
          }
        })
        return value
      }
    }
  }
}
