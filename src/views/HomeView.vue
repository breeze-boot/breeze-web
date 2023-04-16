<template>
  <el-container>
    <el-aside class="left-aside">
      <Menu/>
    </el-aside>
    <el-container>
      <el-header>
        <Header/>
      </el-header>
      <el-main style="padding: 0 20px;">
        <Tags v-if="this.$store.getters['settings/getType'] === 'tag'"/>
        <Tabs v-else/>
        <keep-alive :include="this.$store.state.menu.keepAliveMenus">
          <router-view
            :key="this.$route.fullPath"
            :style="{animationName: 'pulse', animationDuration: 0.1 + 's'}"/>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Header from '@/components/home/Header'
import Menu from '@/components/home/Menu'
import Tabs from '@/components/home/Tabs'
import Tags from '@/components/home/Tags'
import SockJS from 'sockjs-client'
import store from '@/store'
import Stomp from 'stompjs'
import Notification from 'element-ui'
import { mapActions } from 'vuex'

export default {
  name: 'HomeView',
  components: {
    Tabs,
    Tags,
    Header,
    Menu
  },
  data () {
    return {
      notifications: {}
    }
  },
  created () {
    this.initWebSocket()
  },
  destroyed () {
    this.closeWebsocket()
  },
  methods: {
    ...mapActions('msg', ['closeMsgCard', 'markReadMsgCard']),
    /**
     * 初始化webSocket
     */
    initWebSocket () {
      const socket = new SockJS(process.env.VUE_APP_WS_URI + '/ws?tenant_id=' + localStorage.getItem('TENANT_ID'))
      store.state.msg.stompClient = Stomp.over(socket)
      const header = {
        Authorization: localStorage.getItem('access_token'),
        username: JSON.parse(localStorage.getItem('user_info')).username
      }
      store.state.msg.stompClient.connect(header,
        () => {
          this.subscribeTopic()
          this.subscribe()
        },
        (err) => {
          // 监听错误信息并且发起重连
          console.error('socketErrorMsg : ', err)
          if (store.state.msg.reConnectTime) {
            clearInterval(store.state.msg.store.state.msg.reConnectTime)
          }
          // 重新连接一次
          store.state.msg.reConnectTime = setTimeout(() => {
            console.debug('重新连接>>>>>>>>>>')
            this.initWebSocket()
          }, 60000)
        }
      )
    },
    /**
     * 关闭
     */
    closeWebsocket () {
      clearInterval(store.state.msg.reConnectTime)
      if (store.state.msg && store.state.msg.stompClient !== null) {
        store.state.msg.stompClient.disconnect(() => {
          console.debug('关闭连接')
        })
      }
    },
    /**
     * 订阅Topic
     */
    subscribeTopic () {
      store.state.msg.stompClient.subscribe('/topic/msg', this.notice())
    },
    /**
     * 订阅用户
     */
    subscribe () {
      store.state.msg.stompClient.subscribe('/user/queue/userMsg', this.notice())
    },
    /**
     * 消息卡片
     *
     * @returns {(function(*): void)|*}
     */
    notice () {
      // const _this = this
      return (response) => {
        const h = this.$createElement
        const responseJSON = JSON.parse(response.body)
        const data = responseJSON.data
        // 放到vuex
        data.msgLevel = data.msgLevel || 'info'
        console.debug('msg => {}', data)
        this.notifications[data.msgCode] = Notification.Notification({
          type: data.msgLevel,
          title: data.msgTitle,
          message: this.getMessage(h, data),
          dangerouslyUseHTMLString: true,
          position: 'top-right',
          offset: 20,
          duration: 3000,
          showClose: false,
          onClick () {
          }
        })
      }
    },
    getMessage (h, data) {
      return h('div', [
        h('h4', { style: 'color: teal' }, data.content),
        h('div', { class: 'notice' }, [
          h('div', {
            on: {
              click: () => this.toShowDetail(data)
            },
            class: 'notice-cursor notice-item'
          }, '查看详情'),
          h('div', {
            on: {
              click: () => this.toRead(data)
            },
            class: 'notice-cursor notice-item'
          }, '标记已读'),
          h('div', {
            on: {
              click: () => this.toClose(data)
            },
            class: 'notice-cursor notice-item'
          }, '关闭')
        ])
      ])
    },
    toShowDetail () {
      // 去详情列表
    },
    /**
     * 关闭
     *
     * @param data
     */
    toClose (data) {
      this.notifications[data.msgCode].close()
      this.closeMsgCard(data)
      delete this.notifications[data.msgCode]
    },
    /**
     * 已读
     *
     * @param data
     */
    toRead (data) {
      this.notifications[data.msgCode].close()
      this.markReadMsgCard(data)
      delete this.notifications[data.msgCode]
    }
  }
}
</script>

<style lang="scss" scoped>
.el-header {
  padding: 0;
  color: #333;
}

.left-aside {
  box-shadow: 5px 0 5px -5px rgb(112, 109, 109);
  background: #093f6b;
  height: 100vh;
  width: fit-content !important;
}

.notice {
  width: 100vw;
  display: flex;
  justify-items: center;
  align-items: center;
}

.notice-cursor {
  margin: 6px 0 0 0;
  font-size: 0.5rem;
  cursor: pointer;
}

.notice-item {
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  display: block;
  font-weight: 500;
  padding: 6px 13px;
  font-size: 0.4rem;
  border-radius: 3px;
}
</style>
