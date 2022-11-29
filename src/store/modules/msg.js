import Vue from 'vue'
import Vuex from 'vuex'
import { close, read } from '@/api/msg/userMsg'

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
      // 更改状态
      close(msg.msgCode).then(rep => {
        if (rep.code !== 1) {
          return
        }
        context.state.msg = context.state.msg.filter((tempMsg) => tempMsg.msgCode !== msg.msgCode)
      })
    },
    markReadMsgCard (context, msg) {
      // 更改状态
      read(msg.msgCode).then(rep => {
        if (rep.code !== 1) {
          return
        }
        context.state.msg = context.state.msg.filter((tempMsg) => tempMsg.msgCode !== msg.msgCode)
      })
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
