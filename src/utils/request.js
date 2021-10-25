// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'

import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getTimeStamp } from '@/utils/auth'
const TimeOut = 3600// 定义超时时间

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础的基础地址
  timeout: 5000 // 定义5秒超时
}) // 创建一个axios的实例

// 是否超时
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
function IsCheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}

service.interceptors.request.use(config => {
  if (store.getters.token) {
    // 只有在有token的情况下，才有必要去检查时间戳是否超时
    if (IsCheckTimeOut()) {
      // token超时，退出登录
      store.dispatch('user/logout') // 登出操作
      router.push('/login') // 跳转到登录页
      return Promise.reject(new Error('token超时了'))
    }
    // 如果token存在 注入token
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须返回配置
}, error => {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout') // 调用action封装的退出登录方法
    router.push('/login') // 退出后跳到登录页
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  // axios默认加了一层data
  const { success, message, data } = response.data
  //   要根据success的成功与否决定下面的操作
  if (success) {
    return data
  } else {
    // 业务已经错误了 还能进then ? 不能 ！ 应该进catch
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
}, error => {
  Message.error(error.message) // 提示错误信息
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
})

export default service // 导出axios实例
