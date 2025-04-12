import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import viteImagemin from 'vite-plugin-imagemin';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
var __dirname = dirname(fileURLToPath(import.meta.url));
// 根据环境确定是否使用IP地址
var isLocal = process.env.NODE_ENV === 'development';
var apiBaseUrl = isLocal ? 'http://8.130.75.193:8081' : 'https://view.yinhenx.cn';
// https://vite.dev/config/
export default defineConfig({
    // 设置为空字符串或相对路径'.'，以允许使用相对路径部署
    base: process.env.BASE_PATH || '/',
    plugins: [
        vue(),
        // 自动导入Element Plus组件
        AutoImport({
            resolvers: [ElementPlusResolver()],
            imports: ['vue', 'vue-router'],
            dts: 'src/auto-imports.d.ts',
        }),
        // 按需导入Element Plus组件
        Components({
            resolvers: [ElementPlusResolver()],
            dts: 'src/components.d.ts',
        }),
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
                rewrite: function (path) { return path.replace(/^\/api/, ''); }
                // Vite v6.1.0 不支持 priority 属性
            },
            '/api/practice': {
                target: apiBaseUrl,
                changeOrigin: true,
                rewrite: function (path) {
                    return path.replace(/^\/api/, '');
                },
                secure: false
            },
            '/api/exam': {
                target: apiBaseUrl,
                changeOrigin: true,
                rewrite: function (path) {
                    return path.replace(/^\/api/, '');
                },
                secure: false
            },
            '/api': {
                target: apiBaseUrl,
                changeOrigin: true,
                rewrite: function (path) {
                    return path.replace(/^\/api/, '');
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
        rollupOptions: {
            output: {
                // 根据类型拆分代码
                manualChunks: {
                    'element-plus': ['element-plus'],
                    'echarts': ['echarts'],
                    'vendor': [
                        'vue',
                        'vue-router',
                        'pinia',
                        '@vueuse/core',
                    ]
                }
            },
            external: ['element-plus/es/element-plus']
        }
    }
});
