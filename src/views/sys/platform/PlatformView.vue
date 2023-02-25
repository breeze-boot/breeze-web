<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchPlatformForm" class="demo-form-inline" label-width="80px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="平台名称" prop="platformName">
              <el-input v-model="searchPlatformForm.platformName" clearable placeholder="平台名称"/>
            </el-form-item>
            <el-form-item label="平台编码" prop="platformCode">
              <el-input v-model="searchPlatformForm.platformCode" clearable placeholder="平台编码"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="searchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['sys:platform:create']" plain size="mini" type="primary" @click="create">新建</el-button>
        <el-button v-has="['sys:platform:delete']" plain size="mini" type="danger" @click="remove">删除</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="platformTableData"
        border
        empty-text="无数据"
        height="500"
        max-height="700"
        size="mini"
        stripe
        style="width: 100%"
        @selection-change="platformHandleSelectionChange">
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
          label="平台名称"
          prop="platformName"
          show-overflow-tooltip
          width="200">
        </el-table-column>
        <el-table-column
          label="平台编码"
          prop="platformCode"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="描述"
          prop="description"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="info(scope.row)">查看</el-button>
            <el-button v-has="['sys:platform:modify']" size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button v-has="['sys:platform:delete']" size="mini" type="text"
                       @click.native.prevent="removeItem(scope.$index, platformTableData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchPlatformForm.current"
          :page-size="searchPlatformForm.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>

    <el-dialog :title="title" :visible.sync="platformDialogVisible" width="800px"
               @close="closePlatformDialog('platformRuleForm')">
      <el-form ref="platformRuleForm" :model="platform" :rules="platformRules" size="mini">
        <el-form-item :label-width="formLabelWidth" label="平台名称" prop="platformName">
          <el-input v-model="platform.platformName" autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="平台编码" prop="platformCode">
          <el-input v-model="platform.platformCode" autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="描述" prop="description">
          <el-input v-model="platform.description" autocomplete="off" clearable type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetPlatformForm('platformRuleForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitPlatformForm('platformRuleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="800px"
               @close="closeInfoDialog">
      <el-descriptions :column="2" border size="mini">
        <el-descriptions-item>
          <template slot="label">
            平台名称
          </template>
          {{ platform.platformName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            平台编码
          </template>
          <el-tag size="small">{{ platform.platformCode }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            描述
          </template>
          {{ platform.description }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

  </el-container>
</template>

<script>
import { checkPlatformCode, del, list, modify, save } from '@/api/sys/platform'
import { confirmAlert, DIALOG_TYPE } from '@/utils/constant'
import JSONBigInt from 'json-bigint'

export default {
  name: 'PlatformView',
  data () {
    return {
      // 当前操作类型
      dialogType: DIALOG_TYPE.ADD,
      // 弹出框标题
      title: '',
      // 单元格选中数据
      multipleSelectionPlatformIds: [],
      // 平台表格数据
      platformTableData: [],
      // 平台查询条件数据
      searchPlatformForm: {
        platformName: '',
        platformCode: '',
        current: 1,
        size: 10
      },
      // 分页总数
      total: 0,
      // 平台添加修改弹出框
      platformDialogVisible: false,
      // 平台详情弹出框
      infoDialogVisible: false,
      // 表单标题宽度
      formLabelWidth: '80px',
      // 平台添加修改数据
      platform: {
        id: undefined,
        platformName: '',
        platformCode: '',
        description: ''
      },
      // 平台详情数据
      platformInfo: {
        id: undefined,
        platformName: '',
        platformCode: '',
        description: ''
      },
      // 平台添加修改表单规则
      platformRules: {
        platformName: [
          {
            required: true,
            message: '请输入平台名称',
            trigger: 'blur'
          }
        ],
        platformCode: [
          {
            required: true,
            message: '请输入平台编码',
            trigger: 'blur'
          }, {
            validator: (rule, value, callback) => {
              checkPlatformCode(value, this.platform.id).then((response) => {
                if (response.data) {
                  callback()
                  return
                }
                callback(new Error('编码重复'))
              })
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    // 初始化加载表格数据
    this.reloadList()
  },
  methods: {
    /**
     * 初始化加载表格数据
     */
    reloadList () {
      list(this.buildParam()).then((response) => {
        this.platformTableData = response.data.records
        this.searchPlatformForm.size = response.data.size
        this.searchPlatformForm.current = response.data.current
        this.total = response.data.total
      })
    },
    /**
     * 构造查询条件
     *
     * @returns {{current: number, size: number, platformName: string, platformCode: string}}
     */
    buildParam () {
      return this.searchPlatformForm
    },
    /**
     * 分页大小切换
     *
     * @param size
     */
    handleSizeChange (size) {
      this.searchPlatformForm.size = size
      this.reloadList()
    },
    /**
     * 当前页切换
     *
     * @param current
     */
    handleCurrentChange (current) {
      this.searchPlatformForm.current = current
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
     * 平台表格复选框事件
     *
     * @param val
     */
    platformHandleSelectionChange (val) {
      this.multipleSelectionPlatformIds = val
    },
    /**
     * 批量删除
     */
    remove () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelectionPlatformIds.map((x) => ids.push(JSONBigInt.parse(x.id)))
        del(ids).then(response => {
          if (response.code === 1) {
            this.$message.success('删除成功')
            this.reloadList()
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
      this.title = '创建平台'
      this.dialogType = DIALOG_TYPE.ADD
      this.platformDialogVisible = true
    },
    /**
     * 修改
     * @param row
     */
    edit (row) {
      this.title = '修改平台'
      this.dialogType = DIALOG_TYPE.EDIT
      this.platformDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.platform, row)
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
        Object.assign(this.platform, row)
      })
    },
    /**
     * 关闭平台添加修改弹出框事件
     *
     * @param formName
     */
    closePlatformDialog (formName) {
      this.platform.id = undefined
      this.$refs[formName].resetFields()
    },
    /**
     * 关闭详情弹出框事件
     */
    closeInfoDialog () {
      this.platform = this.platformInfo
    },
    /**
     * 添加修改弹出框提交
     *
     * @param formName
     */
    submitPlatformForm (formName) {
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
      this.platform.id = undefined
      save(this.platform).then((response) => {
        if (response.code === 1) {
          this.$message.success('添加成功')
          this.platformDialogVisible = false
          this.reloadList()
        }
      })
    },
    /**
     * 修改请求
     */
    modify () {
      modify(this.platform).then((response) => {
        if (response.code === 1) {
          this.$message.success('修改成功')
          this.platformDialogVisible = false
          this.reloadList()
        }
      })
    },
    /**
     * 添加修改弹出框重置
     *
     * @param formName
     */
    resetPlatformForm (formName) {
      this.platformDialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>
