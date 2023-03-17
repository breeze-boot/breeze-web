<template>
  <el-dialog :append-to-body="true" :visible.sync="iconDialogVisible" title="图标" top="250px"
             width="700px"
             @close="closeDialog()">
    <el-input v-model="icon.name" clearable placeholder="请输入图标名称" size="mini" @clear="filterIcon"
              @input.native="filterIcon">
      <i slot="suffix" class="el-icon-search el-input__icon"/>
    </el-input>
    <div class="icon" style="border: 1px solid #eee;">
      <div v-for="(item, index) in iconList" :key="index" class="svg-icon" @click="clickIcon(item)">
        <svg-icon :icon-name="item" style="font-size: 20px;"/>
        <div style="padding: 4px 6px 4px 2px; height: 2em; line-height: 2.5em;">{{ item }}
        </div>
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

<style lang="scss" scoped>
.icon {
  padding: 10px;
  margin-top: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100px;

  .svg-icon {
    height: 20px;
    cursor: pointer;
    margin: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
