import axios from 'axios'
import { Loading, Message } from 'element-ui'
import { reLoginConfirm, showErrorMsg, showWaringMsg } from '@/utils/constant'

let loadingInstance = {}

/**
 * 服务的路径
 *
 * @type {string}
 */
export const servicePath = {
  sys: '',
  process: ''
}

/**
 * 创建的实例返回一个对象,实例对象
 */
export const request = axios.create({
  // 请求路径，基础接口路径 请求 9000 时经过/dev-api相当于请求 http://localhost:9000
  baseURL: process.env.VUE_APP_BASE_API,
  // 请求超时时间
  timeout: 30000
})

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
  config.headers.B_TENANT_ID = localStorage.getItem('B_TENANT_ID')

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
 *   code: 0 , 1 , 2 , 500
 *   0: 业务错误失败
 *   1: **请求成功**
 *   2: 业务逻辑验证警告 请求不合法
 *   500: 系统错误，服务异常
 *
 * 响应拦截器
 */
request.interceptors.response.use((response) => {
  if (response.status && response.status === 200) {
    if (response.headers['content-disposition']) {
      response.data.originalFileName = decodeURIComponent(response.headers['original-file-name'])
      loadingInstance.close()
      return response
    }
    if (response.data.code === 2 && response.data.message) {
      // 业务逻辑验证警告
      showWaringMsg(response, response.data.message)
    } else if (response.data.code === 0 && response.data.message) {
      // 业务错误失败
      showErrorMsg(response, '系统异常')
      setTimeout(() => {
        loadingInstance.close()
      }, 2000)
      return Promise.reject(response)
    } else if (response.data.code === 500) {
      // 系统错误
      showErrorMsg(response, '服务异常')
      setTimeout(() => {
        loadingInstance.close()
      }, 2000)
      return Promise.reject(response)
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
    loadingInstance.close()
    return
  } else if (error.response.status === 403) {
    showErrorMsg(error.response, error.response.data.message)
    reLoginConfirm()
    return
  }
  console.error(error.response.status)
  loadingInstance.close()
  return Promise.reject(error)
})
