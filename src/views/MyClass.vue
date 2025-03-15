<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="0px"></el-aside>
      <el-container>
        <!-- <el-header  class="header">Header</el-header> -->
        <router-view></router-view>
        <el-main class="home-view">
            <el-row :gutter="6">
                <el-col :span="6" v-for="course in courses" :key="course.id">
                <CourseCard2 :course="course" @view-course="handleViewCourse" />
                </el-col>
            </el-row>
        </el-main>
      </el-container>
    </el-container>
   
  </div>
</template>

<script>
import CourseCard2 from '@/components/CourseCard2.vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
 //import Sidebar from '@/components/Sidebar.vue';
export default {
  name: 'MyClass',
  components: {
    CourseCard2,
  },
  data() {
    return {
      courses: []
    };
  },
  async created() {
    await this.fetchCourses();
  },
  methods: {
    async fetchCourses() {
      try {
        // 从 localStorage 获取用户角色和 ID
        const userRole = localStorage.getItem('userRole');
        const userId = localStorage.getItem('userId');
        
        let endpoint = '/api/courses';
        if (userRole === 'student') {
          endpoint = `/api/students/${userId}/courses`;
        } else if (userRole === 'teacher') {
          endpoint = `/api/teachers/${userId}/courses`;
        }
        
        const response = await axios.get(endpoint);
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid response format');
        }
        
        this.courses = response.data.map(course => ({
          ...course,
          title: course.title || course.name, // 兼容不同的属性名
          description: course.description || '',
          teacher: course.teacher || '未分配教师',
          location: course.location || '待定'
        }));
      } catch (error) {
        console.error('获取课程列表失败:', error);
        ElMessage.error('获取课程列表失败，请稍后重试');
        this.courses = []; // 清空课程列表
      }
    },
    handleViewCourse(courseId) {
      // 从 localStorage 获取用户角色
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'student') {
        this.$router.push(`/student-class-info/${courseId}`);
      } else {
        this.$router.push(`/class-info/${courseId}`);
      }
    },
  },
};
</script>

<style scoped>
.common-layout{
  width:100%;
}
.home-view {
  padding: 15px;
  margin-left: 10px;
}

.h1 {
  text-align: center;
  margin-bottom: 20px;
}
.header {
  box-shadow: 0 1px 0 #ddd; /* 添加底部下划线 */
  display: flex;
  height: 56px;
  align-items: center; /* 垂直居中 */
  padding: 0 20px; /* 添加内边距 */
}


</style> 

