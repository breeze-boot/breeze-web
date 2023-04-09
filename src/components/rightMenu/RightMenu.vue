<!-- 自定义鼠标右键菜单 -->
<template>
  <div
    :style="{display: this.$store.getters['rightMenu/getDisplay'],  left: this.$store.getters['rightMenu/getLeft'] }"
    class="right_menu">
    <div v-for="(item, index) in rightMenuList" :key="index" @click="item.handler">
      {{ item.text }}
    </div>
  </div>
</template>

<script>

import store from '@/store'

export default {
  name: 'rightMenu',
  props: {},
  data () {
    return {
      rightMenuList: [
        {
          text: '关闭全部',
          handler: () => {
            this.$store.dispatch('tab/closeAllTab')
          }
        },
        {
          text: '关闭左边',
          handler: () => {
            this.$store.dispatch('tab/closeLeftTab', this.$store.getters['rightMenu/getClickTabName'])
          }
        },
        {
          text: '关闭右边',
          handler: () => {
            this.$store.dispatch('tab/closeRightTab', this.$store.getters['rightMenu/getClickTabName'])
          }
        },
        {
          text: '关闭当前',
          handler: () => {
            this.$store.dispatch('tab/closeCurrentTab', this.$store.getters['rightMenu/getClickTabName'])
          }
        }
      ]
    }
  },
  mounted () {
    /**
     * 鼠标点击其他位置时隐藏菜单
     */
    document.onclick = function () {
      store.commit('rightMenu/setDisplay', 'none')
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.right_menu {
  padding: 5px 0;
  position: fixed;
  z-index: 99999;
  width: 150px;
  background: #FFFFFF;
  border-radius: 3px;
  box-shadow: 0 0 2px rgba(206, 206, 206, 0.32);

  div {
    height: 30px;
    line-height: 30px;
    background: #FFFFFF;
    color: rgb(77, 62, 62);
    font-size: 12px;
    text-align: center;
    cursor: pointer;
  }

  div:hover {
    border-radius: 3px;
    background: rgba(24, 144, 255, 0.72);
  }

}
</style>
