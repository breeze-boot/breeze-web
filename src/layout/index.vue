<template>
  <el-container>
    <!-- 左侧菜单 -->
    <el-aside class="left-aside">
      <el-scrollbar wrap-class="scrollbar">
        <!-- 菜单 -->
        <Menu/>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <!-- 顶部导航 -->
      <el-header>
        <Header/>
      </el-header>
      <!-- 主体内容 -->
      <el-main style="padding: 0 20px;">
        <Main/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Header from '@/layout/tabbar/index.vue'
import Menu from '@/layout/menu/index.vue'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { mapActions } from 'vuex'
import Main from '@/layout/main/index.vue'

export default {
  name: 'Home',
  components: {
    Main,
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
      const socket = new SockJS(process.env.VUE_APP_WS_URI + '/ws?tenantId=' + localStorage.getItem('X-TENANT-ID'))
      this.$store.state.msg.stompClient = Stomp.over(socket)
      const header = {
        Authorization: localStorage.getItem('access_token'),
        username: JSON.parse(localStorage.getItem('user_info')).username
      }
      this.$store.state.msg.stompClient.connect(header,
        () => {
          this.subscribeTopic()
          this.subscribe()
        },
        (err) => {
          // 监听错误信息并且发起重连
          console.error('socketErrorMsg : ', err)
          if (this.$store.state.msg.reConnectTime) {
            clearInterval(this.$store.state.msg.reConnectTime)
          }
          // 重新连接一次
          this.$store.state.msg.reConnectTime = setTimeout(() => {
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
      clearInterval(this.$store.state.msg.reConnectTime)
      if (this.$store.state.msg.stompClient !== null) {
        this.$store.state.msg.stompClient.disconnect(() => {
          console.debug('关闭连接')
        })
      }
    },
    /**
     * 订阅Topic
     * 前缀 /topic
     * 前后端确定的广播消息通道/msg
     */
    subscribeTopic () {
      this.$store.state.msg.stompClient.subscribe('/topic/msg', this.notice())
    },
    /**
     * 点对点订阅 - 订阅用户消息
     * 前缀 /user
     * 前后端确定的广播消息通道/queue/userMsg
     */
    subscribe () {
      this.$store.state.msg.stompClient.subscribe('/user/queue/userMsg', this.notice())
    },
    /**
     * 消息卡片
     *
     * @returns {(function(*): void)|*}
     */
    notice () {
      return (response) => {
        const responseJSON = JSON.parse(response.body)
        const data = responseJSON.data
        data.level = data.level || 'info'
        console.debug('msg => {}', data)
        // 存到vuex
        this.$store.commit('msg/setMsg', [data])
        this.$notify({
          title: data.title,
          message: data.content,
          type: data.level
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-header {
  padding: 0;
  color: #333;
}

.scrollbar {
  width: 100%;
  height: calc(100vh - $base-menu-logo-height);

  .el-menu {
    border-right: none;
  }
}

.left-aside {
  box-shadow: 5px 0 5px -5px rgb(112, 109, 109);
  background: $base-menu-background;
  height: 100vh;
  width: fit-content !important;
}

</style>
