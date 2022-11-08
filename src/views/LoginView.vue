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
  background: rgba(175, 175, 175, 0.49);
  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, rgb(9, 63, 107), rgba(84, 92, 100, 0.49));
  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, rgb(9, 63, 107), rgba(84, 92, 100, 0.49));
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
