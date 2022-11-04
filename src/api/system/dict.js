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
    url: servicePath.system + '/sys/dict/list',
    method: 'post',
    data: data,
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}

/**
 * 添加
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function add (data) {
  return request({
    url: servicePath.system + '/sys/dict/save',
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
export function del (ids) {
  return request({
    url: servicePath.system + '/sys/dict/delete',
    method: 'delete',
    data: ids
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
    url: servicePath.system + '/sys/dict/edit',
    method: 'put',
    data: data
  })
}

/**
 * 开关
 * @returns {AxiosPromise}
 */
export function open (data) {
  return request({
    url: servicePath.system + '/sys/dict/open',
    method: 'put',
    data: data
  })
}

/**
 * 列表
 *
 * @returns {AxiosPromise}
 */
export function listDictItem (data) {
  return request({
    url: servicePath.system + '/sys/dictItem/list',
    method: 'post',
    data: data,
    // `transformResponse` 在传递给 then/catch 前，允许修改响应数据 注意 network中依然是丢失精度的数字，接收到数据后转换成的String
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}

/**
 * 添加
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function addDictItem (data) {
  return request({
    url: servicePath.system + '/sys/dictItem/save',
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
export function delDictItem (ids) {
  return request({
    url: servicePath.system + '/sys/dictItem/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 修改
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function editDictItem (data) {
  return request({
    url: servicePath.system + '/sys/dictItem/edit',
    method: 'put',
    data: data
  })
}
