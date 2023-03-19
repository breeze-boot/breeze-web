import { request, servicePath } from '@/utils/axios'
import JSONBigInt from 'json-bigint'

const JSONBigInt2Str = JSONBigInt({ storeAsString: true })

/**
 * 新增
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function deploy (data) {
  return request({
    url: servicePath.process + '/definition/deploy',
    method: 'post',
    data: data
  })
}

/**
 * 列表
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function list (data) {
  return request({
    url: servicePath.process + '/definition/list',
    method: 'post',
    data: data,
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}

/**
 * 获取流程定义XML
 *
 * @param processKey
 * @returns {AxiosPromise}
 */
export function listVersion (data) {
  return request({
    url: servicePath.process + '/definition/listVersion',
    method: 'post',
    data: data
  })
}

/**
 * 获取流程定义XML
 *
 * @param processKey
 * @param tenantId
 * @returns {AxiosPromise}
 */
export function getProcessDefinitionXml (processKey, tenantId) {
  return request({
    url: servicePath.process + '/definition/getProcessDefinitionXml',
    method: 'get',
    params: {
      processKey: processKey,
      tenantId: tenantId
    }
  })
}

/**
 * 获取流程定义XML
 *
 * @param processDefinitionId`
 * @param tenantId
 * @returns {AxiosPromise}
 */
export function getVersionProcessDefinitionXml (processDefinitionId, tenantId) {
  return request({
    url: servicePath.process + '/definition/getVersionProcessDefinitionXml',
    method: 'get',
    params: {
      processDefinitionId: processDefinitionId,
      tenantId: tenantId
    }
  })
}

/**
 * 获取流程定义图片
 *
 * @param processKey
 * @param tenantId
 * @returns {AxiosPromise}
 */
export function getProcessDefinitionPng (processKey, tenantId) {
  return request({
    url: servicePath.process + '/definition/getProcessDefinitionPng',
    method: 'get',
    params: {
      processKey: processKey,
      tenantId: tenantId
    }
  })
}

/**
 * 获取各个版本流程定义图片
 *
 * @param processDefinitionId
 * @param tenantId
 * @returns {AxiosPromise}
 */
export function getVersionProcessDefinitionPng (processDefinitionId, tenantId) {
  return request({
    url: servicePath.process + '/definition/getVersionProcessDefinitionPng',
    method: 'get',
    params: {
      processDefinitionId: processDefinitionId,
      tenantId: tenantId
    }
  })
}

/**
 * 删除
 *
 * @param ids
 * @returns {AxiosPromise}
 */
export function del (deploymentId) {
  return request({
    url: servicePath.process + '/definition/delete',
    method: 'delete',
    params: {
      deploymentId: deploymentId,
      cascade: true
    }
  })
}

/**
 * 修改
 *
 * @returns {AxiosPromise}
 */
export function modify (data) {
  return request({
    url: servicePath.process + '/definition/modify',
    method: 'put',
    data: data
  })
}

/**
 * 挂起/开启
 *
 * @param processDefinitionId
 * @returns {AxiosPromise}
 */
export function isSuspended (processDefinitionId) {
  return request({
    url: servicePath.process + '/definition/isSuspended',
    method: 'put',
    params: {
      processDefinitionId: processDefinitionId
    }
  })
}

/**
 * 用户列表
 *
 * @returns {AxiosPromise}
 */
export function selectUser () {
  return request({
    url: servicePath.process + '/common/selectUser',
    method: 'get',
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}
