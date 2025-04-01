<template>
  <el-card class="course-card" shadow="hover">
    <div class="course-header">
      <img :src="courseImage" alt="课程图片" class="course-image" />
    </div>
    <div class="course-info">
      <h3 class="course-title">{{ course.title }}</h3>
      <span class="teacher">{{ course.teacherName }}</span>
      <el-button type="primary" @click="viewCourse">开始上课</el-button>
    </div>
  </el-card>
</template>

<script>
import kehuan2 from '@/assets/kehuan2.jpg'
import kehuan3 from '@/assets/kehuan3.jpg'
import kehuan4 from '@/assets/kehuan4.png'
import shuju from '@/assets/shuju.png'

export default {
  name: 'CourseCard1',
  props: {
    course: {
      type: Object,
      required: true,
      default: () => ({}),
      validator: function(value) {
        return value.hasOwnProperty('id') && 
               value.hasOwnProperty('title') && 
               value.hasOwnProperty('teacherName');
      }
    },
  },
  data() {
    return {
      courseImages: [shuju, kehuan2, kehuan3, kehuan4]
    }
  },
  computed: {
    courseImage() {
      // 根据课程ID来选择图片，确保同一个课程始终显示相同的图片
      const index = this.course.id ? Math.abs(this.course.id) % this.courseImages.length : 0;
      return this.courseImages[index];
    }
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
  height: 200px; /* 增加图片高度以更好地展示科技风格图片 */
  overflow: hidden;
  position: relative;
}

.course-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.course-card:hover .course-image {
  transform: scale(1.05); /* 添加悬停时的图片放大效果 */
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
  max-width: calc(100% - 150px); /* 为更宽的按钮留出空间 */
}

.teacher {
  display: block;
  font-size: 14px;
  color: #666;
  margin-top: 8px;
  text-align: left;
  margin-left: 5px;
  max-width: calc(100% - 150px); /* 为更宽的按钮留出空间 */
}

.el-button {
  position: absolute;
  right: 16px;
  top: 60%;
  transform: translateY(-50%);
  padding: 8px 30px;  /* 增加内边距 */
  min-width: 120px;   /* 设置最小宽度 */
  font-size: 14px;
  border-radius: 0;
  background:#0A9CE7; 
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