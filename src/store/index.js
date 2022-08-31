import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    editableTabsValue: 'welcome',
    editableTabs: [
      {
        title: '欢迎',
        name: 'welcome'
      }
    ],
    menus: [],
    breads: [],
    isCollapse: false,
    isLoadMenu: false
  },
  getters: {},
  mutations: {
    setMenus (state, menus) {
      state.menus = menus
    },
    setCollapse (state, isCollapse) {
      state.isCollapse = isCollapse
    },
    isLoadMenu (state, isLoadMenu) {
      state.isLoadMenu = isLoadMenu
    },
    addTab (state, menu) {
      if (menu.name === 'welcome') {
        menu.title = '欢迎'
      }
      state.editableTabsValue = menu.name
      const result = state.editableTabs.filter((item) => {
        return item.name === menu.name
      }).length > 0
      if (result) {
        return
      }
      state.editableTabs.push({
        title: menu.title,
        name: menu.name
      })
    },
    clearTab (state) {
      state.editableTabs = []
      state.editableTabsValue = 'welcome'
      state.editableTabs = [
        {
          title: '欢迎',
          name: 'welcome'
        }
      ]
    }
  },
  actions: {},
  modules: {}
})
