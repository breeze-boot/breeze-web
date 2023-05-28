import { mapGetters } from 'vuex'

const dict = {
  data () {
    return {
      dictCode: []
    }
  },
  created () {
    // 获取字典
    if (this.dictCode.length === 0) {
      return
    }
    this.$loadDict(this.dictCode).then((dict) => {
      console.debug('加载完成字典', dict)
    })
  },
  methods: {
    ...mapGetters('dict', ['dict', 'descriptions', 'column'])
  }
}

export default dict
