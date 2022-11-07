<template>
  <el-submenu v-if="menu.children && menu.children.length > 0" :index="menu.id" :popper-append-to-body=false>
    <template slot="title">
      <svg-icon :icon-name="menu.icon" style="font-size: 20px;"/>
      <span slot="title">{{ menu.title }}</span>
    </template>
    <menu-item v-for="item in menu.children" :key="item.id" :menu="item"></menu-item>
  </el-submenu>

  <el-menu-item v-else-if="menu && menu.href===0" :index="menu.name">
    <svg-icon :icon-name="menu.icon" style="font-size: 20px;"/>
    <span slot="title">{{ menu.title }}</span>
  </el-menu-item>
  <el-menu-item v-else-if="menu && menu.href===1">
    <el-link :href="menu.path" style="color: #ffffff;" target="_blank" type="info">
      <svg-icon :icon-name="menu.icon" style="font-size: 20px;"/>
      <span>{{ menu.title }}</span>
    </el-link>
  </el-menu-item>
</template>

<!--
   <el-submenu
    v-for="item in menus"
    :key="item.id"
    :index="item.id">
    <template slot="title">
      <svg-icon :icon-name="item.icon" style="font-size: 20px;"/>
      <span slot="title">{{ item.title }}</span>
    </template>
    <el-menu-item
      v-for="subItem in item.children"
      :key="subItem.id"
      :index="subItem.name">
      <svg-icon :icon-name="subItem.icon" style="font-size: 20px;"/>
      <span slot="title">{{ subItem.title }}</span>
    </el-menu-item>
  </el-submenu>
-->

<script>
import MenuItem from '@/components/home/MenuItem'

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

<style lang="less" scoped>

</style>
