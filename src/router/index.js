import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import HomeView from '@/views/HomeView.vue'
import Sidebar from '@/components/Sidebar.vue'
import LoginView from '@/views/LoginView.vue'
import Login from '@/components/Loign.vue'
import MyClass from '@/views/MyClass.vue'
import StartClass from '@/views/StartClass.vue'
import ClassInfo from '@/views/ClassInfo.vue'
import StudentManage from '@/views/StudentManage.vue'
import Score from '@/components/Score.vue'
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
import LiveClassPage from '@/views/LiveClassPage.vue'
import StudentLiveClass from '@/views/StudentLiveClass.vue'
import StudentHtmlDisplay from '../views/StudentHtmlDisplay.vue'
import TeacherHtmlDisplay from '../views/TeacherHtmlDisplay.vue'
import TestDatav from '../views/TestDatav.vue'

// 教师路由
const teacherRoutes = [
  {
    path: 'startclass',
    name: 'teacher-startclass',
    component: StartClass,
    meta: { requiresAuth: true, role: 'teacher' }
  },
  {
    path: 'studentmanage',
    component: StudentManage,
    meta: { requiresAuth: true, role: 'teacher' }
  },
  {
    path: 'live-class/:id',
    name: 'live-class',
    component: LiveClassPage,
    props: true,
    meta: { requiresAuth: true, role: 'teacher' }
  },
  {
    path: 'teacher-display',
    name: 'TeacherHtmlDisplay',
    component: TeacherHtmlDisplay,
    meta: {
      title: '教师数据显示屏',
      requiresAuth: true,
      role: 'teacher'
    }
  }
]

// 学生路由
const studentRoutes = [
  {
    path: '/startclass',
    name: 'student-startclass',
    component: StartClass,
    meta: { requiresAuth: true }
  },
  {
    path: 'assignments',
    component: () => import('@/views/StudentAssignments.vue'),
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: 'grades',
    component: () => import('@/views/StudentGrades.vue'),
    meta: { requiresAuth: true, role: 'student' }
  },
]

// 共享路由
const sharedRoutes = [
  {
    path: 'myclass',
    component: MyClass,
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
    path: 'class-info/:id',
    name: 'class-info',
    component: ClassInfo,
    props: true,
  },
  {
    path: 'student-class-info/:id',
    name: 'student-class-info',
    component: () => import('@/views/StudentClassInfo.vue'),
    props: true,
  },
  {
    path: '/student/:id',
    name: 'details',
    component: details,
  },
  {
    path: 'student-live-class/:id',
    name: 'student-live-class',
    component: StudentLiveClass,
    props: true,
    meta: { requiresAuth: true }
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
      ...studentRoutes.filter(route => route.path !== '/startclass'),
      ...sharedRoutes,
      {
        path: 'student-display',
        name: 'StudentDisplay',
        component: () => import('@/views/StudentHtmlDisplay.vue'),
        meta: {
          requiresAuth: true,
          roles: ['student']
        }
      }
    ],
  },
  studentRoutes[0],
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
  {
    path: '/datascreen',
    name: 'DataScreen',
    component: () => import('@/views/DataScreen.vue'),
    meta: {
      title: '数据显示屏',
      requiresAuth: true // 需要登录才能访问
    }
  },
  {
    path: '/test-datav',
    name: 'TestDatav',
    component: TestDatav
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');

  // 如果已登录且访问登录页，重定向到数据显示屏
  if (isAuthenticated && to.path === '/login') {
    if (userRole === 'teacher') {
      next('/teacher-display');
    } else if (userRole === 'student') {
      next('/student-display');
    } else {
      next('/datascreen');
    }
    return;
  }

  // 如果访问开始上课页面，直接允许（移除角色检查）
  if (to.path === '/startclass') {
    if (!isAuthenticated) {
      next('/login');
      return;
    }
    next();
    return;
  }

  // 如果未登录且访问需要认证的页面，重定向到登录页
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
    return;
  }

  // 检查角色权限
  if (to.meta.role && to.meta.role !== userRole) {
    next('/login');
    return;
  }

  next();

  // 设置页面标题
  document.title = to.meta.title || '知微课研'
})

const teacherMenuItems = [
  { index: '1', icon: 'el-icon-video-play', name: '开始上课', path: '/startclass' },
  { index: '2', icon: 'el-icon-notebook-2', name: '我的课程', path: '/myclass' },
  { index: '3', icon: 'el-icon-user', name: '学生管理', path: '/studentmanage' },
];

const studentMenuItems = [
  { index: '1', icon: 'el-icon-video-play', name: '开始上课', path: '/startclass', meta: { role: 'student' } },
  { index: '2', icon: 'el-icon-notebook-2', name: '我的课程', path: '/myclass' },
  { index: '3', icon: 'el-icon-robot', name: '智能助手', path: '/assistant' },
];

export default router
