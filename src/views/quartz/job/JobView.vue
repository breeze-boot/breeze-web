<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchJobForm" class="demo-form-inline" label-width="80px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="任务名" prop="jobName">
              <el-input v-model="searchJobForm.jobName" clearable placeholder="任务名称"/>
            </el-form-item>
            <el-form-item label="任务组名" prop="jobGroupName">
              <el-select v-model="searchJobForm.jobGroupName" collapse-tags filterable placeholder="请选择任务组">
                <el-option
                  v-for="item in this.getDict()('JOB_GROUP')"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="searchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['sys:job:create']" plain size="mini" type="primary" @click="create">新建</el-button>
        <el-button v-has="['sys:job:delete']" :disabled="checkDeleteItem" plain size="mini" type="danger"
                   @click="remove">删除
        </el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="jobTableData"
        border
        empty-text="无数据"
        size="mini"
        stripe
        @selection-change="jobHandleSelectionChange">
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
          show-overflow-tooltip
          width="200"/>
        <el-table-column
          :formatter="(row, column) => this.getTableDictLabel()(row, column, 'JOB_GROUP')"
          label="任务组名"
          prop="jobGroupName"
          show-overflow-tooltip
          width="150"/>
        <el-table-column
          label="cron"
          prop="cronExpression"
          show-overflow-tooltip
          width="150">
          <template slot-scope="scope">
            <el-tag size="mini"> {{ scope.row.cronExpression }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="调用方法"
          prop="clazzName"
          show-overflow-tooltip
          width="300"/>
        <el-table-column
          :formatter="(row, column) => this.getTableDictLabel()(row, column, 'MISFIRE_POLICY')"
          label="执行策略"
          prop="misfirePolicy"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          :formatter="(row, column) => this.getTableDictLabel()(row, column, 'CONCURRENT')"
          label="并发"
          prop="concurrent"
          show-overflow-tooltip
          width="60"/>
        <el-table-column
          label="状态"
          prop="status"
          show-overflow-tooltip
          width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#AAAAAA"
              size="mini"
              @change="handleOpen(scope.$index, scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="270">
          <template slot-scope="scope">
            <el-button v-has="['sys:job:run']" size="mini" type="text" @click="runJobNow(scope.row)">运行一次
            </el-button>
            <el-button size="mini" type="text" @click="jobLog(scope.row)">查看运行情况</el-button>
            <el-button size="mini" type="text" @click="info(scope.row)">查看</el-button>
            <el-button v-has="['sys:job:modify']" size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button v-has="['sys:job:delete']" size="mini" type="text"
                       @click.native.prevent="removeItem(scope.$index, jobTableData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchJobForm.current"
          :page-size="searchJobForm.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>

    <el-dialog :title="title" :visible.sync="jobDialogVisible" width="40vw"
               @close="closeJobDialog('jobRuleForm')">
      <el-form ref="jobRuleForm" :model="job" :rules="jobRules" size="mini">
        <el-form-item :label-width="formLabelWidth" label="任务名" prop="jobName">
          <el-input v-model="job.jobName" autocomplete="off" clearable placeholder="请输入任务名"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="任务组名" prop="jobGroupName">
          <el-select v-model="job.jobGroupName" collapse-tags filterable placeholder="请选择任务组">
            <el-option
              v-for="item in this.getDict()('JOB_GROUP')"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="cron" prop="cronExpression">
          <el-input v-model="job.cronExpression" autocomplete="off" clearable placeholder="请设置cron表达式"
                    style="width: 500px;"/>
          <el-button type="primary" @click="showDialog">生成 cron</el-button>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="调用方法" prop="clazzName">
          <el-input v-model="job.clazzName" autocomplete="off" clearable
                    placeholder="请设置执行方法【全类名.方法名('string',1, true, 1D, 1L)】或【Bean名.方法名('string',1, true, 1D, 1L)】"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="执行策略" prop="misfirePolicy">
          <el-radio-group v-model="job.misfirePolicy">
            <el-radio :label="-1">立刻执行</el-radio>
            <el-radio :label="1">执行一次（默认）</el-radio>
            <el-radio :label="2">放弃执行</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="并发" prop="concurrent">
          <el-switch
            v-model="job.concurrent"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#AAAAAA">
          </el-switch>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="状态" prop="status">
          <el-switch
            v-model="job.status"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#AAAAAA">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetJobForm('jobRuleForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitJobForm('jobRuleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="40vw"
               @close="closeInfoDialog">
      <el-descriptions :column="2" border size="mini">
        <el-descriptions-item label="任务名">
          {{ job.jobName }}
        </el-descriptions-item>
        <el-descriptions-item label="任务组名">
          {{ job.jobGroupName }}
        </el-descriptions-item>
        <el-descriptions-item label="cron">
          <el-tag size="small">{{ job.cronExpression }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="调用方法">
          {{ job.clazzName }}
        </el-descriptions-item>
        <el-descriptions-item label="执行策略">
          {{ this.getDescriptionsDictLabel()(job, 'misfirePolicy', 'MISFIRE_POLICY') }}
        </el-descriptions-item>
        <el-descriptions-item label="并发">
          {{ this.getDescriptionsDictLabel()(job, 'concurrent', 'CONCURRENT') }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          {{ this.getDescriptionsDictLabel()(job, 'status', 'JOB_STATUS') }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog :visible.sync="cronDialogVisible" title="生成 cron">
      <vcrontab :expression="dialogCron" @fill="crontabFill" @hide="cronDialogVisible=false"></vcrontab>
    </el-dialog>
  </el-container>
</template>

<script>
import { del, list, modify, open, runJobNow, save } from '@/api/quartz/job'
import { DIALOG_TYPE } from '@/const/constant'
import JSONBigInt from 'json-bigint'
import vcrontab from 'vcrontab'
import { dict } from '@/mixins'
import { confirmAlert } from '@utils/common'

export default {
  components: { vcrontab },
  mixins: [dict],
  name: 'JobView',
  data () {
    return {
      // 此页面需要自字典编码
      dictCode: ['MISFIRE_POLICY', 'JOB_GROUP', 'CONCURRENT', 'JOB_STATUS'],
      // 当前操作类型
      dialogType: DIALOG_TYPE.ADD,
      // 弹出框标题
      title: '',
      // 单元格选中数据
      multipleSelectionJobIds: [],
      // 任务表格数据
      jobTableData: [],
      // 任务查询条件数据
      searchJobForm: {
        jobName: '',
        jobGroupName: '',
        current: 1,
        size: 10
      },
      // 分页总数
      total: 0,
      // 标记删除按钮是否可以点击
      checkDeleteItem: true,
      // 任务添加修改弹出框
      jobDialogVisible: false,
      // 任务详情弹出框
      infoDialogVisible: false,
      // cron生成弹出框
      cronDialogVisible: false,
      // 表单标题宽度
      formLabelWidth: '80px',
      // 任务添加修改数据
      job: {
        id: undefined,
        jobName: '',
        jobGroupName: '',
        cronExpression: '',
        clazzName: '',
        misfirePolicy: 2,
        concurrent: 0,
        status: 0
      },
      // 任务详情数据
      jobInfo: {
        id: undefined,
        jobName: '',
        jobGroupName: '',
        cronExpression: '',
        clazzName: '',
        misfirePolicy: 2,
        concurrent: 0,
        status: 0
      },
      // 任务添加修改表单规则
      jobRules: {
        jobName: [
          {
            required: true,
            message: '请输入任务名称',
            trigger: 'blur'
          }
        ],
        jobGroupName: [
          {
            required: true,
            message: '请选择任务组名',
            trigger: 'change'
          }
        ],
        clazzName: [
          {
            required: true,
            message: '请输入执行类名.方法(参数)',
            trigger: 'blur'
          }
        ],
        cronExpression: [
          {
            required: true,
            message: '请设置cron表达式',
            trigger: 'blur'
          }
        ]
      },
      // cron dialog 表单
      dialogCron: ''
    }
  },
  created () {
    // 初始化加载表格数据
    this.reloadList()
  },
  methods: {
    /**
     * 初始化加载表格数据
     */
    reloadList () {
      list(this.buildParam()).then((response) => {
        this.jobTableData = response.data.records
        this.searchJobForm.size = response.data.size
        this.searchJobForm.current = response.data.current
        this.total = response.data.total
      })
    },
    /**
     * 构造查询条件
     *
     * @returns {{current: number, size: number, jobName: string, jobGroupName: string}}
     */
    buildParam () {
      return this.searchJobForm
    },
    /**
     * 分页大小切换
     *
     * @param size
     */
    handleSizeChange (size) {
      this.searchJobForm.size = size
      this.reloadList()
    },
    /**
     * 当前页切换
     *
     * @param current
     */
    handleCurrentChange (current) {
      this.searchJobForm.current = current
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
      this.$refs.searchForm.resetFields()
    },
    /**
     * 任务表格复选框事件
     *
     * @param val
     */
    jobHandleSelectionChange (val) {
      this.checkDeleteItem = !val.length
      this.multipleSelectionJobIds = val
    },
    /**
     * 批量删除
     */
    remove () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelectionJobIds.map((x) => ids.push(JSONBigInt.parse(x.id)))
        del(ids).then(response => {
          if (response.code === 1) {
            this.reloadList()
            this.$message.success('删除成功')
          }
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
    removeItem (index, rows, row) {
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
     * 创建
     */
    create () {
      this.title = '创建任务'
      this.dialogType = DIALOG_TYPE.ADD
      this.jobDialogVisible = true
    },
    /**
     * 修改
     * @param row
     */
    edit (row) {
      this.title = '修改任务'
      this.dialogType = DIALOG_TYPE.EDIT
      this.jobDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.job, row)
      })
    },
    /**
     * 详情
     *
     * @param row
     */
    info (row) {
      this.title = '查看信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.infoDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.job, row)
      })
    },
    /**
     * 关闭任务添加修改弹出框事件
     *
     * @param formName
     */
    closeJobDialog (formName) {
      this.job.id = undefined
      this.$refs[formName].resetFields()
    },
    /**
     * 关闭详情弹出框事件
     */
    closeInfoDialog () {
      this.job = this.jobInfo
    },
    /**
     * 添加修改弹出框提交
     *
     * @param formName
     */
    submitJobForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogType === DIALOG_TYPE.ADD ? this.save() : this.modify()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 保存请求
     */
    save () {
      this.job.id = undefined
      save(this.job).then((response) => {
        if (response.code === 1) {
          this.$message.success('添加成功')
          this.jobDialogVisible = false
          this.reloadList()
        }
      })
    },
    /**
     * 修改请求
     */
    modify () {
      modify(this.job).then((response) => {
        if (response.code === 1) {
          this.$message.success('修改成功')
          this.jobDialogVisible = false
          this.reloadList()
        }
      })
    },
    runJobNow (row) {
      confirmAlert(() => {
        runJobNow(row.id).then((response) => {
          if (response.code === 1) {
            this.$message.success('运行成功')
          }
        })
      }, '是否运行一次')
    },
    jobLog (row) {
      this.$router.push({
        name: 'jLog',
        query: {
          jobName: row.jobName
        }
      })
    },
    /**
     * 添加修改弹出框重置
     *
     * @param formName
     */
    resetJobForm (formName) {
      this.jobDialogVisible = false
      this.$refs[formName].resetFields()
    },
    /**
     * 开启
     *
     * @param index
     * @param row
     */
    handleOpen (index, row) {
      open(row.id, row.status).then((response) => {
        if (response.code === 1) {
          this.$message.success(response.message)
        }
      })
    },
    /**
     * 回显 CRON
     *
     * @param value
     */
    crontabFill (value) {
      // 确定后回传的值
      this.job.cronExpression = value
    },
    /**
     * 显示 cron dialog
     */
    showDialog () {
      this.dialogCron = this.job.cronExpression
      this.cronDialogVisible = true
    }
  }
}
</script>
