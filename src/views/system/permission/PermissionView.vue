<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchPermissionForm" class="demo-form-inline"
               label-width="100px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="数据权限名称" prop="dataPermissionName">
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
        <el-button v-has="['sys:permission:create']" plain size="mini" type="primary" @click="create">新建</el-button>
        <el-button v-has="['sys:permission:delete']" :disabled="checkDeleteItem" plain size="mini" type="danger"
                   @click="remove">删除
        </el-button>
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
          :formatter="(row, column) => this.getTableDictLabel()(row, column, 'PERMISSION_CODE')"
          label="数据权限编码"
          prop="permissionCode"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="权限集"
          prop="permissions"
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
            <el-button v-has="['sys:permission:modify']" size="mini" type="text" @click="edit(scope.row)">编辑
            </el-button>
            <el-button v-has="['sys:permission:delete']" size="mini" type="text"
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

    <el-dialog :title="title" :visible.sync="permissionDialogVisible" width="40vw"
               @close="closePermissionDialog('permissionRuleForm')">
      <el-form ref="permissionRuleForm" :model="permission" :rules="permissionRules" size="mini">
        <el-form-item :label-width="formLabelWidth" label="数据权限名称" prop="permissionName">
          <el-input v-model="permission.permissionName" autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="数据权限编码" prop="permissionCode">
          <el-radio-group v-model="permission.permissionCode">
            <el-radio-button
              v-for="item in this.getDict()('PERMISSION_CODE')"
              :key="item.key"
              :label="item.key">
              {{ item.value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="部门范围" prop="permissions">
          <el-cascader
            v-model="permission.permissions"
            :options="deptOption"
            :props="{ checkStrictly: true, multiple: true, emitPath: false , value: 'key', label: 'value' }"
            :show-all-levels="false"
            clearable
            filterable
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetPermissionForm('permissionRuleForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitPermissionForm('permissionRuleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="40vw"
               @close="closeInfoDialog">
      <el-descriptions :column="1" border size="mini">
        <el-descriptions-item>
          <template slot="label">
            权限名称
          </template>
          {{ permission.permissionName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            权限编码
          </template>
          <el-tag size="small">{{ permission.permissionCode }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            权限
          </template>
          <el-tag size="small">{{ permission.permissions }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </el-container>
</template>

<script>
import { del, list, modify, save } from '@/api/system/permission'
import { confirmAlert } from '@utils/common'
import { DIALOG_TYPE } from '@/const/constant'
import JSONBigInt from 'json-bigint'
import { selectDept } from '@/api/system/dept'
import { dict } from '@/mixins'

export default {
  name: 'DataPermissionView',
  mixins: [dict],
  data () {
    return {
      // 此页面需要自字典编码
      dictCode: ['PERMISSION_CODE'],
      // 当前操作类型
      dialogType: DIALOG_TYPE.ADD,
      // 弹出框标题
      title: '',
      // 单元格选中数据
      multipleSelectionPermissionIds: [],
      // 部门表格数据
      permissionTableData: [],
      searchPermissionForm: {
        permissionName: '',
        permissionCode: '',
        current: 1,
        size: 10
      },
      total: 0,
      // 标记删除按钮是否可以点击
      checkDeleteItem: true,
      permissionDialogVisible: false,
      infoDialogVisible: false,
      formLabelWidth: '110px',
      deptOption: [],
      permission: {
        id: undefined,
        permissionName: '',
        permissionCode: '',
        permissions: []
      },
      permissionInfo: {
        id: undefined,
        permissionName: '',
        permissionCode: '',
        permissions: []
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
        ],
        permissions: [
          {
            required: false,
            message: '请选择部门权限集',
            trigger: 'change'
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
      list(this.buildParam()).then((response) => {
        if (response.code === 1) {
          this.permissionTableData = response.data.records
          this.searchPermissionForm.size = response.data.size
          this.searchPermissionForm.current = response.data.current
          this.total = response.data.total
        }
      })
    },
    selectDept () {
      selectDept().then(response => {
        if (response.code === 1 && response.data) {
          this.deptOption = response.data
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
      this.checkDeleteItem = !val.length
      this.multipleSelectionPermissionIds = val
    },
    /**
     * 批量删除
     */
    remove () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelectionPermissionIds.map((x) => ids.push(JSONBigInt.parse(x.id)))
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
     * 添加
     */
    create () {
      this.title = '添加数据权限'
      this.selectDept()
      this.dialogType = DIALOG_TYPE.ADD
      this.permissionDialogVisible = true
    },
    /**
     * 修改
     *
     * @param row
     */
    edit: function (row) {
      this.title = '修改数据权限'
      this.dialogType = DIALOG_TYPE.EDIT
      this.permissionDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.permission, row)
        this.selectDept()
        debugger
        this.permission.permissions = (row.permissions !== null && row.permissions !== '') ? row.permissions.split(',') : row.permissions
      })
    },
    /**
     * 查看详情
     *
     * @param row
     */
    info (row) {
      this.title = '查看权限信息'
      this.selectDept()
      this.dialogType = DIALOG_TYPE.SHOW
      this.$nextTick(() => {
        Object.assign(this.permission, row)
        this.infoDialogVisible = true
      })
    },
    /**
     * 关闭添加修改弹出框
     */
    closePermissionDialog (formName) {
      this.$refs[formName].resetFields()
    },
    /**
     * 关闭详情
     */
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
          this.dialogType === DIALOG_TYPE.ADD ? this.save() : this.modify()
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
    save () {
      this.permission.id = undefined
      save(this.permission).then((response) => {
        if (response.code === 1) {
          this.$message.success('添加成功')
          this.permissionDialogVisible = false
          this.reloadList()
        }
      })
    },
    modify () {
      modify(this.permission).then((response) => {
        if (response.code === 1) {
          this.$message.success('修改成功')
          this.permissionDialogVisible = false
          this.reloadList()
        }
      })
    }
  }
}
</script>
