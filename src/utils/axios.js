import axios from 'axios'
import { Loading, Message } from 'element-ui'

let loadingInstance = {}

/**
 * 创建的实例返回一个对象,实例对象
 */
export const request = axios.create({
  // 请求路径，基础接口路径 请求 9000 时经过/dev-api相当于请求 http://localhost:9000
  baseURL: process.env.VUE_APP_BASE_API,
  // 请求超时时间
  timeout: 30000
})

export const showErrorMsg = (success, msg) => {
  if (success.data.message) {
    Message.error({ message: success.data.message })
  } else {
    Message.error({ message: msg })
  }
}

export const showWaringMsg = (success, msg) => {
  if (success.data.message) {
    Message.warning({ message: success.data.message })
  } else {
    Message.warning({ message: msg })
  }
}

/**
 * 服务的路径
 *
 * @type {string}
 */
export const servicePath = {
  system: ''
}

/**
 * 请求拦截器
 */
request.interceptors.request.use((config) => {
  /**
   * 如果存在token，请求携带token
   */
  if (localStorage.getItem('access_token') !== undefined) {
    config.headers.Authorization = 'Bearer ' + localStorage.getItem('access_token')
  }
  loadingInstance = Loading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  return config
}, (error) => {
  Message.error({ message: error })
})

/**
 * 响应拦截器
 */
request.interceptors.response.use((success) => {
  /**
   * 判断业务逻辑错误
   */
  if (success.status && success.status === 200) {
    if (success.data.code === 2 && success.data.message) {
      // 警告
      showWaringMsg(success, success.data.message)
    } else if (success.data.code === 0 && success.data.message) {
      // 错误
      showErrorMsg(success, '系统异常')
    } else if (success.data.code === 500) {
      console.error(success)
      showErrorMsg(success, '服务异常')
      return success.data
    }
    loadingInstance.close()
    return success.data
  }
}, (error) => {
  if (error.message.includes('timeout of')) {
    Message.error({ message: '请求超时' })
  } else if (error.response.status === 400) {
    Message.error({ message: '参数解析失败' })
  } else if (error.response.status === 404) {
    Message.error({ message: '请求地址不存在' })
  } else if (error.response.status === 401) {
    showErrorMsg(error.response, error.response.data.message)
    // TODO 重新登录
  } else if (error.response.status === 402) {
    showErrorMsg(error.response, error.response.data.message)
  }
  console.error(error.response.status)
})
