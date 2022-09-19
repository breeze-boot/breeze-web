<template>
  <el-header style="padding-left: 0">
    <div class="menu">
      <div class="collapse" @click="collapse">
        <i v-show="!isCollapse" class="el-icon-s-fold"/>
        <i v-show="isCollapse" class="el-icon-s-unfold"/>
      </div>
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
  </el-header>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'Header',
  data () {
    return {
      isCollapse: false // 决定左侧导航栏是否展开
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
      this.isCollapse = !this.isCollapse
      this.setCollapse(this.isCollapse)
      // this.$store.commit('setCollapse', this.isCollapse)
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  display: flex;
  background-color: #FFFFFF;
  position: relative;
  border-bottom: rgba(48, 49, 51, 0.09) solid 1px;

  .collapse {
    height: 100%;
    width: 88px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: nowrap;
    font-size: 30px;
    cursor: pointer;
  }

  > .logout {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: center;
    position: absolute;
    right: 0;
    width: 5%;
    height: 100%;
    text-align: center;
    color: #FFFFFF !important;
  }
}

</style>
