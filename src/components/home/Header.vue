<template>
  <el-container class="header">
    <div class="collapse" @click="collapse">
      <i v-show="this.isCollapse" class="el-icon-s-fold"/>
      <i v-show="!this.isCollapse" class="el-icon-s-unfold"/>
    </div>
    <div class="logout">
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
      :visible.sync="drawer"
      title="平台设置">
    </el-drawer>
  </el-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import 'animate.css'

export default {
  name: 'Header',
  data () {
    return {
      drawer: false,
      direction: 'rtl'
    }
  },
  computed: {
    ...mapState('menu', ['fadeIn', 'isCollapse']),
    ...mapGetters('userInfo', ['getUsername'])
  },
  methods: {
    ...mapMutations('menu', ['setCollapse', 'setCollapseWhitespace', 'setFadeIn', 'clearMenus']),
    ...mapActions('userInfo', ['clearUserInfo']),
    handleCommand (command) {
      if (command === 'logout') {
        // 只要去登录页 直接清除
        localStorage.clear()
        this.clearMenus()
        this.clearUserInfo()
        this.$router.push('/')
        this.$message({
          showClose: true,
          message: '退出成功',
          type: 'success'
        })
        return
      }
      this.drawer = true
    },
    collapse () {
      const collapseWhitespace = !this.isCollapse ? 200 : 65
      // 设置 VUEX 中的值
      this.setCollapse(!this.isCollapse)
      this.setFadeIn(this.fadeIn === 'fadeOut' ? 'fadeIn' : 'fadeOut')
      this.setCollapseWhitespace(collapseWhitespace)
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

  > .logout {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1%;
    width: 5%;
    height: 100%;
    color: #ffffff !important;
  }
}
</style>
