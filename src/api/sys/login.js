import { request, servicePath } from '@/utils/axios'

export function jwtLogin (data) {
  const dataObj = {
    username: data.username,
    password: data.password
  }

  return request({
    url: servicePath.system + '/jwt/login',
    method: 'post',
    data: dataObj
  })
}
