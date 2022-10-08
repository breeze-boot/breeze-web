<template>
  <el-container>
    <el-header>
      <Header/>
    </el-header>
    <el-container>
      <el-aside
        style="box-shadow: 5px 0 5px -5px rgb(112,109,109); background: #545c64; height: 93vh;width: fit-content;">
        <Menu/>
      </el-aside>
      <el-main style="padding: 1px 20px;">
        <Tabs/>
        <router-view style="height: 83vh; box-shadow: 1px 1px 5px #eee;"/>
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
  computed: {},
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
</style>
