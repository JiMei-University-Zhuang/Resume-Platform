import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
var __dirname = dirname(fileURLToPath(import.meta.url));
// 根据环境确定是否使用IP地址
var isLocal = process.env.NODE_ENV === 'development';
var apiBaseUrl = isLocal ? 'http://8.130.75.193:8081' : 'https://view.yinhenx.cn';
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
        rollupOptions: {
            external: ['element-plus/es/element-plus']
        }
    }
});
