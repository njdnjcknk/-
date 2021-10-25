// 权限拦截 导航守卫 路由守卫  router
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex store实例
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '/404'] // 定义白名单
// 路由前置守卫的函数包括三个参数
router.beforeEach(async function(to, from, next) {
  NProgress.start()// 开启进度条
  // 从store里取出token
  if (store.getters.token) {
    // 如果有token，要去的地址是登录页
    if (to.path === '/login') {
      // 要去的是登录页
      next('/')// 直接跳转到主页
    } else {
      if (!store.state.user.userInfo.userId) {
        await store.dispatch('user/getUserInfo')
      }

      next() // 直接放行
    }
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) > -1) { // 查找是否在白名单里
      next() // 如果在直接放行
    } else {
      next('/login') // 不在就跳转到登录页
    }
  }
  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})

// 后置守卫
router.afterEach(function() {
  NProgress.done() // 关闭进度条
})
