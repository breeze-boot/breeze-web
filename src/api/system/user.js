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
    url: servicePath.system + '/user/list',
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
    url: servicePath.system + '/user/delete',
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
    url: servicePath.system + '/user/create',
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
    url: servicePath.system + '/user/modify',
    method: 'put',
    data: data
  })
}

/**
 * 导出
 *
 * @returns {AxiosPromise}
 */
export function exportInfo () {
  return request({
    url: servicePath.system + '/user/export',
    method: 'get',
    responseType: 'blob'
  })
}

/**
 * 重置密码
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function resetPass (data) {
  return request({
    url: servicePath.system + '/user/resetPass',
    method: 'put',
    data: data
  })
}

/**
 * 锁定
 *
 * @param username
 * @param isLock
 * @returns {AxiosPromise}
 */
export function open (username, isLock) {
  return request({
    url: servicePath.system + '/user/open',
    method: 'put',
    data: {
      username: username,
      isLock: isLock
    }
  })
}

/**
 * 用户分配角色
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function userAddRole (data) {
  return request({
    url: servicePath.system + '/user/userAddRole',
    method: 'put',
    data: data
  })
}

/**
 * 角色下拉框
 *
 * @returns {AxiosPromise}
 */
export function selectRole () {
  return request({
    url: servicePath.system + '/common/selectRole',
    method: 'get',
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}

/**
 * 岗位下拉框
 *
 * @returns {AxiosPromise}
 */
export function selectPost () {
  return request({
    url: servicePath.system + '/common/selectPost',
    method: 'get',
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}

/**
 * 校验用户名是否重复
 *
 *  @param username
 *  @param userId
 * @returns {AxiosPromise}
 */
export function checkUsername (username, userId) {
  return request({
    url: servicePath.system + '/user/checkUsername',
    method: 'get',
    params: {
      userId: userId || '',
      username: username
    }
  })
}

/**
 * 详情
 *
 * @param userId
 * @returns {AxiosPromise}
 */
export function info (userId) {
  return request({
    url: servicePath.system + '/user/info/' + JSONBigInt.parse(userId),
    method: 'get',
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}
