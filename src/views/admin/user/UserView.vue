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
          label="头像"
          prop="avatar"
          width="90">
          <template slot-scope="scope">
            <img :src="scope.row.avatar" alt="" style="border-radius:100px;width: 50px;height: 50px;">
          </template>
        </el-table-column>
        <el-table-column
          label="登录名"
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
              active-color="#13ce66"
              inactive-color="#ff4949"
              size="mini"
              @change="open(scope.$index, scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="show(scope.row)">查看</el-button>
            <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
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
    <create-or-edit-dialog
      ref="createOrEditDialog"
      :title="title"
      @reloadList="reloadList"/>
  </el-container>
</template>

<script>
import createOrEditDialog from '@/components/user/CreateOrEditDialog'
import { del, list, open } from '@/api/user'
import { DIALOG_TYPE } from '@/utils/constant'
import { Message } from 'element-ui'

export default {
  name: 'UserView',
  components: { createOrEditDialog },
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
    reloadList () {
      list(this.buildParam()).then((rep) => {
        if (rep) {
          this.tableData = rep.data.records
          this.searchForm.size = rep.data.size
          this.searchForm.current = rep.data.current
          this.total = rep.data.total
        }
      })
    },
    open (index, row) {
      open({
        userId: row.id,
        isLock: row.isLock
      }).then((rep) => {
        Message.success({ message: rep.message })
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
    del () {
      const ids = []
      this.multipleSelection.forEach((x) => {
        ids.push(x.id)
      })
      del(ids)
      this.reloadList()
    },
    exportInfo () {
    },
    importInfo () {
    },
    add () {
      this.title = '创建用户'
      this.$refs.createOrEditDialog.showDialogFormVisible({}, DIALOG_TYPE.ADD)
    },
    edit (val) {
      this.title = '修改用户'
      this.$refs.createOrEditDialog.showDialogFormVisible(val, DIALOG_TYPE.EDIT)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    show (val) {
      this.title = '查看信息'
      this.$refs.createOrEditDialog.showDialogFormVisible(val, DIALOG_TYPE.SHOW)
    }
  }
}
</script>
