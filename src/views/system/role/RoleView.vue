<template>
  <el-container>
    <el-main>
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="角色名称">
              <el-input v-model="searchForm.roleName" clearable placeholder="角色名称"/>
            </el-form-item>
            <el-form-item label="角色编码">
              <el-input v-model="searchForm.roleCode" clearable placeholder="角色编码"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="reset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row :gutter="24">
        <el-col :md="19">
          <div style="margin-bottom: 10px; text-align: left;">
            <el-button plain size="mini" type="primary" @click="add">新建</el-button>
            <el-button plain size="mini" type="warning " @click="edit">修改</el-button>
            <el-button plain size="mini" type="danger" @click="del">删除</el-button>
            <el-button plain size="mini" type="info" @click="exportInfo">导出</el-button>
            <el-button plain size="mini" @click="importInfo">导入</el-button>
          </div>
          <el-table
            ref="multipleTable"
            :data="tableData"
            border
            height="600"
            size="mini"
            stripe
            row-key="id"
            style="width: 100%"
            @row-click="rowClick"
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
                <el-button size="mini" type="text" @click="show(scope.row)">查看</el-button>
                <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
                <el-button size="mini" type="text" @click.native.prevent="delItem(scope.$index, tableData,scope.row)">删除
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
        </el-col>
        <el-col :md="5">
          <el-tree ref="roleTree"
                   :data="roleTreeData"
                   :props="defaultProps"
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
    <add-edit-dialog
      ref="addEditDialog"
      :title="title"
      @reloadList="reloadList"/>
  </el-container>
</template>

<script>
import AddEditDialog from '@/components/dialog/role/AddEditDialog'
import { del, editPermission, list, listRolesPermission } from '@/api/system/role'
import { listTreePermission } from '@/api/system/menu'
import { confirmAlert, DIALOG_TYPE } from '@/utils/constant'
import { Message } from 'element-ui'
import JSONBigInt from 'json-bigint'

export default {
  name: 'RoleView',
  components: { AddEditDialog },
  data: () => ({
    title: '',
    disabled: true,
    multipleSelection: [],
    tableData: [],
    searchForm: {
      roleName: '',
      roleCode: '',
      current: 1,
      size: 10
    },
    total: 0,
    roleTreeData: [],
    defaultProps: {
      children: 'children',
      label: 'title'
    },
    roleId: undefined
  }),
  created () {
    this.reloadList()
    this.reloadListTreeMenu()
  },
  methods: {
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
          this.listSelectedTreeData(this.roleId)
        }
      })
    },
    resetPermission () {
      this.listSelectedTreeData(this.roleId)
    },
    reloadListTreeMenu () {
      listTreePermission().then((rep) => {
        if (rep.code === 1) {
          this.roleTreeData = rep.data
        }
      })
    },
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
    listSelectedTreeData (roleId) {
      listRolesPermission(roleId).then((rep) => {
        if (rep.code === 1) {
          this.$nextTick(() => {
            rep.data.forEach(data => {
              this.$refs.roleTree.setChecked(data.menuId, true, false)
            })
          })
          this.disabled = false
        }
      })
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
      this.reloadListTreeMenu()
    },
    rowClick (row, column, event) {
      this.roleId = row.id
      this.listSelectedTreeData(row.id)
    },
    buildParam () {
      return this.searchForm
    },
    reset () {
      this.searchForm.roleName = ''
      this.searchForm.roleCode = ''
    },
    /**
     * 批量删除
     */
    del () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelection.map((x) => ids.push(JSONBigInt.parse(x.id)))
        del(ids).then((rep) => {
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
     * @param rows
     */
    delItem (index, rows, row) {
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
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    add () {
      this.title = '创建角色'
      this.$refs.addEditDialog.showDialogVisible({}, DIALOG_TYPE.ADD)
    },
    edit (val) {
      this.title = '修改角色信息'
      this.$refs.addEditDialog.showDialogVisible(val, DIALOG_TYPE.EDIT)
    },
    show (val) {
      this.title = '查看角色信息'
      this.$refs.addEditDialog.showDialogVisible(val, DIALOG_TYPE.SHOW)
    }
  }
}
</script>
