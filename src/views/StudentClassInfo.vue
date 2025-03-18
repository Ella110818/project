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

      <el-tab-pane label="学情回顾" name="learning-review">
        <div class="learning-review-container">
          <!-- 课程日历选择器 -->
          <el-card class="calendar-card">
            <template #header>
              <div class="card-header">
                <span>课程日历</span>
                <el-select v-model="selectedMonth" placeholder="选择月份" @change="updateCalendarDays">
                  <el-option v-for="month in availableMonths" :key="month.value" :label="month.label" :value="month.value"></el-option>
                </el-select>
              </div>
            </template>
            <div class="calendar-container">
              <div class="calendar-days">
                <div v-for="day in calendarDays" :key="day.date" 
                     class="calendar-day" 
                     :class="{ 'has-class': day.hasClass, 'selected': selectedDate === day.date }"
                     @click="day.hasClass && selectDate(day.date)">
                  <span class="day-number">{{ new Date(day.date).getDate() }}</span>
                  <div v-if="day.hasClass" class="day-indicator"></div>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 用户自定义图表区域 -->
          <div class="user-custom-charts">
            <!-- 用户自行实现的可视化内容将放置在这里 -->
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

// 学情回顾相关数据
const attendanceRate = ref(85)
const totalClasses = ref(15)
const attendedClasses = ref(13)
const performanceRate = ref(78)
const classInteraction = ref(25)
const questionCount = ref(8)
const answerCount = ref(17)
const homeworkCompletionRate = ref(90)
const totalHomeworks = ref(10)
const completedHomeworks = ref(9)
const averageHomeworkScore = ref(88)
const trendTimeRange = ref('month')
const trendChartRef = ref(null)
const learningTips = ref([
  {
    title: '继续保持良好的出勤率',
    content: '你的出勤情况非常好，这对学习成果有积极影响。建议继续保持。',
    type: 'success'
  },
  {
    title: '可以提高课堂互动',
    content: '尝试在课堂上更多地参与讨论和提问，这将有助于加深对知识的理解。',
    type: 'warning'
  },
  {
    title: '作业完成度高',
    content: '你的作业完成度很高，说明学习态度认真。可以尝试在完成作业的同时更深入地思考问题。',
    type: 'success'
  },
  {
    title: '关注学习效率',
    content: '你的整体学习表现良好，但学习效率还有提升空间。建议合理规划时间，保证充足的课前预习和课后复习。',
    type: 'info'
  }
])

// 日历和选择日期相关
const selectedMonth = ref('2025-03')
const calendarDays = ref([])
const selectedDate = ref(null) // 当前选择的日期，为null表示未选择
const availableMonths = ref([
  { label: '2025年03月', value: '2025-03' },
  { label: '2025年02月', value: '2025-02' },
  { label: '2025年01月', value: '2025-01' }
])

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

// 更新日历数据
const updateCalendarDays = () => {
  const [year, month] = selectedMonth.value.split('-').map(Number)
  const daysInMonth = new Date(year, month, 0).getDate()
  const days = []
  
  // 生成当月所有日期，并随机标记有课的日期
  for(let i = 1; i <= daysInMonth; i++) {
    const date = `${year}-${month.toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`
    // 模拟数据：周一到周五的日期有60%几率有课
    const dayOfWeek = new Date(date).getDay()
    const hasClass = dayOfWeek >= 1 && dayOfWeek <= 5 ? Math.random() < 0.6 : false
    days.push({ date, hasClass })
  }
  
  calendarDays.value = days
}

// 选择日期
const selectDate = (date) => {
  selectedDate.value = date
  // 选择日期后的逻辑，不需要详细的可视化初始化
  console.log('选择日期:', date)
}

// 简化详细数据的图表初始化逻辑，只保留函数结构
const initDetailedCharts = () => {
  console.log('图表初始化会由用户自行实现')
  // 图表初始化逻辑由用户自行实现
}

// 简化学习趋势图表初始化
const initTrendChart = () => {
  console.log('趋势图初始化会由用户自行实现')
  // 趋势图初始化逻辑由用户自行实现
}

// 处理标签页切换
    const handleTabClick = (tab) => {
      console.log('切换到:', tab.props.name)
  // 如果切换到学情回顾标签页
  if (tab.props.name === 'learning-review') {
    // 使用nextTick确保DOM已经更新
    nextTick(() => {
      updateCalendarDays() // 初始化日历数据
      // 可视化初始化由用户自行实现
    })
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
            deadline: '2023-03-20 23:59',
            fullScore: 100
          },
          {
            id: 2,
            title: '期中考试',
            type: 'exam',
            status: '进行中',
            deadline: '2023-04-20 16:00',
            fullScore: 100
          },
          {
            id: 3,
            title: '脑机接口第二次作业',
            type: 'homework',
            status: '未开始',
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

/* 学情回顾样式 */
.learning-review-container {
  margin-top: 20px;
}

.review-card {
  margin-bottom: 20px;
  height: 100%;
}

.review-chart-container {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

/* 日历样式 */
.calendar-card {
  margin-bottom: 20px;
}

.calendar-container {
  padding: 10px 0;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.calendar-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  border-radius: 5px;
  cursor: default;
  position: relative;
}

.calendar-day.has-class {
  background-color: rgba(64, 158, 255, 0.1);
  cursor: pointer;
}

.calendar-day.has-class:hover {
  background-color: rgba(64, 158, 255, 0.2);
}

.calendar-day.selected {
  background-color: rgba(64, 158, 255, 0.3);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.day-number {
  font-size: 14px;
}

.day-indicator {
  width: 5px;
  height: 5px;
  background-color: #409EFF;
  border-radius: 50%;
  margin-top: 3px;
}

/* 详细学情样式 */
.daily-learning-detail {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px 0;
}

.student-info-section {
  grid-column: span 3;
  display: flex;
  background-color: #001529;
  color: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 10px;
}

.student-avatar {
  margin-right: 20px;
}

.avatar-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #00a8ff;
}

.student-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.detail-row {
  margin-bottom: 5px;
}

.detail-label {
  font-weight: bold;
  margin-right: 10px;
}

.data-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.completion-card {
  grid-column: span 3;
}

.gauges-container {
  display: flex;
  justify-content: space-around;
  padding: 20px;
}

.gauge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gauge-chart {
  width: 200px;
  height: 150px;
}

.gauge-label {
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
}

.todo-card {
  grid-column: span 1;
}

.todo-list {
  padding: 15px;
}

.todo-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.todo-item:hover {
  background-color: #f5f7fa;
}

.todo-text {
  margin-left: 8px;
}

.class-status-card {
  grid-column: span 1;
}

.pie-chart-container {
  height: 300px;
  width: 100%;
}

.comparison-card {
  grid-column: span 1;
}

.metrics-comparison {
  display: flex;
  justify-content: space-around;
  padding: 20px;
}

.metric-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metric-value {
  margin-bottom: 10px;
  font-weight: bold;
}

.percentage-value {
  display: block;
  font-size: 20px;
  font-weight: bold;
}

.growth-indicator {
  display: block;
  font-size: 12px;
  color: #67C23A;
}

.pk-card {
  grid-column: span 3;
}

.radar-chart-container {
  height: 400px;
  width: 100%;
}

.semester-overview {
  margin-top: 20px;
}

.progress-value {
  display: block;
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.progress-label {
  display: block;
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.review-metrics {
  margin-top: 15px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.metric-label {
  color: #606266;
}

.metric-value {
  font-weight: 500;
  color: #303133;
}

.trend-card {
  margin-bottom: 20px;
}

.trend-chart {
  height: 350px;
  width: 100%;
}

.suggestion-card {
  margin-bottom: 20px;
}

.suggestion-content {
  margin-top: 15px;
}

.suggestion-item {
  margin-bottom: 15px;
}
</style>