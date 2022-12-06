import { request, servicePath } from '@/utils/axios'
import JSONBigInt from 'json-bigint'

const JSONBigInt2Str = JSONBigInt({ storeAsString: true })

/**
 * 列表
 *
 * @returns {AxiosPromise}
 */
export function list (data) {
  return request({
    url: servicePath.system + '/sys/tenant/list',
    method: 'post',
    data: data,
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}

/**
 * 删除
 *
 * @returns {AxiosPromise}
 */
export function del (ids) {
  return request({
    url: servicePath.system + '/sys/tenant/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 新增
 *
 * @returns {AxiosPromise}
 */
export function save (data) {
  return request({
    url: servicePath.system + '/sys/tenant/create',
    method: 'post',
    data: data
  })
}

/**
 * 修改
 *
 * @returns {AxiosPromise}
 */
export function modify (data) {
  return request({
    url: servicePath.system + '/sys/tenant/modify',
    method: 'put',
    data: data
  })
}

/**
 * 修改
 *
 * @returns {AxiosPromise}
 */
export function selectTenant (data) {
  return request({
    url: servicePath.system + '/sys/common/selectTenant',
    method: 'get',
    data: data
  })
}
