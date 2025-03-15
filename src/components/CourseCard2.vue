<template>
  <el-card :body-style="{ padding: '0px' }" class="course-card" shadow="hover">
    <!-- 图片区域 -->
    <div class="image-wrapper">
      <img src="@/assets/class.png" alt="课程图片" class="course-image" />
    </div>

    <!-- 内容区域 -->
    <div class="course-info">
      <div class="course-header">
        <h3 class="course-title">{{ course.title }}</h3>
      </div>
      <el-button type="primary" @click="viewCourse">课程详情</el-button>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'CourseCard2',
  props: {
    course: {
      type: Object,
      required: true,
    },
  },
  methods: {
    viewCourse() {
      // 从 localStorage 获取用户角色
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'student') {
        this.$router.push(`/student-class-info/${this.course.id}`);
      } else {
        this.$router.push(`/class-info/${this.course.id}`);
      }
    },
  },
};
</script>

<style scoped>
.course-card {
  width: 100%;
  max-width: 280px;
  margin: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 260px;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9; /* 图片宽高比 16:10 */
  overflow: hidden;
}

.course-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  transition: transform 0.3s ease-in-out;
}

.course-image:hover {
  transform: scale(1.05);
}

.course-info {
  padding: 15px;
  text-align: left;
}

.course-header {
  margin-bottom: 20px;
}

.course-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.el-button {
  width: 100%;
}
</style> 
