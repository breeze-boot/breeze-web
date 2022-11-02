<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px"
             @close="closeDialog('ruleForm')">
    <el-form v-show="!show" ref="ruleForm" :model="platform" :rules="rules" size="mini">
      <el-form-item :label-width="formLabelWidth" label="平台名称" prop="platformName">
        <el-input v-model="platform.platformName" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="平台标志" prop="platformCode">
        <el-input v-model="platform.platformCode" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="描述" prop="description">
        <el-input v-model="platform.description" autocomplete="off" clearable type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <div v-show="!show" slot="footer" class="dialog-footer">
      <el-button size="mini" @click="resetForm()">取 消</el-button>
      <el-button size="mini" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>

    <el-descriptions v-show="show" :column="2" border size="mini">
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user"></i>
          平台名称
        </template>
        {{ platform.platformName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          平台编码
        </template>
        <el-tag size="small">{{ platform.platformCode }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-office-building"></i>
          描述
        </template>
        {{ platform.description }}
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script>
import { DIALOG_TYPE } from '@/utils/constant'
import { add, edit } from '@/api/system/platform'
import { Message } from 'element-ui'

export default {
  name: 'AddEditDialog',
  props: {
    title: String
  },
  data () {
    return {
      dialogVisible: false,
      platform: {
        id: null,
        platformName: '',
        platformCode: '',
        description: ''
      },
      // 默认是创建
      dialogType: DIALOG_TYPE.ADD,
      formLabelWidth: '80px',
      show: false,
      rules: {
        platformName: [
          {
            required: true,
            message: '请输入平台名称',
            trigger: 'blur'
          }
        ],
        platformCode: [
          {
            required: true,
            message: '请输入平台编码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogType === DIALOG_TYPE.ADD ? this.add() : this.edit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    add () {
      add(this.platform).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: '添加成功' })
          this.dialogVisible = false
          this.$emit('reloadList')
        }
      })
    },
    edit () {
      edit(this.platform).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: '修改成功' })
          this.dialogVisible = false
          this.$emit('reloadList')
        }
      })
    },
    resetForm () {
      this.dialogVisible = false
    },
    /*
     * val: 参数值
     * flag 0 创建 1 修改 2 显示
     */
    showDialogVisible (val, dialogType) {
      this.dialogVisible = true
      if (dialogType === DIALOG_TYPE.EDIT || dialogType === DIALOG_TYPE.SHOW) {
        this.$nextTick(() => {
          // 赋值
          Object.assign(this.platform, val)
        })
      }
      if (dialogType === DIALOG_TYPE.SHOW) {
        this.show = true
      }
      this.dialogType = dialogType
    },
    closeDialog (formName) {
      this.platform.id = undefined
      this.$refs[formName].resetFields()
      this.show = false
    }
  }
}

</script>

<style scoped>

</style>
