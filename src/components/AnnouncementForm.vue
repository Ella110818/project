<template>
  <div class="announce-form">
    <div class="content-wrapper" :class="{ 'show-form': showPublishForm }">
      <el-card class="announcement-list" :class="{ 'slide-left': showPublishForm }">
        <template #header>
          <div class="card-header">
            <el-input
              v-model="searchQuery"
              style="max-width: 350px; margin-right: 40px;"
              placeholder="请输入你要搜索的公告"
              class="input-with-select"
              @keyup.enter="handleSearch"
            >
              <template #append>
                <el-button :icon="Search" @click="handleSearch" style="color: #007bff;"/>
              </template>
            </el-input>
            <el-button type="primary" @click="showPublishForm = true" v-if="isTeacher">发布公告</el-button>
          </div>
        </template>
        <div class="page-content">
          <el-empty v-if="announcements.length === 0" description="暂无公告" />
          <div v-else v-loading="loading" class="announcement-list">
            <div v-for="announcement in announcements" :key="announcement.id" class="announcement-item">
              <TextScroll 
                :title="announcement.title"
                :content="announcement.content"
                :type="announcement.type"
                :created-at="announcement.created_at"
                :publisher="announcement.publisher_info"
              />
            </div>
            <!-- 分页器 -->
            <el-pagination
              v-if="total > 0"
              :current-page="page"
              :page-size="pageSize"
              :total="total"
              layout="total, prev, pager, next"
              @current-change="handlePageChange"
              class="pagination"
            />
          </div>
        </div>
      </el-card>

      <!-- 右侧发布公告表单 -->
      <el-card v-show="showPublishForm" class="publish-form" :class="{ 'slide-in': showPublishForm }">
        <template #header>
          <div class="form-header">
            <span class="title">发布公告</span>
            <el-button type="text" @click="closePublishForm">
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
        </template>
        <el-form 
          :model="form" 
          :rules="rules"
          ref="publishForm"
          label-position="top"
          @submit.prevent="handlePublish"
        >
          <el-form-item label="公告标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入公告标题" />
          </el-form-item>
          <el-form-item label="公告类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择公告类型" style="width: 100%">
              <el-option label="普通公告" value="info" />
              <el-option label="重要公告" value="warning" />
              <el-option label="紧急公告" value="danger" />
            </el-select>
          </el-form-item>
          <el-form-item label="公告内容" prop="content">
            <el-input
              v-model="form.content"
              type="textarea"
              :rows="8"
              placeholder="请输入公告内容"
            />
          </el-form-item>
          <el-form-item>
            <el-button 
              type="primary" 
              :loading="publishing"
              @click="handlePublish" 
              style="width: 100%"
            >
              {{ publishing ? '发布中...' : '发布' }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import TextScroll from '@/components/TextScroll.vue';
import { Search, Close } from '@element-plus/icons-vue';
import api from '@/api';

export default {
  name: 'AnnouncementForm',
  components: {
    TextScroll
  },
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const searchQuery = ref('');
    const showPublishForm = ref(false);
    const loading = ref(false);
    const publishing = ref(false);
    const publishForm = ref(null);
    const page = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    
    const form = ref({
      title: '',
      content: '',
      type: 'info'
    });

    const rules = {
      title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
      content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }],
      type: [{ required: true, message: '请选择公告类型', trigger: 'change' }]
    };

    const announcements = ref([]);
    
    // 判断是否为教师
    const isTeacher = computed(() => {
      return localStorage.getItem('userRole') === 'teacher';
    });

    // 获取公告列表
    const fetchAnnouncements = async () => {
      // 检查courseId是否存在
      if (!props.courseId) {
        console.error('courseId is required');
        ElMessage.error('课程ID不能为空');
        return;
      }

      try {
        loading.value = true;
        // 从localStorage获取当前课程ID作为备选
        const currentCourseId = props.courseId || localStorage.getItem('currentCourseId');
        
        if (!currentCourseId) {
          throw new Error('课程ID不能为空');
        }

        const response = await api.getCourseAnnouncements(currentCourseId, {
          page: page.value,
          size: pageSize.value,
          type: searchQuery.value ? searchQuery.value : undefined
        });
        
        if (response.code === 200) {
          announcements.value = response.data.items;
          total.value = response.data.total;
        } else {
          ElMessage.error(response.message || '获取公告列表失败');
        }
      } catch (error) {
        console.error('获取公告列表异常:', error);
        ElMessage.error(error.message || '获取公告列表失败，请稍后重试');
      } finally {
        loading.value = false;
      }
    };

    // 处理分页变化
    const handlePageChange = (newPage) => {
      page.value = newPage;
      fetchAnnouncements();
    };

    // 处理搜索
    const handleSearch = () => {
      page.value = 1; // 重置页码
      fetchAnnouncements();
    };

    // 发布公告
    const handlePublish = async () => {
      if (!props.courseId) {
        ElMessage.error('课程ID不能为空');
        return;
      }

      if (!publishForm.value) return;
      
      try {
        await publishForm.value.validate();
        
        publishing.value = true;
        const currentCourseId = props.courseId || localStorage.getItem('currentCourseId');
        
        if (!currentCourseId) {
          throw new Error('课程ID不能为空');
        }

        const response = await api.publishCourseAnnouncement(currentCourseId, {
          title: form.value.title,
          content: form.value.content,
          type: form.value.type
        });
        
        if (response.code === 200) {
          ElMessage.success('公告发布成功');
          closePublishForm();
          fetchAnnouncements(); // 刷新公告列表
        } else {
          ElMessage.error(response.message || '发布公告失败');
        }
      } catch (error) {
        console.error('发布公告异常:', error);
        ElMessage.error(error.message || '发布公告失败，请稍后重试');
      } finally {
        publishing.value = false;
      }
    };

    // 关闭发布表单
    const closePublishForm = () => {
      showPublishForm.value = false;
      form.value = {
        title: '',
        content: '',
        type: 'info'
      };
      if (publishForm.value) {
        publishForm.value.resetFields();
      }
    };

    // 组件挂载时获取公告列表
    onMounted(() => {
      fetchAnnouncements();
    });

    return {
      searchQuery,
      form,
      rules,
      publishForm,
      announcements,
      handlePublish,
      showPublishForm,
      loading,
      publishing,
      page,
      pageSize,
      total,
      handlePageChange,
      handleSearch,
      closePublishForm,
      isTeacher,
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

.pagination {
  margin-top: 20px;
  text-align: center;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style>