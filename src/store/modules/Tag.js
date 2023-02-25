import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    currentTagValue: localStorage.getItem('current_tag_name'),
    dynamicTags: [{
      title: '欢迎',
      name: 'welcome',
      hidden: 0
    }]
  },
  mutations: {
    /**
     * 添加Tag
     *
     * @param state
     * @param menu
     */
    setTag: (state, menu) => {
      if (state.hidden === 0) {
        if (menu.name === 'welcome') {
          menu.title = '欢迎'
        }
        state.currentTagValue = menu.name
        localStorage.setItem('current_tag_name', menu.name)
      }
      const tags = state.dynamicTags.some((item) => item.name === menu.name)
      if (tags) {
        return
      }
      state.dynamicTags.push(menu)
    },
    /**
     * 设置当前的Tag名称
     *
     * @param state
     * @param name
     */
    setCurrentTagValue: (state, name) => {
      localStorage.setItem('current_tag_name', name)
      state.currentTagValue = name
    }
  },
  actions: {},
  getters: {
    /**
     * 获取当前的Tag名称
     *
     * @param state
     */
    getCurrentTagValue (state) {
      return state.currentTabValue
    }
  }
}
