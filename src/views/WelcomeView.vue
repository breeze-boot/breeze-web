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

import JSONBigInt from 'json-bigint'

export default {
  name: 'WelcomeView',
  methods: {
    halo () {
      this.$sendMsg('/msg/sendDeptUserMsg', {
        deptIds: [
          JSONBigInt.parse('1565314987957145600')
        ],
        userIds: [
          1
        ],
        type: 1,
        msgId: JSONBigInt.parse('1594154596111454210')
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
