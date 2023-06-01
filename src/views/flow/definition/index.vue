<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchDefinition" class="demo-form-inline"
               label-width="100px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="流程名称" prop="repositoryName">
              <el-input v-model="searchDefinition.name" clearable placeholder="名称"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch()">查询</el-button>
              <el-button type="info" @click="handleSearchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['flow:definition:create']" plain size="mini" type="primary" @click="handleCreate">新建</el-button>
      </div>
      <el-table
        ref="definitionTable"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
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
            <el-button v-has="['flow:instance:start']" size="mini" type="text" @click="handleStartProcess(scope.row)">
              开启
            </el-button>
            <el-button v-has="['flow:designer']" size="mini" type="text" @click="handleLatestProcessDesigner(scope.row)">
              设计
            </el-button>
            <el-button v-has="['flow:definition:info']" size="mini" type="text" @click="handleViewImage(scope.row)">流程图片
            </el-button>
            <el-button v-has="['flow:definition:info']" size="mini" type="text" @click="handleViewVersion(scope.row)">查看版本
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchDefinition.current"
          :page-size="searchDefinition.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>

    <el-dialog :title="title" :visible.sync="definitionDialogVisible" width="40vw"
               @close="handleCloseDefinitionDialog('definitionForm')">
      <el-form ref="definitionForm" :model="definition" :rules="definitionRules" size="mini">
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCancelDefinitionForm('definitionForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitDefinitionForm('definitionForm')">确 定
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
            <el-button v-has="['flow:definition:info']" size="mini" type="text" @click="handleViewVersionImage(scope.row)">
              流程图片
            </el-button>
            <el-button v-has="['flow:designer']" size="mini" type="text" @click="handleVersionProcessDesigner(scope.row)">
              设计
            </el-button>
            <el-button v-has="['flow:definition:suspended']" size="mini" type="text" @click="handleIsSuspended(scope.row)">
              {{ scope.row.suspended ? '激活' : '挂起' }}
            </el-button>
            <el-button v-has="['flow:definition:delete']" size="mini" type="text"
                       @click.native.prevent="handleRemoveItem(scope.$index, definitionTableData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchDefinition.current"
          :page-size="searchDefinition.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="80vw"
               @close="handleCloseInfoDialog">
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
  name: 'Definition',
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
      searchDefinition: {
        name: '',
        current: 1,
        size: 10
      },
      // 分页总数
      total: 0,
      // 标记删除按钮是否可以点击
      checkDelete: true,
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
        this.searchDefinition.size = response.data.size
        this.searchDefinition.current = response.data.current
        this.total = response.data.total
      })
    },
    /**
     * 构造查询条件
     *
     * @returns {{current: number, size: number, name: string}}
     */
    buildParam () {
      return this.searchDefinition
    },
    /**
     * 分页大小切换
     *
     * @param size
     */
    handleSizeChange (size) {
      this.searchDefinition.size = size
      this.reloadList()
    },
    /**
     * 当前页切换
     *
     * @param current
     */
    handleCurrentChange (current) {
      this.searchDefinition.current = current
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
     * 删除行
     *
     * @param index
     * @param rows
     * @param row
     */
    handleRemoveItem (index, rows, row) {
      confirmAlert(() => {
        del(row.deploymentId).then(response => {
          if (response.code === 1) {
            rows.splice(index, 1)
            this.reloadList()
            this.handleViewVersion(this.currentRowData)
            this.$message.success('删除成功')
          }
        })
      })
    },
    /**
     * 创建
     */
    handleCreate () {
      this.$router.push({ name: 'designer' })
    },
    /**
     * 设计
     *
     * @param row
     */
    handleLatestProcessDesigner (row) {
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
    handleVersionProcessDesigner (row) {
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
    handleIsSuspended (row) {
      isSuspended(row.id).then(response => {
        this.reloadList()
        this.handleViewVersion(this.currentRowData)
      })
    },
    /**
     * 获取流程定义png
     *
     * @param row
     */
    handleViewImage (row) {
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
    handleViewVersionImage (row) {
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
    handleViewVersion (row) {
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
    handleStartProcess (row) {
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
    handleCloseDefinitionDialog (formName) {
      this.definition.id = undefined
      this.$refs[formName].resetFields()
    },
    /**
     * 关闭详情弹出框事件
     */
    handleCloseInfoDialog () {
      this.definition = this.definitionInfo
    },
    /**
     * 添加修改弹出框提交
     *
     * @param formName
     */
    handleSubmitDefinitionForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogType === DIALOG_TYPE.ADD ? this.handleSave() : this.handleModify()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 保存请求
     */
    handleSave () {
      this.definition.id = undefined
    },
    /**
     * 修改请求
     */
    handleModify () {
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
    handleCancelDefinitionForm (formName) {
      this.definitionDialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>
