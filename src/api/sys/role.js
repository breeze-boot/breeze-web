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
    url: servicePath.system + '/sys/role/list',
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
export function listRolesPermission (roleId) {
  return request({
    url: servicePath.system + '/sys/role/listRolesPermission',
    method: 'get',
    params: { roleId: roleId },
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
    url: servicePath.system + '/sys/role/editPermission',
    method: 'put',
    data: data
  })
}

/**
 * 添加
 * @returns {AxiosPromise}
 */
export function save (data) {
  return request({
    url: servicePath.system + '/sys/role/save',
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
export function del (ids) {
  return request({
    url: servicePath.system + '/sys/role/delete',
    method: 'delete',
    data: ids
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
    url: servicePath.system + '/sys/role/modify',
    method: 'put',
    data: data
  })
}
