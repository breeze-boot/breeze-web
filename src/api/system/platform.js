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
    url: servicePath.system + '/sys/platform/list',
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
export function del (data) {
  return request({
    url: servicePath.system + '/sys/platform/delete',
    method: 'delete',
    data: data
  })
}

/**
 * 新增
 *
 * @returns {AxiosPromise}
 */
export function add (data) {
  return request({
    url: servicePath.system + '/sys/platform/save',
    method: 'post',
    data: data
  })
}

/**
 * 修改
 *
 * @returns {AxiosPromise}
 */
export function edit (data) {
  return request({
    url: servicePath.system + '/sys/platform/edit',
    method: 'put',
    data: data
  })
}
