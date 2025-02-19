import request from '@/utils/request'
import type { IUserPageResponse, IUserQueryParams, IUser } from '@/types/user'

// 用户登录
export function login(data: { username: string; password: string }) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    // url: '/user/info',
    // method: 'get'
    url: '/auth/getUser',
    method: 'post'
  })
}

// 用户登出
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
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
    headers: {
      'token': localStorage.getItem('token') || '' // 从本地存储获取 token
    },
    data
  })
}

// 编辑用户
export function updateUser(data: Partial<IUser> & { id: string }) {
  return request({
    url: '/user/edit',
    method: 'post',
    data
  })
}
