<template>
  <el-container>
    <el-aside class="left-aside">
      <Menu/>
    </el-aside>
    <el-container>
      <el-header>
        <Header/>
      </el-header>
      <el-main style="padding: 1px 20px;">
        <div class="tag" @mousewheel="wheel">
          <Tag/>
          <Tabs/>
        </div>
        <keep-alive :include="keepAlive">
          <router-view
            :key="key"
            :style="{animationName: 'fadIn', animationDuration: 1 + 's'}"
            class="router-main"/>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Header from '@/components/home/Header'
import Menu from '@/components/home/Menu'
import Tabs from '@/components/home/Tabs'
import Tag from '@/components/home/Tag'

export default {
  name: 'HomeView',
  components: {
    Tabs,
    Tag,
    Header,
    Menu
  },
  data () {
    return {}
  },
  computed: {
    keepAlive () {
      return this.$store.state.menu.keepAliveMenus
    },
    key () {
      return this.$route.fullPath
    }
  },
  mounted () {
  },
  methods: {
    wheel (e) {
      const a = document.getElementById('tag')
      const scrollWidth = 100
      let flag
      e.wheelDelta ? flag = e.wheelDelta : flag = e.detail
      if (flag > 3 || -flag > 3) flag = -flag
      flag > 0 ? a.scrollLeft += scrollWidth : a.scrollLeft -= scrollWidth
      e.preventDefault()
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  padding: 0;
  color: #333;
}

.left-aside {
  box-shadow: 5px 0 5px -5px rgb(112, 109, 109);
  background: #093f6b;
  height: 100vh;
  width: fit-content !important;
}

.router-main {
  height: 83vh;
  box-shadow: 1px 1px 5px #eee;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0);
  border-radius: 0;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 0px;
  height: 0;
}

::-webkit-scrollbar-thumb {
  cursor: pointer;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0);
  transition: color .2s ease;
}
</style>
