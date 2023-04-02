/**
 * 此处可直接引用自己项目封装好的 axios 配合后端联调
 */
import { request } from '@/axios'

/**
 * 获取验证图片  以及token
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function reqGet (data) {
  return request({
    url: '/captcha/getCode',
    method: 'post',
    data
  })
}

/**
 * 滑动或者点选验证
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function reqCheck (data) {
  return request({
    url: '/captcha/checkCode',
    headers: {
      token: data.token,
      pointJson: data.pointJson
    },
    method: 'post',
    data
  })
}
