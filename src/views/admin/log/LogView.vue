<template>
  <el-container>
    <el-main>
      <el-form size="mini" :inline="true" :model="searchForm" class="demo-form-inline">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="操作人员">
              <el-input v-model="searchForm.operator" placeholder="操作人员" clearable/>
            </el-form-item>
            <el-form-item label="功能模块">
              <el-input v-model="searchForm.module" placeholder="功能模块" clearable/>
            </el-form-item>
            <el-form-item label="操作类型">
              <el-input v-model="searchForm.type" placeholder="操作类型" clearable/>
            </el-form-item>
            <el-form-item label="结果">
              <el-input v-model="searchForm.result" placeholder="结果" clearable/>
            </el-form-item>
            <el-form-item label="操作时间">
              <el-date-picker
                v-model="searchForm.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="resetForm()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button size="mini" type="info" @click="exportInfo" plain>导出</el-button>
        <el-button size="mini" type="danger" @click="deleteInfo()" plain>删除</el-button>
      </div>
      <el-table
        border
        stripe
        ref="multipleTable"
        size="mini"
        :data="tableData"
        height="300"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="date"
          label="日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleClick(scope.row)" type="text" >查看</el-button>
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
  </el-container>
</template>

<script>
export default {
  name: 'LogView',
  data: () => ({
    title: '',
    multipleSelection: [],
    tableData: [{
      id: 1,
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    }, {
      id: 2,
      date: '2016-05-04',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1517 弄'
    }, {
      id: 3,
      date: '2016-05-01',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1519 弄',
      hasChildren: true
    }, {
      id: 4,
      date: '2016-05-03',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1516 弄'
    }],
    searchForm: {
      operator: '',
      module: '',
      date: '',
      result: '',
      error: '',
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
    },
    deleteInfo () {
    },
    resetForm () {
      this.searchForm.operator = ''
      this.searchForm.module = ''
      this.searchForm.operator = ''
      this.searchForm.module = ''
      this.searchForm.date = ''
      this.searchForm.result = ''
      this.searchForm.error = ''
    },
    exportInfo () {
    },
    importInfo () {
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleClick (val) {
      alert(JSON.stringify(val))
    }
  }
}
</script>
