<template>
  <div id="tag" @mousewheel="wheel">
    <el-tag
      :key="tag.name"
      v-for="tag in this.getDynamicTags"
      :closable="tag.name !== 'welcome'"
      :effect="$route.name  !== tag.name ? 'plain' : 'dark'"
      :disable-transitions="false"
      @click="handleClick(tag)"
      @close="handleClose(tag)">
      {{ tag.title }}
    </el-tag>
  </div>
</template>

<script>

import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Tag',
  data () {
    return {}
  },
  computed: {
    ...mapGetters('menu', ['getDynamicTags', 'getCurrentTagValue'])
  },
  methods: {
    ...mapMutations('menu', ['setCurrentTagValue']),
    handleClick (tag) {
      this.setCurrentTagValue(tag)
    },
    handleClose (tag) {
      let index = this.getDynamicTags.findIndex((value, index, arr) => {
        return value.name === tag.name
      })
      this.getDynamicTags.splice(index, 1)
      if (this.getDynamicTags.length === index) {
        --index
      }
      this.$router.push({ name: this.getDynamicTags[index].name })
    },
    wheel (e) {
      const a = document.getElementById('tag')
      const scrollWidth = 100
      let flag
      e.wheelDelta ? flag = e.wheelDelta : flag = e.detail
      if (flag > 3 || -flag > 3) flag = -flag
      flag > 0 ? a.scrollLeft += scrollWidth : a.scrollLeft -= scrollWidth
      e.preventDefault()
    }
  }
}
</script>
<style lang="less" scoped>
#tag {
  padding: 2px 2px;
  margin-bottom: 2px;
  overflow-x: scroll;
  position: relative;
  height: 4vh;
  box-shadow: 0 0px 1px rgba(61, 57, 57, 0.29);
  white-space: nowrap;

  .el-tag + .el-tag {
    margin-left: 5px;
    cursor: pointer;
  }

}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0);
  border-radius: 0;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 10px;
  height: 0px;
}

::-webkit-scrollbar-thumb {
  cursor: pointer;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0);
  transition: color .2s ease;
}

</style>
`
