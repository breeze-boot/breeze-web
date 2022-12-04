import store from '@/store/index'
import { listDict } from '@/api/sys/dict'

const sendMsg = (url, msg) => {
  store.state.msg.stompClient.send(url, {}, JSON.stringify(msg))
}

const toListDict = (dictCode) => {
  return new Promise(resolve => {
    const dict = store.getters['dict/getDict'](dictCode)
    if (dict && dict.length <= 0) {
      listDict(dictCode).then(rep => {
        if (rep.code === 0 || !rep.data) {
          return
        }
        store.commit('dict/setDict', {
          dictCode: dictCode,
          dictValue: rep.data
        })
        resolve(rep.data)
      })
    } else {
      resolve(dict)
    }
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
