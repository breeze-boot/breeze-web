import { request, servicePath } from '@/utils/axios'
import JSONBigInt from 'json-bigint'

const JSONBigInt2Str = JSONBigInt({ storeAsString: true })

/**
 * 列表
 * @param data
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
 * 保存
 * @param data
 * @returns {AxiosPromise}
 */
export function save (data) {
  return request({
    url: servicePath.system + '/sys/dict/save',
    method: 'post',
    data: data
  })
}

/**
 * 删除
 * @param ids
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
 * @param data
 * @returns {AxiosPromise}
 */
export function modify (data) {
  return request({
    url: servicePath.system + '/sys/dict/modify',
    method: 'put',
    data: data
  })
}

/**
 * 开关
 * @param data
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
 * 查询字典
 * @param dictCodes
 * @returns {AxiosPromise}
 */
export function listDict (dictCodes) {
  return request({
    url: servicePath.system + '/sys/dict/listDict',
    method: 'post',
    data: dictCodes
  })
}
