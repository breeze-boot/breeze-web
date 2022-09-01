<template>
  <el-container>
    <el-main>
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="角色名称">
              <el-input v-model="searchForm.roleName" clearable placeholder="角色名称"/>
            </el-form-item>
            <el-form-item label="角色标识">
              <el-input v-model="searchForm.roleCode" clearable placeholder="角色标识"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="reset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
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
            row-key="id"
            size="mini"
            stripe
            style="width: 100%"
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
              label="角色标识"
              prop="roleCode">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="show(scope.row)">查看</el-button>
                <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
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
          <el-tree :data="roleTreeData"
                   :default-checked-keys="[5]"
                   :default-expanded-keys="[2, 3]"
                   :props="defaultProps"
                   node-key="id"
                   show-checkbox
                   style="height: 600px; overflow-y:scroll;border: #e1e1e1 1px solid;margin:37px;">
          </el-tree>
        </el-col>
      </el-row>
    </el-main>
    <create-or-edit-dialog
      ref="createOrEditDialog"
      @reloadList="reloadList"
      :title="title"/>
  </el-container>
</template>

<script>
import createOrEditDialog from '@/components/role/CreateOrEditDialog'
import { del, list } from '@/api/role'
import { DIALOG_TYPE } from '@/utils/constant'

export default {
  name: 'RoleView',
  components: { createOrEditDialog },
  data: () => ({
    title: '',
    multipleSelection: [],
    tableData: [],
    searchForm: {
      roleName: '',
      roleCode: '',
      current: 1,
      size: 10
    },
    total: 0,

    roleTreeData: [{
      id: 1,
      label: '一级 1',
      children: [{
        id: 4,
        label: '二级 1-1',
        children: [{
          id: 9,
          label: '三级 1-1-1'
        }, {
          id: 10,
          label: '三级 1-1-2'
        }]
      }]
    }, {
      id: 2,
      label: '一级 2',
      children: [{
        id: 5,
        label: '二级 2-1'
      }, {
        id: 6,
        label: '二级 2-2'
      }]
    }, {
      id: 3,
      label: '一级 3',
      children: [{
        id: 7,
        label: '二级 3-1'
      }, {
        id: 8,
        label: '二级 3-2'
      }]
    }, {
      id: 4,
      label: '一级 3',
      children: [{
        id: 7,
        label: '二级 3-1'
      }, {
        id: 8,
        label: '二级 3-2'
      }]
    }, {
      id: 5,
      label: '一级 3',
      children: [{
        id: 7,
        label: '二级 3-1'
      }, {
        id: 8,
        label: '二级 3-2'
      }]
    }, {
      id: 6,
      label: '一级 3',
      children: [{
        id: 7,
        label: '二级 3-1'
      }, {
        id: 8,
        label: '二级 3-2'
      }]
    }, {
      id: 7,
      label: '一级 3',
      children: [{
        id: 7,
        label: '二级 3-1'
      }, {
        id: 8,
        label: '二级 3-2'
      }]
    }, {
      id: 8,
      label: '一级 3',
      children: [{
        id: 7,
        label: '二级 3-1'
      }, {
        id: 8,
        label: '二级 3-2'
      }]
    }, {
      id: 9,
      label: '一级 3',
      children: [{
        id: 7,
        label: '二级 3-1'
      }, {
        id: 8,
        label: '二级 3-2'
      }]
    }, {
      id: 10,
      label: '一级 3',
      children: [{
        id: 7,
        label: '二级 3-1'
      }, {
        id: 8,
        label: '二级 3-2'
      }]
    }, {
      id: 11,
      label: '一级 3',
      children: [{
        id: 7,
        label: '二级 3-1'
      }, {
        id: 8,
        label: '二级 3-2'
      }]
    }, {
      id: 12,
      label: '一级 3',
      children: [{
        id: 7,
        label: '二级 3-1'
      }, {
        id: 8,
        label: '二级 3-2'
      }]
    }],
    defaultProps: {
      children: 'children',
      label: 'label'
    }
  }),
  created () {
    this.reloadList()
  },
  methods: {
    reloadList () {
      list(this.buildParam()).then((rep) => {
        if (rep) {
          this.tableData = rep.data.records
          this.searchForm.size = rep.data.size
          this.searchForm.current = rep.data.current
          this.total = rep.data.total
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
    },
    buildParam () {
      this.tableData = []
      return this.searchForm
    },
    reset () {
      this.searchForm.roleName = ''
      this.searchForm.roleCode = ''
    },
    del () {
      const ids = []
      this.multipleSelection.forEach((x) => {
        ids.push(x.id)
      })
      del(ids)
      this.reloadList()
    },
    exportInfo () {
    },
    importInfo () {
    },
    add () {
      this.title = '创建角色'
      this.$refs.createOrEditDialog.showDialogFormVisible({}, DIALOG_TYPE.ADD)
    },
    edit (val) {
      this.title = '修改角色信息'
      this.$refs.createOrEditDialog.showDialogFormVisible(val, DIALOG_TYPE.EDIT)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    show (val) {
      this.title = '查看角色信息'
      this.$refs.createOrEditDialog.showDialogFormVisible(val, DIALOG_TYPE.SHOW)
    }
  }
}
</script>
