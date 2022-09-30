<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px"
             @close="closeDialog('ruleForm')">
    <el-form ref="ruleForm" :model="user" :rules="rules" size="mini" style="padding-right: 15px;">
      <el-form-item :label-width="formLabelWidth" label="密码" prop="password">
        <el-input v-model="user.password" autocomplete="off" clearable type="password"/>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="确认密码" prop="confirmPassword">
        <el-input v-model="user.confirmPassword" autocomplete="off" clearable type="password"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="resetForm('ruleForm')">取 消</el-button>
      <el-button size="mini" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { resetPass } from '@/api/admin/user'

export default {
  name: 'ResetPassDialog',
  props: {
    title: String
  },
  data () {
    return {
      dialogVisible: false,
      user: {
        id: '',
        password: ''
      },
      formLabelWidth: '80px',
      rules: {
        password: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入密码'))
              } else {
                if (this.user.confirmPassword !== '') {
                  this.$refs.ruleForm.validateField('confirmPassword')
                }
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入密码'))
              } else if (value !== this.user.password) {
                callback(new Error('两次输入密码不一致!'))
              } else {
                callback()
              }
            },
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
          resetPass(this.user).then(rep => {
            if (rep.code === 1) {
              this.$message.success({ message: '重置成功' })
              this.dialogVisible = false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
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
    showDialogVisible (val) {
      this.dialogVisible = true
      this.$nextTick(() => {
        // 赋值
        Object.assign(this.user, val)
        this.isEdit = true
      })
    },
    closeDialog (formName) {
      this.user.id = undefined
      this.$refs[formName].clearValidate()
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 50px;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
