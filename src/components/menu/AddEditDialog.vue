<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="800px"
             @close="closeDialog('ruleForm')">
    <el-form ref="ruleForm" :disabled="!show" :model="menu" :rules="rules" size="mini">
      <el-form-item :label-width="formLabelWidth" label="平台" prop="platformId" style="text-align: left;">
        <el-select v-model="menu.platformId" placeholder="请选择所属的平台">
          <el-option
            v-for="item in platformOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="菜单名称" prop="title">
        <el-input v-model="menu.title" autocomplete="off" clearable placeholder="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="组件名称" prop="name">
        <el-input v-model="menu.name" autocomplete="off" clearable placeholder="请输入组件名称"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="排序" prop="sort" style="text-align: left;">
        <el-input-number v-model="menu.sort" :max="10" :min="1" label="排序" @change="handleChange"/>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="组件名称" prop="icon">
        <el-input v-model="menu.icon" autocomplete="off" clearable placeholder="请输入组件名称"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="父级元素" prop="parentId">
        123
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="权限标识" prop="permission">
        <el-input v-model="menu.permission" autocomplete="off" clearable placeholder="请输入权限标识"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="菜单路径" prop="path">
        <el-input v-model="menu.path" autocomplete="off" clearable placeholder="请输入菜单路径"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="组件路径" prop="component">
        <el-input v-model="menu.component" autocomplete="off" clearable placeholder="请输入组件路径"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="类型" prop="type" style="text-align: left;">
        <el-select v-model="menu.type" placeholder="请选择类型">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div v-if="show" slot="footer" class="dialog-footer">
      <el-button @click="resetForm('ruleForm')">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { DIALOG_TYPE } from '@/utils/constant'
import { add, edit } from '@/api/menu'
import { Message } from 'element-ui'

export default {
  name: 'AddEditDialog',
  props: {
    title: String
  },
  data () {
    return {
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
        type: 0
      },
      typeOptions: [
        {
          value: 0,
          label: '文件夹'
        },
        {
          value: 1,
          label: '菜单'
        },
        {
          value: 2,
          label: '按钮'
        }
      ],
      platformOptions: [
        {
          value: '1564528653105573889',
          label: '平台'
        }
      ],
      selectTreeOptions: [{
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
      // 默认是创建
      dialogStatus: DIALOG_TYPE.ADD,
      formLabelWidth: '80px',
      show: true,
      rules: {
        platformId: [
          {
            required: true,
            message: '请选择平台',
            trigger: 'change'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入菜单名称',
            trigger: 'blur'
          }
        ],
        title: [
          {
            required: true,
            message: '请输入组件名称',
            trigger: 'blur'
          }
        ],
        sort: [
          {
            required: true,
            message: '请设置排序',
            trigger: 'change'
          }
        ],
        icon: [
          {
            required: true,
            message: '请选择icon图标',
            trigger: 'blur'
          }
        ],
        permission: [
          {
            required: true,
            message: '请输入权限标识',
            trigger: 'blur'
          }
        ],
        path: [
          {
            required: true,
            message: '请输入路由路径',
            trigger: 'blur'
          }
        ],
        component: [
          {
            required: true,
            message: '请输入组件路径',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '请选择组件类型',
            trigger: 'change'
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
        this.$emit('reloadList')
      })
    },
    edit () {
      edit(this.menu).then((rep) => {
        Message.success({ message: rep.message })
        this.dialogFormVisible = false
        this.$emit('reloadList')
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
        this.$nextTick(() => {
          // 赋值
          Object.assign(this.menu, val)
        })
      }
      if (dialogStatus === DIALOG_TYPE.SHOW) {
        this.show = false
      }
      this.dialogStatus = dialogStatus
    },
    closeDialog (formName) {
      this.menu.id = undefined
      this.$refs[formName].clearValidate()
      this.$refs[formName].resetFields()
      this.show = true
    }
  }
}

</script>

<style>
</style>
