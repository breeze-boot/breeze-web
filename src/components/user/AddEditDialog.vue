<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px"
             @close="closeDialog('ruleForm')">
    <el-form v-show="!show" ref="ruleForm" :model="user" :rules="rules" size="mini" style="padding-right: 15px;">
      <el-form-item>
        <el-upload
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
          :show-file-list="false"
          action="https://jsonplaceholder.typicode.com/posts/"
          class="avatar-uploader"
          prop="avatar">
          <img v-if="user.avatar" :src="user.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="用户名" prop="username">
        <el-input v-model="user.username" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="!isEdit" :label-width="formLabelWidth" label="密码" prop="password">
        <el-input v-model="user.password" autocomplete="off" clearable type="password"></el-input>
      </el-form-item>
      <el-form-item v-if="!isEdit" :label-width="formLabelWidth" label="确认密码" prop="confirmPassword">
        <el-input v-model="user.confirmPassword" autocomplete="off" clearable type="password"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="用户工号" prop="userCode">
        <el-input v-model="user.userCode" autocomplete="off" clearable disabled></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="手机号" prop="phone">
        <el-input v-model="user.phone" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="E-mail" prop="email">
        <el-input v-model="user.email" autocomplete="off" clearable type="input"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="展示名称" prop="amountName">
        <el-input v-model="user.amountName" autocomplete="off" clearable type="input"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="部门" prop="deptId" style="text-align: left;">
        <el-select v-model="user.deptId" filterable placeholder="请选择">
          <el-option
            v-for="item in deptOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="性别" prop="sex" style="text-align: left">
        <el-radio-group v-model="user.sex">
          <el-radio :label="0">女</el-radio>
          <el-radio :label="1">男</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="身份证" prop="idCard">
        <el-input v-model="user.idCard" autocomplete="off" clearable type="input"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="是否锁定" prop="isLock" style="text-align: left;">
        <el-switch
          v-model="user.isLock"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </el-form-item>
    </el-form>
    <div v-show="!show" slot="footer" class="dialog-footer">
      <el-button size="mini" @click="resetForm('ruleForm')">取 消</el-button>
      <el-button size="mini" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>

    <el-descriptions v-show="show" :column="2" border size="mini">
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user"></i>
          用户名
        </template>
        {{ user.username }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          用户工号
        </template>
        <el-tag size="small">{{ user.userCode }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone"></i>
          手机号
        </template>
        {{ user.phone }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-chat-round"></i>
          E-mail
        </template>
        {{ user.email }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          展示名称
        </template>
        {{ user.amountName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          部门
        </template>
        <el-select v-model="user.deptId" :disabled="true" size="mini">
          <el-option
            v-for="item in deptOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          性别
        </template>
        <el-tag :type="user.sex === 1 ? 'primary' : 'success'">
          {{ user.sex === 1 ? '男' : '女' }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user-solid"></i>
          身份证
        </template>
        <el-tag> {{ user.idCard }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-unlock"></i>
          是否锁定
        </template>
        <el-tag
          :type="user.isLock === 1 ? 'primary' : 'danger'"
          disable-transitions> {{ user.isLock === 1 ? '锁定' : '未锁定' }}
        </el-tag>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script>
import { DIALOG_TYPE } from '@/utils/constant'
import { add, edit } from '@/api/user'
import { Message } from 'element-ui'

export default {
  name: 'AddEditDialog',
  props: {
    title: String
  },
  data () {
    return {
      dialogVisible: false,
      user: {
        id: '',
        // 头像的图片路径
        avatar: '',
        amountName: '',
        password: '',
        phone: '',
        confirmPassword: '',
        userCode: '',
        username: '',
        deptId: '',
        idCard: '',
        email: '',
        sex: 1,
        isLock: 0
      },
      deptOption: [
        {
          value: 1,
          label: 'CEO'
        }
      ],
      // 默认是创建
      dialogStatus: DIALOG_TYPE.ADD,
      formLabelWidth: '80px',
      show: false,
      isEdit: false,
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
      this.user.avatar = URL.createObjectURL(file.raw)
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
        this.dialogVisible = false
        this.$emit('reloadList')
      })
    },
    edit () {
      edit(this.user).then((rep) => {
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
          Object.assign(this.user, val)
          this.isEdit = true
        })
      }
      if (dialogStatus === DIALOG_TYPE.SHOW) {
        this.show = true
      }
      this.dialogStatus = dialogStatus
    },
    closeDialog (formName) {
      this.user.id = undefined
      this.$refs[formName].clearValidate()
      this.$refs[formName].resetFields()
      this.show = false
      this.isEdit = false
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
