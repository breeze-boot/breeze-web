<template>
  <el-container class="header">
    <div class="logo" :style="{minWidth: collapseWhitespace  + 'px'}">
      <img v-show="!isCollapse" :style="{animationName: fadeIn, animationDuration: 1 + 's'}" alt=""
           src="../../assets/logo.png"/>
      <img v-show="isCollapse" :style="{animationName: fadeIn, animationDuration: 1 + 's'}" alt=""
           src="../../assets/logo.png"/>
      <span v-show="!isCollapse">通用管理系统</span>
    </div>
    <div class="collapse" @click="collapse">
      <i v-show="!isCollapse" class="el-icon-s-fold"/>
      <i v-show="isCollapse" class="el-icon-s-unfold"/>
    </div>
    <div class="logout">
      <el-dropdown @command="handleCommand">
        <span style="color: #fff;" class="el-dropdown-link">
          <span>admin</span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">登出</el-dropdown-item>
          <el-dropdown-item command="setting">设置</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-container>
</template>

<script>
import { mapMutations } from 'vuex'
import 'animate.css'

export default {
  name: 'Header',
  data () {
    return {
      fadeIn: '', // 决定左侧导航栏是否展开
      isCollapse: false,
      collapseWhitespace: 200
    }
  },
  methods: {
    handleCommand (command) {
      if (command === 'logout') {
        this.$message({
          showClose: true,
          message: '',
          type: 'success'
        })
        localStorage.removeItem('access_token')
        this.$router.push('/')
      }
    },
    ...mapMutations('menu', ['setCollapse']),
    collapse () {
      this.fadeIn = 'fadeOut'
      this.collapseWhitespace = this.isCollapse ? 200 : 65
      this.isCollapse = !this.isCollapse

      this.fadeIn = 'fadeIn'
      this.setCollapse(this.isCollapse)
      // this.$store.commit('setCollapse', this.isCollapse)
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  background: #545c64;
  height: 100%;
  width: 100%;

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0;

    span {
      text-align: center;
      width: 60%;
      color: #fff;
      font-size: 1rem;
    }

    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
  }

  .collapse {
    height: 100%;
    min-width: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 1.2rem;
    color: rgb(246, 246, 246);
    cursor: pointer;
  }

  > .logout {
    padding-right: 1%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: end;
    height: 100%;
    text-align: right;
    color: #ffffff !important;
  }
}
</style>
