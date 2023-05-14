<template>
  <div :style="{ height: cardHeight + 'px' }" class="main">
    <slot/>
  </div>
</template>

<script>

export default {
  name: 'Main',
  data () {
    return { cardHeight: 1000 }
  },
  created () {
    this.cardHeight = window.innerHeight - 165
  },
  mounted () {
    this.$nextTick(() => {
      // 监听浏览器高度变化，改变表格高度
      window.onresize = () => {
        this.cardHeight = window.innerHeight - 165
      }
    })
  },
  destroyed () {
    this.$nextTick(() => {
      // 监听浏览器高度变化事件清空
      window.onresize = null
    })
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.main {
  box-shadow: 0 0 5px #d5d5d5;
  padding: 8px 8px;
  border-radius: 2px;
  overflow-y: scroll;
}
</style>
