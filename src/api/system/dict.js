import { request } from '@/axios'
import JSONBigInt from 'json-bigint'
import { servicePath } from '@/settings'

const JSONBigInt2Str = JSONBigInt({ storeAsString: true })

/**
 * 列表
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function list (data) {
  return request({
    url: servicePath.system + '/dict/list',
    method: 'post',
    data: data,
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}

/**
 * 新增
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function save (data) {
  return request({
    url: servicePath.system + '/dict/create',
    method: 'post',
    data: data
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
    url: servicePath.system + '/dict/delete',
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
export function modify (data) {
  return request({
    url: servicePath.system + '/dict/modify',
    method: 'put',
    data: data
  })
}

/**
 * 锁定
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function open (data) {
  return request({
    url: servicePath.system + '/dict/open',
    method: 'put',
    data: data
  })
}

/**
 * 查询字典
 *
 * @param dictCodes
 * @returns {AxiosPromise}
 */
export function listDict (dictCodes) {
  return request({
    url: servicePath.system + '/dict/listDict',
    method: 'post',
    data: dictCodes
  })
}

/**
 * 校验字典编码是否重复
 *
 * @param dictCode
 * @param dictId
 * @returns {AxiosPromise}
 */
export function checkDictCode (dictCode, dictId) {
  return request({
    url: servicePath.system + '/dict/checkDictCode',
    method: 'get',
    params: {
      dictId: dictId || '',
      dictCode: dictCode
    }
  })
}
