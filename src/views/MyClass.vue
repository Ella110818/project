<template>
  <div class="common-layout">
    <el-container>
      <el-main class="home-view">
        <el-loading v-if="loading" fullscreen />
        
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="course in courses" :key="course.id">
            <CourseCard2 :course="course" @view-course="handleViewCourse" />
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import CourseCard2 from '@/components/CourseCard2.vue';
import api from '@/api';

export default {
  name: 'MyClass',
  components: {
    CourseCard2,
  },
  data() {
    return {
      courses: [],
      loading: false
    };
  },
  async created() {
    await this.fetchCourses();
  },
  methods: {
    async fetchCourses() {
      try {
        this.loading = true;
        const response = await api.getCourses();
        
        if (response.code === 200) {
          this.courses = response.data.items;
        } else {
          this.$message.error(response.message || '获取课程列表失败');
        }
      } catch (error) {
        console.error('获取课程列表异常:', error);
        this.$message.error('获取课程列表失败，请稍后重试');
      } finally {
        this.loading = false;
      }
    },

    async handleViewCourse(courseId) {
      try {
        const response = await api.getCourseDetail(courseId);
        
        if (response.code === 200) {
          const course = response.data;
          localStorage.setItem('currentCourse', JSON.stringify(course));
          localStorage.setItem('currentCourseName', course.title);
          localStorage.setItem('currentCourseId', course.course_id);
          
          const userRole = localStorage.getItem('userRole');
          
          if (userRole === 'teacher') {
            this.$router.push(`/class-info/${courseId}`);
          } else {
            this.$router.push(`/student-class-info/${courseId}`);
          }
        } else {
          this.$message.error(response.message || '获取课程详情失败');
        }
      } catch (error) {
        console.error('获取课程详情异常:', error);
        this.$message.error('获取课程详情失败，请稍后重试');
      }
    },
  },
};
</script>

<style scoped>
.common-layout {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding-top: 20px;
  box-sizing: border-box;
}

.common-layout::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-image: url('@/assets/design2.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
}

.home-view {
  position: relative;
  padding: 20px 40px;
  z-index: 1;
}

:deep(.el-row) {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

:deep(.el-col) {
  padding-bottom: 20px;
}

.h1 {
  text-align: center;
  margin-bottom: 20px;
}

.header {
  box-shadow: 0 1px 0 #ddd;
  display: flex;
  height: 56px;
  align-items: center;
  padding: 0 20px;
}
</style> 

