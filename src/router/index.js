import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import HomeView from '@/views/HomeView.vue'
import Sidebar from '@/components/Sidebar.vue'
import LoginView from '@/views/LoginView.vue'
import Login from '@/components/Loign.vue'
import CourseCard1 from '@/components/CourseCard1.vue'
import CourseCard2 from '@/components/CourseCard2.vue'
import MyClass from '@/views/MyClass.vue'
import StartClass from '@/views/StartClass.vue'
import ClassInfo from '@/views/ClassInfo.vue'
import StudentClassInfo from '@/views/StudentClassInfo.vue'
import StudentManage from '@/views/StudentManage.vue'
import Score from '@/components/Score.vue'
import Record from '@/views/Record.vue'
import Message from '@/views/Message.vue'
import Profile from '@/views/Profile.vue'
import details from '@/views/details.vue'
import TextScroll from '@/components/TextScroll.vue'
import AnnouncementForm from '@/components/AnnouncementForm.vue'
import Exam from '@/components/Exam.vue'
import Group from '@/components/Group.vue'
import DataListCard from '@/components/DataListCard.vue'
import ImageCard from '@/components/ImageCard.vue'
import NewClassPage from '@/views/NewClassPage.vue'
import Register from '@/views/Register.vue'

// 教师路由
const teacherRoutes = [
  {
    path: 'startclass',
    component: StartClass,
  },
  {
    path: 'record',
    component: Record,
  },
  {
    path: 'studentmanage',
    component: StudentManage,
  },
]

// 学生路由
const studentRoutes = [
  {
    path: 'assignments',
    component: () => import('@/views/StudentAssignments.vue'),
  },
  {
    path: 'grades',
    component: () => import('@/views/StudentGrades.vue'),
  },
]

// 共享路由
const sharedRoutes = [
  {
    path: 'myclass',
    component: MyClass,
  },
  {
    path: 'message',
    component: Message,
  },
  {
    path: 'profile',
    component: Profile,
  },
  {
    path: 'assistant',
    component: () => import('@/views/Assistant.vue'),
  },
  {
    path: '/class-info/:id',
    name: 'class-info',
    component: ClassInfo,
    props: true,
    beforeEnter: (to, from, next) => {
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'student') {
        next({ name: 'student-class-info', params: { id: to.params.id } });
      } else {
        next();
      }
    }
  },
  {
    path: '/student-class-info/:id',
    name: 'student-class-info',
    component: StudentClassInfo,
    props: true
  },
  {
    path: '/student/:id',
    name: 'details',
    component: details,
  },
]

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true },
    children: [
      ...teacherRoutes,
      ...studentRoutes,
      ...sharedRoutes,
    ],
  },
  {
    path: '/home',
    component: Home,
  },
  {
    name: 'Sidebar',
    path: '/Sidebar',
    component: Sidebar,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/new-class-page',
    name: 'new-class-page',
    component: NewClassPage,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');

  // 如果未登录且访问需要认证的页面，重定向到登录页
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
    return;
  }

  // 如果已登录且访问登录页，重定向到首页
  if (to.path === '/login' && isAuthenticated) {
    next('/');
    return;
  }

  // 如果已登录，检查路由权限
  if (isAuthenticated) {
    const path = to.path.split('/')[1]; // 获取第一级路由

    // 检查是否是教师路由
    const isTeacherRoute = teacherRoutes.some(route => route.path === path);
    // 检查是否是学生路由
    const isStudentRoute = studentRoutes.some(route => route.path === path);

    // 根据用户角色和路由类型进行权限控制
    if (userRole === 'student' && isTeacherRoute) {
      next('/myclass');
    } else if (userRole === 'teacher' && isStudentRoute) {
      next('/myclass');
    } else {
      next();
    }
  } else {
    next();
  }
});

const teacherMenuItems = [
  { index: '1', icon: 'el-icon-video-play', name: '开始上课', path: '/startclass' },
  { index: '2', icon: 'el-icon-notebook-2', name: '我的课程', path: '/myclass' },
  { index: '3', icon: 'el-icon-document', name: '课堂记录', path: '/record' },
  { index: '4', icon: 'el-icon-user', name: '学生管理', path: '/studentmanage' },
  { index: '5', icon: 'el-icon-message', name: '消息', path: '/message' },
];

const studentMenuItems = [
  { index: '1', icon: 'el-icon-video-play', name: '开始上课', path: '/startclass' },
  { index: '2', icon: 'el-icon-notebook-2', name: '我的课程', path: '/myclass' },
  { index: '5', icon: 'el-icon-message', name: '消息', path: '/message' },
  { index: '6', icon: 'el-icon-message', name: '智能助手', path: '/smart-assistant' },
];

export default router
