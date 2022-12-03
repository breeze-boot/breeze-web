import store from '@/store/index'
import { loadDict } from '@/api/sys/dict'

const sendMsg = (url, msg) => {
  store.state.msg.stompClient.send(url, {}, JSON.stringify(msg))
}

export default {
  install (Vue, options) {
    Vue.prototype.$sendMsg = sendMsg
    Vue.prototype.$loadDict = (dictCode) => {
      return new Promise(resolve => {
        let dict = store.getters['dict/getDict'](dictCode)
        if (dict && dict.length <= 0) {
          loadDict(dictCode).then(rep => {
            if (rep.code === 0 || !rep.data) {
              return
            }
            store.commit('dict/setDict', {
              dictCode: dictCode,
              dictValue: rep.data
            })
            dict = rep.data
            resolve(dict)
          })
        } else {
          resolve(dict)
        }
      })
    }
    Vue.prototype.$searchDict = (value, dictCode) => {
      let dict = store.getters['dict/getDict'](dictCode)
      if (!dict || dict.length <= 0) {
        dict = store.getters['dict/getDict'](dictCode)
      }
      return dict.filter(f => f.value === value).map(m => m.label)
    }
  }
}
