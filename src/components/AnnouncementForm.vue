<template>
  <div class="announcement-form">
    <el-form :model="form" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="form.title" placeholder="请输入公告标题" />
      </el-form-item>
      <el-form-item label="内容">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="4"
          placeholder="请输入公告内容"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">发布公告</el-button>
      </el-form-item>
    </el-form>

    <!-- 已发布的公告列表 -->
    <div class="announcement-list">
      <h3>已发布公告</h3>
      <el-timeline>
        <el-timeline-item
          v-for="item in announcements"
          :key="item.id"
          :timestamp="item.createTime"
          placement="top"
        >
          <el-card>
            <h4>{{ item.title }}</h4>
            <p>{{ item.content }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import axios from 'axios';

const route = useRoute();
const courseId = route.params.id;

const form = ref({
  title: '',
  content: ''
});

const announcements = ref([]);

// 获取公告列表
const fetchAnnouncements = async () => {
  try {
    const response = await axios.get(`/api/courses/${courseId}/announcements`);
    announcements.value = response.data;
  } catch (error) {
    console.error('获取公告列表失败:', error);
    ElMessage.error('获取公告列表失败，请稍后重试');
  }
};

// 提交公告
const submitForm = async () => {
  if (!form.value.title || !form.value.content) {
    ElMessage.warning('请填写完整的公告信息');
    return;
  }

  try {
    await axios.post(`/api/courses/${courseId}/announcements`, {
      title: form.value.title,
      content: form.value.content
    });
    
    ElMessage.success('公告发布成功！');
    form.value.title = '';
    form.value.content = '';
    
    // 重新获取公告列表
    fetchAnnouncements();
  } catch (error) {
    console.error('发布公告失败:', error);
    ElMessage.error('发布公告失败，请稍后重试');
  }
};

// 组件挂载时获取公告列表
onMounted(() => {
  fetchAnnouncements();
});
</script>

<style scoped>
.announcement-form {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.announcement-list {
  margin-top: 30px;
}

.el-timeline {
  margin-top: 20px;
  padding: 20px;
}

.el-timeline-item {
  position: relative;
}

.el-card {
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.el-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
}

h4 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

p {
  margin: 0;
  color: #606266;
  line-height: 1.6;
  font-size: 14px;
}

:deep(.el-timeline-item__timestamp) {
  color: #909399;
  font-size: 13px;
}

:deep(.el-timeline-item__node) {
  background-color: #409EFF;
}

:deep(.el-timeline-item__wrapper) {
  padding-left: 28px;
}

.el-form {
  max-width: 600px;
  margin: 0 auto;
}

.el-form-item:last-child {
  margin-bottom: 0;
  text-align: right;
}

h3 {
  color: #303133;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #EBEEF5;
}
</style>