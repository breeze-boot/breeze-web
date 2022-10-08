<template>
  <el-container>
    <el-menu
      router
      class="el-menu-vertical"
      :collapse="isCollapse"
      :collapse-transition="true"
      :default-active="this.$store.state.menu.editableTabsValue"
      active-text-color="#ffd04b"
      background-color="#545c64"
      :unique-opened="true"
      style="border-right: 1px solid #002a59"
      text-color="#fff"
      @close="handleClose"
      @open="handleOpen">
      <el-menu-item
        key="0"
        index="welcome">
        <i class="el-icon-s-home"></i>
        <span slot="title">欢迎</span>
      </el-menu-item>
      <el-submenu
        v-for="item in menus"
        :key="item.id"
        :index="item.name">
        <template slot="title">
          <i :class="item.icon"></i>
          <span slot="title">{{ item.title }}</span>
        </template>
        <el-menu-item
          v-for="subItem in item.children"
          :key="subItem.id"
          :index="subItem.name">
          <i :class="subItem.icon"></i>
          <span slot="title">{{ subItem.title }}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-container>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'Menu',
  data () {
    return {}
  },
  computed: {
    // 使用mapState
    ...mapState('menu', ['isCollapse', 'menus'])

    // isCollapse: {
    // get () {
    //   return this.$store.state.menu.isCollapse
    // },
    // set (isCollapse) {
    //   this.$store.state.menu.isCollapse = isCollapse
    // }
    // },
    // menus: {
    //   get () {
    //     return this.$store.state.menu.menus
    //   },
    //   set (menus) {
    //     this.$store.state.menu.menus = menus
    //   }
    // }
  },
  methods: {
    handleOpen (key, keyPath) {
    },
    handleClose (key, keyPath) {
    }
  }
}
</script>

<style lang="less" scoped>
.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100vh - 7vh;
}

.el-aside {
  width: fit-content;
}
</style>
