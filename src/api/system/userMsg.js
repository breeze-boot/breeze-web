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
    url: servicePath.system + '/msgUser/list',
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
    url: servicePath.system + '/msgUser/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 关闭
 *
 * @param msgId
 * @returns {AxiosPromise}
 */
export function close (msgId) {
  return request({
    url: servicePath.system + '/msgUser/close/' + JSONBigInt.parse(msgId),
    method: 'put'
  })
}

/**
 * 标记已读
 *
 * @param msgId
 * @returns {AxiosPromise}
 */
export function read (msgId) {
  return request({
    url: servicePath.system + '/msgUser/read/' + JSONBigInt.parse(msgId),
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
    url: servicePath.system + '/msgUser/listMsgByUsername',
    method: 'get',
    params: {
      username: JSON.parse(localStorage.getItem('user_info')).username
    },
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}
