import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    currentTagValue: 'welcome',
    dynamicTags: [{
      title: '欢迎',
      name: 'welcome',
      hidden: 0
    }]
  },
  mutations: {
    setTag (state, menu) {
      if (state.hidden === 0) {
        if (menu.name === 'welcome') {
          menu.title = '欢迎'
        }
        state.currentTagValue = menu.name
      }
      const tags = state.dynamicTags.filter((item) => item.name === menu.name)
      if (tags.length > 0) {
        return
      }
      state.dynamicTags.push(menu)
    },
    setCurrentTagValue (state, name) {
      state.currentTagValue = name
    }
  },
  actions: {},
  getters: {}
}
