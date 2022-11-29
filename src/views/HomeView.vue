<template>
  <el-container>
    <el-aside class="left-aside">
      <Menu/>
    </el-aside>
    <el-container>
      <el-header>
        <Header/>
      </el-header>
      <el-main style="padding: 1px 20px;">
        <div class="tag" @mousewheel="wheel">
          <Tag v-show="false"/>
          <Tabs v-show="true"/>
        </div>
        <keep-alive :include="this.$store.state.menu.keepAliveMenus">
          <router-view
            :key="this.$route.fullPath"
            :style="{animationName: 'fadeIn', animationDuration: 0 + 's'}"
            class="router-main"/>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Header from '@/components/home/Header'
import Menu from '@/components/home/Menu'
import Tabs from '@/components/home/Tabs'
import Tag from '@/components/home/Tag'
import SockJS from 'sockjs-client'
import store from '@/store'
import Stomp from 'stompjs'
import Notification from 'element-ui'
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'HomeView',
  components: {
    Tabs,
    Tag,
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
    ...mapMutations('msg', ['pushMsg']),
    ...mapActions('msg', ['closeMsgCard']),
    initWebSocket () {
      const socket = new SockJS(process.env.VUE_APP_SERVICE_URI + '/ws')
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
            console.log('重新连接>>>>>>>>>>')
            this.initWebSocket()
          }, 60000)
        }
      )
    },
    closeWebsocket () {
      clearInterval(store.state.msg.reConnectTime)
      if (store.state.msg.stompClient !== null) {
        store.state.msg.stompClient.disconnect(() => {
          console.log('关闭连接')
        })
      }
    },
    subscribeTopic () {
      store.state.msg.stompClient.subscribe('/topic/msg', this.notice())
    },
    subscribe () {
      store.state.msg.stompClient.subscribe('/user/queue/userMsg', this.notice())
    },
    notice () {
      const _this = this
      return (response) => {
        const h = this.$createElement
        const rep = JSON.parse(response.body)
        const data = rep.data
        // 放到vuex
        _this.pushMsg(data)
        data.msgLevel = data.msgLevel || 'info'
        console.debug('msg => {}', data)
        this.notifications[data.msgCode] = Notification.Notification({
          type: data.msgLevel,
          title: data.msgTitle,
          message: this.getMessage(h, data),
          dangerouslyUseHTMLString: true,
          position: 'top-right',
          offset: 20,
          duration: 1000,
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
    closeNotification (msg) {
      this.notifications[msg.msgCode].close()
      this.closeMsgCard(msg)
      delete this.notifications[msg.msgCode]
    },
    toShowDetail () {
      // 去详情列表
    },
    toClose (data) {
      this.closeNotification(data)
    },
    toRead () {
    },
    wheel (e) {
      const a = document.getElementById('tag')
      const scrollWidth = 100
      let flag
      e.wheelDelta ? flag = e.wheelDelta : flag = e.detail
      if (flag > 3 || -flag > 3) flag = -flag
      flag > 0 ? a.scrollLeft += scrollWidth : a.scrollLeft -= scrollWidth
      e.preventDefault()
    }
  }
}
</script>

<style lang="less" scoped>
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

.router-main {
  height: 83vh;
  box-shadow: 1px 1px 5px #eee;
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
