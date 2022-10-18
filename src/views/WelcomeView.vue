<template>
  <div class="welcome">
    欢迎
    <svg aria-hidden="true" width="2em" height="2em">
      <use :xlink:href="'#icon-abc12312312'"/>
    </svg>
  </div>
</template>

<script>

export default {
  name: 'WelcomeView'
}
</script>

<style lang="less" scoped>
.welcome {
  height: 90vh;
}
</style>
