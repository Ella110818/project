import axios from 'axios';

// 环境配置
export const ApiEnv = {
    LOCAL: 'local',
    PRODUCTION: 'production'
};

// 强制清除可能存在的本地环境配置
localStorage.removeItem('api_environment');

// 当前环境
const currentEnv = ApiEnv.PRODUCTION; // 强制使用生产环境

// 获取API基础URL
const getBaseUrl = () => {
    return currentEnv === ApiEnv.PRODUCTION
        ? '/api'  // 使用相对路径，让请求经过代理
        : 'http://localhost:3000';  // 本地开发环境地址
};

// 创建axios实例
const request = axios.create({
    baseURL: getBaseUrl(),
    timeout: 30000,  // 30秒超时
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求拦截器
request.interceptors.request.use(
    config => {
        // 添加基础URL前缀（如果需要）
        if (!config.url.startsWith('http')) {
            config.baseURL = getBaseUrl();
        }

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
                case 404:
                    console.error('请求的资源不存在:', error.config.url);
                    break;
                default:
                    console.error('请求失败:', data?.message || `HTTP错误 ${status}`);
            }
            return Promise.reject({
                code: status,
                message: data?.message || `请求失败 (${status})`,
                data: null
            });
        }
        return Promise.reject({
            code: 500,
            message: error.message || '网络错误',
            data: null
        });
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
    },

    // 人脸识别考勤（模拟实现）
    checkAttendance: async (imageData, courseTimeId = null) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 生成动态的日期时间字符串
                const now = new Date();
                const dateStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
                const timeStr = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;

                // 返回标准化的响应格式
                resolve({
                    code: 200,
                    message: `测试模式：已生成考勤记录，出席人数：${Math.floor(Math.random() * 5) + 1}，缺席人数：${Math.floor(Math.random() * 3) + 1}`,
                    data: {
                        file_path: `attendance_records/attendance_${dateStr}_${timeStr}.txt`,
                        attendance_records: [
                            {
                                id: 1,
                                name: "张三",
                                present: 1,
                                confidence: 0.85
                            },
                            {
                                id: 2,
                                name: "李四",
                                present: 1,
                                confidence: 0.78
                            },
                            {
                                id: 3,
                                name: "王五",
                                present: 0,
                                confidence: 0.45
                            }
                        ],
                        stats: {
                            total: 3,
                            present: 2,
                            absent: 1
                        },
                        course_time_id: courseTimeId
                    }
                });
            }, 500);
        });
    },

    // 获取课程学生列表（模拟实现）
    getCourseStudents: async (courseId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    code: 200,
                    message: "获取成功",
                    data: {
                        total: 3,
                        items: [
                            {
                                student_id: "S000001",
                                name: "张三",
                                email: "zhangsan@example.com",
                                phone: "13800138001",
                                staff_id: "ST001",
                                image: "/teacher/image/song.png",
                                class_name: "计算机科学与技术1班",
                                class_system: "计算机系"
                            },
                            {
                                student_id: "S000002",
                                name: "李四",
                                email: "lisi@example.com",
                                phone: "13800138002",
                                staff_id: "ST002",
                                image: "/teacher/image/song.png",
                                class_name: "软件工程1班",
                                class_system: "软件工程系"
                            },
                            {
                                student_id: "S000003",
                                name: "王五",
                                email: "wangwu@example.com",
                                phone: "13800138003",
                                staff_id: "ST003",
                                image: "/teacher/image/song.png",
                                class_name: "人工智能1班",
                                class_system: "人工智能系"
                            }
                        ]
                    }
                });
            }, 300);
        });
    },

    // 开始上课（模拟实现）
    startClass: async (courseId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const now = new Date();
                const courseTimeId = Date.now();
                resolve({
                    code: 200,
                    message: "课程已成功开始",
                    data: {
                        course_time_id: courseTimeId,
                        begin_time: now.toISOString(),
                        course_id: courseId,
                        course_title: "计算机组成原理"
                    }
                });
            }, 300);
        });
    },

    // 结束上课（模拟实现）
    endClass: async (courseTimeId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const beginTime = new Date(Date.now() - 3600000); // 假设开始时间是1小时前
                const endTime = new Date();

                resolve({
                    code: 200,
                    message: "课程已成功结束",
                    data: {
                        course_time_id: courseTimeId,
                        begin_time: beginTime.toISOString(),
                        end_time: endTime.toISOString(),
                        duration: 60, // 以分钟为单位，假设60分钟
                        course_id: "COURSE001",
                        course_title: "计算机组成原理"
                    }
                });
            }, 300);
        });
    },

    // 上传课程录像（模拟实现）
    uploadCourseRecording: async (courseTimeId, recordingFile) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    code: 200,
                    message: "课程录像上传成功",
                    data: {
                        course_time_id: courseTimeId,
                        recording_path: `/uploads/recordings/mock_recording_${Date.now()}.mp4`,
                        course_id: "COURSE001",
                        course_title: "计算机组成原理"
                    }
                });
            }, 1500); // 模拟上传耗时较长
        });
    },

    // 情绪识别视频分析（模拟实现）
    processEmotionRecognition: async (videoFile, courseTimeId = null) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const now = new Date();
                const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
                const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');

                resolve({
                    code: 200,
                    message: "视频情绪识别分析完成，识别到 7 名学生",
                    data: {
                        video_url: `/media/emotion_analysis/emotion_recognition_${dateStr}_${timeStr}.mp4`,
                        statistics_url: `/media/emotion_analysis/face_status_${dateStr}_${timeStr}_statistics.json`,
                        log_url: `/media/emotion_analysis/face_status_${dateStr}_${timeStr}.txt`,
                        identified_students: ["李乐", "陈文伟", "杨依林", "宋嘉怡", "马莉岚", "谢宛桐", "汤燕"],
                        summary: {
                            "李乐": {
                                total_records: 120,
                                status_counts: {
                                    "Focused": 80,
                                    "Distracted": 30,
                                    "Confused": 10
                                },
                                status_percentages: {
                                    "Focused": 66.67,
                                    "Distracted": 25.00,
                                    "Confused": 8.33
                                }
                            },
                            "陈文伟": {
                                total_records: 115,
                                status_counts: {
                                    "Focused": 65,
                                    "Distracted": 35,
                                    "Head Down": 15
                                },
                                status_percentages: {
                                    "Focused": 56.52,
                                    "Distracted": 30.43,
                                    "Head Down": 13.04
                                }
                            },
                            "杨依林": {
                                total_records: 100,
                                status_counts: {
                                    "Focused": 70,
                                    "Turning LEFT": 15,
                                    "Turning RIGHT": 10,
                                    "Confused": 5
                                },
                                status_percentages: {
                                    "Focused": 70.00,
                                    "Turning LEFT": 15.00,
                                    "Turning RIGHT": 10.00,
                                    "Confused": 5.00
                                }
                            }
                        }
                    }
                });
            }, 3000); // 模拟处理耗时
        });
    },

    // 获取课程时间列表（模拟实现）
    getCourseTimesList: async (courseId, page = 1, size = 10, withRecording = false, withAnalysis = false) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 生成假数据
                const totalItems = 15;
                const items = [];

                for (let i = 0; i < Math.min(size, totalItems - (page - 1) * size); i++) {
                    const id = (page - 1) * size + i + 1;
                    const date = new Date();
                    date.setDate(date.getDate() - id); // 每条记录日期往前推一天

                    // 如果请求要求只显示有录像的记录，则所有记录都应该有录像
                    const hasRecording = withRecording ? true : Math.random() > 0.3;
                    const hasProcessedRecording = withRecording ? true : Math.random() > 0.5;
                    const hasEmotionAnalysis = withAnalysis ? true : Math.random() > 0.5;

                    items.push({
                        id: id,
                        begin_time: new Date(date.setHours(9, 0, 0)).toISOString(),
                        end_time: new Date(date.setHours(10, 30, 0)).toISOString(),
                        course_id: courseId,
                        course_title: "计算机组成原理",
                        teacher_name: "韩石",
                        has_recording: hasRecording,
                        has_processed_recording: hasProcessedRecording,
                        has_emotion_analysis: hasEmotionAnalysis
                    });
                }

                resolve({
                    code: 200,
                    message: "获取成功",
                    data: {
                        total: totalItems,
                        items: items
                    }
                });
            }, 300);
        });
    },

    // 获取录像详情（模拟实现）
    getRecordingDetail: async (courseTimeId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 生成当前日期和前一天日期的字符串
                const now = new Date();
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);

                const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
                const timeStr = "090000";

                resolve({
                    code: 200,
                    message: "获取成功",
                    data: {
                        id: courseTimeId,
                        begin_time: yesterday.toISOString(),
                        end_time: now.toISOString(),
                        course_id: "COURSE001",
                        course_title: "计算机组成原理",
                        teacher_name: "韩石",
                        recording_url: `/media/course_recordings/${dateStr}/recording_${courseTimeId}_${timeStr}.webm`,
                        processed_recording_url: `/media/processed_recordings/${dateStr}/emotion_recognition_${dateStr}_${timeStr}.mp4`,
                        emotion_analysis_json: {
                            "summary": {
                                "周思捷": {
                                    "total_records": 2,
                                    "status_counts": {
                                        "Distracted": 2
                                    },
                                    "status_percentages": {
                                        "Distracted": 100.0
                                    }
                                }
                            }
                        }
                    }
                });
            }, 300);
        });
    },

    // 获取流式播放URL
    getStreamUrl: (courseTimeId, type = 'processed') => {
        // 确保使用完整的服务器URL，而不是相对路径
        const baseUrl = window.location.origin; // 获取当前站点的完整URL
        return `${baseUrl}/api/course/course-times/${courseTimeId}/stream/?type=${type}`;
    }
};

// 生产环境API
const productionApi = {
    // 用户登录
    login: async (loginData) => {
        try {
            const response = await request({
                url: '/user/login/',  // 移除重复的/api前缀
                method: 'post',
                data: {
                    username: loginData.username,
                    password: loginData.password
                },
                headers: {
                    'Content-Type': 'application/json'
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
            if (error.response && error.response.status === 404) {
                throw new Error('登录接口不存在，请检查API路径配置');
            }
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
            return response;
        } catch (error) {
            console.error('上传课程资源失败:', error);
            throw error;
        }
    },

    // 开始上课
    startClass: async (courseId) => {
        try {
            const response = await request.post(`/api/course/courses/${courseId}/start/`);
            return response;
        } catch (error) {
            console.error('开始上课失败:', error);
            throw error;
        }
    },

    // 结束上课
    endClass: async (courseTimeId) => {
        try {
            const response = await request.post(`/api/course/course-times/${courseTimeId}/end/`);
            return response;
        } catch (error) {
            console.error('结束上课失败:', error);
            throw error;
        }
    },

    // 上传课程录像
    uploadCourseRecording: async (courseTimeId, recordingFile) => {
        try {
            const formData = new FormData();
            formData.append('recording', recordingFile);

            const response = await request({
                url: `/api/course/course-times/${courseTimeId}/upload-recording/`,
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 300000, // 5分钟超时，录像文件可能较大
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log('录像上传进度:', percentCompleted + '%');
                }
            });
            return response;
        } catch (error) {
            console.error('上传课程录像失败:', error);
            throw error;
        }
    },

    // 人脸识别考勤
    checkAttendance: async (imageFile, courseTimeId = null) => {
        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            // 如果提供了courseTimeId，添加到表单数据中
            if (courseTimeId) {
                formData.append('course_time_id', courseTimeId);
            }

            const response = await request({
                url: '/face_recognition/check_attendance/',
                method: 'post',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 60000 // 考虑到人脸识别可能需要较长时间，设置60秒超时
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // 情绪识别视频分析
    processEmotionRecognition: async (videoFile, courseTimeId = null) => {
        try {
            const formData = new FormData();
            formData.append('video', videoFile);

            // 如果提供了courseTimeId，添加到表单数据中
            if (courseTimeId) {
                formData.append('course_time_id', courseTimeId);
            }

            const response = await request({
                url: '/face_recognition/process_emotion_recognition/',
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 600000, // 10分钟超时，视频处理可能需要较长时间
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log('视频上传进度:', percentCompleted + '%');
                }
            });
            return response;
        } catch (error) {
            console.error('情绪识别视频分析失败:', error);
            throw error;
        }
    },

    // 获取课程时间列表
    getCourseTimesList: async (courseId, page = 1, size = 10, withRecording = false, withAnalysis = false) => {
        try {
            let params = { page, size };

            if (withRecording) {
                params.with_recording = 'true';
            }

            if (withAnalysis) {
                params.with_analysis = 'true';
            }

            const response = await request.get(`/api/course/courses/${courseId}/course-times/`, {
                params: params
            });
            return response;
        } catch (error) {
            console.error('获取课程时间列表失败:', error);
            throw error;
        }
    },

    // 获取录像详情
    getRecordingDetail: async (courseTimeId) => {
        try {
            const response = await request.get(`/api/course/course-times/${courseTimeId}/recording/`);
            return response;
        } catch (error) {
            console.error('获取录像详情失败:', error);
            throw error;
        }
    },

    // 获取流式播放URL
    getStreamUrl: (courseTimeId, type = 'processed') => {
        // 确保使用完整的服务器URL，而不是相对路径
        const baseUrl = window.location.origin; // 获取当前站点的完整URL
        return `${baseUrl}/api/course/course-times/${courseTimeId}/stream/?type=${type}`;
    },

    // 获取课程学生列表
    getCourseStudents: async (courseId) => {
        try {
            const response = await request.get(`/api/course/courses/${courseId}/students/info/`);
            return response;
        } catch (error) {
            console.error('获取课程学生列表失败:', error);
            throw error;
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