import { request } from '@/axios'

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
    url: '/breeze/login',
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
    url: '/breeze/logout',
    method: 'get',
    params: username
  })
}
