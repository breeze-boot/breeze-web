import { mapGetters } from 'vuex'

const dict = {
  data () {
    return {
      dictCode: []
    }
  },
  created () {
    this.$toLoadDict(this.dictCode).then((dict) => {
      console.info(dict)
    })
  },
  methods: {
    ...mapGetters('dict', ['getDict', 'getDescriptionsDictLabel', 'getTableDictLabel'])
  }
}

export default dict
