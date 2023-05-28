import Vue from 'vue'
import Icon from '@/components/icon/Icon.vue'

Vue.component('Icon', Icon)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)
requireAll(req)

const requireAllIcon = requireContext => requireContext.keys()
const svgIcons = requireAllIcon(req).map(i => {
  return i.match(/\.\/(.*)\.svg/)[1]
})
export default svgIcons
