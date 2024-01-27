import { request } from '@/axios'
import JSONBigInt from 'json-bigint'
import { servicePath } from '@/settings'

const JSONBigInt2Str = JSONBigInt({ storeAsString: true })

/**
 * 初始化菜单
 *
 * @param params
 * @returns {AxiosPromise}
 */
export function listTreeMenu (params) {
  return request({
    url: servicePath.system + '/menu/listTreeMenu',
    method: 'get',
    params: params,
    // 前端处理Long类型
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}

/**
 * 列表
 *
 * @param params
 * @returns {AxiosPromise}
 */
export function list (params) {
  return request({
    url: servicePath.system + '/menu',
    method: 'get',
    params: params,
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
    url: servicePath.system + '/menu',
    method: 'post',
    data: data
  })
}

/**
 * 删除
 *
 * @param id
 * @returns {AxiosPromise}
 */
export function del (id) {
  return request({
    url: servicePath.system + '/menu',
    method: 'delete',
    data: id
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
    url: servicePath.system + '/menu',
    method: 'put',
    data: data
  })
}

/**
 * 菜单下拉框
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function selectMenu (id) {
  return request({
    url: servicePath.system + '/common/selectMenu',
    method: 'get',
    params: { id: JSONBigInt2Str.parse(id) },
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}

/**
 * 平台下拉框
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function selectPlatform () {
  return request({
    url: servicePath.system + '/common/selectPlatform',
    method: 'get',
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}

/**
 * 权限列表
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function listTreePermission () {
  return request({
    url: servicePath.system + '/menu/listTreePermission',
    method: 'get',
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}
