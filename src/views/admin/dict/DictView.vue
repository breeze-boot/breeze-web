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
              <el-button type="info" @click="rest">重置</el-button>
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
      :title="title"/>
  </el-container>
</template>

<script>
import createOrEditDialog from '@/components/platform/CreateOrEditDialog'

export default {
  name: 'DictView',
  components: { createOrEditDialog },
  data: () => ({
    title: '',
    multipleSelection: [],
    tableData: [{
      dictCode: '2016-05-02',
      dictName: '用户1',
      address: '上海市普陀区金沙江路 1518 弄'
    }, {
      dictCode: '2016-05-04',
      dictName: '用户1',
      address: '上海市普陀区金沙江路 1517 弄'
    }, {
      dictCode: '2016-05-01',
      dictName: '用户1',
      address: '上海市普陀区金沙江路 1519 弄'
    }, {
      dictCode: '2016-05-03',
      dictName: '用户1',
      address: '上海市普陀区金沙江路 1516 弄'
    }],
    searchForm: {
      dictName: '',
      dictCode: '',
      current: 1,
      size: 10
    },
    total: 0
  }),
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    search () {
      console.log('submit!')
    },
    rest () {
      this.searchForm.dictName = ''
      this.searchForm.dictCode = ''
    },
    del () {
    },
    exportInfo () {
    },
    importInfo () {
    },
    add () {
      this.title = '创建用户'
      this.$refs.createOrEditDialog.showDialogFormVisible()
    },
    edit () {
      this.title = '修改用户'
      this.$refs.createOrEditDialog.showDialogFormVisible()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    show (val) {
      alert(JSON.stringify(val))
    }
  }
}
</script>
