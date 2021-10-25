import Layout from '@/layout'
export default {
  path: '/settings', // 路径
  name: 'settings', // 给路由规则加一个name
  component: Layout, // 组件
  children: [{
    path: '', // 二级路由
    component: () => import('@/views/settings'),
    meta: {
      title: '公司设置', icon: 'setting'
    }
  }]
}
