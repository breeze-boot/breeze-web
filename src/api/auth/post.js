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
    url: servicePath.system + '/post',
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
 * @Param ids
 * @returns {AxiosPromise}
 */
export function del (ids) {
  return request({
    url: servicePath.system + '/post',
    method: 'delete',
    data: ids
  })
}

/**
 * 新增
 *
 * @Param data
 * @returns {AxiosPromise}
 */
export function save (data) {
  return request({
    url: servicePath.system + '/post',
    method: 'post',
    data: data
  })
}

/**
 * 修改
 *
 * @Param data
 * @returns {AxiosPromise}
 */
export function modify (data) {
  return request({
    url: servicePath.system + '/post',
    method: 'put',
    data: data
  })
}

/**
 * 校验岗位编码是否重复
 *
 * @param postCode
 * @param postId
 * @returns {AxiosPromise}
 */
export function checkPostCode (postCode, postId) {
  return request({
    url: servicePath.system + '/post/checkPostCode',
    method: 'get',
    params: {
      postId: postId || '',
      postCode: postCode
    }
  })
}
