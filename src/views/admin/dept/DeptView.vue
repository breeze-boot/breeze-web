<template>
  <el-container>
    <el-main>
      <el-form size="mini" :inline="true" :model="searchForm" class="demo-form-inline">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="部门名称">
              <el-input v-model="searchForm.deptName" placeholder="部门名称" clearable/>
            </el-form-item>
            <el-form-item label="部门编号">
              <el-input v-model="searchForm.deptCode" placeholder="部门编号" clearable/>
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
        size="mini"
        :data="tableData"
        height="90%"
        style="width: 100%"
        row-key="id"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
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
          prop="name"
          label="部门名称">
        </el-table-column>
        <el-table-column
          prop="deptCode"
          label="部门编码">
        </el-table-column>
        <el-table-column
          prop="isClose"
          label="是否停用">
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
    </el-main>
    <create-or-edit-dialog
      ref="createOrEditDialog"
      @reLocadList="reloadList"
      :title="title"/>
  </el-container>
</template>

<script>
import createOrEditDialog from '@/components/dict/CreateOrEditDialog'
import { del, list } from '@/api/dept'
import { DIALOG_TYPE } from '@/utils/constant'

export default {
  name: 'DeptView',
  components: { createOrEditDialog },
  data: () => ({
    title: '',
    multipleSelection: [],
    tableData: [],
    searchForm: {
      deptName: '',
      deptCode: ''
    }
  }),
  created () {
    this.reloadList()
  },
  methods: {
    reloadList () {
      list(this.buildParam()).then((rep) => {
        if (rep) {
          this.tableData = rep.data
        }
      })
    },
    buildParam () {
      this.tableData = []
      return this.searchForm
    },
    search () {
      this.reloadList()
    },
    reset () {
      this.searchForm.deptName = ''
      this.searchForm.deptCode = ''
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
      this.title = '创建部门'
      this.$refs.createOrEditDialog.showDialogFormVisible({}, DIALOG_TYPE.ADD)
    },
    edit (val) {
      this.title = '修改部门信息'
      this.$refs.createOrEditDialog.showDialogFormVisible(val, DIALOG_TYPE.EDIT)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    show (val) {
      this.title = '查看部门信息'
      this.$refs.createOrEditDialog.showDialogFormVisible(val, DIALOG_TYPE.SHOW)
    }
  }
}
</script>
