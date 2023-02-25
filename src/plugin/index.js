import store from '@/store/index'
import { listDict } from '@/api/sys/dict'

const sendMsg = (url, msg) => {
  store.state.msg.stompClient.send(url, {}, JSON.stringify(msg))
}

const toListDict = (dictCodes = []) => {
  return new Promise(resolve => {
    const noFindDictCodes = []
    const findDict = []
    dictCodes.forEach(key => {
      const dict = store.getters['dict/getDict'](key)
      if (dict && dict.length <= 0) {
        noFindDictCodes.push(key)
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
      resolve(findDict)
    }
  })
}

export default {
  install (Vue, options) {
    Vue.prototype.$sendMsg = sendMsg
    Vue.prototype.$toLoadDict = toListDict
  }
}
