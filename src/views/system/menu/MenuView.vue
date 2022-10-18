<template>
  <el-container>
    <el-main>
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="菜单名称">
              <el-input v-model="searchForm.title" clearable placeholder="菜单名称"/>
            </el-form-item>
            <el-form-item label="路由名称">
              <el-input v-model="searchForm.name" clearable placeholder="路由名称"/>
            </el-form-item>
            <el-form-item label="平台">
              <el-select v-model="searchForm.platformId" placeholder="请选择平台">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="reset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button plain size="mini" type="primary" @click="add">新建</el-button>
        <el-button plain size="mini" type="info" @click="exportInfo">导出</el-button>
        <el-button plain size="mini" @click="importInfo">导入</el-button>
      </div>
      <el-table
        :data="tableData"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        border
        height="90%"
        row-key="sid"
        size="mini"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          v-if="false"
          label="ID"
          prop="id"
          width="200">
        </el-table-column>
        <el-table-column
          label="标题"
          prop="title"
          show-overflow-tooltip
          width="180">
        </el-table-column>
        <el-table-column
          label="组件名称"
          prop="name"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="排序"
          prop="sort"
          width="50"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="图标"
          prop="icon"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <svg-icon :icon-name="scope.row.icon" style="font-size: 20px;" :icon-style="'margin-right: 0px;'"/>
            <el-tag
              v-if="scope.row.icon"
              type="success"
              disable-transitions
              size="mini">
              {{ scope.row.icon }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="权限标识"
          prop="permission"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="菜单路径"
          prop="path"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="组件路径"
          width="250"
          prop="component"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="类型"
          prop="type"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag :type="'success'">
              {{ scope.row.type === 0 ? '文件夹' : (scope.row.type === 1 ? '菜单' : '按钮') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="show(scope.row)">查看</el-button>
            <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click.native.prevent="delItem(tableData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <add-edit-dialog
      ref="addEditDialog"
      :title="title"
      @reloadList="reloadList"/>
  </el-container>
</template>

<script>
import AddEditDialog from '@/components/dialog/menu/AddEditDialog'
import { del, list } from '@/api/system/menu'
import { confirmAlert, DIALOG_TYPE } from '@/utils/constant'

export default {
  name: 'MenuView',
  components: {
    AddEditDialog
  },
  data: () => ({
    title: '',
    multipleSelection: [],
    tableData: [],
    options: [{
      value: '1564528653105573889',
      label: '后台管理中心'
    }],
    searchForm: {
      platformId: '1564528653105573889',
      name: '',
      title: ''
    }
  }),
  created () {
    this.reloadList()
  },
  methods: {
    reloadList () {
      list(this.buildParam()).then((rep) => {
        if (rep.code === 1) {
          this.tableData = rep.data
        }
      })
    },
    buildParam () {
      return this.searchForm
    },
    search () {
      this.reloadList()
    },
    reset () {
      this.searchForm.title = ''
      this.searchForm.name = ''
    },
    /**
     * 删除行
     *
     * @param rows
     */
    delItem (rows, row) {
      confirmAlert(() => {
        del(row.id).then(rep => {
          if (rep.code === 1) {
            this.deleteTreeTableData(rows, row)
          }
        })
      })
    },
    deleteTreeTableData (rows, row) {
      for (let index = 0; index < rows.length; index++) {
        if (rows[index].id.eq(row.id)) {
          rows.splice(index, 1)
          return
        }
        const tempTable = rows[index]
        if (tempTable.children && tempTable.children.length > 0) {
          this.deleteTreeTableData(tempTable.children, row)
        }
      }
    },
    exportInfo () {
    },
    importInfo () {
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    add () {
      this.title = '创建菜单'
      this.$refs.addEditDialog.showDialogVisible({}, DIALOG_TYPE.ADD)
    },
    edit (val) {
      this.title = '修改菜单'
      this.$refs.addEditDialog.showDialogVisible(val, DIALOG_TYPE.EDIT)
    },
    show (val) {
      this.title = '查看信息'
      this.$refs.addEditDialog.showDialogVisible(val, DIALOG_TYPE.SHOW)
    }
  }
}
</script>
