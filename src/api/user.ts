import request from '@/utils/request'
import type { IUserPageResponse, IUserQueryParams, IUser } from '@/types/user'

// 用户登录
export function login(data: { username: string; password: string; captcha:string }) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}
// 用户注册
export function register(data: { username: string; password: string; name: string; telephone: string; captcha: string }) {
  return request({
    url: '/auth/telephoneRegister',
    method: 'post',
    data
  });
}

// 获取当前用户信息
export function getUserInfo() {
  // var token = localStorage.getItem('token')
  return request({
    url: '/auth/getUser',
    method: 'post',
    // headers: {
    //   'token': token // 从本地存储获取 token
    // }
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
    // headers: {
    //   'token': localStorage.getItem('token') || '' // 从本地存储获取 token
    // },
    data
  })
}

  // 编辑用户
  export function editUser(data: Partial<IUser> & { id: string }) {
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
  export function getCaptcha() {
    return request({
      url: '/auth/getCaptcha',
      method: 'get',
    })
  }