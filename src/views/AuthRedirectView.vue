<template>
  <div>
    欢迎登录
  </div>
</template>
<script>

export default {
  name: 'AuthRedirect',
  created () {
    // 解析url 获取 access_token
    const hash = location.hash.slice(2)
    const params = []
    const queryUrl = hash.slice(hash.indexOf('?') + 1)
    const paramArray = queryUrl.split('&')
    for (let i = 0; i < paramArray.length; i++) {
      const kv = paramArray[i].split('=')
      params[kv[0]] = kv[1]
    }
    if (localStorage) {
      console.debug(params)
      localStorage.setItem('B_TENANT_ID', params['tenantId'])
      // 存储 accessToken 用于之后的请求
      this.$store.commit('userInfo/setAccessToken', params['accessToken'])
      // 获取用户信息
      this.$store.dispatch('userInfo/userInfo')
      // 此时已经登录成功，刷新父界面
      this.$router.push({ name: 'welcome' })
    }
  }
}
</script>
