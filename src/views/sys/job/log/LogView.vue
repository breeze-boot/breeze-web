<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchLogForm" class="demo-form-inline" label-width="80px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="系统模块" prop="systemModule">
              <el-input v-model="searchLogForm.systemModule" clearable placeholder="系统模块"/>
            </el-form-item>
            <el-form-item label="操作类型" prop="doType">
              <el-select v-model="searchLogForm.doType" placeholder="请选择">
                <el-option
                  v-for="item in this.getDict()('DO_TYPE')"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="日志类型" prop="logType">
              <el-select v-model="searchLogForm.doType" placeholder="请选择">
                <el-option
                  v-for="item in this.getDict()('LOG_TYPE')"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="结果" prop="result">
              <el-select v-model="searchLogForm.result" placeholder="请选择">
                <el-option
                  v-for="item in this.getDict()('RESULT')"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
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
              <el-button type="info" @click="searchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['sys:log:export']" plain size="mini" type="info" @click="exportInfo">导出</el-button>
        <el-button v-has="['sys:log:delete']" :disabled="checkDeleteItem" plain size="mini" type="danger"
                   @click="remove">删除
        </el-button>
        <el-button v-has="['sys:log:clear']" plain size="mini" type="danger" @click="clear">清空全表</el-button>
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
          :formatter="(row, column) => this.getTableDictLabel()(row, column, 'LOG_TYPE')"
          label="日志类型"
          prop="logType"
          show-overflow-tooltip/>
        <el-table-column
          :formatter="(row, column) => this.getTableDictLabel()(row, column, 'DO_TYPE')"
          label="操作类型"
          prop="doType"/>
        <el-table-column
          label="请求类型"
          prop="requestType"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          :formatter="(row, column) => this.getTableDictLabel()(row, column, 'RESULT')"
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
            <el-button v-has="['sys:log:delete']" size="mini" type="text"
                       @click.native.prevent="removeItem(scope.$index, logTableData,scope.row)">
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
    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="40vw">
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
          {{ log.logTitle }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            日志类型
          </template>
          {{ this.getDescriptionsDictLabel()(log, 'logType', 'LOG_TYPE') }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            操作类型
          </template>
          {{ this.getDescriptionsDictLabel()(log, 'doType', 'DO_TYPE') }}
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
          {{ this.getDescriptionsDictLabel()(log, 'result', 'RESULT') }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </el-container>
</template>

<script>
import { clear, del, list } from '@/api/upms/log'
import { confirmAlert, DIALOG_TYPE } from '@/utils/constant'
import JSONBigInt from 'json-bigint'
import { mapGetters } from 'vuex'

export default {
  name: 'LogView',
  data () {
    return {
      // 当前操作类型
      dialogType: DIALOG_TYPE.ADD,
      // 弹出框标题
      title: '',
      // 单元格选中数据
      multipleSelectionLogId: [],
      // 日志表格数据
      logTableData: [],
      // 日志查询条件数据
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
      // 分页总数
      total: 0,
      // 标记删除按钮是否可以点击
      checkDeleteItem: true,
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
  mounted () {
    this.$toLoadDict(['LOG_TYPE', 'DO_TYPE', 'RESULT']).then((dict) => {
      this.reloadList()
    })
  },
  methods: {
    ...mapGetters('dict', ['getDict', 'getDescriptionsDictLabel', 'getTableDictLabel']),
    /**
     * 初始化加载表格数据
     */
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
    /**
     * 构造查询条件
     *
     * @returns {{result: string, logType: string, createBy: string, current: number, size: number, searchDate: string, doType: string, startDate: string, systemModule: string}}
     */
    buildParam () {
      return this.searchLogForm
    },
    /**
     * 分页大小切换
     *
     * @param size
     */
    handleSizeChange (size) {
      this.searchLogForm.size = size
      this.reloadList()
    },
    /**
     * 当前页切换
     *
     * @param current
     */
    handleCurrentChange (current) {
      this.searchLogForm.current = current
      this.reloadList()
    },
    /**
     * 查询按钮
     */
    search () {
      this.reloadList()
    },
    /**
     * 查询重置按钮
     */
    searchReset () {
      this.$refs.searchLogForm.resetFields()
    },
    /**
     * 平台表格复选框事件
     *
     * @param val
     */
    logHandleSelectionChange (val) {
      this.checkDeleteItem = !val.length
      this.multipleSelectionLogId = val
    },
    exportInfo () {
    },
    /**
     * 批量删除
     */
    remove () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelectionLogId.map((x) => ids.push(JSONBigInt.parse(x.id)))
        del(ids).then((rep) => {
          if (rep.code === 1) {
            this.reloadList()
            this.$message.success('删除成功')
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
    /**
     * 详情
     *
     * @param row
     */
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
