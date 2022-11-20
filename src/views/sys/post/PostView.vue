<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchPostForm" class="demo-form-inline" size="mini">
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
        <el-button v-has="['sys:post:save']" plain size="mini" type="primary" @click="create">新建</el-button>
        <el-button v-has="['sys:post:delete']" plain size="mini" type="danger" @click="remove">删除</el-button>
        <el-button plain size="mini" type="info" @click="exportInfo">导出</el-button>
        <el-button plain size="mini" @click="importInfo">导入</el-button>
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
          label="创建人"
          prop="createName">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="info(scope.row)">查看</el-button>
            <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text"
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
          <el-input v-model="post.postName" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="岗位编码" prop="postCode">
          <el-input v-model="post.postCode" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="岗位描述" prop="description">
          <el-input v-model="post.description" autocomplete="off" clearable type="textarea"></el-input>
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
import { del, list, modify, save } from '@/api/sys/post'
import { confirmAlert, DIALOG_TYPE } from '@/utils/constant'
import JSONBigInt from 'json-bigint'
import { Message } from 'element-ui'

export default {
  name: 'PostView',
  data () {
    return {
      multipleSelectionPostIds: [],
      postTableData: [],
      searchPostForm: {
        postName: '',
        postCode: '',
        current: 1,
        size: 10
      },
      total: 0,
      title: '',
      postDialogVisible: false,
      infoDialogVisible: false,
      // 默认是创建
      dialogType: DIALOG_TYPE.ADD,
      formLabelWidth: '80px',
      post: {
        id: null,
        postName: '',
        postCode: '',
        description: ''
      },
      postInfo: {
        id: null,
        postName: '',
        postCode: '',
        description: ''
      },
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
          this.postTableData = rep.data.records
          this.searchPostForm.size = rep.data.size
          this.searchPostForm.current = rep.data.current
          this.total = rep.data.total
        }
      })
    },
    buildParam () {
      return this.searchPostForm
    },
    handleSizeChange (size) {
      this.searchPostForm.size = size
      this.reloadList()
    },
    handleCurrentChange (current) {
      this.searchPostForm.current = current
      this.reloadList()
    },
    search () {
      this.reloadList()
    },
    searchReset () {
      this.$refs.searchForm.resetFields()
    },
    postHandleSelectionChange (val) {
      this.multipleSelectionPostIds = val
    },
    /**
     * 批量删除
     */
    remove () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelectionPostIds.map((x) => ids.push(JSONBigInt.parse(x.id)))
        del(ids).then(rep => {
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
      this.title = '创建岗位'
      this.dialogType = DIALOG_TYPE.ADD
      this.postDialogVisible = true
    },
    edit (row) {
      this.title = '修改岗位'
      this.dialogType = DIALOG_TYPE.EDIT
      this.postDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.post, row)
      })
    },
    info (row) {
      this.title = '查看信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.infoDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.post, row)
      })
    },
    closePostDialog (formName) {
      this.post.id = undefined
      this.$refs[formName].resetFields()
    },
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
    resetPostForm (formName) {
      this.postDialogVisible = false
      this.$refs[formName].resetFields()
    },
    save () {
      this.post.id = undefined
      save(this.post).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: '添加成功' })
          this.postDialogVisible = false
          this.reloadList()
        }
      })
    },
    modify () {
      modify(this.post).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: '修改成功' })
          this.postDialogVisible = false
          this.reloadList()
        }
      })
    }
  }
}
</script>
