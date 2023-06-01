<template>
  <base-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchMsg" class="demo-form-inline" label-width="80px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="消息标题" prop="title">
              <el-input v-model="searchMsg.title" clearable placeholder="消息标题"/>
            </el-form-item>
            <el-form-item label="消息编码" prop="code">
              <el-input v-model="searchMsg.code" clearable placeholder="消息编码"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch()">查询</el-button>
              <el-button type="info" @click="handleSearchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['sys:msg:create']" plain size="mini" type="primary" @click="handleCreate">新建</el-button>
        <el-button v-has="['sys:msg:delete']" :disabled="checkDelete" plain size="mini" type="danger"
                   @click="handleRemove">删除
        </el-button>
      </div>
      <el-table
        ref="msgTable"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        :data="msgTableData"
        border
        empty-text="无数据"
        size="mini"
        stripe
        @selection-change="handleMsgSelectionChange">
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
          label="消息标题"
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
          prop="level"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="内容"
          prop="content"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="创建人"
          prop="createName">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="250">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleInfo(scope.row)">查看</el-button>
            <el-button v-has="['sys:msg:modify']" size="mini" type="text" @click="handleEdit(scope.row)">编辑
            </el-button>
            <el-button v-has="['sys:msg:delete']" size="mini" type="text"
                       @click.native.prevent="handleRemoveItem(scope.$index, msgTableData,scope.row)">删除
            </el-button>
            <el-dropdown size="mini" style="margin-left: 5px;" trigger="click" type="primary">
              <span class="el-dropdown-link">
                信息发布
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="2" @click.native="handleSendAll(scope.row)">全部</el-dropdown-item>
                <el-dropdown-item command="1" @click.native="handleToAll(scope.row)">指定人</el-dropdown-item>
                <el-dropdown-item command="1" @click.native="handleToDeptUser(scope.row)">指定部门</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchMsg.current"
          :page-size="searchMsg.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>

    <el-dialog :title="title" :visible.sync="msgDialogVisible" width="40vw"
               @close="handleCloseMsgDialog('msgForm')">
      <el-form ref="msgForm" :model="msg" :rules="msgRules" size="mini">
        <el-form-item :label-width="formLabelWidth" label="消息标题" prop="title">
          <el-input v-model="msg.title" autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="消息编码" prop="code">
          <el-input v-model="msg.code" autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="消息类型" prop="type">
          <el-radio-group v-model="msg.type">
            <el-radio-button v-for="item in this.dict()('MSG_TYPE')" :key="item.key" :label="item.key">
              {{ item.value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="消息等级" prop="level">
          <el-radio-group v-model="msg.level">
            <el-radio-button v-for="item in this.dict()('MSG_LEVEL')" :key="item.key" :label="item.key">
              {{ item.value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="内容" prop="content">
          <el-input v-model="msg.content" autocomplete="off" clearable type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCancelMsgForm('msgForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitMsgForm('msgForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="40vw"
               @close="handleCloseInfoDialog">
      <el-descriptions :column="2" border size="mini">
        <el-descriptions-item label="消息标题">
          {{ msg.title }}
        </el-descriptions-item>
        <el-descriptions-item label="消息编码">
          <el-tag size="small">{{ msg.code }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="消息类型">
          <el-tag size="small">
            {{ this.descriptions()(msg, 'type', 'MSG_TYPE') }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="消息级别">
          <el-tag :type="msg.level" size="small">
            {{ this.descriptions()(msg, 'level', 'MSG_LEVEL') }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="内容">
          {{ msg.content }}
        </el-descriptions-item>
        <el-descriptions-item label="创建人">
          {{ msg.createName }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="sendDeptMsgDialogVisible" width="1200px"
               @close="handleCloseSendMsgDialog">
      <el-form ref="deptRuleForm" :model="sendMsgData" :rules="sendMsgDataRules" size="mini"
               style="padding-right: 15px;">
        <el-form-item :label-width="formLabelWidth" label="部门"
                      prop="multipleDeptId">
          <el-cascader
            v-model="sendMsgData.multipleDeptId"
            :options="deptOption"
            :props="{ checkStrictly: true, multiple: true, emitPath: false , value: 'key', label: 'value' }"
            :show-all-levels="false"
            collapse-tags
            @change="handleChangeDept"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="用户数据">
          <el-table
            ref="multipleTable"
            :data="sendMsgData.userTableData"
            border
            empty-text="无数据"
            height="300" max-height="500"
            size="mini"
            stripe
            style="width: 100%">
            <el-table-column
              v-if="false"
              label="ID"
              prop="id"
              width="200">
            </el-table-column>
            <el-table-column
              label="展示名称"
              prop="amountName"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              label="用户编号"
              prop="userCode"
              show-overflow-tooltip
              width="180">
            </el-table-column>
            <el-table-column
              label="用户名"
              prop="username"
              show-overflow-tooltip
              width="180">
            </el-table-column>
            <el-table-column
              label="部门"
              prop="deptName"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              label="岗位"
              prop="postName"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              label="身份证"
              prop="idCard"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              label="用户邮箱"
              prop="email"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-button size="mini" type="text"
                           @click.native.prevent="handleRemoveUserItem(scope.$index, sendMsgData.userTableData,scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCloseSendMsgDialog">关 闭</el-button>
        <el-button size="mini" type="primary" @click="handleSendMsgToUser">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="sendUserMsgDialogVisible" width="760px"
               @close="handleCloseSendMsgDialog">
      <el-main>
        <el-transfer
          v-model="sendMsgData.users"
          :button-texts="['用户','接收人']"
          :data="sendMsgData.transferUserData"
          :filter-method="filterMethod"
          :titles="['系统用户', '接收方']"
          filter-placeholder="请输入用户名"
          filterable>
        </el-transfer>
      </el-main>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCloseSendMsgDialog">关 闭</el-button>
        <el-button size="mini" type="primary" @click="handleSendMsgToUser">确 定</el-button>
      </div>
    </el-dialog>
  </base-container>
</template>

<script>
import { del, list, listUserByDeptId, modify, save, selectUser } from '@/api/system/msg'
import { confirmAlert } from '@utils/common'
import { DIALOG_TYPE } from '@/const/constant'
import JSONBigInt from 'json-bigint'
import { selectDept } from '@/api/system/dept'
import { dict } from '@/mixins'

export default {
  name: 'Msg',
  mixins: [dict],
  data () {
    return {
      // 此页面需要字典编码
      dictCode: ['MSG_LEVEL', 'MSG_TYPE'],
      // 当前操作类型
      dialogType: DIALOG_TYPE.ADD,
      // 弹出框标题
      title: '',
      // 单元格选中数据
      multipleSelectionMsgIds: [],
      // 消息表格数据
      msgTableData: [],
      // 部门下拉框
      deptOption: [],
      // 消息查询条件数据
      searchMsg: {
        title: '',
        code: '',
        current: 1,
        size: 10
      },
      // 分页总数
      total: 0,
      // 标记删除按钮是否可以点击
      checkDelete: true,
      // 消息添加修改弹出框
      msgDialogVisible: false,
      // 发送消息到用户弹出框
      sendUserMsgDialogVisible: false,
      // 发送消息到部门弹出框
      sendDeptMsgDialogVisible: false,
      // 消息详情弹出框
      infoDialogVisible: false,
      // 表单标题宽度
      formLabelWidth: '80px',
      msg: {
        id: null,
        title: '',
        code: '',
        type: '0',
        level: 'info',
        content: ''
      },
      // 消息详情数据
      msgInfo: {
        id: null,
        title: '',
        code: '',
        type: '0',
        level: 'info',
        content: ''
      },
      // 消息添加修改表单规则
      msgRules: {
        title: [
          {
            required: true,
            message: '请输入消息标题',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入消息编码',
            trigger: 'blur'
          }
        ],
        content: [
          {
            required: true,
            message: '请输入消息内容',
            trigger: 'blur'
          }
        ]
      },
      // 发送消息表单规则
      sendMsgDataRules: {
        multipleDeptId: []
      },
      // 发送消息数据
      sendMsgData: {
        multipleDeptId: [],
        msgId: '',
        sendMsgType: '1',
        userTableData: [],
        transferUserData: [],
        users: []
      },
      filterMethod (query, item) {
        return item.label.indexOf(query) > -1
      }
    }
  },
  created () {
    this.reloadList()
    this.selectDept()
  },
  methods: {
    /**
     * 初始化加载表格数据
     */
    reloadList () {
      list(this.buildParam()).then((response) => {
        this.msgTableData = response.data.records
        this.searchMsg.size = response.data.size
        this.searchMsg.current = response.data.current
        this.total = response.data.total
      })
    },
    /**
     * 初始化加载表格数据
     */
    reloadUserData () {
      selectUser().then((response) => {
        response.data.forEach((user, index) => {
          this.sendMsgData.transferUserData.push({
            label: user.username,
            key: user.id,
            index: index
          })
        })
      })
    },
    /**
     * 构造查询条件
     *
     * @returns {{current: number, size: number, title: string, code: string}}
     */
    buildParam () {
      return this.searchMsg
    },
    /**
     * 分页大小切换
     *
     * @param size
     */
    handleSizeChange (size) {
      this.searchMsg.size = size
      this.reloadList()
    },
    /**
     * 分页大小切换
     *
     * @param current
     */
    handleCurrentChange (current) {
      this.searchMsg.current = current
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
     * 消息表格复选框事件
     *
     * @param val
     */
    handleMsgSelectionChange (val) {
      this.checkDelete = !val.length
      this.multipleSelectionMsgIds = val
    },
    /**
     * 批量删除
     */
    handleRemove () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelectionMsgIds.map((x) => ids.push(JSONBigInt.parse(x.id)))
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
      this.title = '创建消息'
      this.dialogType = DIALOG_TYPE.ADD
      this.msgDialogVisible = true
    },
    /**
     * 修改
     * @param row
     */
    handleEdit (row) {
      this.title = '修改消息'
      this.dialogType = DIALOG_TYPE.EDIT
      this.msgDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.msg, row)
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
        Object.assign(this.msg, row)
      })
    },
    /**
     * 关闭消息添加修改弹出框事件
     *
     * @param formName
     */
    handleCloseMsgDialog (formName) {
      this.msg.id = undefined
      this.$refs[formName].resetFields()
    },
    /**
     * 关闭详情弹出框事件
     */
    handleCloseInfoDialog () {
      this.msg = this.msgInfo
    },
    /**
     * 提交
     * @param formName
     */
    handleSubmitMsgForm (formName) {
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
      this.msg.id = undefined
      save(this.msg).then((response) => {
        if (response.code === 1) {
          this.$message.success('添加成功')
          this.msgDialogVisible = false
          this.reloadList()
        }
      })
    },
    /**
     * 修改请求
     */
    handleModify () {
      modify(this.msg).then((response) => {
        if (response.code === 1) {
          this.$message.success('修改成功')
          this.msgDialogVisible = false
          this.reloadList()
        }
      })
    },
    /**
     * 添加修改弹出框重置
     *
     * @param formName
     */
    handleCancelMsgForm (formName) {
      this.msgDialogVisible = false
      this.$refs[formName].resetFields()
    },
    /**
     * 删除项
     *
     * @param index
     * @param rows
     * @param row
     */
    handleRemoveUserItem (index, rows, row) {
      confirmAlert(() => {
        rows.splice(index, 1)
        this.sendMsgData.users.splice(index, 1)
        this.$message.success('删除成功')
      })
    },
    /**
     * 发送给全部请求
     * @param row
     */
    handleSendAll (row) {
      this.$sendMsg('/msg/sendBroadcastMsg', {
        tenantId: localStorage.getItem('X-TENANT-ID') || '',
        msgId: row.id
      })
    },
    /**
     * 发送给用户请求
     */
    handleSendMsgToUser () {
      if (this.sendMsgData.users.length === 0) {
        this.$message.warning('还未选择发送信息的用户')
        return
      }
      this.$sendMsg('/msg/sendMsgToUser',
        {
          tenantId: localStorage.getItem('X-TENANT-ID') || '',
          msgId: this.sendMsgData.msgId,
          userIds: this.sendMsgData.users
        }
      )
    },
    /**
     * 发送给全部
     *
     * @param row
     */
    handleToAll (row) {
      this.sendUserMsgDialogVisible = true
      this.reloadUserData()
      this.title = '接收人'
      this.sendMsgData.msgId = row.id
    },
    /**
     * 发送给部门用户
     *
     * @param row
     */
    handleToDeptUser (row) {
      this.sendDeptMsgDialogVisible = true
      this.selectDept()
      this.title = '接收部门'
      this.sendMsgData.msgId = row.id
    },
    handleChangeDept () {
      this.sendMsgData.users = []
      this.sendMsgData.userTableData = []
      if (!this.sendMsgData.multipleDeptId ||
        this.sendMsgData.multipleDeptId.length === 0) {
        return
      }
      // 去查询部门下的用户
      const deptIds = []
      this.sendMsgData.multipleDeptId.forEach(id => {
        deptIds.push(JSONBigInt.parse(id))
      })
      listUserByDeptId(this.sendMsgData.multipleDeptId).then((response) => {
        if (response.code === 1) {
          this.sendMsgData.userTableData = response.data
          const userIds = []
          this.sendMsgData.userTableData.forEach(row => {
            userIds.push(JSONBigInt.parse(row.id))
          })
          this.sendMsgData.users = userIds
        }
      })
    },
    /**
     * 关闭发送消息弹出框事件
     */
    handleCloseSendMsgDialog () {
      this.sendMsgData = {
        multipleDeptId: [],
        msgId: '',
        sendMsgType: '1',
        userTableData: [],
        transferUserData: [],
        users: []
      }
      this.sendUserMsgDialogVisible = false
      this.sendDeptMsgDialogVisible = false
    },
    /**
     * 部门下拉框
     */
    selectDept () {
      selectDept().then(response => {
        if (response.code === 1 && response.data) {
          this.deptOption = response.data
        }
      })
    }
  }
}
</script>
