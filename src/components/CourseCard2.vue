<template>
  <el-card class="course-card" shadow="hover">
    <div class="course-header">
      <img 
        :src="courseImage" 
        alt="课程图片" 
        class="course-image"
        loading="lazy"
        @load="handleImageLoad"
        @error="handleImageError" 
      />
      <div class="image-placeholder" v-if="!imageLoaded"></div>
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
import kehuan1 from '@/assets/kehuan1.jpg'
import kehuan2 from '@/assets/kehuan2.jpg'
import kehuan3 from '@/assets/kehuan3.jpg'
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
      courseImages: [kehuan1, kehuan2, kehuan3, shuju],
      imageLoaded: false
    }
  },
  computed: {
    displayLocation() {
      return this.course.location || '线上课程';
    },
    courseImage() {
      if (!this.course.course_id) return this.courseImages[0];
      
      const idStr = String(this.course.course_id);
      let hashCode = 0;
      
      for (let i = 0; i < idStr.length; i++) {
        hashCode = ((hashCode << 5) - hashCode) + idStr.charCodeAt(i);
        hashCode = hashCode & hashCode;
      }
      
      const index = Math.abs(hashCode) % this.courseImages.length;
      return this.courseImages[index];
    }
  },
  mounted() {
    // 预加载图片
    const img = new Image();
    img.src = this.courseImage;
    img.onload = this.handleImageLoad;
  },
  methods: {
    handleImageLoad() {
      this.imageLoaded = true;
    },
    handleImageError(e) {
      console.error('课程图片加载失败，使用默认图片');
      e.target.src = this.courseImages[0];
    },
    viewCourse() {
      localStorage.setItem('currentCourseName', this.course.title);
      localStorage.setItem('currentCourseId', this.course.course_id);
      localStorage.setItem('currentCourseLocation', this.course.location);
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
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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
  background: #f5f7fa;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
  background-size: 400% 100%;
  animation: loading 1.4s ease infinite;
}

@keyframes loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

.course-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  display: block;
  will-change: transform;
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
  background: #fff;
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
  border-radius: 4px;
  background: #0A9CE7;
  border: none;
  color: #fff;
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
