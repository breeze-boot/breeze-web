<template>
  <el-container>
    <el-main>
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="字典名称">
              <el-input v-model="searchForm.dictName" clearable placeholder="字典名称"/>
            </el-form-item>
            <el-form-item label="字典标志">
              <el-input v-model="searchForm.dictCode" clearable placeholder="字典标志"/>
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
        height="300"
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
          label="字典名称"
          prop="dictName">
        </el-table-column>
        <el-table-column
          label="字典编码"
          prop="dictCode">
        </el-table-column>
        <el-table-column
          label="是否开启"
          prop="isOpen">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isOpen"
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
          width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="show(scope.row)">查看</el-button>
            <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click.native.prevent="delItem(scope.$index, tableData,scope.row)">删除
            </el-button>
            <el-button size="mini" type="text" @click="showDictDetail(scope.row)">查看字典</el-button>
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
    <dict-item-dialog
      ref="dictItemDialog"/>
  </el-container>
</template>

<script>
import AddEditDialog from '@/components/dialog/dict/AddEditDialog'
import DictItemDialog from '@/components/dialog/dict/DictItemDialog'
import { del, list, open } from '@/api/admin/dict'
import { confirmAlert, DIALOG_TYPE } from '@/utils/constant'
import { Message } from 'element-ui'

export default {
  name: 'DictView',
  components: {
    AddEditDialog,
    DictItemDialog
  },
  data: () => ({
    title: '',
    multipleSelection: [],
    tableData: [],
    searchForm: {
      dictName: '',
      dictCode: '',
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
        id: row.id,
        isOpen: row.isOpen
      }).then((rep) => {
        Message.success({ message: rep.message })
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
    },
    showDictDetail (val) {
      this.title = '查看字典详情信息'
      this.$refs.dictItemDialog.showDialogTableVisible(val)
    }
  }
}
</script>
