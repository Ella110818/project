// vite.config.js
// import { defineConfig } from 'vite';
// import vue from '@vitejs/plugin-vue';

// export default defineConfig({
//     plugins: [vue()],
//     // 添加其他配置...
// });
// // vite.config.js
// import { defineConfig } from 'vite';

// export default defineConfig({
//     // ...
//     define: {
//         __VUE_OPTIONS_API__: true,
//         __VUE_PROD_DEVTOOLS__: false,
//         __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
//     },
// });


// import { defineConfig } from 'vite';
// import vue from '@vitejs/plugin-vue';

// export default defineConfig({
//     plugins: [vue()],
//     define: {
//         __VUE_OPTIONS_API__: true,
//         __VUE_PROD_DEVTOOLS__: false,
//         __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
//     },
// });

// import { defineConfig } from 'vite';
// import vue from '@vitejs/plugin-vue';

// export default defineConfig({
//     plugins: [vue()],
//     define: {
//         __VUE_OPTIONS_API__: true,
//         __VUE_PROD_DEVTOOLS__: false,
//         __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
//     }
// });


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

