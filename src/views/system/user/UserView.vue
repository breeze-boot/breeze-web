<template>
  <el-container>
    <el-main>
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="用户名称">
              <el-input v-model="searchForm.username" clearable placeholder="用户名称"/>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="searchForm.phone" clearable placeholder="手机号"/>
            </el-form-item>
            <el-form-item label="用户编码">
              <el-input v-model="searchForm.userCode" clearable placeholder="用户编码"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">查询</el-button>
              <el-button type="info" @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button plain size="mini" type="primary" @click="add">新建</el-button>
        <el-button plain size="mini" type="danger" @click="del">删除</el-button>
        <el-button plain size="mini" type="info" @click="exportInfo">导出</el-button>
        <el-button plain size="mini" @click="importInfo">导入</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        empty-text="无数据"
        height="500"
        max-height="700"
        size="mini"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange">
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
              :type="scope.row.sex === 1 ? 'primary' : 'success'"
              disable-transitions
              size="mini">{{ scope.row.sex === 1 ? '男' : '女' }}
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
              active-color="#ff4949"
              inactive-color="#13ce66"
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
            <el-button size="mini" type="text" @click="show(scope.row)">查看</el-button>
            <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click.native.prevent="delItem(scope.$index, tableData,scope.row)">删除
            </el-button>
            <el-dropdown size="mini" type="primary" style="margin-left: 5px;" trigger="click">
              <span class="el-dropdown-link">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1" @click.native="resetPass(scope.row)">重置密码</el-dropdown-item>
                <el-dropdown-item command="2" @click.native="goRoleView(scope.row)"
                >角色分配
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchForm.current"
          :page-size="searchForm.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>
    <add-edit-dialog
      ref="addEditDialog"
      :title="title"
      @reloadList="reloadList"/>
    <reset-pass-dialog
      ref="resetPassDialog"
      :title="title"/>
  </el-container>
</template>

<script>
import AddEditDialog from '@/components/dialog/user/AddEditDialog'
import ResetPassDialog from '@/components/dialog/user/ResetPassDialog'
import { del, list, open } from '@/api/system/user'
import { confirmAlert, DIALOG_TYPE } from '@/utils/constant'
import { Message } from 'element-ui'

export default {
  name: 'UserView',
  components: {
    AddEditDialog,
    ResetPassDialog
  },
  data: () => ({
    title: '',
    multipleSelection: [],
    tableData: [],
    searchForm: {
      username: '',
      userCode: '',
      phone: '',
      current: 1,
      size: 10
    },
    total: 0
  }),
  created () {
    this.reloadList()
  },
  methods: {
    goRoleView (row) {
      this.$router.push({
        name: 'userRole',
        path: '/userRole'
      })
    },
    reloadList () {
      list(this.buildParam()).then((rep) => {
        if (rep.code === 1) {
          this.tableData = rep.data.records
          this.searchForm.size = rep.data.size
          this.searchForm.current = rep.data.current
          this.total = rep.data.total
        }
      })
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
    buildParam () {
      this.tableData = []
      return this.searchForm
    },
    handleSizeChange (size) {
      this.searchForm.size = size
      this.reloadList()
    },
    handleCurrentChange (current) {
      this.searchForm.current = current
      this.reloadList()
    },
    search () {
      this.reloadList()
    },
    reset () {
      this.searchForm.username = ''
      this.searchForm.userCode = ''
      this.searchForm.phone = ''
    },
    /**
     * 批量删除
     */
    del () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelection.forEach((x) => {
          ids.push(x.id)
        })
        del(ids).then((rep) => {
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
     * @param rows
     */
    delItem (index, rows, row) {
      confirmAlert(() => {
        const usernames = []
        usernames.push(row.username)
        del(usernames).then(rep => {
          if (rep.code === 1) {
            rows.splice(index, 1)
            this.$message.success('删除成功')
          }
        })
      })
    },
    resetPass (row) {
      this.$refs.resetPassDialog.showDialogVisible(row)
    },
    exportInfo () {
    },
    importInfo () {
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    add () {
      this.title = '创建用户'
      this.$refs.addEditDialog.showDialogVisible({}, DIALOG_TYPE.ADD)
    },
    edit (val) {
      this.title = '修改用户'
      this.$refs.addEditDialog.showDialogVisible(val, DIALOG_TYPE.EDIT)
    },
    show (val) {
      this.title = '查看信息'
      this.$refs.addEditDialog.showDialogVisible(val, DIALOG_TYPE.SHOW)
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

</style>
