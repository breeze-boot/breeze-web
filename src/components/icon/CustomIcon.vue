<template>
  <svg v-if="iconName && iconName.startsWith('svg-')" :style="iconStyle" aria-hidden="true" class="svg-icon">
    <use :xlink:href="`#${iconName}`"/>
  </svg>
  <span v-else :class="`al-icon iconfont ${iconName}`" :style="iconStyle"></span>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    iconName: {
      type: String,
      default: ''
    },
    iconStyle: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-icon {
  text-align: center;
  padding: 0 4px;
  width: 1.6rem;
  height: 1.6rem;
  margin-right: 6px;
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
}

// 局部样式
.al-icon {
  color: #282828 !important;
  font-size: 1.4rem;
  width: 2rem;
  height: 2rem;
}
</style>
