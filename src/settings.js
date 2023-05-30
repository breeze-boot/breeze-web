/**
 * 服务的路径
 *
 * @type {string}
 */
const bootPath = {
  auth: '',
  system: '',
  quartz: '',
  flow: ''
}
/**
 * 服务的路径
 *
 * @type {string}
 */
const cloudPath = {
  auth: '/auth',
  system: '/system',
  quartz: '/quartz',
  flow: '/flow'
}

module.exports = {

  /**
   * 是否显示logo
   */
  hasLogo: true,
  servicePath: process.env.VUE_APP_BOOT === 'cloud' ? cloudPath : bootPath,
  ws: process.env.VUE_APP_BOOT === 'cloud' ? '/websocket' : ''
}
