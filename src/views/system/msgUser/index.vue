<template>
  <base-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchUserMsgForm" class="demo-form-inline" label-width="90px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="消息标题" prop="title">
              <el-input v-model="searchUserMsgForm.title" clearable placeholder="消息标题"/>
            </el-form-item>
            <el-form-item label="消息编码" prop="code">
              <el-input v-model="searchUserMsgForm.code" clearable placeholder="消息编码"/>
            </el-form-item>
            <el-form-item label="消息接收人" prop="username">
              <el-input v-model="searchUserMsgForm.username" clearable placeholder="消息接收人"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="searchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['sys:msg:delete']" :disabled="checkDeleteItem" plain size="mini" type="danger"
                   @click="remove">删除
        </el-button>
      </div>
      <el-table
        ref="userMsgTable"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        :data="userMsgTableData"
        border
        empty-text="无数据"
        size="mini"
        stripe
        @selection-change="userMsgHandleSelectionChange">
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
          label="消息名称"
          prop="title"
          show-overflow-tooltip
          width="200">
        </el-table-column>
        <el-table-column
          label="消息编码"
          prop="code"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          :formatter="(row, column) => this.column()(row, column, 'MSG_TYPE')"
          label="消息类型"
          prop="type"
          show-overflow-tooltip/>
        <el-table-column
          :formatter="(row, column) => this.column()(row, column, 'MSG_LEVEL')"
          label="消息级别"
          prop="level"/>
        <el-table-column
          label="内容"
          prop="content"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="消息接收人"
          prop="username">
        </el-table-column>
        <el-table-column
          label="消息接收时间"
          prop="createTime">
        </el-table-column>
        <el-table-column
          :formatter="(row, column) => this.column()(row, column, 'MARK_READ')"
          label="已读"
          prop="isRead"/>
        <el-table-column
          :formatter="(row, column) => this.column()(row, column, 'MARK_CLOSE')"
          label="已关闭"
          prop="isClose"/>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="info(scope.row)">查看</el-button>
            <el-button v-has="['sys:msg:delete']" size="mini" type="text"
                       @click.native.prevent="removeItem(scope.$index, userMsgTableData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchUserMsgForm.current"
          :page-size="searchUserMsgForm.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="40vw"
               @close="closeInfoDialog">
      <el-descriptions :column="2" border size="mini">
        <el-descriptions-item label="消息名称">
          {{ userMsg.title }}
        </el-descriptions-item>
        <el-descriptions-item label="消息编码">
          <el-tag size="small">{{ userMsg.code }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="消息类型">
          <el-tag size="small">
            {{ this.descriptions()(userMsg, 'type', 'MSG_TYPE') }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="消息级别">
          <el-tag :type="userMsg.level" size="small">
            {{ this.descriptions()(userMsg, 'level', 'MSG_LEVEL') }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="内容">
          {{ userMsg.content }}
        </el-descriptions-item>
        <el-descriptions-item label="消息接收人">
          {{ userMsg.username }}
        </el-descriptions-item>
        <el-descriptions-item label="消息接收时间">
          {{ userMsg.createTime }}
        </el-descriptions-item>
        <el-descriptions-item label="已读">
          <el-tag size="small">
            {{ this.descriptions()(userMsg, 'isRead', 'MARK_READ') }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="已关闭">
          <el-tag size="small">
            {{ this.descriptions()(userMsg, 'isClose', 'MARK_CLOSE') }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </base-container>
</template>

<script>
import { del, list } from '@/api/system/userMsg'
import { confirmAlert } from '@utils/common'
import { DIALOG_TYPE } from '@/const/constant'
import JSONBigInt from 'json-bigint'
import { dict } from '@/mixins'

export default {
  name: 'MsgUser',
  mixins: [dict],
  data () {
    return {
      // 此页面需要字典编码
      dictCode: ['MSG_LEVEL', 'MSG_TYPE', 'MARK_READ'],
      // 当前操作类型
      dialogType: DIALOG_TYPE.ADD,
      // 弹出框标题
      title: '',
      // 单元格选中数据
      multipleSelectionUserMsgIds: [],
      // 消息表格数据
      userMsgTableData: [],
      // 消息查询条件数据
      searchUserMsgForm: {
        title: '',
        code: '',
        username: '',
        current: 1,
        size: 10
      },
      // 分页总数
      total: 0,
      // 标记删除按钮是否可以点击
      checkDeleteItem: true,
      // 消息详情弹出框
      infoDialogVisible: false,
      formLabelWidth: '80px',
      // 消息添加修改数据
      userMsg: {
        id: null,
        title: '',
        code: '',
        type: 2,
        level: '',
        content: '',
        createBy: '',
        createTime: '',
        isRead: '',
        isClose: ''
      },
      // 消息详情数据
      userMsgInfo: {
        id: null,
        title: '',
        code: '',
        type: 2,
        level: '',
        content: '',
        createBy: '',
        createTime: '',
        isRead: '',
        isClose: ''
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
      list(this.buildParam()).then((rep) => {
        if (rep.code === 1) {
          this.userMsgTableData = rep.data.records
          this.searchUserMsgForm.size = rep.data.size
          this.searchUserMsgForm.current = rep.data.current
          this.total = rep.data.total
        }
      })
    },
    /**
     * 构造查询条件
     *
     * @returns {{current: number, size: number, title: string, code: string, username: string}}
     */
    buildParam () {
      return this.searchUserMsgForm
    },
    /**
     * 分页大小切换
     *
     * @param size
     */
    handleSizeChange (size) {
      this.searchUserMsgForm.size = size
      this.reloadList()
    },
    /**
     * 当前页切换
     *
     * @param current
     */
    handleCurrentChange (current) {
      this.searchUserMsgForm.current = current
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
    userMsgHandleSelectionChange (val) {
      this.checkDeleteItem = !val.length
      this.multipleSelectionUserMsgIds = val
    },
    /**
     * 批量删除
     */
    remove () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelectionUserMsgIds.map((x) => ids.push(JSONBigInt.parse(x.id)))
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
            this.reloadList()
            this.$message.success('删除成功')
          }
        })
      })
    },
    /**
     * 详情
     *
     * @param row
     */
    info (row) {
      this.title = '查看信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.infoDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.userMsg, row)
      })
    },
    /**
     * 关闭消息详情弹出框事件
     */
    closeInfoDialog () {
      this.userMsg = this.userMsgInfo
    }
  }
}
</script>
