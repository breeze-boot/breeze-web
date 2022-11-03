<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="600px"
             @close="closeDialog('ruleForm')">
    <el-form v-show="!show" ref="ruleForm" :model="dept" :rules="rules" size="mini">
      <el-form-item class="parentId" :label-width="formLabelWidth" label="上级部门" prop="parentId">
        <el-cascader
          v-model="dept.parentId"
          :options="deptOption"
          :props="{ checkStrictly: true }"
          filterable
          clearable
          :show-all-levels="false"
        ></el-cascader>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="部门名称" prop="deptName">
        <el-input v-model="dept.deptName" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="部门编码" prop="deptCode">
        <el-input v-model="dept.deptCode" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="描述" prop="isOpen">
        <el-input v-model="dept.isOpen" autocomplete="off" clearable type="input"></el-input>
      </el-form-item>
    </el-form>
    <div v-show="!show" slot="footer" class="dialog-footer">
      <el-button size="mini" @click="resetForm()">取 消</el-button>
      <el-button size="mini" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>

    <el-descriptions v-show="show" :column="1" border size="mini">
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user"></i>
          部门编码
        </template>
        {{ dept.deptCode }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          部门名称
        </template>
        <el-tag size="small">{{ dept.deptName }}</el-tag>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script>
import { DIALOG_TYPE, filterTreeParentId } from '@/utils/constant'
import { add, edit, selectDept } from '@/api/system/dept'
import { Message } from 'element-ui'

export default {
  name: 'AddEditDialog',
  props: {
    title: String
  },
  data () {
    return {
      dialogVisible: false,
      deptOption: [],
      dept: {
        id: null,
        parentId: null,
        deptName: '',
        deptCode: ''
      },
      // 默认是创建
      dialogType: DIALOG_TYPE.ADD,
      formLabelWidth: '80px',
      show: false,
      rules: {
        deptName: [
          {
            required: true,
            message: '请输入部门名称',
            trigger: 'blur'
          }
        ],
        deptCode: [
          {
            required: true,
            message: '请输入部门编码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    selectDept (id) {
      selectDept(id).then(res => {
        if (res.code === 1 && res.data) {
          this.deptOption = [{
            value: '1111111111111111111',
            label: '根节点',
            children: res.data
          }]
          const treeTemp = filterTreeParentId(res.data, (tree) => {
            console.log(JSON.stringify(tree))
            return tree.id && tree.id === this.dept.parentId
          }, 'id')
          const tempArray = ['1111111111111111111']
          treeTemp.map(id => tempArray.push(id))
          this.dept.parentId = tempArray
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dept.parentId = this.dept.parentId[this.dept.parentId.length - 1]
          this.dialogType === DIALOG_TYPE.ADD ? this.add() : this.edit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    add () {
      add(this.dept).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: rep.message })
          this.dialogVisible = false
          this.$emit('reloadList')
        }
      })
    },
    edit () {
      edit(this.dept).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: rep.message })
          this.dialogVisible = false
          this.$emit('reloadList')
        }
      })
    },
    resetForm () {
      this.dialogVisible = false
    },
    /*
     * val: 参数值
     * flag 0 创建 1 修改 2 显示
     */
    showDialogVisible (val, dialogType) {
      if (dialogType === DIALOG_TYPE.EDIT || dialogType === DIALOG_TYPE.SHOW) {
        this.$nextTick(() => {
          // 赋值
          Object.assign(this.dept, val)
          this.dept.parentId = val.parentId
          this.selectDept(this.dept.id)
        })
      }
      if (dialogType === DIALOG_TYPE.SHOW) {
        this.show = true
        this.selectDept()
      } else if (dialogType === DIALOG_TYPE.ADD) {
        this.dept.parentId = val.id ? val.id : ''
        this.selectDept()
      }
      this.dialogVisible = true
      this.dialogType = dialogType
    },
    closeDialog (formName) {
      this.dept.id = undefined
      this.$refs[formName].resetFields()
      this.show = false
    }
  }
}

</script>

<style scoped>

</style>
