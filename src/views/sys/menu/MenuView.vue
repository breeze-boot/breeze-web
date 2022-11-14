<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchMenuForm" class="demo-form-inline" size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="菜单名称" prop="title">
              <el-input v-model="searchMenuForm.title" clearable placeholder="菜单名称"/>
            </el-form-item>
            <el-form-item label="路由名称" prop="name">
              <el-input v-model="searchMenuForm.name" clearable placeholder="路由名称"/>
            </el-form-item>
            <el-form-item label="平台">
              <el-select v-model="searchMenuForm.platformId" placeholder="请选择平台">
                <el-option
                  v-for="item in platformOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="searchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button plain size="mini" type="primary" @click="create">新建</el-button>
        <el-button plain size="mini" type="info" @click="exportInfo">导出</el-button>
        <el-button plain size="mini" @click="importInfo">导入</el-button>
      </div>
      <el-table
        ref="menuTable"
        :data="menuTableData"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        border
        empty-text="无数据"
        height="90%"
        row-key="id"
        size="mini"
        stripe
        style="width: 100%"
        @expand-change="menuHandleExpandChange">
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
          show-overflow-tooltip
          width="50">
        </el-table-column>
        <el-table-column
          label="图标"
          prop="icon"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <svg-icon :icon-name="scope.row.icon" :icon-style="'margin-right: 0px;'" style="font-size: 20px;"/>
            <el-tag
              v-if="scope.row.icon"
              disable-transitions
              size="mini"
              type="success">
              {{ scope.row.icon }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="权限编码"
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
          prop="component"
          show-overflow-tooltip
          width="250">
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
          width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="info(scope.row)">查看</el-button>
            <el-button size="mini" type="text" @click="create(scope.row)">新建</el-button>
            <el-button size="mini" type="text" @click="modify(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click.native.prevent="delItem(menuTableData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <el-dialog :title="title" :visible.sync="menuDialogVisible" width="800px"
               @close="closeDialog">
      <el-form ref="menuRuleForm" :model="menu" :rules="rules" size="mini">
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
        <el-form-item :label-width="formLabelWidth" label="组件类型"
                      style="text-align: left;">
          <el-radio-group v-model="menu.type"
                          @click="menu.type === 2 ? menu.href = 0 : menu.href = 1">
            <el-radio-button
              v-for="item in typeOptions"
              :key="item.label"
              :label="item.label">
              {{ item.name }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="menu.type === 1" :label-width="formLabelWidth" label="外链" style="text-align: left;">
          <el-radio-group v-model="menu.href">
            <el-radio-button
              v-for="item in hrefOptions"
              :key="item.label"
              :label="item.label">
              {{ item.name }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="menu.type === 1" :label-width="formLabelWidth" label="缓存" style="text-align: left;">
          <el-radio-group v-model="menu.keepAlive">
            <el-radio-button
              v-for="item in keepAliveOptions"
              :key="item.label"
              :label="item.label">
              {{ item.name }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="menu.type === 1" :label-width="formLabelWidth" label="隐藏" style="text-align: left;">
          <el-radio-group v-model="menu.hidden">
            <el-radio-button
              v-for="item in hiddenOptions"
              :key="item.label"
              :label="item.label">
              {{ item.name }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" class="parentId" label="上级菜单" prop="parentId">
          <el-cascader
            v-model="menu.parentId"
            :options="menuOption"
            :props="{ checkStrictly: true }"
            :show-all-levels="false"
            clearable
            filterable
          ></el-cascader>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="排序" prop="sort" style="text-align: left;">
          <el-input-number v-model="menu.sort" :max="10" :min="1" :step="5" label="排序" @change="handleChangeSort"/>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="标题" prop="title">
          <el-input v-model="menu.title" autocomplete="off" clearable placeholder="请输入组件显示的标题"></el-input>
        </el-form-item>

        <el-form-item v-if="menu.type === 0 || menu.type === 1" :label-width="formLabelWidth" label="组件图标"
                      prop="icon">
          <el-button plain style="margin:0 10px" type="success" @click="showIconDialog">打开</el-button>
          <svg-icon :icon-name="menu.icon" style="font-size: 20px;"/>
          <span> {{ menu.icon }} </span>
        </el-form-item>

        <el-form-item v-if="menu.type === 0 || menu.type === 1" :label-width="formLabelWidth"
                      label="菜单路径"
                      prop="path">
          <el-input v-model="menu.path" autocomplete="off" clearable placeholder="请输入菜单路径"></el-input>
        </el-form-item>

        <el-form-item v-if="menu.href === 0 && menu.type === 1" :label-width="formLabelWidth" label="组件名称"
                      prop="name">
          <el-input v-model="menu.name" autocomplete="off" clearable placeholder="请输入组件名称"></el-input>
        </el-form-item>

        <el-form-item v-if="menu.href === 0 && menu.type === 1" :label-width="formLabelWidth" label="组件路径"
                      prop="component">
          <el-input v-model="menu.component" autocomplete="off" clearable placeholder="请输入组件路径"></el-input>
        </el-form-item>

        <el-form-item v-if="menu.href === 0 && (menu.type === 1 || menu.type === 2)" :label-width="formLabelWidth"
                      label="权限编码"
                      prop="permission">
          <el-input v-model="menu.permission" autocomplete="off" clearable placeholder="请输入权限编码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetForm">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitForm('menuRuleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="800px"
               @close="closeInfoDialog">
      <el-descriptions :column="2" border size="mini">
        <el-descriptions-item>
          <template slot="label">
            平台名称
          </template>
          {{ menu.platformName }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            组件类型
          </template>
          <el-tag
            :type="menu.type === 0 ? 'primary' : (menu.type === 1 ? 'info' : 'warning')"
            disable-transitions> {{ menu.type === 0 ? '文件夹' : (menu.type === 1 ? '菜单' : '按钮') }}
          </el-tag>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            外链
          </template>
          <el-tag
            :type="menu.href === 0 ? 'primary' :  'info'"
            disable-transitions> {{ menu.href === 0 ? '路由菜单' : '外部链接' }}
          </el-tag>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            缓存
          </template>
          {{ menu.keepAlive === 0 ? '未开启' : '开启' }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            隐藏
          </template>
          {{ menu.hidden === 0 ? '显示在路由菜单' : '（隐藏）通过编程式路由跳转' }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            上级菜单
          </template>
          <el-cascader
            v-model="menu.parentId"
            :options="menuOption"
            :props="{ checkStrictly: true }"
            :show-all-levels="false"
            clearable
            disabled
            filterable
            size="mini"
          ></el-cascader>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            排序
          </template>
          {{ menu.sort }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            标题
          </template>
          {{ menu.title }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            图标
          </template>
          <svg-icon :icon-name="menu.icon" style="font-size: 20px;"/>
          <span>
          {{ menu.icon }}
        </span>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            路由名称
          </template>
          {{ menu.name }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            组件路径
          </template>
          <el-tag v-if="menu.path && menu.path !== ''" type="primary"> {{ menu.path }}</el-tag>
          <span v-else>{{ menu.path }}</span>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            权限编码
          </template>
          <el-tag v-if="menu.permission !== ''" type="primary">
            {{ menu.permission }}
          </el-tag>
          <span v-else>{{ menu.permission }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <icon-dialog
      ref="iconDialog"
      @choiceIcon="choiceIcon"/>
  </el-container>
</template>

<script>
import { add, del, edit, list, selectMenu, selectPlatform } from '@/api/sys/menu'
import { confirmAlert, DIALOG_TYPE, filterTreeParentId, ROOT } from '@/utils/constant'
import JSONBigInt from 'json-bigint'
import IconDialog from '@/components/svg/IconDialog'
import { Message } from 'element-ui'

export default {
  name: 'MenuView',
  components: {
    IconDialog
  },
  data () {
    return {
      title: '',
      multipleSelectionMenuId: [],
      menuTableData: [],
      platformOptions: [{
        value: '1564528653105573889',
        label: '后台管理中心'
      }],
      searchMenuForm: {
        platformId: '1564528653105573889',
        name: '',
        title: ''
      },
      menuDialogVisible: false,
      infoDialogVisible: false,
      menu: {
        id: undefined,
        platformId: '1564528653105573889',
        platformName: '',
        name: '',
        title: '',
        icon: '',
        sort: 0,
        parentId: ROOT,
        permission: '',
        component: '',
        href: 0,
        keepAlive: 0,
        hidden: 0,
        type: 0,
        path: ''
      },
      menuInfo: {
        id: undefined,
        platformId: '1564528653105573889',
        platformName: '',
        name: '',
        title: '',
        icon: '',
        sort: 0,
        parentId: ROOT,
        permission: '',
        component: '',
        href: 0,
        keepAlive: 0,
        hidden: 0,
        type: 0,
        path: ''
      },
      menuOption: [],
      hrefOptions: [
        {
          label: 0,
          name: '组件'
        },
        {
          label: 1,
          name: '外链'
        }
      ],
      keepAliveOptions: [
        {
          label: 0,
          name: '关闭缓存'
        },
        {
          label: 1,
          name: '开启缓存'
        }
      ],
      hiddenOptions: [
        {
          label: 0,
          name: '显示'
        },
        {
          label: 1,
          name: '隐藏'
        }
      ],
      typeOptions: [
        {
          label: 0,
          name: '文件夹'
        },
        {
          label: 1,
          name: '菜单'
        },
        {
          label: 2,
          name: '按钮'
        }
      ],
      // 默认是创建
      dialogType: DIALOG_TYPE.ADD,
      formLabelWidth: '80px',
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
            message: '请输入组件的标题',
            trigger: 'blur'
          }
        ],
        permission: [
          {
            required: true,
            message: '请输入权限编码',
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
        ]
      }
    }
  },
  mounted () {
    this.reloadList()
    this.selectPlatform()
  },
  methods: {
    selectPlatform () {
      selectPlatform().then((rep) => {
        if (rep.code === 1) {
          this.platformOptions = rep.data
        }
      }).catch((e) => {
        console.error(e)
      })
    },
    reloadList () {
      list(this.buildParam()).then((rep) => {
        if (rep.code === 1) {
          this.menuTableData = rep.data
          this.$nextTick(() => {
            this.$refs.menuTable.doLayout()
          })
        }
      })
    },
    buildParam () {
      return this.searchMenuForm
    },
    search () {
      this.reloadList()
    },
    searchReset () {
      this.$refs.searchForm.resetFields()
    },
    /**
     * 删除行
     *
     * @param rows
     * @param row
     */
    delItem (rows, row) {
      confirmAlert(() => {
        del(JSONBigInt.parse(row.id)).then(rep => {
          if (rep.code === 1) {
            this.deleteTreeTableData(rows, row)
          }
        })
      })
    },
    deleteTreeTableData (rows, row) {
      for (let index = 0; index < rows.length; index++) {
        if (rows[index].id === row.id) {
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
    menuHandleExpandChange (val) {
      this.multipleSelectionMenuId = val
      this.$nextTick(() => {
        this.$refs.menuTable.doLayout()
      })
    },
    create (val) {
      this.title = '创建菜单'
      this.dialogType = DIALOG_TYPE.ADD
      this.$nextTick(() => {
        this.menu.parentId = val.id ? val.id : ''
        this.selectMenu()
      })
      this.menuDialogVisible = true
    },
    clone () {
      this.title = '创建菜单'
    },
    modify (row) {
      this.title = '修改菜单'
      this.$nextTick(() => {
        Object.assign(this.menu, row)
        this.menu.parentId = row.parentId
        this.selectMenu(this.menu.id)
        this.selectPlatform()
      })
      this.menuDialogVisible = true
      this.dialogType = DIALOG_TYPE.EDIT
    },
    info (row) {
      this.title = '查看信息'
      this.$nextTick(() => {
        Object.assign(this.menu, row)
        this.menu.parentId = row.parentId
        this.selectMenu()
        this.selectPlatform()
      })
      this.infoDialogVisible = true
      this.dialogType = DIALOG_TYPE.SHOW
    },
    handleChangeSort (val) {
    },
    selectMenu (id) {
      selectMenu(id).then(res => {
        if (res.code === 1 && res.data) {
          this.menuOption = [{
            value: ROOT,
            label: '根节点',
            children: res.data
          }]
          const treeTemp = filterTreeParentId(res.data, (tree) => {
            return tree.id && tree.id === this.menu.parentId
          }, 'id')
          const tempArray = [ROOT]
          treeTemp.map(id => tempArray.push(id))
          this.menu.parentId = tempArray
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.menu.parentId = this.menu.parentId[this.menu.parentId.length - 1]
          this.dialogType === DIALOG_TYPE.ADD ? this.add() : this.edit()
        } else {
          console.log('error submit!!')
        }
      })
    },
    add () {
      add(this.menu).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: rep.message })
          this.menuDialogVisible = false
          this.reloadList()
        }
      })
    },
    edit () {
      edit(this.menu).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: rep.message })
          this.menuDialogVisible = false
          this.reloadList()
        }
      })
    },
    resetForm () {
      this.menuDialogVisible = false
    },
    showIconDialog () {
      this.$refs.iconDialog.showIconDialog({})
    },
    closeInfoDialog () {
      this.$nextTick(() => {
        Object.assign(this.menu, this.menuInfo)
      })
    },
    closeDialog () {
      this.$nextTick(() => {
        Object.assign(this.menu, this.menuInfo)
      })
    },
    choiceIcon (val) {
      this.menu.icon = val
    }
  }
}
</script>
