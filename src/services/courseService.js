// 课程服务：提供共享的课程数据
// 这个服务将被"开始上课"和"我的课程"页面共同使用

const courseList = [
    {
        id: 1,
        title: '脑机接口',
        description: '本课程介绍脑机接口的基本原理与应用技术，探讨人脑与计算机直接通信的实现方法。',
        teacherName: '张教授',
        location: '主教学楼301',
        studentCount: 35
    },
    {
        id: 2,
        title: '人工智能原理',
        description: '介绍人工智能的核心概念、算法与实践应用，包括机器学习、深度学习等技术。',
        teacherName: '李教授',
        location: '理科楼B204',
        studentCount: 42
    },
    {
        id: 3,
        title: '数据结构与算法',
        description: '系统讲解基础数据结构与经典算法，培养学生的逻辑思维与程序设计能力。',
        teacherName: '王教授',
        location: '计算机楼305',
        studentCount: 38
    },
    {
        id: 4,
        title: '计算机网络',
        description: '介绍计算机网络的架构、协议与应用，理解互联网通信原理与网络安全。',
        teacherName: '刘教授',
        location: '教学主楼501',
        studentCount: 30
    }
];

// 获取所有课程
export function getAllCourses() {
    return courseList;
}

// 根据ID获取课程详情
export function getCourseById(id) {
    return courseList.find(course => course.id === Number(id)) || null;
}

// 保存当前选中的课程到localStorage
export function saveCurrentCourse(course) {
    localStorage.setItem('currentCourseName', course.title);
    localStorage.setItem('currentCourseId', course.id);
    localStorage.setItem('currentCourseLocation', course.location);
    localStorage.setItem('currentCourseTeacher', course.teacherName);
    localStorage.setItem('currentCourseStudentCount', course.studentCount);
}

export default {
    getAllCourses,
    getCourseById,
    saveCurrentCourse
}; 