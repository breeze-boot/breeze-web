<template>
  <el-container>
    <el-dialog :title="title" :visible.sync="dialogTableVisible" width="800px"
               @close="closeDialog('ruleForm')">
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button plain size="mini" type="primary" @click="add">新建</el-button>
        <el-button plain size="mini" type="danger" @click="del">删除</el-button>
      </div>
      <el-table ref="multipleTable" :data="gridData" border height="200" size="mini" stripe style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column v-if="false" label="ID" property="id" width="100"></el-table-column>
        <el-table-column label="值" property="value"></el-table-column>
        <el-table-column label="标签" property="label"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click.native.prevent="deleteRow(scope.$index, tableData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="close">关 闭</el-button>
      </div>
    </el-dialog>
    <dict-item-add-edit-dialog ref="addEditDialog" :title="title" @reloadList="reloadList"/>
  </el-container>
</template>

<script>
import DictItemAddEditDialog from '@/components/dict/DictItemAddEditDialog'
import { DIALOG_TYPE } from '@/utils/constant'
import { del, list } from '@/api/dictItem'

export default {
  name: 'DictItemDialog',
  components: { DictItemAddEditDialog },
  data () {
    return {
      title: '',
      dialogTableVisible: false,
      // 默认是创建
      dialogStatus: DIALOG_TYPE.ADD,
      formLabelWidth: '80px',
      gridData: [],
      rowData: {}
    }
  },
  methods: {
    reloadList () {
      list(this.rowData).then((rep) => {
        if (rep) {
          this.gridData = rep.data
          this.total = rep.data.total
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    add () {
      this.title = '创建字典项'
      this.$refs.addEditDialog.showDialogFormVisible(this.rowData, DIALOG_TYPE.ADD)
    },
    edit (val) {
      this.title = '修改字典项'
      this.$refs.addEditDialog.showDialogFormVisible(val, DIALOG_TYPE.EDIT)
    },
    del () {
      const ids = []
      this.multipleSelection.forEach((x) => {
        ids.push(x.id)
      })
      del(ids)
      this.reloadList()
    },
    deleteRow (index, rows, row) {
      const ids = []
      ids.push(row.id)
      del(ids)
      rows.splice(index, 1)
    },
    close () {
      this.dialogTableVisible = false
    },
    showDialogTableVisible (val) {
      this.dialogTableVisible = true
      this.$nextTick(() => {
        // 赋值
        debugger
        Object.assign(this.rowData, val)
        this.reloadList()
      })
    },
    closeDialog () {
    }
  }
}

</script>

<style scoped>

</style>
