<template>
  <el-container>
    <el-main>
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="平台名称">
              <el-input v-model="searchForm.platformName" clearable placeholder="平台名称"/>
            </el-form-item>
            <el-form-item label="平台编码">
              <el-input v-model="searchForm.platformCode" clearable placeholder="平台编码"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="reset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button plain size="mini" type="primary" @click="add" v-has="['sys:platform:save']">新建</el-button>
        <el-button plain size="mini" type="danger" @click="del" v-has="['sys:platform:delete']">删除</el-button>
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
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          v-if="false"
          label="ID"
          prop="id"
          width="200">
        </el-table-column>
        <el-table-column
          label="平台名称"
          prop="platformName"
          show-overflow-tooltip
          width="200">
        </el-table-column>
        <el-table-column
          label="平台标志"
          prop="platformCode"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="描述"
          prop="description"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="创建人"
          prop="createName">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="show(scope.row)">查看</el-button>
            <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text"
                       @click.native.prevent="delItem(scope.$index, tableData,scope.row)">删除
            </el-button>
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
  </el-container>
</template>

<script>
import AddEditDialog from '@/components/dialog/platform/AddEditDialog'
import { del, list } from '@/api/system/platform'
import { confirmAlert, DIALOG_TYPE } from '@/utils/constant'

export default {
  name: 'PlatformView',
  components: { AddEditDialog },
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
        console.log(rep)
        if (rep.code === 1) {
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
      return this.searchForm
    },
    reset () {
      this.searchForm.platformName = ''
      this.searchForm.platformCode = ''
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
        const ids = []
        ids.push(row.id)
        del(ids).then(rep => {
          if (rep.code === 1) {
            rows.splice(index, 1)
            this.$message.success('删除成功')
          }
        })
      })
    },
    exportInfo () {
    },
    importInfo () {
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    add () {
      this.title = '创建平台'
      this.$refs.addEditDialog.showDialogVisible({}, DIALOG_TYPE.ADD)
    },
    edit (val) {
      this.title = '修改平台'
      this.$refs.addEditDialog.showDialogVisible(val, DIALOG_TYPE.EDIT)
    },
    show (val) {
      this.title = '查看信息'
      this.$refs.addEditDialog.showDialogVisible(val, DIALOG_TYPE.SHOW)
    }
  }
}
</script>
