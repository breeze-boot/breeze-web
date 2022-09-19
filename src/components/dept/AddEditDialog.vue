<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px"
             @close="closeDialog('ruleForm')">
    <el-form v-show="!show" ref="ruleForm" :model="dept" :rules="rules" size="mini">
      <el-form-item :label-width="formLabelWidth" label="部门名称" prop="deptName">
        <el-input v-model="dept.deptName" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="部门编码" prop="deptCode">
        <el-input v-model="dept.deptCode" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="描述" prop="isOpen">
        <el-input v-model="dept.isOpen" autocomplete="off" clearable type="input"></el-input>
      </el-form-item>
    </el-form>
    <div v-show="!show" slot="footer" class="dialog-footer">
      <el-button size="mini" @click="resetForm('ruleForm')">取 消</el-button>
      <el-button size="mini" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>

    <el-descriptions v-show="show" :column="1" border size="mini">
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user"></i>
          部门标识
        </template>
        {{ dept.deptCode }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          部门名称
        </template>
        <el-tag size="small">{{ dept.deptName }}</el-tag>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script>
import { DIALOG_TYPE } from '@/utils/constant'
import { add, edit } from '@/api/admin/dept'
import { Message } from 'element-ui'

export default {
  name: 'AddEditDialog',
  props: {
    title: String
  },
  data () {
    return {
      dialogVisible: false,
      dept: {
        id: null,
        deptName: '',
        deptCode: ''
      },
      // 默认是创建
      dialogStatus: DIALOG_TYPE.ADD,
      formLabelWidth: '80px',
      show: false,
      rules: {
        deptName: [
          {
            required: true,
            message: '请输入部门名称',
            trigger: 'blur'
          }
        ],
        deptCode: [
          {
            required: true,
            message: '请输入部门编码',
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
      add(this.dept).then((rep) => {
        Message.success({ message: rep.message })
        this.dialogVisible = false
        this.$emit('reloadList')
      })
    },
    edit () {
      edit(this.dept).then((rep) => {
        Message.success({ message: rep.message })
        this.dialogVisible = false
        this.$emit('reloadList')
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    /*
     * val: 参数值
     * flag 0 创建 1 修改 2 显示
     */
    showDialogVisible (val, dialogStatus) {
      this.dialogVisible = true
      if (dialogStatus === DIALOG_TYPE.EDIT || dialogStatus === DIALOG_TYPE.SHOW) {
        this.$nextTick(() => {
          // 赋值
          Object.assign(this.dept, val)
        })
      }
      if (dialogStatus === DIALOG_TYPE.SHOW) {
        this.show = true
      }
      this.dialogStatus = dialogStatus
    },
    closeDialog (formName) {
      this.dept.id = undefined
      this.$refs[formName].clearValidate()
      this.$refs[formName].resetFields()
      this.show = false
    }
  }
}

</script>

<style scoped>

</style>
