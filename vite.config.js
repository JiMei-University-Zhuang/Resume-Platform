import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
var __dirname = dirname(fileURLToPath(import.meta.url));
// https://vite.dev/config/
export default defineConfig({
    // 设置为空字符串或相对路径'.'，以允许使用相对路径部署
    base: process.env.BASE_PATH || './',
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
            '^/api/chat': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                rewrite: function (path) { return path.replace(/^\/api/, ''); },
                // priority: 100
            },
            '/api': {
                target: 'http://8.130.75.193:8081',
                changeOrigin: true,
                rewrite: function (path) { return path.replace(/^\/api/, ''); }
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
