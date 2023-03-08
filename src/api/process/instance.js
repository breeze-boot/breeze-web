import { request, servicePath } from '@/utils/axios'
import JSONBigInt from 'json-bigint'

const JSONBigInt2Str = JSONBigInt({ storeAsString: true })

/**
 * 发起流程
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function startProcess (data) {
  return request({
    url: servicePath.system + '/process/instance/startProcess',
    method: 'post',
    data: data,
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}

/**
 * 列表
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function list (data) {
  return request({
    url: servicePath.system + '/process/instance/list',
    method: 'post',
    data: data,
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}

/**
 * 列表
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function del (id) {
  return request({
    url: servicePath.system + '/process/instance/delete',
    method: 'delete',
    params: id
  })
}
