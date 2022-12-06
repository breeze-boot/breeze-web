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
  timeout: 30000,
  headers: {
    B_TENANT_ID: localStorage.getItem('B_TENANT_ID') || '1'
  }
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
  const authorization = localStorage.getItem('access_token')
  /**
   * 如果存在token，请求携带token
   */
  if (authorization) {
    config.headers.Authorization = 'Bearer ' + authorization
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
request.interceptors.response.use((response) => {
  if (response.status && response.status === 200) {
    if (response.headers['content-disposition']) {
      response.data.originalFileName = response.headers['original-file-name']
      loadingInstance.close()
      return response
    }
    if (response.data.code === 2 && response.data.message) {
      // 警告
      showWaringMsg(response, response.data.message)
    } else if (response.data.code === 0 && response.data.message) {
      // 错误
      showErrorMsg(response, '系统异常')
    } else if (response.data.code === 500) {
      console.error(response)
      showErrorMsg(response, '服务异常')
      return response.data
    }
    loadingInstance.close()
    return response.data
  }
}, (error) => {
  if (error.message.includes('Unexpected')) {
    Message.error({ message: '连接服务被拒绝' })
  } else if (error.message.includes('timeout')) {
    Message.error({ message: '请求超时' })
  } else if (error.response.status === 400) {
    Message.error({ message: '参数解析失败' })
  } else if (error.response.status === 404) {
    Message.error({ message: '请求地址不存在' })
  } else if (error.response.status === 401) {
    showErrorMsg(error.response, error.response.data.message)
    // TODO 重新登录
  } else if (error.response.status === 403) {
    showErrorMsg(error.response, error.response.data.message)
  }
  console.error(error.response.status)
})
