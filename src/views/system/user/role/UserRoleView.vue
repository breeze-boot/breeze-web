<template>
  <el-container>
    <el-main>
      <el-row :gutter="24" style="height: 5.5vh;">
        <el-col :md="22">
          <el-page-header content="详情页面" @back="goBack">
          </el-page-header>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :md="24">
          <el-form :inline="true" :model="roleSearchForm" class="demo-form-inline" size="mini">
            <el-row :gutter="24">
              <el-col :md="24">
                <el-form-item label="角色名称">
                  <el-input v-model="roleSearchForm.roleName" clearable placeholder="角色名称"/>
                </el-form-item>
                <el-form-item label="角色编码">
                  <el-input v-model="roleSearchForm.roleCode" clearable placeholder="角色编码"/>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="search()">查询</el-button>
                  <el-button type="info" @click="reset()">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-row :gutter="24">
            <el-col :md="24">
              <el-table
                ref="multipleTable"
                :data="roleTableData"
                border
                height="500"
                row-key="id"
                size="mini"
                stripe
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
  </el-container>
</template>

<script>
import { list } from '@/api/system/role'
import { userAddRole } from '@/api/system/user'

export default {
  name: 'RoleView',
  data () {
    return {
      disabled: true,
      multipleSelectionUserRoleId: [],
      roleTableData: [],
      roleSearchForm: {
        roleName: '',
        roleCode: '',
        current: 1,
        size: 10
      },
      total: 0
    }
  },
  mounted () {
    this.reloadList()
  },
  methods: {
    reloadList () {
      list(this.buildParam()).then((rep) => {
        if (rep.code === 1) {
          this.roleTableData = rep.data.records
          this.roleSearchForm.size = rep.data.size
          this.roleSearchForm.current = rep.data.current
          this.total = rep.data.total
          const rows = this.$route.params.roleIds
          if (rows.length <= 0) {
            return
          }
          this.$nextTick(() => {
            rows.forEach(roleId => {
              rep.data.records.forEach(x => {
                if (x.id === roleId) {
                  this.$refs.multipleTable.toggleRowSelection(x, true)
                }
              })
            })
          })
        }
      })
    },
    handleSizeChange (size) {
      this.roleSearchForm.size = size
      this.reloadList()
    },
    handleCurrentChange (current) {
      this.roleSearchForm.current = current
      this.reloadList()
    },
    search () {
      this.reloadList()
    },
    rowClick (row, column, event) {
      this.roleId = row.id
    },
    buildParam () {
      return this.roleSearchForm
    },
    reset () {
      this.roleSearchForm.roleName = ''
      this.roleSearchForm.roleCode = ''
    },
    handleSelectionChange (val) {
      this.multipleSelectionUserRoleId = val
    },
    goBack () {
      this.$router.back()
    },
    submitUserRoleForm () {
      if (this.multipleSelectionUserRoleId.length === 0) {
        this.$message.warning('选择用户的角色')
        return
      }
      if (!this.$route.params.id) {
        this.$message.warning('选择分配角色的用户')
        return
      }
      const temp = {
        username: this.$route.params.username,
        roleId: this.multipleSelectionUserRoleId.map(role => role.id)
      }
      console.log(JSON.stringify(temp))
      userAddRole(temp).then(rep => {
        if (rep.code === 1) {
          this.$message.success('分配成功')
        }
      })
    },
    resetUserRoleForm () {

    }
  }
}
</script>
