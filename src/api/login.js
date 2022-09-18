import { servicePath, request } from '@/utils/axios'

export function jwtToken (data) {
  const dataObj = {
    username: data.username,
    password: data.password
  }

  return request({
    url: servicePath.admin + '/token',
    method: 'post',
    data: dataObj
  })
}
