import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    currentTabValue: localStorage.getItem('current_tab_name'),
    dynamicTabs: [{
      title: '欢迎',
      name: 'welcome',
      hidden: 0
    }]
  },
  mutations: {
    /**
     * 添加Tab
     *
     * @param state
     * @param menu
     */
    setTab: (state, menu) => {
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
    /**
     * 设置当前的Tab名称
     *
     * @param state
     * @param name
     */
    setCurrentTabValue: (state, name) => {
      localStorage.setItem('current_tab_name', name)
      state.currentTabValue = name
    }
  },
  actions: {},
  getters: {
    /**
     * 获取当前的Tab名称
     *
     * @param state
     */
    getCurrentTabValue (state) {
      return state.currentTabValue
    }
  }
}
