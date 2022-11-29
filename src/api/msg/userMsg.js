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
    url: servicePath.system + '/sys/userMsg/list',
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
    url: servicePath.system + '/sys/userMsg/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 关闭
 *
 * @returns {AxiosPromise}
 */
export function close (data) {
  return request({
    url: servicePath.system + '/sys/userMsg/close',
    method: 'put',
    data: data
  })
}

/**
 * 标记已读
 *
 * @returns {AxiosPromise}
 */
export function read (data) {
  return request({
    url: servicePath.system + '/sys/userMsg/read',
    method: 'put',
    data: data
  })
}
