<template>
  <el-container>
    欢迎
    <svg aria-hidden="true" height="2em" width="2em">
      <use :xlink:href="'#icon-abc12312312'"/>
    </svg>
    欢迎
    <i class="iconfont icon-export"></i>
    <el-row>
      <el-col :offset="12">
        <el-button @click="halo">测试->你好</el-button>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>

export default {
  name: 'WelcomeView',
  methods: {
    halo () {
      this.$sendUserMsg({ halo: 'halo admin' })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
