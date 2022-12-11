<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchFileForm" class="demo-form-inline" label-width="80px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="原始名称" prop="originalFileName">
              <el-input v-model="searchFileForm.originalFileName" clearable placeholder="原始文件名称"/>
            </el-form-item>
            <el-form-item label="新名称" prop="newFileName">
              <el-input v-model="searchFileForm.newFileName" clearable placeholder="新文件名称"/>
            </el-form-item>
            <el-form-item label="创建人" prop="createName">
              <el-input v-model="searchFileForm.createName" clearable placeholder="创建人"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="searchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['sys:file:upload']" plain size="mini" type="primary" @click="create">新建</el-button>
        <el-button v-has="['sys:file:delete']" plain size="mini" type="danger" @click="remove">删除</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="fileTableData"
        border
        empty-text="无数据"
        height="500"
        max-height="700"
        size="mini"
        stripe
        style="width: 100%"
        @selection-change="fileHandleSelectionChange">
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
          label="标题"
          prop="title"
          show-overflow-tooltip
          width="200">
        </el-table-column>
        <el-table-column
          label="原始名称"
          prop="originalFileName"
          show-overflow-tooltip
          width="200">
        </el-table-column>
        <el-table-column
          label="新名称"
          prop="newFileName"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          :formatter="(row, column) => this.getTableDictLabel()(row, column, 'OSS_STYLE')"
          label="存储方式"
          prop="ossStyle"
          show-overflow-tooltip/>
        <el-table-column
          label="存储路径"
          prop="path"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="创建人ID"
          prop="createBy"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="创建人"
          prop="createName">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button v-has="['sys:file:preview']" size="mini" type="text" @click="preview(scope.row)">预览</el-button>
            <el-button v-has="['sys:file:download']" size="mini" type="text" @click="download(scope.row)">下载</el-button>
            <el-button size="mini" type="text" @click="info(scope.row)">查看</el-button>
            <el-button v-has="['sys:file:modify']" size="mini" type="text" @click="edit(scope.row)">更新</el-button>
            <el-button v-has="['sys:file:delete']" size="mini" type="text"
                       @click.native.prevent="removeItem(scope.$index, fileTableData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchFileForm.current"
          :page-size="searchFileForm.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>

    <el-dialog :title="title" :visible.sync="previewDialogVisible" width="500px"
               @close="closeUploadDialog">
      <el-main>
        <el-image
          :preview-src-list="[imgUrl]"
          :src="imgUrl"
          style="width: 400px;">
        </el-image>
      </el-main>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="uploadDialogVisible" width="400px"
               @close="closeUploadDialog">
      <el-form ref="uploadFileFrom" :model="file" :rules="fileRules" label-width="0" size="mini">
        <el-form-item prop="title">
          <el-input v-model="file.title" placeholder="请输入文件标题"></el-input>
        </el-form-item>
        <el-form-item prop="ossStyle" style="margin-bottom: 20px;">
          <el-select v-model="file.ossStyle" placeholder="请选择存储位置">
            <el-option
              v-for="item in this.getDict()('OSS_STYLE')"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-upload
          :http-request="uploadImage"
          :show-file-list="false"
          action=""
          class="upload-demo"
          drag
          multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </el-form>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="950px"
               @close="closeInfoDialog">
      <el-descriptions :column="2" border size="mini">
        <el-descriptions-item>
          <template slot="label">
            标题
          </template>
          {{ file.title }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            原始名称
          </template>
          {{ file.originalFileName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            新名称
          </template>
          <el-tag size="small">
            {{ file.newFileName }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            存储方式
          </template>
          <el-tag size="small">
            {{ this.getDescriptionsDictLabel()(file, 'ossStyle', 'OSS_STYLE') }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            存储路径
          </template>
          {{ file.path }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            创建人ID
          </template>
          {{ file.createBy }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            创建人
          </template>
          {{ file.createName }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </el-container>
</template>

<script>
import { del, download, list, preview, upload } from '@/api/sys/file'
import { confirmAlert, DIALOG_TYPE } from '@/utils/constant'
import JSONBigInt from 'json-bigint'
import { saveAs } from 'file-saver'
import { mapGetters } from 'vuex'

export default {
  name: 'FileView',
  data () {
    return {
      multipleSelectionFileIds: [],
      fileTableData: [],
      imgUrl: '',
      searchFileForm: {
        originalFileName: '',
        newFileName: '',
        createBy: '',
        createName: '',
        size: 10
      },
      total: 0,
      title: '',
      uploadDialogVisible: false,
      previewDialogVisible: false,
      infoDialogVisible: false,
      // 默认是创建
      dialogType: DIALOG_TYPE.ADD,
      formLabelWidth: '80px',
      file: {
        id: null,
        title: '',
        ossStyle: ''
      },
      fileInfo: {
        id: null,
        title: '',
        ossStyle: ''
      },
      fileRules: {
        title: [
          {
            required: true,
            message: '请输入文件标题',
            trigger: 'blur'
          }
        ],
        ossStyle: [
          {
            required: true,
            message: '请选择存储位置',
            trigger: 'change'
          }
        ]
      }
    }
  },
  mounted () {
    this.$toLoadDict(['OSS_STYLE']).then((dict) => {
      this.reloadList()
    })
  },
  methods: {
    ...mapGetters('dict', ['getDict', 'getDescriptionsDictLabel', 'getTableDictLabel']),
    reloadList () {
      list(this.buildParam()).then((rep) => {
        if (rep.code === 1) {
          this.fileTableData = rep.data.records
          this.searchFileForm.size = rep.data.size
          this.searchFileForm.current = rep.data.current
          this.total = rep.data.total
        }
      })
    },
    buildParam () {
      return this.searchFileForm
    },
    handleSizeChange (size) {
      this.searchFileForm.size = size
      this.reloadList()
    },
    handleCurrentChange (current) {
      this.searchFileForm.current = current
      this.reloadList()
    },
    search () {
      this.reloadList()
    },
    searchReset () {
      this.$refs.searchForm.resetFields()
    },
    fileHandleSelectionChange (val) {
      this.multipleSelectionFileIds = val
    },
    /**
     * 批量删除
     */
    remove () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelectionFileIds.map((x) => ids.push(JSONBigInt.parse(x.id)))
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
            this.$message.success('删除成功')
            this.reloadList()
          }
        })
      })
    },
    uploadImage (param) {
      const formData = new FormData()
      if (!this.file.title) {
        this.$refs.uploadFileFrom.validate()
        param.file = null
        return
      }
      if (!this.file.ossStyle) {
        this.$refs.uploadFileFrom.validate()
        param.file = null
        return
      }
      formData.append('file', param.file)
      formData.append('title', this.file.title)
      formData.append('ossStyle', this.file.ossStyle)
      upload(formData).then(rep => {
        this.uploadDialogVisible = false
        this.reloadList()
      }).catch(e => {
        console.error('图片上传失败', e)
      })
    },
    info (row) {
      this.title = '查看信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.infoDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.file, row)
      })
    },
    edit (row) {
      this.title = '重新上传文件'
      this.dialogType = DIALOG_TYPE.EDIT
      this.uploadDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.file, row)
      })
    },
    create () {
      this.title = '上传文件'
      this.dialogType = DIALOG_TYPE.ADD
      this.uploadDialogVisible = true
    },
    preview (row) {
      preview(row.id).then(rep => {
        if (rep.code === 1) {
          this.previewDialogVisible = true
          this.imgUrl = rep.data
        }
      })
    },
    download (row) {
      download(row.id).then(rep => {
        const blob = new Blob([rep.data],
          {
            type: 'image/jpeg'
          })
        saveAs(blob, rep.data.originalFileName)
      }).catch(err => {
        console.log(err)
      })
    },
    closeUploadDialog () {
      this.file = this.fileInfo
    },
    closeInfoDialog () {
      this.file = this.fileInfo
    }
  }
}
</script>
