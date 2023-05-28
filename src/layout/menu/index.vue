<template>
  <el-container>
    <el-menu
      :collapse="!this.menuCollapse.isCollapse"
      :collapse-transition="true"
      :default-active="this.currentMenu"
      :unique-opened="true"
      active-text-color="#ffd04b"
      background-color="#093f6b"
      class="el-menu-vertical"
      style="border-right: 1px solid #093f6b"
      text-color="#fff"
      @close="handleClose"
      @open="handleOpen"
      @select="handleRouter">
      <Logo/>
      <el-menu-item
        key="0"
        index="welcome">
        <Icon style="color: #eee !important;" class="iconfont icon-home"/>
        <span slot="title">欢迎</span>
      </el-menu-item>
      <menu-item v-for="menu in this.getMenus"
                 :key="menu.id"
                 :menu="menu"/>
    </el-menu>
  </el-container>
</template>

<script>

import MenuItem from '@/components/menu/MenuItem.vue'
import { mapGetters, mapState } from 'vuex'
import Logo from '@/layout/logo/index.vue'

export default {
  name: 'Menu',
  components: {
    Logo,
    MenuItem
  },
  data () {
    return {}
  },
  computed: {
    ...mapState('menu', ['menuCollapse', 'currentMenu']),
    ...mapGetters('menu', ['getMenus'])
  },
  methods: {
    /**
     * 切换菜单
     *
     * @param name
     */
    handleRouter (name) {
      if (!name) {
        return
      }
      this.$router.push({ name: name })
    },
    /**
     * 打开菜单事件
     *
     * @param key
     * @param keyPath
     */
    handleOpen (key, keyPath) {
    },
    /**
     * 关闭菜单事件
     *
     * @param key
     * @param keyPath
     */
    handleClose (key, keyPath) {
    }
  }
}
</script>

<style lang="scss" scoped>
.el-menu-vertical:not(.el-menu--collapse) {
  width: 100%;
  min-height: calc(100vh - $base-menu-logo-height);
}
</style>
