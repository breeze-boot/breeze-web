<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchDeptForm" class="demo-form-inline" label-width="80px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="searchDeptForm.deptName" clearable placeholder="部门名称"/>
            </el-form-item>
            <el-form-item label="部门编号" prop="deptCode">
              <el-input v-model="searchDeptForm.deptCode" clearable placeholder="部门编号"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="searchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['sys:dept:create']" plain size="mini" type="primary" @click="create">新建</el-button>
      </div>
      <el-table
        :data="deptTableData"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        border
        height="90%"
        row-key="id"
        size="mini"
        stripe
        style="width: 100%"
        @selection-change="deptHandleSelectionChange">
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
            <el-button size="mini" type="text" @click="info(scope.row)">查看</el-button>
            <el-button v-has="['sys:dept:create']" size="mini" type="text" @click="create(scope.row)">新建</el-button>
            <el-button v-has="['sys:dept:modify']" size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button v-has="['sys:dept:delete']" size="mini" type="text"
                       @click.native.prevent="removeItem(deptTableData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <el-dialog :title="title" :visible.sync="deptDialogVisible" width="600px"
               @close="closeDialog('deptRuleForm')">
      <el-form ref="deptRuleForm" :model="dept" :rules="deptRules" size="mini">
        <el-form-item :label-width="formLabelWidth" class="parentId" label="上级部门" prop="parentId">
          <el-cascader
            v-model="dept.parentId"
            :options="deptOption"
            :props="{ checkStrictly: true, emitPath: false , value: 'key', label: 'value' }"
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
        <el-button size="mini" @click="resetDeptForm('deptRuleForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitDeptForm('deptRuleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="600px" @close="closeInfoDialog">
      <el-descriptions :column="1" border size="mini">
        <el-descriptions-item>
          <template slot="label">
            部门编码
          </template>
          {{ dept.deptCode }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            部门名称
          </template>
          <el-tag size="small">{{ dept.deptName }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </el-container>
</template>

<script>
import { del, list, modify, save, selectDept } from '@/api/sys/dept'
import { confirmAlert, DIALOG_TYPE, ROOT } from '@/utils/constant'
import JSONBigInt from 'json-bigint'
import { Message } from 'element-ui'

export default {
  name: 'DeptView',
  data () {
    return {
      title: '',
      rowIndex: 0,
      multipleSelection: [],
      deptTableData: [],
      searchDeptForm: {
        deptName: '',
        deptCode: ''
      },
      deptDialogVisible: false,
      infoDialogVisible: false,
      deptOption: [],
      dept: {
        id: undefined,
        parentId: null,
        deptName: '',
        deptCode: ''
      },
      deptInfo: {
        id: undefined,
        parentId: null,
        deptName: '',
        deptCode: ''
      },
      // 默认是创建
      dialogType: DIALOG_TYPE.ADD,
      formLabelWidth: '80px',
      show: false,
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
          this.deptTableData = rep.data
        }
      })
    },
    buildParam () {
      return this.searchDeptForm
    },
    search () {
      this.reloadList()
    },
    searchReset () {
      this.$refs.searchForm.resetFields()
    },
    deptHandleSelectionChange (val) {
      this.multipleSelection = val
    },
    /**
     * 删除行
     *
     * @param rows
     * @param row
     */
    removeItem (rows, row) {
      confirmAlert(() => {
        del(JSONBigInt.parse(row.id)).then(rep => {
          if (rep.code === 1) {
            this.deleteTreeTableData(rows, row)
          }
        })
      })
    },
    deleteTreeTableData (rows, row) {
      for (let index = 0; index < rows.length; index++) {
        if (rows[index].id === row.id) {
          rows.splice(index, 1)
          return
        }
        const tempTable = rows[index]
        if (tempTable.children && tempTable.children.length > 0) {
          this.deleteTreeTableData(tempTable.children, row)
        }
      }
    },
    create (row) {
      this.title = '创建部门'
      // 赋值
      this.dialogType = DIALOG_TYPE.ADD
      this.dept.parentId = row.id ? row.id : ''
      this.selectDept()
      this.deptDialogVisible = true
    },
    edit (row) {
      this.title = '修改部门信息'
      this.dialogType = DIALOG_TYPE.EDIT
      this.$nextTick(() => {
        Object.assign(this.dept, row)
        this.dept.parentId = row.parentId
        this.selectDept(this.dept.id)
      })
      this.deptDialogVisible = true
    },
    info (row) {
      this.title = '查看部门信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.$nextTick(() => {
        Object.assign(this.dept, row)
        this.dept.parentId = row.parentId
        this.selectDept()
      })
      this.infoDialogVisible = true
    },
    selectDept (id) {
      selectDept(id).then(res => {
        if (res.code === 1 && res.data) {
          this.deptOption = [{
            key: ROOT,
            value: '根节点',
            children: res.data
          }]
        }
      })
    },
    submitDeptForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogType === DIALOG_TYPE.ADD ? this.save() : this.modify()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetDeptForm (formName) {
      this.deptDialogVisible = false
      this.$refs[formName].resetFields()
    },
    save () {
      save(this.dept).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: rep.message })
          this.deptDialogVisible = false
          this.reloadList()
        }
      })
    },
    modify () {
      modify(this.dept).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: rep.message })
          this.deptDialogVisible = false
          this.reloadList()
        }
      })
    },
    closeInfoDialog () {
      this.dept = this.deptInfo
    },
    closeDialog (formName) {
      this.dept.id = undefined
      this.$refs[formName].resetFields()
    }
  }
}
</script>
