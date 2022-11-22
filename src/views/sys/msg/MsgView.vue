<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchMsgForm" class="demo-form-inline" size="mini">
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
        <el-button v-has="['sys:msg:save']" plain size="mini" type="primary" @click="create">新建</el-button>
        <el-button v-has="['sys:msg:delete']" plain size="mini" type="danger" @click="remove">删除</el-button>
        <el-button plain size="mini" type="info" @click="exportInfo">导出</el-button>
        <el-button plain size="mini" @click="importInfo">导入</el-button>
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
            <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text"
                       @click.native.prevent="removeItem(scope.$index, msgTableData,scope.row)">删除
            </el-button>
            <el-dropdown size="mini" style="margin-left: 5px;" trigger="click" type="primary">
              <span class="el-dropdown-link">
                信息发布
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="2" @click.native="sendAll(scope.row)">全部</el-dropdown-item>
                <el-dropdown-item command="1" @click.native="sendToUser(scope.row)">指定人</el-dropdown-item>
                <el-dropdown-item command="1" @click.native="sendToDept(scope.row)">指定部门</el-dropdown-item>
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

    <el-dialog :title="title" :visible.sync="msgDialogVisible" width="800px"
               @close="closeMsgDialog('msgRuleForm')">
      <el-form ref="msgRuleForm" :model="msg" :rules="msgRules" size="mini">
        <el-form-item :label-width="formLabelWidth" label="消息名称" prop="msgTitle">
          <el-input v-model="msg.msgTitle" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="消息编码" prop="msgCode">
          <el-input v-model="msg.msgCode" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="内容" prop="content">
          <el-input v-model="msg.content" autocomplete="off" clearable type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetMsgForm('msgRuleForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitMsgForm('msgRuleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="800px"
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
            内容
          </template>
          {{ msg.content }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="sendDeptMsgDialogVisible" width="700px"
               @close="closeSendMsgDialog">
      <el-main>
        <el-table
          ref="deptTable"
          :data="deptTableData"
          :tree-props="{children: 'children', hasChildren: 'children.length>0'}"
          border
          highlight-current-row
          row-key="id"
          size="mini"
          stripe
          style="width: 100%"
          @selection-change="deptHandleSelectionChange">
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
            label="部门名称"
            prop="deptName">
          </el-table-column>
          <el-table-column
            label="部门编码"
            prop="deptCode">
          </el-table-column>
        </el-table>
      </el-main>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="sendUserMsgDialogVisible" width="700px"
               @close="closeSendMsgDialog">
    </el-dialog>

  </el-container>
</template>

<script>
import { del, list, modify, save } from '@/api/sys/msg'
import { listDept } from '@/api/sys/dept'
import { confirmAlert, DIALOG_TYPE } from '@/utils/constant'
import JSONBigInt from 'json-bigint'
import { Message } from 'element-ui'

const generateData = _ => {
  const data = []
  const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都']
  const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu']
  cities.forEach((city, index) => {
    data.push({
      label: city,
      key: index,
      pinyin: pinyin[index]
    })
  })
  return data
}
export default {
  name: 'MsgView',
  data () {
    return {
      multipleSelectionMsgIds: [],
      multipleSelectionDeptIds: [],
      msgTableData: [],
      deptTableData: [],
      searchMsgForm: {
        msgTitle: '',
        msgCode: '',
        current: 1,
        size: 10
      },
      total: 0,
      title: '',
      msgDialogVisible: false,
      sendUserMsgDialogVisible: false,
      sendDeptMsgDialogVisible: true,
      infoDialogVisible: false,
      // 默认是创建
      dialogType: DIALOG_TYPE.ADD,
      formLabelWidth: '80px',
      msg: {
        id: null,
        msgTitle: '',
        msgCode: '',
        content: ''
      },
      msgInfo: {
        id: null,
        msgTitle: '',
        msgCode: '',
        content: ''
      },
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
      transferUserData: generateData(),
      value: [],
      filterMethod (query, item) {
        return item.pinyin.indexOf(query) > -1
      }
    }
  },
  mounted () {
    this.reloadList()
    this.reloadDeptList()
  },
  methods: {
    reloadDeptList () {
      listDept({}).then((rep) => {
        if (rep.code === 1) {
          this.deptTableData = rep.data
        }
      })
    },
    reloadList () {
      list(this.buildParam()).then((rep) => {
        if (rep.code === 1) {
          this.msgTableData = rep.data.records
          this.searchMsgForm.size = rep.data.size
          this.searchMsgForm.current = rep.data.current
          this.total = rep.data.total
        }
      })
    },
    buildParam () {
      return this.searchMsgForm
    },
    handleSizeChange (size) {
      this.searchMsgForm.size = size
      this.reloadList()
    },
    handleCurrentChange (current) {
      this.searchMsgForm.current = current
      this.reloadList()
    },
    search () {
      this.reloadList()
    },
    searchReset () {
      this.$refs.searchForm.resetFields()
    },
    deptHandleSelectionChange (row) {
      this.multipleSelectionDeptIds = row
    },
    msgHandleSelectionChange (row) {
      this.multipleSelectionMsgIds = row
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
    sendToUser (row) {
      this.sendUserMsgDialogVisible = true
      this.title = '接收人'
    },
    sendAll (row) {
    },
    sendToDept (row) {
      this.sendDeptMsgDialogVisible = true
      this.title = '接收部门'
      this.reloadDeptList()
    },
    create () {
      this.title = '创建消息'
      this.dialogType = DIALOG_TYPE.ADD
      this.msgDialogVisible = true
    },
    edit (row) {
      this.title = '修改消息'
      this.dialogType = DIALOG_TYPE.EDIT
      this.msgDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.msg, row)
      })
    },
    info (row) {
      this.title = '查看信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.infoDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.msg, row)
      })
    },
    closeMsgDialog (formName) {
      this.msg.id = undefined
      this.$refs[formName].resetFields()
    },
    closeInfoDialog () {
      this.msg = this.msgInfo
    },
    closeSendMsgDialog () {
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
    resetMsgForm (formName) {
      this.msgDialogVisible = false
      this.$refs[formName].resetFields()
    },
    save () {
      this.msg.id = undefined
      save(this.msg).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: '添加成功' })
          this.msgDialogVisible = false
          this.reloadList()
        }
      })
    },
    modify () {
      modify(this.msg).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: '修改成功' })
          this.msgDialogVisible = false
          this.reloadList()
        }
      })
    }
  }
}
</script>

<style lang="less">
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
