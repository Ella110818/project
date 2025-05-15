<template>
  <div class="student-details">
    <!-- 学生基本信息卡片 -->
    <div class="info-card">
      <div class="photo-section">
        <div class="photo-placeholder">
          <img :src="studentInfo.avatar" alt="学生照片" class="student-photo" />
        </div>
      </div>
      <div class="basic-info">
        <div class="info-row">姓名：{{ studentName }}</div>
        <div class="info-row">班级：{{ studentClass }}</div>
        <div class="info-row">学号：{{ studentId }}</div>
        <div class="info-row">学院：计算机与信息技术学院</div>
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
                <div class="metric-icon sleepy-icon">
                  <i class="el-icon-moon"></i>
                </div>
                <div class="metric-info">
                  <div class="metric-title">犯困度</div>
                  <div class="metric-value">{{ studentMetrics.sleepy }}%</div>
                  <div class="metric-chart">
                    <div class="chart-bar">
                      <div class="chart-fill sleepy" :style="{ width: studentMetrics.sleepy + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="metric-card">
                <div class="metric-icon distracted-icon">
                  <i class="el-icon-mobile"></i>
                </div>
                <div class="metric-info">
                  <div class="metric-title">分神度</div>
                  <div class="metric-value">{{ studentMetrics.distracted }}%</div>
                  <div class="metric-chart">
                    <div class="chart-bar">
                      <div class="chart-fill distracted" :style="{ width: studentMetrics.distracted + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="metric-card">
                <div class="metric-icon overall-icon">
                  <i class="el-icon-data-analysis"></i>
                </div>
                <div class="metric-info">
                  <div class="metric-title">偏头度</div>
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
          <div class="overall-evaluation-section">
            <div class="evaluation-header-container">
              <h3 class="section-title">学生总体评价</h3>
              <div class="evaluation-buttons">
                <el-button type="primary" @click="generateAIEvaluation">根据deepseek智能给出评价</el-button>
                <el-button type="success" @click="useTeacherEvaluation">老师给出评价</el-button>
              </div>
            </div>
            
            <div class="quick-phrases">
              <h4>快捷评语:</h4>
              <div class="phrase-tags">
                <el-tag
                  v-for="(phrase, index) in quickPhrases"
                  :key="index"
                  class="phrase-tag"
                  @click="insertPhrase(phrase)"
                >
                  {{ phrase }}
                </el-tag>
              </div>
            </div>
            
            <div class="evaluation-textarea">
              <el-input
                v-model="evaluationContent"
                type="textarea"
                :rows="8"
                placeholder="请输入学生总体评价..."
              />
            </div>
            
            <div class="evaluation-footer">
              <el-button type="primary" @click="saveEvaluation">保存评价</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';

const route = useRoute();
const studentId = ref('');
const studentName = ref('');
const studentClass = ref('');

const currentDate = ref('2024-03-12');
const activeTab = ref('behavior');
// 总体评价相关数据
const evaluationContent = ref('');
const quickPhrases = ref([
  '做得很好，继续加油',
  '继续努力，戒骄戒躁',
  '注意力集中，学习态度好',
  '有潜力，需要更加专注',
  '学习进步明显，继续保持'
]);
// 从路由参数中获取学生信息
const studentInfo = ref({
  name: route.query.name || '',
  className: route.query.className || '',
  studentId: route.params.id || route.query.studentId || '',
  email: route.query.email || '',
  phone: route.query.phone || '',
  avatar: route.query.avatar || '/teacher/image/song.png'
});

// 初始化学生基本信息
studentId.value = studentInfo.value.studentId;
studentName.value = studentInfo.value.name;
studentClass.value = studentInfo.value.className;

const studentMetrics = ref({
  attention: 85,
  headDown: 30,
  confusion: 45,
  overall: 75,
  sleepy: 25,
  distracted: 35
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
// 总体评价相关方法
const generateAIEvaluation = () => {
  // 模拟AI生成评价
  const aiEvaluations = [
    `${studentInfo.value.name}同学在课堂上表现出色，专注度高达${studentMetrics.value.attention}%，对知识点掌握良好。表现出了较强的学习能力和问题解决能力，建议继续保持这种学习态度。`,
    `${studentInfo.value.name}同学整体表现不错，专注度为${studentMetrics.value.attention}%，课堂参与度高。在团队合作中表现积极，具有良好的沟通能力和协作精神。需要在细节方面更加注意。`,
    `${studentInfo.value.name}同学学习态度认真，具有较好的自主学习能力。总体评分为${studentMetrics.value.overall}%，在班级中属于中上水平。建议加强基础知识的巩固，提高解决复杂问题的能力。`
  ];
  
  // 随机选择一个评价
  const randomIndex = Math.floor(Math.random() * aiEvaluations.length);
  evaluationContent.value = aiEvaluations[randomIndex];
  
  ElMessage.success('已生成智能评价');
};

const useTeacherEvaluation = () => {
  // 模拟教师评价
  evaluationContent.value = `${studentInfo.value.name}同学在课堂上认真听讲，作业完成质量高，对所学知识理解深入。整体表现优秀，望继续保持。`;
  
  ElMessage.success('已使用教师评价模板');
};

const insertPhrase = (phrase) => {
  if (evaluationContent.value && !evaluationContent.value.endsWith(' ')) {
    evaluationContent.value += ' ';
  }
  evaluationContent.value += phrase;
};

const saveEvaluation = () => {
  // 这里可以添加保存评价到后端的代码
  ElMessage.success('评价保存成功');
};


// 获取学生详细信息的方法
const fetchStudentDetails = async (id) => {
  try {
    // 实际开发中，这里应该调用API获取学生详细信息
    console.log('正在获取学生ID为', id, '的详细信息');
    
    // 这里先使用URL中的query参数
    studentName.value = route.query.name || '未知';
    studentId.value = route.query.studentId || '未知';
    studentClass.value = route.query.className || '未知';
    
    // 假设这是从API获取的数据
    // const response = await api.getStudentDetails(id);
    // if (response.code === 200) {
    //   studentName.value = response.data.name;
    //   studentId.value = response.data.studentId;
    //   studentClass.value = response.data.className;
    //   // 其他详细信息...
    // }
  } catch (error) {
    console.error('获取学生详情失败:', error);
  }
};

onMounted(() => {
  const id = route.params.id;
  if (id) {
    fetchStudentDetails(id);
  }
});
</script>

<style scoped>
.student-details {
  padding: 24px;
  background: linear-gradient(135deg, #f6f8fc 0%, #e9eef7 100%);
  min-height: 100vh;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
}

.info-card {
  background: linear-gradient(to right, #ffffff, #f8faff);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.8);
  max-width: 100%;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.photo-section {
  width: 160px;
  margin-right: 40px;
  flex-shrink: 0;
}

.photo-placeholder {
  width: 160px;
  height: 200px;
  background: linear-gradient(145deg, #e6eeff 0%, #f5f8ff 100%);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.photo-placeholder::after {
  display: none;
}

.student-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.basic-info {
  flex: 1;
  padding: 10px 0;
  max-width: calc(100% - 200px);
}

.info-row {
  height: 48px;
  line-height: 48px;
  border-bottom: 1px solid rgba(235, 238, 245, 0.8);
  color: #4a5568;
  font-size: 15px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  padding: 0 12px;
  border-radius: 6px;
}

.info-row:hover {
  background: linear-gradient(to right, #f0f5ff, transparent);
  transform: translateX(5px);
}

.evaluation-area {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.8);
  width: 100%;
}

.evaluation-header {
  display: flex;
  background: linear-gradient(to right, #f0f5ff, #ffffff);
  border-bottom: 1px solid #e6eeff;
}

.header-item {
  flex: 1;
  text-align: center;
  padding: 16px 0;
  font-size: 16px;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
}

.header-item:hover, .header-item.active {
  color: #3182ce;
  background: linear-gradient(to bottom, rgba(49, 130, 206, 0.08), transparent);
}

.header-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: linear-gradient(to right, #3182ce, #63b3ed);
  transition: all 0.3s ease;
  border-radius: 3px;
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
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 20px;
}

.metric-card {
  background: linear-gradient(145deg, #ffffff, #f8faff);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.metric-icon.attention-icon {
  background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%);
  color: #3182ce;
}

.metric-icon.head-down-icon {
  background: linear-gradient(135deg, #fefcbf 0%, #fbd38d 100%);
  color: #d69e2e;
}

.metric-icon.confusion-icon {
  background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
  color: #e53e3e;
}

.metric-icon.sleepy-icon {
  background: linear-gradient(135deg, #e6e6ff 0%, #b3b3ff 100%);
  color: #4040bf;
}

.metric-icon.distracted-icon {
  background: linear-gradient(135deg, #ffe6f0 0%, #ffb3d1 100%);
  color: #db7093;
}

.metric-icon.overall-icon {
  background: linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%);
  color: #38a169;
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
  background: linear-gradient(to right, #3182ce, #63b3ed);
}

.chart-fill.head-down {
  background: linear-gradient(to right, #d69e2e, #f6ad55);
}

.chart-fill.confusion {
  background: linear-gradient(to right, #e53e3e, #fc8181);
}

.chart-fill.sleepy {
  background: linear-gradient(to right, #4040bf, #8080ff);
}

.chart-fill.distracted {
  background: linear-gradient(to right, #db7093, #ffb6c1);
}

.chart-fill.overall {
  background: linear-gradient(to right, #38a169, #68d391);
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
  overflow: visible;
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
  background: #EBEFF8;
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
  padding: 20px;
  background-color: #fff;
}

.content-row {
  display: flex;
  gap: 20px;
  min-height: 300px;
}

.content-cell {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.behavior-box {
  flex: 1;
  border: 1px solid rgba(235, 238, 245, 0.8);
  border-radius: 12px;
  padding: 20px;
  background: linear-gradient(145deg, #ffffff, #f8faff);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
}

.behavior-item-container {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
  margin-top: 10px;
}

.behavior-item-container::-webkit-scrollbar {
  width: 6px;
}

.behavior-item-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.behavior-item-container::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.02);
}

.attendance-item, .activity-item, .discipline-item {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(235, 238, 245, 0.5);
}

.attendance-item:last-child, 
.activity-item:last-child, 
.discipline-item:last-child {
  margin-bottom: 0;
}

.attendance-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(235, 238, 245, 0.5);
  margin-bottom: 10px;
}

.attendance-item .date {
  color: #606266;
  font-size: 14px;
  text-align: left;
  flex: 1;
  margin-right: auto;
}

.attendance-item .status {
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 13px;
  margin-left: 15px;
  min-width: 60px;
  text-align: center;
  flex-shrink: 0;
}

.attendance-item .status.normal {
  background: linear-gradient(to right, #c6f6d5, #9ae6b4);
  color: #276749;
}

.attendance-item .status.late {
  background: linear-gradient(to right, #fefcbf, #fbd38d);
  color: #975a16;
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
  background: linear-gradient(to right, #ebf8ff, #bee3f8);
  color: #2c5282;
  padding: 4px 10px;
  border-radius: 15px;
}

.discipline-type.warning {
  background: linear-gradient(to right, #fed7d7, #feb2b2);
  color: #c53030;
  padding: 4px 10px;
  border-radius: 15px;
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
    grid-template-columns: repeat(2, 1fr);
  }
  
  .performance-section {
    flex-direction: column;
  }
  
  .performance-box {
    margin-bottom: 16px;
  }
}

@media screen and (max-width: 480px) {
  .metrics-dashboard {
    grid-template-columns: 1fr;
  }
}
/* 总体评价样式 */
.overall-evaluation-section {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.evaluation-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.section-title {
  font-size: 18px;
  color: #303133;
  font-weight: 500;
  margin: 0;
}

.evaluation-buttons {
  display: flex;
  gap: 10px;
}

.quick-phrases {
  margin-bottom: 20px;
}

.quick-phrases h4 {
  font-size: 15px;
  color: #606266;
  margin-bottom: 10px;
}

.phrase-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.phrase-tag {
  cursor: pointer;
  padding: 8px 12px;
  transition: all 0.3s ease;
}

.phrase-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.evaluation-textarea {
  margin-bottom: 20px;
}

.evaluation-footer {
  display: flex;
  justify-content: flex-end;
}
</style>