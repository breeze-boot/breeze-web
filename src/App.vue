<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'App',
  data () {
    return {}
  },
  methods: {
    ...mapMutations('menu', ['setCurrentMenu', 'setMenuCollapse']),
    ...mapMutations('tab', ['setTab']),
    reSize () {
      const width = document.documentElement.clientWidth || document.body.clientWidth
      if (width < 1024) {
        // 设置 VUEX 中的值
        this.setMenuCollapse({
          whitespace: 65,
          fadeIn: 'fadeOut',
          isCollapse: false
        })
      } else {
        // 设置 VUEX 中的值
        this.setMenuCollapse({
          whitespace: 200,
          fadeIn: 'fadeIn',
          isCollapse: true
        })
      }
    }
  },
  mounted () {
    window.onresize = () => {
      // 当页面尺寸改变的时候生效
      return this.reSize()
    }
  },
  destroyed () {
  },
  created () {
  },
  watch: {
    /**
     * 监听
     * @param to
     * @param from
     */
    $route (to, from) {
      const accessToken = localStorage.getItem('access_token')
      if (to.name === 'login' || to.name === 'layout' || !accessToken) {
        return
      }
      const matched = this.$route.matched
      console.log(matched)
      const params = {
        name: to.name,
        title: to.meta.title,
        hidden: to.meta.hidden,
        query: this.$route.query,
        params: this.$route.params
      }
      this.setTab(params)
      this.setCurrentMenu(params)
    }
  }
}
</script>
<style lang="scss">
</style>
