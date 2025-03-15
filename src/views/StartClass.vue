<!-- <template>
  <div class="home-view">
    <el-row :gutter="10">
      <el-col :span="6" v-for="course in courses" :key="course.id">
        <CourseCard :course="course" @view-course="handleViewCourse" />
      </el-col>
    </el-row>
  </div>
</template> -->
<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="0px"></el-aside>
      <el-container>
        <!-- <el-header  class="header">Header</el-header> -->
        <el-main class="home-view">
            <el-row :gutter="6">
                <el-col :span="6" v-for="course in courses" :key="course.id">
                <CourseCard1 :course="course" @view-course="handleViewCourse" />
                </el-col>
            </el-row>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import CourseCard1 from '@/components/CourseCard1.vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
//import Sidebar from '@/components/Sidebar.vue';
export default {
  name: 'StartClass',
  components: {
    CourseCard1,
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
        const response = await axios.get('/api/courses');
        this.courses = response.data;
      } catch (error) {
        console.error('获取课程列表失败:', error);
        ElMessage.error('获取课程列表失败，请稍后重试');
      }
    },
    handleViewCourse(courseId) {
      this.$router.push(`/class-info/${courseId}`);
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
  align-items: center;/* 垂直居中  */
  padding: 0 20px; /* 添加内边距 */
}
</style> 

