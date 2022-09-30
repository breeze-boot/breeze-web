<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px"
             @close="closeDialog">
    <el-descriptions :column="1" border size="mini">
      <el-descriptions-item>
        <template slot="label">
          系统模块
        </template>
        {{ log.systemModule }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          日志标题
        </template>
        {{ log.title }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          日志类型
        </template>
        {{ log.logType }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          操作类型
        </template>
        {{ log.doType }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          请求类型
        </template>
        {{ log.requestType }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          浏览器
        </template>
        {{ log.browser }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          IP
        </template>
        {{ log.ip }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          系统
        </template>
        {{ log.system }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          结果
        </template>
        {{ log.result }}
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script>
import { DIALOG_TYPE } from '@/utils/constant'

export default {
  name: 'ShowDialog',
  props: {
    title: String
  },
  data () {
    return {
      dialogVisible: false,
      log: {
        id: undefined,
        systemModule: '',
        logTitle: '',
        logType: '',
        doType: '',
        requestType: '',
        result: '',
        browser: '',
        system: '',
        ip: '',
        createBy: ''
      },
      // 默认是创建
      dialogStatus: DIALOG_TYPE.ADD,
      formLabelWidth: '80px'
    }
  },
  methods: {
    /**
     * val: 参数值
     * flag: 0 创建 1 修改 2 显示
     */
    showDialogVisible (val, dialogStatus) {
      this.dialogVisible = true
      this.$nextTick(() => {
        // 赋值
        Object.assign(this.log, val)
      })
      this.dialogStatus = dialogStatus
    },
    closeDialog () {
    }
  }
}
</script>

<style scoped>

</style>
