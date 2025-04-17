import request from '@/utils/request'
import type { IUserPageResponse, IUserQueryParams, IUser } from '@/types/user'

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

// 获取用户列表
export function getUserList(data: IUserQueryParams) {
  return request<IUserPageResponse>({
    url: '/user/getList',
    method: 'post',
    data
  })
}

// 添加用户
export function addUser(data: Omit<IUser, 'id' | 'createTime'>) {
  return request<IUser>({
    url: '/user/add',
    method: 'post',
    data
  })
}

// 编辑用户
export function editUser(data: IUser) {
  return request({
    url: '/user/edit',
    method: 'post',
    data
  })
}

//删除用户
export function removeUser(id: string) {
  return request({
    url: '/user/remove',
    method: 'post',
    data: {
      id
    }
  })
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

// 获取指定ID的用户信息
export function getUserById(id: string) {
  return request<IUser>({
    url: '/user/getById',
    method: 'post',
    data: { id }
  })
}
