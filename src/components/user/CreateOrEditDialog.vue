<template>
  <el-dialog width="700px" :title="title" :visible.sync="dialogFormVisible"
             @closed="closeDialog">
    <el-form size="mini" :rules="rules" :disabled="!show" ref="ruleForm" :model="user" style="padding-right: 15px;">
      <el-form-item>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="user.avatar" :src="user.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
        <el-input v-model="user.username" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
        <el-input type="password" v-model="user.password" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="show" label="确认密码" prop="confirmPassword" :label-width="formLabelWidth">
        <el-input type="password" v-model="user.confirmPassword" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户工号" :label-width="formLabelWidth">
        <el-input disabled v-model="user.userCode" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone" :label-width="formLabelWidth">
        <el-input type="input" v-model="user.phone" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="E-mail" prop="email" :label-width="formLabelWidth">
        <el-input type="input" v-model="user.email" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="展示名称" prop="amountName" :label-width="formLabelWidth">
        <el-input type="input" v-model="user.amountName" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="部门" prop="deptId" :label-width="formLabelWidth" style="text-align: left;">
        <el-select v-model="user.deptId" filterable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="性别" prop="sex" :label-width="formLabelWidth" style="text-align: left">
        <el-radio-group v-model="user.sex">
          <el-radio :label="0">女</el-radio>
          <el-radio :label="1">男</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="身份证" prop="idCard" :label-width="formLabelWidth">
        <el-input type="input" v-model="user.idCard" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否锁定" prop="isLock" :label-width="formLabelWidth" style="text-align: left;">
        <el-switch
          v-model="user.isLock"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" v-if="show" class="dialog-footer">
      <el-button @click="resetForm('ruleForm')">取 消</el-button>
      <el-button @click="submitForm('ruleForm')" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { DIALOG_TYPE } from '@/utils/constant'
import { add, edit } from '@/api/user'
import { Message } from 'element-ui'

export default {
  name: 'CreateOrEditBox',
  props: {
    title: String
  },
  data () {
    return {
      dialogFormVisible: false,
      user: {
        id: '',
        // 头像的图片路径
        avatar: '',
        amountName: '',
        password: '',
        confirmPassword: '',
        userCode: '',
        username: '',
        deptId: '',
        idCard: '',
        email: '',
        sex: 1,
        isLock: 1
      },
      options: [{
        value: 1,
        label: 'CEO'
      }],
      value: '',
      // 默认是创建
      dialogStatus: DIALOG_TYPE.ADD,
      formLabelWidth: '80px',
      show: true,
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名称',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }
        ],
        sex: [
          {
            required: true,
            message: '请选择性别',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          {
            required: true,
            message: '请确认密码',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱账号',
            trigger: 'blur'
          }
        ],
        deptId: [
          {
            required: true,
            message: '请选择部门',
            trigger: 'blur'
          }
        ],
        idCard: [
          {
            required: true,
            message: '请输入身份证号',
            trigger: 'blur'
          }
        ],
        amountName: [
          {
            required: true,
            message: '请输入登陆后展示的名称',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
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
      add(this.user).then((rep) => {
        Message.success({ message: rep.message })
        this.dialogFormVisible = false
      })
    },
    edit () {
      edit(this.user).then((rep) => {
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
        this.user = val
      }
      if (dialogStatus === DIALOG_TYPE.SHOW) {
        this.show = false
      }
      this.dialogStatus = dialogStatus
    },
    closeDialog () {
      this.user.id = ''
      this.user.username = ''
      this.user.userCode = ''
      this.user.password = ''
      this.user.sex = ''
      this.user.phone = ''
      this.user.amountName = ''
      this.user.avatar = ''
      this.user.idCard = ''
      this.user.deptId = ''
      this.user.email = ''
      this.show = true
      this.dialogStatus = DIALOG_TYPE.ADD
      this.$emit('reloadList')
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
