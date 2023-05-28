import { request, servicePath } from '@/axios'

/**
 * oauth2.0登录
 *
 * @param params    登录参数
 * @param grantType 认证类型
 * @returns {AxiosPromise}
 */
export function oauthLogin (params, grantType) {
  return request({
    url: servicePath.auth + '/oauth2/token?grant_type=' + grantType,
    method: 'post',
    params: {
      ...params,
      scope: 'user_info'
    },
    headers: {
      Authorization: 'Basic YnJlZXplOmJyZWV6ZQ=='
    }
  })
}

/**
 * 登出
 *
 * @returns {AxiosPromise}
 */
export function logout () {
  return request({
    url: servicePath.auth + '/logout',
    method: 'get'
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
    url: servicePath.auth + '/breeze/auth/url/' + appName,
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
    url: servicePath.auth + '/user/userInfo',
    method: 'get'
  })
}

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
