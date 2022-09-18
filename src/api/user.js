import { servicePath, request } from '@/utils/axios'
import JSONBigInt from 'json-bigint'

/**
 * 列表
 *
 * @returns {AxiosPromise}
 */
export function list (data) {
  return request({
    url: servicePath.admin + '/sys/user/list',
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
    url: servicePath.admin + '/sys/user/delete',
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
    url: servicePath.admin + '/sys/user/save',
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
    url: servicePath.admin + '/sys/user/update',
    method: 'put',
    data: data
  })
}

/**
 * 修改
 *
 * @returns {AxiosPromise}
 */
export function resetPass (data) {
  return request({
    url: servicePath.admin + '/sys/user/resetPass',
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
    url: servicePath.admin + '/sys/user/open',
    method: 'put',
    data: data
  })
}
