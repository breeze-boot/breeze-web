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
    url: servicePath.quartz + '/job',
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
    url: servicePath.quartz + '/job',
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
    url: servicePath.quartz + '/job',
    method: 'post',
    data: data
  })
}

/**
 * 修改
 *
 * @returns {AxiosPromise}
 */
export function modify (data) {
  return request({
    url: servicePath.quartz + '/job',
    method: 'put',
    data: data
  })
}

/**
 * 运行一次
 *
 * @param id
 * @returns {AxiosPromise}
 */
export function runJobNow (id) {
  return request({
    url: servicePath.quartz + '/job/runJobNow',
    method: 'get',
    params: {
      jobId: id
    }
  })
}

/**
 * 开启暂停
 *
 * @param jobId
 * @param status
 * @returns {AxiosPromise}
 */
export function open (jobId, status) {
  return request({
    url: servicePath.quartz + '/job/open',
    method: 'put',
    params: {
      jobId: jobId,
      status: status
    }
  })
}
