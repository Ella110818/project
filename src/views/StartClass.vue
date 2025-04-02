<template>
  <div class="common-layout">
    <el-main class="home-view">
      <!-- 添加轮播图组件 -->
      <div class="carousel-container">
        <el-carousel :interval="3000" type="card" height="400px">
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
import api from '@/api';

export default {
  name: 'StartClass',
  components: {
    CourseCard1,
  },
  data() {
    return {
      courses: [],
      loading: false,
      page: 1,
      pageSize: 10,
      total: 0,
      carouselItems: [
        {
          id: 1,
          title: '智能表情识别',
          imageUrl: require('@/assets/image(1).png')
        },
        {
          id: 2,
          title: '教育定向',
          imageUrl: require('@/assets/lunbotu2.png')
        },
        {
          id: 3,
          title: '知育课研',
          imageUrl: require('@/assets/design.png')
        }
      ]
    };
  },
  async created() {
    await this.fetchCourses();
  },
  methods: {
    // 获取课程列表
    async fetchCourses() {
      try {
        this.loading = true;
        const response = await api.getCourses(this.page, this.pageSize);
        
        if (response.code === 200) {
          // 将后端返回的数据格式转换为组件需要的格式
          this.courses = response.data.items.map(item => ({
            id: item.course_id,
            title: item.title,
            teacherName: item.teacher, // 注意这里可能需要额外调用获取教师信息的接口
            description: item.description,
            location: item.location,
            system: item.system,
            schedule: item.schedule,
            semester: item.semester
          }));
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

    async handleViewCourse(courseId) {
      try {
        const response = await api.getCourseDetail(courseId);
        
        if (response.code === 200) {
          const course = response.data;
          // 保存当前课程信息到localStorage
          localStorage.setItem('currentCourse', JSON.stringify(course));
          
          // 根据用户角色跳转到不同的实时授课页面
          const userRole = localStorage.getItem('userRole');
          
          if (userRole === 'teacher') {
            this.$router.push(`/live-class/${courseId}`);
          } else if (userRole === 'student') {
            this.$router.push(`/student-live-class/${courseId}`);
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
  min-height: 100vh;
  padding: 0;
  margin: 0;
  overflow: hidden;
  position: relative;
  background-color: #f5f7fa;
}

.home-view {
  padding: 0;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 60px);
  background-color: #f5f7fa;
}

.carousel-container {
  margin: 20px 0;
  padding: 0;
  width: 100%;
  max-width: 1200px;
  position: relative;
  z-index: 1;
  height: 400px;
}

.course-container {
  width: 100%;
  max-width: 1400px;
  padding: 20px 20px;
  box-sizing: border-box;
  margin-top: 20px;
}

.carousel-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel-content img {
  width: 100%;
  height: 100%;
  object-fit: fill;
  background-color: #4878ea;
}

:deep(.el-carousel__item) {
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #4878ea;
}

:deep(.el-carousel) {
  width: 100%;
  height: 100%;
  margin: 0 auto;
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

