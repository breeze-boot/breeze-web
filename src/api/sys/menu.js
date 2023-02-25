import { request, servicePath } from '@/utils/axios'
import JSONBigInt from 'json-bigint'

const JSONBigInt2Str = JSONBigInt({ storeAsString: true })

/**
 * 初始化菜单
 *
 * @param params
 * @returns {AxiosPromise}
 */
export function listTreeMenu (params) {
  return request({
    url: servicePath.system + '/sys/menu/listTreeMenu',
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
 * @param data
 * @returns {AxiosPromise}
 */
export function list (data) {
  return request({
    url: servicePath.system + '/sys/menu/list',
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
    url: servicePath.system + '/sys/menu/create',
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
    url: servicePath.system + '/sys/menu/delete',
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
    url: servicePath.system + '/sys/menu/modify',
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
    url: servicePath.system + '/sys/common/selectMenu',
    method: 'get',
    params: { id: id },
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
    url: servicePath.system + '/sys/common/selectPlatform',
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
    url: servicePath.system + '/sys/menu/listTreePermission',
    method: 'get',
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}
