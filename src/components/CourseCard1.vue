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
        <div class="course-meta">
          <span class="teacher">{{ course.teacherName }}</span>
          <span class="location">{{ course.location }}</span>
        </div>
      </div>
      <el-button type="primary" @click="viewCourse">开始上课</el-button>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'CourseCard1',
  props: {
    course: {
      type: Object,
      required: true,
    },
  },
  methods: {
    viewCourse() {
      // 触发自定义事件，将课程ID传递给父组件
      this.$emit('view-course', this.course.id);
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
  height: auto;
  background-color: #fff;
  overflow: hidden;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
  background-color: #f5f7fa;
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
  padding: 16px;
  text-align: left;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.course-header {
  margin-bottom: 12px;
}

.course-title {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 8px 0;
  color: #333;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.course-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #666;
}

.teacher, .location {
  display: flex;
  align-items: center;
  opacity: 0.85;
}

.teacher::before {
  content: '👨‍🏫';
  margin-right: 4px;
}

.location::before {
  content: '📍';
  margin-right: 4px;
}

.el-button {
  width: 100%;
  margin-top: 12px;
  height: 36px;
  font-weight: 500;
  letter-spacing: 1px;
  border-radius: 6px;
  background-color: #409EFF;
  border-color: #409EFF;
  transition: all 0.3s ease;
}

.el-button:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
  transform: translateY(-1px);
}

.el-button:active {
  background-color: #3a8ee6;
  border-color: #3a8ee6;
  transform: translateY(0);
}
</style> 