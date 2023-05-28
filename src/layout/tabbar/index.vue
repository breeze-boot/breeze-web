<template>
  <div class="header">
    <div class="breadcrumb">
      <breadcrumb/>
    </div>
    <div class="setting">
      <setting/>
    </div>
  </div>
</template>

<script>
import breadcrumb from '@/layout/tabbar/breadcrumb/index.vue'
import setting from '@/layout/tabbar/setting/index.vue'

export default {
  name: 'Header',
  components: {
    breadcrumb,
    setting
  },
  data () {
    return {}
  },
  computed: {},
  mounted () {
  },
  created () {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;

  .breadcrumb {
    display: flex;
    align-items: center;
    margin: 0 10px;
  }

  .setting {
    display: flex;
    align-items: center;
  }
}
</style>
