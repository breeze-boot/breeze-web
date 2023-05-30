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
    url: servicePath.system + '/file/list',
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
    url: servicePath.system + '/file/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 下载
 *
 * @param ids
 * @returns {AxiosPromise}
 */
export function download (id) {
  return request({
    url: servicePath.system + '/file/download',
    method: 'get',
    params: { fileId: id },
    responseType: 'blob'
  })
}

/**
 * 文件上传

 * @param data
 * @returns {AxiosPromise}
 */
export function uploadMinioS3 (data) {
  return request({
    url: servicePath.system + '/file/uploadMinioS3',
    method: 'POST',
    data: data,
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}

/**
 * 图片预览
 *
 * @param id
 * @returns {AxiosPromise}
 */
export function preview (id) {
  return request({
    url: servicePath.system + '/file/preview',
    method: 'get',
    params: { fileId: id }
  })
}
