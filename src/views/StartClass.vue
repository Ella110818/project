<template>
  <div class="common-layout">
    <div class="bg-image-container">
      <img src="@/assets/design2.png" alt="背景图片" class="bg-image" />
      <div class="overlay"></div>
    </div>
    
    <el-main class="home-view">
      <!-- 轮播图容器 -->
      <div class="carousel-container">
        <el-carousel 
          :interval="3000" 
          height="400px"
          :autoplay="true"
          indicator-position="none"
          arrow="always"
          type="card"
        >
          <el-carousel-item v-for="item in carouselItems" :key="item.id">
            <div class="carousel-card">
              <img :src="item.imageUrl" :alt="item.title" class="carousel-image"/>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>

      <div class="course-container">
        <el-row :gutter="60">
          <el-col 
            v-for="course in courses" 
            :key="course.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
          >
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
          title: '专注·困惑·分心',
          imageUrl: require('@/assets/background2.png')
        },
        {
          id: 2,
          title: '智能表情识别',
          imageUrl: require('@/assets/lunbotuimg.png')
        },
        {
          id: 3,
          title: '从表情到策略',
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
  position: relative;
  overflow: hidden;
  z-index: 0;
}

.bg-image-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(11, 24, 52, 0.3), rgba(22, 41, 86, 0.3));
  z-index: 1;
}

.home-view {
  padding: 0;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 60px);
  position: relative;
  z-index: 1;
}

.course-container {
  width: 100%;
  max-width: 1400px;
  padding: 20px 0;
  box-sizing: border-box;
  margin-top: 20px;
  position: relative;
  z-index: 1;
}

:deep(.el-row) {
  width: 100%;
  margin: 0 !important;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 60px;
  padding: 0 20px;
  box-sizing: border-box;
}

:deep(.el-col) {
  padding: 0;
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
    padding: 10px;
  }
  
  :deep(.el-row) {
    gap: 20px;
    padding: 0 10px;
  }

  :deep(.el-col) {
    margin-bottom: 10px;
  }
}

.carousel-container {
  margin: 20px auto;
  padding: 40px 0;
  width: 100%;
  max-width: 1400px;
  position: relative;
}

:deep(.el-carousel__item) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.el-carousel__item--card) {
  width: 50%;
}

:deep(.el-carousel__item--card.is-active) {
  transform: translateX(0) scale(1.05);
  z-index: 2;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.carousel-card {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  background: #fff;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

:deep(.el-carousel__arrow) {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 20px;
  z-index: 3;
}

:deep(.el-carousel__arrow:hover) {
  background-color: rgba(255, 255, 255, 0.3);
}

:deep(.el-carousel__arrow--left) {
  left: 20px;
}

:deep(.el-carousel__arrow--right) {
  right: 20px;
}
</style> 

