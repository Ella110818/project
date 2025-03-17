<template>
  <div class="container">
    <div class="info-header">
      <div class="info-cards">
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ classInfo.className || currentCourseName }}</div>
            <div class="stat-label">课程名称</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ classInfo.teacherName || '教师姓名' }}</div>
            <div class="stat-label">任课教师</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><Location /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ classInfo.location || '教室位置' }}</div>
            <div class="stat-label">上课地点</div>
          </div>
        </div>
      </div>
    </div>
    
    <el-tabs v-model="activeTab" @tab-click="handleTabClick" class="custom-tabs">
      <el-tab-pane label="课程公告" name="announcements">
        <div class="announcement-list">
          <el-empty v-if="announcements.length === 0" description="暂无公告" />
          <el-card v-for="item in announcements" :key="item.id" class="announcement-item">
            <div class="announcement-header">
              <h3>{{ item.title }}</h3>
              <span class="announcement-time">{{ item.time }}</span>
            </div>
            <p class="announcement-content">{{ item.content }}</p>
          </el-card>
        </div>
      </el-tab-pane>

      <el-tab-pane label="作业/考试" name="assignments">
        <div class="assignment-list">
          <el-empty v-if="assignments.length === 0" description="暂无作业或考试" />
          <el-card v-for="item in assignments" :key="item.id" class="assignment-item">
            <div class="assignment-header">
              <div class="assignment-title-group">
                <span class="assignment-type-tag" :class="item.type">{{ item.type === 'exam' ? '考试' : '作业' }}</span>
                <h3>{{ item.title }}</h3>
              </div>
              <el-tag :type="getStatusType(item.status)">{{ item.status }}</el-tag>
            </div>
            <div class="assignment-info">
              <p>{{ item.description }}</p>
              <div class="assignment-meta">
                <span>截止时间：{{ item.deadline }}</span>
                <span>满分：{{ item.fullScore }}分</span>
              </div>
            </div>
            <div class="assignment-actions">
              <el-button 
                type="primary" 
                :disabled="item.status === '已截止'"
                @click="handleAssignment(item)">
                {{ getActionButtonText(item.status) }}
              </el-button>
            </div>
          </el-card>
        </div>
      </el-tab-pane>

      <el-tab-pane label="成绩单" name="grades">
        <div class="grade-container">
          <!-- 考核方案 -->
          <el-card class="grade-card left-card">
            <template #header>
              <div class="card-header">
                <span>课程考核方案</span>
                <span class="total-score">满分：100分</span>
              </div>
            </template>
            <div class="scheme-content">
              <div class="scheme-item" v-for="(item, index) in assessmentScheme" :key="index">
                <div class="scheme-info">
                  <span class="scheme-name">{{ item.name }}</span>
                  <span class="scheme-score">{{ item.score }}分</span>
                </div>
                <el-progress :percentage="item.score" :show-text="false" />
              </div>
            </div>
          </el-card>

          <!-- 个人成绩概览 -->
          <el-card class="grade-card right-card">
            <template #header>
              <div class="card-header">
                <span>个人成绩概览</span>
              </div>
            </template>
            <div class="statistics">
              <div class="chart-container">
                <el-progress type="dashboard" :percentage="finalGradePercentage" :width="150" :stroke-width="10" />
                <div class="chart-label">总成绩</div>
              </div>
              <div class="score-details">
                <div class="score-item">
                  <span class="score-label">课堂成绩：</span>
                  <span class="score-value">{{ calculateComponentGrade('课堂') }}</span>
                </div>
                <div class="score-item">
                  <span class="score-label">作业成绩：</span>
                  <span class="score-value">{{ calculateComponentGrade('作业') }}</span>
                </div>
                <div class="score-item">
                  <span class="score-label">考试成绩：</span>
                  <span class="score-value">{{ calculateComponentGrade('考试') }}</span>
                </div>
                <div class="score-item total">
                  <span class="score-label">总成绩：</span>
                  <span class="score-value">{{ calculateFinalGrade() }}</span>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 成绩详情列表 -->
          <el-card class="grade-card full-width">
            <template #header>
              <div class="card-header">
                <span>成绩详情</span>
              </div>
            </template>
            <el-table :data="grades" style="width: 100%">
              <el-table-column prop="name" label="项目名称" width="180" />
              <el-table-column prop="type" label="类型" width="120">
                <template #default="scope">
                  <el-tag :type="scope.row.type === 'exam' ? 'danger' : 'primary'">
                    {{ scope.row.type === 'exam' ? '考试' : '作业' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="score" label="得分" width="120" />
              <el-table-column prop="fullScore" label="满分" width="120" />
              <el-table-column prop="weight" label="权重(%)" width="120" />
              <el-table-column prop="submitTime" label="提交时间" />
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>

      <el-tab-pane label="课程资源" name="resources">
        <div class="resource-container">
          <!-- 主要内容区 -->
          <div class="resource-content">
            <!-- 左侧分类导航 -->
            <div class="resource-nav">
              <el-menu
                :default-active="activeCategory"
                @select="handleCategorySelect"
              >
                <el-menu-item index="all">
                  <el-icon><Document /></el-icon>
                  <span>全部文件</span>
                </el-menu-item>
                <el-menu-item index="courseware">
                  <el-icon><Collection /></el-icon>
                  <span>课件</span>
                </el-menu-item>
                <el-menu-item index="video">
                  <el-icon><VideoPlay /></el-icon>
                  <span>视频</span>
                </el-menu-item>
                <el-menu-item index="document">
                  <el-icon><Files /></el-icon>
                  <span>文档</span>
                </el-menu-item>
                <el-menu-item index="other">
                  <el-icon><More /></el-icon>
                  <span>其他</span>
                </el-menu-item>
              </el-menu>
            </div>

            <!-- 右侧文件列表 -->
            <div class="resource-list-container">
              <!-- 搜索栏 -->
              <div class="search-bar">
                <el-input
                  v-model="searchText"
                  placeholder="搜索文件"
                  prefix-icon="Search"
                />
              </div>
              
              <!-- 面包屑导航 -->
              <el-breadcrumb separator="/" class="resource-breadcrumb">
                <el-breadcrumb-item :to="{ path: '/' }">课程资源</el-breadcrumb-item>
                <el-breadcrumb-item v-if="currentFolder">{{ currentFolder }}</el-breadcrumb-item>
              </el-breadcrumb>

              <!-- 文件列表 -->
              <el-empty v-if="filteredResources.length === 0" description="暂无课程资源" />
              <el-table
                v-else
                :data="filteredResources"
                style="width: 100%; margin-top: 15px;"
                @row-click="handleRowClick"
              >
                <el-table-column width="50">
                  <template #default="scope">
                    <el-icon :size="20">
                      <component :is="getFileIcon(scope.row.type)" />
                    </el-icon>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="文件名" min-width="200">
                  <template #default="scope">
                    <span class="file-name">{{ scope.row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="size" label="大小" width="120">
                  <template #default="scope">
                    {{ scope.row.size }}
                  </template>
                </el-table-column>
                <el-table-column prop="uploadTime" label="上传时间" width="180" />
                <el-table-column prop="uploader" label="上传者" width="120" />
                <el-table-column label="操作" width="100" fixed="right">
                  <template #default="scope">
                    <el-button link type="primary" @click.stop="handleDownload(scope.row)">
                      下载
                    </el-button>
                    <el-button link type="primary" @click.stop="handlePreview(scope.row)">
                      预览
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { 
  Document, 
  User, 
  Location, 
  VideoPlay, 
  Folder,
  Collection,
  Files,
  More
} from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

    const route = useRoute()
    const activeTab = ref('announcements')
    const classInfo = ref({})
    const announcements = ref([])
    const assignments = ref([])
    const grades = ref([])
const resources = ref([])
const assessmentScheme = ref([
  { name: '课堂', score: 30 },
  { name: '作业', score: 20 },
  { name: '考试', score: 50 }
])

// 资源列表相关
const activeCategory = ref('all')
const currentFolder = ref('')
const searchText = ref('')

// 计算总分百分比，最大为100
const finalGradePercentage = computed(() => {
  const finalGrade = Number(calculateFinalGrade())
  return Math.min(Math.round(finalGrade), 100)
})

// 处理标签页切换
    const handleTabClick = (tab) => {
      console.log('切换到:', tab.props.name)
    }

// 获取状态对应的类型
    const getStatusType = (status) => {
      const types = {
        '未开始': 'info',
        '进行中': 'warning',
        '已提交': 'success',
        '已截止': 'danger',
        '已批改': 'success'
      }
      return types[status] || 'info'
    }

// 获取操作按钮文本
    const getActionButtonText = (status) => {
      const texts = {
        '未开始': '查看详情',
        '进行中': '开始答题',
        '已提交': '查看详情',
        '已截止': '查看详情',
        '已批改': '查看成绩'
      }
      return texts[status] || '查看详情'
    }

// 处理作业/考试操作
    const handleAssignment = (item) => {
      console.log('处理作业/考试:', item)
  ElMessage.info(`正在打开${item.title}`)
      // 根据不同状态执行不同操作
    }

// 计算某个类型的成绩
const calculateComponentGrade = (componentType) => {
  const filteredGrades = grades.value.filter(g => {
    if (componentType === '课堂') return g.type === 'class'
    if (componentType === '作业') return g.type === 'homework'
    if (componentType === '考试') return g.type === 'exam'
    return false
  })
  
  if (filteredGrades.length === 0) return '0'
  
  const totalWeight = filteredGrades.reduce((acc, curr) => acc + curr.weight, 0)
  if (totalWeight === 0) return '0'
  
  const weightedSum = filteredGrades.reduce((acc, curr) => {
    return acc + (curr.score / curr.fullScore) * curr.weight
  }, 0)
  
  return weightedSum.toFixed(1)
}

// 计算总成绩
    const calculateFinalGrade = () => {
  if (grades.value.length === 0) return '0.0'
  
  const totalWeight = grades.value.reduce((acc, curr) => acc + curr.weight, 0)
  if (totalWeight === 0) return '0.0'
  
      const weightedSum = grades.value.reduce((acc, curr) => {
        return acc + (curr.score / curr.fullScore) * curr.weight
      }, 0)
  
  return weightedSum.toFixed(1)
}

// 根据文件类型获取对应图标
const getFileIcon = (type) => {
  const iconMap = {
    courseware: Collection,
    video: VideoPlay,
    document: Files,
    folder: Folder,
    pdf: Document
  }
  return iconMap[type] || Document
}

// 处理资源分类切换
const handleCategorySelect = (index) => {
  activeCategory.value = index
}

// 处理行点击事件
const handleRowClick = (row) => {
  if (row.type === 'folder') {
    currentFolder.value = row.name
  } else {
    handlePreview(row)
  }
}

// 处理预览
const handlePreview = (file) => {
  ElMessage.info(`预览文件: ${file.name}`)
  // 在此处添加预览逻辑，如打开PDF预览器或视频播放器
}

// 处理下载
const handleDownload = (file) => {
  ElMessage.success(`开始下载: ${file.name}`)
  // 在此处添加下载逻辑
}

// 筛选资源
const filteredResources = computed(() => {
  let result = resources.value
  
  // 按分类筛选
  if (activeCategory.value !== 'all') {
    result = result.filter(item => item.type === activeCategory.value)
  }
  
  // 按搜索文本筛选
  if (searchText.value) {
    const searchLower = searchText.value.toLowerCase()
    result = result.filter(item => 
      item.name.toLowerCase().includes(searchLower)
    )
  }
  
  return result
})

// 在script部分
const currentCourseName = ref('');

// 组件挂载时加载数据
onMounted(() => {
  // 从localStorage获取课程名称
  currentCourseName.value = localStorage.getItem('currentCourseName') || '课程名称';
  
  // 加载课程信息
  loadClassInfo();
})

// 加载课程信息及相关数据
const loadClassInfo = async () => {
  try {
      const classId = route.params.id
    console.log('加载课程ID:', classId)
    
        // 模拟数据，实际开发中应替换为API调用
        classInfo.value = {
          className: '脑机接口',
          teacherName: '张教授',
          location: '主教学楼301'
        }
        
        announcements.value = [
          {
            id: 1,
            title: '关于期中考试安排的通知',
            content: '各位同学，期中考试将于下周三进行，请做好准备。考试内容包括前六章的所有内容。考试形式为闭卷，时长2小时。',
            time: '2023-04-15 14:30'
          },
          {
            id: 2,
            title: '本周课堂安排调整',
            content: '由于学校活动，本周五的课程将调整到下周一下午2点，地点不变。请各位同学相互通知。',
            time: '2023-04-10 09:15'
          }
        ]
        
        assignments.value = [
          {
            id: 1,
            title: '脑机接口第一次作业',
            type: 'homework',
            status: '已批改',
            description: '请完成教材第三章习题1-5，并提交电子版。',
            deadline: '2023-03-20 23:59',
            fullScore: 100
          },
          {
            id: 2,
            title: '期中考试',
            type: 'exam',
            status: '进行中',
            description: '考试范围：第1-6章，考试时长：120分钟',
            deadline: '2023-04-20 16:00',
            fullScore: 100
          },
          {
            id: 3,
            title: '脑机接口第二次作业',
            type: 'homework',
            status: '未开始',
            description: '请完成教材第五章习题8-12，并提交电子版。',
            deadline: '2023-04-30 23:59',
            fullScore: 100
          }
        ]
        
        grades.value = [
          {
            id: 1,
        name: '课堂表现',
        type: 'class',
        score: 27,
        fullScore: 30,
        weight: 30,
        submitTime: '2023-04-15'
      },
      {
        id: 2,
            name: '第一次作业',
            type: 'homework',
        score: 18,
        fullScore: 20,
            weight: 10,
            submitTime: '2023-03-19 22:30'
          },
          {
        id: 3,
            name: '第二次作业',
            type: 'homework',
        score: 17,
        fullScore: 20,
            weight: 10,
            submitTime: '2023-04-05 23:40'
          },
          {
        id: 4,
            name: '期中考试',
            type: 'exam',
        score: 42,
        fullScore: 50,
        weight: 50,
            submitTime: '2023-04-20 15:30'
          }
        ]
    
    resources.value = [
      {
        id: 1,
        name: '脑机接口导论.pdf',
        type: 'document',
        size: '2.5MB',
        uploadTime: '2023-03-01',
        uploader: '张教授'
      },
      {
        id: 2,
        name: '脑机接口技术演示视频.mp4',
        type: 'video',
        size: '68MB',
        uploadTime: '2023-03-15',
        uploader: '张教授'
      },
      {
        id: 3,
        name: '参考资料.zip',
        type: 'document',
        size: '15MB',
        uploadTime: '2023-03-20',
        uploader: '张教授'
      },
      {
        id: 4,
        name: '课件打包.zip',
        type: 'document',
        size: '45MB',
        uploadTime: '2023-04-10',
        uploader: '张教授'
      },
      {
        id: 5,
        name: '第一章-脑机接口基础.pptx',
        type: 'courseware',
        size: '5.2MB',
        uploadTime: '2023-02-20',
        uploader: '张教授'
      },
      {
        id: 6,
        name: '第二章-信号采集.pptx',
        type: 'courseware',
        size: '7.8MB',
        uploadTime: '2023-03-05',
        uploader: '张教授'
      },
      {
        id: 7,
        name: '实验指导书.pdf',
        type: 'document',
        size: '3.1MB',
        uploadTime: '2023-03-25',
        uploader: '张教授'
      },
      {
        id: 8,
        name: '实验演示视频.mp4',
        type: 'video',
        size: '120MB',
        uploadTime: '2023-03-30',
        uploader: '张教授'
      }
    ]
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('加载课程信息失败')
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
}

.info-header {
  margin-bottom: 20px;
}

.info-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  flex: 1;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px 0 rgba(0,0,0,0.15);
}

.stat-icon {
  font-size: 24px;
  margin-right: 16px;
  color: #409EFF;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.custom-tabs {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

/* 公告样式 */
.announcement-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.announcement-item {
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.announcement-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px 0 rgba(0,0,0,0.15);
}

.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.announcement-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.announcement-time {
  font-size: 14px;
  color: #909399;
}

.announcement-content {
  color: #606266;
  line-height: 1.6;
}

/* 作业/考试样式 */
.assignment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.assignment-item {
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.assignment-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px 0 rgba(0,0,0,0.15);
}

.assignment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.assignment-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.assignment-type-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
}

.assignment-type-tag.exam {
  background-color: #F56C6C;
}

.assignment-type-tag.homework {
  background-color: #409EFF;
}

.assignment-info {
  margin: 12px 0;
}

.assignment-meta {
  display: flex;
  justify-content: space-between;
  color: #909399;
  font-size: 14px;
  margin-top: 8px;
}

.assignment-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

/* 成绩样式 */
.grade-container {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.grade-card {
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

.grade-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px 0 rgba(0,0,0,0.15);
}

.left-card, .right-card {
  flex: 1;
  min-width: 300px;
}

.full-width {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-score {
  color: #909399;
  font-size: 14px;
}

.scheme-content {
  padding: 10px 0;
}

.scheme-item {
  margin-bottom: 20px;
}

.scheme-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.scheme-name {
  font-weight: 500;
  color: #303133;
}

.scheme-score {
  color: #606266;
}

.statistics {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.chart-container {
  margin-bottom: 24px;
  text-align: center;
}

.chart-label {
  margin-top: 8px;
  color: #606266;
  font-size: 16px;
}

.score-details {
  width: 100%;
}

.score-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #ebeef5;
}

.score-item.total {
  border-top: 1px solid #ebeef5;
  border-bottom: none;
  padding-top: 16px;
  margin-top: 8px;
}

.score-label {
  color: #606266;
}

.score-value {
  color: #303133;
  font-weight: 500;
}

/* 资源页面样式 */
.resource-container {
  padding: 10px 0;
}

.resource-content {
  display: flex;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
}

.resource-nav {
  width: 200px;
  border-right: 1px solid #ebeef5;
}

.resource-list-container {
  flex: 1;
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.resource-breadcrumb {
  margin-bottom: 15px;
  font-size: 14px;
}

.file-name {
  color: #303133;
  font-weight: 500;
  cursor: pointer;
}

.file-name:hover {
  color: #409EFF;
}

:deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
}

:deep(.el-menu-item.is-active) {
  background-color: #ecf5ff;
}

:deep(.el-menu-item:hover) {
  background-color: #f5f7fa;
}

@media screen and (max-width: 768px) {
  .info-cards {
    flex-direction: column;
  }
  
  .grade-container {
    flex-direction: column;
  }
  
  .resource-item {
    width: 100%;
  }
}

/* Element Plus组件样式覆盖 */
:deep(.el-progress-bar__inner) {
  transition: width 0.6s ease;
}

:deep(.el-progress-bar__outer) {
  background-color: #EBEEF5;
}

:deep(.el-progress--circle .el-progress__text) {
  font-size: 18px !important;
  font-weight: bold;
  color: #409EFF;
}
</style>