import Vue from 'vue'
import Vuex from 'vuex'
import { close, listMsgByUsername, read } from '@/api/sys/userMsg'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    msg: [],
    stompClient: null,
    reConnectTime: null
  },
  mutations: {
    /**
     * 存储消息
     *
     * @param state
     * @param msgData
     */
    setMsg (state, msgData) {
      msgData.forEach(msg => {
        // 去重
        const result = state.msg.some(ele => ele.msgCode === msg.msgCode)
        if (!result) {
          state.msg.push(msg)
        }
      })
    },
    /**
     * 清空消息
     *
     * @param state
     */
    clearMsg (state) {
      state.msg = []
    },
    /**
     * 关闭消息卡片
     *
     * @param state
     * @param msg
     */
    closeMsgCard (state, msg) {
      state.msg = state.msg.filter((tempMsg) => tempMsg.msgCode !== msg.msgCode)
    },
    /**
     * 标记消息已读
     *
     * @param state
     * @param msg
     */
    markReadMsgCard (state, msg) {
      state.msg = state.msg.filter((tempMsg) => tempMsg.msgCode !== msg.msgCode)
    }
  },
  actions: {
    reloadMsg (context) {
      return new Promise((resolve, reject) => {
        // 若去后台重新加载，清空本地的缓存
        context.state.msg = []
        listMsgByUsername().then(response => {
          if (response.code !== 1) {
            return
          }
          context.commit('setMsg', response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    clearMsg (context) {
      context.commit('clearMsg')
      // 更改状态 已关闭
    },
    closeMsgCard (context, msg) {
      // 更改状态
      close(msg.msgCode).then(response => {
        if (response.code !== 1) {
          return
        }
        context.commit('closeMsgCard', msg)
      })
    },
    markReadMsgCard (context, msg) {
      // 更改状态
      read(msg.msgCode).then(response => {
        if (response.code !== 1) {
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
      return []
    }
  }
}
