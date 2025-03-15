<template>
  <div class="container">
    <div class="info-header">
      <div class="info-cards">
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ classInfo.className }}</div>
            <div class="stat-label">课程名称</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ classInfo.teacherName }}</div>
            <div class="stat-label">任课教师</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><Location /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ classInfo.location }}</div>
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
            <h3>{{ item.title }}</h3>
            <p>{{ item.content }}</p>
            <div class="announcement-time">发布时间：{{ item.time }}</div>
          </el-card>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="作业/考试" name="assignments">
        <div class="assignment-list">
          <el-empty v-if="assignments.length === 0" description="暂无作业或考试" />
          <el-card v-for="item in assignments" :key="item.id" class="assignment-item">
            <div class="assignment-header">
              <span class="assignment-title">{{ item.title }}</span>
              <el-tag :type="item.status === '已完成' ? 'success' : 'warning'">
                {{ item.status }}
              </el-tag>
            </div>
            <p>{{ item.description }}</p>
            <div class="assignment-footer">
              <span>截止时间：{{ item.deadline }}</span>
              <el-button type="primary" size="small" @click="viewAssignment(item.id)">
                查看详情
              </el-button>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="我的成绩" name="grades">
        <div class="grade-list">
          <el-table :data="grades" style="width: 100%">
            <el-table-column prop="name" label="考核项目" />
            <el-table-column prop="score" label="得分" />
            <el-table-column prop="fullScore" label="满分" />
            <el-table-column prop="weight" label="权重" />
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Document, User, Location } from '@element-plus/icons-vue'

const activeTab = ref('announcements')
const classInfo = ref({
  className: '课程名称',
  teacherName: '教师姓名',
  location: '教室位置'
})

const announcements = ref([])
const assignments = ref([])
const grades = ref([])

const handleTabClick = (tab) => {
  // 处理标签页切换逻辑
  console.log('切换到:', tab.props.name)
}

const viewAssignment = (id) => {
  // 查看作业详情
  console.log('查看作业:', id)
}

onMounted(async () => {
  // 这里可以添加获取数据的逻辑
  try {
    // await fetchClassInfo()
    // await fetchAnnouncements()
    // await fetchAssignments()
    // await fetchGrades()
  } catch (error) {
    console.error('获取数据失败:', error)
  }
})
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

.announcement-item {
  margin-bottom: 16px;
}

.announcement-time {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.assignment-item {
  margin-bottom: 16px;
}

.assignment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.assignment-title {
  font-size: 16px;
  font-weight: bold;
}

.assignment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  color: #909399;
  font-size: 14px;
}

.grade-list {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.custom-tabs {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}
</style> 