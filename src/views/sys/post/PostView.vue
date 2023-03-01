<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchPostForm" class="demo-form-inline" label-width="80px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="平台名称" prop="postName">
              <el-input v-model="searchPostForm.postName" clearable placeholder="岗位名称"/>
            </el-form-item>
            <el-form-item label="岗位编码" prop="postCode">
              <el-input v-model="searchPostForm.postCode" clearable placeholder="岗位编码"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="searchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['sys:post:create']" plain size="mini" type="primary" @click="create">新建</el-button>
        <el-button v-has="['sys:post:delete']"
                   :disabled="checkDeleteItem" plain size="mini" type="danger" @click="remove">删除
        </el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="postTableData"
        border
        empty-text="无数据"
        height="500"
        max-height="700"
        size="mini"
        stripe
        style="width: 100%"
        @selection-change="postHandleSelectionChange">
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
            <el-button size="mini" type="text" @click="info(scope.row)">查看</el-button>
            <el-button v-has="['sys:post:modify']" size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button v-has="['sys:post:delete']" size="mini" type="text"
                       @click.native.prevent="removeItem(scope.$index, postTableData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchPostForm.current"
          :page-size="searchPostForm.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>

    <el-dialog :title="title" :visible.sync="postDialogVisible" width="800px"
               @close="closePostDialog('postRuleForm')">
      <el-form ref="postRuleForm" :model="post" :rules="postRules" size="mini">
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
        <el-button size="mini" @click="resetPostForm('postRuleForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitPostForm('postRuleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="800px"
               @close="closeInfoDialog">
      <el-descriptions :column="2" border size="mini">
        <el-descriptions-item>
          <template slot="label">
            岗位名称
          </template>
          {{ post.postName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            岗位编码
          </template>
          <el-tag size="small">{{ post.postCode }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            描述
          </template>
          {{ post.description }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

  </el-container>
</template>

<script>
import { checkPostCode, del, list, modify, save } from '@/api/sys/post'
import { confirmAlert, DIALOG_TYPE } from '@/utils/constant'
import JSONBigInt from 'json-bigint'

export default {
  name: 'PostView',
  data () {
    return {
      // 当前操作类型
      dialogType: DIALOG_TYPE.ADD,
      // 弹出框标题
      title: '',
      // 单元格选中数据
      multipleSelectionPostIds: [],
      // 岗位表格数据
      postTableData: [],
      // 岗位查询条件数据
      searchPostForm: {
        postName: '',
        postCode: '',
        current: 1,
        size: 10
      },
      // 分页总数
      total: 0,
      // 标记删除按钮是否可以点击
      checkDeleteItem: true,
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
  mounted () {
    this.reloadList()
  },
  methods: {
    /**
     * 初始化加载表格数据
     */
    reloadList () {
      list(this.buildParam()).then((response) => {
        this.postTableData = response.data.records
        this.searchPostForm.size = response.data.size
        this.searchPostForm.current = response.data.current
        this.total = response.data.total
      })
    },
    /**
     * 构造查询条件
     *
     * @returns {{current: number, size: number, postName: string, postCode: string}}
     */
    buildParam () {
      return this.searchPostForm
    },
    /**
     * 分页大小切换
     *
     * @param size
     */
    handleSizeChange (size) {
      this.searchPostForm.size = size
      this.reloadList()
    },
    /**
     * 当前页切换
     *
     * @param current
     */
    handleCurrentChange (current) {
      this.searchPostForm.current = current
      this.reloadList()
    },
    /**
     * 查询按钮
     */
    search () {
      this.reloadList()
    },
    /**
     * 查询重置按钮
     */
    searchReset () {
      this.$refs.searchForm.resetFields()
    },
    /**
     * 平台表格复选框事件
     *
     * @param val
     */
    postHandleSelectionChange (val) {
      this.checkDeleteItem = !val.length
      this.multipleSelectionPostIds = val
    },
    /**
     * 批量删除
     */
    remove () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelectionPostIds.map((x) => ids.push(JSONBigInt.parse(x.id)))
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
    removeItem (index, rows, row) {
      confirmAlert(() => {
        del([JSONBigInt.parse(row.id)]).then(response => {
          if (response.code === 1) {
            rows.splice(index, 1)
            this.$message.success('删除成功')
          }
        })
      })
    },
    /**
     * 创建
     */
    create () {
      this.title = '创建岗位'
      this.dialogType = DIALOG_TYPE.ADD
      this.postDialogVisible = true
    },
    /**
     * 修改
     * @param row
     */
    edit (row) {
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
    info (row) {
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
    closePostDialog (formName) {
      this.post.id = undefined
      this.$refs[formName].resetFields()
    },
    /**
     * 关闭详情弹出框事件
     */
    closeInfoDialog () {
      this.post = this.postInfo
    },
    /**
     * 提交
     * @param formName
     */
    submitPostForm (formName) {
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
      this.post.id = undefined
      save(this.post).then((response) => {
        if (response.code === 1) {
          this.$message.success('添加成功')
          this.postDialogVisible = false
          this.reloadList()
        }
      })
    },
    /**
     * 修改请求
     */
    modify () {
      modify(this.post).then((response) => {
        if (response.code === 1) {
          this.$message.success('修改成功')
          this.postDialogVisible = false
          this.reloadList()
        }
      })
    },
    /**
     * 添加修改弹出框重置
     * @param formName
     */
    resetPostForm (formName) {
      this.postDialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>
