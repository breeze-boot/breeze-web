<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchUserForm" class="demo-form-inline" size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="用户名称" prop="username">
              <el-input v-model="searchUserForm.username" clearable placeholder="用户名称"/>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="searchUserForm.phone" clearable placeholder="手机号"/>
            </el-form-item>
            <el-form-item label="用户编码" prop="userCode">
              <el-input v-model="searchUserForm.userCode" clearable placeholder="用户编码"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">查询</el-button>
              <el-button type="info" @click="searchReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['sys:user:save']" plain size="mini" type="primary" @click="create">新建</el-button>
        <el-button v-has="['sys:user:delete']" plain size="mini" type="danger" @click="remove">删除</el-button>
        <el-button v-has="['sys:user:export']" plain size="mini" type="info" @click="exportInfo">导出</el-button>
        <el-button v-has="['sys:user:import']" plain size="mini" @click="importInfo">导入</el-button>
      </div>
      <el-table
        ref="userTable"
        :data="userTableData"
        border
        empty-text="无数据"
        height="500"
        max-height="700"
        size="mini"
        stripe
        style="width: 100%"
        @selection-change="userHandleSelectionChange">
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
            <el-tag
              v-for="item in scope.row.sysRoles"
              :key="item.id"
              disable-transitions
              size="mini"
              style="margin: 0  5px"
              type="success">
              {{ item.roleName }}
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
          :formatter="(row, column) => this.getTableDictLabel()(row, column, 'SEX')"
          label="性别"
          prop="sex"/>
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
              @change="open(scope.$index, scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="220">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="info(scope.row)">查看</el-button>
            <el-button v-has="['sys:user:modify']" size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button v-has="['sys:user:delete']" size="mini" type="text"
                       @click.native.prevent="removeItem(scope.$index, userTableData,scope.row)">删除
            </el-button>
            <el-dropdown size="mini" style="margin-left: 5px;" trigger="click" type="primary">
              <span class="el-dropdown-link">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-has="['sys:user:resetPass']" command="1" @click.native="resetPass(scope.row)">重置密码
                </el-dropdown-item>
                <el-dropdown-item v-has="['sys:user:userSetRole']" command="2" @click.native="goRoleView(scope.row)"
                >角色分配
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchUserForm.current"
          :page-size="searchUserForm.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>

    <el-dialog :title="title" :visible.sync="restPasswordDialogVisible" width="800px"
               @close="closeRestPasswordDialog('restPasswordRuleForm')">
      <el-form ref="restPasswordRuleForm" :model="userPassword" :rules="resetPasswordRules" size="mini"
               style="padding-right: 15px;">
        <el-form-item :label-width="formLabelWidth" label="密码" prop="password">
          <el-input v-model="userPassword.password" autocomplete="off" clearable show-password type="password"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="确认密码" prop="confirmPassword">
          <el-input v-model="userPassword.confirmPassword" autocomplete="off" clearable show-password
                    type="password"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="restUserPasswordForm('restPasswordRuleForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitRestPasswordForm('restPasswordRuleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="userDialogVisible" width="800px"
               @close="closeUserDialog('userRuleForm')">
      <el-form ref="userRuleForm" :model="user" :rules="userRules" size="mini" style="padding-right: 15px;">
        <el-form-item style="text-align: center;">
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
        <el-form-item v-if="isAdd" :label-width="formLabelWidth" label="密码" prop="password">
          <el-input v-model="user.password" autocomplete="off" clearable show-password type="password"></el-input>
        </el-form-item>
        <el-form-item v-if="isAdd" :label-width="formLabelWidth" label="确认密码" prop="confirmPassword">
          <el-input v-model="user.confirmPassword" autocomplete="off" clearable show-password
                    type="password"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="用户工号" prop="userCode">
          <el-input v-model="user.userCode" autocomplete="off" clearable></el-input>
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
        <el-form-item :label-width="formLabelWidth" class="dept" label="部门" prop="deptId">
          <el-cascader
            v-model="user.deptId"
            :options="deptOption"
            :props="{ checkStrictly: true }"
            :show-all-levels="false"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="岗位" style="text-align: left;">
          <el-select v-model="user.postId" collapse-tags filterable placeholder="请选择岗位">
            <el-option
              v-for="item in postOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="角色" prop="roleIds" style="text-align: left;">
          <el-select v-model="user.roleIds" collapse-tags filterable multiple placeholder="请选择用户角色">
            <el-option
              v-for="item in roleOption"
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
            inactive-color="#AAAAAA">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetUserForm('userRuleForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitUserForm('userRuleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="800px"
               @close="closeUserInfoDialog">
      <el-descriptions :column="2" border size="mini">
        <el-descriptions-item>
          <template slot="label">
            用户名
          </template>
          {{ user.username }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            用户工号
          </template>
          <el-tag size="small">
            {{ user.userCode }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            手机号
          </template>
          {{ user.phone }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            E-mail
          </template>
          {{ user.email }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            展示名称
          </template>
          {{ user.amountName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            部门
          </template>
          <el-cascader
            v-model="user.deptId"
            :options="deptOption"
            :props="{ checkStrictly: true }"
            :show-all-levels="false"
            clearable
            disabled
            filterable
            size="mini"
          ></el-cascader>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            岗位
          </template>
          <el-select v-model="user.postId" collapse-tags disabled filterable placeholder="请选择岗位" size="mini">
            <el-option
              v-for="item in postOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            性别
          </template>
          {{ this.getDescriptionsDictLabel()(user, 'sex', 'SEX') }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            用户角色
          </template>
          {{ user.roleNames.length > 0 ? user.roleNames : '' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            身份证
          </template>
          {{ user.idCard }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            是否锁定
          </template>
          <el-tag
            :type="user.isLock === 0 ? 'primary' : 'danger'"
            disable-transitions>
            {{ this.getDescriptionsDictLabel()(user, 'isLock', 'IS_LOCK') }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </el-container>
</template>

<script>
import { del, list, modify, open, resetPass, save, selectPost, selectRole } from '@/api/sys/user'
import { confirmAlert, DIALOG_TYPE, filterTreeParentId } from '@/utils/constant'
import { Message } from 'element-ui'
import JSONBigInt from 'json-bigint'
import { selectDept } from '@/api/sys/dept'
import { mapGetters } from 'vuex'

export default {
  name: 'UserView',
  components: {},
  data () {
    return {
      title: '',
      multipleSelectionUserId: [],
      userTableData: [],
      searchUserForm: {
        username: '',
        userCode: '',
        phone: '',
        current: 1,
        size: 10
      },
      total: 0,
      // 弹出框
      restPasswordDialogVisible: false,
      userDialogVisible: false,
      infoDialogVisible: false,
      userPassword: {
        id: null,
        password: '',
        confirmPassword: ''
      },
      formLabelWidth: '80px',
      resetPasswordRules: {
        password: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入密码'))
              } else {
                if (this.userPassword.confirmPassword !== '') {
                  this.$refs.restPasswordRuleForm.validateField('confirmPassword')
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
      },
      isAdd: true,
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
        postId: '',
        roleIds: [],
        roleNames: [],
        sysRoles: [],
        idCard: '',
        email: '',
        sex: 1,
        isLock: 0
      },
      userInfo: {
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
        postId: '',
        roleIds: [],
        roleNames: [],
        sysRoles: [],
        idCard: '',
        email: '',
        sex: 1,
        isLock: 0
      },
      deptOption: [],
      postOption: [],
      roleOption: [],
      // 默认是创建
      dialogType: DIALOG_TYPE.ADD,
      userRules: {
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
                  this.$refs.userRuleForm.validateField('confirmPassword')
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
      }
    }
  },
  mounted () {
    this.$toLoadDict(['SEX', 'IS_LOCK']).then((dict) => {
      this.reloadList()
    })
    this.selectDept()
    this.selectRole()
    this.selectPost()
  },
  methods: {
    ...mapGetters('dict', ['getDict', 'getDescriptionsDictLabel', 'getTableDictLabel']),
    goRoleView (row) {
      this.$router.push({
        name: 'userRole',
        path: '/userRole',
        params: row
      })
    },
    reloadList () {
      list(this.buildParam()).then((rep) => {
        if (rep.code === 1) {
          this.userTableData = rep.data.records
          this.searchUserForm.size = rep.data.size
          this.searchUserForm.current = rep.data.current
          this.total = rep.data.total
          rep.data.records.forEach(user => {
            const roleIds = []
            user.sysRoles.forEach(role => {
              roleIds.push(role.id)
            })
            user.roleIds = roleIds
          })
        }
      })
    },
    selectDept () {
      selectDept().then(res => {
        if (res.code === 1 && res.data) {
          this.deptOption = res.data
          const treeTemp = filterTreeParentId(res.data, (tree) => {
            return tree.id && tree.id === this.user.deptId
          }, 'id')
          const tempArray = []
          treeTemp.map(id => tempArray.push(id))
          if (!this.isAdd) {
            this.user.deptId = tempArray
          }
        }
      })
    },
    selectPost (row) {
      selectPost().then(rep => {
        if (rep.code === 1) {
          this.postOption = rep.data
          // 修改和查看
          if (!this.isAdd) {
            this.user.postId = row.postId
          }
        }
      })
    },
    selectRole (row) {
      selectRole().then(rep => {
        if (rep.code === 1) {
          this.roleOption = rep.data
          // 修改和查看
          if (!this.isAdd) {
            // 角色分配回显
            this.user.roleIds = row.sysRoles.map(role => role.id)
            // 展示
            this.user.roleNames = row.sysRoles.map(role => role.roleName).join(',')
          }
        }
      })
    },
    buildParam () {
      this.userTableData = []
      return this.searchUserForm
    },
    open (index, row) {
      open({
        username: row.username,
        isLock: row.isLock
      }).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: rep.message })
        }
      })
    },
    handleSizeChange (size) {
      this.searchUserForm.size = size
      this.reloadList()
    },
    handleCurrentChange (current) {
      this.searchUserForm.current = current
      this.reloadList()
    },
    search () {
      this.reloadList()
    },
    searchReset () {
      this.$refs.searchForm.resetFields()
    },
    userHandleSelectionChange (val) {
      this.multipleSelectionUserId = val
    },
    /**
     * 批量删除
     */
    remove () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelectionUserId.map((x) => ids.push(JSONBigInt.parse(x.id)))
        del(ids).then(rep => {
          if (rep.code === 1) {
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
    removeItem (index, rows, row) {
      confirmAlert(() => {
        del([JSONBigInt.parse(row.id)]).then(rep => {
          if (rep.code === 1) {
            rows.splice(index, 1)
            this.reloadList()
            this.$message.success('删除成功')
          }
        })
      })
    },
    exportInfo () {
    },
    importInfo () {
    },
    create () {
      this.title = '创建用户'
      this.dialogType = DIALOG_TYPE.ADD
      this.isAdd = true
      this.userDialogVisible = true
    },
    edit (row) {
      this.title = '修改用户'
      this.dialogType = DIALOG_TYPE.EDIT
      this.isAdd = false
      this.$nextTick(() => {
        this.selectDept()
        this.selectRole(row)
        this.selectPost(row)
        Object.assign(this.user, row)
      })
      this.userDialogVisible = true
    },
    info (row) {
      this.title = '查看信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.$nextTick(() => {
        this.selectRole(row)
        this.selectDept(row.deptId)
        Object.assign(this.user, row)
      })
      this.infoDialogVisible = true
    },
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
    submitUserForm: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.user.deptId = this.user.deptId[this.user.deptId.length - 1]
          this.dialogType === DIALOG_TYPE.ADD ? this.save() : this.modify()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    save () {
      save(this.user).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: rep.message })
          this.userDialogVisible = false
          this.reloadList()
        }
      })
    },
    modify () {
      modify(this.user).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: rep.message })
          this.userDialogVisible = false
          this.reloadList()
        }
      })
    },
    resetUserForm (formName) {
      this.userDialogVisible = false
      this.$refs[formName].resetFields()
    },
    closeUserDialog (formName) {
      this.user.id = undefined
      this.$refs[formName].resetFields()
      this.isAdd = false
    },
    resetPass (row) {
      this.restPasswordDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.userPassword, row)
      })
    },
    closeRestPasswordDialog (formName) {
      this.user.id = undefined
      this.$refs[formName].resetFields()
    },
    closeUserInfoDialog () {
      this.$nextTick(() => {
        this.user = this.userInfo
      })
    },
    submitRestPasswordForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          resetPass(this.userPassword).then(rep => {
            if (rep.code === 1) {
              this.$message.success({ message: '重置成功' })
              this.restPasswordDialogVisible = false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    restUserPasswordForm (formName) {
      this.restPasswordDialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="less">
.el-dropdown {
  font-size: 0.5rem;

  i {
    font-size: 0.5rem;
  }
}

.el-dropdown-menu__item {
  font-size: 0.5rem;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

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
