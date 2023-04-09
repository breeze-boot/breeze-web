import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import { getParamsAndQueryByIndex } from '@utils/common'

Vue.use(Vuex)

const defaultTab = {
  title: '欢迎',
  name: 'welcome',
  hidden: 0
}

export default {
  namespaced: true,
  state: {
    currentTab: localStorage.getItem('current_tab'),
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
     * @param tab
     */
    setTab: (state, tab) => {
      if (tab.name === 'welcome') {
        tab.title = '欢迎'
      }
      localStorage.setItem('current_tab', tab.name)
      state.currentTab = tab.name
      const tabs = state.dynamicTabs.some((item) => item.name === tab.name)
      if (tabs) {
        return
      }
      state.dynamicTabs.push(tab)
    },
    /**
     * 设置当前的tabs
     *
     * @param state
     * @param tabs
     */
    setDynamicTabs: (state, tabs) => {
      state.dynamicTabs = tabs
    },
    /**
     * 设置当前的tab
     *
     * @param state
     * @param tabs
     */
    setCurrentTab: (state, tabs) => {
      state.currentTab = tabs
    }
  },
  actions: {
    /**
     * 关闭所有tab
     *
     * @param {commit}
     */
    closeAllTab: ({
      commit
    }) => {
      router.push({ name: 'welcome' }).then(r => console.debug(r))
      commit('setCurrentTab', defaultTab.name)
      commit('setDynamicTabs', [defaultTab])
    },
    /**
     * 关闭当前Tab
     *
     * @param { state }
     * @param name
     */
    closeCurrentTab: ({
      state
    }, name) => {
      let currentIndex = state.dynamicTabs.findIndex((value) => {
        return value.name === name
      })
      state.dynamicTabs.splice(currentIndex, 1)
      if (state.dynamicTabs.length === currentIndex) {
        --currentIndex
      }
      const {
        query,
        params
      } = getParamsAndQueryByIndex(state.dynamicTabs, currentIndex)
      router.push({
        name: state.dynamicTabs[currentIndex].name,
        query: query,
        params: params
      }).then(r => console.debug(r))
    },
    /**
     * 关闭当前右边Tab
     *
     * @param {commit,state }
     * @param name
     */
    closeRightTab: ({
      commit,
      state
    }, name) => {
      const currentIndex = state.dynamicTabs.findIndex((value) => {
        return value.name === name
      })
      const tabs = []
      state.dynamicTabs.forEach((tab, index) => {
        if (currentIndex >= index) {
          tabs.push(tab)
        }
      })
      const {
        query,
        params
      } = getParamsAndQueryByIndex(state.dynamicTabs, currentIndex)
      router.push({
        name: state.dynamicTabs[currentIndex].name,
        query: query,
        params: params
      }).then(r => console.debug(r))
      commit('setDynamicTabs', tabs)
    },
    /**
     * 关闭当前左边Tab
     *
     * @param {commit,state}
     * @param name
     */
    closeLeftTab: ({
      commit,
      state
    }, name) => {
      const currentIndex = state.dynamicTabs.findIndex((value) => {
        return value.name === name
      })
      const tabs = [defaultTab]
      state.dynamicTabs.forEach((tab, index) => {
        if (currentIndex <= index) {
          tabs.push(tab)
        }
      })
      const {
        query,
        params
      } = getParamsAndQueryByIndex(state.dynamicTabs, currentIndex)
      router.push({
        name: state.dynamicTabs[currentIndex].name,
        query: query,
        params: params
      }).then(r => console.debug(r))
      commit('setDynamicTabs', tabs)
    }
  },
  getters: {
    /**
     * 获取当前的Tab
     *
     * @param state
     */
    getCurrentTab (state) {
      return state.currentTab
    },
    /**
     * 获取打开的Tab
     *
     * @param state
     */
    getDynamicTabs (state) {
      return state.dynamicTabs
    }
  }
}
