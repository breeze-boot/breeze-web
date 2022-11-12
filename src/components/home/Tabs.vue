<template>
  <div>
    <el-tabs
      v-model="currentTabValue"
      @tab-remove="removeTab">
      <el-tab-pane
        v-for="(tab, index) in dynamicTabs"
        :key="index"
        :closable="tab.name !== 'welcome'"
        :label="tab.title"
        :name="tab.name">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import router from '@/router'
import { mapState } from 'vuex'

export default {
  name: 'Tabs',
  data () {
    return {}
  },
  computed: {
    ...mapState('menu', ['currentMenu']),
    currentTabValue: {
      get () {
        return this.$store.state.tabs.currentTabValue
      },
      set (currentTabValue) {
        router.push({ name: currentTabValue })
        this.currentMenu = currentTabValue
        this.$store.state.tabs.currentTabValue = currentTabValue
      }
    },
    dynamicTabs: {
      get () {
        return this.$store.state.tabs.dynamicTabs
      },
      set (dynamicTabs) {
        this.$store.state.tabs.dynamicTabs = dynamicTabs
      }
    }
  },
  methods: {
    removeTab (targetName) {
      if (targetName === 'welcome') {
        return
      }
      const tabs = this.dynamicTabs
      let activeName = this.currentTabValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }
      this.$router.push({ name: activeName })
      this.currentTabValue = activeName
      this.dynamicTabs = tabs.filter((tab) => tab.name !== targetName)
    }
  }
}
</script>
<style lang="less" scoped></style>
