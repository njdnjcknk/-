import Layout from '@/layout'
export default {
  path: '/socials', // 路径
  name: 'socials', // 给路由规则加一个name
  component: Layout, // 组件
  children: [{
    path: '', // 二级路由
    component: () => import('@/views/socials'),
    meta: {
      title: '社保管理', icon: 'table'
    }
  }]
}
