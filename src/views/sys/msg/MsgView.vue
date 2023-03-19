<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchMsgForm" class="demo-form-inline" label-width="80px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="消息名称" prop="msgTitle">
              <el-input v-model="searchMsgForm.msgTitle" clearable placeholder="消息名称"/>
            </el-form-item>
            <el-form-item label="消息编码" prop="msgCode">
              <el-input v-model="searchMsgForm.msgCode" clearable placeholder="消息编码"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="searchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['sys:msg:create']" plain size="mini" type="primary" @click="create">新建</el-button>
        <el-button v-has="['sys:msg:delete']" :disabled="checkDeleteItem" plain size="mini" type="danger"
                   @click="remove">删除
        </el-button>
      </div>
      <el-table
        ref="deptTable"
        :data="msgTableData"
        border
        empty-text="无数据"
        height="500"
        max-height="700"
        size="mini"
        stripe
        style="width: 100%"
        @selection-change="msgHandleSelectionChange">
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
          prop="msgLevel"
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
            <el-button size="mini" type="text" @click="info(scope.row)">查看</el-button>
            <el-button v-has="['sys:msg:modify']" size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button v-has="['sys:msg:delete']" size="mini" type="text"
                       @click.native.prevent="removeItem(scope.$index, msgTableData,scope.row)">删除
            </el-button>
            <el-dropdown size="mini" style="margin-left: 5px;" trigger="click" type="primary">
              <span class="el-dropdown-link">
                信息发布
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="2" @click.native="sendAll(scope.row)">全部</el-dropdown-item>
                <el-dropdown-item command="1" @click.native="toAll(scope.row)">指定人</el-dropdown-item>
                <el-dropdown-item command="1" @click.native="toDeptUser(scope.row)">指定部门</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchMsgForm.current"
          :page-size="searchMsgForm.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>

    <el-dialog :title="title" :visible.sync="msgDialogVisible" width="40vw"
               @close="closeMsgDialog('msgRuleForm')">
      <el-form ref="msgRuleForm" :model="msg" :rules="msgRules" size="mini">
        <el-form-item :label-width="formLabelWidth" label="消息名称" prop="msgTitle">
          <el-input v-model="msg.msgTitle" autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="消息编码" prop="msgCode">
          <el-input v-model="msg.msgCode" autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="消息类型" prop="msgType">
          <el-radio-group v-model="msg.msgType">
            <el-radio-button v-for="item in this.getDict()('MSG_TYPE')" :key="item.value" :label="item.value">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="消息等级" prop="msgLevel">
          <el-radio-group v-model="msg.msgLevel">
            <el-radio-button v-for="item in this.getDict()('MSG_LEVEL')" :key="item.value" :label="item.value">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="内容" prop="content">
          <el-input v-model="msg.content" autocomplete="off" clearable type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetMsgForm('msgRuleForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitMsgForm('msgRuleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="40vw"
               @close="closeInfoDialog">
      <el-descriptions :column="2" border size="mini">
        <el-descriptions-item>
          <template slot="label">
            消息名称
          </template>
          {{ msg.msgTitle }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            消息编码
          </template>
          <el-tag size="small">{{ msg.msgCode }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            消息类型
          </template>
          <el-tag size="small">
            {{ this.getDescriptionsDictLabel()(msg, 'msgType', 'MSG_TYPE') }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            消息级别
          </template>
          <el-tag :type="msg.msgLevel" size="small">
            {{ this.getDescriptionsDictLabel()(msg, 'msgLevel', 'MSG_LEVEL') }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            内容
          </template>
          {{ msg.content }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            创建人
          </template>
          {{ msg.createName }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="sendDeptMsgDialogVisible" width="1200px"
               @close="closeSendMsgDialog">
      <el-form ref="deptRuleForm" :model="sendMsgData" :rules="sendMsgDataRules" size="mini"
               style="padding-right: 15px;">
        <el-form-item :label-width="formLabelWidth" label="选择方式" prop="sendMsgType">
          <el-radio-group v-model="sendMsgData.sendMsgType" size="mini" @change="handleChangeSendData">
            <el-radio-button v-for="item in this.getDict()('SEND_MSG_TYPE')" :key="item.value" :label="item.value">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="dept" :label-width="formLabelWidth" label="部门"
                      prop="multipleDeptId">
          <el-cascader
            v-model="sendMsgData.multipleDeptId"
            :options="deptOption"
            :props="{ multiple: true, checkStrictly: true }"
            :show-all-levels="false"
            collapse-tags
            @change="handleChangeMultipleDept"/>
        </el-form-item>
        <el-form-item v-show="!dept" :label-width="formLabelWidth" label="部门" prop="deptId">
          <el-cascader
            v-model="sendMsgData.deptId"
            :options="deptOption"
            :props="{ checkStrictly: true }"
            :show-all-levels="false"
            @change="handleChangeDept"
          />
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
                           @click.native.prevent="removeUserItem(scope.$index, sendMsgData.userTableData,scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeSendMsgDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="sendMsgToUser">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="sendUserMsgDialogVisible" width="760px"
               @close="closeSendMsgDialog">
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
        <el-button size="mini" @click="closeSendMsgDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="sendMsgToUser">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import { del, list, listUserByDeptId, modify, save, selectUser } from '@/api/sys/msg'
import { confirmAlert, DIALOG_TYPE } from '@/utils/constant'
import JSONBigInt from 'json-bigint'
import { selectDept } from '@/api/sys/dept'
import { mapGetters } from 'vuex'

export default {
  name: 'MsgView',
  data () {
    return {
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
      searchMsgForm: {
        msgTitle: '',
        msgCode: '',
        current: 1,
        size: 10
      },
      // 分页总数
      total: 0,
      // 标记删除按钮是否可以点击
      checkDeleteItem: true,
      // 消息添加修改弹出框
      msgDialogVisible: false,
      // 发送消息到用户弹出框
      sendUserMsgDialogVisible: false,
      // 发送消息到部门弹出框
      sendDeptMsgDialogVisible: false,
      // 消息详情弹出框
      infoDialogVisible: false,
      // 切换部门组件
      dept: false,
      // 表单标题宽度
      formLabelWidth: '80px',
      msg: {
        id: null,
        msgTitle: '',
        msgCode: '',
        msgType: '0',
        msgLevel: 'info',
        content: ''
      },
      // 消息详情数据
      msgInfo: {
        id: null,
        msgTitle: '',
        msgCode: '',
        msgType: '0',
        msgLevel: 'info',
        content: ''
      },
      // 消息添加修改表单规则
      msgRules: {
        msgTitle: [
          {
            required: true,
            message: '请输入消息名称',
            trigger: 'blur'
          }
        ],
        msgCode: [
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
        multipleDeptId: [],
        deptId: []
      },
      // 发送消息数据
      sendMsgData: {
        multipleDeptId: [],
        deptId: [],
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
  mounted () {
    this.$toLoadDict(['MSG_LEVEL', 'MSG_TYPE', 'SEND_MSG_TYPE']).then((dict) => {
      this.reloadList()
    })
    this.selectDept()
  },
  methods: {
    ...mapGetters('dict', ['getDict', 'getDescriptionsDictLabel', 'getTableDictLabel']),
    /**
     * 初始化加载表格数据
     */
    reloadList () {
      list(this.buildParam()).then((rep) => {
        this.msgTableData = rep.data.records
        this.searchMsgForm.size = rep.data.size
        this.searchMsgForm.current = rep.data.current
        this.total = rep.data.total
      })
    },
    /**
     * 初始化加载表格数据
     */
    reloadUserData () {
      selectUser().then((rep) => {
        rep.data.forEach((user, index) => {
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
     * @returns {{current: number, size: number, msgTitle: string, msgCode: string}}
     */
    buildParam () {
      return this.searchMsgForm
    },
    /**
     * 分页大小切换
     *
     * @param size
     */
    handleSizeChange (size) {
      this.searchMsgForm.size = size
      this.reloadList()
    },
    /**
     * 分页大小切换
     *
     * @param size
     */
    handleCurrentChange (current) {
      this.searchMsgForm.current = current
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
     * 消息表格复选框事件
     *
     * @param row
     */
    msgHandleSelectionChange (val) {
      this.checkDeleteItem = !val.length
      this.multipleSelectionMsgIds = val
    },
    /**
     * 批量删除
     */
    remove () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelectionMsgIds.map((x) => ids.push(JSONBigInt.parse(x.id)))
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
     * 创建
     */
    create () {
      this.title = '创建消息'
      this.dialogType = DIALOG_TYPE.ADD
      this.msgDialogVisible = true
    },
    /**
     * 修改
     * @param row
     */
    edit (row) {
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
    info (row) {
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
    closeMsgDialog (formName) {
      this.msg.id = undefined
      this.$refs[formName].resetFields()
    },
    /**
     * 关闭详情弹出框事件
     */
    closeInfoDialog () {
      this.msg = this.msgInfo
    },
    /**
     * 提交
     * @param formName
     */
    submitMsgForm (formName) {
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
      this.msg.id = undefined
      save(this.msg).then((rep) => {
        if (rep.code === 1) {
          this.$message.success('添加成功')
          this.msgDialogVisible = false
          this.reloadList()
        }
      })
    },
    /**
     * 修改请求
     */
    modify () {
      modify(this.msg).then((rep) => {
        if (rep.code === 1) {
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
    resetMsgForm (formName) {
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
    removeUserItem (index, rows, row) {
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
    sendAll (row) {
      this.$sendMsg('/msg/sendBroadcastMsg', { msgId: row.id })
    },
    /**
     * 发送给用户请求
     */
    sendMsgToUser () {
      if (this.sendMsgData.users.length === 0) {
        this.$message.warning('还未选择发送信息的用户')
        return
      }
      this.$sendMsg('/msg/sendMsgToUser',
        {
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
    toAll (row) {
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
    toDeptUser (row) {
      this.sendDeptMsgDialogVisible = true
      this.selectDept()
      this.title = '接收部门'
      this.sendMsgData.msgId = row.id
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
    },
    handleChangeSendData (val) {
      this.sendMsgData.userTableData = []
      if (val === '2') {
        this.dept = true
        this.$nextTick(() => {
          this.sendMsgData.multipleDeptId = []
        })
      } else {
        this.dept = false
        this.$nextTick(() => {
          this.sendMsgData.deptId = []
        })
      }
    },
    handleChangeMultipleDept () {
      this.sendMsgData.users = []
      this.sendMsgData.userTableData = []
      if (!this.sendMsgData.multipleDeptId) {
        return
      }
      if (this.sendMsgData.multipleDeptId.length === 0) {
        this.sendMsgData.userTableData = []
        return
      }
      // 去查询部门下的用户
      const deptIds = []
      this.sendMsgData.multipleDeptId.forEach(data => {
        data.forEach(a => {
          deptIds.push(JSONBigInt.parse(a))
        })
      })
      listUserByDeptId(deptIds).then((rep) => {
        if (rep.code === 1) {
          this.sendMsgData.userTableData = rep.data
          const userIds = []
          this.sendMsgData.userTableData.forEach(row => {
            userIds.push(JSONBigInt.parse(row.id))
          })
          this.sendMsgData.users = userIds
        }
      })
    },
    /**
     * 部门下拉框事件
     */
    handleChangeDept () {
      this.sendMsgData.userTableData = []
      this.sendMsgData.users = []
      if (!this.sendMsgData.deptId) {
        return
      }
      if (this.sendMsgData.deptId.length === 0) {
        this.sendMsgData.userTableData = []
        return
      }
      // 去查询部门下的用户
      const deptIds = []
      this.sendMsgData.deptId.forEach(data => {
        deptIds.push(JSONBigInt.parse(data))
      })
      listUserByDeptId(deptIds).then((rep) => {
        if (rep.code === 1) {
          this.sendMsgData.userTableData = rep.data
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
     *
     * @param formName
     */
    closeSendMsgDialog () {
      this.sendMsgData = {
        multipleDeptId: [],
        deptId: [],
        msgId: '',
        sendMsgType: '1',
        userTableData: [],
        transferUserData: [],
        users: []
      }
      this.sendUserMsgDialogVisible = false
      this.sendDeptMsgDialogVisible = false
    }
  }
}
</script>

<style lang="scss">
.el-dropdown {
  font-size: 0.5rem;

  i {
    font-size: 0.5rem;
  }
}

.el-dropdown-menu__item {
  font-size: 0.5rem;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
</style>
