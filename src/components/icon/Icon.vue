<template>
  <svg v-if="iconName && iconName.startsWith('svg-')" :style="iconStyle" aria-hidden="true" class="svg-icon">
    <use :xlink:href="`#${iconName}`" :fill="iconColor"/>
  </svg>
  <i v-else :class="`iconfont ${iconName}`" :style="iconStyle"></i>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    iconName: {
      type: String,
      default: ''
    },
    iconStyle: {
      type: String,
      default: ''
    },
    iconColor: {
      type: String,
      default: ''
    }
  }
}
</script>
<style scoped>

.svg-icon{
  cursor: pointer;
  text-align: center;
  width: 1.6rem;
  height: 1.6rem;
  vertical-align: middle;
  overflow: hidden;
}

</style>
