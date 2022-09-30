<template>
  <el-container class="header">
    <div class="logo" :style="{width: collapseWhitespace + 'vw'}">
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
        <span class="el-dropdown-link">
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
      isCollapse: false, // 决定左侧导航栏是否展开
      collapseWhitespace: 10.5 // 决定左侧导航栏是否展开
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
      this.collapseWhitespace = this.isCollapse ? 10.5 : 3.4
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
  background: #002a59;
  height: 100%;
  width: 100vw;

  .collapse {
    height: 100%;
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 1.5rem;
    color: rgba(145, 125, 125, 0.49);
    cursor: pointer;
  }

  > .logo {
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

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

  > .logout {
    padding-right: 1%;
    width: 85%;
    display: flex;
    align-items: center;
    justify-content: end;
    height: 100%;
    text-align: right;
    color: #ffffff !important;
  }
}
</style>
