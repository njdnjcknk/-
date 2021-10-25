import Layout from '@/layout'
export default {
  path: '/approvals', // 路径
  name: 'approvals', // 给路由规则加一个name
  component: Layout, // 组件
  children: [{
    path: '', // 二级路由
    component: () => import('@/views/approvals'),
    meta: {
      title: '审批管理', icon: 'tree-table'
    }
  }]
}
