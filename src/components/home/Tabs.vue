<template>
  <div>
    <el-tabs
      v-model="currentTabValue"
      @tab-click="handleTabClick"
      @tab-remove="removeTab">
      <el-tab-pane
        v-for="(tab, index) in dynamicTabs"
        :key="tab.name + index"
        :closable="tab.name !== 'welcome'"
        :label="tab.title"
        :name="tab.name">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import router from '@/router'

export default {
  name: 'Tabs',
  data () {
    return {}
  },
  computed: {
    currentTabValue: {
      get () {
        return this.$store.getters['tabs/getCurrentTabValue']
      },
      set (currentTabValue) {
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
    /**
     * Tab点击切换事件
     *
     * @param tab
     */
    handleTabClick (tab) {
      router.push({ name: tab.name })
    },
    /**
     * 删除Tab
     *
     * @param targetName
     */
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
<style lang="scss" scoped></style>
