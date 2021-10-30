import Layout from '@/layout'
export default {
  path: '/permissions', // 路径
  name: 'permissions', // 给路由规则加一个name
  component: Layout, // 组件
  children: [{
    path: '', // 二级路由
    name:'permissions',
    component: () => import('@/views/permissions'),
    meta: {
      title: '权限管理', icon: 'lock'
    }
  }]
}
