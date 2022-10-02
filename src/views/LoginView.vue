<template>
  <div class="login">
    <UserLogin/>
  </div>
</template>

<script>
import UserLogin from '@/components/UserLogin.vue'

export default {
  name: 'LoginView',
  components: {
    UserLogin
  },
  mounted () {
  },
  methods: {}
}
</script>

<style scoped>

.login {
  background: #5D4157;
  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #A8CABA, #5D4157);
  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #A8CABA, #5D4157);
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  background-size: 400%;
  animation: backdiv 12s infinite;
  height: 100vh;
  width: 100vw;
  position: relative;
}

@keyframes back_div {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>
