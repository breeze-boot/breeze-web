<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchPermissionForm" class="demo-form-inline" size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="数据权限名称" prop="permissionName">
              <el-input v-model="searchPermissionForm.permissionName" clearable placeholder="数据权限名称"/>
            </el-form-item>
            <el-form-item label="数据权限编码" prop="permissionCode">
              <el-input v-model="searchPermissionForm.permissionCode" clearable placeholder="数据权限编码"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="searchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['sys:permission:save']" plain size="mini" type="primary" @click="create">新建</el-button>
        <el-button v-has="['sys:permission:delete']" plain size="mini" type="danger" @click="remove">删除</el-button>
        <el-button plain size="mini" type="info" @click="exportInfo">导出</el-button>
        <el-button plain size="mini" @click="importInfo">导入</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="permissionTableData"
        border
        empty-text="无数据"
        height="500"
        max-height="700"
        size="mini"
        stripe
        style="width: 100%"
        @selection-change="permissionHandleSelectionChange">
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
          label="数据权限名称"
          prop="permissionName"
          show-overflow-tooltip
          width="200">
        </el-table-column>
        <el-table-column
          label="数据权限编码"
          prop="permissionCode"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="描述"
          prop="description"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="创建人"
          prop="createName">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="info(scope.row)">查看</el-button>
            <el-button size="mini" type="text" @click="modify(scope.row)">编辑</el-button>
            <el-button size="mini" type="text"
                       @click.native.prevent="removeItem(scope.$index, permissionTableData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchPermissionForm.current"
          :page-size="searchPermissionForm.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>

    <el-dialog :title="title" :visible.sync="permissionDialogVisible" width="800px"
               @close="closePermissionDialog('permissionRuleForm')">
      <el-form ref="permissionRuleForm" :model="permission" :rules="permissionRules" size="mini">
        <el-form-item :label-width="formLabelWidth" label="数据权限名称" prop="permissionName">
          <el-input v-model="permission.permissionName" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="数据权限编码" prop="permissionCode">
          <el-input v-model="permission.permissionCode" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="描述" prop="description">
          <el-input v-model="permission.description" autocomplete="off" clearable type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetPermissionForm('permissionRuleForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitPermissionForm('permissionRuleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="800px"
               @close="closeInfoDialog">
      <el-descriptions :column="2" border size="mini">
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            数据权限名称
          </template>
          {{ permission.permissionName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            数据权限编码
          </template>
          <el-tag size="small">{{ permission.permissionCode }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            描述
          </template>
          {{ permission.description }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

  </el-container>
</template>

<script>
import { add, del, edit, list } from '@/api/system/permission'
import { confirmAlert, DIALOG_TYPE } from '@/utils/constant'
import JSONBigInt from 'json-bigint'
import { Message } from 'element-ui'

export default {
  name: 'PermissionView',
  data () {
    return {
      multipleSelectionPermissionIds: [],
      permissionTableData: [],
      searchPermissionForm: {
        permissionName: '',
        permissionCode: '',
        current: 1,
        size: 10
      },
      total: 0,
      title: '',
      permissionDialogVisible: false,
      infoDialogVisible: false,
      // 默认是创建
      dialogType: DIALOG_TYPE.ADD,
      formLabelWidth: '80px',
      permission: {
        id: null,
        permissionName: '',
        permissionCode: '',
        description: ''
      },
      permissionInfo: {
        id: null,
        permissionName: '',
        permissionCode: '',
        description: ''
      },
      permissionRules: {
        permissionName: [
          {
            required: true,
            message: '请输入数据权限名称',
            trigger: 'blur'
          }
        ],
        permissionCode: [
          {
            required: true,
            message: '请输入数据权限编码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.reloadList()
  },
  methods: {
    reloadList () {
      list(this.buildParam()).then((rep) => {
        if (rep.code === 1) {
          this.permissionTableData = rep.data.records
          this.searchPermissionForm.size = rep.data.size
          this.searchPermissionForm.current = rep.data.current
          this.total = rep.data.total
        }
      })
    },
    buildParam () {
      return this.searchPermissionForm
    },
    handleSizeChange (size) {
      this.searchPermissionForm.size = size
      this.reloadList()
    },
    handleCurrentChange (current) {
      this.searchPermissionForm.current = current
      this.reloadList()
    },
    search () {
      this.reloadList()
    },
    searchReset () {
      this.$refs.searchForm.resetFields()
    },
    permissionHandleSelectionChange (val) {
      this.multipleSelectionPermissionIds = val
    },
    /**
     * 批量删除
     */
    remove () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelectionPermissionIds.map((x) => ids.push(JSONBigInt.parse(x.id)))
        del(ids).then(rep => {
          if (rep.code === 1) {
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
        del([JSONBigInt.parse(row.id)]).then(rep => {
          if (rep.code === 1) {
            rows.splice(index, 1)
            this.$message.success('删除成功')
          }
        })
      })
    },
    exportInfo () {
    },
    importInfo () {
    },
    create () {
      this.title = '创建数据权限'
      this.dialogType = DIALOG_TYPE.ADD
      this.permissionDialogVisible = true
    },
    modify (val) {
      this.title = '修改数据权限'
      this.dialogType = DIALOG_TYPE.EDIT
      this.permissionDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.permission, val)
      })
    },
    info (val) {
      this.title = '查看信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.infoDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.permission, val)
      })
    },
    closePermissionDialog (formName) {
      this.permission.id = undefined
      this.$refs[formName].resetFields()
    },
    closeInfoDialog () {
      this.permission = this.permissionInfo
    },
    /**
     * 提交
     * @param formName
     */
    submitPermissionForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogType === DIALOG_TYPE.ADD ? this.add() : this.edit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetPermissionForm (formName) {
      this.permissionDialogVisible = false
      this.$refs[formName].resetFields()
    },
    add () {
      this.permission.id = undefined
      add(this.permission).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: '添加成功' })
          this.permissionDialogVisible = false
          this.reloadList()
        }
      })
    },
    edit () {
      edit(this.permission).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: '修改成功' })
          this.permissionDialogVisible = false
          this.reloadList()
        }
      })
    }
  }
}
</script>
