import { defineStore } from 'pinia'

interface UserInfo {
  id: string
  username: string
  password?: string
  name: string
  avatar: string
  email: string
  enabled: number
  role: string
  createTime: string
  token: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {
      id: '',
      username: '',
      name: '',
      avatar: '',
      email: '',
      enabled: 1,
      role: '',
      createTime: '',
      token: ''
    } as UserInfo,
    isLoggedIn: false
  }),

  getters: {
    getUserInfo: state => state.userInfo,
    getUsername: state => state.userInfo.username || 'guest'
  },

  actions: {
    setUserInfo(user: UserInfo) {
      this.userInfo = user
      this.isLoggedIn = true

      // 更新localStorage中的token
      if (user.token) {
        localStorage.setItem('token', user.token)
      }
    },

    clearUserInfo() {
      this.userInfo = {
        id: '',
        username: '',
        name: '',
        avatar: '',
        email: '',
        enabled: 1,
        role: '',
        createTime: '',
        token: ''
      }
      this.isLoggedIn = false

      // 清除localStorage中的token
      localStorage.removeItem('token')
    }
  }
})
