<template>
  <el-card class="course-card" shadow="hover">
    <div class="course-header">
      <img 
        :src="courseImage" 
        alt="课程图片" 
        class="course-image"
        @error="handleImageError" 
      />
    </div>
    <div class="course-info">
      <h3 class="course-title">{{ course.title }}</h3>
      <span class="teacher">{{ teacherName }}</span>
      <el-button type="primary" @click="viewCourse">开始上课</el-button>
    </div>
  </el-card>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import kehuan2 from '@/assets/kehuan2.jpg'
import kehuan3 from '@/assets/kehuan3.jpg'
import kehuan4 from '@/assets/kehuan4.png'
import shuju from '@/assets/shuju.png'
import api from '@/api';

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
  setup(props, { emit }) {
    const teacherName = ref('');
    const defaultImage = ref(shuju);

    // 获取教师信息
    const fetchTeacherInfo = async () => {
      try {
        if (props.course.teacherName) {
          const response = await api.getUserMessages(props.course.teacherName);
          if (response.code === 200 && response.data) {
            teacherName.value = response.data.name || response.data.username;
          }
        }
      } catch (error) {
        console.error('获取教师信息失败:', error);
        teacherName.value = props.course.teacherName; // 如果获取失败，显示原始值
      }
    };

    const courseImages = [shuju, kehuan2, kehuan3, kehuan4];
    
    const courseImage = computed(() => {
      // 确保对字符串类型的ID也能正确处理
      if (!props.course.id) return courseImages[0];
      
      // 如果ID是字符串类型，使用字符串的长度或字符代码和来计算索引
      if (typeof props.course.id === 'string') {
        // 使用字符串的字符代码和来计算一个数字
        const sum = props.course.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return courseImages[sum % courseImages.length];
      }
      
      // 如果ID是数字，按原来的逻辑处理
      return courseImages[Math.abs(props.course.id) % courseImages.length];
    });

    // 处理图片加载错误
    const handleImageError = (e) => {
      console.error('课程图片加载失败，使用默认图片');
      e.target.src = defaultImage.value;
    };

    onMounted(() => {
      fetchTeacherInfo();
      // 添加调试日志
      console.log('课程对象:', props.course);
      console.log('计算的课程图片:', courseImage.value);
    });

    const viewCourse = () => {
      // 触发自定义事件，将课程ID传递给父组件
      emit('view-course', props.course.id);
    };

    return {
      courseImage,
      viewCourse,
      teacherName,
      handleImageError
    };
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
  height: 180px; /* 增加图片高度以更好地展示科技风格图片 */
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