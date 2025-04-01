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

        <el-pagination
          v-if="total > 0"
          :current-page="page"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
          class="pagination"
        />
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
      loading: false,
      page: 1,
      pageSize: 10,
      total: 0
    };
  },
  async created() {
    await this.fetchCourses();
  },
  methods: {
    async fetchCourses() {
      try {
        this.loading = true;
        const response = await api.getCourses(this.page, this.pageSize);
        
        if (response.code === 200) {
          this.courses = response.data.items;
          this.total = response.data.total;
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

    async handlePageChange(newPage) {
      this.page = newPage;
      await this.fetchCourses();
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
  width: 100%;
}

.home-view {
  padding: 20px 40px;
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

.pagination {
  margin-top: 20px;
  text-align: center;
}
</style> 

