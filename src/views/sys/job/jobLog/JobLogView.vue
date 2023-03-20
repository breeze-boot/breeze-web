<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchJobLogForm" class="demo-form-inline" label-width="80px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="日志时间" prop="searchDate">
              <el-date-picker
                v-model="searchJobLogForm.createTime"
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
        <el-button v-has="['sys:jobLog:delete']" :disabled="checkDeleteItem" plain size="mini" type="danger"
                   @click="remove">删除
        </el-button>
        <el-button v-has="['sys:jobLog:truncate']" plain size="mini" type="danger" @click="truncate">清空全表</el-button>
      </div>

      <el-table
        ref="multipleTable"
        :data="jobLogTableData"
        border
        height="60vh"
        size="mini"
        stripe
        style="width: 100%"
        @selection-change="jobLogHandleSelectionChange">
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
          label="状态"
          prop="status"
          show-overflow-tooltip/>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="info(scope.row)">查看</el-button>
            <el-button v-has="['sys:jobLog:delete']" size="mini" type="text"
                       @click.native.prevent="removeItem(scope.$index, jobLogTableData,scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchJobLogForm.current"
          :page-size="searchJobLogForm.size"
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
            任务名
          </template>
          {{ jobLog.jobName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            任务组名
          </template>
          {{ jobLog.jobGroupName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            调用的方法
          </template>
          {{ jobLog.clazzName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            日志信息
          </template>
          {{ jobLog.jobMessage }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            执行开始时间
          </template>
          {{ jobLog.createTime }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            执行结束时间
          </template>
          {{ jobLog.endTime }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            异常信息
          </template>
          {{ jobLog.exceptionInfo }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            状态
          </template>
          {{ this.getDescriptionsDictLabel()(jobLog, 'status', 'JOB_STATUS') }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </el-container>
</template>

<script>
import { truncate, del, list } from '@/api/sys/jobLog'
import { confirmAlert, DIALOG_TYPE } from '@/utils/constant'
import JSONBigInt from 'json-bigint'
import { mapGetters } from 'vuex'

export default {
  name: 'JobLogView',
  data () {
    return {
      // 当前操作类型
      dialogType: DIALOG_TYPE.ADD,
      // 弹出框标题
      title: '',
      // 单元格选中数据
      multipleSelectionJobLogId: [],
      // 日志表格数据
      jobLogTableData: [],
      // 日志查询条件数据
      searchJobLogForm: {
        jobName: this.$route.query.jobName,
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
      // 日志数据
      jobLog: {
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
  mounted () {
    this.$toLoadDict(['JOB_STATUS']).then((dict) => {
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
          this.jobLogTableData = rep.data.records
          this.searchJobLogForm.size = rep.data.size
          this.searchJobLogForm.current = rep.data.current
          this.total = rep.data.total
        }
      })
    },
    /**
     * 构造查询条件
     *
     * @returns {{current: number, size: number}}
     */
    buildParam () {
      return this.searchJobLogForm
    },
    /**
     * 分页大小切换
     *
     * @param size
     */
    handleSizeChange (size) {
      this.searchJobLogForm.size = size
      this.reloadList()
    },
    /**
     * 当前页切换
     *
     * @param current
     */
    handleCurrentChange (current) {
      this.searchJobLogForm.current = current
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
      this.$refs.searchJobLogForm.resetFields()
    },
    /**
     * 平台表格复选框事件
     *
     * @param val
     */
    jobLogHandleSelectionChange (val) {
      this.checkDeleteItem = !val.length
      this.multipleSelectionJobLogId = val
    },
    /**
     * 批量删除
     */
    remove () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelectionJobLogId.map((x) => ids.push(JSONBigInt.parse(x.id)))
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
    truncate () {
      confirmAlert(() => {
        truncate().then((rep) => {
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
        Object.assign(this.jobLog, row)
      })
    }
  }
}
</script>
