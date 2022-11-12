<template>
  <div>
    <el-tabs
      v-model="currentTabValue"
      closable
      @tab-remove="removeTab">
      <el-tab-pane
        v-for="(item, index) in dynamicTabs"
        :key="index"
        :label="item.title"
        :name="item.name">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

export default {
  name: 'Tabs',
  data () {
    return {}
  },
  computed: {
    currentTabValue: {
      get () {
        return this.$store.state.menu.currentTabValue
      },
      set (currentTabValue) {
        debugger
        this.$router.push(currentTabValue)
        this.$store.state.menu.currentTabValue = currentTabValue
      }
    },
    dynamicTabs: {
      get () {
        return this.$store.state.menu.dynamicTabs
      },
      set (dynamicTabs) {
        debugger
        this.$store.state.menu.dynamicTabs = dynamicTabs
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
