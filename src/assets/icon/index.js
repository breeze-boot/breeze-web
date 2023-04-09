import Vue from 'vue'
import CustomIcon from '@/components/icon/CustomIcon'

Vue.component('custom-icon', CustomIcon)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)
requireAll(req)

const requireAllIcon = requireContext => requireContext.keys()
const svgIcons = requireAllIcon(req).map(i => {
  return i.match(/\.\/(.*)\.svg/)[1]
})
export default svgIcons
