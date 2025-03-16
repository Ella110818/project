import { createStore } from 'vuex'
import api from '@/api'

export default createStore({
  state: {
    token: localStorage.getItem('token') || '',
    userId: localStorage.getItem('userId') || '',
    username: localStorage.getItem('name') || '',
    userRole: localStorage.getItem('userRole') || '',
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true'
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    userRole: state => state.userRole,
    username: state => state.username,
    userId: state => state.userId
  },
  mutations: {
    SET_AUTH(state, { token, userId, username, role }) {
      state.token = token
      state.userId = userId
      state.username = username
      state.userRole = role
      state.isAuthenticated = true

      // 保存到localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('userId', userId)
      localStorage.setItem('name', username)
      localStorage.setItem('userRole', role)
      localStorage.setItem('isAuthenticated', 'true')
    },
    CLEAR_AUTH(state) {
      state.token = ''
      state.userId = ''
      state.username = ''
      state.userRole = ''
      state.isAuthenticated = false

      // 清除localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('name')
      localStorage.removeItem('userRole')
      localStorage.removeItem('isAuthenticated')
    }
  },
  actions: {
    // 登录
    async login({ commit }, loginData) {
      try {
        const response = await api.login(loginData)
        if (response.code === 200) {
          commit('SET_AUTH', {
            token: response.data.token,
            userId: response.data.userId,
            username: response.data.username,
            role: response.data.role
          })
          return Promise.resolve(response)
        } else {
          return Promise.reject(response)
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // 注册
    async register(_, registerData) {
      return await api.register(registerData)
    },

    // 登出
    async logout({ commit }) {
      try {
        await api.logout()
        commit('CLEAR_AUTH')
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },
  modules: {
  }
})
