import { request, servicePath } from '@/utils/axios'
import JSONBigInt from 'json-bigint'

const JSONBigInt2Str = JSONBigInt({ storeAsString: true })

/**
 * 列表
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function listDept (data) {
  return request({
    url: servicePath.system + '/sys/dept/list',
    method: 'post',
    data: data,
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}

/**
 * 添加
 * @returns {AxiosPromise}
 */
export function add (data) {
  return request({
    url: servicePath.system + '/sys/dept/save',
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
    url: servicePath.system + '/sys/dept/delete',
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
export function edit (data) {
  return request({
    url: servicePath.system + '/sys/dept/edit',
    method: 'put',
    data: data
  })
}

/**
 * 部门下拉框
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function selectDept (id) {
  return request({
    url: servicePath.system + '/sys/common/selectDept',
    method: 'get',
    params: { id: id },
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}
