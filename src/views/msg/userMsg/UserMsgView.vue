<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchUserMsgForm" class="demo-form-inline" size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="消息标题" prop="msgTitle">
              <el-input v-model="searchUserMsgForm.msgTitle" clearable placeholder="消息标题"/>
            </el-form-item>
            <el-form-item label="消息编码" prop="msgCode">
              <el-input v-model="searchUserMsgForm.msgCode" clearable placeholder="消息编码"/>
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
        <el-button v-has="['sys:userMsg:delete']" plain size="mini" type="danger" @click="remove">删除</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="userMsgTableData"
        border
        empty-text="无数据"
        height="500"
        max-height="700"
        size="mini"
        stripe
        style="width: 100%"
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
          prop="msgTitle"
          show-overflow-tooltip
          width="200">
        </el-table-column>
        <el-table-column
          label="消息编码"
          prop="msgCode"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          :formatter="(row, column) => this.getTableDictLabel()(row, column, 'MSG_TYPE')"
          label="消息类型"
          prop="msgType"
          show-overflow-tooltip/>
        <el-table-column
          :formatter="(row, column) => this.getTableDictLabel()(row, column, 'MSG_LEVEL')"
          label="消息级别"
          prop="msgLevel"/>
        <el-table-column
          label="内容"
          prop="content"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="消息发送人"
          prop="createName">
        </el-table-column>
        <el-table-column
          label="消息接收人"
          prop="username">
        </el-table-column>
        <el-table-column
          label="消息发送时间"
          prop="createTime">
        </el-table-column>
        <el-table-column
          :formatter="(row, column) => this.getTableDictLabel()(row, column, 'MARK_READ')"
          label="消息状态"
          prop="markRead"/>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="info(scope.row)">查看</el-button>
            <el-button v-has="['sys:userMsg:delete']" size="mini" type="text"
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

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="800px"
               @close="closeInfoDialog">
      <el-descriptions :column="2" border size="mini">
        <el-descriptions-item>
          <template slot="label">
            消息名称
          </template>
          {{ userMsg.msgTitle }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            消息编码
          </template>
          <el-tag size="small">{{ userMsg.msgCode }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            消息类型
          </template>
          <el-tag size="small">
            {{ this.getDescriptionsDictLabel()(msg, 'userMsgType', 'MSG_TYPE') }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            消息级别
          </template>
          <el-tag :type="userMsg.msgLevel" size="small">
            {{ this.getDescriptionsDictLabel()(userMsg, 'msgLevel', 'MSG_LEVEL') }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            内容
          </template>
          {{ userMsg.content }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            消息发送人
          </template>
          {{ userMsg.createName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            消息接收人
          </template>
          {{ userMsg.username }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            消息发送时间
          </template>
          {{ userMsg.createTime }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            消息状态
          </template>
          <el-tag size="small">
            {{ this.getDescriptionsDictLabel()(userMsg, 'markRead', 'MARK_READ') }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

  </el-container>
</template>

<script>
import { del, list } from '@/api/msg/userMsg'
import { confirmAlert, DIALOG_TYPE } from '@/utils/constant'
import JSONBigInt from 'json-bigint'
import { mapGetters } from 'vuex'

export default {
  name: 'UserMsgView',
  data () {
    return {
      multipleSelectionUserMsgIds: [],
      userMsgTableData: [],
      searchUserMsgForm: {
        msgTitle: '',
        msgCode: '',
        username: '',
        current: 1,
        size: 10
      },
      total: 0,
      title: '',
      infoDialogVisible: false,
      // 默认是创建
      dialogType: DIALOG_TYPE.ADD,
      formLabelWidth: '80px',
      userMsg: {
        id: null,
        msgTitle: '',
        msgCode: '',
        msgType: 2,
        msgLevel: '',
        content: '',
        createBy: '',
        createTime: '',
        markRead: ''
      },
      userMsgInfo: {
        id: null,
        msgTitle: '',
        msgCode: '',
        msgType: 2,
        msgLevel: '',
        content: '',
        createBy: '',
        createTime: '',
        markRead: ''
      }
    }
  },
  mounted () {
    this.$toLoadDict(['MSG_LEVEL', 'MSG_TYPE', 'MARK_READ']).then((dict) => {
      this.reloadList()
    })
  },
  methods: {
    ...mapGetters('dict', ['getDict', 'getDescriptionsDictLabel', 'getTableDictLabel']),
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
    buildParam () {
      return this.searchUserMsgForm
    },
    handleSizeChange (size) {
      this.searchUserMsgForm.size = size
      this.reloadList()
    },
    handleCurrentChange (current) {
      this.searchUserMsgForm.current = current
      this.reloadList()
    },
    search () {
      this.reloadList()
    },
    searchReset () {
      this.$refs.searchForm.resetFields()
    },
    userMsgHandleSelectionChange (val) {
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
    info (row) {
      this.title = '查看信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.infoDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.userMsg, row)
      })
    },
    closeInfoDialog () {
      this.userMsg = this.userMsgInfo
    }
  }
}
</script>
