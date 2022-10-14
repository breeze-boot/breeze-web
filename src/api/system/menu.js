import { request, servicePath } from '@/utils/axios'
import JSONBigInt from 'json-bigint'

const JSONBigInt2Str = JSONBigInt({ storeAsString: true })

/**
 * 初始化菜单
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function listTreeMenu (params) {
  return request({
    url: servicePath.system + '/sys/menu/listTreeMenu',
    method: 'get',
    params: params,
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
    url: servicePath.system + '/sys/menu/listTreePermission',
    method: 'get',
    transformResponse: [(data) => {
      return JSONBigInt.parse(data)
    }]
  })
}

/**
 * 列表
 *
 * @returns {AxiosPromise}
 */
export function list (data) {
  return request({
    url: servicePath.system + '/sys/menu/list',
    method: 'post',
    data: data,
    transformResponse: [(data) => {
      return JSONBigInt.parse(data)
    }]
  })
}

/**
 * 添加
 * @returns {AxiosPromise}
 */
export function add (data) {
  return request({
    url: servicePath.system + '/sys/menu/save',
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
    url: servicePath.system + '/sys/menu/delete',
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
    url: servicePath.system + '/sys/menu/update',
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
export function selectMenu () {
  return request({
    url: servicePath.system + '/sys/open/selectMenu',
    method: 'get',
    transformResponse: [(data) => {
      return JSONBigInt.parse(data)
    }]
  })
}
