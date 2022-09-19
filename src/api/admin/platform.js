import { request, servicePath } from '@/utils/axios'
import JSONBigInt from 'json-bigint'

/**
 * 列表
 *
 * @returns {AxiosPromise}
 */
export function list (data) {
  return request({
    url: servicePath.admin + '/sys/platform/list',
    method: 'post',
    data: data,
    transformResponse: [(data) => {
      return JSONBigInt.parse(data)
    }]
  })
}

/**
 * 删除
 *
 * @returns {AxiosPromise}
 */
export function del (data) {
  return request({
    url: servicePath.admin + '/sys/platform/delete',
    method: 'delete',
    data: data
  })
}

/**
 * 新增
 *
 * @returns {AxiosPromise}
 */
export function add (data) {
  return request({
    url: servicePath.admin + '/sys/platform/save',
    method: 'post',
    data: data
  })
}

/**
 * 修改
 *
 * @returns {AxiosPromise}
 */
export function edit (data) {
  return request({
    url: servicePath.admin + '/sys/platform/update',
    method: 'put',
    data: data
  })
}
