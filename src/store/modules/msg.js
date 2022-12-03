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
  mutations: {
    setMsg (state, msgData) {
      msgData.forEach(msg => {
        // 去重
        const result = state.msg.some(ele => ele.msgCode === msg.msgCode)
        if (!result) {
          state.msg.push(msg)
        }
      })
    },
    clearMsg (state) {
      state.msg = []
    },
    closeMsgCard (state, msg) {
      state.msg = state.msg.filter((tempMsg) => tempMsg.msgCode !== msg.msgCode)
    },
    markReadMsgCard (state, msg) {
      state.msg = state.msg.filter((tempMsg) => tempMsg.msgCode !== msg.msgCode)
    }
  },
  actions: {
    reloadMsg (context) {
      // 若去后台重新加载，清空本地的缓存
      context.state.msg = []
      listMsgByUsername().then(rep => {
        if (rep.code !== 1) {
          return
        }
        context.commit('setMsg', rep.data)
      })
    },
    clearMsg (context) {
      context.commit('clearMsg')
      // 更改状态 已关闭
    },
    closeMsgCard (context, msg) {
      // 更改状态
      close(msg.msgCode).then(rep => {
        if (rep.code !== 1) {
          return
        }
        context.commit('closeMsgCard', msg)
      })
    },
    markReadMsgCard (context, msg) {
      // 更改状态
      read(msg.msgCode).then(rep => {
        if (rep.code !== 1) {
          return
        }
        context.commit('markReadMsgCard', msg)
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
