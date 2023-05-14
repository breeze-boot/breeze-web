<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchDefinitionForm" class="demo-form-inline"
               label-width="100px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="流程名称" prop="repositoryName">
              <el-input v-model="searchDefinitionForm.name" clearable placeholder="名称"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="searchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['flow:definition:create']" plain size="mini" type="primary" @click="create">新建</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="definitionTableData"
        border
        empty-text="无数据"
        size="mini"
        stripe>
        <el-table-column
          label="ID"
          prop="id"
          show-overflow-tooltip
          width="200"/>
        <el-table-column
          label="名称"
          prop="name"
          show-overflow-tooltip
          width="200"/>
        <el-table-column
          label="分类"
          prop="category"
          show-overflow-tooltip
          width="200"/>
        <el-table-column
          label="版本"
          prop="version"
          show-overflow-tooltip
          width="200">
          <template slot-scope="scope">
            <el-tag size="mini">
              {{ scope.row.version }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="当前版本状态"
          prop="suspended"
          show-overflow-tooltip
          width="200">
          <template slot-scope="scope">
            <el-tag size="mini">
              {{ scope.row.suspended ? '激活' : '挂起' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="key"
          prop="key"
          show-overflow-tooltip
          width="200">
          <template slot-scope="scope">
            <el-tag size="mini">
              {{ scope.row.key }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="部署时间"
          prop="deploymentTime"
          show-overflow-tooltip/>
        <el-table-column
          fixed="right"
          label="操作"
          width="240">
          <template slot-scope="scope">
            <el-button v-has="['flow:instance:start']" size="mini" type="text" @click="startProcess(scope.row)">
              开启
            </el-button>
            <el-button v-has="['flow:designer']" size="mini" type="text" @click="latestProcessDesigner(scope.row)">
              设计
            </el-button>
            <el-button v-has="['flow:definition:info']" size="mini" type="text" @click="viewImage(scope.row)">流程图片
            </el-button>
            <el-button v-has="['flow:definition:info']" size="mini" type="text" @click="viewVersion(scope.row)">查看版本
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchDefinitionForm.current"
          :page-size="searchDefinitionForm.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>

    <el-dialog :title="title" :visible.sync="definitionDialogVisible" width="40vw"
               @close="closeDefinitionDialog('definitionRuleForm')">
      <el-form ref="definitionRuleForm" :model="definition" :rules="definitionRules" size="mini">
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetDefinitionForm('definitionRuleForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitDefinitionForm('definitionRuleForm')">确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="definitionVersionDialogVisible" width="80vw">
      <el-table
        ref="multipleVersionDefinitionTable"
        :data="versionDefinitionTableData"
        border
        empty-text="无数据"
        size="mini"
        stripe>
        <el-table-column
          label="ID"
          prop="id"
          show-overflow-tooltip
          width="200"/>
        <el-table-column
          label="名称"
          prop="name"
          show-overflow-tooltip
          width="200"/>
        <el-table-column
          label="流程资源分类"
          prop="category"
          show-overflow-tooltip
          width="200"/>
        <el-table-column
          label="版本"
          prop="version"
          show-overflow-tooltip
          width="80">
          <template slot-scope="scope">
            <el-tag size="mini">
              {{ scope.row.version }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="key"
          prop="key"
          show-overflow-tooltip
          width="200"/>
        <el-table-column
          label="版本"
          prop="version"
          show-overflow-tooltip
          width="200"/>
        <el-table-column
          label="状态"
          prop="suspended"
          show-overflow-tooltip
          width="200">
          <template slot-scope="scope">
            <el-tag size="mini">
              {{ scope.row.suspended ? '挂起' : '激活' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="资源名称"
          prop="resourceName"
          show-overflow-tooltip/>
        <el-table-column
          label="图片资源名称"
          prop="diagramResourceName"
          show-overflow-tooltip/>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button v-has="['flow:definition:info']" size="mini" type="text" @click="viewVersionImage(scope.row)">
              流程图片
            </el-button>
            <el-button v-has="['flow:designer']" size="mini" type="text" @click="versionProcessDesigner(scope.row)">
              设计
            </el-button>
            <el-button v-has="['flow:definition:suspended']" size="mini" type="text" @click="isSuspended(scope.row)">
              {{ scope.row.suspended ? '激活' : '挂起' }}
            </el-button>
            <el-button v-has="['flow:definition:delete']" size="mini" type="text"
                       @click.native.prevent="removeItem(scope.$index, definitionTableData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchDefinitionForm.current"
          :page-size="searchDefinitionForm.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="80vw"
               @close="closeInfoDialog">
      <el-descriptions :column="24" border direction="vertical" size="mini">
        <el-descriptions-item label="流程名称" >
          {{ definition.name }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="24" border direction="vertical" size="mini">
        <el-descriptions-item label="流程图片">
          <el-image :src="definition.imagePng"/>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </el-container>
</template>

<script>
import {
  del,
  getProcessDefinitionPng,
  getVersionProcessDefinitionPng,
  isSuspended,
  list,
  listVersion,
  modify
} from '@/api/flow/definition'
import { DIALOG_TYPE } from '@/const/constant'
import { startProcess } from '@/api/flow/instance'
import { confirmAlert } from '@utils/common'

export default {
  name: 'DefinitionView',
  data () {
    return {
      // 弹出框标题
      title: '',
      // 当前点击的行数据
      currentRowData: [],
      // 流程定义表格数据
      definitionTableData: [],
      // 流程定义版本表格数据
      versionDefinitionTableData: [],
      // 流程查询条件数据
      searchDefinitionForm: {
        name: '',
        current: 1,
        size: 10
      },
      // 分页总数
      total: 0,
      // 标记删除按钮是否可以点击
      checkDeleteItem: true,
      // 流程定义添加修改弹出框
      definitionDialogVisible: false,
      // 流程定义版本修改弹出框
      definitionVersionDialogVisible: false,
      // 流程定义详情弹出框
      infoDialogVisible: false,
      // 表单标题宽度
      formLabelWidth: '110px',
      // 流程添加修改数据
      definition: {
        id: undefined,
        name: '',
        imagePng: ''
      },
      // 流程详情数据
      definitionInfo: {
        id: undefined,
        name: '',
        imagePng: ''
      },
      // 流程添加修改表单规则
      definitionRules: {
        name: [
          {
            required: true,
            message: '请输入流程名称',
            trigger: 'blur'
          }
        ]
      }
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
        this.definitionTableData = response.data.records
        this.searchDefinitionForm.size = response.data.size
        this.searchDefinitionForm.current = response.data.current
        this.total = response.data.total
      })
    },
    /**
     * 构造查询条件
     *
     * @returns {{current: number, size: number, name: string}}
     */
    buildParam () {
      return this.searchDefinitionForm
    },
    /**
     * 分页大小切换
     *
     * @param size
     */
    handleSizeChange (size) {
      this.searchDefinitionForm.size = size
      this.reloadList()
    },
    /**
     * 当前页切换
     *
     * @param current
     */
    handleCurrentChange (current) {
      this.searchDefinitionForm.current = current
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
     * 删除行
     *
     * @param index
     * @param rows
     * @param row
     */
    removeItem (index, rows, row) {
      confirmAlert(() => {
        del(row.deploymentId).then(response => {
          if (response.code === 1) {
            rows.splice(index, 1)
            this.reloadList()
            this.viewVersion(this.currentRowData)
            this.$message.success('删除成功')
          }
        })
      })
    },
    /**
     * 创建
     */
    create () {
      this.$router.push({ name: 'designer' })
    },
    /**
     * 设计
     *
     * @param row
     */
    latestProcessDesigner (row) {
      this.$nextTick(() => {
        this.$router.push({
          name: 'designer',
          query: {
            processKey: row.key,
            tenantId: row.tenantId
          }
        })
      })
    },
    /**
     * 设计
     *
     * @param row
     */
    versionProcessDesigner (row) {
      this.$nextTick(() => {
        this.$router.push({
          name: 'designer',
          query: {
            processDefinitionId: row.id,
            tenantId: row.tenantId
          }
        })
      })
    },
    /**
     * 挂起
     *
     * @param row
     */
    isSuspended (row) {
      isSuspended(row.id).then(response => {
        this.reloadList()
        this.viewVersion(this.currentRowData)
      })
    },
    /**
     * 获取流程定义png
     *
     * @param row
     */
    viewImage (row) {
      this.title = '流程图片'
      this.dialogType = DIALOG_TYPE.SHOW
      this.infoDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.definition, row)
        getProcessDefinitionPng(row.key, row.tenantId).then(response => {
          this.definition.imagePng = response.data
        })
      })
    },
    /**
     * 获取各个版本流程定义png
     *
     * @param row
     */
    viewVersionImage (row) {
      this.title = '流程图片'
      this.dialogType = DIALOG_TYPE.SHOW
      this.infoDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.definition, row)
        getVersionProcessDefinitionPng(row.id, row.tenantId).then(response => {
          this.definition.imagePng = response.data
        })
      })
    },
    /**
     * 查看版本
     *
     * @param row
     */
    viewVersion (row) {
      this.currentRowData = row
      this.definitionVersionDialogVisible = true
      const data = {}
      listVersion(data).then(response => {
        this.versionDefinitionTableData = response.data.records
        this.$refs.multipleVersionDefinitionTable.doLayout()
      })
    },
    /**
     * 流程部署
     *
     * @param row
     */
    startProcess (row) {
      startProcess({
        processKey: row.key,
        tenantId: row.tenantId
      }).then(response => {
        this.$message.success('部署成功')
      })
    },
    /**
     * 关闭流程添加修改弹出框事件
     *
     * @param formName
     */
    closeDefinitionDialog (formName) {
      this.definition.id = undefined
      this.$refs[formName].resetFields()
    },
    /**
     * 关闭详情弹出框事件
     */
    closeInfoDialog () {
      this.definition = this.definitionInfo
    },
    /**
     * 添加修改弹出框提交
     *
     * @param formName
     */
    submitDefinitionForm (formName) {
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
      this.definition.id = undefined
    },
    /**
     * 修改请求
     */
    modify () {
      modify(this.definition).then((response) => {
        if (response.code === 1) {
          this.$message.success('修改成功')
          this.definitionDialogVisible = false
          this.reloadList()
        }
      })
    },
    /**
     * 添加修改弹出框重置
     *
     * @param formName
     */
    resetDefinitionForm (formName) {
      this.definitionDialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>
