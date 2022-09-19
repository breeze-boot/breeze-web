<template>
  <el-tabs
    v-model="editableTabsValue"
    closable
    type="card"
    @tab-remove="removeTab">
    <el-tab-pane
      v-for="(item, index) in editableTabs"
      :key="index"
      :label="item.title"
      :name="item.name">
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Tabs',
  data () {
    return {
      tabIndex: 1
    }
  },
  computed: {
    ...mapState('menu', ['editableTabsValue', 'editableTabs'])
    // editableTabsValue: {
    //   get () {
    //     return this.$store.state.menu.editableTabsValue
    //   },
    //   set (editableTabsValue) {
    //     this.$router.push(editableTabsValue)
    //     this.$store.state.menu.editableTabsValue = editableTabsValue
    //   }
    // },
    // editableTabs: {
    //   get () {
    //     return this.$store.state.menu.editableTabs
    //   },
    //   set (editableTabs) {
    //     this.$store.state.menu.editableTabs = editableTabs
    //   }
    // }
  },
  methods: {
    removeTab (targetName) {
      debugger
      if (targetName === 'welcome') {
        return
      }
      const tabs = this.editableTabs
      let activeName = this.editableTabsValue
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
      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName)
    }
  }
}
</script>
<style lang="less" scoped></style>
