import Vue from 'vue'
import Icon from '@/components/svg/SvgIcon'

Vue.component('svg-icon', Icon)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)
requireAll(req)
