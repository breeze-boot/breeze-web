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
          findDict.push(dict)
        }
        resolve(findDict)
      })
    } else {
      resolve(findDict)
    }
  })
}

const searchSingleDictList = (key) => {
  return store.getters['dict/getDict'](key)
}

export default {
  install (Vue, options) {
    Vue.prototype.$sendMsg = sendMsg
    Vue.prototype.$toLoadDict = toListDict
    Vue.prototype.$searchSingleDictList = searchSingleDictList
    Vue.prototype.$searchDict = (row, column, key) => {
      if (!row || !column) {
        return
      }
      const dict = store.getters['dict/getDict'](key)
      let label = ''
      dict.forEach(item => {
        if (item.value === row[column.property] + '') {
          label = item.label
        }
      })
      return label
    }
    Vue.prototype.$searchDescriptionsDict = (row, columnName, key) => {
      if (!row || !columnName) {
        return
      }
      const dict = store.getters['dict/getDict'](key)
      let label = ''
      dict.forEach(item => {
        if (item.value === row[columnName] + '') {
          label = item.label
        }
      })
      return label
    }
  }
}
