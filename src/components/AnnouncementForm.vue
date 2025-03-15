<template>
  <div class="announce-form">
    <div class="content-wrapper" :class="{ 'show-form': showPublishForm }">
      <el-card class="announcement-list" :class="{ 'slide-left': showPublishForm }">
        <template #header>
          <div class="card-header">
            <el-input
              v-model="input3"
              style="max-width: 350px; margin-right: 40px;"
              placeholder="请输入你要搜索的公告"
              class="input-with-select"
            >
              <template #append>
                <el-button :icon="Search" style="color: #007bff;"/>
              </template>
            </el-input>
            <el-button type="primary" @click="showPublishForm = true">发布公告</el-button>
          </div>
        </template>
        <div class="page-content">
          <div v-for="(announcement, index) in announcements" :key="index" class="announcement-item">
            <TextScroll 
              :title="announcement.title"
              :content="announcement.content"
              :type="announcement.type"
            />
          </div>
        </div>
      </el-card>

      <!-- 右侧发布公告表单 -->
      <el-card v-show="showPublishForm" class="publish-form" :class="{ 'slide-in': showPublishForm }">
        <template #header>
          <div class="form-header">
            <span class="title">发布公告</span>
            <el-button type="text" @click="showPublishForm = false">
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
        </template>
        <el-form :model="form" label-position="top">
          <el-form-item label="公告标题">
            <el-input v-model="form.title" placeholder="请输入公告标题" />
          </el-form-item>
          <el-form-item label="公告类型">
            <el-select v-model="form.type" placeholder="请选择公告类型" style="width: 100%">
              <el-option label="普通公告" value="info" />
              <el-option label="重要公告" value="warning" />
              <el-option label="紧急公告" value="danger" />
            </el-select>
          </el-form-item>
          <el-form-item label="公告内容">
            <el-input
              v-model="form.content"
              type="textarea"
              :rows="8"
              placeholder="请输入公告内容"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handlePublish" style="width: 100%">发布</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import TextScroll from '@/components/TextScroll.vue';
import { Search, Close } from '@element-plus/icons-vue';

export default {
  name: 'AnnouncementForm',
  components: {
    TextScroll
  },
  setup() {
    const input3 = ref('');
    const showPublishForm = ref(false);
    const form = ref({
      title: '',
      content: '',
      type: 'info'
    });
    const announcements = ref([
      { 
        title: '关于期中考试的通知',
        content: '各位同学请注意，期中考试将于下周三进行，请做好准备。',
        type: 'info' 
      },
      { 
        title: '课程调整通知',
        content: '由于特殊原因，本周五的课程将调整到下周一。',
        type: 'warning' 
      }
    ]);

    const handlePublish = () => {
      if (form.value.title && form.value.content) {
        announcements.value.unshift({
          title: form.value.title,
          content: form.value.content,
          type: form.value.type
        });
        form.value.title = '';
        form.value.content = '';
        form.value.type = 'info';
        showPublishForm.value = false;
        ElMessage.success('公告发布成功');
      } else {
        ElMessage.error('标题和内容不能为空');
      }
    };

    return {
      input3,
      form,
      announcements,
      handlePublish,
      showPublishForm,
      Search,
      Close
    };
  }
};
</script>

<style scoped>
.announce-form {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.content-wrapper {
  display: flex;
  gap: 20px;
  height: 100%;
  position: relative;
  justify-content: center;
  transition: all 0.3s ease-in-out;
}

.content-wrapper.show-form {
  justify-content: flex-start;
}

.announcement-list {
  width: 680px;
  min-height: 600px;
  transition: transform 0.3s ease-in-out;
}

.announcement-list.slide-left {
  transform: translateX(0);
}

.publish-form {
  width: 450px;
  min-height: 600px;
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.3s ease-in-out;
}

.publish-form.slide-in {
  opacity: 1;
  transform: translateX(0);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-header .title {
  font-size: 16px;
  font-weight: 500;
}

.input-with-select {
  width: 350px;
}

.card-header {
  display: flex;
}

.page-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.announcement-item {
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.announcement-item:last-child {
  border-bottom: none;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style>