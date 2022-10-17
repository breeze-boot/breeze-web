<template>
  <el-container>
    <el-main>
      <el-form ref="ruleForm" :model="dict" :rules="rules" size="mini">
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
        <el-button size="mini" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>

export default {
  name: 'TestKeepView',
  data () {
    return {
      formLabelWidth: '100px',
      dict: {
        id: null,
        dictName: '',
        dictCode: '',
        isOpen: 0
      },
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
            message: '请输入字典标识',
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
          return ''
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    add () {
    },
    resetForm () {
    }
  }
}

</script>

<style scoped>

</style>
