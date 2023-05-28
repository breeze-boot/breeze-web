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
      if (state.dict.has(dict.key)) {
        return
      }
      state.dict.set(dict.key, dict.value)
    }
  },
  actions: {},
  getters: {
    dict (state) {
      return function (key) {
        let result = new Map()
        state.dict.forEach((v, k) => {
          if (k === key) {
            result = v
          }
        })
        return result
      }
    },
    column (state) {
      return function (row, column, key) {
        if (!row || !column.property) {
          return
        }
        let value = ''
        state.dict.forEach((v, k) => {
          if (k === key) {
            v.forEach(item => {
              if (item.key === row[column.property] + '') {
                value = item.value
              }
            })
          }
        })
        return value
      }
    },
    descriptions (state) {
      return function (row, columnName, key) {
        if (!row || !columnName) {
          return
        }
        let value = ''
        state.dict.forEach((v, k) => {
          if (k === key) {
            v.forEach(item => {
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
