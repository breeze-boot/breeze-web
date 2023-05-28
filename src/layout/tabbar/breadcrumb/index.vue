<template>
  <el-container class="breadcrumb">
    <!-- 顶部左侧图标 -->
    <div class="collapse" @click="handleCollapse">
      <Icon v-show="this.menuCollapse.isCollapse" class="el-icon-s-fold"/>
      <Icon v-show="!this.menuCollapse.isCollapse" class="el-icon-s-unfold"/>
    </div>
  </el-container>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'Breadcrumb',
  data () {
    return {
      iconClass: ''
    }
  },
  computed: {
    ...mapState('menu', ['menuCollapse'])
  },
  mounted () {
  },
  created () {
    this.iconClass = 'icon-quanpingxianshi'
  },
  methods: {
    ...mapMutations('menu', ['setMenuCollapse', 'clearMenus']),
    handleCollapse () {
      this.setMenuCollapse({
        whitespace: !this.menuCollapse.isCollapse ? 200 : 65,
        fadeIn: this.menuCollapse.fadeIn === 'fadeOut' ? 'fadeIn' : 'fadeOut',
        isCollapse: !this.menuCollapse.isCollapse
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
