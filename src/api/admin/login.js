import { request, servicePath } from '@/utils/axios'

export function jwtToken (data) {
  const dataObj = {
    username: data.username,
    password: data.password
  }

  return request({
    url: servicePath.admin + '/jwt/login',
    method: 'post',
    data: dataObj
  })
}
