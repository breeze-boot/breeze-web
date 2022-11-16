import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

export let reConnectTime = null
const socket = new SockJS(process.env.VUE_APP_SERVICE_URI + '/ws')
const stompClient = Stomp.over(socket)

const subscribeTopic = () => {
  stompClient.subscribe('/topic/msg', (res) => {
    const row = JSON.parse(res.body)
    console.log('topic => {}', row)
  })
}

const subscribe = () => {
  stompClient.subscribe('/user/userMsg', (res) => {
    const row = JSON.parse(res.body)
    console.log('user => {}', row)
  })
}

const sendMsg = (msg) => {
  stompClient.send('/msg/sendMsg', {}, JSON.stringify(msg))
}

export default {
  install (Vue, options) {
    Vue.prototype.$initWebSocket = () => (
      stompClient.connect({ Authorization: localStorage.getItem('access_token') },
        () => {
          subscribeTopic()
          subscribe()
          // 发送信息
          sendMsg({ user: 'Halo' })
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
    )
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
    Vue.prototype.$sendMsg = (url, msg) => {
      stompClient.send(url, {}, JSON.stringify(msg))
    }
    Vue.prototype.$sendUserMsg = (msg) => {
      stompClient.send('/msg/sendUserMsg', {}, JSON.stringify(msg))
    }
    Vue.prototype.$sendUserMsg = (url, msg) => {
      stompClient.send(url, {}, JSON.stringify(msg))
    }
  }
}
