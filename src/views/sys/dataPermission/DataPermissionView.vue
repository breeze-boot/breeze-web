<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchPermissionForm" class="demo-form-inline"
               label-width="100px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="数据权限名称" prop="dataPermissionName">
              <el-input v-model="searchPermissionForm.dataPermissionName" clearable placeholder="数据权限名称"/>
            </el-form-item>
            <el-form-item label="数据权限编码" prop="dataPermissionCode">
              <el-input v-model="searchPermissionForm.dataPermissionCode" clearable placeholder="数据权限编码"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="searchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['sys:dataPermission:create']" plain size="mini" type="primary" @click="create">新建</el-button>
        <el-button v-has="['sys:dataPermission:delete']" :disabled="checkDeleteItem" plain size="mini" type="danger"
                   @click="remove">删除
        </el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="dataPermissionTableData"
        border
        empty-text="无数据"
        height="500"
        max-height="700"
        size="mini"
        stripe
        style="width: 100%"
        @selection-change="dataPermissionHandleSelectionChange">
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
          prop="dataPermissionName"
          show-overflow-tooltip
          width="200">
        </el-table-column>
        <el-table-column
          label="数据权限编码"
          prop="dataPermissionCode"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          :formatter="(row, column) => this.getTableDictLabel()(row, column, 'DATA_PERMISSION_TYPE')"
          label="数据权限类型"
          prop="dataPermissionType"
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
          prop="dataPermissions"
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
            <el-button v-has="['sys:dataPermission:modify']" size="mini" type="text" @click="edit(scope.row)">编辑
            </el-button>
            <el-button v-has="['sys:dataPermission:delete']" size="mini" type="text"
                       @click.native.prevent="removeItem(scope.$index, dataPermissionTableData,scope.row)">删除
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

    <el-dialog :title="title" :visible.sync="dataPermissionDialogVisible" width="40vw"
               @close="closePermissionDialog('dataPermissionRuleForm')">
      <el-form ref="dataPermissionRuleForm" :model="dataPermission" :rules="dataPermissionRules" size="mini">
        <el-form-item :label-width="formLabelWidth" label="数据权限名称" prop="dataPermissionName">
          <el-input v-model="dataPermission.dataPermissionName" autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="数据权限编码" prop="dataPermissionCode">
          <el-input v-model="dataPermission.dataPermissionCode"
                    autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="权限类别" prop="dataPermissionType">
          <el-radio-group v-model="dataPermission.dataPermissionType" @change="handlerPermissionTypeChange">
            <el-radio-button
              v-for="item in this.getDict()('DATA_PERMISSION_TYPE')"
              :key="item.key"
              :label="item.key">
              {{ item.value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="dataPermission.dataPermissionType === 'DEPT_AND_LOWER_LEVEL'"
          :label-width="formLabelWidth"
          class="dept"
          label="部门"
          prop="dept">
          <el-cascader
            v-model="dataPermission.dataPermissions"
            :options="deptOption"
            :props="{ checkStrictly: true,  emitPath: false , value: 'key', label: 'value' }"
            :show-all-levels="false"
            clearable
            collapse-tags
            size="mini"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          v-if="dataPermission.dataPermissionType === 'DEPT_LEVEL'"
          :label-width="formLabelWidth"
          class="dept"
          label="部门"
          prop="dept">
          <el-cascader
            v-model="dataPermission.dataPermissions"
            :options="deptOption"
            :props="{ checkStrictly: true, emitPath: false , value: 'key', label: 'value' }"
            :show-all-levels="false"
            clearable
            collapse-tags
            size="mini"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          v-if="dataPermission.dataPermissionType === 'DIY_DEPT'"
          :label-width="formLabelWidth"
          class="dept"
          label="部门"
          prop="dept">
          <el-cascader
            v-model="dataPermission.dataPermissions"
            :options="deptOption"
            :props="{ multiple: true, checkStrictly: true, emitPath: false, value: 'key', label: 'value' }"
            :show-all-levels="false"
            clearable
            collapse-tags
            size="mini"
          ></el-cascader>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="描述" prop="description">
          <el-input v-model="dataPermission.description" autocomplete="off" clearable type="textarea"/>
        </el-form-item>
        <el-form-item
          v-if="dataPermission.dataPermissionType === 'DEPT_LEVEL' || dataPermission.dataPermissionType === 'DEPT_AND_LOWER_LEVEL' || dataPermission.dataPermissionType === 'DIY_DEPT'"
          :label-width="formLabelWidth"
          label="自定义SQL"
          prop="strSql">
          <el-button @click="diySql">设置</el-button>
          <el-table
            :data="dataPermission.dataPermissionTableSqlDiyData"
            border
            size="mini"
            style="margin-top: 10px">
            <el-table-column
              label="字段"
              prop="tableColumn"
              width="180">
            </el-table-column>
            <el-table-column
              :formatter="(row, column) => this.getTableDictLabel()(row, column, 'COMPARE')"
              label="比较"
              prop="compare"
              width="100">
            </el-table-column>
            <el-table-column
              label="参数"
              prop="conditions">
            </el-table-column>
            <el-table-column
              v-if="this.dataPermission.dataPermissionTableSqlDiyData.length > 1"
              label="SQL运算符"
              prop="operator">
              <template slot-scope="scope">
                <el-radio-group v-model="scope.row.operator"
                                :disabled="scope.$index === 0"
                                size="mini"
                                @change="operatorChange(scope.row.operator, scope.$index)">
                  <el-radio-button label="AND">AND</el-radio-button>
                  <el-radio-button label="OR">OR</el-radio-button>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="text"
                           @click.native.prevent="removeSqlItem(scope.$index,dataPermission.dataPermissionTableSqlDiyData, scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetPermissionForm('dataPermissionRuleForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitPermissionForm('dataPermissionRuleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="dataPermissionDiyDialogVisible" width="600px"
               @close="closePermissionDiyDialog('dataPermissionDiyRuleForm')">
      <el-form ref="dataPermissionDiyRuleForm" :model="dataPermissionDiy" :rules="dataPermissionDiyRules" size="mini">
        <el-form-item :label-width="formLabelWidth" label="表名" prop="name">
          <el-select v-model="dataPermissionDiy.name" :disabled="selectedTable" collapse-tags filterable
                     placeholder="请选择表名" @change=handleTable>
            <el-option
              v-for="item in tableOption"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="字段" prop="tableColumn">
          <el-select v-model="dataPermissionDiy.tableColumn" collapse-tags filterable placeholder="请选择字段">
            <el-option
              v-for="item in columnOption"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="比较" prop="compare">
          <el-select v-model="dataPermissionDiy.compare" collapse-tags filterable placeholder="请选择比较">
            <el-option
              v-for="item in this.getDict()('COMPARE')"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="参数" prop="conditions">
          <el-input v-model="dataPermissionDiy.conditions" clearable placeholder="请输入条件参数"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetDiyPermissionForm('dataPermissionDiyRuleForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitDiyPermissionForm('dataPermissionDiyRuleForm')">确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="600px"
               @close="closeInfoDialog">
      <el-descriptions :column="2" border size="mini">
        <el-descriptions-item>
          <template slot="label">
            SQL
          </template>
          {{ dataPermission.divSql }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </el-container>
</template>

<script>
import { del, list, modify, save, selectColumn, selectTable } from '@/api/sys/dataPermission'
import { confirmAlert, DIALOG_TYPE } from '@/utils/constant'
import JSONBigInt from 'json-bigint'
import { selectDept } from '@/api/sys/dept'
import { mapGetters } from 'vuex'

export default {
  name: 'DataPermissionView',
  data () {
    return {
      // 当前操作类型
      dialogType: DIALOG_TYPE.ADD,
      // 弹出框标题
      title: '',
      // 单元格选中数据
      multipleSelectionPermissionIds: [],
      // 部门表格数据
      dataPermissionTableData: [],
      selectedTable: false,
      searchPermissionForm: {
        dataPermissionName: '',
        dataPermissionCode: '',
        current: 1,
        size: 10
      },
      total: 0,
      // 标记删除按钮是否可以点击
      checkDeleteItem: true,
      dataPermissionDialogVisible: false,
      infoDialogVisible: false,
      dataPermissionDiyDialogVisible: false,
      formLabelWidth: '110px',
      deptOption: [],
      tableOption: [],
      columnOption: [],
      // 自定义sql的表单
      dataPermissionDiy: {
        id: null,
        name: '',
        tableColumn: '',
        conditions: '',
        compare: ''
      },
      dataPermission: {
        id: null,
        dataPermissionName: '',
        dataPermissionCode: '',
        operator: 'OR',
        dataPermissionType: '',
        strSql: '',
        dataPermissions: '',
        description: '',
        dataPermissionTableSqlDiyData: []
      },
      dataPermissionInfo: {
        id: null,
        dataPermissionName: '',
        dataPermissionCode: '',
        operator: 'OR',
        dataPermissionType: '',
        strSql: '',
        dataPermissions: '',
        description: '',
        dataPermissionTableSqlDiyData: []
      },
      dataPermissionRules: {
        dataPermissionName: [
          {
            required: true,
            message: '请输入数据权限名称',
            trigger: 'blur'
          }
        ],
        dataPermissionCode: [
          {
            required: true,
            message: '请输入数据权限编码',
            trigger: 'blur'
          }
        ],
        dataPermissions: [
          {
            required: true,
            message: '请输入权限集',
            trigger: 'blur'
          }
        ]
      },
      dataPermissionDiyRules: {
        name: [
          {
            required: true,
            message: '请选择表名',
            trigger: 'change'
          }
        ],
        tableColumn: [
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
          }]
      }
    }
  },
  mounted () {
    this.$toLoadDict(['DATA_PERMISSION_TYPE', 'COMPARE']).then((dict) => {
      this.reloadList()
    })
  },
  methods: {
    ...mapGetters('dict', ['getDict', 'getDescriptionsDictLabel', 'getTableDictLabel']),
    handlerPermissionTypeChange (val) {
      this.dataPermission.dataPermissions = []
    },
    operatorChange (row, index) {
    },
    reloadList () {
      list(this.buildParam()).then((rep) => {
        if (rep.code === 1) {
          this.dataPermissionTableData = rep.data.records
          this.searchPermissionForm.size = rep.data.size
          this.searchPermissionForm.current = rep.data.current
          this.total = rep.data.total
        }
      })
    },
    selectDept (row) {
      selectDept().then(response => {
        if (response.code === 1 && response.data) {
          this.deptOption = response.data
          if (!row || !row.dataPermissions) {
            return
          }
          if (row.dataPermissionType === 'DIY_DEPT') {
            this.dataPermission.dataPermissions = row.dataPermissions.split(',')
          } else {
            this.dataPermission.dataPermissions = row.dataPermissions
          }
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
    dataPermissionHandleSelectionChange (val) {
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
        del(ids).then(rep => {
          if (rep.code === 1) {
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
     * 删除行
     *
     * @param index
     * @param rows
     * @param row
     */
    removeSqlItem (index, rows, row) {
      confirmAlert(() => {
        rows.splice(index, 1)
        rows[0].operator = null
        this.$message.success('删除成功')
      })
    },
    create () {
      this.title = '创建数据权限'
      this.selectDept({})
      this.dialogType = DIALOG_TYPE.ADD
      this.dataPermissionDialogVisible = true
    },
    edit: function (row) {
      this.title = '修改数据权限'
      this.dialogType = DIALOG_TYPE.EDIT
      this.dataPermissionDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.dataPermission, row)
        this.handlerPermissionTypeChange(row.dataPermissionType)
        this.selectDept(row)
      })
    },
    info (row) {
      this.title = '查看信息'
      this.selectDept({})
      this.dialogType = DIALOG_TYPE.SHOW
      this.infoDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.dataPermission, row)
      })
    },
    diySql () {
      this.title = 'DIY权限'
      this.dataPermissionDiyDialogVisible = true
      this.selectTable()
    },
    handleTable (val) {
      this.selectColumn(val)
    },
    closePermissionDialog (formName) {
      this.dataPermission.id = undefined
      this.dataPermission.dataPermissionTableSqlDiyData = this.dataPermissionInfo.dataPermissionTableSqlDiyData
      this.$refs[formName].resetFields()
    },
    closeInfoDialog () {
      this.dataPermission = this.dataPermissionInfo
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
          Object.assign(temp, this.dataPermissionDiy)
          this.dataPermission.dataPermissionTableSqlDiyData.push(temp)
          this.dataPermissionDiyDialogVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetDiyPermissionForm (formName) {
      this.dataPermissionDiyDialogVisible = false
      this.$refs[formName].resetFields()
    },
    /**
     * 提交
     * @param formName
     */
    submitPermissionForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if ((typeof this.dataPermission.dataPermissions) === 'object') {
            const temp = []
            this.dataPermission.dataPermissions.forEach(p => {
              if ((typeof p) === 'object') {
                p.forEach(a => {
                  temp.push(a)
                })
              } else {
                temp.push(p)
              }
            })
            this.dataPermission.dataPermissions = temp
          } else {
            this.dataPermission.dataPermissions = [this.dataPermission.dataPermissions]
          }
          this.dialogType === DIALOG_TYPE.ADD ? this.save() : this.modify()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetPermissionForm (formName) {
      this.dataPermissionDialogVisible = false
      this.$refs[formName].resetFields()
    },
    save () {
      this.dataPermission.id = undefined
      save(this.dataPermission).then((rep) => {
        if (rep.code === 1) {
          this.$message.success('添加成功')
          this.dataPermissionDialogVisible = false
          this.reloadList()
        }
      })
    },
    modify () {
      modify(this.dataPermission).then((rep) => {
        if (rep.code === 1) {
          this.$message.success('修改成功')
          this.dataPermissionDialogVisible = false
          this.reloadList()
        }
      })
    }
  }
}
</script>
