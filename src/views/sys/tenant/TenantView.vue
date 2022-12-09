<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchTenantForm" class="demo-form-inline" label-width="80px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="租户名称" prop="tenantName">
              <el-input v-model="searchTenantForm.tenantName" clearable placeholder="租户名称"/>
            </el-form-item>
            <el-form-item label="租户编码" prop="tenantCode">
              <el-input v-model="searchTenantForm.tenantCode" clearable placeholder="租户编码"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="searchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['sys:tenant:create']" plain size="mini" type="primary" @click="create">新建</el-button>
        <el-button v-has="['sys:tenant:delete']" plain size="mini" type="danger" @click="remove">删除</el-button>
        <el-button v-has="['sys:tenant:export']" plain size="mini" type="info" @click="exportInfo">导出</el-button>
        <el-button v-has="['sys:tenant:import']" plain size="mini" @click="importInfo">导入</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="tenantTableData"
        border
        empty-text="无数据"
        height="500"
        max-height="700"
        size="mini"
        stripe
        style="width: 100%"
        @selection-change="tenantHandleSelectionChange">
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
          label="租户名称"
          prop="tenantName"
          show-overflow-tooltip
          width="200">
        </el-table-column>
        <el-table-column
          label="租户编码"
          prop="tenantCode"
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
            <el-button v-has="['sys:tenant:modify']" size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button v-has="['sys:tenant:delete']" size="mini" type="text"
                       @click.native.prevent="removeItem(scope.$index, tenantTableData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchTenantForm.current"
          :page-size="searchTenantForm.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>

    <el-dialog :title="title" :visible.sync="tenantDialogVisible" width="800px"
               @close="closeTenantDialog('tenantRuleForm')">
      <el-form ref="tenantRuleForm" :model="tenant" :rules="tenantRules" size="mini">
        <el-form-item :label-width="formLabelWidth" label="租户名称" prop="tenantName">
          <el-input v-model="tenant.tenantName" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="租户编码" prop="tenantCode">
          <el-input v-model="tenant.tenantCode" autocomplete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetTenantForm('tenantRuleForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitTenantForm('tenantRuleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="800px"
               @close="closeInfoDialog">
      <el-descriptions :column="2" border size="mini">
        <el-descriptions-item>
          <template slot="label">
            租户名称
          </template>
          {{ tenant.tenantName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            租户编码
          </template>
          <el-tag size="small">{{ tenant.tenantCode }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            描述
          </template>
          {{ tenant.description }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

  </el-container>
</template>

<script>
import { del, list, modify, save } from '@/api/sys/tenant'
import { confirmAlert, DIALOG_TYPE } from '@/utils/constant'
import JSONBigInt from 'json-bigint'
import { Message } from 'element-ui'

export default {
  name: 'TenantView',
  data () {
    return {
      multipleSelectionTenantIds: [],
      tenantTableData: [],
      searchTenantForm: {
        tenantName: '',
        tenantCode: '',
        current: 1,
        size: 10
      },
      total: 0,
      title: '',
      tenantDialogVisible: false,
      infoDialogVisible: false,
      // 默认是创建
      dialogType: DIALOG_TYPE.ADD,
      formLabelWidth: '80px',
      tenant: {
        id: null,
        tenantName: '',
        tenantCode: '',
        description: ''
      },
      tenantInfo: {
        id: null,
        tenantName: '',
        tenantCode: '',
        description: ''
      },
      tenantRules: {
        tenantName: [
          {
            required: true,
            message: '请输入租户名称',
            trigger: 'blur'
          }
        ],
        tenantCode: [
          {
            required: true,
            message: '请输入租户编码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    this.reloadList()
  },
  methods: {
    reloadList () {
      list(this.buildParam()).then((rep) => {
        if (rep.code === 1) {
          this.tenantTableData = rep.data.records
          this.searchTenantForm.size = rep.data.size
          this.searchTenantForm.current = rep.data.current
          this.total = rep.data.total
        }
      })
    },
    buildParam () {
      return this.searchTenantForm
    },
    handleSizeChange (size) {
      this.searchTenantForm.size = size
      this.reloadList()
    },
    handleCurrentChange (current) {
      this.searchTenantForm.current = current
      this.reloadList()
    },
    search () {
      this.reloadList()
    },
    searchReset () {
      this.$refs.searchForm.resetFields()
    },
    tenantHandleSelectionChange (val) {
      this.multipleSelectionTenantIds = val
    },
    /**
     * 批量删除
     */
    remove () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelectionTenantIds.map((x) => ids.push(JSONBigInt.parse(x.id)))
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
            this.reloadList()
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
      this.title = '创建租户'
      this.dialogType = DIALOG_TYPE.ADD
      this.tenantDialogVisible = true
    },
    edit (row) {
      this.title = '修改租户'
      this.dialogType = DIALOG_TYPE.EDIT
      this.tenantDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.tenant, row)
      })
    },
    info (row) {
      this.title = '查看信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.infoDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.tenant, row)
      })
    },
    closeTenantDialog (formName) {
      this.tenant.id = undefined
      this.$refs[formName].resetFields()
    },
    closeInfoDialog () {
      this.tenant = this.tenantInfo
    },
    /**
     * 提交
     * @param formName
     */
    submitTenantForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogType === DIALOG_TYPE.ADD ? this.save() : this.modify()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetTenantForm (formName) {
      this.tenantDialogVisible = false
      this.$refs[formName].resetFields()
    },
    save () {
      this.tenant.id = undefined
      save(this.tenant).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: '添加成功' })
          this.tenantDialogVisible = false
          this.reloadList()
        }
      })
    },
    modify () {
      modify(this.tenant).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: '修改成功' })
          this.tenantDialogVisible = false
          this.reloadList()
        }
      })
    }
  }
}
</script>
