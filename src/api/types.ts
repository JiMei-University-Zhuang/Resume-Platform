// API 响应的通用接口
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

// 登录参数接口
export interface LoginParams {
  username: string
  password: string
  captcha?: string
}

// 用户信息接口
export interface UserInfo {
  id: number
  username: string
  avatar?: string
  roles: string[]
}
