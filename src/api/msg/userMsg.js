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
export function close (msgCode) {
  return request({
    url: servicePath.system + '/sys/userMsg/close/' + msgCode,
    method: 'put'
  })
}

/**
 * 标记已读
 *
 * @returns {AxiosPromise}
 */
export function read (msgCode) {
  return request({
    url: servicePath.system + '/sys/userMsg/read/' + msgCode,
    method: 'put'
  })
}
