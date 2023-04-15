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
    ...mapMutations('menu', ['setCurrentMenu', 'setMenuIsCollapse']),
    ...mapMutations('tab', ['setTab']),
    reSize () {
      const width = document.documentElement.clientWidth || document.body.clientWidth
      if (width < 1024) {
        // 设置 VUEX 中的值
        this.setMenuIsCollapse({
          collapseWhitespace: 65,
          fadeIn: 'fadeOut',
          isCollapse: false
        })
      } else {
        // 设置 VUEX 中的值
        this.setMenuIsCollapse({
          collapseWhitespace: 200,
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
      if (to.name !== 'login' && to.name !== 'home' && accessToken) {
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
}
</script>
<style lang="scss">
* {
  padding: 0;
  margin: 0;
}

body, html {
  height: 100%;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-thumb {
  cursor: pointer;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.1);
  transition: color 0.2s ease;
}
</style>
