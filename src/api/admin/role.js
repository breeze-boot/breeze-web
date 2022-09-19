import { request, servicePath } from '@/utils/axios'
import JSONBigInt from 'json-bigint'

/**
 * 列表
 *
 * @returns {AxiosPromise}
 */
export function list (data) {
  return request({
    url: servicePath.admin + '/sys/role/list',
    method: 'post',
    data: data,
    transformResponse: [(data) => {
      return JSONBigInt.parse(data)
    }]
  })
}

/**
 * 角色权限获取
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function listRolesPermission (roleId) {
  return request({
    url: servicePath.admin + '/sys/role/listRolesPermission',
    method: 'get',
    params: { roleId: roleId }
  })
}

/**
 * 角色权限获取
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function editPermission (data) {
  return request({
    url: servicePath.admin + '/sys/role/editPermission',
    method: 'put',
    data: data
  })
}

/**
 * 添加
 * @returns {AxiosPromise}
 */
export function add (data) {
  return request({
    url: servicePath.admin + '/sys/role/save',
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
    url: servicePath.admin + '/sys/role/delete',
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
    url: servicePath.admin + '/sys/role/update',
    method: 'put',
    data: data
  })
}
