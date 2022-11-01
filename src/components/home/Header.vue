<template>
  <el-container class="header">
    <div class="collapse" @click="collapse">
      <i v-show="this.isCollapse" class="el-icon-s-fold"/>
      <i v-show="!this.isCollapse" class="el-icon-s-unfold"/>
    </div>
    <div class="logout">
      <el-dropdown @command="handleCommand">
        <span style="color: #fff;" class="el-dropdown-link">
          <i class="el-icon-user-solid"/>
          <span> {{ this.getUsername }}</span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          <el-dropdown-item command="setting">系统设置</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import 'animate.css'

export default {
  name: 'Header',
  data () {
    return {}
  },
  computed: {
    ...mapGetters('menu', ['fadeIn', 'isCollapse']),
    ...mapGetters('userInfo', ['getUsername'])
  },
  methods: {
    ...mapMutations('menu', ['setCollapse', 'setCollapseWhitespace', 'setFadeIn']),
    handleCommand (command) {
      if (command === 'logout') {
        this.$message({
          showClose: true,
          message: '退出成功',
          type: 'success'
        })
        localStorage.removeItem('access_token')
        this.$router.push('/')
      }
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
  background: #545c64;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .collapse {
    height: 100%;
    min-width: 50px;
    font-size: 1.2rem;
    color: rgb(246, 246, 246);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  > .logout {
    margin-right: 1%;
    width: 5%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #ffffff !important;
  }
}
</style>
