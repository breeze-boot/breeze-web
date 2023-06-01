import store from '@/store'
import { listDict } from '@/api/system/dict'

const sendMsg = (url, msg) => {
  store.state.msg.stompClient.send(url, { tenantId: localStorage.getItem('X-TENANT-ID') || '' }, JSON.stringify(msg))
}

const handleListDict = (dictCodes = []) => {
  return new Promise(resolve => {
    const noFindDictCodes = []
    const findDict = []
    dictCodes.forEach(dictCode => {
      const dictMap = store.getters['dict/dict'](dictCode)
      if (dictMap && dictMap.size <= 0) {
        noFindDictCodes.push(dictCode)
      }
    })
    if (noFindDictCodes.length > 0) {
      listDict(noFindDictCodes).then(response => {
        if (response.code === 0 || !response.data) {
          return
        }
        for (const [key, value] of Object.entries(response.data)) {
          const dict = {
            key: key,
            value: value
          }
          store.commit('dict/setDict', dict)
          findDict.push(dict)
        }
        resolve(findDict)
      })
    } else {
      resolve('从缓存加载')
    }
  })
}

export default {
  install (Vue, options) {
    Vue.prototype.$sendMsg = sendMsg
    Vue.prototype.$loadDict = handleListDict
  }
}
