import Layout from '@/layout'
export default {
  path: '/attendances', // 路径
  name: 'attendances', // 给路由规则加一个name
  component: Layout, // 组件
  children: [{
    path: '', // 二级路由
    component: () => import('@/views/attendances'),
    meta: {
      title: '考勤管理', icon: 'skill'
    }
  }]
}
