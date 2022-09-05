<template>
  <el-container>
    <el-main>
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="部门名称">
              <el-input v-model="searchForm.deptName" clearable placeholder="部门名称"/>
            </el-form-item>
            <el-form-item label="部门编号">
              <el-input v-model="searchForm.deptCode" clearable placeholder="部门编号"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="reset()">重置</el-button>
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
        :data="tableData"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        border
        height="90%"
        row-key="id"
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
          label="部门名称"
          prop="deptName">
        </el-table-column>
        <el-table-column
          label="部门编码"
          prop="deptCode">
        </el-table-column>
        <el-table-column
          label="是否停用"
          prop="isClose">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="show(scope.row)">查看</el-button>
            <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click.native.prevent="delItem(scope.$index, tableData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <add-edit-dialog
      ref="addEditDialog"
      :title="title"
      @reloadList="reloadList"/>
  </el-container>
</template>

<script>
import AddEditDialog from '@/components/dept/AddEditDialog'
import { del, list } from '@/api/dept'
import { DIALOG_TYPE } from '@/utils/constant'

export default {
  name: 'DeptView',
  components: { AddEditDialog },
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
      return this.searchForm
    },
    search () {
      this.reloadList()
    },
    reset () {
      this.searchForm.deptName = ''
      this.searchForm.deptCode = ''
    },
    /**
     * 批量删除
     */
    del () {
      const ids = []
      this.multipleSelection.forEach((x) => {
        ids.push(x.id)
      })
      del(ids).then((rep) => {
        this.$message.success('删除成功')
        this.reloadList()
      })
    },
    /**
     * 删除行
     *
     * @param rows
     */
    delItem (index, rows, row) {
      const ids = []
      ids.push(row.id)
      del(ids).then(rep => {
        rows.splice(index, 1)
      })
    },
    exportInfo () {
    },
    importInfo () {
    },
    add () {
      this.title = '创建部门'
      this.$refs.addEditDialog.showDialogFormVisible({}, DIALOG_TYPE.ADD)
    },
    edit (val) {
      this.title = '修改部门信息'
      this.$refs.addEditDialog.showDialogFormVisible(val, DIALOG_TYPE.EDIT)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    show (val) {
      this.title = '查看部门信息'
      this.$refs.addEditDialog.showDialogFormVisible(val, DIALOG_TYPE.SHOW)
    }
  }
}
</script>
