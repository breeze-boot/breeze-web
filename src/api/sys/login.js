import { request, servicePath } from '@/utils/axios'

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
