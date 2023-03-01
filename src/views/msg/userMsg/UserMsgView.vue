<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchUserMsgForm" class="demo-form-inline" label-width="90px"
               size="mini">
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
        <el-button v-has="['sys:userMsg:delete']" :disabled="checkDeleteItem" plain size="mini" type="danger"
                   @click="remove">删除
        </el-button>
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
            {{ this.getDescriptionsDictLabel()(userMsg, 'userMsgType', 'MSG_TYPE') }}
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
        msgTitle: '',
        msgCode: '',
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
        msgTitle: '',
        msgCode: '',
        msgType: 2,
        msgLevel: '',
        content: '',
        createBy: '',
        createTime: '',
        markRead: ''
      },
      // 消息详情数据
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
     * @returns {{current: number, size: number, msgTitle: string, msgCode: string, username: string}}
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
     *
     * @param formName
     */
    closeInfoDialog () {
      this.userMsg = this.userMsgInfo
    }
  }
}
</script>
