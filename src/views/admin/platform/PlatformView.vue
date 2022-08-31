<template>
  <el-container>
    <el-main>
      <el-form size="mini" :inline="true" :model="searchForm" class="demo-form-inline">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="平台名称">
              <el-input v-model="searchForm.platformName" placeholder="平台名称" clearable/>
            </el-form-item>
            <el-form-item label="平台编码">
              <el-input v-model="searchForm.platformCode" placeholder="平台编码" clearable/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="reset()">重置</el-button>
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
        ref="multipleTable"
        size="mini"
        :data="tableData"
        empty-text="无数据"
        height="500"
        max-height="700"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          v-if="false"
          label="ID"
          width="200">
        </el-table-column>
        <el-table-column
          prop="platformName"
          label="平台名称"
          show-overflow-tooltip
          width="200">
        </el-table-column>
        <el-table-column
          prop="platformCode"
          show-overflow-tooltip
          label="平台标志">
        </el-table-column>
        <el-table-column
          prop="description"
          show-overflow-tooltip
          label="描述">
        </el-table-column>
        <el-table-column
          prop="createName"
          label="创建人">
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
      @reloadList="reloadList"
      ref="createOrEditDialog"
      :title="title"/>
  </el-container>
</template>

<script>
import createOrEditDialog from '@/components/platform/CreateOrEditDialog'
import { del, list } from '@/api/platform'
import { DIALOG_TYPE } from '@/utils/constant'

export default {
  name: 'PlatformView',
  components: { createOrEditDialog },
  data: () => ({
    title: '',
    platformValue: {},
    multipleSelection: [],
    tableData: [],
    searchForm: {
      platformName: '',
      platformCode: '',
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
    buildParam () {
      this.tableData = []
      return this.searchForm
    },
    reset () {
      this.searchForm.platformName = ''
      this.searchForm.platformCode = ''
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
      this.title = '创建平台'
      this.$refs.createOrEditDialog.showDialogFormVisible({}, DIALOG_TYPE.ADD)
    },
    edit (val) {
      this.title = '修改平台'
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
