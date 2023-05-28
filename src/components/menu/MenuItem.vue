<template>
  <el-submenu v-if="menu.children && menu.children.length > 0" :index="menu.id">
    <template slot="title">
      <Icon style="color: #eee !important;" :class="`iconfont ${menu.icon}`"/>
      <span slot="title">{{ menu.title }}</span>
    </template>
    <menu-item v-for="item in menu.children" :key="item.id" :menu="item"></menu-item>
  </el-submenu>

  <el-menu-item v-else-if="menu && menu.href===0" :index="menu.name">
    <Icon style="color: #eee !important;" :class="`iconfont ${menu.icon}`"/>
    <span slot="title">{{ menu.title }}</span>
  </el-menu-item>

  <el-menu-item v-else-if="menu && menu.href===1">
    <el-link :href="menu.path" style="color: #ffffff;" target="_blank" type="info">
      <Icon style="color: #eee !important;" :class="`iconfont ${menu.icon}`"/>
      <span>{{ menu.title }}</span>
    </el-link>
  </el-menu-item>
</template>

<script>
import MenuItem from '@/components/menu/MenuItem'

export default {
  name: 'MenuItem',
  components: {
    MenuItem
  },
  props: {
    menu: {
      type: Object,
      required: true
    },
    isCollapse: {
      type: Boolean,
      required: false
    }
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>

</style>
