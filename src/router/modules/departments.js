import Layout from '@/layout'
export default {
  path: '/departments', // 路径
  name: 'departments', // 给路由规则加一个name
  component: Layout, // 组件
  children: [{
    path: '', // 二级路由
    component: () => import('@/views/departments'),
    meta: {
      title: '组织架构管理', icon: 'tree'
    }
  }]
}
