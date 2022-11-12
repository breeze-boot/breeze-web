<template>
  <div id="tag">
    <el-tag
      v-for="tag in this.dynamicTags"
      :key="tag.name"
      :closable="tag.name !== 'welcome'"
      :disable-transitions="false"
      :effect="$route.name  !== tag.name ? 'plain' : 'dark'"
      size="medium"
      @click="handleClick(tag)"
      @close="handleClose(tag)">
      {{ tag.title }}
    </el-tag>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import router from '@/router'

export default {
  name: 'Tag',
  data () {
    return {}
  },
  computed: {
    ...mapState('tag', ['dynamicTags'])
  },
  methods: {
    handleClick (tag) {
      router.push({ name: tag.name }).then(r => {
      })
    },
    handleClose (tag) {
      let index = this.dynamicTags.findIndex((value, index, arr) => {
        return value.name === tag.name
      })
      this.dynamicTags.splice(index, 1)
      if (this.dynamicTags.length === index) {
        --index
      }
      this.$router.push({ name: this.dynamicTags[index].name })
    }
  }
}
</script>
<style lang="less">
#tag {
  padding: 2px 2px;
  margin-bottom: 2px;
  overflow-x: scroll;
  position: relative;
  height: 4vh;
  box-shadow: 0 0 1px rgba(61, 57, 57, 0.29);
  white-space: nowrap;
}

#tag .el-tag {
  margin-left: 5px;
  cursor: pointer;
}

#tag .el-tag--plain {
  background: #fcfcfc !important;
  //box-shadow: 1px 1px 10px #d7d7d7;
  border-radius: 3px;
  color: #4d4d4d !important;
  border: solid 1px #d3d3d3;
}

#tag .el-tag--dark {
  border-radius: 3px;
  //box-shadow: 1px 1px 5px #d7d7d7;
  //background: rgb(117, 117, 118) !important;
  color: #f1f1f1 !important;
}

#tag .el-tag--plain > .el-tag__close:hover {
  background-color: #fcfcfc !important;
  color: #4d4d4d !important;
}

#tag .el-tag--plain > .el-tag__close {
  color: #ffffff !important;
}

#tag .el-tag--dark > .el-tag__close:hover {
  background-color: #409eff !important;
  color: #ffffff !important;
}
</style>
