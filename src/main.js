// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router'
// import store from './store'

// console.log("环境变量=>", import.meta.env)
// createApp(App).use(store).use(router).mount('#app')
// import { createApp } from 'vue';
// import App from './App.vue';
// import router from './router';
// import store from './store';
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css';

// const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
// if (isAuthenticated) {
//     store.commit('user/SET_AUTHENTICATED', true); // 更新 Vuex 状态
// }
// // main.ts


// // 正确打印环境变量
// // console.log("环境变量=>", import.meta.env);
// const app = createApp(App);
// createApp(App)
//     .use(store)
//     .use(router)
//     .use(ElementPlus)
//     .mount('#app');
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import handleResizeObserverLoopError from './utils/resizeObserver';
import DataVVue3 from '@kjgl77/datav-vue3'

// 从 @element-plus/icons-vue 导入所有图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// 创建 Vue 应用实例
const app = createApp(App);

// 如果用户已认证，则更新 Vuex 状态
const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
if (isAuthenticated) {
    store.commit('user/SET_AUTHENTICATED', true);
}

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

// 使用 store、router 和 Element Plus
app.use(store).use(router).use(ElementPlus).use(DataVVue3);

// 处理 ResizeObserver 错误
handleResizeObserverLoopError();

// 挂载应用实例
app.mount('#app');

// 正确打印环境变量
console.log("环境变量=>", import.meta.env);