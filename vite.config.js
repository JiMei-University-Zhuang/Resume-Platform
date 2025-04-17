var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1]
          return t[1]
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g = Object.create((typeof Iterator === 'function' ? Iterator : Object).prototype)
    return (
      (g.next = verb(0)),
      (g['throw'] = verb(1)),
      (g['return'] = verb(2)),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this
        }),
      g
    )
    function verb(n) {
      return function (v) {
        return step([n, v])
      }
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.')
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                    ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t
          if (((y = 0), t)) op = [op[0] & 2, t.value]
          switch (op[0]) {
            case 0:
            case 1:
              t = op
              break
            case 4:
              _.label++
              return { value: op[1], done: false }
            case 5:
              _.label++
              y = op[1]
              op = [0]
              continue
            case 7:
              op = _.ops.pop()
              _.trys.pop()
              continue
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0
                continue
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1]
                break
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1]
                t = op
                break
              }
              if (t && _.label < t[2]) {
                _.label = t[2]
                _.ops.push(op)
                break
              }
              if (t[2]) _.ops.pop()
              _.trys.pop()
              continue
          }
          op = body.call(thisArg, _)
        } catch (e) {
          op = [6, e]
          y = 0
        } finally {
          f = t = 0
        }
      if (op[0] & 5) throw op[1]
      return { value: op[0] ? op[1] : void 0, done: true }
    }
  }
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import viteImagemin from 'vite-plugin-imagemin'
import AutoImport from 'unplugin-auto-import/vite'
import fs from 'fs'
var __dirname = dirname(fileURLToPath(import.meta.url))
// 根据环境确定是否使用IP地址
var isLocal = process.env.NODE_ENV === 'development'
var apiBaseUrl = isLocal ? 'http://8.130.75.193:8081' : 'https://view.yinhenx.cn'
// 自定义插件：复制语言文件到构建目录
var copyLocalesPlugin = function () {
  return {
    name: 'vite:copy-locales',
    apply: 'build', // 仅在构建模式下应用
    closeBundle: function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var srcDir,
          destDir,
          files,
          _i,
          files_1,
          file,
          srcFile,
          content,
          match,
          langObject,
          jsonFile,
          objStr,
          obj,
          enData,
          zhData
        return __generator(this, function (_a) {
          try {
            srcDir = path.resolve(__dirname, 'src/locales')
            destDir = path.resolve(__dirname, 'dist/locales')
            // 确保目标目录存在
            if (!fs.existsSync(destDir)) {
              fs.mkdirSync(destDir, { recursive: true })
            }
            files = fs.readdirSync(srcDir)
            // 处理每个文件
            for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
              file = files_1[_i]
              if (file.endsWith('.ts')) {
                srcFile = path.join(srcDir, file)
                content = fs.readFileSync(srcFile, 'utf-8')
                match = content.match(/export\s+default\s+({[\s\S]*})/)
                if (match && match[1]) {
                  langObject = match[1]
                  jsonFile = path.join(destDir, file.replace('.ts', '.json'))
                  // 尝试将对象字符串转换为JSON
                  try {
                    objStr = langObject
                      .replace(/(\w+):/g, '"$1":')
                      .replace(/,\s*}/g, '}')
                      .replace(/'/g, '"')
                    obj = JSON.parse(objStr)
                    // 写入JSON文件
                    fs.writeFileSync(jsonFile, JSON.stringify(obj, null, 2), 'utf-8')
                    console.log(
                      '\u2705 \u6210\u529F\u5C06 '
                        .concat(file, ' \u8F6C\u6362\u5E76\u590D\u5236\u5230 ')
                        .concat(jsonFile)
                    )
                  } catch (err) {
                    console.error('\u274C \u8F6C\u6362 '.concat(file, ' \u65F6\u51FA\u9519:'), err)
                    // 备用方案：直接使用 require 加载对象
                    try {
                      if (file === 'en.ts') {
                        enData = require('./src/locales/en').default
                        fs.writeFileSync(
                          path.join(destDir, 'en.json'),
                          JSON.stringify(enData, null, 2),
                          'utf-8'
                        )
                        console.log(
                          '\u2705 \u4F7F\u7528\u5907\u7528\u65B9\u6848\u6210\u529F\u5C06 en.ts \u8F6C\u6362\u5E76\u590D\u5236'
                        )
                      } else if (file === 'zh-cn.ts') {
                        zhData = require('./src/locales/zh-cn').default
                        fs.writeFileSync(
                          path.join(destDir, 'zh-cn.json'),
                          JSON.stringify(zhData, null, 2),
                          'utf-8'
                        )
                        console.log(
                          '\u2705 \u4F7F\u7528\u5907\u7528\u65B9\u6848\u6210\u529F\u5C06 zh-cn.ts \u8F6C\u6362\u5E76\u590D\u5236'
                        )
                      }
                    } catch (backupErr) {
                      console.error('\u274C \u5907\u7528\u65B9\u6848\u4E5F\u5931\u8D25:', backupErr)
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
          return [2 /*return*/]
        })
      })
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
      }
    },
    // 调整代码分割策略，防止初始化顺序问题
    rollupOptions: {
      output: {
        // 不再使用 manualChunks，改为更简单的分块策略
        manualChunks: function (id) {
          // 将 element-plus 和 ant-design-vue 打包到同一个文件中，避免依赖冲突
          if (
            id.includes('node_modules/element-plus') ||
            id.includes('node_modules/@element-plus') ||
            id.includes('node_modules/ant-design-vue')
          ) {
            return 'ui-libraries'
          }
          // 确保 vue-i18n 被正确打包
          if (id.includes('node_modules/vue-i18n') || id.includes('node_modules/@intlify')) {
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
