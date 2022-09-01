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
              <el-button type="info" @click="resetForm()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-col :md="19">
          <div style="margin-bottom: 10px; text-align: left;">
            <el-button plain size="mini" type="primary" @click="create">新建</el-button>
            <el-button plain size="mini" type="warning " @click="edit">修改</el-button>
            <el-button plain size="mini" type="danger" @click="deleteInfo">删除</el-button>
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
              label="日期"
              prop="date"
              width="180">
            </el-table-column>
            <el-table-column
              label="姓名"
              prop="name"
              width="180">
            </el-table-column>
            <el-table-column
              label="地址"
              prop="address">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleClick(scope.row)">查看</el-button>
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
          <el-tree :data=" data"
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
      :title="title"/>
  </el-container>
</template>

<script>
import createOrEditDialog from '@/components/role/CreateOrEditDialog'

export default {
  name: 'RoleView',
  components: { createOrEditDialog },
  data: () => ({
    title: '',
    multipleSelection: [],
    tableData: [{
      id: 1,
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    }, {
      id: 2,
      date: '2016-05-04',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1517 弄'
    }, {
      id: 3,
      date: '2016-05-01',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1519 弄',
      hasChildren: true
    }, {
      id: 4,
      date: '2016-05-03',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1516 弄'
    }],
    searchForm: {
      roleName: '',
      roleCode: '',
      current: 1,
      size: 10
    },
    total: 0,

    data: [{
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
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    search () {
    },
    resetForm () {
      this.searchForm.platformName = ''
      this.searchForm.platformCode = ''
    },
    deleteInfo () {
    },
    exportInfo () {
    },
    importInfo () {
    },
    create () {
      this.title = '创建平台'
      this.$refs.createOrEditDialog.showDialogFormVisible()
    },
    edit () {
      this.title = '修改平台'
      this.$refs.createOrEditDialog.showDialogFormVisible()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleClick (val) {
      alert(JSON.stringify(val))
    }
  }
}
</script>
