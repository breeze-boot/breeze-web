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
    url: servicePath.system + '/sys/file/list',
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
 * @returns {AxiosPromise}
 */
export function del (ids) {
  return request({
    url: servicePath.system + '/sys/file/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 下载
 *
 * @returns {AxiosPromise}
 */
export function download (ids) {
  return request({
    url: servicePath.system + '/sys/file/download',
    method: 'delete',
    data: ids
  })
}

/**
 * 文件上传
 *
 * @returns {AxiosPromise}
 */
export function upload (ids) {
  return request({
    url: servicePath.system + '/sys/file/upload',
    method: 'POST',
    data: ids
  })
}

/**
 * 图片预览
 *
 * @returns {AxiosPromise}
 */
export function preview (ids) {
  return request({
    url: servicePath.system + '/sys/file/preview',
    method: 'delete',
    data: ids
  })
}
