import request from '@/utils/axios'
import JSONBigInt from 'json-bigint'

/**
 * 列表
 *
 * @returns {AxiosPromise}
 */
export function list (data) {
  return request({
    url: '/admin/sys/dict/list',
    method: 'post',
    data: data,
    transformResponse: [(data) => {
      return JSONBigInt.parse(data)
    }]
  })
}

/**
 * 添加
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function add (data) {
  return request({
    url: '/admin/sys/dict/save',
    method: 'post',
    data: data
  })
}

/**
 * 删除
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function del (data) {
  return request({
    url: '/admin/sys/dict/delete',
    method: 'delete',
    data: data
  })
}

/**
 * 修改
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function edit (data) {
  return request({
    url: '/admin/sys/dict/update',
    method: 'put',
    data: data
  })
}

/**
 * 开关
 * @returns {AxiosPromise}
 */
export function open (data) {
  return request({
    url: '/admin/sys/dict/open',
    method: 'put',
    data: data
  })
}
