import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import viteImagemin from 'vite-plugin-imagemin'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import fs from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

// 根据环境确定是否使用IP地址
const isLocal = process.env.NODE_ENV === 'development'
const apiBaseUrl = isLocal ? 'http://8.130.75.193:8081' : 'https://view.yinhenx.cn'

// 自定义插件：复制语言文件到构建目录
const copyLocalesPlugin = () => {
  return {
    name: 'vite:copy-locales',
    apply: 'build', // 仅在构建模式下应用
    closeBundle: async () => {
      try {
        // 源文件目录
        const srcDir = path.resolve(__dirname, 'src/locales')
        // 目标目录 (dist/locales)
        const destDir = path.resolve(__dirname, 'dist/locales')
        
        // 确保目标目录存在
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true })
        }
        
        // 读取源目录中的所有TS文件
        const files = fs.readdirSync(srcDir)
        
        // 处理每个文件
        for (const file of files) {
          if (file.endsWith('.ts')) {
            // 源文件路径
            const srcFile = path.join(srcDir, file)
            
            // 读取TS文件内容
            const content = fs.readFileSync(srcFile, 'utf-8')
            
            // 简单地提取对象内容 (这是一个简化的实现，可能需要使用AST解析器处理更复杂的情况)
            const match = content.match(/export\s+default\s+({[\s\S]*})/)
            
            if (match && match[1]) {
              // 提取语言对象部分
              const langObject = match[1]
              
              // 输出JSON文件名
              const jsonFile = path.join(destDir, file.replace('.ts', '.json'))
              
              // 尝试将对象字符串转换为JSON
              try {
                // 将对象字符串转换为实际对象
                // 注意：在实际生产中使用eval并不是最佳实践，但这里为了简单处理
                const objStr = langObject.replace(/(\w+):/g, '"$1":')
                                          .replace(/,\s*}/g, '}')
                                          .replace(/'/g, '"')
                const obj = JSON.parse(objStr)
                
                // 写入JSON文件
                fs.writeFileSync(jsonFile, JSON.stringify(obj, null, 2), 'utf-8')
                console.log(`✅ 成功将 ${file} 转换并复制到 ${jsonFile}`)
              } catch (err) {
                console.error(`❌ 转换 ${file} 时出错:`, err)
                
                // 备用方案：直接使用 require 加载对象
                try {
                  if (file === 'en.ts') {
                    // 将对象直接写入 JSON 文件
                    const enData = require('./src/locales/en').default
                    fs.writeFileSync(
                      path.join(destDir, 'en.json'),
                      JSON.stringify(enData, null, 2),
                      'utf-8'
                    )
                    console.log(`✅ 使用备用方案成功将 en.ts 转换并复制`)
                  } else if (file === 'zh-cn.ts') {
                    // 将对象直接写入 JSON 文件
                    const zhData = require('./src/locales/zh-cn').default
                    fs.writeFileSync(
                      path.join(destDir, 'zh-cn.json'),
                      JSON.stringify(zhData, null, 2),
                      'utf-8'
                    )
                    console.log(`✅ 使用备用方案成功将 zh-cn.ts 转换并复制`)
                  }
                } catch (backupErr) {
                  console.error(`❌ 备用方案也失败:`, backupErr)
                  
                  // 最终备用方案：手动复制已知内容
                  if (file === 'en.ts') {
                    fs.copyFileSync(
                      path.resolve(__dirname, 'src/locales/en.json'), 
                      path.join(destDir, 'en.json')
                    )
                  } else if (file === 'zh-cn.ts') {
                    fs.copyFileSync(
                      path.resolve(__dirname, 'src/locales/zh-cn.json'), 
                      path.join(destDir, 'zh-cn.json')
                    )
                  }
                }
              }
            }
          }
        }
        
        console.log('✅ 语言文件复制完成')
      } catch (err) {
        console.error('❌ 复制语言文件失败:', err)
      }
    }
  }
}

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
    }),
    // 添加复制语言文件插件
    copyLocalesPlugin()
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
          // 确保 vue-i18n 被正确打包
          if (id.includes('node_modules/vue-i18n') || 
              id.includes('node_modules/@intlify')) {
            return 'i18n-vendor'
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
