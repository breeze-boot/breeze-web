<template>
  <el-container>
    <el-menu
      router
      class="el-menu-vertical"
      :collapse="!this.isCollapse"
      :collapse-transition="true"
      :default-active="this.getCurrentTagValue"
      active-text-color="#ffd04b"
      background-color="#093f6b"
      :unique-opened="true"
      style="border-right: 1px solid #093f6b"
      text-color="#fff"
      @close="handleClose"
      @open="handleOpen">
      <div class="logo" :style="{minWidth: this.collapseWhitespace  + 'px'}">
        <img :style="{animationName: this.fadeIn, animationDuration: 0 + 's'}" alt=""
             src="../../assets/logo.png"/>
        <span v-show="this.isCollapse">通用管理系统</span>
      </div>
      <el-menu-item
        key="0"
        index="welcome">
        <i class="el-icon-s-home"></i>
        <span slot="title">欢迎</span>
      </el-menu-item>
      <menu-item v-for="menu in this.menus"
                 :key="menu.id"
                 :menu="menu"/>
    </el-menu>
  </el-container>
</template>

<script>

import MenuItem from '@/components/home/MenuItem'
import { mapGetters } from 'vuex'

export default {
  name: 'Menu',
  components: {
    MenuItem
  },
  data () {
    return {}
  },
  computed: {
    // 使用 mapState
    // ...mapState('menu', ['isCollapse', 'menus'])
    // 使用 mapGetters
    ...mapGetters('menu', ['isCollapse', 'menus', 'fadeIn', 'collapseWhitespace', 'getCurrentTagValue'])

    // isCollapse: {
    //   get () {
    //     return this.$store.state.menu.isCollapse
    //   },
    //   set (isCollapse) {
    //     this.$store.state.menu.isCollapse = isCollapse
    //   }
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

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 6vh;
  padding: 0;

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
