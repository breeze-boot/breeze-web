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
    url: servicePath.system + '/sys/msg/list',
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
 * @returns {AxiosPromise}
 */
export function del (ids) {
  return request({
    url: servicePath.system + '/sys/msg/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 新增
 *
 * @returns {AxiosPromise}
 */
export function save (data) {
  return request({
    url: servicePath.system + '/sys/msg/save',
    method: 'post',
    data: data
  })
}

/**
 * 修改
 *
 * @returns {AxiosPromise}
 */
export function modify (data) {
  return request({
    url: servicePath.system + '/sys/msg/modify',
    method: 'put',
    data: data
  })
}

/**
 * 用户列表
 *
 * @returns {AxiosPromise}
 */
export function selectUser () {
  return request({
    url: servicePath.system + '/sys/common/selectUser',
    method: 'get',
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}

/**
 * 部门下的用户列表
 *
 * @returns {AxiosPromise}
 */
export function listUserByDeptId (data) {
  return request({
    url: servicePath.system + '/sys/user/listUserByDeptId',
    method: 'post',
    data: data,
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}
