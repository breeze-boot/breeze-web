import { request } from '@/axios'
import JSONBigInt from 'json-bigint'
import { servicePath } from '@/settings'

const JSONBigInt2Str = JSONBigInt({ storeAsString: true })

/**
 * 列表
 *
 * @param params
 * @returns {AxiosPromise}
 */
export function list (params) {
  return request({
    url: servicePath.system + '/msgUser',
    method: 'get',
    params: params,
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
    url: servicePath.system + '/msgUser',
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
