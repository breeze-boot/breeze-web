import { request, servicePath } from '@/axios'

/**
 * 用户密码登录
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function login (data) {
  const dataObj = {
    username: data.username,
    password: data.password
  }
  return request({
    url: servicePath.system + '/breeze/login',
    method: 'post',
    data: dataObj
  })
}

/**
 * 手机验证码登录
 *
 * @param {{code, phone: string}} data
 * @returns {AxiosPromise}
 */
export function sms (data) {
  const dataObj = {
    phone: data.phone,
    code: data.code
  }
  return request({
    url: servicePath.system + '/breeze/sms',
    method: 'post',
    data: dataObj
  })
}

/**
 * 登出
 *
 * @param username
 * @returns {AxiosPromise}
 */
export function logout (username) {
  return request({
    url: servicePath.system + '/breeze/logout',
    method: 'get',
    params: username
  })
}

/**
 * gitee登录
 *
 * @param {string} appName
 * @returns {AxiosPromise}
 */
export function authUrl (appName) {
  return request({
    url: servicePath.system + '/breeze/auth/url/' + appName,
    method: 'get'
  })
}

/**
 * 三方登录后获取用户信息
 *
 * @returns {AxiosPromise}
 */
export function userInfo () {
  return request({
    url: servicePath.system + '/user/userInfo',
    method: 'get'
  })
}
