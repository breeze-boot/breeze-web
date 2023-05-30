import { request } from '@/axios'
import JSONBigInt from 'json-bigint'
import { servicePath } from '@/settings'

const JSONBigInt2Str = JSONBigInt({ storeAsString: true })

/**
 * 列表
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function list (data) {
  return request({
    url: servicePath.system + '/tenant/list',
    method: 'post',
    data: data,
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
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
    url: servicePath.system + '/tenant/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 新增
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function save (data) {
  return request({
    url: servicePath.system + '/tenant/create',
    method: 'post',
    data: data
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
    url: servicePath.system + '/tenant/modify',
    method: 'put',
    data: data
  })
}

/**
 * 系统租户下拉框
 *
 * @returns {AxiosPromise}
 */
export function selectTenant () {
  return request({
    url: servicePath.system + '/common/selectTenant',
    method: 'get'
  })
}

/**
 * 校验租户编码是否重复
 *
 * @param tenantCode
 * @param tenantId
 * @returns {AxiosPromise}
 */
export function checkTenantCode (tenantCode, tenantId) {
  return request({
    url: servicePath.system + '/tenant/checkTenantCode',
    method: 'get',
    params: {
      tenantId: tenantId || '',
      tenantCode: tenantCode
    }
  })
}
