<template>
  <div class="tag-group" @mousewheel="wheel">
    <el-tag
      v-for="tag in this.dynamicTabs"
      :id="tag.name"
      :key="tag.name"
      v-right-menu
      :closable="tag.name !== 'welcome'"
      :disable-transitions="false"
      :effect="$route.name  !== tag.name ? 'plain' : 'dark'"
      size="medium"
      @click="handleClick(tag)"
      @close="handleClose(tag)">
      {{ tag.title }}
      <right-menu/>
    </el-tag>
  </div>
</template>

<script>
import rightMenu from '@/components/rightMenu/RightMenu.vue'

import { mapState } from 'vuex'
import { getParamsAndQueryByName } from '@utils/common'

export default {
  name: 'Tags',
  components: {
    rightMenu
  },
  data () {
    return {}
  },
  computed: {
    ...mapState('tab', ['dynamicTabs'])
  },
  methods: {
    /**
     * Tag点击切换事件
     *
     * @param tag
     */
    handleClick (tag) {
      const {
        query,
        params
      } = getParamsAndQueryByName(this.$store.getters['tab/getDynamicTabs'], tag.name)
      this.$router.push({
        name: tag.name,
        query: query,
        params: params
      }).then(r => console.debug(r))
    },
    /**
     * Tag关闭事件
     *
     * @param tag
     */
    handleClose (tag) {
      this.$store.dispatch('tab/closeCurrentTab', tag.name)
    },
    /**
     * 滑轮
     *
     * @param e
     */
    wheel (e) {
      const dom = document.getElementsByClassName('tag-group')[0]
      const scrollWidth = 100
      let flag
      e.wheelDelta ? flag = e.wheelDelta : flag = e.detail
      if (flag > 3 || -flag > 3) flag = -flag
      flag > 0 ? dom.scrollLeft += scrollWidth : dom.scrollLeft -= scrollWidth
      e.preventDefault()
    }
  }
}
</script>
<style lang="scss">
.tag-group {
  overflow-x: scroll;
  margin-top: 5px;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-content: flex-start;
  align-items: center;
  height: 5vh;
  box-shadow: 0 0 1px rgba(61, 57, 57, 0.29);
  white-space: nowrap;

  .el-tag {
    margin-left: 5px;
    cursor: pointer;
  }

  .el-tag:first-child {
    margin-left: 0;
  }

  .el-tag--plain {
    background: #fcfcfc !important;
    border-radius: 3px;
    color: #4d4d4d !important;
    border: solid 1px #d3d3d3;
  }

  .el-tag--dark {
    border-radius: 3px;
    color: #f1f1f1 !important;
  }

  .el-tag--plain > .el-tag__close:hover {
    background-color: #fcfcfc !important;
    color: #4d4d4d !important;
  }

  .el-tag--plain > .el-tag__close {
    color: #ffffff !important;
  }

  .el-tag--dark > .el-tag__close:hover {
    background-color: #409eff !important;
    color: #ffffff !important;
  }
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0);
  border-radius: 0;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 0;
  height: 0;
}

::-webkit-scrollbar-thumb {
  cursor: pointer;
  border-radius: 0;
  background: rgba(0, 0, 0, 0);
  transition: color 0.2s ease;
}
</style>
