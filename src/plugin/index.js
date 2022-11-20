import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import store from '@/store/index'

const subscribeTopic = () => {
  store.state.userInfo.stompClient.subscribe('/topic/msg', (res) => {
    const row = JSON.parse(res.body)
    console.log('topic => {}', row)
  })
}
const subscribe = () => {
  store.state.userInfo.stompClient.subscribe('/user/queue/userMsg', (res) => {
    const row = JSON.parse(res.body)
    console.log('user => {}', row)
  })
}

const sendMsg = (msg) => {
  store.state.userInfo.stompClient.send('/msg/sendMsg', {}, JSON.stringify(msg))
}

export const initWebSocket = () => {
  const socket = new SockJS(process.env.VUE_APP_SERVICE_URI + '/ws')
  store.state.userInfo.stompClient = Stomp.over(socket)
  const header = {
    Authorization: localStorage.getItem('access_token'),
    username: 'admin'
  }
  store.state.userInfo.stompClient.connect(header,
    () => {
      subscribeTopic()
      subscribe()
      // 发送信息
      sendMsg({ halo: 'Halo' })
    },
    (err) => {
      // 监听错误信息并且发起重连
      console.error('socketErrorMsg : ', err)
      if (store.state.userInfo.reConnectTime) {
        clearInterval(store.state.userInfo.store.state.userInfo.reConnectTime)
      }
      // 重新连接一次
      store.state.userInfo.reConnectTime = setTimeout(() => {
        console.log('重新连接>>>>>>>>>>')
        initWebSocket()
      }, 60000)
    }
  )
}
export default {
  install (Vue, options) {
    Vue.prototype.$initWebSocket = initWebSocket
    Vue.prototype.$closeWebsocket = () => {
      clearInterval(store.state.userInfo.reConnectTime)
      if (store.state.userInfo.stompClient !== null) {
        store.state.userInfo.stompClient.disconnect(() => {
          console.log('关闭连接')
        })
      }
    }
    Vue.prototype.$sendMsg = sendMsg
    Vue.prototype.$sendUserMsg = (msg) => {
      store.state.userInfo.stompClient.send('/msg/sendUserMsg', {}, JSON.stringify(msg))
    }
    Vue.prototype.$subscribeTopic = () => {
      store.state.userInfo.stompClient.subscribe('/topic/msg', (res) => {
        const row = JSON.parse(res.body)
        console.log('topic => {}', row)
      })
    }
    Vue.prototype.$subscribe = () => {
      store.state.userInfo.stompClient.subscribe('/user/queue/userMsg', (res) => {
        const row = JSON.parse(res.body)
        console.log('user => {}', row)
      })
    }
  }
}
