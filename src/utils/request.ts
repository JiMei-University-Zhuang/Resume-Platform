import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const service = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
  // withCredentials: true
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = globalThis.localStorage.getItem('token')
    const newToken = token?.slice(1, token.length - 1)
    if (newToken) {
      config.headers.Authorization = `Bearer ${newToken}`
      config.headers.token = newToken
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  error => {
    const { response } = error
    let message = '请求失败'

    if (response && response.data) {
      message = response.data.message
    }

    switch (response?.status) {
      case 401:
        // 未授权，跳转到登录页
        globalThis.localStorage.removeItem('token')
        globalThis.location.href = '/login'
        message = '请重新登录'
        break
      case 403:
        message = '没有权限访问'
        break
      case 404:
        message = '请求的资源不存在'
        break
      case 500:
        message = '服务器内部错误'
        break
    }

    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default service
