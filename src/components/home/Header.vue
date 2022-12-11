<template>
  <el-container class="header">
    <div class="collapse" @click="collapse">
      <i v-show="this.menuIsCollapse.isCollapse" class="el-icon-s-fold"/>
      <i v-show="!this.menuIsCollapse.isCollapse" class="el-icon-s-unfold"/>
    </div>

    <div class="group">
      <div class="message">
        <el-badge class="item" is-dot>
          <i class="el-icon-message-solid" style="cursor: pointer;" @click="showMsgBox"></i>
        </el-badge>
      </div>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <span> {{ this.getUsername }}</span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="setting">
            <i class="el-icon-setting"/>平台设置
          </el-dropdown-item>
          <el-dropdown-item command="logout">
            <i class="el-icon-switch-button"/>退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-drawer
      :direction="direction"
      :visible.sync="settingDrawer"
      title="平台设置">
    </el-drawer>
    <el-drawer
      :direction="direction"
      :size="'20%'"
      :visible.sync="msgDrawer"
      :with-header="false">
      <el-main>
        <transition v-for="(item , index) in this.getMsg" :key="index" :index="index" name="el-fade-in">
          <div class="msg-content">
            <div
              :style="{ color: item.msgLevel === 'info' ? '#909399' :
                          (item.msgLevel === 'warning'? '#E6A23C' :
                                  (item.msgLevel === 'danger'? '#F56C6C':'#67C23A'))}"
              class="msg-title">
              {{ item.msgTitle }}
            </div>
            <div class="msg">
              <h1 class="msg-cursor"> 查看详情 </h1>
              <h1 class="msg-cursor" @click="closeMsg(item)"> 关闭 </h1>
              <h1 class="msg-cursor" @click="markReadMsg (item)"> 已读 </h1>
            </div>
          </div>
        </transition>
      </el-main>
    </el-drawer>
  </el-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import 'animate.css'
import { logout } from '@/api/sys/login'

export default {
  name: 'Header',
  data () {
    return {
      settingDrawer: false,
      msgDrawer: false,
      direction: 'rtl'
    }
  },
  computed: {
    ...mapState('menu', ['menuIsCollapse']),
    ...mapGetters('userInfo', ['getUsername']),
    ...mapGetters('msg', ['getMsg'])
  },
  methods: {
    ...mapGetters('userInfo', ['getUserInfo']),
    ...mapActions('msg', ['closeMsgCard', 'markReadMsgCard', 'reloadMsg']),
    ...mapActions('userInfo', ['clearUserInfo']),
    ...mapMutations('menu', ['setMenuIsCollapse', 'clearMenus']),
    handleCommand (command) {
      if (command === 'logout') {
        const username = this.getUserInfo().username
        logout({ username: username }).then(rep => {
          if (rep.code === 1) {
            localStorage.clear()
            this.$router.push('/')
            this.clearMenus()
            this.clearUserInfo()
            this.$message({
              showClose: true,
              message: '退出成功',
              type: 'success'
            })
          }
        })
        return
      }
      this.settingDrawer = true
    },
    closeMsg (msg) {
      this.closeMsgCard(msg)
    },
    markReadMsg (msg) {
      this.closeMsgCard(msg)
    },
    collapse () {
      const collapseWhitespace = !this.menuIsCollapse.isCollapse ? 200 : 65
      // 设置 VUEX 中的值
      this.setMenuIsCollapse({
        collapseWhitespace: collapseWhitespace,
        fadeIn: this.menuIsCollapse.fadeIn === 'fadeOut' ? 'fadeIn' : 'fadeOut',
        isCollapse: !this.menuIsCollapse.isCollapse
      })
    },
    showMsgBox () {
      this.msgDrawer = true
      // 查询用户消息
      this.reloadMsg()
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  background: #ffffff;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .collapse {
    height: 100%;
    min-width: 50px;
    font-size: 1.2rem;
    color: rgb(134, 124, 124);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  > .group {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1%;
    width: 8%;
    height: 100%;

    .message {
      height: auto;
      width: auto;
      margin: 0 1vw;
    }
  }

  .msg-content {
    height: 11vh;
    padding: 14px 26px 14px 13px;
    margin-top: 14px;
    border-radius: 8px;
    box-sizing: border-box;
    border: 1px solid #EBEEF5;
    background-color: #FFFFFF;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transition: opacity .3s, transform .3s, left .3s, right .3s, top .4s, bottom .3s;
    overflow: hidden;

    .msg-title {
      line-height: 1;
      white-space: nowrap;
      box-sizing: border-box;
      outline: 0;
      display: block;
      font-weight: bolder;
      padding: 6px 13px;
      font-size: 1rem;
      border-radius: 3px;
    }

    .msg {
      width: 100vw;
      display: flex;
      justify-items: center;
      align-items: center;
      font-weight: 500;

      .msg-cursor {
        cursor: pointer;
        padding: 3px 13px;
        margin-top: 30px;
        font-size: 0.5rem;
      }
    }
  }
}
</style>
