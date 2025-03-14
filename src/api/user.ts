import request from '@/utils/request'
import type { IUserPageResponse, IUserQueryParams, IUser } from '@/types/user'

// 用户登录
export function login(data: {
  username: string
  password: string
  captcha_key: string
  captcha_value: string
}) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}
// 用户注册手机号
export function register(data: {
  username: string
  password: string
  name: string
  telephone: string
  captcha_value: string
}) {
  return request({
    url: '/auth/telephoneRegister',
    method: 'post',
    data
  })
}

// 获取当前用户信息
export function getUserInfo() {
  const token = localStorage.getItem('token')
  return request({
    url: '/auth/getUser',
    method: 'post',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

//修改当前登录用户信息
export const editUserInfo = (userData: { id: number; name: string; sex: number }) => {
  const { id, name, sex } = userData
  const data = { id, name, sex }
  return request({
    url: '/auth/editInfo',
    method: 'post',
    data
  })
}

// 用户登出
export function logout() {
  const token = localStorage.getItem('token')
  if (!token) {
    return Promise.reject(new Error('未获取到token，无法进行登出操作'))
  }
  return request({
    url: '/auth/logout',
    method: 'post'
    // headers: {
    //   Authorization: `Bearer ${token}`
    // }
  })
    .then(response => {
      return response
    })
    .catch(error => {
      console.error('登出失败', error)
      throw error
    })
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
