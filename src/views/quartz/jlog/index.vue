<template>
  <base-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchJobLog" class="demo-form-inline" label-width="80px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="日志时间" prop="searchDate">
              <el-date-picker
                v-model="searchJobLog.searchDate"
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
        <el-button v-has="['sys:jLog:delete']" :disabled="checkDelete" plain size="mini" type="danger"
                   @click="handleRemove">删除
        </el-button>
        <el-button v-has="['sys:jLog:truncate']" plain size="mini" type="danger" @click="handleTruncate">清空全表</el-button>
      </div>

      <el-table
        ref="jlogTable"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        :data="jobLogTableData"
        border
        height="60vh"
        size="mini"
        stripe
        @selection-change="handleJobLogSelectionChange">
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
          label="任务名"
          prop="jobName"
          width="180"/>
        <el-table-column
          label="任务组名"
          prop="jobGroupName"
          show-overflow-tooltip
          width="180"/>
        <el-table-column
          label="cron"
          prop="cronExpression"/>
        <el-table-column
          label="调用的方法"
          prop="clazzName"
          show-overflow-tooltip/>
        <el-table-column
          label="日志信息"
          prop="jobMessage"
          show-overflow-tooltip/>
        <el-table-column
          label="执行开始时间"
          prop="createTime"
          show-overflow-tooltip/>
        <el-table-column
          label="执行结束时间"
          prop="endTime"
          show-overflow-tooltip/>
        <el-table-column
          label="异常信息"
          prop="exceptionInfo"
          show-overflow-tooltip/>
        <el-table-column
          :formatter="(row, column) => this.column()(row, column, 'JOB_STATUS')"
          label="状态"
          prop="jobStatus"
          show-overflow-tooltip/>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleInfo(scope.row)">查看</el-button>
            <el-button v-has="['sys:jLog:delete']" size="mini" type="text"
                       @click.native.prevent="handleRemoveItem(scope.$index, jobLogTableData,scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchJobLog.current"
          :page-size="searchJobLog.size"
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
        <el-descriptions-item label="任务名">
          {{ jLog.jobName }}
        </el-descriptions-item>
        <el-descriptions-item label="任务组名">
          {{ jLog.jobGroupName }}
        </el-descriptions-item>
        <el-descriptions-item label="调用的方法">
          {{ jLog.clazzName }}
        </el-descriptions-item>
        <el-descriptions-item label="日志信息">
          {{ jLog.jobMessage }}
        </el-descriptions-item>
        <el-descriptions-item label="执行开始时间">
          {{ jLog.createTime }}
        </el-descriptions-item>
        <el-descriptions-item label="执行结束时间">
          {{ jLog.endTime }}
        </el-descriptions-item>
        <el-descriptions-item label="异常信息">
          {{ jLog.exceptionInfo }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          {{ this.descriptions()(jLog, 'jobStatus', 'JOB_STATUS') }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </base-container>
</template>

<script>
import { del, list, truncate } from '@/api/quartz/jlog'
import { confirmAlert } from '@utils/common'
import { DIALOG_TYPE } from '@/const/constant'
import JSONBigInt from 'json-bigint'
import { dict } from '@/mixins'

export default {
  name: 'JobLog',
  mixins: [dict],
  data () {
    return {
      // 此页面需要字典编码
      dictCode: ['MSG_LEVEL', 'JOB_STATUS'],
      // 当前操作类型
      dialogType: DIALOG_TYPE.ADD,
      // 弹出框标题
      title: '',
      // 单元格选中数据
      multipleSelectionJobLogId: [],
      // 日志表格数据
      jobLogTableData: [],
      // 日志查询条件数据
      searchJobLog: {
        jobName: this.$route.query.jobName,
        searchDate: '',
        stateDate: '',
        endDate: '',
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
      // 日志数据
      jLog: {
        id: undefined,
        jobName: '',
        jobGroupName: '',
        createTime: '',
        endTime: '',
        status: '',
        exceptionInfo: '',
        jobMessage: '',
        clazzName: ''
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
        if (response.data) {
          this.jobLogTableData = response.data.records
          this.searchJobLog.size = response.data.size
          this.searchJobLog.current = response.data.current
          this.total = response.data.total
        }
      })
    },
    /**
     * 构造查询条件
     *
     * @returns {{current: number, size: number}}
     */
    buildParam () {
      this.searchJobLog.startDate = this.searchJobLog.searchDate[0]
      this.searchJobLog.endDate = this.searchJobLog.searchDate[1]
      return this.searchJobLog
    },
    /**
     * 分页大小切换
     *
     * @param size
     */
    handleSizeChange (size) {
      this.searchJobLog.size = size
      this.reloadList()
    },
    /**
     * 当前页切换
     *
     * @param current
     */
    handleCurrentChange (current) {
      this.searchJobLog.current = current
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
      this.$refs.searchJobLog.resetFields()
      this.reloadList()
    },
    /**
     * 平台表格复选框事件
     *
     * @param val
     */
    handleJobLogSelectionChange (val) {
      this.checkDelete = !val.length
      this.multipleSelectionJobLogId = val
    },
    /**
     * 批量删除
     */
    handleRemove () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelectionJobLogId.map((x) => ids.push(JSONBigInt.parse(x.id)))
        del(ids).then((response) => {
          this.reloadList()
          this.$message.success('删除成功')
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
          rows.splice(index, 1)
          this.reloadList()
          this.$message.success('删除成功')
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
        Object.assign(this.jLog, row)
      })
    }
  }
}
</script>
