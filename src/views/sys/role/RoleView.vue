<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchRoleForm" class="demo-form-inline" size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="searchRoleForm.roleName" clearable placeholder="角色名称"/>
            </el-form-item>
            <el-form-item label="角色编码" prop="roleCode">
              <el-input v-model="searchRoleForm.roleCode" clearable placeholder="角色编码"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="searchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row :gutter="24">
        <el-col :md="19">
          <div style="margin-bottom: 10px; text-align: left;">
            <el-button plain size="mini" type="primary" @click="create">新建</el-button>
            <el-button plain size="mini" type="danger" @click="remove">删除</el-button>
            <el-button plain size="mini" type="info" @click="exportInfo">导出</el-button>
            <el-button plain size="mini" @click="importInfo">导入</el-button>
          </div>
          <el-table
            ref="multipleTable"
            :data="roleTableData"
            border
            height="600"
            row-key="id"
            size="mini"
            stripe
            style="width: 100%"
            @row-click="rowClick"
            @selection-change="roleHandleSelectionChange">
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
              label="角色名称"
              prop="roleName">
            </el-table-column>
            <el-table-column
              label="角色编码"
              prop="roleCode">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="150">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="info(scope.row)">查看</el-button>
                <el-button size="mini" type="text" @click="modify(scope.row)">编辑</el-button>
                <el-button size="mini" type="text"
                           @click.native.prevent="removeItem(scope.$index, roleTableData,scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div style="text-align: right;margin-top: 2vh;">
            <el-pagination
              :current-page="searchRoleForm.current"
              :page-size="searchRoleForm.size"
              :page-sizes="[10, 20, 50, 100]"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange">
            </el-pagination>
          </div>
        </el-col>
        <el-col :md="5">
          <el-tree ref="roleTree"
                   :check-strictly="true"
                   :data="roleTreeData"
                   :props="roleTreeProps"
                   node-key="id"
                   show-checkbox
                   style="height: 560px; overflow-y:scroll; border: #e1e1e1 1px solid; margin-top:37px;">
          </el-tree>
          <div style="margin-top: 10px; text-align: center; padding: 0px 30px;">
            <el-button plain size="mini" type="primary" @click="submitPermission">提交</el-button>
            <el-button :disabled="disabled" plain size="mini" type="info" @click="resetPermission">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-main>

    <el-dialog :title="title" :visible.sync="roleDialogVisible" width="800px"
               @close="closeDialog('roleRuleForm')">
      <el-form ref="roleRuleForm" :model="role" :rules="roleRules" size="mini">
        <el-form-item :label-width="formLabelWidth" label="角色名称" prop="roleName">
          <el-input v-model="role.roleName" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="角色编码" prop="roleCode">
          <el-input v-model="role.roleCode" autocomplete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetRoleForm('roleRuleForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitRoleForm('roleRuleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="800px"
               @close="closeInfoDialog">
      <el-descriptions :column="1" border size="mini">
        <el-descriptions-item>
          <template slot="label">
            角色编码
          </template>
          {{ role.roleCode }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            角色名称
          </template>
          <el-tag size="small">{{ role.roleName }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </el-container>
</template>

<script>
import { add, del, edit, editPermission, list, listRolesPermission } from '@/api/sys/role'
import { listTreePermission } from '@/api/sys/menu'
import { confirmAlert, DIALOG_TYPE } from '@/utils/constant'
import { Message } from 'element-ui'
import JSONBigInt from 'json-bigint'

export default {
  name: 'RoleView',
  data () {
    return {
      title: '',
      disabled: true,
      multipleSelectionRoleIds: [],
      roleTableData: [],
      searchRoleForm: {
        roleName: '',
        roleCode: '',
        current: 1,
        size: 10
      },
      total: 0,
      roleTreeData: [],
      roleTreeProps: {
        children: 'children',
        label: 'title'
      },
      roleId: undefined,
      roleDialogVisible: false,
      infoDialogVisible: false,
      role: {
        id: undefined,
        roleName: '',
        roleCode: ''
      },
      roleInfo: {
        id: undefined,
        roleName: '',
        roleCode: ''
      },
      // 默认是创建
      dialogType: DIALOG_TYPE.ADD,
      formLabelWidth: '80px',
      roleRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }
        ],
        roleCode: [
          {
            required: true,
            message: '请输入角色编码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.reloadList()
    this.reloadListTreeMenu()
  },
  methods: {
    reloadList () {
      list(this.buildParam()).then((rep) => {
        if (rep.code === 1) {
          this.roleTableData = rep.data.records
          this.searchRoleForm.size = rep.data.size
          this.searchRoleForm.current = rep.data.current
          this.total = rep.data.total
        }
      })
    },
    listRolesPermission (roleId) {
      listRolesPermission(roleId).then((rep) => {
        if (rep.code === 1) {
          this.$nextTick(() => {
            this.$refs.roleTree.setCheckedKeys([])
            rep.data.forEach(data => {
              this.$refs.roleTree.setChecked(data.menuId, true, false)
            })
          })
          this.disabled = false
        }
      })
    },
    submitPermission () {
      const checkedKeys = this.$refs.roleTree.getCheckedKeys()
      const halfCheckedKeys = this.$refs.roleTree.getHalfCheckedKeys()
      if (halfCheckedKeys.length > 0) {
        checkedKeys.push(...halfCheckedKeys)
      }
      if (checkedKeys.length <= 0) {
        this.$message.warning('请选择角色权限')
        return
      }
      if (this.roleId === undefined) {
        this.$message.warning('请先点击角色')
        return
      }
      editPermission({
        roleId: this.roleId,
        permissionIds: checkedKeys
      }).then(rep => {
        if (rep.code === 1) {
          Message.success({ message: rep.message })
          this.listRolesPermission(this.roleId)
        }
      })
    },
    resetPermission () {
      this.listRolesPermission(this.roleId)
    },
    reloadListTreeMenu () {
      listTreePermission().then((rep) => {
        if (rep.code === 1) {
          this.roleTreeData = rep.data
        }
      })
    },
    handleSizeChange (size) {
      this.searchRoleForm.size = size
      this.reloadList()
    },
    handleCurrentChange (current) {
      this.searchRoleForm.current = current
      this.reloadList()
    },
    search () {
      this.reloadList()
      this.reloadListTreeMenu()
    },
    rowClick (row, column, event) {
      this.roleId = row.id
      this.listRolesPermission(row.id)
    },
    buildParam () {
      return this.searchRoleForm
    },
    searchReset () {
      this.$refs.searchForm.resetFields()
    },
    roleHandleSelectionChange (val) {
      this.multipleSelectionRoleIds = val
    },
    /**
     * 批量删除
     */
    remove () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelectionRoleIds.map((x) => ids.push(JSONBigInt.parse(x.id)))
        del(ids).then((rep) => {
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
     * @param rows
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
      this.title = '创建角色'
      this.dialogType = DIALOG_TYPE.ADD
      this.roleDialogVisible = true
    },
    modify (row) {
      this.title = '修改角色信息'
      this.dialogType = DIALOG_TYPE.EDIT
      this.roleDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.role, row)
      })
    },
    info (row) {
      this.title = '查看角色信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.infoDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.role, row)
      })
    },
    closeDialog (formName) {
      this.role.id = undefined
      this.$refs[formName].resetFields()
    },
    closeInfoDialog () {
      this.role = this.roleInfo
    },
    submitRoleForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogType === DIALOG_TYPE.ADD ? this.add() : this.edit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetRoleForm (formName) {
      this.roleDialogVisible = false
      this.$refs[formName].resetFields()
    },
    add () {
      add(this.role).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: rep.message })
          this.roleDialogVisible = false
          this.reloadList()
          this.resetPermission()
        }
      })
    },
    edit () {
      edit(this.role).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: rep.message })
          this.roleDialogVisible = false
          this.reloadList()
          this.resetPermission()
        }
      })
    }
  }
}
</script>
