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
    url: servicePath.system + '/sys/dataPermission/list',
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
export function listPermission (dataPermissionId) {
  return request({
    url: servicePath.system + '/sys/dataPermission/listPermission',
    method: 'get',
    params: { dataPermissionId: dataPermissionId },
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
    url: servicePath.system + '/sys/dataPermission/editPermission',
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
    url: servicePath.system + '/sys/dataPermission/create',
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
    url: servicePath.system + '/sys/dataPermission/delete',
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
    url: servicePath.system + '/sys/dataPermission/modify',
    method: 'put',
    data: data
  })
}

/**
 *查询表名
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function selectTable () {
  return request({
    url: servicePath.system + '/sys/common/selectTable',
    method: 'get'
  })
}

/**
 * 查询列名
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function selectColumn (tableName) {
  return request({
    url: servicePath.system + '/sys/common/selectColumn',
    method: 'get',
    params: { tableName: tableName }
  })
}
