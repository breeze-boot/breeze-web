<template>
  <el-container>
    <el-header>
      <Header/>
    </el-header>
    <el-container>
      <el-aside class="left-aside">
        <Menu/>
      </el-aside>
      <el-main style="padding: 1px 20px;">
        <Tabs/>
        <keep-alive :include="keepAlive">
          <router-view
            :key="key"
            class="router-main"
            :style="{animationName: 'fadIn', animationDuration: 0.5 + 's'}"/>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Tabs from '@/components/home/Tabs'
import Header from '@/components/home/Header'
import Menu from '@/components/home/Menu'

export default {
  name: 'HomeView',
  components: {
    Tabs,
    Header,
    Menu
  },
  data () {
    return {}
  },
  computed: {
    keepAlive () {
      return this.$store.state.menu.keepAliveMenus
    },
    key () {
      return this.$route.fullPath
    }
  },
  mounted () {
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.el-header {
  padding: 0;
  color: #333;
}

.left-aside {
  box-shadow: 5px 0 5px -5px rgb(112, 109, 109);
  background: #545c64;
  height: 93vh;
  width: fit-content !important;
}

.router-main {
  height: 83vh;
  box-shadow: 1px 1px 5px #eee;
}
</style>
