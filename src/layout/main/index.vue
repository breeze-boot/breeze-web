<template>
  <div>
    <!-- Tab区域 -->
    <Tags v-if="this.$store.getters['settings/getType'] === 'tag'"/>
    <Tabs v-else/>
    <!-- 内容区域 -->
    <keep-alive :include="this.$store.state.menu.keepAliveMenus">
      <transition name="el-fade-in-linear">
        <router-view :key="this.$route.fullPath"/>
      </transition>
    </keep-alive>
  </div>
</template>

<script>
import Tabs from '@/layout/tab/index.vue'
import Tags from '@/layout/tag/Index.vue'

export default {
  name: 'Home',
  components: {
    Tabs,
    Tags
  },
  data () {
    return {
      notifications: {}
    }
  },
  created () {
  },
  destroyed () {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
</style>
