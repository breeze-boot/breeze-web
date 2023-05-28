<template>
  <base-container>
    <el-main>
      <el-row :gutter="24" style="height: 5.5vh;">
        <el-col :md="22">
          <el-page-header content="用户角色分配" @back="goBack">
          </el-page-header>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :md="24">
          <el-form :inline="true" :model="roleSearchForm" class="demo-form-inline" size="mini">
            <el-row :gutter="24">
              <el-col :md="24">
                <el-form-item label="用户名称">
                  <el-input v-model="roleSearchForm.username" clearable disabled placeholder="用户名称"/>
                </el-form-item>
                <el-form-item label="用户角色名称">
                  <el-input v-model="roleSearchForm.roleName" clearable placeholder="用户角色名称"/>
                </el-form-item>
                <el-form-item label="用户角色编码">
                  <el-input v-model="roleSearchForm.roleCode" clearable placeholder="用户角色编码"/>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="search()">查询</el-button>
                  <el-button type="info" @click="searchReset()">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-row :gutter="24">
            <el-col :md="24">
              <el-table
                ref="userRoleTable"
                :header-cell-style="{ textAlign: 'center' }"
                :cell-style="{ textAlign: 'center' }"
                :data="roleTableData"
                border
                row-key="id"
                size="mini"
                stripe
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
                  label="用户角色名称"
                  prop="roleName">
                </el-table-column>
                <el-table-column
                  label="用户角色编码"
                  prop="roleCode">
                </el-table-column>
              </el-table>

              <div style="text-align: right;margin-top: 2vh;">
                <el-pagination
                  :current-page="roleSearchForm.current"
                  :page-size="roleSearchForm.size"
                  :page-sizes="[10, 20, 50, 100]"
                  :total="total"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange">
                </el-pagination>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="24" style="height: 5.5vh;">
        <el-col :md="12" :offset="11">
          <el-button size="mini" @click="resetUserRoleForm()">取 消</el-button>
          <el-button size="mini" type="primary" @click="submitUserRoleForm()">确 定</el-button>
        </el-col>
      </el-row>
    </el-main>
  </base-container>
</template>

<script>
import { list, listUserRoles } from '@/api/system/role'
import { userAddRole } from '@/api/system/user'

export default {
  name: 'Role',
  data () {
    return {
      // 单元格选中数据
      multipleSelectionUserRoleId: [],
      // 用户角色表格数据
      roleTableData: [],
      // 当前选择的用户角色数据
      currentRoleId: [],
      // 用户角色查询条件数据
      roleSearchForm: {
        userId: this.$route.query.userId,
        username: this.$route.query.username,
        roleName: '',
        roleCode: '',
        current: 1,
        size: 10
      },
      // 分页总数
      total: 0
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
      list(this.buildParam()).then((response) => {
        if (response.code === 1) {
          this.roleTableData = response.data.records
          this.roleSearchForm.size = response.data.size
          this.roleSearchForm.current = response.data.current
          this.total = response.data.total
        }
      }).then(() => {
        listUserRoles(this.roleSearchForm.userId).then((response) => {
          if (response.code === 1) {
            response.data.forEach(roleId => {
              this.roleTableData.forEach(tableDataRow => {
                if (tableDataRow.id === roleId) {
                  this.$refs.userRoleTable.toggleRowSelection(tableDataRow, true)
                }
              })
            })
          }
        })
      })
    },
    /**
     * 分页大小切换
     *
     * @param size
     */
    handleSizeChange (size) {
      this.roleSearchForm.size = size
      this.reloadList()
    },
    /**
     * 当前页切换
     *
     * @param current
     */
    handleCurrentChange (current) {
      this.roleSearchForm.current = current
      this.reloadList()
    },
    /**
     * 查询按钮
     */
    search () {
      this.reloadList()
    },
    /**
     * 构造查询条件
     *
     * @returns {{current: number, size: number, roleCode: string, roleName: string, userId: *, username: *}}
     */
    buildParam () {
      return this.roleSearchForm
    },
    /**
     * 查询重置按钮
     */
    searchReset () {
      this.roleSearchForm.roleName = ''
      this.roleSearchForm.roleCode = ''
    },
    /**
     * 平台表格复选框事件
     *
     * @param val
     */
    handleSelectionChange (val) {
      this.multipleSelectionUserRoleId = val
    },
    /**
     * 添加修改弹出框提交
     */
    submitUserRoleForm () {
      if (this.multipleSelectionUserRoleId.length === 0) {
        this.$message.warning('选择用户的用户角色')
        return
      }
      if (!this.$route.query.userId) {
        this.$message.warning('选择分配用户角色的用户')
        return
      }
      const requestParam = {
        username: this.$route.query.username,
        roleId: this.multipleSelectionUserRoleId.map(role => role.id)
      }
      userAddRole(requestParam).then(response => {
        if (response.code === 1) {
          this.$message.success('分配成功')
        }
      })
    },
    /**
     * 添加修改弹出框重置
     */
    resetUserRoleForm () {
      this.reloadList()
    },
    /**
     * 返回
     */
    goBack () {
      this.$router.back()
    },
    /**
     * @param row
     * @param column
     * @param event
     */
    rowClick (row, column, event) {
      this.currentRoleId = row.id
    }
  }
}
</script>
