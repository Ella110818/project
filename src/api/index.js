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
import axios from 'axios';

// 环境配置
export const ApiEnv = {
    LOCAL: 'local',
    PRODUCTION: 'production'
};

// 默认环境为生产环境，可以通过localStorage存储用户的偏好
const currentEnv = localStorage.getItem('api_environment') || ApiEnv.PRODUCTION;

// 创建axios实例
const request = axios.create({
    baseURL: 'https://wstier477.pythonanywhere.com',
    timeout: 15000
});

// 请求拦截器
request.interceptors.request.use(
    config => {
        // 从localStorage获取token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截器
request.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        return Promise.reject(error);
    }
);

// 本地模拟的登录API
const mockApi = {
    // 用户注册
    register: async (registerData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 获取已注册用户列表
                const users = JSON.parse(localStorage.getItem('users') || '[]');

                // 检查学工号是否已存在
                if (users.some(user => user.userId === registerData.userId)) {
                    resolve({
                        code: 400,
                        message: '该学工号已被注册',
                        data: null
                    });
                    return;
                }

                // 检查用户名是否已存在
                if (users.some(user => user.username === registerData.username)) {
                    resolve({
                        code: 400,
                        message: '用户名已存在',
                        data: null
                    });
                    return;
                }

                // 添加新用户
                const newUser = {
                    username: registerData.username,
                    userId: registerData.userId,
                    name: registerData.name || registerData.userId,
                    email: registerData.email || '',
                    password: registerData.password,
                    role: registerData.role
                };

                users.push(newUser);

                // 保存到 localStorage
                localStorage.setItem('users', JSON.stringify(users));

                resolve({
                    code: 200,
                    message: '注册成功',
                    data: {
                        userId: newUser.userId,
                        username: newUser.username
                    }
                });
            }, 500);
        });
    },

    // 用户登录
    login: async (loginData) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 获取用户列表
                const users = JSON.parse(localStorage.getItem('users') || '[]');

                // 查找用户
                const user = users.find(u => u.userId === loginData.username && u.password === loginData.password);

                if (user) {
                    // 生成模拟token
                    const token = `mock_token_${Date.now()}`;

                    resolve({
                        code: 200,
                        message: '登录成功',
                        data: {
                            token: token,
                            userId: user.userId,
                            username: user.username,
                            role: user.role,
                            avatar: ''
                        }
                    });
                } else {
                    resolve({
                        code: 401,
                        message: '用户名或密码错误',
                        data: null
                    });
                }
            }, 500);
        });
    },

    // 用户登出
    logout: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    code: 200,
                    message: '退出成功',
                    data: null
                });
            }, 300);
        });
    }
};

// 生产环境API
const productionApi = {
    // 用户注册
    register: async (registerData) => {
        try {
            const response = await request.post('/api/register/', registerData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // 用户登录
    login: async (loginData) => {
        try {
            const response = await request.post('/api/login/', loginData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // 用户登出
    logout: async () => {
        try {
            const response = await request.post('/api/logout/');
            return response;
        } catch (error) {
            throw error;
        }
    },

    // 刷新Token
    refreshToken: async (refreshToken) => {
        try {
            const response = await request.post('/api/token/refresh/', { refresh: refreshToken });
            return response;
        } catch (error) {
            throw error;
        }
    }
};

// 根据当前环境选择API实现
const apiImplementation = currentEnv === ApiEnv.LOCAL ? mockApi : productionApi;

// 暴露给外部的API对象
const api = {
    ...apiImplementation,

    // 切换API环境
    switchEnvironment: (env) => {
        if (env === ApiEnv.LOCAL || env === ApiEnv.PRODUCTION) {
            localStorage.setItem('api_environment', env);
            // 提示用户需要刷新页面
            alert('环境已切换，请刷新页面以应用更改');
            // 可选：自动刷新页面
            // window.location.reload();
        }
    },

    // 获取当前环境
    getCurrentEnvironment: () => {
        return localStorage.getItem('api_environment') || ApiEnv.PRODUCTION;
    }
};

export default api;