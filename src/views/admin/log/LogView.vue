<template>
  <el-container>
    <el-main>
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="系统模块" prop="systemModule">
              <el-input v-model="searchForm.systemModule" clearable placeholder="系统模块"/>
            </el-form-item>
            <el-form-item label="操作类型" prop="doType">
              <el-select v-model="searchForm.doType" placeholder="请选择">
                <el-option
                  v-for="item in doTypeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="日志类型" prop="logType">
              <el-select v-model="searchForm.doType" placeholder="请选择">
                <el-option
                  v-for="item in doTypeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="结果" prop="result">
              <el-select v-model="searchForm.result" placeholder="请选择">
                <el-option
                  v-for="item in resultOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="操作人员" prop="createBy">
              <el-input v-model="searchForm.createBy" clearable placeholder="操作人员"/>
            </el-form-item>
            <el-form-item label="日志时间" prop="searchDate">
              <el-date-picker
                size="mini"
                v-model="searchForm.logType"
                end-placeholder="结束日期"
                range-separator="至"
                start-placeholder="开始日期"
                type="daterange">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="reset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button plain size="mini" type="info" @click="exportInfo">导出</el-button>
        <el-button plain size="mini" type="danger" @click="del()">删除</el-button>
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
          label="系统模块"
          prop="systemModule"
          width="180">
        </el-table-column>
        <el-table-column
          label="日志标题"
          prop="logTitle"
          width="180">
        </el-table-column>
        <el-table-column
          label="日志类型"
          prop="logType">
        </el-table-column>
        <el-table-column
          label="操作类型"
          prop="doType">
        </el-table-column>
        <el-table-column
          label="请求类型"
          prop="requestType">
        </el-table-column>
        <el-table-column
          label="执行结果"
          prop="result">
        </el-table-column>
        <el-table-column
          label="浏览器"
          prop="browser">
        </el-table-column>
        <el-table-column
          label="IP"
          prop="ip">
        </el-table-column>
        <el-table-column
          label="系统"
          prop="system">
        </el-table-column>
        <el-table-column
          label="操作人"
          prop="createBy">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="show(scope.row)">查看</el-button>
            <el-button size="mini" type="text" @click.native.prevent="delItem(scope.$index, tableData,scope.row)">删除
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
    <show-dialog ref="showDialog"/>
  </el-container>
</template>

<script>
import { del, list } from '@/api/log'
import ShowDialog from '@/components/log/ShowDialog'
import { confirmAlert } from '@/utils/constant'

export default {
  name: 'LogView',
  components: { ShowDialog },
  data: () => ({
    title: '',
    multipleSelection: [],
    tableData: [],
    resultOption: [],
    doTypeOption: [{
      value: '1',
      label: '黄金糕'
    }],
    searchForm: {
      systemModule: '',
      doType: '',
      startDate: '',
      searchDate: '',
      result: '',
      createBy: '',
      logType: '',
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
      this.searchForm.logType = ''
      this.searchForm.result = ''
      this.searchForm.doType = ''
      this.searchForm.createBy = ''
      this.searchForm.searchDate = ''
      this.searchForm.startDate = ''
      this.searchForm.endDate = ''
    },
    exportInfo () {
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
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    show (val) {
      this.title = '查看详情信息'
      this.$refs.showDialog.showDialogVisible(val)
    }
  }
}
</script>
