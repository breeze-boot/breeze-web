<template>
  <base-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchDept" class="demo-form-inline" label-width="80px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="searchDept.deptName" clearable placeholder="部门名称"/>
            </el-form-item>
            <el-form-item label="部门编号" prop="deptCode">
              <el-input v-model="searchDept.deptCode" clearable placeholder="部门编号"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch()">查询</el-button>
              <el-button type="info" @click="handleSearchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['auth:dept:create']" plain size="mini" type="primary" @click="handleCreate">新建</el-button>
      </div>
      <el-table
        ref="deptTable"
        :header-cell-style="{ textAlign: 'left'}"
        :cell-style="{ textAlign: 'left'}"
        :data="deptTableData"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        border
        row-key="id"
        size="mini"
        stripe
        @selection-change="handleDeptSelectionChange">
        <el-table-column
          v-if="false"
          label="ID"
          prop="id"
          width="200">
        </el-table-column>
        <el-table-column
          label="部门名称"
          prop="deptName">
        </el-table-column>
        <el-table-column
          label="部门编码"
          prop="deptCode">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleInfo(scope.row)">查看</el-button>
            <el-button v-has="['auth:dept:create']" size="mini" type="text" @click="handleCreate(scope.row)">新建
            </el-button>
            <el-button v-has="['auth:dept:modify']" size="mini" type="text" @click="handleEdit(scope.row)">编辑
            </el-button>
            <el-button v-has="['auth:dept:delete']" size="mini" type="text"
                       @click.native.prevent="handleRemoveItem(deptTableData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <el-dialog :title="title" :visible.sync="deptDialogVisible" width="600px"
               @close="handleCloseDeptDialog('deptForm')">
      <el-form ref="deptForm" :model="dept" :rules="deptRules" size="mini">
        <el-form-item :label-width="formLabelWidth" class="parentId" label="上级部门" prop="parentId">
          <el-cascader
            v-model="dept.parentId"
            :options="deptOption"
            :props="{ checkStrictly: true, emitPath: false , value: 'value', label: 'label' }"
            :show-all-levels="false"
            clearable
            filterable
          ></el-cascader>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="部门名称" prop="deptName">
          <el-input v-model="dept.deptName" autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="部门编码" prop="deptCode">
          <el-input v-model="dept.deptCode" autocomplete="off" clearable/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCancelDeptForm('deptForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitDeptForm('deptForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="600px" @close="handleCloseInfoDialog">
      <el-descriptions :column="1" border size="mini">
        <el-descriptions-item label="部门编码">
          {{ dept.deptCode }}
        </el-descriptions-item>
        <el-descriptions-item label="部门名称">
          <el-tag size="small">{{ dept.deptName }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </base-container>
</template>

<script>
import { checkDeptCode, del, list, modify, save, selectDept } from '@/api/auth/dept'
import { confirmAlert } from '@utils/common'
import { DIALOG_TYPE, ROOT } from '@/const/constant'
import JSONBigInt from 'json-bigint'

export default {
  name: 'Dept',
  data () {
    return {
      // 当前操作类型
      dialogType: DIALOG_TYPE.ADD,
      // 弹出框标题
      title: '',
      // 单元格选中数据
      selectionDeptIds: [],
      // 部门表格数据
      deptTableData: [],
      // 部门下拉框数据
      deptOption: [],
      // 部门查询条件数据
      searchDept: {
        deptName: '',
        deptCode: ''
      },
      // 部门添加修改弹出框
      deptDialogVisible: false,
      // 部门详情弹出框
      infoDialogVisible: false,
      // 表单标题宽度
      formLabelWidth: '80px',
      // 部门添加修改数据
      dept: {
        id: undefined,
        parentId: ROOT,
        deptName: '',
        deptCode: ''
      },
      // 部门详情数据
      deptInfo: {
        id: undefined,
        parentId: ROOT,
        deptName: '',
        deptCode: ''
      },
      // 部门添加修改数据
      deptRules: {
        deptName: [
          {
            required: true,
            message: '请输入部门名称',
            trigger: 'blur'
          }
        ],
        deptCode: [
          {
            required: true,
            message: '请输入部门编码',
            trigger: 'blur'
          }, {
            validator: (rule, value, callback) => {
              checkDeptCode(value, this.dept.id).then((response) => {
                if (response.data) {
                  callback()
                  return
                }
                callback(new Error('编码重复'))
              })
            },
            trigger: 'blur'
          }]
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
          this.deptTableData = response.data
        }
      })
    },
    /**
     * 构造查询条件
     *
     * @returns {{deptName: string, deptCode: string}}
     */
    buildParam () {
      return this.searchDept
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
     * 部门表格复选框事件
     *
     * @param val
     */
    handleDeptSelectionChange (val) {
      this.selectionDeptIds = val
    },
    /**
     * 删除行
     *
     * @param rows
     * @param row
     */
    handleRemoveItem (rows, row) {
      confirmAlert(() => {
        del(JSONBigInt.parse(row.id)).then(response => {
          this.handleDeleteTreeTableData(rows, row)
        })
      })
    },
    /**
     * 删除树形逻辑
     *
     * @param rows
     * @param row
     */
    handleDeleteTreeTableData (rows, row) {
      for (let index = 0; index < rows.length; index++) {
        if (rows[index].id === row.id) {
          rows.splice(index, 1)
          return
        }
        const tempTable = rows[index]
        if (tempTable.children && tempTable.children.length > 0) {
          this.handleDeleteTreeTableData(tempTable.children, row)
        }
      }
    },
    /**
     * 创建
     */
    handleCreate (row) {
      this.title = '创建部门'
      // 赋值
      this.dialogType = DIALOG_TYPE.ADD
      this.$nextTick(() => {
        this.dept.parentId = row.id ? row.id : ''
        this.selectDept()
      })
      this.deptDialogVisible = true
    },
    /**
     * 修改
     * @param row
     */
    handleEdit (row) {
      this.title = '修改部门信息'
      this.dialogType = DIALOG_TYPE.EDIT
      this.$nextTick(() => {
        Object.assign(this.dept, row)
        this.dept.parentId = row.parentId
        this.selectDept(this.dept.id)
      })
      this.deptDialogVisible = true
    },
    /**
     * 详情
     *
     * @param row
     */
    handleInfo (row) {
      this.title = '查看部门信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.$nextTick(() => {
        Object.assign(this.dept, row)
        this.dept.parentId = row.parentId
        this.selectDept()
      })
      this.infoDialogVisible = true
    },
    /**
     * 关闭部门添加修改弹出框事件
     *
     * @param formName
     */
    handleCloseDeptDialog (formName) {
      this.dept.id = undefined
      this.$refs[formName].resetFields()
    },
    /**
     * 关闭详情弹出框事件
     */
    handleCloseInfoDialog () {
      this.dept = this.deptInfo
    },
    /**
     * 添加修改弹出框提交
     *
     * @param formName
     */
    handleSubmitDeptForm (formName) {
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
      save(this.dept).then((response) => {
        this.$message.success(response.message)
        this.deptDialogVisible = false
        this.reloadList()
      })
    },
    /**
     * 修改请求
     */
    handleModify () {
      modify(this.dept).then((response) => {
        this.$message.success(response.message)
        this.deptDialogVisible = false
        this.reloadList()
      })
    },
    /**
     * 添加修改弹出框重置
     *
     * @param formName
     */
    handleCancelDeptForm (formName) {
      this.deptDialogVisible = false
      this.$refs[formName].resetFields()
    },
    /**
     * 部门下拉框
     *
     * @param id
     */
    selectDept (id) {
      selectDept(id).then(response => {
        if (response.data) {
          this.deptOption = [{
            value: ROOT,
            label: '根节点',
            children: response.data
          }]
        }
      })
    }
  }
}
</script>
