<template>
  <i v-if="iconName && iconName.startsWith('el-icon')" :class="iconName"></i>
  <svg v-else :style="iconStyle" aria-hidden="true" class="icon">
    <use :xlink:href="`#icon-${iconName}`" class="icon"/>
  </svg>
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

<style scoped>
.icon {
  width: 1em;
  height: 1em;
  margin-left: 2px;
  margin-right: 7px;
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
}
</style>
