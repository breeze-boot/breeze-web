import { request, servicePath } from '@/axios'
import JSONBigInt from 'json-bigint'

const JSONBigInt2Str = JSONBigInt({ storeAsString: true })

/**
 * 列表
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function list (data) {
  return request({
    url: servicePath.sys + '/dataPermission/list',
    method: 'post',
    data: data,
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}

/**
 * 添加
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function save (data) {
  return request({
    url: servicePath.sys + '/dataPermission/create',
    method: 'post',
    data: data
  })
}

/**
 * 删除
 *
 * @param ids
 * @returns {AxiosPromise}
 */
export function del (ids) {
  return request({
    url: servicePath.sys + '/dataPermission/delete',
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
    url: servicePath.sys + '/dataPermission/modify',
    method: 'put',
    data: data
  })
}

/**
 * 查询表名
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function selectTable () {
  return request({
    url: servicePath.sys + '/common/selectTable',
    method: 'get'
  })
}

/**
 * 查询列名
 *
 * @param tableName
 * @returns {AxiosPromise}
 */
export function selectColumn (tableName) {
  return request({
    url: servicePath.sys + '/common/selectColumn',
    method: 'get',
    params: { tableName: tableName }
  })
}

/**
 * 数据权限下拉框
 *
 * @returns {AxiosPromise}
 */
export function selectDataPermission () {
  return request({
    url: servicePath.sys + '/common/selectDataPermission',
    method: 'get',
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}

/**
 * 修改数据权限
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function editRoleDataPermission (data) {
  return request({
    url: servicePath.sys + '/dataPermission/editRoleDataPermission',
    method: 'post',
    data: data
  })
}

/**
 * 获取数据权限
 *
 * @param dataPermissionId
 * @returns {AxiosPromise}
 */
export function listPermission (dataPermissionId) {
  return request({
    url: servicePath.sys + '/dataPermission/listPermission',
    method: 'get',
    params: { dataPermissionId: dataPermissionId },
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}

/**
 * 修改数据权限
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function editPermission (data) {
  return request({
    url: servicePath.sys + '/dataPermission/editPermission',
    method: 'put',
    data: data
  })
}
