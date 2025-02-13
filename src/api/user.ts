import request from '@/utils/request'
import type { LoginParams, UserInfo, ApiResponse } from './types'

export function login(data: LoginParams) {
  return request<ApiResponse<{ token: string }>>({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request<ApiResponse<UserInfo>>({
    url: '/user/info',
    method: 'get'
  })
}

export function logout() {
  return request<ApiResponse>({
    url: '/auth/logout',
    method: 'post'
  })
}
