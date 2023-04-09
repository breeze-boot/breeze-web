<template>
  <el-dialog :append-to-body="true" :visible.sync="iconDialogVisible" title="图标" top="250px"
             width="80vw"
             @close="closeDialog()">
    <el-input v-model="icon.name" clearable placeholder="请输入图标名称" size="mini" @input.native="filterIcon">
      <i slot="suffix" class="el-icon-search el-input__icon" @click="filterIcon"/>
    </el-input>

    <div v-if="'svg' === type" class="icon">
      <!-- 菜单不支持svg图标，因为使用自定义图片菜单折叠不显示图标-->
      <div v-for="(icon, index) in svgIconsList" :key="index" class="custom-icon" @click="clickIcon(icon)">
        <custom-icon :icon-name="`${icon}`"/>
        <div class="icon_item">
          {{ icon }}
        </div>
      </div>
    </div>
    <div v-if="'iconfont'===type" class="icon">
      <div v-for="(icon, index) in alIconList" :key="index" class="custom-icon" @click="clickIcon(icon)">
        <div class="icon_item">
          <custom-icon :icon-name="icon"/>
          {{ icon }}
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>

import svgIcons from '@/assets/icon'
import aliIcons from '@/assets/icon-fonts/iconList'

export default {
  name: 'IconDialog',
  props: {
    type: {
      type: String,
      default: '',
      require: true
    }
  },
  data () {
    return {
      iconDialogVisible: false,
      formLabelWidth: '10px',
      icon: {
        name: ''
      },
      svgIconsList: svgIcons,
      alIconList: aliIcons
    }
  },
  mounted () {
  },
  methods: {
    /**
     * 查询方法
     */
    filterIcon () {
      if (this.type === 'iconfont') {
        if (this.icon.name === '') {
          this.alIconList = aliIcons
          return
        }
        this.alIconList = aliIcons.filter(icon => {
          return icon.includes(this.icon.name)
        })
      } else {
        if (this.icon.name === '') {
          this.svgIconsList = svgIcons
          return
        }
        this.svgIconsList = svgIcons.filter(icon => {
          return icon.includes(this.icon.name)
        })
      }
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
  border: 1px solid #eee;
  padding: 10px;
  margin-top: 10px;
  display: flex;
  justify-content: flex-start;
  align-content: flex-start;
  flex-wrap: wrap;
  overflow-y: scroll;
  height: 200px;

  .custom-icon {
    display: flex;
    width: 200px;
    height: 30px;
    cursor: pointer;
    margin: 1px;
  }
}
</style>
