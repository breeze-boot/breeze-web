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
        localStorage.setItem('current_tab_name', menu.name)
      }
      const tabs = state.dynamicTabs.some((item) => item.name === menu.name)
      if (tabs) {
        return
      }
      state.dynamicTabs.push(menu)
    },
    setCurrentTabValue (state, name) {
      localStorage.setItem('current_tab_name', name)
      state.currentTabValue = name
    }
  },
  actions: {},
  getters: {
    getCurrentTabValue (state) {
      if (!state.currentTabValue) {
        state.currentTabValue = localStorage.getItem('current_tab_name')
      }
      return state.currentTabValue
    }
  }
}
