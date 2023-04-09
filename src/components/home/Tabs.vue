<template>
  <div>
    <el-tabs
      v-model="currentTab"
      v-right-menu
      @tab-click="handleTabClick"
      @tab-remove="handleTabRemove">
      <right-menu/>
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
import rightMenu from '@/components/rightMenu/RightMenu'
import { getParamsAndQueryByName } from '@utils/common'

export default {
  name: 'Tabs',
  components: {
    rightMenu
  },
  data () {
    return {}
  },
  computed: {
    currentTab: {
      get () {
        return this.$store.getters['tab/getCurrentTab']
      },
      set (currentTabValue) {
      }
    },
    dynamicTabs: {
      get () {
        return this.$store.getters['tab/getDynamicTabs']
      },
      set (dynamicTabs) {
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
      const {
        query,
        params
      } = getParamsAndQueryByName(this.$store.getters['tab/getDynamicTabs'], tab.name)
      this.$router.push({
        name: tab.name,
        query: query,
        params: params
      }).then(r => console.debug(r))
    },
    /**
     * 删除Tab
     *
     * @param targetName
     */
    handleTabRemove (targetName) {
      this.$store.dispatch('tab/closeCurrentTab', targetName)
    }
  }
}
</script>
<style lang="scss" scoped></style>
