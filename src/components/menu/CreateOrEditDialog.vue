<template>
  <el-dialog width="800px" :title="title" :visible.sync="dialogFormVisible"
             @closed="closeDialog">
    <el-form size="mini" :rules="rules" :disabled="!show" ref="ruleForm" :model="menu">
      <el-form-item label="菜单名称" prop="title" :label-width="formLabelWidth">
        <el-input v-model="menu.title" autocomplete="off" clearable></el-input>
      </el-form-item>

      <el-form-item label="组件名称" prop="name" :label-width="formLabelWidth">
        <el-input v-model="menu.name" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort" :label-width="formLabelWidth" style="text-align: left;">
        <el-input-number v-model="menu.sort" @change="handleChange" :min="1" :max="10" label="排序"/>
      </el-form-item>
      <el-form-item label="组件名称" prop="icon" :label-width="formLabelWidth">
        <el-input v-model="menu.icon" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="父级元素" prop="parentId" :label-width="formLabelWidth">
        <tree-select
          :options="options"
          :disable-branch-nodes="true"
          :show-count="true"
          placeholder=""
        />
      </el-form-item>
    </el-form>
    <div slot="footer" v-if="show" class="dialog-footer">
      <el-button @click="resetForm('ruleForm')">取 消</el-button>
      <el-button @click="submitForm('ruleForm')" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { DIALOG_TYPE } from '@/utils/constant'
import { add, edit } from '@/api/menu'
import { Message } from 'element-ui'
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'CreateOrEditBox',
  components: { TreeSelect },
  props: {
    title: String
  },
  data () {
    return {
      options: [{
        id: 'a',
        label: 'a',
        children: [{
          id: 'aa',
          label: 'aa'
        }, {
          id: 'ab',
          label: 'ab'
        }]
      }, {
        id: 'b',
        label: 'b'
      }, {
        id: 'c',
        label: 'c'
      }],
      dialogFormVisible: false,
      menu: {
        id: null,
        name: '',
        title: '',
        icon: '',
        sort: 0,
        parentId: null,
        permission: '',
        component: '',
        platformId: '',
        type: 1
      },
      // 默认是创建
      dialogStatus: DIALOG_TYPE.ADD,
      formLabelWidth: '80px',
      show: true,
      rules: {
        name: [
          {
            required: true,
            message: '请输入平台名称',
            trigger: 'blur'
          }
        ],
        title: [
          {
            required: true,
            message: '请输入平台标识',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    handleChange (val) {
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogStatus === DIALOG_TYPE.ADD ? this.add() : this.edit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    add () {
      add(this.menu).then((rep) => {
        Message.success({ message: rep.message })
        this.dialogFormVisible = false
      })
    },
    edit () {
      edit(this.menu).then((rep) => {
        Message.success({ message: rep.message })
        this.dialogFormVisible = false
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.dialogFormVisible = false
    },
    /*
     * val: 参数值
     * flag 0 创建 1 修改 2 显示
     */
    showDialogFormVisible (val, dialogStatus) {
      this.dialogFormVisible = true
      if (dialogStatus === DIALOG_TYPE.EDIT || dialogStatus === DIALOG_TYPE.SHOW) {
        this.menu.id = val.id
        this.menu.title = val.title
        this.menu.name = val.name
      }
      if (dialogStatus === DIALOG_TYPE.SHOW) {
        this.show = false
      }
      this.dialogStatus = dialogStatus
    },
    closeDialog () {
      this.menu.name = ''
      this.menu.title = ''
      this.menu.id = ''
      this.show = true
      this.dialogStatus = DIALOG_TYPE.ADD
      this.$emit('reloadList')
    }
  }
}

</script>

<style>
.vue-treeselect__control {
  height: 10px !important;
}

.vue-treeselect__input {
  padding: 5px !important;
}

.vue-treeselect__input-container {
  padding: 1px !important;
}

</style>
