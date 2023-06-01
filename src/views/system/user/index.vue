<template>
  <base-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchUser" class="demo-form-inline" label-width="80px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="用户名称" prop="username">
              <el-input v-model="searchUser.username" clearable placeholder="用户名称"/>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="searchUser.phone" clearable placeholder="手机号"/>
            </el-form-item>
            <el-form-item label="用户编码" prop="userCode">
              <el-input v-model="searchUser.userCode" clearable placeholder="用户编码"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button type="info" @click="handleSearchReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['sys:user:create']" plain size="mini" type="primary" @click="handleCreate">新建</el-button>
        <el-button v-has="['sys:user:delete']" :disabled="checkDelete" plain size="mini" type="danger"
                   @click="handleRemove">删除
        </el-button>
        <el-button v-has="['sys:user:export']" plain size="mini" type="info" @click="handleExport">导出</el-button>
        <el-button v-has="['sys:user:import']" plain size="mini" @click="handleImport">导入</el-button>
      </div>
      <el-table
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        ref="userTable"
        :data="userTableData"
        border
        empty-text="无数据"
        size="mini"
        stripe
        @selection-change="handleUserSelectionChange">
        <el-table-column
          v-if="false"
          label="ID"
          prop="id"
          width="200">
        </el-table-column>
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          v-if="false"
          label="头像"
          prop="avatar"
          width="90">
          <template slot-scope="scope">
            <img :src="scope.row.avatar" alt="" style="border-radius:100px;width: 50px;height: 50px;">
          </template>
        </el-table-column>
        <el-table-column
          label="展示名称"
          prop="amountName"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="用户编号"
          prop="userCode"
          show-overflow-tooltip
          width="180">
        </el-table-column>
        <el-table-column
          label="用户名"
          prop="username"
          show-overflow-tooltip
          width="180">
        </el-table-column>
        <el-table-column
          label="部门"
          prop="deptName"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="岗位"
          prop="postName"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="角色"
          prop="roleNames"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-for="(roleName, index) in scope.row.roleNames"
                    :key="index"
                    style="margin: 0 5px;">
              {{ roleName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="身份证"
          prop="idCard"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="用户邮箱"
          prop="email"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="性别"
          prop="sex">
          <template slot-scope="scope">
            <el-tag
              disable-transitions
              size="mini"
              style="margin: 0  5px"
              type="success">
              {{ column()(scope.row, scope.column, 'SEX') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否锁定"
          prop="isLock">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isLock"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#AAAAAA"
              size="mini"
              @change="handleOpen(scope.$index, scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="220">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleInfo(scope.row)">查看</el-button>
            <el-button v-has="['sys:user:modify']" size="mini" type="text" @click="handleEdit(scope.row)">编辑
            </el-button>
            <el-button v-has="['sys:user:delete']" size="mini" type="text"
                       @click.native.prevent="handleRemoveItem(scope.$index, userTableData,scope.row)">删除
            </el-button>
            <el-dropdown size="mini" style="margin-left: 5px;" trigger="click" type="primary">
              <span class="el-dropdown-link">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-has="['sys:user:reset']" command="1" @click.native="handleReset(scope.row)">重置密码
                </el-dropdown-item>
                <el-dropdown-item v-has="['sys:user:setRole']" command="2" @click.native="goRoleView(scope.row)"
                >角色分配
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchUser.current"
          :page-size="searchUser.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>

    <el-dialog :title="title" :visible.sync="restPassDialogVisible" width="40vw"
               @close="handleCloseRestPassDialog('restPasswordForm')">
      <el-form ref="restPasswordForm" :model="userPassword" :rules="resetPasswordRules" size="mini">
        <el-form-item :label-width="formLabelWidth" label="密码" prop="password">
          <el-input v-model="userPassword.password" autocomplete="off" clearable show-password type="password"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="确认密码" prop="confirmPassword">
          <el-input v-model="userPassword.confirmPassword" autocomplete="off" clearable show-password
                    type="password"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCancelRestForm('restPasswordForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitResetForm('restPasswordForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="userDialogVisible" width="40vw"
               @close="handleCloseUserDialog('userForm')">
      <el-form ref="userForm" :model="user" :rules="userRules" size="mini" style="padding-right: 15px;">
        <el-form-item style="text-align: center;">
          <el-upload
            :before-upload="beforeAvatarUpload"
            :http-request="uploadImage"
            :on-success="handleAvatarSuccess"
            :show-file-list="false"
            action=""
            class="avatar-uploader"
            prop="avatar">
            <img v-if="avatarUrl" :src="avatarUrl" class="avatar" alt=""/>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="用户名" prop="username">
          <el-input v-model="user.username" autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item v-if="dialogType === dialogTypeAdd" :label-width="formLabelWidth" label="密码" prop="password">
          <el-input v-model="user.password" autocomplete="off" clearable show-password type="password"/>
        </el-form-item>
        <el-form-item v-if="dialogType === dialogTypeAdd" :label-width="formLabelWidth" label="确认密码"
                      prop="confirmPassword">
          <el-input v-model="user.confirmPassword" autocomplete="off" clearable show-password
                    type="password"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="用户工号" prop="userCode">
          <el-input v-model="user.userCode" autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="手机号" prop="phone">
          <el-input v-model="user.phone" autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="E-mail" prop="email">
          <el-input v-model="user.email" autocomplete="off" clearable type="input"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="展示名称" prop="amountName">
          <el-input v-model="user.amountName" autocomplete="off" clearable type="input"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" class="dept" label="部门" prop="deptId">
          <el-cascader
            v-model="user.deptId"
            :options="deptOption"
            :props="{ checkStrictly: true, emitPath: false , value: 'key', label: 'value' }"
            :show-all-levels="false"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="岗位" style="text-align: left;">
          <el-select v-model="user.postId" collapse-tags filterable placeholder="请选择岗位">
            <el-option
              v-for="item in postOption"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="角色" prop="roleIds" style="text-align: left;">
          <el-select v-model="user.roleIds" collapse-tags filterable multiple placeholder="请选择用户角色">
            <el-option
              v-for="item in roleOption"
              :key="item.key"
              :label="item.value"
              :value="item.key">
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
          <el-input v-model="user.idCard" autocomplete="off" clearable type="input"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="是否锁定" prop="isLock" style="text-align: left;">
          <el-switch
            v-model="user.isLock"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#AAAAAA">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleResetUserForm('userForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitUserForm('userForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="60vw"
               @close="handleCloseUserInfoDialog">
      <el-descriptions :column="1" border size="mini">
        <el-descriptions-item label="用户名">
          {{ user.username }}
        </el-descriptions-item>
        <el-descriptions-item label="用户工号">
          <el-tag size="small">
            {{ user.userCode }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="手机号">
          {{ user.phone }}
        </el-descriptions-item>
        <el-descriptions-item label="E-mail">
          {{ user.email }}
        </el-descriptions-item>
        <el-descriptions-item label="展示名称">
          {{ user.amountName }}
        </el-descriptions-item>
        <el-descriptions-item label="部门">
          {{ user.deptName }}
        </el-descriptions-item>
        <el-descriptions-item label="岗位">
          {{ user.postName }}
        </el-descriptions-item>
        <el-descriptions-item label="性别">
          {{ this.descriptions()(user, 'sex', 'SEX') }}
        </el-descriptions-item>
        <el-descriptions-item v-if="user.roleNames.length > 0" label="用户角色">
          <el-tag v-for="(roleName, index) in user.roleNames"
                  :key="index"
                  style="margin: 0 5px;">
            {{ roleName }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="身份证">
          {{ user.idCard }}
        </el-descriptions-item>
        <el-descriptions-item label="是否锁定">
          <el-tag
            :type="user.isLock === 0 ? 'primary' : 'danger'"
            disable-transitions>
            {{ this.descriptions()(user, 'isLock', 'IS_LOCK') }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </base-container>
</template>

<script>
import {
  checkUsername,
  del,
  exportInfo,
  info,
  list,
  modify,
  open,
  resetPass,
  save,
  selectPost,
  selectRole
} from '@/api/system/user'
import { confirmAlert } from '@utils/common'
import { DIALOG_TYPE, OSS } from '@/const/constant'
import JSONBigInt from 'json-bigint'
import { selectDept } from '@/api/system/dept'
import { saveAs } from 'file-saver'
import { uploadMinioS3 } from '@/api/system/file'
import { dict } from '@/mixins'

export default {
  name: 'User',
  components: {},
  mixins: [dict],
  data () {
    return {
      // 此页面需要的字典编码
      dictCode: ['SEX', 'IS_LOCK'],
      // 添加操作类型常量
      dialogTypeAdd: DIALOG_TYPE.ADD,
      // 当前操作类型
      dialogType: DIALOG_TYPE.ADD,
      // 弹出框标题
      title: '',
      // 单元格选中数据
      selectionUserIds: [],
      // 用户表格数据
      userTableData: [],
      // 用户查询条件数据
      searchUser: {
        username: '',
        userCode: '',
        phone: '',
        current: 1,
        size: 10
      },
      // 分页总数
      total: 0,
      // 标记删除按钮是否可以点击
      checkDelete: true,
      // 重置密码弹出框
      restPassDialogVisible: false,
      // 用户添加修改弹出框
      userDialogVisible: false,
      // 详情弹出框
      infoDialogVisible: false,
      // 表单标题宽度
      formLabelWidth: '80px',
      // 用户添加修改数据
      user: {
        id: undefined,
        // 头像的图片路径
        avatar: '',
        amountName: '',
        password: '',
        phone: '',
        confirmPassword: '',
        userCode: '',
        username: '',
        deptId: '',
        postId: '',
        roleIds: [],
        roleNames: [],
        sysRoles: [],
        idCard: '',
        email: '',
        sex: 1,
        isLock: 0
      },
      avatarUrl: '',
      // 用户详情数据
      userInfo: {
        id: undefined,
        // 头像的图片路径
        avatar: '',
        amountName: '',
        password: '',
        phone: '',
        confirmPassword: '',
        userCode: '',
        username: '',
        deptId: '',
        postId: '',
        roleIds: [],
        roleNames: [],
        sysRoles: [],
        idCard: '',
        email: '',
        sex: 1,
        isLock: 0
      },
      // 密码重置数据
      userPassword: {
        id: null,
        password: '',
        confirmPassword: ''
      },
      // 部门下拉框
      deptOption: [],
      // 岗位下拉框
      postOption: [],
      // 角色下拉框
      roleOption: [],
      // 用户添加修改表单规则
      userRules: {
        username: [
          {
            required: true,
            message: '请输入用户名称',
            trigger: 'blur'
          }, {
            validator: (rule, value, callback) => {
              checkUsername(value, this.user.id).then((response) => {
                if (response.data) {
                  callback()
                  return
                }
                callback(new Error('用户名重复'))
              })
            },
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
                  this.$refs.userForm.validateField('confirmPassword')
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
      },
      // 重置密码表单规则
      resetPasswordRules: {
        password: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入密码'))
              } else {
                if (this.userPassword.confirmPassword !== '') {
                  this.$refs.restPasswordForm.validateField('confirmPassword')
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
              } else if (value !== this.userPassword.password) {
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
  created () {
    this.reloadList()
    // 初始化部门下拉框
    this.selectDept()
    // 初始化角色下拉框
    this.selectRole()
    // 初始化岗位下拉框
    this.selectPost()
  },
  methods: {
    /**
     * 初始化加载表格数据
     */
    reloadList () {
      list(this.buildParam()).then((response) => {
        this.avatarUrl = ''
        this.userTableData = response.data.records
        this.searchUser.size = response.data.size
        this.searchUser.current = response.data.current
        this.total = response.data.total
      })
    },
    /**
     * 初始化部门下拉框数据
     */
    selectDept () {
      selectDept().then(response => {
        if (response.code === 1 && response.data) {
          this.deptOption = response.data
        }
      })
    },
    /**
     * 初始化岗位下拉框数据
     */
    selectPost (postId) {
      selectPost().then(response => {
        if (response.code === 1) {
          this.postOption = response.data
          if (this.dialogType === DIALOG_TYPE.ADD) {
            return
          }
          // 修改和查看
          this.user.postId = postId
        }
      })
    },
    /**
     * 初始化角色下拉框数据
     */
    selectRole () {
      selectRole().then(response => {
        if (response.code === 1) {
          this.roleOption = response.data
        }
      })
    },
    /**
     * 构造查询条件
     *
     * @returns {{current: number, size: number, phone: string, userCode: string, username: string}}
     */
    buildParam () {
      this.userTableData = []
      return this.searchUser
    },
    /**
     * 分页大小切换
     *
     * @param size
     */
    handleSizeChange (size) {
      this.searchUser.size = size
      this.reloadList()
    },
    /**
     * 当前页切换
     *
     * @param current
     */
    handleCurrentChange (current) {
      this.searchUser.current = current
      this.reloadList()
    },
    /**
     * 查询按钮
     */
    handleSearch () {
      this.reloadList()
    },
    /**
     * 查询重置按钮
     */
    handleSearchReset () {
      this.$refs.searchForm.resetFields()
      this.reloadList()
    },
    /**
     * 平台表格复选框事件
     *
     * @param val
     */
    handleUserSelectionChange (val) {
      this.checkDelete = !val.length
      this.selectionUserIds = val
    },
    /**
     * 批量删除
     */
    handleRemove () {
      confirmAlert(() => {
        const ids = []
        this.selectionUserIds.map((x) => ids.push(JSONBigInt.parse(x.id)))
        del(ids).then(response => {
          if (response.code === 1) {
            this.reloadList()
            this.$message.success('删除成功')
          }
        })
      })
    },
    /**
     * 删除行
     *
     * @param index
     * @param rows
     * @param row
     */
    handleRemoveItem (index, rows, row) {
      confirmAlert(() => {
        del([JSONBigInt.parse(row.id)]).then(response => {
          if (response.code === 1) {
            rows.splice(index, 1)
            this.reloadList()
            this.$message.success('删除成功')
          }
        })
      })
    },
    /**
     *导出
     */
    handleExport () {
      exportInfo().then(response => {
        const blob = new Blob([response.data],
          {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            size: response.data.size
          })
        saveAs(blob, response.data.originalFileName)
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 导入
     */
    handleImport () {
    },
    /**
     * 创建
     */
    handleCreate () {
      this.title = '创建用户'
      this.dialogType = DIALOG_TYPE.ADD
      this.userDialogVisible = true
    },
    /**
     * 修改
     *
     * @param row
     */
    handleEdit (row) {
      this.title = '修改用户'
      this.dialogType = DIALOG_TYPE.EDIT
      info(row.id).then(response => {
        this.$nextTick(() => {
          this.selectRole()
          this.selectDept()
          this.selectPost(row.postId)
          this.user = response.data
          this.avatarUrl = response.data.avatar
          this.userDialogVisible = true
        })
      })
    },
    /**
     * 详情
     * @param row
     */
    handleInfo (row) {
      this.title = '查看信息'
      this.dialogType = DIALOG_TYPE.SHOW
      info(row.id).then(response => {
        this.$nextTick(() => {
          this.selectRole()
          this.selectDept()
          Object.assign(this.user, response.data)
          this.avatarUrl = response.data.avatar
          this.infoDialogVisible = true
        })
      })
    },
    /**
     * 关闭用户添加修改弹出框事件
     *
     * @param formName
     */
    handleCloseUserDialog (formName) {
      this.user.id = undefined
      this.$refs[formName].resetFields()
      this.user = this.userInfo
    },
    /**
     * 关闭详情弹出框事件
     */
    handleCloseUserInfoDialog () {
      this.user = this.userInfo
    },
    /**
     * 添加修改弹出框提交
     * @param formName
     */
    handleSubmitUserForm: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogType === DIALOG_TYPE.ADD ? this.handleSave() : this.handleModify()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 保存请求
     */
    handleSave () {
      save(this.user).then((response) => {
        if (response.code === 1) {
          this.$message.success({ message: response.message })
          this.userDialogVisible = false
          this.reloadList()
        }
      })
    },
    /**
     * 修改请求
     */
    handleModify () {
      modify(this.user).then((response) => {
        if (response.code === 1) {
          this.$message.success({ message: response.message })
          this.userDialogVisible = false
          this.reloadList()
        }
      })
    },
    /**
     * 添加修改弹出框重置
     *
     * @param formName
     */
    handleResetUserForm (formName) {
      this.userDialogVisible = false
      this.$refs[formName].resetFields()
    },
    /**
     * 重置密码按钮事件
     *
     * @param row
     */
    handleReset (row) {
      this.restPassDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.userPassword, row)
      })
    },
    /**
     * 提交重置密码请求
     *
     * @param formName
     */
    handleSubmitResetForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          resetPass(this.userPassword).then(response => {
            if (response.code === 1) {
              this.$message.success({ message: '重置成功' })
              this.restPassDialogVisible = false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 重置密码表单重置
     *
     * @param formName
     */
    handleCancelRestForm (formName) {
      this.restPassDialogVisible = false
      this.$refs[formName].resetFields()
    },
    /**
     * 密码弹出框关闭事件
     *
     * @param formName
     */
    handleCloseRestPassDialog (formName) {
      this.user.id = undefined
      this.$refs[formName].resetFields()
    },
    handleOpen (index, row) {
      open(row.username, row.isLock).then((response) => {
        if (response.code === 1) {
          this.$message.success(response.message)
        }
      })
    },
    /**
     * 头像图片上传
     *
     * @param param
     */
    uploadImage (param) {
      const formData = new FormData()
      formData.append('file', param.file)
      formData.append('title', '用户头像')
      formData.append('ossStyle', OSS.LOCAL)
      uploadMinioS3(formData).then(response => {
        if (response.code === 1 && response.data) {
          this.$message({
            message: '图片上传成功',
            type: 'success'
          })
          this.user.avatar = response.data.path
          this.user.avatarFileId = response.data.fileId
          this.avatarUrl = response.data.url
        }
      }).catch(e => {
        console.error('图片上传失败', e)
      })
    },
    handleAvatarSuccess (response, file) {
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
    goRoleView (row) {
      this.$router.push({
        name: 'userRole',
        query: {
          userId: row.id,
          username: row.username
        }
      })
    }
  }
}
</script>

<style lang="scss">
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
