import Layout from '@/layout'
export default {
  path: '/employees', // 路径
  name: 'employees', // 给路由规则加一个name
  component: Layout, // 组件
  children: [{
    path: '', // 二级路由
    component: () => import('@/views/employees'),
    meta: {
      title: '员工管理', icon: 'people'
    }
  }, {
    path: '/employees/detail/:id',
    component: () => import('@/views/employees/detail'),
    hidden: true, // 不在左侧菜单显示
    meta: {
      title: '员工详情'
    }
  }, {
    path: '/employees/print/:id',
    component: () => import('@/views/employees/components/print'),
    hidden: true, // 不在左侧菜单显示
    meta: {
      title: '员工打印',
      icon: 'people'
    }
  }]
}
