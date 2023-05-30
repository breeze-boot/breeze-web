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
    url: servicePath.flow + '/category/list',
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
    url: servicePath.flow + '/category/delete',
    method: 'delete',
    data: ids
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
    url: servicePath.flow + '/category/create',
    method: 'post',
    data: data
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
    url: servicePath.flow + '/category/modify',
    method: 'put',
    data: data
  })
}

/**
 * 校验流程分类编码是否重复
 *
 * @param categoryCode
 * @param categoryId
 * @returns {AxiosPromise}
 */
export function checkCategoryCode (categoryCode, categoryId) {
  return request({
    url: servicePath.flow + '/category/checkCategoryCode',
    method: 'get',
    params: {
      categoryId: categoryId || '',
      categoryCode: categoryCode
    }
  })
}
