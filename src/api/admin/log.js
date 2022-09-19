import { servicePath, request } from '@/utils/axios'
import JSONBigInt from 'json-bigint'

/**
 * 列表
 *
 * @returns {AxiosPromise}
 */
export function list (params) {
  return request({
    url: servicePath.admin + '/sys/log/list',
    method: 'post',
    data: params,
    transformResponse: [(data) => {
      return JSONBigInt.parse(data)
    }]
  })
}

/**
 * 删除
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function del (params) {
  return request({
    url: servicePath.admin + '/sys/log/delete',
    method: 'delete',
    data: params
  })
}
