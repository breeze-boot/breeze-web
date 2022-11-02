<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="600px"
             @close="closeDialog('ruleForm')">
    <el-form v-show="!show" ref="ruleForm" :model="permission" :rules="rules" size="mini">
      <el-form-item :label-width="formLabelWidth" label="规则名称" prop="name">
        <el-input v-model="permission.name" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="规则编码" prop="code">
        <el-input v-model="permission.code" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="运算符" prop="operator">
        <el-input v-model="permission.operator" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="自定义SQL" prop="sql">
        <el-input v-model="permission.sql" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="权限" prop="permissions">
        <el-input v-model="permission.permissions" autocomplete="off" clearable></el-input>
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
          规则名称
        </template>
        {{ permission.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          规则编码
        </template>
        <el-tag size="small">{{ permission.code }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-office-building"></i>
          自定义SQL
        </template>
        {{ permission.sql }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-office-building"></i>
          运算符
        </template>
        {{ permission.operator }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-office-building"></i>
          权限
        </template>
        {{ permission.permissions }}
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script>
import { DIALOG_TYPE } from '@/utils/constant'
import { add, edit } from '@/api/system/permission'
import { Message } from 'element-ui'

export default {
  name: 'AddEditDialog',
  props: {
    title: String
  },
  data () {
    return {
      dialogVisible: false,
      permission: {
        id: null,
        name: '',
        code: '',
        sql: '',
        operator: '',
        permissions: ''
      },
      // 默认是创建
      dialogType: DIALOG_TYPE.ADD,
      formLabelWidth: '100px',
      show: false,
      rules: {
        name: [
          {
            required: true,
            message: '请输入规则名称',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入规则编码',
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
      add(this.permission).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: '添加成功' })
          this.dialogVisible = false
          this.$emit('reloadList')
        }
      })
    },
    edit () {
      edit(this.permission).then((rep) => {
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
          Object.assign(this.permission, val)
        })
      }
      if (dialogType === DIALOG_TYPE.SHOW) {
        this.show = true
      }
      this.dialogType = dialogType
    },
    closeDialog (formName) {
      this.permission.id = undefined
      this.$refs[formName].resetFields()
      this.show = false
    }
  }
}

</script>

<style scoped>

</style>
