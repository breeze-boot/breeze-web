import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

export let reConnectTime = null
const stompClient = null

const subscribeTopic = () => {
  stompClient.subscribe('/topic/msg', (res) => {
    const row = JSON.parse(res.body)
    console.log('topic => {}', row)
  })
}

const subscribe = () => {
  stompClient.subscribe('/user/queue/userMsg', (res) => {
    const row = JSON.parse(res.body)
    console.log('user => {}', row)
  })
}

const sendMsg = (msg) => {
  stompClient.send('/msg/sendMsg', {}, JSON.stringify(msg))
}

export const initWebSocket = () => {
  const socket = new SockJS(process.env.VUE_APP_SERVICE_URI + '/ws')
  const stompClient = Stomp.over(socket)
  const header = {
    Authorization: localStorage.getItem('access_token'),
    username: 'admin'
  }
  stompClient.connect(header,
    () => {
      subscribeTopic()
      subscribe()
      // 发送信息
      sendMsg({ halo: 'Halo' })
    },
    (err) => {
      // 监听错误信息并且发起重连
      console.error('socketErrorMsg : ', err)
      if (reConnectTime) {
        clearInterval(reConnectTime)
      }
      // 重新连接一次
      reConnectTime = setTimeout(() => {
        console.log('重新连接>>>>>>>>>>')
        this.$initWebSocket()
      }, 60000)
    }
  )
}
export default {
  install (Vue, options) {
    Vue.prototype.$initWebSocket = initWebSocket
    Vue.prototype.$sendMsg = (msg) => {
      stompClient.send('/msg/sendMsg', {}, JSON.stringify(msg))
    }
    Vue.prototype.$closeWebsocket = () => {
      clearInterval(reConnectTime)
      if (stompClient !== null) {
        stompClient.disconnect(() => {
          console.log('关闭连接')
        })
      }
    }
    Vue.prototype.$sendUserMsg = (msg) => {
      stompClient.send('/msg/sendUserMsg', {}, JSON.stringify(msg))
    }
  }
}
