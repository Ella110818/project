<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="0px"></el-aside>
      <el-container>
        <!-- <el-header  class="header">Header</el-header> -->
        <router-view></router-view>
        <el-main class="home-view">
            <el-row :gutter="6">
                <el-col :span="6" v-for="course in courses" :key="course.id">
                <CourseCard2 :course="course" @view-course="handleViewCourse" />
                </el-col>
            </el-row>
        </el-main>
      </el-container>
    </el-container>
   
  </div>
</template>

<script>
import CourseCard2 from '@/components/CourseCard2.vue';
 //import Sidebar from '@/components/Sidebar.vue';
export default {
  name: 'MyClass',
  components: {
    CourseCard2,
  },
  data() {
    return {
      courses: [
        {
          id: 1,
          title: '课程1',
          description: '这是课程1的描述。',
        },
        {
          id: 2,
          title: '课程2',
          description: '这是课程2的描述。',
        },
        // 添加更多课程
      ],
    };
  },
  methods: {
    handleViewCourse(courseId) {
      console.log('查看课程:', courseId);
      // 这里可以跳转到课程详情页
      this.$router.push(`/myclass/course/${courseId}`);
    },
  },
};
</script>

<style scoped>
.common-layout{
  width:100%;
}
.home-view {
  padding: 15px;
  margin-left: 10px;
}

.h1 {
  text-align: center;
  margin-bottom: 20px;
}
.header {
  box-shadow: 0 1px 0 #ddd; /* 添加底部下划线 */
  display: flex;
  height: 56px;
  align-items: center; /* 垂直居中 */
  padding: 0 20px; /* 添加内边距 */
}


</style> 

