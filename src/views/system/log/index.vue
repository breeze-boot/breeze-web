<template>
  <base-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchLog" class="demo-form-inline" label-width="80px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="系统模块" prop="systemModule">
              <el-input v-model="searchLog.systemModule" clearable placeholder="请输入系统模块"/>
            </el-form-item>
            <el-form-item label="操作类型" prop="doType">
              <el-select v-model="searchLog.doType" placeholder="请选择操作类型">
                <el-option
                  v-for="item in this.dict()('DO_TYPE')"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="日志类型" prop="logType">
              <el-select v-model="searchLog.logType" placeholder="请选择日志类型">
                <el-option
                  v-for="item in this.dict()('LOG_TYPE')"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="执行结果" prop="result">
              <el-select v-model="searchLog.result" placeholder="请选择执行结果">
                <el-option
                  v-for="item in this.dict()('RESULT')"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="操作人员" prop="createBy">
              <el-input v-model="searchLog.createBy" clearable placeholder="操作人员"/>
            </el-form-item>
            <el-form-item label="日志时间" prop="searchDate">
              <el-date-picker
                v-model="searchLog.searchDate"
                clearable
                end-placeholder="结束日期"
                format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                size="mini"
                start-placeholder="开始日期"
                type="datetimerange">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch()">查询</el-button>
              <el-button type="info" @click="handleSearchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['sys:log:export']" plain size="mini" type="info" @click="handleExportInfo">导出</el-button>
        <el-button v-has="['sys:log:delete']" :disabled="checkDelete" plain size="mini" type="danger"
                   @click="handleRemove">删除
        </el-button>
        <el-button v-has="['sys:log:truncate']" plain size="mini" type="danger" @click="handleTruncate">清空全表</el-button>
      </div>

      <el-table
        ref="logTable"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        :data="logTableData"
        border
        size="mini"
        stripe
        @selection-change="handleLogSelectionChange">
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
          :formatter="(row, column) => this.column()(row, column, 'LOG_TYPE')"
          label="日志类型"
          prop="logType"
          show-overflow-tooltip/>
        <el-table-column
          :formatter="(row, column) => this.column()(row, column, 'DO_TYPE')"
          label="操作类型"
          prop="doType"/>
        <el-table-column
          label="请求类型"
          prop="requestType"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          :formatter="(row, column) => this.column()(row, column, 'RESULT')"
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
            <el-button size="mini" type="text" @click="handleInfo(scope.row)">查看</el-button>
            <el-button v-has="['sys:log:delete']" size="mini" type="text"
                       @click.native.prevent="handleRemoveItem(scope.$index, logTableData,scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchLog.current"
          :page-size="searchLog.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>
    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="40vw">
      <el-descriptions :column="1" border size="mini">
        <el-descriptions-item label="系统模块">
          {{ log.systemModule }}
        </el-descriptions-item>
        <el-descriptions-item label="日志标题">
          {{ log.logTitle }}
        </el-descriptions-item>
        <el-descriptions-item label="日志类型">
          {{ this.descriptions()(log, 'logType', 'LOG_TYPE') }}
        </el-descriptions-item>
        <el-descriptions-item label="操作类型">
          {{ this.descriptions()(log, 'doType', 'DO_TYPE') }}
        </el-descriptions-item>
        <el-descriptions-item label="请求类型">
          {{ log.requestType }}
        </el-descriptions-item>
        <el-descriptions-item label="浏览器">
          {{ log.browser }}
        </el-descriptions-item>
        <el-descriptions-item label="IP">
          {{ log.ip }}
        </el-descriptions-item>
        <el-descriptions-item label="系统">
          {{ log.system }}
        </el-descriptions-item>
        <el-descriptions-item label="执行结果">
          {{ this.descriptions()(log, 'result', 'RESULT') }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </base-container>
</template>

<script>
import { del, list, truncate } from '@/api/system/log'
import { confirmAlert } from '@utils/common'
import { DIALOG_TYPE } from '@/const/constant'
import JSONBigInt from 'json-bigint'
import { dict } from '@/mixins'

export default {
  name: 'Log',
  mixins: [dict],
  data () {
    return {
      // 此页面需要字典编码
      dictCode: ['LOG_TYPE', 'DO_TYPE', 'RESULT'],
      // 当前操作类型
      dialogType: DIALOG_TYPE.ADD,
      // 弹出框标题
      title: '',
      // 单元格选中数据
      selectionLogIds: [],
      // 日志表格数据
      logTableData: [],
      // 日志查询条件数据
      searchLog: {
        systemModule: '',
        doType: '',
        startDate: '',
        endDate: '',
        searchDate: '',
        result: '',
        createBy: '',
        logType: '',
        current: 1,
        size: 10
      },
      // 分页总数
      total: 0,
      // 标记删除按钮是否可以点击
      checkDelete: true,
      // 日志详情弹出框
      infoDialogVisible: false,
      // 表单标题宽度
      formLabelWidth: '80px',
      // 日志详情数据
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
      }
    }
  },
  created () {
    this.reloadList()
  },
  methods: {
    /**
     * 初始化加载表格数据
     */
    reloadList () {
      list(this.buildParam()).then((response) => {
        if (response.code === 1) {
          this.logTableData = response.data.records
          this.searchLog.size = response.data.size
          this.searchLog.current = response.data.current
          this.total = response.data.total
        }
      })
    },
    /**
     * 构造查询条件
     *
     * @returns {{result: string, logType: string, createBy: string, current: number, size: number, searchDate: string, doType: string, startDate: string, systemModule: string}}
     */
    buildParam () {
      this.searchLog.startDate = this.searchLog.searchDate[0]
      this.searchLog.endDate = this.searchLog.searchDate[1]
      return this.searchLog
    },
    /**
     * 分页大小切换
     *
     * @param size
     */
    handleSizeChange (size) {
      this.searchLog.size = size
      this.reloadList()
    },
    /**
     * 当前页切换
     *
     * @param current
     */
    handleCurrentChange (current) {
      this.searchLog.current = current
      this.reloadList()
    },
    /**
     * 查询按钮
     */
    handleSearch () {
      this.reloadList()
    },
    /**
     * 查询重置按钮
     */
    handleSearchReset () {
      this.$refs.searchForm.resetFields()
      this.reloadList()
    },
    /**
     * 平台表格复选框事件
     *
     * @param val
     */
    handleLogSelectionChange (val) {
      this.checkDelete = !val.length
      this.selectionLogIds = val
    },
    handleExportInfo () {
    },
    /**
     * 批量删除
     */
    handleRemove () {
      confirmAlert(() => {
        const ids = []
        this.selectionLogIds.map((x) => ids.push(JSONBigInt.parse(x.id)))
        del(ids).then((response) => {
          if (response.code === 1) {
            this.reloadList()
            this.$message.success('删除成功')
          }
        })
      })
    },
    /**
     * 清空
     */
    handleTruncate () {
      confirmAlert(() => {
        truncate().then((response) => {
          this.$message.success('全部清空')
          this.reloadList()
        })
      })
    },
    /**
     * 删除行
     *
     * @param index
     * @param rows
     * @param row
     */
    handleRemoveItem (index, rows, row) {
      confirmAlert(() => {
        del([JSONBigInt.parse(row.id)]).then(response => {
          if (response.code === 1) {
            rows.splice(index, 1)
            this.reloadList()
            this.$message.success('删除成功')
          }
        })
      })
    },
    /**
     * 详情
     *
     * @param row
     */
    handleInfo (row) {
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
