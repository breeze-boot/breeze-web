<template>
  <el-container>
    <el-main>
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="字典名称">
              <el-input v-model="searchForm.dictName" clearable placeholder="字典名称"/>
            </el-form-item>
            <el-form-item label="字典标志">
              <el-input v-model="searchForm.dictCode" clearable placeholder="字典标志"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">查询</el-button>
              <el-button type="info" @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button plain size="mini" type="primary" @click="create">新建</el-button>
        <el-button plain size="mini" type="danger" @click="remove">删除</el-button>
        <el-button plain size="mini" type="info" @click="exportInfo">导出</el-button>
        <el-button plain size="mini" @click="importInfo">导入</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        height="300"
        size="mini"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange">
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
          label="字典名称"
          prop="dictName">
        </el-table-column>
        <el-table-column
          label="字典编码"
          prop="dictCode">
        </el-table-column>
        <el-table-column
          label="是否开启"
          prop="isOpen">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isOpen"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              size="mini"
              @change="open(scope.$index, scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="info(scope.row)">查看</el-button>
            <el-button size="mini" type="text" @click="modify(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click.native.prevent="removeItem(scope.$index, tableData,scope.row)">删除
            </el-button>
            <el-button size="mini" type="text" @click="showDictDetail(scope.row)">查看字典项</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchForm.current"
          :page-size="searchForm.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="800px"
               @close="closeDialog('dictRuleForm')">
      <el-form ref="dictRuleForm" :model="dict" :rules="dictRules" size="mini">
        <el-form-item :label-width="formLabelWidth" label="字典名称" prop="dictName">
          <el-input v-model="dict.dictName" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="字典编码" prop="dictCode">
          <el-input v-model="dict.dictCode" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="是否开启" prop="dictCode" style="text-align: left;">
          <el-switch
            v-model="dict.isOpen"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            size="mini">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetForm('dictRuleForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitForm('dictRuleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="dialogVisibleInfo" width="800px">
      <el-descriptions :column="1" border size="mini">
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            字典编码
          </template>
          {{ dict.dictCode }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            部门名称
          </template>
          <el-tag size="small">{{ dict.dictName }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetForm">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="dialogVisibleDictItem" width="900px">
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button plain size="mini" type="primary" @click="createDictItem">新建</el-button>
        <el-button plain size="mini" type="danger" @click="removeDictItem">删除</el-button>
      </div>
      <el-table ref="multipleTable" :data="gridData" border height="200" size="mini" stripe style="width: 100%"
                @selection-change="handleDictItemSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column v-if="false" label="ID" property="id" width="100"></el-table-column>
        <el-table-column label="值" property="value"></el-table-column>
        <el-table-column label="标签" property="label"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="modifyDictItem(scope.row)">编辑</el-button>
            <el-button size="mini" type="text"
                       @click.native.prevent="removeDictItemRow(scope.$index, gridData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDictItem">关 闭</el-button>
      </div>
      <el-dialog :title="title" :visible.sync="dialogVisibleDoDictItem" width="800px"
                 @close="closeDialog('ruleForm')">
        <el-form ref="ruleForm" :disabled="!show" :model="dictItem" :rules="rules" size="mini">
          <el-form-item :label-width="formLabelWidth" label="字典标签" prop="label">
            <el-input v-model="dictItem.label" autocomplete="off" clearable></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="字典值" prop="value">
            <el-input v-model="dictItem.value" autocomplete="off" clearable></el-input>
          </el-form-item>
        </el-form>
        <div v-if="show" slot="footer" class="dialog-footer">
          <el-button size="mini" @click="resetForm()">取 消</el-button>
          <el-button size="mini" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </el-container>
</template>

<script>
import { add, del, delDictItem, edit, list, listDictItem, open } from '@/api/system/dict'
import { confirmAlert, DIALOG_TYPE } from '@/utils/constant'
import { Message } from 'element-ui'
import JSONBigInt from 'json-bigint'

export default {
  name: 'DictView',
  components: {},
  data: () => ({
    title: '',
    multipleSelection: [],
    tableData: [],
    searchForm: {
      dictName: '',
      dictCode: '',
      current: 1,
      size: 10
    },
    total: 0,
    dialogVisible: false,
    dialogVisibleInfo: false,
    dialogVisibleDictItem: false,
    dialogVisibleDoDictItem: false,
    dict: {
      id: null,
      dictName: '',
      dictCode: '',
      isOpen: 0
    },
    // 默认是创建
    dialogType: DIALOG_TYPE.ADD,
    formLabelWidth: '80px',
    dictRules: {
      dictName: [
        {
          required: true,
          message: '请输入字典名称',
          trigger: 'blur'
        }
      ],
      dictCode: [
        {
          required: true,
          message: '请输入字典编码',
          trigger: 'blur'
        }
      ]
    },
    gridData: [],
    rowData: {},
    dictItem: {
      id: undefined,
      dictId: '',
      label: '',
      value: ''
    },
    show: true,
    rules: {
      label: [
        {
          required: true,
          message: '请输入字典项名称',
          trigger: 'blur'
        }
      ],
      value: [
        {
          required: true,
          message: '请输入字典项编码',
          trigger: 'blur'
        }
      ]
    }
  }),
  created () {
    this.reloadList()
  },
  methods: {
    reloadList () {
      list(this.buildParam()).then((rep) => {
        if (rep.code === 1) {
          this.tableData = rep.data.records
          this.searchForm.size = rep.data.size
          this.searchForm.current = rep.data.current
          this.total = rep.data.total
        }
      })
    },
    open (index, row) {
      open({
        id: row.id,
        isOpen: row.isOpen
      }).then((rep) => {
        Message.success({ message: rep.message })
      })
    },
    handleSizeChange (size) {
      this.searchForm.size = size
      this.reloadList()
    },
    handleCurrentChange (current) {
      this.searchForm.current = current
      this.reloadList()
    },
    search () {
      this.reloadList()
    },
    buildParam () {
      return this.searchForm
    },
    reset () {
      this.searchForm.dictName = ''
      this.searchForm.dictCode = ''
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    /**
     * 批量删除
     */
    remove () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelection.map((x) => ids.push(JSONBigInt.parse(x.id)))
        del(ids).then((rep) => {
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
      this.title = '创建平台'
      this.dialogType = DIALOG_TYPE.ADD
      this.dialogVisible = true
    },
    modify (val) {
      this.title = '修改平台'
      this.dialogType = DIALOG_TYPE.EDIT
      this.dialogVisible = true
      Object.assign(this.dict, val)
    },
    info (val) {
      this.title = '查看信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.dialogVisibleInfo = true
      Object.assign(this.dict, val)
    },
    showDictDetail (val) {
      debugger
      this.title = '查看字典项信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.dialogVisibleDictItem = true
      this.reloadDictItemList(val.id)
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogType === DIALOG_TYPE.ADD ? this.add() : this.edit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    add () {
      add(this.dict).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: rep.message })
          this.dialogVisible = false
          this.reloadList()
        }
      })
    },
    edit () {
      edit(this.dict).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: rep.message })
          this.dialogVisible = false
          this.reloadList()
        }
      })
    },
    resetForm () {
      this.dialogVisible = false
      this.dialogVisibleInfo = false
    },
    closeDialog (formName) {
      this.dict.id = undefined
      this.$refs[formName].resetFields()
    },
    reloadDictItemList (id) {
      listDictItem({ id: id }).then((rep) => {
        if (rep.code === 1) {
          this.gridData = rep.data
          this.total = rep.data.total
        }
      })
    },
    handleDictItemSelectionChange (val) {
      this.multipleSelection = val
    },
    createDictItem () {
      this.title = '创建字典项'
      this.dialogType = DIALOG_TYPE.ADD
      this.dialogVisibleDictItem = true
    },
    modifyDictItem (val) {
      this.title = '修改字典项'
      this.dialogType = DIALOG_TYPE.SHOW
      this.dialogVisibleDictItem = true
      Object.assign(this.dict, val)
    },
    removeDictItem () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelection.map((x) => ids.push(JSONBigInt.parse(x.id)))
        delDictItem(ids).then(rep => {
          if (rep.code === 1) {
            this.reloadList()
            this.$message.success('删除成功')
            this.reloadDictItemList()
          }
        })
      })
    },
    removeDictItemRow (index, rows, row) {
      confirmAlert(() => {
        delDictItem([JSONBigInt.parse(row.id)]).then(rep => {
          if (rep.code === 1) {
            rows.splice(index, 1)
            this.$message.success('删除成功')
            this.reloadDictItemList()
          }
        })
      })
    },
    closeDictItem () {
    },
    submitDictItemForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogType === DIALOG_TYPE.ADD ? this.add() : this.edit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addDictItem () {
      add(this.dictItem).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: rep.message })
          this.dialogVisible = false
          this.$emit('reloadList')
        }
      })
    },
    editDictItem () {
      edit(this.dictItem).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: rep.message })
          this.dialogVisible = false
          this.$emit('reloadList')
        }
      })
    },
    resetDictItemForm () {
      this.dialogVisibleDoDictItem = false
    },
    closeDoItemDialog (formName) {
      this.dictItem.id = undefined
      this.$refs[formName].resetFields()
      this.show = true
    }
  }
}
</script>
