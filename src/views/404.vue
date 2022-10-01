<template>
  <div class="welcome">
    404
    <svg-icon icon-class="abc"></svg-icon>
  </div>
</template>

<script>

import SvgIcon from '@/components/svg/SvgIcon'

export default {
  name: 'WelcomeView',
  components: { SvgIcon }
}
</script>

<style lang="less" scoped>
.welcome {
  height: 90vh;
}
</style>
