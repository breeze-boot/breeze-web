import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    msg: [],
    stompClient: null,
    reConnectTime: null
  },
  mutations: {
    pushMsg (state, msg) {
      // 去重
      const result = state.msg.some(ele => ele.msgCode === msg.msgCode)
      if (!result) {
        state.msg.push(msg)
      }
    }
  },
  actions: {
    clearMsg (state) {
      state.msg = []
      // 清除 redis 的数据
      // 更改状态 已关闭
    },
    closeMsgCard (context, msg) {
      debugger
      const result = context.state.msg.filter((tempMsg) => tempMsg.msgCode !== msg.msgCode)
      context.state.msg = result
    }
  },
  getters: {
    getMsg (state) {
      if (state.msg) {
        return state.msg
      }
    }
  }
}
