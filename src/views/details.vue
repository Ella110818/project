<template>
  <div class="student-details">
    <!-- 学生基本信息卡片 -->
    <div class="info-card">
      <div class="photo-section">
        <div class="photo-placeholder"></div>
      </div>
      <div class="basic-info">
        <div class="info-row">姓名</div>
        <div class="info-row">班级</div>
        <div class="info-row">学号</div>
        <div class="info-row">学院</div>
      </div>
    </div>

    <!-- 评价区域 -->
    <div class="evaluation-area">
      <div class="evaluation-header">
        <div class="header-item" :class="{ active: activeTab === 'academic' }" @click="switchTab('academic')">学术表现</div>
        <div class="header-item" :class="{ active: activeTab === 'behavior' }" @click="switchTab('behavior')">行为习惯</div>
        <div class="header-item" :class="{ active: activeTab === 'overall' }" @click="switchTab('overall')">学生总体评价</div>
      </div>

      <div class="evaluation-content">
        <!-- 学术表现内容 -->
        <div v-if="activeTab === 'academic'">
          <!-- 状态评估 -->
          <div class="status-section">
            <div class="status-header">
              <span class="status-title">状态</span>
              <span class="status-date">日期：{{ currentDate }}</span>
            </div>
            <div class="metrics-list">
              <div class="metric-item">
                <span class="metric-label">专注度</span>
                <el-progress :percentage="studentMetrics.attention"></el-progress>
              </div>
              <div class="metric-item">
                <span class="metric-label">低头度</span>
                <el-progress :percentage="studentMetrics.headDown"></el-progress>
              </div>
              <div class="metric-item">
                <span class="metric-label">疑惑度</span>
                <el-progress :percentage="studentMetrics.confusion"></el-progress>
              </div>
              <div class="metric-item">
                <span class="metric-label">(总体)</span>
                <el-progress :percentage="studentMetrics.overall"></el-progress>
              </div>
            </div>
          </div>

          <!-- 作业和考试区域 -->
          <div class="performance-section">
            <div class="performance-box">
              <div class="box-header">作业</div>
              <div class="box-date">日期：{{ currentDate }}</div>
              <div class="box-content">{{ evaluations.homework }}</div>
            </div>
            <div class="performance-box">
              <div class="box-header">考试</div>
              <div class="box-date">日期：{{ currentDate }}</div>
              <div class="box-content">{{ evaluations.exam }}</div>
            </div>
          </div>
        </div>

        <!-- 行为习惯内容 -->
        <div v-if="activeTab === 'behavior'" class="behavior-container">
          <div class="behavior-sidebar">
            <div class="sidebar-item" :class="{ active: activeBehaviorItem === 'lecture' }" @click="switchBehaviorItem('lecture')">知识讲座</div>
            <div class="sidebar-item" :class="{ active: activeBehaviorItem === 'community' }" @click="switchBehaviorItem('community')">社区考评</div>
            <div class="sidebar-item" :class="{ active: activeBehaviorItem === 'project' }" @click="switchBehaviorItem('project')">项目活动</div>
            <div class="sidebar-item" :class="{ active: activeBehaviorItem === 'other' }" @click="switchBehaviorItem('other')">消费</div>
          </div>
          
          <div class="behavior-content">
            <!-- 社区考评内容 -->
            <div v-if="activeBehaviorItem === 'community'">
              <div class="community-header">
                <div class="header-grid">
                  <div class="grid-cell">对己</div>
                  <div class="grid-cell">对人</div>
                </div>
                <div class="header-grid">
                  <div class="grid-cell">尊重</div>
                  <div class="grid-cell">诚实</div>
                </div>
              </div>
              
              <div class="behavior-record-section">
                <div class="section-header">
                  <div class="header-text">活动项目</div>
                  <div class="header-text">加分减分</div>
                  <div class="header-text">审核批复</div>
                </div>
                
                <div class="section-content">
                  <div class="record-section">
                    <div class="section-title">出勤</div>
                    <div class="record-box">
                      <!-- 出勤记录内容区域 -->
                      <el-table :data="attendanceRecords" stripe style="width: 100%">
                        <el-table-column prop="date" label="日期" width="120" />
                        <el-table-column prop="type" label="类型" width="120" />
                        <el-table-column prop="status" label="状态">
                          <template #default="scope">
                            <el-tag :type="scope.row.status === '正常' ? 'success' : 'danger'">
                              {{ scope.row.status }}
                            </el-tag>
                          </template>
                        </el-table-column>
                        <el-table-column prop="points" label="加减分" width="100" />
                      </el-table>
                    </div>
                  </div>
                  
                  <div class="record-section">
                    <div class="section-title">课外活动</div>
                    <div class="record-box">
                      <!-- 课外活动记录内容区域 -->
                      <el-table :data="extraCurricularRecords" stripe style="width: 100%">
                        <el-table-column prop="date" label="日期" width="120" />
                        <el-table-column prop="activity" label="活动名称" />
                        <el-table-column prop="role" label="角色" width="100" />
                        <el-table-column prop="performance" label="表现评价" width="150">
                          <template #default="scope">
                            <div class="stars-container">
                              <el-rate
                                v-model="scope.row.stars"
                                disabled
                                text-color="#ff9900"
                              />
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column prop="points" label="加分" width="80" />
                      </el-table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 总体评价内容 -->
        <div v-if="activeTab === 'overall'">
          <!-- 总体评价内容 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const currentDate = ref('2024-03-12');
const activeTab = ref('academic');
const activeBehaviorItem = ref('community'); // 默认选中社区考评

const studentMetrics = ref({
  attention: 85,
  headDown: 30,
  confusion: 45,
  overall: 75
});

const evaluations = ref({
  homework: '按时完成作业，认真负责。',
  exam: '考试成绩优秀，理解能力强。'
});

const attendanceRecords = ref([
  { date: '2024-03-01', type: '上课', status: '正常', points: '+2' },
  { date: '2024-03-05', type: '晨读', status: '迟到', points: '-1' },
  { date: '2024-03-08', type: '上课', status: '正常', points: '+2' },
  { date: '2024-03-12', type: '上课', status: '正常', points: '+2' }
]);

const extraCurricularRecords = ref([
  { date: '2024-02-20', activity: '校园文化节', role: '参与者', stars: 4, points: '+5' },
  { date: '2024-03-05', activity: '志愿服务活动', role: '组织者', stars: 5, points: '+8' },
  { date: '2024-03-15', activity: '学科竞赛', role: '参赛者', stars: 4, points: '+6' }
]);

const switchTab = (tab) => {
  activeTab.value = tab;
};

const switchBehaviorItem = (item) => {
  activeBehaviorItem.value = item;
};
</script>

<style scoped>
.student-details {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
}

.info-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.photo-section {
  width: 160px;
  margin-right: 40px;
}

.photo-placeholder {
  width: 160px;
  height: 200px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.photo-placeholder::after {
  content: '照片';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #909399;
  font-size: 14px;
}

.basic-info {
  flex: 1;
  padding: 10px 0;
}

.info-row {
  height: 48px;
  line-height: 48px;
  border-bottom: 1px solid #ebeef5;
  color: #606266;
  font-size: 15px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.info-row:hover {
  background-color: #f9fafc;
  padding-left: 10px;
}

.evaluation-area {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.evaluation-header {
  display: flex;
  background: linear-gradient(to right, #f5f7fa, #fff);
  border-bottom: 1px solid #dcdfe6;
}

.header-item {
  flex: 1;
  text-align: center;
  padding: 16px 0;
  font-size: 16px;
  color: #303133;
  border-right: 1px solid #dcdfe6;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.header-item:hover, .header-item.active {
  color: #409eff;
  background-color: rgba(64, 158, 255, 0.04);
}

.header-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background-color: #409eff;
  transition: all 0.3s ease;
}

.header-item:hover::after, .header-item.active::after {
  width: 40%;
}

.evaluation-content {
  padding: 24px;
}

.status-section {
  margin-bottom: 32px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}

.status-header {
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-title {
  font-size: 18px;
  color: #303133;
  font-weight: 500;
}

.status-date {
  font-size: 14px;
  color: #909399;
  background-color: #f5f7fa;
  padding: 4px 12px;
  border-radius: 4px;
}

.metrics-list {
  padding: 0 24px;
}

.metric-item {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.metric-label {
  display: inline-block;
  width: 90px;
  color: #606266;
  font-size: 15px;
  font-weight: 500;
}

.performance-section {
  display: flex;
  gap: 24px;
}

.performance-box {
  flex: 1;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.performance-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.box-header {
  font-size: 18px;
  color: #303133;
  margin-bottom: 12px;
  font-weight: 500;
}

.box-date {
  font-size: 14px;
  color: #909399;
  margin-bottom: 16px;
  background-color: #f5f7fa;
  padding: 4px 12px;
  border-radius: 4px;
  display: inline-block;
}

.box-content {
  color: #606266;
  line-height: 1.8;
  font-size: 15px;
}

/* 行为习惯样式 */
.behavior-container {
  display: flex;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
  min-height: 500px;
}

.behavior-sidebar {
  width: 160px;
  background: #f5f7fa;
  border-right: 1px solid #ebeef5;
}

.sidebar-item {
  padding: 16px;
  cursor: pointer;
  border-bottom: 1px solid #ebeef5;
  transition: all 0.3s;
  font-size: 14px;
  color: #606266;
}

.sidebar-item:hover, .sidebar-item.active {
  background: #ecf5ff;
  color: #409eff;
}

.behavior-content {
  flex: 1;
  padding: 20px;
}

.community-header {
  margin-bottom: 20px;
}

.header-grid {
  display: flex;
  border: 1px solid #ebeef5;
  margin-bottom: -1px;
}

.grid-cell {
  flex: 1;
  padding: 10px 15px;
  border-right: 1px solid #ebeef5;
  text-align: center;
}

.grid-cell:last-child {
  border-right: none;
}

.behavior-record-section {
  margin-top: 30px;
}

.section-header {
  display: flex;
  background: #f5f7fa;
  border-radius: 4px 4px 0 0;
  padding: 12px 0;
  border: 1px solid #ebeef5;
  margin-bottom: -1px;
}

.header-text {
  flex: 1;
  text-align: center;
  font-weight: 500;
  color: #606266;
}

.section-content {
  border: 1px solid #ebeef5;
  border-radius: 0 0 4px 4px;
  padding: 20px;
}

.record-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  color: #303133;
  margin-bottom: 15px;
  font-weight: 500;
}

.record-box {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background: #fff;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.record-box :deep(.el-table) {
  --el-table-border-color: #ebeef5;
  --el-table-header-bg-color: #f5f7fa;
}

.record-box :deep(.el-table__header) {
  font-weight: 500;
}

.record-box :deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background: #fafafa;
}

.stars-container {
  display: flex;
  align-items: center;
}

:deep(.el-progress-bar__outer) {
  background-color: #f0f2f5;
  border-radius: 6px;
}

:deep(.el-progress-bar__inner) {
  border-radius: 6px;
  transition: all 0.3s ease;
}

:deep(.el-progress) {
  width: calc(100% - 100px);
  display: inline-block;
  vertical-align: middle;
}

:deep(.el-progress:hover .el-progress-bar__inner) {
  transform: scaleY(1.1);
}
</style>