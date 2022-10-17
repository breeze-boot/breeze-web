import Vue from 'vue'
import Icon from '@/components/svg/SvgIcon'

Vue.component('svg-icon', Icon)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)
requireAll(req)

// icons
const requireAllIcon = requireContext => requireContext.keys()
const icons = requireAllIcon(req).map(i => {
  const icon = i.match(/\.\/(.*)\.svg/)[1]
  return icon.replace('icon-', '')
})
export default icons
