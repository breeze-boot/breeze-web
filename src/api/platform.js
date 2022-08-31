import request from '@/utils/axios'
import JSONBigInt from 'json-bigint'

/**
 * 列表
 *
 * @returns {AxiosPromise}
 */
export function list (params) {
  return request({
    url: '/admin/sys/platform/list',
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
 * @returns {AxiosPromise}
 */
export function del (params) {
  return request({
    url: '/admin/sys/platform/delete',
    method: 'delete',
    data: params
  })
}

/**
 * 新增
 *
 * @returns {AxiosPromise}
 */
export function add (params) {
  return request({
    url: '/admin/sys/platform/save',
    method: 'post',
    data: params
  })
}

/**
 * 修改
 *
 * @returns {AxiosPromise}
 */
export function edit (params) {
  return request({
    url: '/admin/sys/platform/update',
    method: 'put',
    data: params
  })
}
