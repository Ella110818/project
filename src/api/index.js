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

// 当前环境
const currentEnv = localStorage.getItem('api_environment') || ApiEnv.PRODUCTION;

// 获取API基础URL
const getBaseUrl = () => {
    return currentEnv === ApiEnv.PRODUCTION
        ? 'http://47.238.113.163'  // 生产环境地址
        : 'http://localhost:3000';  // 本地开发环境地址
};

// 创建axios实例
const request = axios.create({
    baseURL: getBaseUrl(),
    timeout: 30000,  // 增加到30秒
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求拦截器
request.interceptors.request.use(
    config => {
        // 从localStorage获取token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // 如果是 FormData 类型的数据，不要设置 Content-Type，让浏览器自动设置
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        } else if (config.method === 'post' && !config.headers['Content-Type']) {
            // 对于非 FormData 的 POST 请求，设置默认的 Content-Type
            config.headers['Content-Type'] = 'application/json';
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
        if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
            console.log('请求超时：', error.config.url);
            // 可以在这里添加请求超时的特殊处理
            return Promise.reject({
                code: 408,
                message: '请求超时，请检查网络连接或稍后重试',
                data: null
            });
        }

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
                    console.error('请求失败:', data?.message || '未知错误');
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
                // 模拟教师账号
                if (loginData.username === '20001' && loginData.password === '123456') {
                    const token = `mock_token_${Date.now()}`;
                    resolve({
                        code: 200,
                        message: '登录成功',
                        data: {
                            token: token,
                            userId: '20001',
                            username: 'teacher_user',
                            role: 'teacher',
                            avatar: ''
                        }
                    });
                }
                // 模拟学生账号
                else if (loginData.username === '10001' && loginData.password === '123456') {
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
    }
};

// 生产环境API
const productionApi = {
    // 用户登录
    login: async (loginData) => {
        try {
            const response = await request({
                url: '/api/user/login/',
                method: 'post',
                data: {
                    username: loginData.username,
                    password: loginData.password
                }
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
            console.error('登录请求失败:', error);
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

    // 获取用户信息
    getUserMessages: async (userId) => {
        try {
            const response = await request({
                url: '/api/user/user/messages/',
                method: 'get',
                params: { user_id: userId }
            });
            return response;
        } catch (error) {
            console.error('获取用户信息失败:', error);
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

    // 获取课程资源列表
    getCourseResources: async (courseId, params) => {
        try {
            console.log('调用获取课程资源API - 课程ID:', courseId, '参数:', params)
            const response = await request.get(`/api/course/courses/${courseId}/resources/`, {
                params: params
            })
            console.log('API响应:', response)
            return response
        } catch (error) {
            console.error('获取课程资源列表失败:', error)
            throw error
        }
    },

    // 上传课程资源
    uploadCourseResource: async (courseId, formData) => {
        try {
            console.log('开始上传课程资源 - 课程ID:', courseId);
            console.log('FormData内容:', Array.from(formData.entries()));

            const response = await request({
                url: `/api/course/courses/${courseId}/resources/`,
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: formData,
                timeout: 60000,
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log('上传进度:', percentCompleted + '%');
                }
            });

            console.log('上传响应:', response);
            return response;
        } catch (error) {
            console.error('上传课程资源失败:', error);
            console.error('错误详情:', {
                message: error.message,
                response: error.response?.data || error.response,
                request: error.request
            });
            throw error;
        }
    },

    // 获取资源详情
    getResourceDetail: async (resourceId) => {
        try {
            const response = await request.get(`/api/course/resources/${resourceId}/`)
            return response
        } catch (error) {
            console.error('获取资源详情失败:', error)
            throw error
        }
    },

    // 下载资源
    downloadResource: async (resourceId) => {
        try {
            const response = await request({
                url: `/api/course/resources/${resourceId}/download/`,
                method: 'GET',
                responseType: 'blob',
                headers: {
                    'Accept': '*/*'
                }
            })
            return response
        } catch (error) {
            console.error('下载资源失败:', error)
            throw error
        }
    },

    // 删除资源
    deleteResource: async (resourceId) => {
        try {
            const response = await request({
                url: `/api/course/resources/${resourceId}/`,
                method: 'DELETE'
            })
            return response
        } catch (error) {
            console.error('删除资源失败:', error)
            throw error
        }
    },

    // 获取课程分组列表
    getCourseGroups: async (courseId) => {
        try {
            const response = await request.get(`/api/advanced/courses/${courseId}/groups/`)
            return response
        } catch (error) {
            console.error('获取分组列表失败:', error)
            throw error
        }
    },

    // 创建或更新分组
    createOrUpdateGroup: async (courseId, data) => {
        try {
            const response = await request.post(`/api/advanced/courses/${courseId}/groups/`, {
                name: data.name,
                studentIds: data.studentIds
            })
            return response
        } catch (error) {
            console.error('创建/更新分组失败:', error)
            throw error
        }
    },

    // 自动分组
    autoCreateGroups: async (courseId, data) => {
        try {
            const response = await request.post(`/api/advanced/courses/${courseId}/groups/auto`, {
                groupCount: data.groupCount,
                method: data.method
            })
            return response
        } catch (error) {
            console.error('自动分组失败:', error)
            throw error
        }
    },

    // 获取教师课程列表
    getTeacherCourses: async () => {
        try {
            const response = await request.get('/api/course/courses/', {
                params: {
                    role: 'teacher'  // 添加角色参数来过滤教师的课程
                }
            });
            return response;
        } catch (error) {
            console.error('获取教师课程列表失败:', error);
            throw error;
        }
    },

    // 获取课程学生列表
    getCourseStudents: async (courseId) => {
        try {
            const response = await request.get(`/api/course/courses/${courseId}/students/`);
            return response;
        } catch (error) {
            console.error('获取课程学生列表失败:', error);
            throw error;
        }
    },

    // 获取作业和考试列表
    getAssignments: async (courseId, params = {}) => {
        try {
            const response = await request.get(`/api/advanced/courses/${courseId}/assignments/`, {
                params: {
                    type: params.type,
                    status: params.status,
                    page: params.page || 1,
                    size: params.size || 10
                }
            });
            return response;
        } catch (error) {
            console.error('获取作业和考试列表失败:', error);
            throw error;
        }
    },

    // 发布作业或考试
    createAssignment: async (courseId, data) => {
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
            console.error('发布作业或考试失败:', error);
            throw error;
        }
    },

    // 人脸识别考勤
    checkAttendance: async (imageData) => {
        try {
            // 创建FormData对象
            const formData = new FormData();
            // 确保使用正确的字段名 'image'
            formData.append('image', imageData, 'attendance.jpg');

            console.log('发送考勤请求，图像数据大小:', imageData.size, 'bytes');

            // 发送请求到生产环境服务器
            const response = await request({
                url: '/face_recognition/check_attendance/',
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('服务器原始响应:', response);

            // 如果响应是错误状态，抛出错误
            if (response.status === 'error') {
                throw new Error(response.message || '考勤失败');
            }

            // 返回规范化的响应格式
            return {
                status: response.status || 'error',
                message: response.message || '未知响应',
                file_path: response.file_path,
                attendance_records: response.attendance_records || []
            };
        } catch (error) {
            console.error('人脸识别考勤失败:', error);
            // 返回统一的错误响应格式
            return {
                status: 'error',
                message: error.message || '考勤失败',
                file_path: undefined,
                attendance_records: []
            };
        }
    }
};

// 根据当前环境选择API实现
const apiImplementation = currentEnv === ApiEnv.LOCAL ? mockApi : productionApi;

// 暴露给外部的API对象
const api = {
    ...apiImplementation,

    // 获取当前环境
    getCurrentEnvironment() {
        return currentEnv;
    },

    // 切换环境
    switchEnvironment(env) {
        if (env === ApiEnv.LOCAL || env === ApiEnv.PRODUCTION) {
            localStorage.setItem('api_environment', env);
            window.location.reload(); // 重新加载页面以应用新环境
        }
    }
};

export default api;