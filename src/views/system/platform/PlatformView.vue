<template>
  <el-container>
    <el-main>
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="平台名称">
              <el-input v-model="searchForm.platformName" clearable placeholder="平台名称"/>
            </el-form-item>
            <el-form-item label="平台编码">
              <el-input v-model="searchForm.platformCode" clearable placeholder="平台编码"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="reset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button plain size="mini" type="primary" @click="create" v-has="['sys:platform:save']">新建</el-button>
        <el-button plain size="mini" type="danger" @click="remove" v-has="['sys:platform:delete']">删除</el-button>
        <el-button plain size="mini" type="info" @click="exportInfo">导出</el-button>
        <el-button plain size="mini" @click="importInfo">导入</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        empty-text="无数据"
        height="500"
        max-height="700"
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
          label="平台名称"
          prop="platformName"
          show-overflow-tooltip
          width="200">
        </el-table-column>
        <el-table-column
          label="平台标志"
          prop="platformCode"
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
            <el-button size="mini" type="text" @click="modify(scope.row)">编辑</el-button>
            <el-button size="mini" type="text"
                       @click.native.prevent="removeItem(scope.$index, tableData,scope.row)">删除
            </el-button>
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
               @close="closeDialog('ruleForm')">
      <el-form ref="ruleForm" :model="platform" :rules="rules" size="mini">
        <el-form-item :label-width="formLabelWidth" label="平台名称" prop="platformName">
          <el-input v-model="platform.platformName" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="平台标志" prop="platformCode">
          <el-input v-model="platform.platformCode" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="描述" prop="description">
          <el-input v-model="platform.description" autocomplete="off" clearable type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetForm('ruleForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="dialogVisibleInfo" width="800px"
               @close="closeInfoDialog">
      <el-descriptions :column="2" border size="mini">
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            平台名称
          </template>
          {{ platform.platformName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            平台编码
          </template>
          <el-tag size="small">{{ platform.platformCode }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            描述
          </template>
          {{ platform.description }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

  </el-container>
</template>

<script>
import { add, del, edit, list } from '@/api/system/platform'
import { confirmAlert, DIALOG_TYPE } from '@/utils/constant'
import JSONBigInt from 'json-bigint'
import { Message } from 'element-ui'

export default {
  name: 'PlatformView',
  data: () => ({
    multipleSelection: [],
    tableData: [],
    searchForm: {
      platformName: '',
      platformCode: '',
      current: 1,
      size: 10
    },
    total: 0,
    title: '',
    dialogVisible: false,
    dialogVisibleInfo: false,
    // 默认是创建
    dialogType: DIALOG_TYPE.ADD,
    formLabelWidth: '80px',
    platform: {
      id: null,
      platformName: '',
      platformCode: '',
      description: ''
    },
    platformInfo: {
      id: null,
      platformName: '',
      platformCode: '',
      description: ''
    },
    rules: {
      platformName: [
        {
          required: true,
          message: '请输入平台名称',
          trigger: 'blur'
        }
      ],
      platformCode: [
        {
          required: true,
          message: '请输入平台编码',
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
    buildParam () {
      return this.searchForm
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
    reset () {
      this.searchForm.platformName = ''
      this.searchForm.platformCode = ''
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
        del(ids).then(rep => {
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
      Object.assign(this.platform, val)
    },
    info (val) {
      this.title = '查看信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.dialogVisibleInfo = true
      Object.assign(this.platform, val)
    },
    closeDialog (formName) {
      this.dialogVisible = false
      this.platform.id = undefined
      this.$refs[formName].resetFields()
    },
    closeInfoDialog () {
      this.platform = this.platformInfo
    },
    /**
     * 提交
     * @param formName
     */
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
    resetForm (formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields()
    },
    add () {
      this.platform.id = undefined
      add(this.platform).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: '添加成功' })
          this.reloadList()
        }
      })
    },
    edit () {
      edit(this.platform).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: '修改成功' })
          this.dialogVisible = false
          this.reloadList()
        }
      })
    }
  }
}
</script>
