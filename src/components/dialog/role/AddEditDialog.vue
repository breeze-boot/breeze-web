<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px"
             @close="closeDialog('ruleForm')">
    <el-form v-show="!show" ref="ruleForm" :model="role" :rules="rules" size="mini">
      <el-form-item :label-width="formLabelWidth" label="角色名称" prop="roleName">
        <el-input v-model="role.roleName" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="角色编码" prop="roleCode">
        <el-input v-model="role.roleCode" autocomplete="off" clearable></el-input>
      </el-form-item>
    </el-form>
    <div v-show="!show" slot="footer" class="dialog-footer">
      <el-button size="mini" @click="resetForm()">取 消</el-button>
      <el-button size="mini" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>

    <el-descriptions v-show="show" :column="1" border size="mini">
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user"></i>
          角色编码
        </template>
        {{ role.roleCode }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          角色名称
        </template>
        <el-tag size="small">{{ role.roleName }}</el-tag>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script>
import { DIALOG_TYPE } from '@/utils/constant'
import { add, edit } from '@/api/system/role'
import { Message } from 'element-ui'

export default {
  name: 'AddEditDialog',
  props: {
    title: String
  },
  data () {
    return {
      dialogVisible: false,
      role: {
        id: undefined,
        roleName: '',
        roleCode: ''
      },
      // 默认是创建
      dialogType: DIALOG_TYPE.ADD,
      formLabelWidth: '80px',
      show: false,
      rules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }
        ],
        roleCode: [
          {
            required: true,
            message: '请输入角色编码',
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
      add(this.role).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: rep.message })
          this.dialogVisible = false
          this.$emit('reloadList')
        }
      })
    },
    edit () {
      edit(this.role).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: rep.message })
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
          Object.assign(this.role, val)
        })
      }
      if (dialogType === DIALOG_TYPE.SHOW) {
        this.show = true
      }
      this.dialogType = dialogType
    },
    closeDialog (formName) {
      this.role.id = undefined
      this.$refs[formName].resetFields()
      this.show = false
    }
  }
}

</script>

<style scoped>

</style>
