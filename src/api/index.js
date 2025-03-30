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
    baseURL: 'http://47.238.113.163',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: false
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
        if (error.response) {
            // 处理后端返回的错误
            const { status, data } = error.response;
            switch (status) {
                case 401:
                    // 未授权，清除token并跳转到登录页
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    break;
                case 403:
                    // 权限不足
                    console.error('权限不足');
                    break;
                default:
                    console.error('请求失败:', data.message || '未知错误');
            }
        }
        return Promise.reject(error);
    }
);

// 本地模拟的登录API
const mockApi = {
    // 用户登录
    login: async (loginData) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 模拟登录验证
                if (loginData.username === '10001' && loginData.password === '123456') {
                    // 生成模拟token
                    const token = `mock_token_${Date.now()}`;

                    resolve({
                        code: 200,
                        message: '登录成功',
                        data: {
                            token: token,
                            userId: '10001',
                            username: 'test_user',
                            role: 'student',
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
    },

    // 获取用户消息
    getUserMessages: async (userId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    code: 200,
                    message: "获取用户消息成功",
                    data: {
                        userId: userId,
                        username: "test_user",
                        name: "测试用户",
                        email: "test@example.com",
                        phone: "13800138000",
                        role: "student",
                        avatar: "",
                        student_detail: {
                            student_id: "ST001",
                            class_id: "CL001",
                            class_detail: {
                                class_id: "CL001",
                                class_name: "测试班级",
                                class_system: "测试系统"
                            },
                            statuses: [],
                            courses: []
                        },
                        teacher_detail: null
                    }
                });
            }, 300);
        });
    },

    // 获取课程列表
    getCourses: async (page = 1, size = 10) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    code: 200,
                    message: "获取成功",
                    data: {
                        total: 100,
                        items: [
                            {
                                course_id: "COURSE001",
                                title: "计算机网络",
                                teacher: "TEACHER001",
                                description: "计算机网络基础课程",
                                location: "教学楼A101",
                                system: "计算机系",
                                schedule: "周一 1-2节",
                                semester: "2023-2024-1"
                            },
                            {
                                course_id: "COURSE002",
                                title: "数据结构",
                                teacher: "TEACHER002",
                                description: "数据结构与算法基础",
                                location: "教学楼B202",
                                system: "计算机系",
                                schedule: "周二 3-4节",
                                semester: "2023-2024-1"
                            }
                        ]
                    }
                });
            }, 300);
        });
    },

    // 获取课程详情
    getCourseDetail: async (courseId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    code: 200,
                    message: "获取成功",
                    data: {
                        course_id: courseId,
                        title: "计算机网络",
                        teacher: "TEACHER001",
                        description: "计算机网络基础课程",
                        location: "教学楼A101",
                        system: "计算机系",
                        schedule: "周一 1-2节",
                        semester: "2023-2024-1",
                        students_count: 60,
                        max_students: 80,
                        status: "进行中"
                    }
                });
            }, 300);
        });
    },

    // 获取课程公告列表
    getCourseAnnouncements: async (courseId, params) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockAnnouncements = [
                    {
                        id: 1,
                        title: '关于期中考试的通知',
                        content: '各位同学请注意，期中考试将于下周三进行，请做好准备。',
                        type: 'info',
                        publisher_info: {
                            name: '张老师',
                            avatar: ''
                        },
                        created_at: '2024-03-20 10:00:00',
                        updated_at: '2024-03-20 10:00:00'
                    },
                    {
                        id: 2,
                        title: '课程调整通知',
                        content: '由于特殊原因，本周五的课程将调整到下周一。',
                        type: 'warning',
                        publisher_info: {
                            name: '李老师',
                            avatar: ''
                        },
                        created_at: '2024-03-19 14:30:00',
                        updated_at: '2024-03-19 14:30:00'
                    }
                ];

                // 模拟分页
                const page = params.page || 1;
                const size = params.size || 10;
                const start = (page - 1) * size;
                const end = start + size;
                const items = mockAnnouncements.slice(start, end);

                resolve({
                    code: 200,
                    message: '获取成功',
                    data: {
                        total: mockAnnouncements.length,
                        items: items
                    }
                });
            }, 300);
        });
    },

    // 发布课程公告
    publishCourseAnnouncement: async (courseId, data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    code: 200,
                    message: '发布成功',
                    data: {
                        id: Date.now(),
                        title: data.title,
                        content: data.content,
                        type: data.type,
                        publisher_info: {
                            name: '当前教师',
                            avatar: ''
                        },
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                });
            }, 300);
        });
    },

    // 获取课程资源列表
    getCourseResources: async (courseId, params) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    code: 200,
                    message: "获取成功",
                    data: {
                        total: 3,
                        items: [
                            {
                                id: 1,
                                name: '第一章课件.pptx',
                                type: 'courseware',
                                size: 2048576,
                                uploadTime: '2024-03-20 10:00:00',
                                uploader: '张老师'
                            },
                            {
                                id: 2,
                                name: '实验指导.pdf',
                                type: 'document',
                                size: 1048576,
                                uploadTime: '2024-03-19 15:30:00',
                                uploader: '张老师'
                            },
                            {
                                id: 3,
                                name: '课程介绍视频.mp4',
                                type: 'video',
                                size: 104857600,
                                uploadTime: '2024-03-18 09:15:00',
                                uploader: '张老师'
                            }
                        ]
                    }
                });
            }, 300);
        });
    },

    // 上传课程资源
    uploadCourseResource: async (courseId, formData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 模拟上传成功
                resolve({
                    code: 200,
                    message: "上传成功",
                    data: {
                        id: Date.now(),
                        name: formData.get('name'),
                        type: formData.get('type'),
                        size: formData.get('file').size,
                        uploadTime: new Date().toISOString(),
                        uploader: '当前用户'
                    }
                });
            }, 1000);
        });
    },

    // 获取资源详情
    getResourceDetail: async (resourceId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    code: 200,
                    message: "获取成功",
                    data: {
                        id: resourceId,
                        name: "示例资源.pdf",
                        type: "document",
                        description: "这是一个示例资源",
                        file: "http://example.com/files/sample.pdf",
                        size: 1024576,
                        course: "1",
                        uploader: "张老师",
                        upload_time: "2024-03-20 10:00:00",
                        download_count: 10
                    }
                });
            }, 300);
        });
    },

    // 删除资源
    deleteResource: async (resourceId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    code: 200,
                    message: "删除成功",
                    data: null
                });
            }, 300);
        });
    },

    // 下载资源
    downloadResource: async (resourceId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    code: 200,
                    message: "下载链接生成成功",
                    data: {
                        downloadUrl: `http://example.com/download/${resourceId}`
                    }
                });
            }, 300);
        });
    }
};

// 生产环境API
const productionApi = {
    // 用户登录
    login: async (loginData) => {
        try {
            const response = await request.post('/api/user/login/', {
                username: loginData.username,
                password: loginData.password
            });

            // 如果登录成功，保存token到localStorage
            if (response.code === 200 && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userRole', response.data.role);
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('username', response.data.username);
            }

            return response;
        } catch (error) {
            throw error;
        }
    },

    // 用户登出
    logout: async () => {
        try {
            const response = await request.post('/api/user/logout/');
            // 清除本地存储的用户信息
            if (response.code === 200) {
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userId');
                localStorage.removeItem('username');
            }
            return response;
        } catch (error) {
            throw error;
        }
    },

    // 获取用户消息 - GET方法
    getUserMessages: async (userId) => {
        try {
            const response = await request.get('/api/user/user/messages/', {
                params: { user_id: userId }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // 获取用户消息 - POST方法
    getUserMessagesByPost: async (userId) => {
        try {
            const response = await request.post('/api/user/user/messages/', {
                user_id: userId
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // 获取课程列表
    getCourses: async (page = 1, size = 10) => {
        try {
            const response = await request.get('/api/course/courses/', {
                params: {
                    page,
                    size
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // 获取课程详情
    getCourseDetail: async (courseId) => {
        try {
            const response = await request.get(`/api/course/courses/${courseId}/`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // 获取课程公告列表
    getCourseAnnouncements: async (courseId, params) => {
        try {
            const response = await request.get(`/api/advanced/courses/${courseId}/announcements/`, {
                params: {
                    page: params.page,
                    size: params.size,
                    type: params.type
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // 发布课程公告
    publishCourseAnnouncement: async (courseId, data) => {
        try {
            const response = await request.post(`/api/advanced/courses/${courseId}/announcements/`, data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // 获取作业和考试列表
    getCourseAssignments: async (courseId, params) => {
        try {
            const response = await request.get(`/api/advanced/courses/${courseId}/assignments/`, {
                params: {
                    type: params.type,
                    status: params.status,
                    page: params.page,
                    size: params.size
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // 发布作业或考试
    publishAssignment: async (courseId, data) => {
        try {
            const response = await request.post(`/api/advanced/courses/${courseId}/assignments/`, {
                title: data.title,
                type: data.type,
                description: data.description,
                start_time: data.start_time,
                deadline: data.deadline,
                full_score: data.full_score
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // 获取课程资源列表
    getCourseResources: async (courseId, params) => {
        try {
            const response = await request.get(`/api/course/courses/${courseId}/resources/`, {
                params: {
                    page: params.page,
                    size: params.size,
                    type: params.type,
                    search: params.search
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // 上传课程资源
    uploadCourseResource: async (courseId, formData) => {
        try {
            const response = await request.post(`/api/course/courses/${courseId}/resources/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // 获取资源详情
    getResourceDetail: async (resourceId) => {
        try {
            const response = await request.get(`/api/course/resources/${resourceId}/`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // 删除资源
    deleteResource: async (resourceId) => {
        try {
            const response = await request.delete(`/api/course/resources/${resourceId}/`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // 下载资源
    downloadResource: async (resourceId) => {
        try {
            const response = await request.get(`/api/course/resources/${resourceId}/download/`, {
                responseType: 'blob',  // 设置响应类型为blob
                headers: {
                    'Accept': '*/*'  // 接受所有类型的响应
                }
            });
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
            // 提示用户环境已切换并自动刷新页面
            alert('环境已切换，页面将自动刷新以应用更改');
            window.location.reload();
        }
    },

    // 获取当前环境
    getCurrentEnvironment: () => {
        return localStorage.getItem('api_environment') || ApiEnv.PRODUCTION;
    }
};

export default api;