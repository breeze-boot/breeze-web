<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px"
             @close="closeDialog('ruleForm')">
    <el-form v-show="!show" ref="ruleForm" :model="menu" :rules="rules" size="mini">
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
      <el-form-item :label-width="formLabelWidth" label="组件类型" prop="type" style="text-align: left;">
        <el-radio-group v-model="menu.type" @change="handleTypeChange">
          <el-radio-button
            v-for="item in typeOptions"
            :key="item.label"
            :label="item.label">
            {{ item.name }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="上级菜单" prop="parentId">
        <el-cascader
          v-model="menu.parentId"
          :options="menuOption"
          :props="{ checkStrictly: true }"
          filterable
        ></el-cascader>
      </el-form-item>

      <el-form-item :label-width="formLabelWidth" label="标题" prop="title">
        <el-input v-model="menu.title" autocomplete="off" clearable placeholder="请输入组件显示的标题"></el-input>
      </el-form-item>

      <el-form-item v-if="btnVisible" :label-width="formLabelWidth" label="组件图标" prop="icon">
        <el-input v-model="menu.icon" autocomplete="off" clearable placeholder="请选择组件图标"></el-input>
      </el-form-item>

      <el-form-item v-if="btnVisible" :label-width="formLabelWidth" label="组件名称" prop="name">
        <el-input v-model="menu.name" autocomplete="off" clearable placeholder="请输入组件名称"></el-input>
      </el-form-item>

      <el-form-item v-if="btnVisible" :label-width="formLabelWidth" label="菜单路径" prop="path">
        <el-input v-model="menu.path" autocomplete="off" clearable placeholder="请输入菜单路径"></el-input>
      </el-form-item>

      <el-form-item :label-width="formLabelWidth" label="排序" prop="sort" style="text-align: left;">
        <el-input-number v-model="menu.sort" :max="10" :min="1" label="排序" @change="handleChangeSort"/>
      </el-form-item>

      <el-form-item v-if="btnVisible" :label-width="formLabelWidth" label="组件路径" prop="component">
        <el-input v-model="menu.component" autocomplete="off" clearable placeholder="请输入组件路径"></el-input>
      </el-form-item>

      <el-form-item v-if="folderVisible" :label-width="formLabelWidth" label="权限标识" prop="permission">
        <el-input v-model="menu.permission" autocomplete="off" clearable placeholder="请输入权限标识"></el-input>
      </el-form-item>
    </el-form>
    <div v-show="!show" slot="footer" class="dialog-footer">
      <el-button size="mini" @click="resetForm('ruleForm')">取 消</el-button>
      <el-button size="mini" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>

    <el-descriptions v-show="show" :column="2" border size="mini">
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user"></i>
          菜单名称
        </template>
        {{ menu.title }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          路由名称
        </template>
        {{ menu.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone"></i>
          icon
        </template>
        {{ menu.icon }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-chat-round"></i>
          排序
        </template>
        {{ menu.sort }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          平台名称
        </template>
        {{ menu.platformName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          父级元素
        </template>
        <el-select v-model="menu.deptId" :disabled="true" size="mini">
          <el-option
            v-for="item in menuOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          权限标识
        </template>
        <el-tag v-if="menu.permission !== ''" type="primary">
          {{ menu.permission }}
        </el-tag>
        <span v-else>{{ menu.permission }}</span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user-solid"></i>
          组件名称
        </template>
        <el-tag v-if="menu.component && menu.component === ''"> {{ menu.component }}</el-tag>
        <span v-else>{{ menu.component }}</span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user-solid"></i>
          组件路径
        </template>
        <el-tag v-if="menu.path && menu.path !== ''" type="primary"> {{ menu.path }}</el-tag>
        <span v-else>{{ menu.path }}</span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-unlock"></i>
          组件类型
        </template>
        <el-tag
          :type="menu.type === 0 ? 'primary' : (menu.type === 1 ? 'info' : 'danger')"
          disable-transitions> {{ menu.type === 0 ? '文件夹' : (menu.type === 1 ? '菜单' : '按钮') }}
        </el-tag>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script>
import { DIALOG_TYPE } from '@/utils/constant'
import { add, edit, selectMenu } from '@/api/admin/menu'
import { Message } from 'element-ui'

export default {
  name: 'AddEditDialog',
  props: {
    title: String
  },
  data () {
    return {
      dialogVisible: false,
      // folder需要隐藏的
      folderVisible: false,
      // btn需要隐藏的
      btnVisible: true,
      menu: {
        id: null,
        name: '',
        title: '',
        icon: '',
        sort: 0,
        parentId: '0',
        permission: '',
        component: '',
        platformId: '',
        platformName: '',
        type: 'folder',
        path: ''
      },
      menuOption: [],
      typeOptions: [
        {
          label: 'folder',
          name: '文件夹'
        },
        {
          label: 'menu',
          name: '菜单'
        },
        {
          label: 'btn',
          name: '按钮'
        }
      ],
      platformOptions: [
        {
          value: '1564528653105573889',
          label: '平台'
        }
      ],
      selectTreeOptions: [],
      // 默认是创建
      dialogStatus: DIALOG_TYPE.ADD,
      formLabelWidth: '80px',
      show: false,
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
            message: '请输入组件显示的标题',
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
            message: '请输入路径',
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
        ],
        parentId: [
          {
            required: true,
            message: '请选择上级菜单',
            trigger: 'change'
          }
        ]
      }
    }
  },
  mounted () {
    this.selectMenu()
  },
  methods: {
    handleTypeChange (e) {
      if (e === 'menu') {
        this.folderVisible = true
        this.btnVisible = true
      } else if (e === 'btn') {
        this.folderVisible = true
        this.btnVisible = false
      } else {
        this.folderVisible = false
        this.btnVisible = true
      }
    },
    handleChangeSort (val) {
      debugger
    },
    selectMenu () {
      selectMenu().then(resp => {
        if (resp.data) {
          const root = [{
            value: '0',
            label: '根节点',
            children: resp.data
          }]
          this.menuOption = root
        }
      })
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
      debugger
      this.menu.parentId = this.menu.parentId[this.menu.parentId.length - 1]
      add(this.menu).then((rep) => {
        if (rep.data) {
          Message.success({ message: rep.message })
          this.dialogVisible = false
          this.$emit('reloadList')
        }
      })
    },
    edit () {
      this.menu.parentId = this.menu.parentId[this.menu.parentId.length - 1]
      edit(this.menu).then((rep) => {
        Message.success({ message: rep.message })
        this.dialogVisible = false
        this.$emit('reloadList')
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    /*
     * val: 参数值
     * flag 0 创建 1 修改 2 显示
     */
    showDialogVisible (val, dialogStatus) {
      this.dialogVisible = true
      if (dialogStatus === DIALOG_TYPE.EDIT || dialogStatus === DIALOG_TYPE.SHOW) {
        this.$nextTick(() => {
          // 赋值
          Object.assign(this.menu, val)
        })
      }
      if (dialogStatus === DIALOG_TYPE.SHOW) {
        this.show = true
      }
      this.dialogStatus = dialogStatus
    },
    closeDialog (formName) {
      this.menu.id = undefined
      this.$refs[formName].clearValidate()
      this.$refs[formName].resetFields()
      this.show = false
    }
  }
}

</script>

<style>
</style>
