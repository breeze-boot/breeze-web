import Vue from 'vue'

export const ROOT = '1111111111111111111'
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

/**
 * 根据子节点查找父节点属性
 *
 * @param treeData 原始数据
 * @param func 比较方式
 * @param filed 要收集起来的属性字段
 * @param result 结果集
 */
export const filterTreeParentId = (treeData, func, filed = '', result = []) => {
  if (!treeData) return []
  for (const tree of treeData) {
    filed !== '' ? result.push(tree[filed]) : result.push(tree)
    if (func(tree)) return result
    if (tree.children) {
      const children = filterTreeParentId(tree.children, func, filed, result)
      if (children.length) {
        return children
      }
    }
    result.pop()
  }
  return []
}

/**
 * 过滤树形结构数据
 *
 * @param treeData
 * @param result
 * @param func
 * @returns {*[]}
 */
export function filterTree (treeData, result = [], func = {}) {
  if (!treeData.length) return []
  for (const tree of treeData) {
    // 跳出条件
    if (func(tree)) {
      continue
    }
    const temp = {
      ...tree,
      children: []
    }
    result.push(temp)
    if (tree.children && tree.children.length > 0) {
      filterTree(tree.children, temp.children, (tree) => !tree.children && tree.hidden === 1)
    }
  }
  return result
}
