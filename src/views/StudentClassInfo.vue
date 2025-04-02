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
              <div class="announcement-title">
                <el-tag :type="item.type" size="small" style="margin-right: 10px;">
                  {{ getAnnouncementTypeText(item.type) }}
                </el-tag>
                <h3>{{ item.title }}</h3>
              </div>
              <div class="announcement-info">
                <span class="publisher">{{ item.publisher?.name || '未知' }}</span>
                <span class="announcement-time">{{ formatTime(item.time) }}</span>
              </div>
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
import { ref, onMounted, computed, nextTick } from 'vue'
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
import api from '@/api'  // 添加api导入

const route = useRoute()
const activeTab = ref('announcements')
const classInfo = ref({})
const announcements = ref([])
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

// 学生基本信息
const studentAvatar = ref(require('@/assets/touxiang.jpg')) // 使用已存在的头像图片
const studentName = ref('朱嘉怡')
const studentId = ref('202301001129')
const studentDepartment = ref('计算机与信息技术学院')
const studentMajor = ref('计算机科学与技术')
const studentPhone = ref('123456789')

// 详细学情数据相关引用
const knowledgeGaugeRef = ref(null)
const homeworkGaugeRef = ref(null)
const examGaugeRef = ref(null)
const classStatusChartRef = ref(null)
const pkRadarChartRef = ref(null)

// 待办清单数据
const todoTasks = ref([
  { title: '第二章 线性表mooc作业', completed: true },
  { title: '第一章 章节测试', completed: true },
  { title: '第一章 笔记提交', completed: true },
  { title: '第三章 栈和队列预习', completed: false },
  { title: '第二章 线性表上机作业', completed: false }
])

// 添加加载状态
const announcementsLoading = ref(false)

// 添加课程加载状态
const courseLoading = ref(false)

// 添加资源加载状态
const resourcesLoading = ref(false)

// 移除原有的 assignments 声明
const mockAssignments = [
  {
    id: 1,
    title: '第一章作业',
    type: 'homework',
    description: '完成第一章课后习题',
    deadline: '2024-03-20 23:59',
    fullScore: 100,
    status: '未提交'
  },
  {
    id: 2,
    title: '期中考试',
    type: 'exam',
    description: '第1-5章内容考试',
    deadline: '2024-03-25 14:00',
    fullScore: 100,
    status: '未开始'
  },
  {
    id: 3,
    title: '第二章实验报告',
    type: 'homework',
    description: '提交第二章实验报告和源代码',
    deadline: '2024-03-30 23:59',
    fullScore: 100,
    status: '已提交'
  }
];

// 使用 mockAssignments 作为初始值
const assignments = ref(mockAssignments);

// 处理标签页切换
const handleTabClick = async (tab) => {
  console.log('Tab clicked:', tab.props.name)
  if (tab.props.name === 'resources' && resources.value.length === 0) {
    console.log('开始获取资源列表')
    await fetchResources()
  }
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

// 修改 handleAssignment 方法
const handleAssignment = (item) => {
  ElMessage.info(`正在打开${item.title}`);
  // 这里可以根据不同状态执行不同操作
  if (item.status === '未提交') {
    ElMessage.info('准备提交作业');
  } else if (item.status === '已提交') {
    ElMessage.info('查看已提交的作业');
  } else if (item.status === '已截止') {
    ElMessage.warning('作业已截止');
  }
};

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
const handlePreview = async (file) => {
  try {
    console.log('开始预览文件:', file)
    
    if (!file.id) {
      throw new Error('文件ID不能为空')
    }
    
    const response = await api.getResourceDetail(file.id)
    console.log('预览响应:', response)
    
    if (response.code === 200) {
      const resourceData = response.data
      if (!resourceData.file) {
        throw new Error('文件URL不能为空')
      }
      
      if (resourceData.type === 'video') {
        window.open(resourceData.file, '_blank')
        ElMessage.success('正在打开视频预览')
      } else if (resourceData.type === 'document' || resourceData.type === 'courseware') {
        window.open(resourceData.file, '_blank')
        ElMessage.success('正在打开文档预览')
      } else {
        ElMessage.info('该类型文件可能无法预览，建议下载后查看')
      }
    } else {
      throw new Error(response.message || '获取资源详情失败')
    }
  } catch (error) {
    console.error('预览文件失败:', error)
    ElMessage.error(`预览失败: ${error.message || '未知错误'}`)
  }
}

// 处理下载
const handleDownload = async (file) => {
  try {
    console.log('开始下载文件:', file)
    ElMessage.info(`正在获取下载链接：${file.name}`)
    
    if (!file.id) {
      throw new Error('文件ID不能为空')
    }
    
    const response = await api.downloadResource(file.id)
    console.log('下载响应:', response)
    
    // 处理文件流响应
    if (response instanceof Blob) {
      // 创建下载链接
      const url = window.URL.createObjectURL(response)
      const link = document.createElement('a')
      link.href = url
      link.download = file.name // 使用文件原始名称
      document.body.appendChild(link)
      link.click()
      
      // 清理
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      ElMessage.success(`文件 ${file.name} 开始下载`)
    } else if (response.code === 200 && response.data && response.data.downloadUrl) {
      // 处理下载链接
      window.open(response.data.downloadUrl, '_blank')
      ElMessage.success(`文件 ${file.name} 开始下载`)
    } else {
      throw new Error('获取下载链接失败')
    }
  } catch (error) {
    console.error('下载文件失败:', error)
    ElMessage.error(`下载失败: ${error.message || '未知错误'}`)
  }
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

// 修改announcements数据获取逻辑
const fetchAnnouncements = async (retry = 0) => {
  if (announcementsLoading.value) return
  
  try {
    announcementsLoading.value = true
    const courseId = route.params.id
    if (!courseId) {
      ElMessage.error('课程ID不能为空')
      return
    }

    console.log('开始获取公告列表 - 课程ID:', courseId)
    const response = await api.getCourseAnnouncements(courseId, {
      page: 1,
      size: 10
    })

    if (response.code === 200) {
      console.log('获取公告成功:', response.data)
      announcements.value = response.data.items.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        time: item.created_at,
        type: item.type,
        publisher: item.publisher_info
      }))
    } else {
      console.warn('获取公告列表返回错误码:', response.code, response.message)
      ElMessage.error(response.message || '获取公告列表失败')
    }
  } catch (error) {
    console.error('获取公告列表异常:', error)
    
    // 超时或网络错误时，最多重试2次
    if (retry < 2 && (error.code === 'ECONNABORTED' || !error.response)) {
      console.log(`获取公告列表失败，第${retry + 1}次重试...`)
      // 使用指数退避策略增加延迟
      const delay = 1000 * Math.pow(2, retry)
      setTimeout(() => {
        fetchAnnouncements(retry + 1)
      }, delay)
      return
    }
    
    // 设置默认数据，避免界面空白
    announcements.value = []
    ElMessage.error(`获取公告列表失败: ${error.message || '请检查网络连接'}`)
  } finally {
    announcementsLoading.value = false
  }
}

// 修改loadClassInfo方法
const loadClassInfo = async (retry = 0) => {
  if (courseLoading.value) return
  
  try {
    courseLoading.value = true
    const courseId = route.params.id
    console.log('加载课程ID:', courseId)
    
    if (!courseId) {
      ElMessage.error('课程ID不能为空')
      return
    }
    
    // 获取课程详情
    console.log('开始获取课程详情...')
    const courseResponse = await api.getCourseDetail(courseId)
    
    if (courseResponse.code === 200) {
      console.log('课程详情获取成功:', courseResponse.data)
      // 设置课程基本信息
      const courseData = courseResponse.data
      classInfo.value = {
        className: courseData.title,
        location: courseData.location,
        teacherName: ''  // 先设为空，稍后获取教师信息
      }
      
      // 获取教师信息
      if (courseData.teacher) {
        try {
          console.log('开始获取教师信息:', courseData.teacher)
          const teacherResponse = await api.getUserMessages(courseData.teacher)
          if (teacherResponse.code === 200 && teacherResponse.data) {
            classInfo.value.teacherName = teacherResponse.data.name || teacherResponse.data.username
            console.log('教师信息获取成功:', classInfo.value.teacherName)
          }
        } catch (teacherError) {
          console.error('获取教师信息失败:', teacherError)
          // 获取教师信息失败时使用教师ID
          classInfo.value.teacherName = courseData.teacher
        }
      }
      
      // 保存课程名称到本地存储
      localStorage.setItem('currentCourseName', courseData.title)
      currentCourseName.value = courseData.title
    } else {
      throw new Error(courseResponse.message || '获取课程详情失败')
    }
    
    // 获取公告列表
    await fetchAnnouncements()
    
    // ... 其他数据加载逻辑 ...
        
  } catch (error) {
    console.error('获取数据失败:', error)
    
    // 超时或网络错误时，最多重试2次
    if (retry < 2 && (error.code === 'ECONNABORTED' || !error.response)) {
      console.log(`获取课程信息失败，第${retry + 1}次重试...`)
      // 使用指数退避策略增加延迟
      const delay = 1000 * Math.pow(2, retry)
      setTimeout(() => {
        loadClassInfo(retry + 1)
      }, delay)
      return
    }
    
    // 设置默认数据，避免界面空白
    if (!classInfo.value.className) {
      classInfo.value = {
        className: currentCourseName.value || '课程名称',
        teacherName: '未知',
        location: '未知'
      }
    }
    
    ElMessage.error('加载课程信息失败: ' + (error.message || '请检查网络连接'))
  } finally {
    courseLoading.value = false
  }
}

// 计算总分百分比，最大为100
const finalGradePercentage = computed(() => {
  const finalGrade = Number(calculateFinalGrade())
  return Math.min(Math.round(finalGrade), 100)
})

// 根据进度获取对应的颜色
const getProgressColor = (percentage) => {
  if (percentage < 60) {
    return '#F56C6C'  // 红色
  } else if (percentage < 80) {
    return '#E6A23C'  // 橙色
  } else {
    return '#67C23A'  // 绿色
  }
}

// 添加公告类型转换方法
const getAnnouncementTypeText = (type) => {
  const types = {
    'info': '普通公告',
    'warning': '重要公告',
    'danger': '紧急公告'
  }
  return types[type] || '普通公告'
}

// 添加时间格式化方法
const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取资源列表
const fetchResources = async (retry = 0) => {
  if (resourcesLoading.value) return
  
  try {
    resourcesLoading.value = true
    const courseId = route.params.id
    console.log('获取资源列表 - 课程ID:', courseId)
    
    if (!courseId) {
      ElMessage.error('课程ID不能为空')
      return
    }

    const params = {
      page: 1,
      size: 1000
    }
    
    // 如果选择了特定分类
    if (activeCategory.value !== 'all') {
      params.type = activeCategory.value
    }
    
    // 如果有搜索关键词
    if (searchText.value) {
      params.search = searchText.value
    }
    
    console.log('请求参数:', params)
    
    const response = await api.getCourseResources(courseId, params)
    console.log('资源列表响应:', response)
    
    if (response.code === 200) {
      resources.value = response.data.items.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        size: formatFileSize(item.size || 0),
        uploadTime: formatTime(item.upload_time),
        uploader: item.uploader
      }))
      console.log('处理后的资源列表:', resources.value)
    } else {
      throw new Error(response.message || '获取资源列表失败')
    }
  } catch (error) {
    console.error('获取资源列表异常:', error)
    
    // 超时或网络错误时，最多重试2次
    if (retry < 2 && (error.code === 'ECONNABORTED' || !error.response)) {
      console.log(`获取资源列表失败，第${retry + 1}次重试...`)
      // 使用指数退避策略增加延迟
      const delay = 1000 * Math.pow(2, retry)
      setTimeout(() => {
        fetchResources(retry + 1)
      }, delay)
      return
    }
    
    // 设置默认为空数组
    resources.value = []
    ElMessage.error(`获取资源列表失败: ${error.message || '请检查网络连接'}`)
  } finally {
    resourcesLoading.value = false
  }
}

// 添加文件大小格式化函数
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
  background: linear-gradient(135deg, #ff9b44, #fc6076);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  flex: 1;
  height: 100px;
}

.stat-card:nth-child(1) {
  background: linear-gradient(135deg, #ff9b44, #fc6076);
}

.stat-card:nth-child(2) {
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
}

.stat-card:nth-child(3) {
  background: linear-gradient(135deg, #2196F3, #1976D2);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 24px;
  margin-right: 16px;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
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

.announcement-title {
  display: flex;
  align-items: center;
}

.announcement-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.publisher {
  color: #666;
  font-size: 14px;
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