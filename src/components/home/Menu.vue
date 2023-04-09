<template>
  <el-container>
    <el-menu
      :collapse="!this.menuIsCollapse.isCollapse"
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
      <div :style="{minWidth: this.menuIsCollapse.collapseWhitespace  + 'px'}" class="logo">
        <img :style="{animationName: this.menuIsCollapse.fadeIn, animationDuration: 0 + 's'}" alt=""
             src="../../assets/logo.png"/>
        <span v-show="this.menuIsCollapse.isCollapse">通用管理系统</span>
      </div>
      <el-menu-item
        key="0"
        index="welcome">
        <i class="al-icon iconfont icon-home"/>
        <span slot="title">欢迎</span>
      </el-menu-item>
      <menu-item v-for="menu in this.getMenus"
                 :key="menu.id"
                 :menu="menu"/>
    </el-menu>
  </el-container>
</template>

<script>

import MenuItem from '@/components/home/MenuItem'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Menu',
  components: {
    MenuItem
  },
  data () {
    return {}
  },
  computed: {
    ...mapState('menu', ['menuIsCollapse', 'currentMenu']),
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
  width: 200px;
  min-height: 100vh - 7vh;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  height: 50px;

  span {
    text-align: center;
    width: 67%;
    color: #fff;
    font-size: 1rem;
  }

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
}
</style>
