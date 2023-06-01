<template>
  <base-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchDict" class="demo-form-inline" label-width="80px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="字典名称" prop="dictName">
              <el-input v-model="searchDict.dictName" clearable placeholder="字典名称"/>
            </el-form-item>
            <el-form-item label="字典编码" prop="dictCode">
              <el-input v-model="searchDict.dictCode" clearable placeholder="字典编码"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button type="info" @click="handleSearchReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['sys:dict:create']" plain size="mini" type="primary" @click="handleCreate">新建</el-button>
        <el-button v-has="['sys:dict:delete']" :disabled="checkDelete" plain size="mini" type="danger"
                   @click="handleRemove">删除
        </el-button>
      </div>
      <el-table
        ref="dictTable"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        :data="dictTableData"
        border
        size="mini"
        stripe
        @selection-change="handleDictSelectionChange">
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
              @change="handleOpen(scope.$index, scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleInfo(scope.row)">查看</el-button>
            <el-button v-has="['sys:dict:modify']" size="mini" type="text" @click="handleEdit(scope.row)">编辑
            </el-button>
            <el-button v-has="['sys:dict:delete']" size="mini" type="text"
                       @click.native.prevent="handleRemoveItem(scope.$index, dictTableData,scope.row)">删除
            </el-button>
            <el-button size="mini" type="text" @click="handleShowDictDetail(scope.row)">查看字典项</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchDict.current"
          :page-size="searchDict.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>

    <el-dialog :title="title" :visible.sync="dictDialogVisible" width="40vw"
               @close="handleCloseDictDialog('dictForm')">
      <el-form ref="dictForm" :model="dict" :rules="dictRules" size="mini">
        <el-form-item :label-width="formLabelWidth" label="字典名称" prop="dictName">
          <el-input v-model="dict.dictName" autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="字典编码" prop="dictCode">
          <el-input v-model="dict.dictCode" autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="是否开启" prop="isOpen" style="text-align: left;">
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
        <el-button size="mini" @click="handleCancelDictForm('dictForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitDictForm('dictForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="40vw" @close="handleCloseInfoDialog">
      <el-descriptions :column="1" border size="mini">
        <el-descriptions-item  label="字典名称">
          <el-tag size="small">{{ dict.dictName }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="字典编码">
          {{ dict.dictCode }}
        </el-descriptions-item>  </el-descriptions>
    </el-dialog>
  </base-container>
</template>

<script>
import { checkDictCode, del, list, modify, open, save } from '@/api/system/dict'
import { confirmAlert } from '@utils/common'
import { DIALOG_TYPE } from '@/const/constant'
import JSONBigInt from 'json-bigint'

export default {
  name: 'Dict',
  components: {},
  data () {
    return {
      // 当前操作类型
      dialogType: DIALOG_TYPE.ADD,
      // 弹出框标题
      title: '',
      // 单元格选中数据
      selectionDictIds: [],
      // 字典表格数据
      dictTableData: [],
      // 字典查询条件数据
      searchDict: {
        dictName: '',
        dictCode: '',
        current: 1,
        size: 10
      },
      // 分页总数
      total: 0,
      // 标记删除按钮是否可以点击
      checkDelete: true,
      // 字典添加修改弹出框
      dictDialogVisible: false,
      // 字典详情弹出框
      infoDialogVisible: false,
      // 表单标题宽度
      formLabelWidth: '80px',
      // 字典添加修改数据
      dict: {
        id: undefined,
        dictName: '',
        dictCode: '',
        isOpen: 0
      },
      // 字典详情数据
      dictInfo: {
        id: undefined,
        dictName: '',
        dictCode: '',
        isOpen: 0
      },
      // 字典添加修改表单规则
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
          }, {
            validator: (rule, value, callback) => {
              checkDictCode(value, this.dict.id).then((response) => {
                if (response.data) {
                  callback()
                  return
                }
                callback(new Error('编码重复'))
              })
            },
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
    /**
     * 初始化加载表格数据
     */
    reloadList () {
      list(this.buildParam()).then((response) => {
        if (response.code === 1) {
          this.dictTableData = response.data.records
          this.searchDict.size = response.data.size
          this.searchDict.current = response.data.current
          this.total = response.data.total
        }
      })
    },
    /**
     * 构造查询条件
     *
     * @returns {{current: number, size: number, dictCode: string, dictName: string}}
     */
    buildParam () {
      return this.searchDict
    },
    /**
     * 分页大小切换
     *
     * @param size
     */
    handleSizeChange (size) {
      this.searchDict.size = size
      this.reloadList()
    },
    /**
     * 当前页切换
     *
     * @param current
     */
    handleCurrentChange (current) {
      this.searchDict.current = current
      this.reloadList()
    },
    /**
     * 查询按钮
     */
    handleSearch () {
      this.reloadList()
    },
    /**
     * 查询重置按钮
     */
    handleSearchReset () {
      this.$refs.searchForm.resetFields()
      this.reloadList()
    },
    /**
     * 字典表格复选框事件
     *
     * @param val
     */
    handleDictSelectionChange (val) {
      this.checkDelete = !val.length
      this.selectionDictIds = val
    },
    /**
     * 批量删除
     */
    handleRemove () {
      confirmAlert(() => {
        const ids = []
        this.selectionDictIds.map((x) => ids.push(JSONBigInt.parse(x.id)))
        del(ids).then((response) => {
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
    handleRemoveItem (index, rows, row) {
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
     * 创建
     */
    handleCreate () {
      this.title = '创建字典'
      this.dialogType = DIALOG_TYPE.ADD
      this.dictDialogVisible = true
    },
    /**
     * 修改
     * @param row
     */
    handleEdit (row) {
      this.title = '修改字典'
      this.dialogType = DIALOG_TYPE.EDIT
      this.dictDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.dict, row)
      })
    },
    /**
     * 详情
     *
     * @param row
     */
    handleInfo (row) {
      this.title = '查看信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.infoDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.dict, row)
      })
    },
    /**
     * 关闭平台添加修改弹出框事件
     *
     * @param formName
     */
    handleCloseDictDialog (formName) {
      this.dict.id = undefined
      this.$refs[formName].resetFields()
    },
    /**
     * 关闭详情弹出框事件
     */
    handleCloseInfoDialog () {
      this.dict = this.dictInfo
    },
    /**
     * 添加修改弹出框提交
     *
     * @param formName
     */
    handleSubmitDictForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogType === DIALOG_TYPE.ADD ? this.handleSave() : this.handleModify()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 保存请求
     */
    handleSave () {
      save(this.dict).then((response) => {
        if (response.code === 1) {
          this.$message.success(response.message)
          this.dictDialogVisible = false
          this.reloadList()
        }
      })
    },
    /**
     * 修改请求
     */
    handleModify () {
      modify(this.dict).then((response) => {
        if (response.code === 1) {
          this.$message.success(response.message)
          this.dictDialogVisible = false
          this.reloadList()
        }
      })
    },
    /**
     * 添加修改弹出框重置
     *
     * @param formName
     */
    handleCancelDictForm (formName) {
      this.dictDialogVisible = false
      this.handleCloseDictDialog()
      this.$refs[formName].resetFields()
    },
    /**
     * 跳转字典详情页
     *
     * @param row
     */
    handleShowDictDetail (row) {
      this.$router.push({
        name: 'dictItem',
        query: {
          id: row.id
        }
      })
    },
    /**
     * 锁定
     *
     * @param index
     * @param row
     */
    handleOpen (index, row) {
      open({
        id: row.id,
        isOpen: row.isOpen
      }).then((response) => {
        this.$message.success(response.message)
      })
    }
  }
}
</script>
