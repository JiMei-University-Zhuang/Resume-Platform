import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// 根据环境确定是否使用IP地址
const isLocal = process.env.NODE_ENV === 'development'
const apiBaseUrl = isLocal ? 'http://8.130.75.193:8081' : 'https://view.yinhenx.cn'

// https://vite.dev/config/
export default defineConfig({
  // 设置为空字符串或相对路径'.'，以允许使用相对路径部署
  base: process.env.BASE_PATH || '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'element-plus/es': path.resolve(__dirname, 'node_modules/element-plus/es')
    }
  },
  server: {
    host: true,
    port: 8081,
    proxy: {
      // 特定路径的代理规则
      '^/api/chat': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
        // Vite v6.1.0 不支持 priority 属性
      },
      '/api/practice': {
        target: apiBaseUrl,
        changeOrigin: true,
        rewrite: function (path) {
          return path.replace(/^\/api/, '')
        },
        secure: false
      },
      '/api/exam': {
        target: apiBaseUrl,
        changeOrigin: true,
        rewrite: function (path) {
          return path.replace(/^\/api/, '')
        },
        secure: false
      },
      // 其他API - 保留/api前缀
      '^/api/(?!auth|chat)': {
        target: apiBaseUrl,
        changeOrigin: true,
        rewrite: path => path,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('其他API请求:', req.method, req.url, '->', options.target + proxyReq.path)
          })

          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('其他API响应:', proxyRes.statusCode, req.url)

            // 添加CORS头
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, token')
            res.setHeader('Access-Control-Allow-Credentials', 'true')

            if (req.method === 'OPTIONS') {
              res.statusCode = 200
            }
          })

          proxy.on('error', (err, req, res) => {
            console.error('其他API代理错误:', err)
          })
        }
      }
    }
  },
  
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      external: ['element-plus/es/element-plus']
    }
  }
})
