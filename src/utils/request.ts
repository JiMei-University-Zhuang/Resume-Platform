import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'

// 根据环境确定baseURL
const getBaseURL = () => {
  // 正式环境下使用/api前缀
  if (import.meta.env.PROD) {
    // 判断是否是特定域名
    if (window.location.hostname === 'view.yinhenx.cn') {
      return '/api' // 生产环境使用绝对路径
    }
  }
  return '/api' // 默认情况
}

// 创建 axios 实例
const service = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
  // withCredentials: true
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = globalThis.localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token
      config.headers.token = token
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  error => {
    const { response } = error
    let msg = '请求失败'

    if (response && response.data) {
      msg = response.data.message
    }

    switch (response?.status) {
      case 401:
        // 未授权，跳转到登录页
        globalThis.localStorage.removeItem('token')
        globalThis.location.href = '/login'
        msg = '请重新登录'
        break
      case 403:
        msg = '没有权限访问'
        break
    }

    message.error(msg)
    return Promise.reject(error)
  }
)

export default service
