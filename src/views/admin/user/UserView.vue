<template>
  <el-container>
    <el-main>
      <el-form size="mini" :inline="true" :model="searchForm" class="demo-form-inline">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="用户名称">
              <el-input v-model="searchForm.username" placeholder="用户名称" clearable/>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="searchForm.phone" placeholder="手机号" clearable/>
            </el-form-item>
            <el-form-item label="用户编码">
              <el-input v-model="searchForm.userCode" placeholder="用户编码" clearable/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">查询</el-button>
              <el-button type="info" @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button size="mini" type="primary" @click="add" plain>新建</el-button>
        <el-button size="mini" type="danger" @click="del" plain>删除</el-button>
        <el-button size="mini" type="info" @click="exportInfo" plain>导出</el-button>
        <el-button size="mini" @click="importInfo" plain>导入</el-button>
      </div>
      <el-table
        border
        stripe
        size="mini"
        ref="multipleTable"
        empty-text="无数据"
        :data="tableData"
        height="500"
        max-height="700"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          prop="id"
          v-if="false"
          label="ID"
          width="200">
        </el-table-column>
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="avatar"
          width="90"
          label="头像">
          <template slot-scope="scope">
            <img :src="scope.row.avatar" alt="" style="border-radius:100px;width: 50px;height: 50px;">
          </template>
        </el-table-column>
        <el-table-column
          prop="amountName"
          show-overflow-tooltip
          label="登录名">
        </el-table-column>
        <el-table-column
          prop="userCode"
          show-overflow-tooltip
          label="用户编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="username"
          show-overflow-tooltip
          label="用户名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="deptName"
          show-overflow-tooltip
          label="部门">
        </el-table-column>
        <el-table-column
          prop="idCard"
          show-overflow-tooltip
          label="身份证">
        </el-table-column>
        <el-table-column
          prop="email"
          show-overflow-tooltip
          label="用户邮箱">
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别">
          <template slot-scope="scope">
            <el-tag
              size="mini"
              :type="scope.row.sex === 1 ? 'primary' : 'success'"
              disable-transitions>{{ scope.row.sex === 1 ? '男' : '女' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="isLock"
          label="是否锁定">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isLock"
              size="mini"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="open(scope.$index, scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button size="mini" @click="show(scope.row)" type="text">查看</el-button>
            <el-button size="mini" @click="edit(scope.row)" type="text">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.current"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="searchForm.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-main>
    <create-or-edit-dialog
      ref="createOrEditDialog"
      @reloadList="reloadList"
      :title="title"/>
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
