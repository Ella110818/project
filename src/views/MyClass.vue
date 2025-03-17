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
import courseService from '@/services/courseService';
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
  created() {
    // 从共享的课程服务中获取课程数据
    this.courses = courseService.getAllCourses();
  },
  methods: {
    handleViewCourse(courseId) {
      console.log('查看课程:', courseId);
      // 获取课程详情
      const course = courseService.getCourseById(courseId);
      if (course) {
        // 保存当前课程信息到localStorage
        courseService.saveCurrentCourse(course);
        
        // 获取用户角色
        const userRole = localStorage.getItem('userRole');
        
        // 根据用户角色跳转到不同的详情页
        if (userRole === 'teacher') {
          // 教师端路由
          this.$router.push(`/class-info/${courseId}`);
        } else {
          // 学生端路由
          this.$router.push(`/student-class-info/${courseId}`);
        }
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

