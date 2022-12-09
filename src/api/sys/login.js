import { request, servicePath } from '@/utils/axios'

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

export function logout (username) {
  return request({
    url: servicePath.system + '/breeze/logout',
    method: 'get',
    params: username
  })
}
