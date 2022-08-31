<template>
  <el-container>
    <el-main>
      <el-form size="mini" :inline="true" :model="searchForm" class="demo-form-inline">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="角色名称">
              <el-input v-model="searchForm.roleName" placeholder="角色名称" clearable/>
            </el-form-item>
            <el-form-item label="角色标识">
              <el-input v-model="searchForm.roleCode" placeholder="角色标识" clearable/>
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
            <el-button size="mini" type="primary" @click="create" plain>新建</el-button>
            <el-button size="mini" type="warning " @click="edit" plain>修改</el-button>
            <el-button size="mini" type="danger" @click="deleteInfo" plain>删除</el-button>
            <el-button size="mini" type="info" @click="exportInfo" plain>导出</el-button>
            <el-button size="mini" @click="importInfo" plain>导入</el-button>
          </div>
          <el-table
            border
            stripe
            ref="multipleTable"
            size="mini"
            :data="tableData"
            height="600"
            row-key="id"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="date"
              label="日期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleClick(scope.row)" type="text">查看</el-button>
                <el-button size="mini" @click="edit(scope.row)" type="text">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div style="text-align: right;margin-top: 2vh;">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="searchForm.current"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="searchForm.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </el-col>
        <el-col :md="5">
          <el-tree style="height: 600px; overflow-y:scroll;border: #e1e1e1 1px solid;margin:37px;"
                   :data=" data"
                   show-checkbox
                   node-key="id"
                   :default-expanded-keys="[2, 3]"
                   :default-checked-keys="[5]"
                   :props="defaultProps">
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
