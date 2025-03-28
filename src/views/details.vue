<template>
  <div class="student-details">
    <!-- 学生基本信息卡片 -->
    <div class="info-card">
      <div class="main-info-container">
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
  { date: '2024-03-05', type: '上课', status: '迟到', points: '+1' },
  { date: '2024-03-08', type: '上课', status: '正常', points: '+2' }
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
  width: 100vw;
  background: linear-gradient(to bottom, #0b1834, #162956);
  min-height: 100vh;
  padding: 80px 40px 20px 40px;
  overflow-x: hidden;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: 0;
  box-sizing: border-box;
  color: #fff;
}

.info-card {
  background: url(../assets/bor1_2.png);
  background-size: 100% 100%;
  border-radius: 12px;
  padding: 30px;
  margin: 0 auto 30px auto;
  max-width: 1400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
}

.main-info-container {
  display: flex;
  align-items: center;
  max-width: 600px;
}

.photo-section {
  width: 120px;
  height: 120px;
  margin-right: 30px;
  flex-shrink: 0;
}

.photo-placeholder {
  width: 100%;
  height: 100%;
  background-color: #2a3e63;
  border-radius: 10px;
}

.basic-info {
  flex: 0 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.info-row {
  margin-bottom: 10px;
  font-size: 16px;
}

.evaluation-area {
  background: rgba(22, 41, 86, 0.6);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
  margin: 0 auto;
  max-width: 1400px;
}

.evaluation-header {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
}

.header-item {
  padding: 10px 20px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  position: relative;
}

.header-item.active {
  color: #00d8ff;
  font-weight: bold;
}

.header-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #00d8ff;
}

.evaluation-content {
  padding: 10px 0;
}

.status-section {
  margin-bottom: 30px;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.status-title {
  font-size: 18px;
  font-weight: bold;
}

.metrics-dashboard {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.metric-card {
  background: rgba(27, 50, 105, 0.6);
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex: 1;
  min-width: 200px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.metric-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
}

.attention-icon {
  background-color: rgba(0, 216, 255, 0.2);
  color: #00d8ff;
}

.head-down-icon {
  background-color: rgba(255, 159, 67, 0.2);
  color: #ff9f43;
}

.confusion-icon {
  background-color: rgba(255, 71, 87, 0.2);
  color: #ff4757;
}

.overall-icon {
  background-color: rgba(46, 213, 115, 0.2);
  color: #2ed573;
}

.metric-info {
  flex: 1;
}

.metric-title {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 5px;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.metric-chart {
  margin-top: 5px;
}

.chart-bar {
  height: 6px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.chart-fill {
  height: 100%;
  border-radius: 3px;
}

.chart-fill.attention {
  background-color: #00d8ff;
}

.chart-fill.head-down {
  background-color: #ff9f43;
}

.chart-fill.confusion {
  background-color: #ff4757;
}

.chart-fill.overall {
  background-color: #2ed573;
}

.performance-section {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.performance-box {
  flex: 1;
  min-width: 300px;
  background: rgba(27, 50, 105, 0.6);
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.box-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.box-header {
  font-size: 16px;
  font-weight: bold;
}

.box-content {
  padding: 10px;
  background: rgba(22, 41, 86, 0.4);
  border-radius: 8px;
  min-height: 100px;
}

.behavior-container {
  padding: 0 10px;
}

.behavior-sections {
  margin-top: 10px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.header-text {
  font-size: 16px;
  font-weight: bold;
  flex: 1;
  text-align: center;
}

.section-content {
  margin-top: 15px;
}

.content-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.content-cell {
  flex: 1;
  min-width: 250px;
}

.behavior-box {
  background: rgba(27, 50, 105, 0.6);
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  height: 100%;
}

.behavior-box h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #00d8ff;
}

.behavior-item-container {
  background: rgba(22, 41, 86, 0.4);
  border-radius: 8px;
  padding: 10px;
}

.attendance-item, .activity-item, .discipline-item {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 6px;
  background: rgba(27, 50, 105, 0.5);
}

.date, .activity-date, .discipline-date {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
}

.status {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  margin-left: 10px;
}

.status.normal {
  background-color: rgba(46, 213, 115, 0.2);
  color: #2ed573;
}

.status.late {
  background-color: rgba(255, 159, 67, 0.2);
  color: #ff9f43;
}

.activity-name, .discipline-type {
  font-weight: bold;
  margin-bottom: 5px;
}

.activity-role, .discipline-reason {
  color: rgba(255, 255, 255, 0.7);
}

.discipline-type.leave {
  color: #ff9f43;
}

.discipline-type.warning {
  color: #ff4757;
}

/* Element Plus 组件样式覆盖 */
:deep(.el-date-editor) {
  --el-datepicker-text-color: #fff;
  --el-datepicker-border-color: rgba(255, 255, 255, 0.1);
  --el-datepicker-inner-border-color: rgba(255, 255, 255, 0.1);
  --el-datepicker-off-font-color: rgba(255, 255, 255, 0.4);
  --el-datepicker-header-font-color: #fff;
  --el-datepicker-icon-color: #fff;
  --el-datepicker-hover-font-color: #fff;
  --el-datepicker-active-color: #00d8ff;
}

:deep(.el-date-editor.el-input) {
  background-color: rgba(22, 41, 86, 0.4);
  border-color: rgba(255, 255, 255, 0.1);
}

:deep(.el-input__inner) {
  color: #fff;
}

@media screen and (max-width: 768px) {
  .student-details {
    padding: 60px 15px 15px 15px;
  }
  
  .info-card {
    flex-direction: column;
    align-items: center;
  }
  
  .photo-section {
    margin-right: 0;
    margin-bottom: 20px;
  }
  
  .metrics-dashboard, .performance-section, .content-row {
    flex-direction: column;
  }
  
  .metric-card, .performance-box, .content-cell {
    width: 100%;
    margin-bottom: 15px;
  }
}
</style>