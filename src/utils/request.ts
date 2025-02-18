import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = globalThis.localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      config.headers.token = token
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response

    return data.data
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
    }

    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default service
