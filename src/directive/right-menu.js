import Vue from 'vue'
import store from '@/store'

/**
 * 菜单指令
 *
 * @type {DirectiveOptions}
 */
const rightMenu = Vue.directive('rightMenu', (el) => {
  el.oncontextmenu = function (e) {
    e.preventDefault()
    // 当 item 点击才显示
    if (!e.target.classList.contains('el-tabs__item') && !e.target.classList.contains('el-tag')) {
      return
    }
    if (e.target.id === 'tab-welcome' || e.target.id === 'welcome') {
      return
    }
    console.debug('当前的右击的tab', e.target.id)
    store.commit('rightMenu/setLeft', e.clientX + 'px')
    store.commit('rightMenu/setClickTabName', e.target.id)
    store.commit('rightMenu/setDisplay', 'block')
  }
})

export { rightMenu }
