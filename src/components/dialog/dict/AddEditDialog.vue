<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px"
             @close="closeDialog('ruleForm')">
    <el-form v-show="!show" ref="ruleForm" :model="dict" :rules="rules" size="mini">
      <el-form-item :label-width="formLabelWidth" label="字典名称" prop="dictName">
        <el-input v-model="dict.dictName" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="字典编码" prop="dictCode">
        <el-input v-model="dict.dictCode" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="是否开启" prop="dictCode" style="text-align: left;">
        <el-switch
          v-model="dict.isOpen"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          inactive-color="#ff4949"
          size="mini">
        </el-switch>
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
          字典编码
        </template>
        {{ dict.dictCode }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          部门名称
        </template>
        <el-tag size="small">{{ dict.dictName }}</el-tag>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script>
import { DIALOG_TYPE } from '@/utils/constant'
import { add, edit } from '@/api/system/dict'
import { Message } from 'element-ui'

export default {
  name: 'AddEditDialog',
  props: {
    title: String
  },
  data () {
    return {
      dialogVisible: false,
      dict: {
        id: null,
        dictName: '',
        dictCode: '',
        isOpen: 0
      },
      // 默认是创建
      dialogType: DIALOG_TYPE.ADD,
      formLabelWidth: '80px',
      show: false,
      rules: {
        dictName: [
          {
            required: true,
            message: '请输入字典名称',
            trigger: 'blur'
          }
        ],
        dictCode: [
          {
            required: true,
            message: '请输入字典编码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogType === DIALOG_TYPE.ADD ? this.add() : this.edit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    add () {
      add(this.dict).then((rep) => {
        if (rep.code === 1) {
          Message.success({ message: rep.message })
          this.dialogVisible = false
          this.$emit('reloadList')
        }
      })
    },
    edit () {
      edit(this.dict).then((rep) => {
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
      this.dialogVisible = true
      if (dialogType === DIALOG_TYPE.EDIT || dialogType === DIALOG_TYPE.SHOW) {
        this.$nextTick(() => {
          // 赋值
          Object.assign(this.dict, val)
        })
      }
      if (dialogType === DIALOG_TYPE.SHOW) {
        this.show = true
      }
      this.dialogType = dialogType
    },
    closeDialog (formName) {
      this.dict.id = undefined
      this.$refs[formName].resetFields()
      this.show = false
    }
  }
}

</script>

<style scoped>

</style>
