// vite.config.js 已禁用
/*
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    define: {
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    },
    // 设置环境变量
    envPrefix: 'VITE_',
    env: {
        VITE_API_URL: 'http://localhost:8080',
    },
});
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
*/

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
        open: true,
        cors: true
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        chunkSizeWarningLimit: 1500,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return 'vendor'
                    }
                }
            }
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/assets/styles/variables.scss";`
            }
        }
    },
    publicDir: 'public'
})

