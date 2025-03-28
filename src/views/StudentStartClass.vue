<template>
  <div class="common-layout">
    <el-container>
      <el-main class="home-view">
        <div class="page-header">
          <h2>我的课程</h2>
          <div class="course-status">
            <el-tag type="success" v-if="hasActiveCourse">有课程正在进行</el-tag>
            <el-tag type="info" v-else>暂无进行中的课程</el-tag>
          </div>
        </div>
        
        <!-- 进行中的课程 -->
        <div v-if="activeCourses.length > 0" class="course-section">
          <h3 class="section-title">进行中的课程</h3>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="course in activeCourses" :key="course.id">
              <CourseCard1 
                :course="course" 
                @view-course="handleViewCourse"
                class="active-course" 
              />
            </el-col>
          </el-row>
        </div>

        <!-- 即将开始的课程 -->
        <div class="course-section">
          <h3 class="section-title">即将开始的课程</h3>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="course in upcomingCourses" :key="course.id">
              <CourseCard1 
                :course="course" 
                @view-course="handleViewCourse" 
              />
            </el-col>
          </el-row>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import CourseCard1 from '@/components/CourseCard1.vue';
import courseService from '@/services/courseService';

export default {
  name: 'StudentStartClass',
  components: {
    CourseCard1,
  },
  data() {
    return {
      courses: [],
      activeCourses: [],
      upcomingCourses: []
    };
  },
  computed: {
    hasActiveCourse() {
      return this.activeCourses.length > 0;
    }
  },
  created() {
    // 从课程服务中获取课程数据
    this.courses = courseService.getAllCourses();
    // 模拟区分进行中和即将开始的课程
    this.activeCourses = this.courses.filter(course => course.status === 'active');
    this.upcomingCourses = this.courses.filter(course => course.status === 'upcoming');
  },
  methods: {
    handleViewCourse(courseId) {
      console.log('学生进入课堂:', courseId);
      const course = courseService.getCourseById(courseId);
      if (course) {
        // 保存当前课程信息到localStorage
        courseService.saveCurrentCourse(course);
        
        // 检查课程状态
        if (course.status === 'active') {
          // 如果课程正在进行中，直接进入课堂
          this.$router.push(`/student-live-class/${courseId}`).catch(err => {
            console.error('进入课堂失败:', err);
          });
        } else {
          // 如果课程未开始，显示提示
          this.$message({
            type: 'info',
            message: '课程还未开始，请等待老师开启课堂'
          });
        }
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

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.course-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.course-section {
  margin-bottom: 32px;
}

.section-title {
  margin-bottom: 16px;
  color: #333;
  font-size: 18px;
}

.active-course :deep(.el-card) {
  border: 2px solid #67C23A;
}

:deep(.el-tag) {
  height: 28px;
  padding: 0 12px;
  font-size: 14px;
}

:deep(.el-row) {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

:deep(.el-col) {
  padding-bottom: 20px;
}
</style> 