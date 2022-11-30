import Vue from 'vue'
import Vuex from 'vuex'
import { close, listMsgByUsername, read } from '@/api/msg/userMsg'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    msg: [],
    stompClient: null,
    reConnectTime: null
  },
  mutations: {},
  actions: {
    reloadMsg (context, msg) {
      // 若去后台重新加载，清空本地的缓存
      context.state.msg = []
      listMsgByUsername().then(rep => {
        debugger
        if (rep.code !== 1) {
          return
        }
        // 去重
        const result = context.state.msg.some(ele => ele.msgCode === rep.data.msgCode)
        if (!result) {
          rep.data.forEach(msg => {
            context.state.msg.push(msg)
          })
        }
      })
    },
    clearMsg (context, msg) {
      context.state.msg = []
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
