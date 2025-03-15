// // src/api/index.js
// import axios from 'axios';

// const api = {
//     login: async (loginForm) => {
//         try {
//             const response = await axios.post('/api/login', loginForm); // 调用登录接口
//             return response.data; // 返回接口响应数据
//         } catch (error) {
//             throw new Error('登录失败'); // 抛出错误
//         }
//     },
// };

// export default api;
// src/api/index.js
const api = {
    login: async (loginForm) => {
        // 模拟登录成功
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (loginForm.username === 'admin' && loginForm.password === '123456') {
                    resolve({ success: true, data: { username: 'admin' } });
                } else {
                    reject(new Error('用户名或密码错误'));
                }
            }, 1000);
        });
    },
};

export default api;