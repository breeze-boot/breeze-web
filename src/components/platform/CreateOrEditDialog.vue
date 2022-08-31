<template>
  <el-dialog width="800px" :title="title" :visible.sync="dialogFormVisible"
             @closed="closeDialog">
    <el-form size="mini" :rules="rules" :disabled="!show" ref="ruleForm" :model="platform">
      <el-form-item label="平台名称" prop="platformName" :label-width="formLabelWidth">
        <el-input v-model="platform.platformName" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="平台标志" prop="platformCode" :label-width="formLabelWidth">
        <el-input v-model="platform.platformCode" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input type="textarea" v-model="platform.desc" autocomplete="off" clearable></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" v-if="show" class="dialog-footer">
      <el-button @click="resetForm('ruleForm')">取 消</el-button>
      <el-button @click="submitForm('ruleForm')" type="primary" >确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { DIALOG_TYPE } from '@/utils/constant'
import { add, edit } from '@/api/platform'
import { Message } from 'element-ui'

export default {
  name: 'CreateOrEditBox',
  props: {
    title: String
  },
  data () {
    return {
      dialogFormVisible: false,
      platform: {
        id: null,
        platformName: '',
        platformCode: '',
        desc: ''
      },
      // 默认是创建
      dialogStatus: DIALOG_TYPE.ADD,
      formLabelWidth: '80px',
      show: true,
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
            message: '请输入平台标识',
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
          this.dialogStatus === DIALOG_TYPE.ADD ? this.add() : this.edit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    add () {
      add(this.platform).then((rep) => {
        Message.success({ message: rep.message })
        this.dialogFormVisible = false
      })
    },
    edit () {
      edit(this.platform).then((rep) => {
        Message.success({ message: rep.message })
        this.dialogFormVisible = false
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.dialogFormVisible = false
    },
    /*
     * val: 参数值
     * flag 0 创建 1 修改 2 显示
     */
    showDialogFormVisible (val, dialogStatus) {
      this.dialogFormVisible = true
      if (dialogStatus === DIALOG_TYPE.EDIT || dialogStatus === DIALOG_TYPE.SHOW) {
        this.platform.id = val.id
        this.platform.platformCode = val.platformCode
        this.platform.platformName = val.platformName
        this.platform.desc = val.desc
      }
      if (dialogStatus === DIALOG_TYPE.SHOW) {
        this.show = false
      }
      this.dialogStatus = dialogStatus
    },
    closeDialog () {
      this.platform.platformName = ''
      this.platform.platformCode = ''
      this.platform.id = ''
      this.platform.desc = ''
      this.show = true
      this.dialogStatus = DIALOG_TYPE.ADD
      this.$emit('reloadList')
    }
  }
}

</script>

<style scoped>

</style>
