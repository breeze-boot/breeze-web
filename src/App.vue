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
    ...mapMutations('tag', ['setTag', 'setCurrentTagValue']),
    ...mapMutations('menu', ['setCurrentMenu', 'setMenuIsCollapse']),
    ...mapMutations('tabs', ['setTab', 'setCurrentTabValue']),
    reSize () {
      debugger
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
      // document.getElementsByTagName('html')[0].style['font-size'] = 18 + 'px'
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
        const menu = {
          name: to.name,
          title: to.meta.title,
          hidden: to.meta.hidden
        }
        this.setTab(menu)
        this.setTag(menu)
        this.setCurrentMenu(menu)
        this.setCurrentTabValue(to.name)
        this.setCurrentTagValue(to.name)
      }
    }
  }
}
</script>
<style lang="less">
* {
  padding: 0;
  margin: 0;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, .1);
  border-radius: 0;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  cursor: pointer;
  border-radius: 5px;
  background: rgba(0, 0, 0, .15);
  transition: color .2s ease;
}
</style>
