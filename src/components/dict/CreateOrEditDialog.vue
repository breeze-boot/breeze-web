<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="800px"
             @close="closeDialog('ruleForm')">
    <el-form ref="ruleForm" :disabled="!show" :model="dict" :rules="rules" size="mini">
      <el-form-item :label-width="formLabelWidth" label="平台名称" prop="dictName">
        <el-input v-model="dict.dictName" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="平台标志" prop="dictCode">
        <el-input v-model="dict.dictCode" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="描述">
        <el-input v-model="dict.desc" autocomplete="off" clearable type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <div v-if="show" slot="footer" class="dialog-footer">
      <el-button @click="resetForm('ruleForm')">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { DIALOG_TYPE } from '@/utils/constant'
import { add, edit } from '@/api/dict'
import { Message } from 'element-ui'

export default {
  name: 'CreateOrEditBox',
  props: {
    title: String
  },
  data () {
    return {
      dialogFormVisible: false,
      dict: {
        id: null,
        dictName: '',
        dictCode: '',
        desc: ''
      },
      // 默认是创建
      dialogStatus: DIALOG_TYPE.ADD,
      formLabelWidth: '80px',
      show: true,
      rules: {
        dictName: [
          {
            required: true,
            message: '请输入平台名称',
            trigger: 'blur'
          }
        ],
        dictCode: [
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
      add(this.dict).then((rep) => {
        Message.success({ message: rep.message })
        this.dialogFormVisible = false
        this.$emit('reloadList')
      })
    },
    edit () {
      edit(this.dict).then((rep) => {
        Message.success({ message: rep.message })
        this.dialogFormVisible = false
        this.$emit('reloadList')
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
        this.$nextTick(() => {
          // 赋值
          Object.assign(this.dict, val)
        })
      }
      if (dialogStatus === DIALOG_TYPE.SHOW) {
        this.show = false
      }
      this.dialogStatus = dialogStatus
    },
    closeDialog (formName) {
      this.$refs[formName].clearValidate()
      this.$refs[formName].resetFields()
      this.show = true
    }
  }
}

</script>

<style scoped>

</style>
