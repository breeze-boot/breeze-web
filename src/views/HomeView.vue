<template>
  <el-container style="height: 100%">
    <Menu/>
    <el-container>
      <el-main>
        <Header/>
        <Tabs/>
        <router-view style="height: 87vh;"/>
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
.el-main {
  margin: 0;
  padding: 0;
  text-align: center;
}
</style>
