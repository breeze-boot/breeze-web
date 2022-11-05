<template>
  <el-container>
    <el-main>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button plain size="mini" type="primary" @click="create">新建</el-button>
        <el-button plain size="mini" type="danger" @click="remove">删除</el-button>
      </div>
      <el-table ref="multipleTable" :data="dictItemTableData" border height="200" size="mini" stripe style="width: 100%"
                @selection-change="ditItemHandleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column v-if="false" label="ID" property="id" width="100"></el-table-column>
        <el-table-column label="值" property="value"></el-table-column>
        <el-table-column label="标签" property="label"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="modify(scope.row)">编辑</el-button>
            <el-button size="mini" type="text"
                       @click.native.prevent="removeItem(scope.$index, dictItemTableData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :title="title" :visible.sync="dictItemDialogVisible" width="800px"
                 @close="closeDictItemDialog('dictItemRuleForm')">
        <el-form ref="dictItemRuleForm" :model="dictItem" :rules="rules" size="mini">
          <el-form-item :label-width="formLabelWidth" label="字典标签" prop="label">
            <el-input v-model="dictItem.label" autocomplete="off" clearable></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="字典值" prop="value">
            <el-input v-model="dictItem.value" autocomplete="off" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="resetDictItemForm('dictItemRuleForm')">取 消</el-button>
          <el-button size="mini" type="primary" @click="submitDictItemForm('dictItemRuleForm')">确 定</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import { add, del, edit, list } from '@/api/system/dictItem'
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
      id: undefined,
      value: '',
      label: ''
    },
    total: 0,
    dictItemDialogVisible: false,
    dict: {
      id: undefined,
      value: '',
      label: ''
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
    dictItemTableData: [],
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
    this.reloadList(this.buildParam())
  },
  methods: {
    reloadList (id) {
      list({ id: id }).then((rep) => {
        if (rep.code === 1) {
          this.dictItemTableData = rep.data
          this.total = rep.data.total
        }
      })
    },
    buildParam () {
      this.searchForm.id = this.$route.params.id
      this.dictItem.dictId = this.$route.params.id
      return this.searchForm.id
    },
    handleSizeChange (size) {
      this.searchForm.size = size
      this.reloadList(this.buildParam())
    },
    handleCurrentChange (current) {
      this.searchForm.current = current
      this.reloadList(this.buildParam())
    },
    search () {
      this.reloadList(this.buildParam())
    },
    reset () {
      this.$refs.restPasswordRuleForm.resetFields()
    },
    ditItemHandleSelectionChange (val) {
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
            this.$message.success('删除成功')
            this.reloadList(this.buildParam())
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
      this.title = '创建字典项'
      this.dialogType = DIALOG_TYPE.ADD
      this.dictItemDialogVisible = true
    },
    modify (val) {
      this.title = '修改字典项'
      this.dialogType = DIALOG_TYPE.SHOW
      this.dictItemDialogVisible = true
      Object.assign(this.dictItem, val)
    },
    closeDictItemDialog (formName) {
      this.dictItem.id = undefined
      this.$refs[formName].resetFields()
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
    resetDictItemForm (formName) {
      this.dictItemDialogVisible = false
      this.$refs[formName].resetFields()
    },
    add () {
      add(this.dictItem).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: rep.message })
          this.dictItemDialogVisible = false
          this.reloadList(this.buildParam())
        }
      })
    },
    edit () {
      edit(this.dictItem).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: rep.message })
          this.dictItemDialogVisible = false
          this.reloadList(this.buildParam())
        }
      })
    }
  }
}
</script>
