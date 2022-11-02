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
    url: servicePath.system + '/sys/permission/list',
    method: 'post',
    data: data,
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}

/**
 * 角色权限获取
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function listPermission (permissionId) {
  return request({
    url: servicePath.system + '/sys/permission/listPermission',
    method: 'get',
    params: { permissionId: permissionId },
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
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
    url: servicePath.system + '/sys/permission/editPermission',
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
    url: servicePath.system + '/sys/permission/save',
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
    url: servicePath.system + '/sys/permission/delete',
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
    url: servicePath.system + '/sys/permission/edit',
    method: 'put',
    data: data
  })
}
