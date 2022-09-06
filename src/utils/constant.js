import Vue from 'vue'

export const DIALOG_TYPE = {
  ADD: {
    desc: '添加',
    value: 0
  },
  EDIT: {
    desc: '修改',
    value: 1
  },
  SHOW: {
    desc: '展示',
    value: 2
  }
}

export const confirmAlert = (func) => {
  Vue.prototype.$confirm('是否删除', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    func()
  }).catch(() => {
    this.$message({
      type: 'info',
      message: '已取消删除'
    })
  })
}
