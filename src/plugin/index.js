import store from '@/store/index'
import { listDict } from '@/api/sys/dict'

const sendMsg = (url, msg) => {
  store.state.msg.stompClient.send(url, {}, JSON.stringify(msg))
}

const toListDict = (dictCodes = []) => {
  return new Promise(resolve => {
    const noFindDictCodes = []
    const findDictCodes = []
    dictCodes.forEach(dictCode => {
      const dict = store.getters['dict/getDict'](dictCode)
      if (dict && dict.length <= 0) {
        noFindDictCodes.push(dictCode)
      } else {
        findDictCodes.push(dict)
      }
    })
    listDict(noFindDictCodes).then(rep => {
      if (rep.code === 0 || !rep.data) {
        return
      }
      for (const [key, value] of Object.entries(rep.data)) {
        const dict = {
          key: key,
          value: value
        }
        store.commit('dict/setDict', dict)
        findDictCodes.push(dict)
      }
    })
    resolve(findDictCodes)
  })
}

export default {
  install (Vue, options) {
    Vue.prototype.$sendMsg = sendMsg
    Vue.prototype.$loadDict = toListDict
    Vue.prototype.$searchDict = (row, column, key) => {
      const dict = store.getters['dict/getDict'](key)
      let label = ''
      dict.forEach(item => {
        if (item.value === row[column.property] + '') {
          label = item.label
        }
      })
      return label
    }
  }
}
