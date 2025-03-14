import request from '@/utils/request'

export interface LoginParams {
  username: string
  password: string
  captcha_key: string
  captcha_value: string
}

export interface LoginResult {
  code: number
  msg?: string
  data: {
    token: string
    user: {
      id: number
      username: string
      avatar?: string
      roles: string[]
    }
  }
}

export const login = (data: LoginParams): Promise<LoginResult> => {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export const logout = () => {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
} 