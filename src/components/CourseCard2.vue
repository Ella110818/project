<template>
  <el-card class="course-card" shadow="hover">
    <div class="course-header">
      <img src="@/assets/class.png" alt="课程图片" class="course-image" />
    </div>
    <div class="course-info">
      <h3 class="course-title">{{ course.title }}</h3>
      <span class="location">{{ displayLocation }}</span>
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
      default: () => ({}),
      validator: function(value) {
        return value.hasOwnProperty('id') && 
               value.hasOwnProperty('title') &&
               value.hasOwnProperty('location');
      }
    },
  },
  computed: {
    displayLocation() {
      return this.course.location || '线上课程';
    }
  },
  methods: {
    viewCourse() {
      // 在路由跳转前，保存课程信息到localStorage，以便在详情页面访问
      localStorage.setItem('currentCourseName', this.course.title);
      localStorage.setItem('currentCourseId', this.course.id);
      
      // 触发自定义事件，将课程ID传递给父组件
      this.$emit('view-course', this.course.id);
    },
  },
};
</script>

<style scoped>
.course-card {
  width: 360px;
  margin: 25px;
  border-radius: 12px;
  background: #fff;
  transition: all 0.3s ease;
  overflow: hidden;
}

.course-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.course-header {
  width: 100%;
  height: 140px;
  overflow: hidden;
}

.course-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-info {
  padding: 16px;
  position: relative;
  min-height: 100px;
}

.course-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 5px;
  line-height: 1.4;
  text-align: left;
  max-width: calc(100% - 150px);
}

.location {
  display: block;
  font-size: 14px;
  color: #666;
  margin: 8px 5px;
  text-align: left;
  max-width: calc(100% - 150px);
}

.el-button {
  position: absolute;
  right: 16px;
  top: 60%;
  transform: translateY(-50%);
  padding: 8px 30px;
  min-width: 120px;
  font-size: 14px;
  border-radius: 0;
  background: #0A9CE7;
  border: none;
}

.el-button:hover {
  background: #66b1ff;
}

:deep(.el-card__body) {
  padding: 0;
}

:deep(.el-card__body), .course-info {
  display: block;
  text-align: left;
}
</style> 
