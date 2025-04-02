<template>
  <el-card class="course-card" shadow="hover">
    <div class="course-header">
      <img :src="courseImage" alt="课程图片" class="course-image" />
      <div class="course-overlay"></div>
    </div>
    <div class="course-info">
      <h3 class="course-title">{{ course.title }}</h3>
      <span class="location">{{ displayLocation }}</span>
      <el-button type="primary" @click="viewCourse">课程详情</el-button>
    </div>
  </el-card>
</template>

<script>
import kehuan2 from '@/assets/kehuan2.jpg'
import kehuan3 from '@/assets/kehuan3.jpg'
import kehuan4 from '@/assets/kehuan4.png'
import shuju from '@/assets/shuju.png'

export default {
  name: 'CourseCard2',
  props: {
    course: {
      type: Object,
      required: true,
      default: () => ({}),
      validator: function(value) {
        return value.hasOwnProperty('course_id') && 
               value.hasOwnProperty('title') &&
               value.hasOwnProperty('location');
      }
    },
  },
  data() {
    return {
      courseImages: [kehuan4, shuju, kehuan2, kehuan3]
    }
  },
  computed: {
    displayLocation() {
      return this.course.location || '线上课程';
    },
    courseImage() {
      // 使用 course_id 来选择图片
      const index = this.course.course_id ? (Math.abs(this.course.course_id) + 2) % this.courseImages.length : 0;
      return this.courseImages[index];
    }
  },
  methods: {
    viewCourse() {
      // 使用 course_id
      localStorage.setItem('currentCourseName', this.course.title);
      localStorage.setItem('currentCourseId', this.course.course_id);
      
      // 触发自定义事件，使用 course_id
      this.$emit('view-course', this.course.course_id);
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
  height: 180px;
  overflow: hidden;
  position: relative;
}

.course-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.course-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.course-card:hover .course-image {
  transform: scale(1.05);
}

.course-card:hover .course-overlay {
  opacity: 1;
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
