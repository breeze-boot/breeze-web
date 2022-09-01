import request from '@/utils/axios'
import JSONBigInt from 'json-bigint'

/**
 * 列表
 *
 * @returns {AxiosPromise}
 */
export function list (params) {
  return request({
    url: '/admin/sys/role/list',
    method: 'post',
    data: params,
    transformResponse: [(data) => {
      return JSONBigInt.parse(data)
    }]
  })
}

/**
 * 添加
 * @returns {AxiosPromise}
 */
export function add (params) {
  return request({
    url: '/admin/sys/role/save',
    method: 'post',
    data: params
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
    url: '/admin/sys/role/delete',
    method: 'delete',
    data: params
  })
}

/**
 * 修改
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function edit (params) {
  return request({
    url: '/admin/sys/role/update',
    method: 'put',
    data: params
  })
}
