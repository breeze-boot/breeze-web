<template>
  <el-dialog title="图标" :visible.sync="iconDialogVisible" width="700px" top="250px"
             :append-to-body="true"
             @close="closeDialog()">
    <el-input size="mini" v-model="icon.name" clearable placeholder="请输入图标名称" @clear="filterIcon"
              @input.native="filterIcon">
      <i slot="suffix" class="el-icon-search el-input__icon"/>
    </el-input>
    <div class="icon">
      <div class="svg-icon" v-for="(item, index) in iconList" :key="index" @click="clickIcon(item)">
        <svg-icon :icon-class="item" style="width: 20px; height: 20px;"/>
        {{ item }}
      </div>
    </div>
  </el-dialog>
</template>

<script>

import icons from '@/assets/icon'

export default {
  name: 'IconDialog',
  props: {},
  data () {
    return {
      iconDialogVisible: false,
      formLabelWidth: '10px',
      icon: {
        name: ''
      },
      iconList: icons
    }
  },
  mounted () {
  },
  methods: {
    handleChangeSort (val) {
    },
    /**
     * 查询方法
     */
    filterIcon () {
    },
    clickIcon (item) {
      this.$emit('choiceIcon', item)
      this.iconDialogVisible = false
    },
    showIconDialog (val) {
      this.iconDialogVisible = true
    },
    closeDialog () {
      this.$nextTick(() => {
        this.icon.mame = ''
      })
    }
  }
}
</script>

<style scoped lang="less">
.icon {
  border: 1px solid #eee;
  padding: 10px;
  margin-top: 10px;
  display: flex;
  justify-content: start;
  align-items: start;
  height: 100px;

  .svg-icon {
    cursor: pointer;
    margin: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: inherit;
  }
}
</style>
