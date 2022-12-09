<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchPlatformForm" class="demo-form-inline" label-width="80px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="平台名称" prop="platformName">
              <el-input v-model="searchPlatformForm.platformName" clearable placeholder="平台名称"/>
            </el-form-item>
            <el-form-item label="平台编码" prop="platformCode">
              <el-input v-model="searchPlatformForm.platformCode" clearable placeholder="平台编码"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="searchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['sys:platform:create']" plain size="mini" type="primary" @click="create">新建</el-button>
        <el-button v-has="['sys:platform:delete']" plain size="mini" type="danger" @click="remove">删除</el-button>
        <el-button v-has="['sys:platform:export']" plain size="mini" type="info" @click="exportInfo">导出</el-button>
        <el-button v-has="['sys:platform:export']" plain size="mini" @click="importInfo">导入</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="platformTableData"
        border
        empty-text="无数据"
        height="500"
        max-height="700"
        size="mini"
        stripe
        style="width: 100%"
        @selection-change="platformHandleSelectionChange">
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
          label="平台编码"
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
            <el-button v-has="['sys:platform:modify']" size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button v-has="['sys:platform:delete']" size="mini" type="text"
                       @click.native.prevent="removeItem(scope.$index, platformTableData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchPlatformForm.current"
          :page-size="searchPlatformForm.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>

    <el-dialog :title="title" :visible.sync="platformDialogVisible" width="800px"
               @close="closePlatformDialog('platformRuleForm')">
      <el-form ref="platformRuleForm" :model="platform" :rules="platformRules" size="mini">
        <el-form-item :label-width="formLabelWidth" label="平台名称" prop="platformName">
          <el-input v-model="platform.platformName" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="平台编码" prop="platformCode">
          <el-input v-model="platform.platformCode" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="描述" prop="description">
          <el-input v-model="platform.description" autocomplete="off" clearable type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetPlatformForm('platformRuleForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitPlatformForm('platformRuleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="800px"
               @close="closeInfoDialog">
      <el-descriptions :column="2" border size="mini">
        <el-descriptions-item>
          <template slot="label">
            平台名称
          </template>
          {{ platform.platformName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            平台编码
          </template>
          <el-tag size="small">{{ platform.platformCode }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            描述
          </template>
          {{ platform.description }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

  </el-container>
</template>

<script>
import { del, list, modify, save } from '@/api/sys/platform'
import { confirmAlert, DIALOG_TYPE } from '@/utils/constant'
import JSONBigInt from 'json-bigint'
import { Message } from 'element-ui'

export default {
  name: 'PlatformView',
  data () {
    return {
      multipleSelectionPlatformIds: [],
      platformTableData: [],
      searchPlatformForm: {
        platformName: '',
        platformCode: '',
        current: 1,
        size: 10
      },
      total: 0,
      title: '',
      platformDialogVisible: false,
      infoDialogVisible: false,
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
      platformRules: {
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
    }
  },
  mounted () {
    this.reloadList()
  },
  methods: {
    reloadList () {
      list(this.buildParam()).then((rep) => {
        if (rep.code === 1) {
          this.platformTableData = rep.data.records
          this.searchPlatformForm.size = rep.data.size
          this.searchPlatformForm.current = rep.data.current
          this.total = rep.data.total
        }
      })
    },
    buildParam () {
      return this.searchPlatformForm
    },
    handleSizeChange (size) {
      this.searchPlatformForm.size = size
      this.reloadList()
    },
    handleCurrentChange (current) {
      this.searchPlatformForm.current = current
      this.reloadList()
    },
    search () {
      this.reloadList()
    },
    searchReset () {
      this.$refs.searchForm.resetFields()
    },
    platformHandleSelectionChange (val) {
      this.multipleSelectionPlatformIds = val
    },
    /**
     * 批量删除
     */
    remove () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelectionPlatformIds.map((x) => ids.push(JSONBigInt.parse(x.id)))
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
      this.title = '创建平台'
      this.dialogType = DIALOG_TYPE.ADD
      this.platformDialogVisible = true
    },
    edit (row) {
      this.title = '修改平台'
      this.dialogType = DIALOG_TYPE.EDIT
      this.platformDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.platform, row)
      })
    },
    info (row) {
      this.title = '查看信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.infoDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.platform, row)
      })
    },
    closePlatformDialog (formName) {
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
    submitPlatformForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogType === DIALOG_TYPE.ADD ? this.save() : this.modify()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetPlatformForm (formName) {
      this.platformDialogVisible = false
      this.$refs[formName].resetFields()
    },
    save () {
      this.platform.id = undefined
      save(this.platform).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: '添加成功' })
          this.platformDialogVisible = false
          this.reloadList()
        }
      })
    },
    modify () {
      modify(this.platform).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: '修改成功' })
          this.platformDialogVisible = false
          this.reloadList()
        }
      })
    }
  }
}
</script>
