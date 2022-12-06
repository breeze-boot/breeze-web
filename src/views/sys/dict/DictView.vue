<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchDictForm" class="demo-form-inline" size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="字典名称" prop="dictName">
              <el-input v-model="searchDictForm.dictName" clearable placeholder="字典名称"/>
            </el-form-item>
            <el-form-item label="字典编码" prop="dictCode">
              <el-input v-model="searchDictForm.dictCode" clearable placeholder="字典编码"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">查询</el-button>
              <el-button type="info" @click="searchReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['sys:dict:create']" plain size="mini" type="primary" @click="create">新建</el-button>
        <el-button v-has="['sys:dict:delete']" plain size="mini" type="danger" @click="remove">删除</el-button>
        <el-button v-has="['sys:dict:export']" plain size="mini" type="info" @click="exportInfo">导出</el-button>
        <el-button v-has="['sys:dict:import']" plain size="mini" @click="importInfo">导入</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="dictTableData"
        border
        height="500"
        size="mini"
        stripe
        @selection-change="dictHandleSelectionChange">
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
            <el-button v-has="['sys:dict:modify']" size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button v-has="['sys:dict:delete']" size="mini" type="text"
                       @click.native.prevent="removeItem(scope.$index, dictTableData,scope.row)">删除
            </el-button>
            <el-button size="mini" type="text" @click="showDictDetail(scope.row)">查看字典项</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchDictForm.current"
          :page-size="searchDictForm.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>

    <el-dialog :title="title" :visible.sync="dictDialogVisible" width="800px"
               @close="closeDictDialog('dictRuleForm')">
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
        <el-button size="mini" @click="resetDictForm('dictRuleForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitDictForm('dictRuleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="800px" @close="closeInfoDialog">
      <el-descriptions :column="1" border size="mini">
        <el-descriptions-item>
          <template slot="label">
            字典编码
          </template>
          {{ dict.dictCode }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            部门名称
          </template>
          <el-tag size="small">{{ dict.dictName }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </el-container>
</template>

<script>
import { del, list, modify, open, save } from '@/api/sys/dict'
import { confirmAlert, DIALOG_TYPE } from '@/utils/constant'
import { Message } from 'element-ui'
import JSONBigInt from 'json-bigint'

export default {
  name: 'DictView',
  components: {},
  data () {
    return {
      title: '',
      multipleSelection: [],
      dictTableData: [],
      searchDictForm: {
        dictName: '',
        dictCode: '',
        current: 1,
        size: 10
      },
      total: 0,
      dictDialogVisible: false,
      infoDialogVisible: false,
      dict: {
        id: undefined,
        dictName: '',
        dictCode: '',
        isOpen: 0
      },
      dictInfo: {
        id: undefined,
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
          this.dictTableData = rep.data.records
          this.searchDictForm.size = rep.data.size
          this.searchDictForm.current = rep.data.current
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
      this.searchDictForm.size = size
      this.reloadList()
    },
    handleCurrentChange (current) {
      this.searchDictForm.current = current
      this.reloadList()
    },
    search () {
      this.reloadList()
    },
    buildParam () {
      return this.searchDictForm
    },
    searchReset () {
      this.$refs.searchForm.resetFields()
    },
    dictHandleSelectionChange (val) {
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
      this.title = '创建字典'
      this.dialogType = DIALOG_TYPE.ADD
      this.dictDialogVisible = true
    },
    edit (row) {
      this.title = '修改字典'
      this.dialogType = DIALOG_TYPE.EDIT
      this.dictDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.dict, row)
      })
    },
    info (row) {
      this.title = '查看信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.infoDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.dict, row)
      })
    },
    showDictDetail (row) {
      this.$router.push({
        name: 'dictItem',
        path: '/dictItem',
        params: row
      })
    },
    submitDictForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogType === DIALOG_TYPE.ADD ? this.save() : this.modify()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    save () {
      save(this.dict).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: rep.message })
          this.dictDialogVisible = false
          this.reloadList()
        }
      })
    },
    modify () {
      modify(this.dict).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: rep.message })
          this.dictDialogVisible = false
          this.reloadList()
        }
      })
    },
    closeInfoDialog () {
      this.dict = this.dictInfo
    },
    closeDictDialog (formName) {
      this.dict.id = undefined
      this.$refs[formName].resetFields()
    },
    resetDictForm (formName) {
      this.dictDialogVisible = false
      this.closeDictDialog()
      this.$refs[formName].resetFields()
    }
  }
}
</script>
