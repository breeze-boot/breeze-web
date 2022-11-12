import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    currentTabValue: 'welcome',
    dynamicTabs: [{
      title: '欢迎',
      name: 'welcome',
      hidden: 0
    }]
  },
  mutations: {
    setTab (state, menu) {
      if (state.hidden === 0) {
        if (menu.name === 'welcome') {
          menu.title = '欢迎'
        }
        state.currentTagValue = menu.name
      }
      const tabs = state.dynamicTabs.filter((item) => item.name === menu.name)
      if (tabs.length > 0) {
        return
      }
      state.dynamicTabs.push(menu)
    },
    setCurrentTabValue (state, name) {
      state.currentTabValue = name
    }
  },
  actions: {},
  getters: {}
}
