export interface LoginForm {
  username: string
  password: string
  captcha_key: string
  captcha_value: string
}

export interface LoginResult {
  code: number
  message: string
  data: {
    token: string
  }
}

export interface UserInfo {
  id: number
  username: string
  email: string
  avatar: string
  role: string
  created_at: string
  updated_at: string
}

export interface UserResponse {
  code: number
  message: string
  data: UserInfo
}
