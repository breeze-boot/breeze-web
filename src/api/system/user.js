import { request, servicePath } from '@/utils/axios'

/**
 * 列表
 *
 * @returns {AxiosPromise}
 */
export function list (data) {
  return request({
    url: servicePath.system + '/sys/user/list',
    method: 'post',
    data: data
  })
}

/**
 * 删除
 *
 * @returns {AxiosPromise}
 */
export function del (data) {
  return request({
    url: servicePath.system + '/sys/user/delete',
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
    url: servicePath.system + '/sys/user/save',
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
    url: servicePath.system + '/sys/user/edit',
    method: 'put',
    data: data
  })
}

/**
 * 详情
 *
 * @returns {AxiosPromise}
 */
export function info (id) {
  return request({
    url: servicePath.system + '/sys/user/info/' + id,
    method: 'get'
  })
}

/**
 * 修改
 *
 * @returns {AxiosPromise}
 */
export function resetPass (data) {
  return request({
    url: servicePath.system + '/sys/user/resetPass',
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
    url: servicePath.system + '/sys/user/open',
    method: 'put',
    data: data
  })
}

/**
 * 用户分配角色
 * @returns {AxiosPromise}
 */
export function userAddRole (data) {
  return request({
    url: servicePath.system + '/sys/user/userAddRole',
    method: 'put',
    data: data
  })
}
