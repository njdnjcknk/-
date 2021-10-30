import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
// 引入登录接口
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
// 状态
const state = {
  token: getToken(), // 设置token初始状态   token持久化 => 放到缓存中
  userInfo: {} // 定义一个空对象

}
// 修改状态
const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token // 设置token  只是修改state的数据  123 =》 1234
    // vuex变化 => 缓存数据
    setToken(token) // vuex和 缓存数据的同步
  },
  // 删除缓存
  removeToken(state) {
    state.token = null // 删除vuex的token
    removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  },
  // 设置用户信息
  setUserInfo(state, userInfo) {
    state.userInfo = { ...userInfo } // 用 浅拷贝的方式去赋值对象 因为这样数据更新之后，才会触发组件的更新
  },
  // 删除用户信息
  reomveUserInfo(state) {
    state.userInfo = {}
  }
}

// 执行异步
const actions = {
  // 定义login actions也需要参数
  async login(context, data) {
    const result = await login(data) // 实际上就是一个promise  result就是执行的结果
    // axios默认给数据加了一层data

    // actions 修改state 必须通过mutations
    context.commit('setToken', result)
    // 写入时间戳
    setTimeStamp()
  },
  // 获取用户资料action
  async getUserInfo(context) {
    const result = await getUserInfo() // 获取用户基本资料的返回值
    const baseInfo = await getUserDetailById(result.userId) // 为了获取头像
    context.commit('setUserInfo', { ...result, ...baseInfo }) // 将整个的个人信息设置到用户的vuex数据中
    return result // 这里为什么要返回 为后面埋下伏笔
  },
  logout(context) {
    context.commit('removeToken') // 删除用户token
    context.commit('reomveUserInfo') // 删除用户数据
    //重置路由
  // 重置路由
  resetRouter()
  // 还有一步  vuex中的数据是不是还在
  // 要清空permission模块下的state数据
  // vuex中 user子模块  permission子模块
  // 子模块调用子模块的action  默认情况下 子模块的context是子模块的
  // 父模块 调用 子模块的action
  context.commit('permission/setRouter', [], { root: true })
  // 子模块调用子模块的action 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
  }
}

export default {
  namespaced: true,
  // 变量名和方法名一致时，可以时用对象简写形式
  state,
  mutations,
  actions
}
