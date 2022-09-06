import request from '@/utils/axios'
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
    url: '/admin/sys/menu/listTreeMenu',
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
    url: '/admin/sys/menu/listTreePermission',
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
    url: '/admin/sys/menu/list',
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
    url: '/admin/sys/menu/save',
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
export function del (id) {
  return request({
    url: '/admin/sys/menu/delete',
    method: 'delete',
    params: { id: id }
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
    url: '/admin/sys/menu/update',
    method: 'put',
    data: data
  })
}
