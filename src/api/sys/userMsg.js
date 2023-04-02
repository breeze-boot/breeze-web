import { request, servicePath } from '@/axios'
import JSONBigInt from 'json-bigint'

const JSONBigInt2Str = JSONBigInt({ storeAsString: true })

/**
 * 列表
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function list (data) {
  return request({
    url: servicePath.sys + '/userMsg/list',
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
 * @param ids
 * @returns {AxiosPromise}
 */
export function del (ids) {
  return request({
    url: servicePath.sys + '/userMsg/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 关闭
 *
 * @param msgCode
 * @returns {AxiosPromise}
 */
export function close (msgCode) {
  return request({
    url: servicePath.sys + '/userMsg/close/' + msgCode,
    method: 'put'
  })
}

/**
 * 标记已读
 *
 * @param msgCode
 * @returns {AxiosPromise}
 */
export function read (msgCode) {
  return request({
    url: servicePath.sys + '/userMsg/read/' + msgCode,
    method: 'put'
  })
}

/**
 * 获取消息
 *
 * @returns {AxiosPromise}
 */
export function listMsgByUsername () {
  return request({
    url: servicePath.sys + '/userMsg/listMsgByUsername',
    method: 'get',
    params: {
      username: JSON.parse(localStorage.getItem('user_info')).username
    }
  })
}
