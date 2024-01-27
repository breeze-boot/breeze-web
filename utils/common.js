import Vue from 'vue'
import router from '@/router/index'
import store from '@/store'
import CryptoJS from 'crypto-js'

export const confirmAlert = (func, msg) => {
  Vue.prototype.$confirm(msg || '是否删除', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    func()
  }).catch((e) => {
    console.error(e)
  })
}

/**
 * 加密
 *
 * @param content
 * @param key
 * @returns {string}
 */
export const encrypt = (content, key) => {
  const sKey = CryptoJS.enc.Utf8.parse(key)
  const sContent = CryptoJS.enc.Utf8.parse(content)
  const encrypted = CryptoJS.AES.encrypt(sContent, sKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

/**
 * 解密
 *
 * @param content
 * @param key
 * @returns {*}
 */
export const decrypt = (content, key) => {
  const sKey = CryptoJS.enc.Utf8.parse(key)
  const decrypt = CryptoJS.AES.decrypt(content, sKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

export const reLoginConfirm = (msg) => {
  confirmAlert(() => {
    store.dispatch('userInfo/logOut').then(() => {
      router.push({ path: '/login' }).then(r => {
      })
    })
  }, msg || '登录状态已过期，请重新登录')
}

/**
 * 根据子节点查找父节点属性
 *
 * @param treeData 原始数据
 * @param func 比较方式
 * @param filed 要收集起来的属性字段
 * @param result 结果集
 */
export const filterTreeParentId = (treeData, func, filed = '', result = []) => {
  if (!treeData) return []
  for (const tree of treeData) {
    filed !== '' ? result.push(tree[filed]) : result.push(tree)
    if (func(tree)) return result
    if (tree.children) {
      const children = filterTreeParentId(tree.children, func, filed, result)
      if (children.length) {
        return children
      }
    }
    result.pop()
  }
  return []
}

/**
 * 过滤树形结构数据
 *
 * @param treeData
 * @param result
 * @param func
 * @returns {*[]}
 */
export function filterTree (treeData, result = [], func = {}) {
  if (!treeData.length) return []
  for (const tree of treeData) {
    // 跳出条件
    if (func(tree)) {
      continue
    }
    const temp = {
      ...tree,
      children: []
    }
    result.push(temp)
    if (tree.children && tree.children.length > 0) {
      filterTree(tree.children, temp.children, (tree) => !tree.children && tree.hidden === 1)
    }
  }
  return result
}

export const getParamsAndQueryByIndex = (dynamicTabs, currentIndex) => {
  const toTabQuery = dynamicTabs[currentIndex].query
  const query = {}
  for (const key in toTabQuery) {
    query[key] = toTabQuery[key]
  }
  const toTabParams = dynamicTabs[currentIndex].params
  const params = {}
  for (const key in toTabParams) {
    params[key] = toTabParams[key]
  }
  return {
    query,
    params
  }
}

export const getParamsAndQueryByName = (dynamicTabs, name) => {
  const currentIndex = dynamicTabs.findIndex((value) => {
    return value.name === name
  })
  return getParamsAndQueryByIndex(dynamicTabs, currentIndex)
}
