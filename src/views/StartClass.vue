<template>
  <div class="common-layout">
    <el-main class="home-view">
      <!-- 添加轮播图组件 -->
      <div class="carousel-container">
        <el-carousel :interval="3000" height="400px">
          <el-carousel-item v-for="item in carouselItems" :key="item.id">
            <div class="carousel-content">
              <img :src="item.imageUrl" :alt="item.title">
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      
      <div class="course-container">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="course in courses" :key="course.id">
            <CourseCard1 :course="course" @view-course="handleViewCourse" />
          </el-col>
        </el-row>
      </div>
    </el-main>
  </div>
</template>

<script>
import CourseCard1 from '@/components/CourseCard1.vue';
import courseService from '@/services/courseService';
 //import Sidebar from '@/components/Sidebar.vue';
export default {
  name: 'StartClass',
  components: {
    CourseCard1,
  },
  data() {
    return {
      courses: [],
      carouselItems: [
        {
          id: 1,
          title: '智能表情识别',
          imageUrl: require('@/assets/image(1).png')
        },
        {
          id: 2,
          title: '教育定向',
          imageUrl: require('@/assets/制作轮播图 (2).png')
        },
        {
          id: 3,
          title: '知育课研',
          imageUrl: require('@/assets/制作轮播图 (3).png')
        }
      ]
    };
  },
  created() {
    // 从共享的课程服务中获取课程数据
    this.courses = courseService.getAllCourses();
  },
  methods: {
    handleViewCourse(courseId) {
      console.log('开始上课:', courseId);
      // 获取课程详情
      const course = courseService.getCourseById(courseId);
      if (course) {
        // 保存当前课程信息到localStorage
        courseService.saveCurrentCourse(course);
        // 根据用户角色跳转到不同的实时授课页面
        const userRole = localStorage.getItem('userRole');
        
        if (userRole === 'teacher') {
          this.$router.push(`/live-class/${courseId}`);
        } else if (userRole === 'student') {
          this.$router.push(`/student-live-class/${courseId}`);
        }
      }
    },
  },
};
</script>

<style scoped>
.common-layout {
  width: 100%;
  min-height: 100vh;
  padding: 0;
  margin: 0;
  overflow: hidden;
  position: relative;
  z-index: 0;
}

/* 移除背景图相关样式 */
.bg-image-container {
  display: none;
}

.home-view {
  padding: 0;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 60px);
  background-color: #fff; /* 添加白色背景 */
}

.carousel-container {
  margin: 0;
  padding: 0;
  width: 100%;
  position: relative;
  z-index: 1;
}

:deep(.el-carousel) {
  width: 100%;
  margin: 0;
}

:deep(.el-carousel__item) {
  width: 100% !important;
  height: 100%;
  border-radius: 0;
}

.carousel-content {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-content img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-container {
  width: 100%;
  max-width: 1400px;
  padding: 20px;
  box-sizing: border-box;
  margin-top: 20px;
}

:deep(.el-carousel__indicators) {
  transform: translateY(20px);
}

:deep(.el-carousel__button) {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #00d8ff;
  opacity: 0.6;
}

:deep(.el-carousel__indicator--active .el-carousel__button) {
  opacity: 1;
}

:deep(.el-row) {
  width: 100%;
  margin: 0 !important;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 60px;
}

:deep(.el-col) {
  padding: 10px;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  margin-bottom: 20px;
}

@media screen and (max-width: 768px) {
  .home-view {
    padding: 0;
  }
  
  .carousel-container,
  .course-container {
    max-width: 100%;
    padding: 10px;
  }
  
  :deep(.el-carousel) {
    height: 300px;
  }

  :deep(.el-row) {
    gap: 20px;
  }

  :deep(.el-col) {
    padding: 5px;
    margin-bottom: 10px;
  }
}

.h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #fff;
}
</style> 

