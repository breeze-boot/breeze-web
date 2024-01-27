<template>
  <base-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchPost" class="demo-form-inline" label-width="80px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="平台名称" prop="postName">
              <el-input v-model="searchPost.postName" clearable placeholder="岗位名称"/>
            </el-form-item>
            <el-form-item label="岗位编码" prop="postCode">
              <el-input v-model="searchPost.postCode" clearable placeholder="岗位编码"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch()">查询</el-button>
              <el-button type="info" @click="handleSearchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['auth:post:create']" plain size="mini" type="primary" @click="handleCreate">新建</el-button>
        <el-button v-has="['auth:post:delete']"
                   :disabled="checkDelete" plain size="mini" type="danger" @click="handleRemove">删除
        </el-button>
      </div>
      <el-table
        ref="postTable"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        :data="postTableData"
        border
        empty-text="无数据"
        size="mini"
        stripe
        @selection-change="handlePostSelectionChange">
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
          label="岗位名称"
          prop="postName"
          show-overflow-tooltip
          width="200">
        </el-table-column>
        <el-table-column
          label="岗位编码"
          prop="postCode"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="描述"
          prop="description"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleInfo(scope.row)">查看</el-button>
            <el-button v-has="['auth:post:modify']" size="mini" type="text" @click="handleEdit(scope.row)">编辑
            </el-button>
            <el-button v-has="['auth:post:delete']" size="mini" type="text"
                       @click.native.prevent="handleRemoveItem(scope.$index, postTableData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchPost.current"
          :page-size="searchPost.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>

    <el-dialog :title="title" :visible.sync="postDialogVisible" width="40vw"
               @close="handleClosePostDialog('postForm')">
      <el-form ref="postForm" :model="post" :rules="postRules" size="mini">
        <el-form-item :label-width="formLabelWidth" label="岗位名称" prop="postName">
          <el-input v-model="post.postName" autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="岗位编码" prop="postCode">
          <el-input v-model="post.postCode" autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="岗位描述" prop="description">
          <el-input v-model="post.description" autocomplete="off" clearable type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCancelPostForm('postForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitPostForm('postForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="40vw"
               @close="handleCloseInfoDialog">
      <el-descriptions :column="2" border size="mini">
        <el-descriptions-item label="岗位名称">
          {{ post.postName }}
        </el-descriptions-item>
        <el-descriptions-item label="岗位编码">
          <el-tag size="small">{{ post.postCode }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="描述">
          {{ post.description }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </base-container>
</template>

<script>
import { checkPostCode, del, list, modify, save } from '@/api/auth/post'
import { confirmAlert } from '@utils/common'
import { DIALOG_TYPE } from '@/const/constant'
import JSONBigInt from 'json-bigint'

export default {
  name: 'Post',
  data () {
    return {
      // 当前操作类型
      dialogType: DIALOG_TYPE.ADD,
      // 弹出框标题
      title: '',
      // 单元格选中数据
      selectionPostIds: [],
      // 岗位表格数据
      postTableData: [],
      // 岗位查询条件数据
      searchPost: {
        postName: '',
        postCode: '',
        current: 1,
        size: 10
      },
      // 分页总数
      total: 0,
      // 标记删除按钮是否可以点击
      checkDelete: true,
      // 岗位添加修改弹出框
      postDialogVisible: false,
      // 岗位详情弹出框
      infoDialogVisible: false,
      // 表单标题宽度
      formLabelWidth: '80px',
      // 岗位添加修改数据
      post: {
        id: undefined,
        postName: '',
        postCode: '',
        description: ''
      },
      // 岗位详情数据
      postInfo: {
        id: undefined,
        postName: '',
        postCode: '',
        description: ''
      },
      // 岗位添加修改表单规则
      postRules: {
        postName: [
          {
            required: true,
            message: '请输入岗位名称',
            trigger: 'blur'
          }
        ],
        postCode: [
          {
            required: true,
            message: '请输入岗位编码',
            trigger: 'blur'
          }, {
            validator: (rule, value, callback) => {
              checkPostCode(value, this.post.id).then((response) => {
                if (response.data) {
                  callback()
                  return
                }
                callback(new Error('编码重复'))
              })
            },
            trigger: 'blur'
          }]
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
        this.postTableData = response.data.records
        this.searchPost.size = response.data.size
        this.searchPost.current = response.data.current
        this.total = response.data.total
      })
    },
    /**
     * 构造查询条件
     *
     * @returns {{current: number, size: number, postName: string, postCode: string}}
     */
    buildParam () {
      return this.searchPost
    },
    /**
     * 分页大小切换
     *
     * @param size
     */
    handleSizeChange (size) {
      this.searchPost.size = size
      this.reloadList()
    },
    /**
     * 当前页切换
     *
     * @param current
     */
    handleCurrentChange (current) {
      this.searchPost.current = current
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
     * 平台表格复选框事件
     *
     * @param val
     */
    handlePostSelectionChange (val) {
      this.checkDelete = !val.length
      this.selectionPostIds = val
    },
    /**
     * 批量删除
     */
    handleRemove () {
      confirmAlert(() => {
        const ids = []
        this.selectionPostIds.map((x) => ids.push(JSONBigInt.parse(x.id)))
        del(ids).then(response => {
          this.reloadList()
          this.$message.success('删除成功')
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
          rows.splice(index, 1)
          this.$message.success('删除成功')
        })
      })
    },
    /**
     * 创建
     */
    handleCreate () {
      this.title = '创建岗位'
      this.dialogType = DIALOG_TYPE.ADD
      this.postDialogVisible = true
    },
    /**
     * 修改
     * @param row
     */
    handleEdit (row) {
      this.title = '修改岗位'
      this.dialogType = DIALOG_TYPE.EDIT
      this.postDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.post, row)
      })
    },
    /**
     * 详情
     * @param row
     */
    handleInfo (row) {
      this.title = '查看信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.infoDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.post, row)
      })
    },
    /**
     * 关闭岗位添加修改弹出框事件
     * @param formName
     */
    handleClosePostDialog (formName) {
      this.post.id = undefined
      this.$refs[formName].resetFields()
    },
    /**
     * 关闭详情弹出框事件
     */
    handleCloseInfoDialog () {
      this.post = this.postInfo
    },
    /**
     * 提交
     * @param formName
     */
    handleSubmitPostForm (formName) {
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
      this.post.id = undefined
      save(this.post).then((response) => {
        this.$message.success('添加成功')
        this.postDialogVisible = false
        this.reloadList()
      })
    },
    /**
     * 修改请求
     */
    handleModify () {
      modify(this.post).then((response) => {
        this.$message.success('修改成功')
        this.postDialogVisible = false
        this.reloadList()
      })
    },
    /**
     * 添加修改弹出框重置
     * @param formName
     */
    handleCancelPostForm (formName) {
      this.postDialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>
