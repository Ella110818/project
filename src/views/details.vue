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
              <div class="date-picker-container">
                <el-date-picker
                  v-model="currentDate"
                  type="date"
                  placeholder="选择日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  size="small"
                  :clearable="false"
                />
              </div>
            </div>
            <div class="metrics-dashboard">
              <div class="metric-card">
                <div class="metric-icon attention-icon">
                  <i class="el-icon-view"></i>
                </div>
                <div class="metric-info">
                  <div class="metric-title">专注度</div>
                  <div class="metric-value">{{ studentMetrics.attention }}%</div>
                  <div class="metric-chart">
                    <div class="chart-bar">
                      <div class="chart-fill attention" :style="{ width: studentMetrics.attention + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="metric-card">
                <div class="metric-icon head-down-icon">
                  <i class="el-icon-arrow-down"></i>
                </div>
                <div class="metric-info">
                  <div class="metric-title">低头度</div>
                  <div class="metric-value">{{ studentMetrics.headDown }}%</div>
                  <div class="metric-chart">
                    <div class="chart-bar">
                      <div class="chart-fill head-down" :style="{ width: studentMetrics.headDown + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="metric-card">
                <div class="metric-icon confusion-icon">
                  <i class="el-icon-question"></i>
                </div>
                <div class="metric-info">
                  <div class="metric-title">疑惑度</div>
                  <div class="metric-value">{{ studentMetrics.confusion }}%</div>
                  <div class="metric-chart">
                    <div class="chart-bar">
                      <div class="chart-fill confusion" :style="{ width: studentMetrics.confusion + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="metric-card">
                <div class="metric-icon overall-icon">
                  <i class="el-icon-data-analysis"></i>
                </div>
                <div class="metric-info">
                  <div class="metric-title">总体</div>
                  <div class="metric-value">{{ studentMetrics.overall }}%</div>
                  <div class="metric-chart">
                    <div class="chart-bar">
                      <div class="chart-fill overall" :style="{ width: studentMetrics.overall + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 作业和考试区域 -->
          <div class="performance-section">
            <div class="performance-box">
              <div class="box-header-container">
              <div class="box-header">作业</div>
                <div class="box-date-picker">
                  <el-date-picker
                    v-model="currentDate"
                    type="date"
                    placeholder="选择日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    size="small"
                    :clearable="false"
                  />
                </div>
              </div>
              <div class="box-content">{{ evaluations.homework }}</div>
            </div>
            <div class="performance-box">
              <div class="box-header-container">
              <div class="box-header">考试</div>
                <div class="box-date-picker">
                  <el-date-picker
                    v-model="currentDate"
                    type="date"
                    placeholder="选择日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    size="small"
                    :clearable="false"
                  />
                </div>
              </div>
              <div class="box-content">{{ evaluations.exam }}</div>
            </div>
          </div>
        </div>

        <!-- 行为习惯内容 -->
        <div v-if="activeTab === 'behavior'" class="behavior-container">
          <div class="behavior-content">
            <!-- 课堂行为内容 -->
            <div>
              <div class="behavior-sections">
                <div class="section-header">
                  <div class="header-text">课外行为</div>
                  <div class="header-text">课外活动</div>
                  <div class="header-text">其它行为</div>
                </div>
                
                <div class="section-content">
                  <div class="content-row">
                    <div class="content-cell">
                      <div class="behavior-box">
                        <h4>出勤</h4>
                        <div class="behavior-item-container">
                          <!-- 出勤内容区域 -->
                          <div class="attendance-item">
                            <span class="date">2024-03-01</span>
                            <span class="status normal">正常</span>
                          </div>
                          <div class="attendance-item">
                            <span class="date">2024-03-05</span>
                            <span class="status late">迟到</span>
                          </div>
                          <div class="attendance-item">
                            <span class="date">2024-03-08</span>
                            <span class="status normal">正常</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="content-cell">
                      <div class="behavior-box">
                        <h4>课外活动</h4>
                        <div class="behavior-item-container">
                          <!-- 课外活动内容区域 -->
                          <div class="activity-item">
                            <div class="activity-name">校园文化节</div>
                            <div class="activity-date">2024-02-20</div>
                            <div class="activity-role">组织者</div>
                          </div>
                          <div class="activity-item">
                            <div class="activity-name">志愿服务活动</div>
                            <div class="activity-date">2024-03-05</div>
                            <div class="activity-role">参与者</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="content-cell">
                      <div class="behavior-box">
                        <h4>请假/违纪</h4>
                        <div class="behavior-item-container">
                          <!-- 其它行为内容区域 -->
                          <div class="discipline-item">
                            <div class="discipline-date">2024-03-02</div>
                            <div class="discipline-type leave">请假</div>
                            <div class="discipline-reason">家中有事请假</div>
                          </div>
                          <div class="discipline-item">
                            <div class="discipline-date">2024-02-28</div>
                            <div class="discipline-type warning">违纪警告</div>
                            <div class="discipline-reason">上课使用手机</div>
                    </div>
                  </div>
                            </div>
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
const activeTab = ref('behavior');

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
  margin-bottom: 8px;
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

.date-picker-container {
  display: flex;
  align-items: center;
}

.metrics-dashboard {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 20px;
}

.metric-card {
  flex: 1;
  min-width: 200px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  margin-bottom: 16px;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.metric-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.metric-icon.attention-icon {
  background-color: rgba(64, 158, 255, 0.1);
  color: #409eff;
}

.metric-icon.head-down-icon {
  background-color: rgba(230, 162, 60, 0.1);
  color: #e6a23c;
}

.metric-icon.confusion-icon {
  background-color: rgba(245, 108, 108, 0.1);
  color: #f56c6c;
}

.metric-icon.overall-icon {
  background-color: rgba(103, 194, 58, 0.1);
  color: #67c23a;
}

.metric-info {
  text-align: center;
}

.metric-title {
  font-size: 15px;
  color: #606266;
  font-weight: 500;
}

.metric-value {
  font-size: 18px;
  color: #303133;
  font-weight: 500;
  margin-top: 8px;
}

.metric-chart {
  height: 12px;
  background: #f5f7fa;
  border-radius: 6px;
  overflow: hidden;
  margin-top: 8px;
}

.chart-bar {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  overflow: hidden;
  background: #f5f7fa;
}

.chart-fill {
  height: 100%;
  transition: width 0.5s ease;
}

.chart-fill.attention {
  background: #409eff;
}

.chart-fill.head-down {
  background: #e6a23c;
}

.chart-fill.confusion {
  background: #f56c6c;
}

.chart-fill.overall {
  background: #67c23a;
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

.box-header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.box-header {
  font-size: 18px;
  color: #303133;
  margin-bottom: 12px;
  font-weight: 500;
}

.box-date-picker {
  display: flex;
  align-items: center;
}

.box-content {
  color: #606266;
  line-height: 1.8;
  font-size: 15px;
}

/* 行为习惯样式 */
.behavior-container {
  display: flex;
  border: none;
  border-radius: 0;
  overflow: hidden;
  min-height: 500px;
  width: 100%;
}

.behavior-content {
  flex: 1;
  padding: 20px;
  width: 100%;
}

.behavior-sections {
  margin-top: 20px;
}

.section-header {
  display: flex;
  background: #f5f7fa;
  border-radius: 4px 4px 0 0;
  padding: 12px 0;
  border: 1px solid #ebeef5;
  border-bottom: none;
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
  padding: 15px;
  background-color: #fff;
}

.content-row {
  display: flex;
  gap: 15px;
}

.content-cell {
  flex: 1;
}

.behavior-box {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 15px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.behavior-box h4 {
  margin: 0 0 10px 0;
  font-size: 15px;
  color: #303133;
  text-align: center;
  padding-bottom: 8px;
  border-bottom: 1px dashed #ebeef5;
}

.behavior-item-container {
  margin-top: 10px;
  min-height: 100px;
}

.attendance-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 10px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
}

.attendance-item:last-child {
  border-bottom: none;
}

.attendance-item .date {
  color: #606266;
}

.attendance-item .status {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.attendance-item .status.normal {
  background-color: #f0f9eb;
  color: #67c23a;
}

.attendance-item .status.late {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.attendance-item .status.absent {
  background-color: #fef0f0;
  color: #f56c6c;
}

.activity-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 8px 10px;
  font-size: 13px;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-name {
  font-weight: 500;
  color: #303133;
}

.activity-date, .activity-role {
  color: #909399;
  font-size: 12px;
  margin-top: 3px;
}

.discipline-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 8px 10px;
  font-size: 13px;
}

.discipline-item:last-child {
  border-bottom: none;
}

.discipline-date {
  color: #909399;
  font-size: 12px;
}

.discipline-type {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  margin: 3px 0;
}

.discipline-type.leave {
  background-color: #ecf5ff;
  color: #409eff;
}

.discipline-type.warning {
  background-color: #fef0f0;
  color: #f56c6c;
}

.discipline-reason {
  color: #606266;
}

.placeholder-content {
  text-align: center;
  padding: 20px;
  color: #909399;
  font-size: 15px;
}

/* 日期选择器样式 */
:deep(.el-input__inner) {
  height: 32px;
  line-height: 32px;
}

:deep(.el-date-editor.el-input) {
  width: 160px;
}

@media screen and (max-width: 768px) {
  .metrics-dashboard {
    flex-direction: column;
  }
  
  .performance-section {
    flex-direction: column;
  }
  
  .performance-box {
    margin-bottom: 16px;
  }
}
</style>