import Layout from '@/layout'
export default {
  path: '/salarys', // 路径
  name: 'salarys', // 给路由规则加一个name
  component: Layout, // 组件
  children: [{
    path: '', // 二级路由
    component: () => import('@/views/salarys'),
    meta: {
      title: '工资管理', icon: 'money'
    }
  }]
}
