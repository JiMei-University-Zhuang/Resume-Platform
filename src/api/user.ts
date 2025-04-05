import request from '@/utils/request'

export interface LoginParams {
  username: string
  password: string
  captcha_key: string
  captcha_value: string
}
export interface EmailLoginParams {
  email: string
  captchaValue: string
}

export interface RegisterParams {
  username: string
  password: string
  email: string
  captchaValue: string
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
//账号密码登录
export const login = (data: LoginParams): Promise<LoginResult> => {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}
//邮箱登录
export const emailLogin = (data: EmailLoginParams): Promise<LoginResult> => {
  return request({
    url: '/auth/emailLogin',
    method: 'post',
    data
  })
}

//登出
export const logout = () => {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}
//获取验证码
export function getCaptcha(captcha: string) {
  return request({
    url: '/auth/getCaptcha',
    method: 'get',
    responseType: 'blob',
    headers: {
      captcha
    }
  })
}

//获取验证码键
export function getCaptchaKey() {
  return request({
    url: '/auth/prepareCode',
    method: 'get'
  })
}

//发送邮箱验证码（邮箱登录）
export function sendEmailCaptchaValue(data: { email: string }) {
  return request({
    url: '/auth/loginSend',
    method: 'post',
    data
  })
}

//发送邮箱验证码（邮箱注册）
export function sendRegisterEmailCaptchaValue(data: { email: string }) {
  return request({
    url: '/auth/registerSend',
    method: 'post',
    data
  })
}

//邮箱注册
export function register(data: RegisterParams) {
  return request({
    url: 'auth/emailRegister',
    method: 'post',
    data
  })
}
//获取用户信息
export function getUserInfo() {
  return request({
    url: '/auth/userInfo',
    method: 'get'
  })
}

// 定义getUser接口的响应数据类型
export interface GetUserResult {
  id: string
  username: string
  password: string
  name: string
  sex: number
  avatar: string
  email: string
  telephone: string
  enabled: number
  role: string
  createTime: string
  token: string
}
export function getUser() {
  return request({
    url: '/auth/getUser',
    method: 'post',
    headers: {
      Authorization: `${localStorage.getItem('token')}`
    }
  })
}
