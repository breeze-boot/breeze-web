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
          label="数据权限类型"
          prop="permissionType"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="运算符"
          prop="operator"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="自定义sql"
          prop="strSql"
          show-overflow-tooltip
          width="200">
        </el-table-column>
        <el-table-column
          label="权限集"
          prop="permissions"
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
            <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
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
          <el-input v-model="permission.permissionName" autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="数据权限编码" prop="permissionCode">
          <el-input v-model="permission.permissionCode"
                    autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="运算符" prop="operator">
          <el-radio-group v-model="permission.operator">
            <el-radio-button label="AND">AND</el-radio-button>
            <el-radio-button label="OR">OR</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="权限类别" prop="permissionType">
          <el-radio-group v-model="permission.permissionType" @change="handlerPermissionTypeChange">
            <el-radio-button v-for="item in permissionTypeOption" :key="item.label" :label="item.label">
              {{ item.value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="permission.permissionType === 'DEPT_AND_LOWER_LEVEL' || permission.permissionType === 'DEPT_LEVEL' || permission.permissionType === 'DIY_DEPT'"
          :label-width="formLabelWidth" class="dept" label="部门"
          prop="dept">
          <el-cascader
            v-model="permission.permissions"
            :options="deptOption"
            :props="{  checkStrictly: checkStrictly, multiple: multiple, emitPath: emitPath }"
            :show-all-levels="false"
            clearable
            collapse-tags
            size="mini"
          ></el-cascader>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="描述" prop="description">
          <el-input v-model="permission.description" autocomplete="off" clearable type="textarea"/>
        </el-form-item>
        <el-form-item
          v-if="permission.permissionType === 'DIY'"
          :label-width="formLabelWidth" label="自定义SQL" prop="strSql">
          <el-button @click="diySql">设置</el-button>
          <el-table
            v-if="permission.permissionType === 'DIY'"
            :data="permissionTableSqlDiyData" border
            size="mini"
            style="margin-top: 10px">
            <el-table-column
              label="字段"
              prop="column"
              width="180">
            </el-table-column>
            <el-table-column
              label="比较"
              prop="compare"
              width="180">
            </el-table-column>
            <el-table-column
              label="参数"
              prop="conditions">
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetPermissionForm('permissionRuleForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitPermissionForm('permissionRuleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="permissionDiyDialogVisible" width="600px"
               @close="closePermissionDiyDialog('permissionDiyRuleForm')">
      <el-form ref="permissionDiyRuleForm" :model="permissionDiy" :rules="permissionDiyRules" size="mini">
        <el-form-item :label-width="formLabelWidth" label="表名" prop="name">
          <el-select v-model="permissionDiy.name" collapse-tags filterable placeholder="请选择表名" @change=handleTable>
            <el-option
              v-for="item in tableOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="字段" prop="column">
          <el-select v-model="permissionDiy.column" collapse-tags filterable placeholder="请选择字段">
            <el-option
              v-for="item in columnOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="比较" prop="compare">
          <el-select v-model="permissionDiy.compare" collapse-tags filterable placeholder="请选择比较">
            <el-option
              v-for="item in compareOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="参数" prop="conditions">
          <el-input v-model="permissionDiy.conditions" clearable placeholder="请输入条件参数"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetDiyPermissionForm('permissionDiyRuleForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitDiyPermissionForm('permissionDiyRuleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="600px"
               @close="closeInfoDialog">
      <el-descriptions :column="2" border size="mini">
        <el-descriptions-item>
          <template slot="label">
            数据权限名称
          </template>
          {{ permission.permissionName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            数据权限编码
          </template>
          <el-tag size="small">{{ permission.permissionCode }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            运算符
          </template>
          {{ permission.operator }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            自定义sql
          </template>
          {{ permission.strSql }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            权限集
          </template>
          {{ permission.permissions }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            描述
          </template>
          {{ permission.description }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </el-container>
</template>

<script>
import { del, list, modify, save, selectColumn, selectTable } from '@/api/sys/permission'
import { confirmAlert, DIALOG_TYPE } from '@/utils/constant'
import JSONBigInt from 'json-bigint'
import { Message } from 'element-ui'
import { selectDept } from '@/api/sys/dept'

export default {
  name: 'PermissionView',
  data () {
    return {
      multipleSelectionPermissionIds: [],
      permissionTableData: [],
      permissionTableSqlDiyData: [],
      checkStrictly: false,
      multiple: false,
      emitPath: false,
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
      permissionDiyDialogVisible: false,
      // 默认是创建
      dialogType: DIALOG_TYPE.ADD,
      formLabelWidth: '110px',
      deptOption: [],
      tableOption: [],
      columnOption: [],
      permissionTypeOption: [
        {
          value: '全部',
          label: 'ALL'
        }, {
          value: '自己',
          label: 'OWN'
        }, {
          value: '本级以及下属部门',
          label: 'DEPT_AND_LOWER_LEVEL'
        }, {
          value: '本级部门',
          label: 'DEPT_LEVEL'
        }, {
          value: '自定义部门',
          label: 'DIY_DEPT'
        }, {
          value: '自定义',
          label: 'DIY'
        }
      ],
      compareOption: [
        {
          value: '>',
          label: '大于'
        },
        {
          value: '>=',
          label: '大于等于'
        },
        {
          value: '<',
          label: '小于'
        },
        {
          value: '<=',
          label: '小于等于'
        },
        {
          value: '!=',
          label: '不等于'
        },
        {
          value: '=',
          label: '等于'
        },
        {
          value: 'IS NOT NULL',
          label: '不等于空'
        },
        {
          value: 'IS NULL',
          label: '等于空'
        }
      ],
      permissionDiy: {
        name: '',
        column: '',
        conditions: '',
        compare: ''
      },
      permission: {
        id: null,
        permissionName: '',
        permissionCode: '',
        operator: 'OR',
        permissionType: '',
        strSql: '',
        permissions: '',
        description: '',
        permissionDiy: []
      },
      permissionInfo: {
        id: null,
        permissionName: '',
        permissionCode: '',
        operator: 'OR',
        permissionType: '',
        strSql: '',
        permissions: '',
        description: '',
        permissionDiy: []
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
            required: true,
            message: '请输入权限集',
            trigger: 'blur'
          }
        ]
      },
      permissionDiyRules: {
        name: [
          {
            required: true,
            message: '请选择表名',
            trigger: 'change'
          }
        ],
        column: [
          {
            required: true,
            message: '请选择字段名',
            trigger: 'change'
          }
        ],
        compare: [
          {
            required: true,
            message: '请选择比较方法',
            trigger: 'change'
          }
        ],
        conditions: [
          {
            required: true,
            message: '请输入比较条件',
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
    handlerPermissionTypeChange (val) {
      this.permission.permissions = []
      if (val === 'DEPT_AND_LOWER_LEVEL' || val === 'DEPT_LEVEL') {
        this.checkStrictly = true
        this.multiple = false
        this.emitPath = false
      } else if (val === 'DIY_DEPT') {
        this.checkStrictly = true
        this.multiple = true
        this.emitPath = false
      } else if (val === 'ALL' || val === 'OWN') {
        debugger
      } else {
        this.checkStrictly = true
        this.multiple = true
        this.emitPath = true
      }
    },
    getName (label) {
      let value = ''
      this.permissionTypeOption.forEach(p => {
        if (p.label === label) {
          value = p.value
        }
      })
      return value
    },
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
    selectDept () {
      selectDept().then(res => {
        if (res.code === 1 && res.data) {
          this.deptOption = res.data
        }
      })
    },
    selectTable () {
      selectTable().then(rep => {
        if (rep.code === 1 && rep.data) {
          this.tableOption = rep.data
        }
      })
    },
    selectColumn (tableName) {
      selectColumn(tableName).then(rep => {
        if (rep.code === 1 && rep.data) {
          this.columnOption = rep.data
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
      this.title = '创建数据权限'
      this.selectDept()
      this.dialogType = DIALOG_TYPE.ADD
      this.permissionDialogVisible = true
    },
    edit (row) {
      this.title = '修改数据权限'
      this.selectDept()
      this.dialogType = DIALOG_TYPE.EDIT
      this.permissionDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.permission, row)
      })
    },
    info (row) {
      this.title = '查看信息'
      this.selectDept()
      this.dialogType = DIALOG_TYPE.SHOW
      this.infoDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.permission, row)
      })
    },
    diySql () {
      this.title = 'DIY权限'
      this.permissionDiyDialogVisible = true
      this.selectTable()
    },
    handleTable (val) {
      this.selectColumn(val)
    },
    closePermissionDialog (formName) {
      this.permission.id = undefined
      this.$refs[formName].resetFields()
    },
    closeInfoDialog () {
      this.permission = this.permissionInfo
    },
    closePermissionDiyDialog (formName) {
      this.$refs[formName].resetFields()
    },
    /**
     * 提交
     * @param formName
     */
    submitDiyPermissionForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const temp = {}
          Object.assign(temp, this.permissionDiy)
          this.permissionTableSqlDiyData.push(temp)
          this.permission.permissionDiy = this.permissionTableSqlDiyData
          this.permissionDiyDialogVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetDiyPermissionForm (formName) {
      this.permissionDiyDialogVisible = false
      this.$refs[formName].resetFields()
    },
    /**
     * 提交
     * @param formName
     */
    submitPermissionForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if ((typeof this.permission.permissions) === 'object') {
            const temp = []
            this.permission.permissions.forEach(p => {
              if ((typeof p) === 'object') {
                p.forEach(a => {
                  temp.push(a)
                })
              } else {
                temp.push(p)
              }
            })
            this.permission.permissions = temp
          } else {
            this.permission.permissions = [this.permission.permissions]
          }
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
      save(this.permission).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: '添加成功' })
          this.permissionDialogVisible = false
          this.reloadList()
        }
      })
    },
    modify () {
      modify(this.permission).then((rep) => {
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
