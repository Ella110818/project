<template>
  <div class="container">
    <div class="info-header">
      <div class="info-cards">
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ courseInfo.name }}</div>
            <div class="stat-label">课程名称</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ courseInfo.teacherName }}</div>
            <div class="stat-label">授课教师</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><Location /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ courseInfo.location }}</div>
            <div class="stat-label">上课地点</div>
          </div>
        </div>
      </div>
    </div>
    
    <el-tabs v-model="activeTab" class="custom-tabs">
      <el-tab-pane label="课程公告" name="announce">
        <div class="announcement-list">
          <div v-for="notice in announcements" :key="notice.id" class="announcement-item">
            <div class="announcement-header">
              <h3>{{ notice.title }}</h3>
              <span class="announcement-date">{{ notice.date }}</span>
            </div>
            <p class="announcement-content">{{ notice.content }}</p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="作业/考试" name="homework">
        <div class="homework-list">
          <div v-for="item in homeworkList" :key="item.id" class="homework-item">
            <div class="homework-info">
              <h3>{{ item.title }}</h3>
              <div class="homework-meta">
                <span>截止日期：{{ item.deadline }}</span>
                <span>状态：{{ item.status }}</span>
              </div>
            </div>
            <el-button type="primary" @click="viewHomework(item.id)">查看详情</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的成绩" name="grade">
        <div class="grade-container">
          <el-card class="grade-card left-card">
            <template #header>
              <div class="card-header">
                <span>课程考核方案</span>
                <span class="total-score">满分：100分</span>
              </div>
            </template>
            <div class="scheme-content">
              <div v-for="item in gradeScheme" :key="item.name" class="scheme-item">
                <div class="scheme-info">
                  <span class="scheme-name">{{ item.name }}</span>
                  <span class="scheme-score">{{ item.percentage }}%</span>
                </div>
                <el-progress :percentage="item.percentage" :show-text="false" />
              </div>
            </div>
          </el-card>
          
          <el-card class="grade-card right-card">
            <template #header>
              <div class="card-header">
                <span>我的成绩</span>
              </div>
            </template>
            <div class="grade-details">
              <div v-for="grade in myGrades" :key="grade.name" class="grade-item">
                <span class="grade-name">{{ grade.name }}</span>
                <span class="grade-value">{{ grade.score }}</span>
              </div>
              <div class="total-grade">
                <span>总成绩</span>
                <span>{{ totalGrade }}</span>
              </div>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="课程资源" name="resource">
        <div class="resource-container">
          <!-- 搜索和筛选区域 -->
          <div class="resource-header">
            <el-input
              v-model="resourceSearch"
              placeholder="搜索资源"
              class="search-input"
              :prefix-icon="Search"
            />
            <el-select v-model="resourceType" placeholder="资源类型" class="type-select">
              <el-option label="全部" value="" />
              <el-option label="课件" value="slides" />
              <el-option label="文档" value="document" />
              <el-option label="视频" value="video" />
              <el-option label="练习" value="exercise" />
            </el-select>
          </div>

          <!-- 资源列表区域 -->
          <div class="resource-content">
            <div v-for="(group, category) in groupedResources" :key="category" class="resource-group">
              <div class="resource-category">
                <el-icon><Folder /></el-icon>
                <span>{{ category }}</span>
                <span class="resource-count">({{ group.length }})</span>
              </div>
              <div class="resource-list">
                <div v-for="resource in group" :key="resource.id" 
                     class="resource-item" 
                     :class="{ 'new-resource': resource.isNew }">
                  <div class="resource-info">
                    <el-icon :class="getResourceIcon(resource.type)">
                      <component :is="getResourceIcon(resource.type)" />
                    </el-icon>
                    <div class="resource-details">
                      <div class="resource-name">{{ resource.name }}</div>
                      <div class="resource-meta">
                        <span>{{ resource.uploadTime }}</span>
                        <span>{{ resource.size }}</span>
                        <span v-if="resource.isNew" class="new-tag">新</span>
                      </div>
                    </div>
                  </div>
                  <div class="resource-actions">
                    <el-button type="primary" link @click="previewResource(resource)">
                      预览
                    </el-button>
                    <el-button type="primary" link @click="downloadResource(resource)">
                      下载
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Document, User, Location, Search, Folder, VideoCamera, Document as DocumentIcon } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const route = useRoute()
const courseId = computed(() => route.params.id)
const activeTab = ref('announce')

// 课程基本信息
const courseInfo = reactive({
  name: '',
  teacherName: '',
  location: ''
})

// 从后端API获取课程信息
const fetchCourseInfo = async () => {
  try {
    const response = await axios.get(`/api/courses/${courseId.value}`);
    const courseData = response.data;
    
    courseInfo.name = courseData.title || courseData.name;
    courseInfo.teacherName = courseData.teacher || '未分配教师';
    courseInfo.location = courseData.location || '待定';
  } catch (error) {
    console.error('获取课程信息失败:', error);
    ElMessage.error('获取课程信息失败，请稍后重试');
  }
}

// 公告列表
const announcements = ref([])

// 获取公告列表
const fetchAnnouncements = async () => {
  try {
    const response = await axios.get(`/api/courses/${courseId.value}/announcements`);
    announcements.value = response.data;
  } catch (error) {
    console.error('获取公告列表失败:', error);
    ElMessage.error('获取公告列表失败，请稍后重试');
  }
}

// 作业列表
const homeworkList = ref([])

// 获取作业列表
const fetchHomeworkList = async () => {
  try {
    const response = await axios.get(`/api/courses/${courseId.value}/tasks`);
    homeworkList.value = response.data;
  } catch (error) {
    console.error('获取作业列表失败:', error);
    ElMessage.error('获取作业列表失败，请稍后重试');
  }
}

// 成绩方案
const gradeScheme = ref([])
// 我的成绩
const myGrades = ref([])

// 获取成绩信息
const fetchGradeInfo = async () => {
  try {
    const [schemeResponse, gradesResponse] = await Promise.all([
      axios.get(`/api/courses/${courseId.value}/grade-scheme`),
      axios.get(`/api/courses/${courseId.value}/my-grades`)
    ]);
    
    gradeScheme.value = schemeResponse.data;
    myGrades.value = gradesResponse.data;
  } catch (error) {
    console.error('获取成绩信息失败:', error);
    ElMessage.error('获取成绩信息失败，请稍后重试');
  }
}

// 计算总成绩
const totalGrade = computed(() => {
  return myGrades.value.reduce((total, grade) => total + grade.score, 0)
})

// 资源搜索和筛选
const resourceSearch = ref('')
const resourceType = ref('')

// 课程资源数据
const resources = ref([])

// 获取资源列表
const fetchResources = async () => {
  try {
    const response = await axios.get(`/api/courses/${courseId.value}/resources`);
    resources.value = response.data;
  } catch (error) {
    console.error('获取资源列表失败:', error);
    ElMessage.error('获取资源列表失败，请稍后重试');
  }
}

// 根据搜索和筛选条件过滤资源
const filteredResources = computed(() => {
  return resources.value.filter(resource => {
    const matchSearch = resource.name.toLowerCase().includes(resourceSearch.value.toLowerCase())
    const matchType = !resourceType.value || resource.type === resourceType.value
    return matchSearch && matchType
  })
})

// 将资源按分类分组
const groupedResources = computed(() => {
  return filteredResources.value.reduce((groups, resource) => {
    if (!groups[resource.category]) {
      groups[resource.category] = []
    }
    groups[resource.category].push(resource)
    return groups
  }, {})
})

// 获取资源图标
const getResourceIcon = (type) => {
  switch (type) {
    case 'video':
      return VideoCamera
    case 'slides':
    case 'document':
    case 'exercise':
      return DocumentIcon
    default:
      return Document
  }
}

// 预览资源
const previewResource = async (resource) => {
  try {
    await axios.get(`/api/courses/${courseId.value}/resources/${resource.id}/preview`);
    // 处理预览逻辑
  } catch (error) {
    console.error('预览资源失败:', error);
    ElMessage.error('预览资源失败，请稍后重试');
  }
}

// 下载资源
const downloadResource = async (resource) => {
  try {
    const response = await axios.get(`/api/courses/${courseId.value}/resources/${resource.id}/download`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', resource.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('下载资源失败:', error);
    ElMessage.error('下载资源失败，请稍后重试');
  }
}

// 查看作业详情
const viewHomework = async (id) => {
  try {
    const response = await axios.get(`/api/courses/${courseId.value}/tasks/${id}`);
    // 处理作业详情展示逻辑
  } catch (error) {
    console.error('获取作业详情失败:', error);
    ElMessage.error('获取作业详情失败，请稍后重试');
  }
}

// 在组件挂载时获取所有数据
onMounted(async () => {
  await Promise.all([
    fetchCourseInfo(),
    fetchAnnouncements(),
    fetchHomeworkList(),
    fetchGradeInfo(),
    fetchResources()
  ]);
})
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.info-header {
  margin-bottom: 24px;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px -1px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #1890ff;
  background: #e6f7ff;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #8c8c8c;
}

.custom-tabs {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.announcement-item {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.announcement-date {
  color: #8c8c8c;
  font-size: 14px;
}

.homework-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.homework-meta {
  color: #8c8c8c;
  font-size: 14px;
  margin-top: 8px;
}

.homework-meta span {
  margin-right: 20px;
}

.grade-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
}

.grade-card {
  background: white;
  border-radius: 8px;
}

.scheme-content {
  padding: 20px;
}

.scheme-item {
  margin-bottom: 20px;
}

.scheme-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.grade-details {
  padding: 20px;
}

.grade-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.total-grade {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 2px solid #1890ff;
  font-weight: bold;
  font-size: 16px;
}

.resource-container {
  padding: 20px;
}

.resource-header {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.search-input {
  width: 300px;
}

.type-select {
  width: 150px;
}

.resource-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.resource-group {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.resource-category {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #ebeef5;
  font-weight: 500;
  color: #333;
}

.resource-category .el-icon {
  margin-right: 8px;
  color: #909399;
}

.resource-count {
  margin-left: 8px;
  color: #909399;
  font-size: 14px;
}

.resource-list {
  padding: 0;
}

.resource-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
  transition: all 0.3s ease;
}

.resource-item:hover {
  background: #f5f7fa;
}

.resource-item.new-resource {
  background: #f0f9ff;
}

.resource-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.resource-info .el-icon {
  font-size: 24px;
  color: #409eff;
}

.resource-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.resource-name {
  font-size: 14px;
  color: #333;
}

.resource-meta {
  font-size: 12px;
  color: #909399;
}

.resource-meta span {
  margin-right: 16px;
}

.new-tag {
  background: #f56c6c;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.resource-actions {
  display: flex;
  gap: 16px;
}

.resource-actions .el-button {
  padding: 4px 0;
}
</style> 