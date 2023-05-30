<template>
  <el-container>
    <div :style="{minWidth: this.menuCollapse.whitespace  + 'px'}" class="logo">
      <img :style="{animationName: this.menuCollapse.fadeIn, animationDuration: 0 + 's'}" alt=""
           src="../../assets/logo.png"/>
      <span v-show="this.menuCollapse.isCollapse">{{ title }}</span>
    </div>
  </el-container>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'Logo',
  components: {},
  data () {
    return {
      title: ''
    }
  },
  computed: {
    ...mapState('menu', ['menuCollapse', 'currentMenu'])
  },
  created () {
    this.title = process.env['VUE_APP_TITLE']
  },
  methods: {}
}
</script>

<style lang="scss" scoped>

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  height: 50px;

  span {
    text-align: center;
    width: 67%;
    color: #fff;
    font-size: 1rem;
  }

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
}
</style>
