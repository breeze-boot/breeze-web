import request from '@/utils/axios'
import JSONBigInt from 'json-bigint'

/**
 * 初始化菜单
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function menuTree () {
  return request({
    url: '/admin/sys/menu/menuTree',
    method: 'get',
    params: { platformCode: 'managementCenter' }
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
export function del (data) {
  return request({
    url: '/admin/sys/menu/delete',
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
    url: '/admin/sys/menu/update',
    method: 'put',
    data: data
  })
}
