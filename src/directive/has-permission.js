import Vue from 'vue'

/**
 * 权限指令
 *
 * @type {DirectiveOptions}
 */
const has = Vue.directive('has', {
  inserted: function (el, binding) {
    const { value } = binding
    if (!isHasPer(value)) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
})

/**
 * 权限检查方法
 *
 * @param array
 * @returns {boolean}
 */
const isHasPer = (array) => {
  // 获取用户按钮权限
  const permissionsStr = localStorage.getItem('authorities')
  if (!permissionsStr) {
    return false
  }
  const permissionsArray = permissionsStr.split(',')
  if (permissionsArray.length < array.length) {
    return false
  }
  for (let i = 0; i < array.length; i++) {
    if (!permissionsArray.includes(array[i])) return false
  }
  return true
}

export { has }
