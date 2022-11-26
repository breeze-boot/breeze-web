import store from '@/store/index'

const sendMsg = (url, msg) => {
  store.state.msg.stompClient.send(url, {}, JSON.stringify(msg))
}

export default {
  install (Vue, options) {
    Vue.prototype.$sendMsg = sendMsg
  }
}
