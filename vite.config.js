import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import viteImagemin from 'vite-plugin-imagemin'
import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite';
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
var __dirname = dirname(fileURLToPath(import.meta.url))
// 根据环境确定是否使用IP地址
var isLocal = process.env.NODE_ENV === 'development'
var apiBaseUrl = isLocal ? 'http://8.130.75.193:8081' : 'https://view.yinhenx.cn'
// https://vite.dev/config/
export default defineConfig({
  // 设置为空字符串或相对路径'.'，以允许使用相对路径部署
  base: process.env.BASE_PATH || './',
  plugins: [
    vue(),
    // 自动导入Vue API，但不再自动导入Element Plus
    AutoImport({
      // Removing Element Plus resolver
      // resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router'],
      dts: 'src/auto-imports.d.ts'
    }),
    // 移除按需导入Element Plus组件
    // Components({
    //     resolvers: [ElementPlusResolver()],
    //     dts: 'src/components.d.ts',
    // }),
    // 图片压缩配置
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 70
      },
      pngquant: {
        quality: [0.7, 0.8],
        speed: 4
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox'
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          }
        ]
      }
    })
  ],
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
        rewrite: function (path) {
          return path.replace(/^\/api/, '')
        }
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
      '/api/record': {
        target: apiBaseUrl,
        changeOrigin: true,
        rewrite: function (path) {
          return path.replace(/^\/api/, '')
        },
        secure: false
      },
      // 其他API - 保留/api前缀
      '^/api': {
        target: apiBaseUrl,
        changeOrigin: true,
        rewrite: function (path) {
          return path.replace(/^\/api/, '')
        },
        secure: false
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1500,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      },
      // 确保不要过度优化变量名，以避免初始化顺序问题
      mangle: {
        keep_classnames: true,
        keep_fnames: true
      }
    },
    // 调整代码分割策略，防止初始化顺序问题
    rollupOptions: {
      output: {
        // 不再使用 manualChunks，改为更简单的分块策略
        manualChunks(id) {
          // 将 element-plus 和 ant-design-vue 打包到同一个文件中，避免依赖冲突
          if (
            id.includes('node_modules/element-plus') ||
            id.includes('node_modules/@element-plus') ||
            id.includes('node_modules/ant-design-vue')
          ) {
            return 'ui-libraries'
          }
          // 基本库打包到 vendor 中
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      },
      // 确保依赖不会被外部化
      external: []
    },
    // 确保文件的正确加载顺序
    assetsInlineLimit: 4096,
    // 添加这个选项以减少代码优化引起的问题
    commonjsOptions: {
      strictRequires: true,
      transformMixedEsModules: true
    }
  }
})
