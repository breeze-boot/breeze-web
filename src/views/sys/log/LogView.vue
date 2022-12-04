<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchLogForm" class="demo-form-inline" size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="系统模块" prop="systemModule">
              <el-input v-model="searchLogForm.systemModule" clearable placeholder="系统模块"/>
            </el-form-item>
            <el-form-item label="操作类型" prop="doType">
              <el-select v-model="searchLogForm.doType" placeholder="请选择">
                <el-option
                  v-for="item in doTypeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="日志类型" prop="logType">
              <el-select v-model="searchLogForm.doType" placeholder="请选择">
                <el-option
                  v-for="item in doTypeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="结果" prop="result">
              <el-select v-model="searchLogForm.result" placeholder="请选择">
                <el-option
                  v-for="item in resultOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="操作人员" prop="createBy">
              <el-input v-model="searchLogForm.createBy" clearable placeholder="操作人员"/>
            </el-form-item>
            <el-form-item label="日志时间" prop="searchDate">
              <el-date-picker
                v-model="searchLogForm.logType"
                end-placeholder="结束日期"
                range-separator="至"
                size="mini"
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
        <el-button plain size="mini" type="danger" @click="del">删除</el-button>
        <el-button plain size="mini" type="danger" @click="clear">清空全表</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="logTableData"
        border
        height="500"
        size="mini"
        stripe
        style="width: 100%"
        @selection-change="logHandleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          v-if="false"
          label="ID"
          prop="id"
          width="200"/>
        <el-table-column
          label="系统模块"
          prop="systemModule"
          width="180"/>
        <el-table-column
          label="日志标题"
          prop="logTitle"
          show-overflow-tooltip
          width="180"/>
        <el-table-column
          :formatter="(row, column) => this.$searchDict(row, column, 'LOG_TYPE')"
          label="日志类型"
          prop="logType"
          show-overflow-tooltip/>
        <el-table-column
          :formatter="(row, column) => this.$searchDict(row, column, 'DO_TYPE')"
          label="操作类型"
          prop="doType"/>
        <el-table-column
          label="请求类型"
          prop="requestType"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          :formatter="(row, column) => this.$searchDict(row, column, 'RESULT')"
          label="执行结果"
          prop="result"
          show-overflow-tooltip/>
        <el-table-column
          label="浏览器"
          prop="browser"
          show-overflow-tooltip/>
        <el-table-column
          label="IP"
          prop="ip"
          show-overflow-tooltip/>
        <el-table-column
          label="系统"
          prop="system"
          show-overflow-tooltip/>
        <el-table-column
          label="操作人"
          prop="createBy"
          show-overflow-tooltip/>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="info(scope.row)">查看</el-button>
            <el-button size="mini" type="text" @click.native.prevent="removeItem(scope.$index, logTableData,scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchLogForm.current"
          :page-size="searchLogForm.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>
    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="800px">
      <el-descriptions :column="1" border size="mini">
        <el-descriptions-item>
          <template slot="label">
            系统模块
          </template>
          {{ log.systemModule }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            日志标题
          </template>
          {{ log.title }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            日志类型
          </template>
          {{ log.logType }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            操作类型
          </template>
          {{ log.doType }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            请求类型
          </template>
          {{ log.requestType }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            浏览器
          </template>
          {{ log.browser }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            IP
          </template>
          {{ log.ip }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            系统
          </template>
          {{ log.system }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            结果
          </template>
          {{ log.result }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </el-container>
</template>

<script>
import { clear, del, list } from '@/api/sys/log'
import { confirmAlert, DIALOG_TYPE } from '@/utils/constant'
import JSONBigInt from 'json-bigint'

export default {
  name: 'LogView',
  data () {
    return {
      title: '',
      multipleSelectionLogId: [],
      logTableData: [],
      resultOption: [],
      doTypeOption: [{
        value: '1',
        label: '黄金糕'
      }],
      searchLogForm: {
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
      total: 0,
      infoDialogVisible: false,
      log: {
        id: undefined,
        systemModule: '',
        logTitle: '',
        logType: '',
        doType: '',
        requestType: '',
        result: '',
        browser: '',
        system: '',
        ip: '',
        createBy: ''
      },
      // 默认是创建
      dialogType: DIALOG_TYPE.ADD,
      formLabelWidth: '80px'
    }
  },
  mounted () {
    this.$loadDict(['LOG_TYPE', 'DO_TYPE', 'RESULT']).then((dict) => {
      this.reloadList()
    })
  },
  methods: {
    reloadList () {
      list(this.buildParam()).then((rep) => {
        if (rep.code === 1) {
          this.logTableData = rep.data.records
          this.searchLogForm.size = rep.data.size
          this.searchLogForm.current = rep.data.current
          this.total = rep.data.total
        }
      })
    },
    handleSizeChange (size) {
      this.searchLogForm.size = size
      this.reloadList()
    },
    handleCurrentChange (current) {
      this.searchLogForm.current = current
      this.reloadList()
    },
    search () {
      this.reloadList()
    },
    buildParam () {
      return this.searchLogForm
    },
    reset () {
      this.$refs.searchLogForm.resetFields()
    },
    exportInfo () {
    },
    /**
     * 批量删除
     */
    del () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelectionLogId.map((x) => ids.push(JSONBigInt.parse(x.id)))
        del(ids).then((rep) => {
          if (rep.code === 1) {
            this.$message.success('删除成功')
            this.reloadList()
          }
        })
      })
    },
    /**
     * 清空
     */
    clear () {
      confirmAlert(() => {
        clear().then((rep) => {
          this.$message.success('全部清空')
          this.reloadList()
        })
      })
    },
    /**
     * 删除行
     *
     * @param rows
     */
    removeItem (index, rows, row) {
      confirmAlert(() => {
        del([JSONBigInt.parse(row.id)]).then(rep => {
          if (rep.code === 1) {
            rows.splice(index, 1)
            this.reloadList()
            this.$message.success('删除成功')
          }
        })
      })
    },
    logHandleSelectionChange (val) {
      this.multipleSelectionLogId = val
    },
    info (row) {
      this.title = '查看详情信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.infoDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.log, row)
      })
    }
  }
}
</script>
