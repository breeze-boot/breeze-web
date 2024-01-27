import axios from 'axios'
import { Message } from 'element-ui'
import { reLoginConfirm } from '@utils/common'

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
  config.headers.tenantId = localStorage.getItem('X-TENANT-ID') || ''
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
      response.data.fileName = decodeURIComponent(response.headers['content-disposition'].replaceAll('attachment;filename*=utf-8', ''))
      response.data.contentType = response.headers['content-type']
      return response
    }
    if (response.data.code === '0001' && response.data.message) {
      // 业务逻辑验证警告
      Message.warning({ message: response.data.message })
    } else if (response.data.code === '0002') {
      // 系统错误
      Message.warning({ message: response.data.message || '服务异常' })
      setTimeout(() => {
      }, 2000)
      return Promise.reject(response)
    }
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
    Message.error({ message: 'token过期' })
    reLoginConfirm()
    return
  } else if (error.response.status === 403) {
    Message.error({ message: error.data.message || '无权限' })
    reLoginConfirm()
    return
  } else if (error.response.status === 503) {
    Message.error({ message: error.data.message || '服务不存在' })
    return
  }
  console.error(error.response.status)
  return Promise.reject(error)
})
