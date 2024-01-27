import { request } from '@/axios'
import JSONBigInt from 'json-bigint'
import { servicePath } from '@/settings'

const JSONBigInt2Str = JSONBigInt({ storeAsString: true })

/**
 * 列表
 *
 * @param params
 * @returns {AxiosPromise}
 */
export function list (params) {
  return request({
    url: servicePath.system + '/client',
    method: 'get',
    params: params,
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}

/**
 * 删除
 *
 * @param ids
 * @returns {AxiosPromise}
 */
export function del (ids) {
  return request({
    url: servicePath.system + '/client',
    method: 'delete',
    data: ids
  })
}

/**
 * 新增
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function save (data) {
  return request({
    url: servicePath.system + '/client',
    method: 'post',
    data: data
  })
}

/**
 * 修改
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function modify (data) {
  return request({
    url: servicePath.system + '/client',
    method: 'put',
    data: data
  })
}

/**
 * 重置密钥
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function resetClientSecret (data) {
  return request({
    url: servicePath.system + '/client/resetClientSecret',
    method: 'put',
    data: data
  })
}

/**
 * 详情
 *
 * @param clientId
 * @returns {AxiosPromise}
 */
export function info (clientId) {
  return request({
    url: servicePath.system + '/client/info/' + JSONBigInt.parse(clientId),
    method: 'get',
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}
