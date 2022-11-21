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
export function download (id) {
  return request({
    url: servicePath.system + '/sys/file/download',
    method: 'get',
    params: { fileId: id },
    responseType: 'blob'
  })
}

/**
 * 文件上传
 *
 * @returns {AxiosPromise}
 */
export function upload (data) {
  return request({
    url: servicePath.system + '/sys/file/upload',
    method: 'POST',
    data: data
  })
}

/**
 * 图片预览
 *
 * @returns {AxiosPromise}
 */
export function preview (id) {
  return request({
    url: servicePath.system + '/sys/file/preview',
    method: 'get',
    params: { fileId: id }
  })
}
