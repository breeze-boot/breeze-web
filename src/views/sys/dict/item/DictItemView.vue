<template>
  <el-container>
    <el-main>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['sys:dict:create']" plain size="mini" type="primary" @click="create">新建</el-button>
        <el-button v-has="['sys:dict:delete']" plain size="mini" type="danger" @click="remove">删除</el-button>
      </div>
      <el-table ref="multipleDictItemTable" :data="dictItemTableData" border height="400" size="mini" stripe
                style="width: 100%"
                @selection-change="dictItemHandleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column v-if="false" label="ID" property="id" width="100"></el-table-column>
        <el-table-column label="字典KEY" property="key"></el-table-column>
        <el-table-column label="字典值" property="value"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text"
                       @click.native.prevent="removeItem(scope.$index, dictItemTableData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :title="title" :visible.sync="dictItemDialogVisible" width="800px"
                 @close="closeDictItemDialog('dictItemRuleForm')">
        <el-form ref="dictItemRuleForm" :model="dictItem" :rules="dictItemRules" size="mini">
          <el-form-item :label-width="formLabelWidth" label="字典KEY" prop="key">
            <el-input v-model="dictItem.key" autocomplete="off" clearable></el-input>
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
import { del, list, modify, save } from '@/api/sys/dictItem'
import { confirmAlert, DIALOG_TYPE } from '@/utils/constant'
import { Message } from 'element-ui'
import JSONBigInt from 'json-bigint'

export default {
  name: 'DictItemView',
  components: {},
  data () {
    return {
      title: '',
      multipleSelection: [],
      dictItemTableData: [],
      searchForm: {
        id: undefined,
        value: '',
        key: ''
      },
      total: 0,
      dictItemDialogVisible: false,
      // 默认是创建
      dialogType: DIALOG_TYPE.ADD,
      formLabelWidth: '80px',
      dictItem: {
        id: undefined,
        dictId: '',
        key: '',
        value: ''
      },
      dictItemRules: {
        key: [
          {
            required: true,
            message: '请输入字典项的key',
            trigger: 'blur'
          }
        ],
        value: [
          {
            required: true,
            message: '请输入字典项值',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
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
    dictItemHandleSelectionChange (val) {
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
            this.reloadList()
            this.$message.success('删除成功')
          }
        })
      })
    },
    create () {
      this.title = '创建字典项'
      this.dialogType = DIALOG_TYPE.ADD
      this.dictItemDialogVisible = true
    },
    edit (row) {
      this.title = '修改字典项'
      this.dialogType = DIALOG_TYPE.SHOW
      this.dictItemDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.dictItem, row)
      })
    },
    closeDictItemDialog (formName) {
      this.dictItem.id = undefined
      this.$refs[formName].resetFields()
    },
    submitDictItemForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogType === DIALOG_TYPE.ADD ? this.save() : this.modify()
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
    save () {
      save(this.dictItem).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: rep.message })
          this.dictItemDialogVisible = false
          this.reloadList(this.buildParam())
        }
      })
    },
    modify () {
      modify(this.dictItem).then((rep) => {
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
