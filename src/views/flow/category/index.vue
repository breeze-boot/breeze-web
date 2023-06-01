<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchCategory" class="demo-form-inline" label-width="100px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="流程分类名称" prop="categoryName">
              <el-input v-model="searchCategory.categoryName" clearable placeholder="流程分类名称"/>
            </el-form-item>
            <el-form-item label="流程分类编码" prop="categoryCode">
              <el-input v-model="searchCategory.categoryCode" clearable placeholder="流程分类编码"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch()">查询</el-button>
              <el-button type="info" @click="handleSearchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['flow:category:create']" plain size="mini" type="primary" @click="handleCreate">新建
        </el-button>
        <el-button v-has="['flow:category:delete']" :disabled="checkDelete" plain size="mini" type="danger"
                   @click="handleRemove">删除
        </el-button>
      </div>
      <el-table
        ref="categoryTable"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        :data="categoryTableData"
        border
        empty-text="无数据"
        size="mini"
        stripe
        @selection-change="handleCategorySelectionChange">
        <el-table-column
          type="selection"
          width="55"/>
        <el-table-column
          v-if="false"
          label="ID"
          prop="id"
          width="200"/>
        <el-table-column
          label="流程分类名称"
          prop="categoryName"
          show-overflow-tooltip/>
        <el-table-column
          label="流程分类编码"
          prop="categoryCode"
          show-overflow-tooltip/>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleInfo(scope.row)">查看</el-button>
            <el-button v-has="['flow:category:modify']" size="mini" type="text" @click="handleEdit(scope.row)">编辑
            </el-button>
            <el-button v-has="['flow:category:delete']" size="mini" type="text"
                       @click.native.prevent="handleRemoveItem(scope.$index, categoryTableData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchCategory.current"
          :page-size="searchCategory.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>

    <el-dialog :title="title" :visible.sync="categoryDialogVisible" width="40vw"
               @close="handleCloseCategoryDialog('categoryForm')">
      <el-form ref="categoryForm" :model="category" :rules="categoryRules" size="mini">
        <el-form-item :label-width="formLabelWidth" label="流程分类名称" prop="categoryName">
          <el-input v-model="category.categoryName" autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="流程分类编码" prop="categoryCode">
          <el-input v-model="category.categoryCode" autocomplete="off" clearable/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCancelCategoryForm('categoryForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitCategoryForm('categoryForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="40vw"
               @close="handleCloseInfoDialog">
      <el-descriptions :column="2" border size="mini">
        <el-descriptions-item label="流程分类名称">
          {{ category.categoryName }}
        </el-descriptions-item>
        <el-descriptions-item label="流程分类编码">
          <el-tag size="small">{{ category.categoryCode }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

  </el-container>
</template>

<script>
import { checkCategoryCode, del, list, modify, save } from '@/api/flow/category'
import { confirmAlert } from '@utils/common'
import JSONBigInt from 'json-bigint'
import { DIALOG_TYPE } from '@/const/constant'

export default {
  name: 'Category',
  data () {
    return {
      // 当前操作类型
      dialogType: DIALOG_TYPE.ADD,
      // 弹出框标题
      title: '',
      // 单元格选中数据
      multipleSelectionCategoryIds: [],
      // 流程分类表格数据
      categoryTableData: [],
      // 流程分类查询条件数据
      searchCategory: {
        categoryName: '',
        categoryCode: '',
        current: 1,
        size: 10
      },
      // 分页总数
      total: 0,
      // 标记删除按钮是否可以点击
      checkDelete: true,
      // 流程分类添加修改弹出框
      categoryDialogVisible: false,
      // 流程分类详情弹出框
      infoDialogVisible: false,
      // 表单标题宽度
      formLabelWidth: '110px',
      // 流程分类添加修改数据
      category: {
        id: undefined,
        categoryName: '',
        categoryCode: '',
        tenantId: localStorage.getItem('TENANT_ID')
      },
      // 流程分类详情数据
      categoryInfo: {
        id: undefined,
        categoryName: '',
        categoryCode: '',
        tenantId: localStorage.getItem('TENANT_ID')
      },
      // 流程分类添加修改表单规则
      categoryRules: {
        categoryName: [
          {
            required: true,
            message: '请输入流程分类名称',
            trigger: 'blur'
          }
        ],
        categoryCode: [
          {
            required: true,
            message: '请输入流程分类编码',
            trigger: 'blur'
          }, {
            validator: (rule, value, callback) => {
              checkCategoryCode(value, this.category.id).then((response) => {
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
    // 初始化加载表格数据
    this.reloadList()
  },
  methods: {
    /**
     * 初始化加载表格数据
     */
    reloadList () {
      list(this.buildParam()).then((response) => {
        this.categoryTableData = response.data.records
        this.searchCategory.size = response.data.size
        this.searchCategory.current = response.data.current
        this.total = response.data.total
      })
    },
    /**
     * 构造查询条件
     *
     * @returns {{current: number, size: number, categoryName: string, categoryCode: string}}
     */
    buildParam () {
      return this.searchCategory
    },
    /**
     * 分页大小切换
     *
     * @param size
     */
    handleSizeChange (size) {
      this.searchCategory.size = size
      this.reloadList()
    },
    /**
     * 当前页切换
     *
     * @param current
     */
    handleCurrentChange (current) {
      this.searchCategory.current = current
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
     * 流程分类表格复选框事件
     *
     * @param val
     */
    handleCategorySelectionChange (val) {
      this.checkDelete = !val.length
      this.multipleSelectionCategoryIds = val
    },
    /**
     * 批量删除
     */
    handleRemove () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelectionCategoryIds.map((x) => ids.push(JSONBigInt.parse(x.id)))
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
      this.title = '创建流程分类'
      this.dialogType = DIALOG_TYPE.ADD
      this.categoryDialogVisible = true
    },
    /**
     * 修改
     * @param row
     */
    handleEdit (row) {
      this.title = '修改流程分类'
      this.dialogType = DIALOG_TYPE.EDIT
      this.categoryDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.category, row)
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
        Object.assign(this.category, row)
      })
    },
    /**
     * 关闭流程分类添加修改弹出框事件
     *
     * @param formName
     */
    handleCloseCategoryDialog (formName) {
      this.category.id = undefined
      this.$refs[formName].resetFields()
    },
    /**
     * 关闭详情弹出框事件
     */
    handleCloseInfoDialog () {
      this.category = this.categoryInfo
    },
    /**
     * 添加修改弹出框提交
     *
     * @param formName
     */
    handleSubmitCategoryForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogType === DIALOG_TYPE.ADD ? this.save() : this.modify()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 保存请求
     */
    save () {
      this.category.id = undefined
      save(this.category).then((response) => {
        if (response.code === 1) {
          this.$message.success('添加成功')
          this.categoryDialogVisible = false
          this.reloadList()
        }
      })
    },
    /**
     * 修改请求
     */
    modify () {
      modify(this.category).then((response) => {
        if (response.code === 1) {
          this.$message.success('修改成功')
          this.categoryDialogVisible = false
          this.reloadList()
        }
      })
    },
    /**
     * 添加修改弹出框重置
     *
     * @param formName
     */
    handleCancelCategoryForm (formName) {
      this.categoryDialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>
