<template>
  <div class="container">
    <div class="info-header">
      <div class="info-cards">
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ classInfo.className || '课程名称' }}</div>
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

     
    </el-tabs>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { Document, User, Location } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

export default {
  name: 'StudentClassInfo',
  setup() {
    const route = useRoute()
    const activeTab = ref('announcements')
    const classInfo = ref({})
    const announcements = ref([])
    const assignments = ref([])
    const grades = ref([])

    const handleTabClick = (tab) => {
      console.log('切换到:', tab.props.name)
    }

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

    const handleAssignment = (item) => {
      console.log('处理作业/考试:', item)
      // 根据不同状态执行不同操作
    }

    const calculateAverage = () => {
      if (grades.value.length === 0) return '0.00'
      const sum = grades.value.reduce((acc, curr) => acc + curr.score, 0)
      return (sum / grades.value.length).toFixed(2)
    }

    const calculateFinalGrade = () => {
      if (grades.value.length === 0) return '0.00'
      const weightedSum = grades.value.reduce((acc, curr) => {
        return acc + (curr.score / curr.fullScore) * curr.weight
      }, 0)
      return weightedSum.toFixed(2)
    }

    onMounted(async () => {
      const classId = route.params.id
      try {
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
            name: '第一次作业',
            type: 'homework',
            score: 92,
            fullScore: 100,
            weight: 10,
            submitTime: '2023-03-19 22:30'
          },
          {
            id: 2,
            name: '第二次作业',
            type: 'homework',
            score: 88,
            fullScore: 100,
            weight: 10,
            submitTime: '2023-04-05 23:40'
          },
          {
            id: 3,
            name: '期中考试',
            type: 'exam',
            score: 85,
            fullScore: 100,
            weight: 30,
            submitTime: '2023-04-20 15:30'
          }
        ]
      } catch (error) {
        console.error('获取数据失败:', error)
      }
    })

    return {
      activeTab,
      classInfo,
      announcements,
      assignments,
      grades,
      handleTabClick,
      getStatusType,
      getActionButtonText,
      handleAssignment,
      calculateAverage,
      calculateFinalGrade
    }
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
}

.stat-icon {
  font-size: 24px;
  margin-right: 16px;
  color: #409EFF;
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

.announcement-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.announcement-item {
  margin-bottom: 16px;
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

.assignment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.assignment-item {
  margin-bottom: 16px;
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

.grade-container {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.grade-summary {
  margin-top: 20px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 4px;
  display: flex;
  gap: 24px;
}

.summary-item {
  display: flex;
  align-items: center;
}

.summary-item .label {
  color: #606266;
  margin-right: 8px;
}

.summary-item .value {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}
</style>