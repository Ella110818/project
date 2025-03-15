<template>
  <div class="container">
    <div class="info-header">
      <div class="info-cards">
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">脑机接口</div>
            <div class="stat-label">课程名称</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">35</div>
            <div class="stat-label">班级人数</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><Location /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">主教学楼</div>
            <div class="stat-label">301</div>
          </div>
        </div>
      </div>
    </div>
    
    <el-tabs v-model="activeTab" @tab-click="handleTabClick" class="custom-tabs">
      <el-tab-pane label="发布公告" name="announce">
        
        <AnnouncementForm />
      </el-tab-pane>
      <el-tab-pane label="作业/考试" name="homework"> 
        <Exam />
      </el-tab-pane>
      <el-tab-pane label="成绩单" name="grade">
        <div >

       
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
              <div class="scheme-item">
                <div class="scheme-info">
                  <span class="scheme-name">课堂</span>
                  <span class="scheme-score">30分</span>
                </div>
                <el-progress :percentage="30" :show-text="false" />
              </div>
              <div class="scheme-item">
                <div class="scheme-info">
                  <span class="scheme-name">雨课堂课件</span>
                  <span class="scheme-score">20分</span>
                </div>
                <el-progress :percentage="20" :show-text="false" />
              </div>
              <div class="scheme-item">
                <div class="scheme-info">
                  <span class="scheme-name">考试</span>
                  <span class="scheme-score">50分</span>
                </div>
                <el-progress :percentage="50" :show-text="false" />
              </div>
            </div>
          </el-card>

          <!-- 班级平均分 -->
          <el-card class="grade-card right-card">
            <template #header>
              <div class="card-header">
                <span>成绩概览</span>
              </div>
            </template>
            <div class="statistics">
              <div class="statistics-left">
                <div class="chart-container">
                  <el-progress type="dashboard" :percentage="averageScore" :width="150" :stroke-width="10" />
                  <div class="chart-label">班级平均分</div>
                </div>
                <div class="score-details">
                  <div class="score-item">
                    <span class="score-label">满分：</span>
                    <span class="score-value">{{ maxScore }}</span>
                  </div>
                  <div class="score-item">
                    <span class="score-label">最高分：</span>
                    <span class="score-value">{{ highestScore }}</span>
                  </div>
                  <div class="score-item">
                    <span class="score-label">最低分：</span>
                    <span class="score-value">{{ lowestScore }}</span>
                  </div>
                </div>
              </div>
              <div class="statistics-right">
                <div id="gradeDistChart" style="width: 100%; height: 300px;"></div>
              </div>
            </div>
          </el-card>
          </div>

          <!-- 成绩列表 -->
          <el-card class="grade-card full-width">
            <template #header>
              <div class="card-header">
                <span>成绩列表</span>
              </div>
            </template>
            <el-table :data="gradeList" style="width: 100%">
              <el-table-column prop="index" label="序号" width="80" />
              <el-table-column prop="name" label="姓名" width="120" />
              <el-table-column prop="studentId" label="学号" width="120" />
              <el-table-column prop="classScore" label="课堂(30%)" width="120" />
              <el-table-column prop="rainScore" label="雨课堂课件(20%)" width="150" />
              <el-table-column prop="examScore" label="考试(50%)" width="120" />
              <el-table-column prop="totalScore" label="总成绩" width="120" />
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="分组" name="group"> 
        <Group />
      </el-tab-pane>
      <el-tab-pane label="课程资源" name="resource">
        <Resource />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, nextTick } from 'vue';
import * as echarts from 'echarts';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import Exam from '@/components/Exam.vue';
import Group from '@/components/Group.vue';
import AnnouncementForm from '@/components/AnnouncementForm.vue';
import Resource from '@/components/Resource.vue';
import { Document, User, Location } from '@element-plus/icons-vue';

const route = useRoute();
const courseId = computed(() => route.params.id);

// 表单数据
const form = ref({
  title: '',
  content: ''
});

const activeTab = ref('announce');
// 成绩相关数据
const averageScore = ref(85);
const maxScore = ref(100);
const highestScore = ref(98);
const lowestScore = ref(60);
const gradeList = ref([
  {
    index: 1,
    name: '张三',
    studentId: '2021001',
    classScore: 28,
    rainScore: 18,
    examScore: 45,
    totalScore: 91
  }
]);

// 方法
const publishAnnouncement = () => {
  console.log('发布公告：', form.value);
  ElMessage.success('公告发布成功！');
  resetForm();
};

const resetForm = () => {
  form.value.title = '';
  form.value.content = '';
};

const handleTabClick = (tab) => {
  console.log(tab, activeTab.value);
  if(activeTab.value === 'grade'){
    nextTick(() => {
      initGradeDistChart();
    });
  }
};

const initGradeDistChart = () => {
  const chartDom = document.querySelector('#gradeDistChart');
  const myChart = echarts.init(chartDom);
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      top: '10%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      data: ['0-60', '60-70', '70-85', '85-100'],
      axisTick: {
        alignWithLabel: true
      }
    }],
    yAxis: [{
      type: 'value',
      name: '学生人数',
      nameTextStyle: {
        padding: [0, 0, 0, 30]
      }
    }],
    series: [{
      name: '成绩分布',
      type: 'bar',
      barWidth: '40%',
      itemStyle: {
        color: '#409EFF'
      },
      data: [7, 5, 15, 8]
    }]
  };
  myChart.setOption(option);
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    myChart.resize();
  });
};

onMounted(() => {
  console.log('Course ID:', courseId.value);
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  min-height: 100vh;
  padding: 20px;
}

.word {
  margin-bottom: 20px;
}

.custom-tabs {
  background-color: white;
  border-radius: 8px;
  padding: 0 20px;
}

:deep(.el-tabs__header) {
  margin-bottom: 0;
}

:deep(.el-tabs__nav-wrap) {
  padding: 0 20px;
}

:deep(.el-tabs__nav) {
  border: none !important;
}

:deep(.el-tabs__item) {
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  color: #606266;
  padding: 0 20px !important;
  border: none !important;
}

:deep(.el-tabs__item.is-active) {
  color: #409EFF;
  font-weight: 500;
  background-color: transparent;
}

:deep(.el-tabs__active-bar) {
  height: 3px;
  border-radius: 1.5px;
  background-color: #409EFF;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: #e4e7ed;
  bottom: 0;
}

:deep(.el-tabs__content) {
  padding: 20px 0;
}

.grade-container {
  padding: 20px;
  display: flex; 
}

.grade-card {
  margin-bottom: 20px;
}
.left-card{
  width: 30%;
  margin-right: 20px;
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
  border-radius: 8px;
}
.right-card{
  width: calc(70% - 20px);
}

.full-width {
  grid-column: 1 / -1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-score {
  font-size: 14px;
  color: #909399;
}

.scheme-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.scheme-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.scheme-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.scheme-name {
  font-size: 14px;
  color: #606266;
}

.scheme-score {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.scheme-item :deep(.el-progress-bar__outer) {
  height: 8px !important;
  border-radius: 4px;
}

.scheme-item:nth-child(1) :deep(.el-progress-bar__inner) {
  background-color: #409EFF;
}

.scheme-item:nth-child(2) :deep(.el-progress-bar__inner) {
  background-color: #67C23A;
}

.scheme-item:nth-child(3) :deep(.el-progress-bar__inner) {
  background-color: #E6A23C;
}

.statistics {
  display: flex;
  padding: 20px;
  gap: 20px;
  height: 350px;
}

.statistics-left {
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 20px;
  border-right: 1px solid #EBEEF5;
}

.statistics-right {
  width: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.score-details {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.score-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px;
  background-color: #F5F7FA;
  border-radius: 4px;
}

.score-label {
  color: #606266;
  font-size: 14px;
}

.score-value {
  color: #303133;
  font-weight: 500;
  font-size: 16px;
}

.chart-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-label {
  margin-top: 15px;
  font-size: 14px;
  color: #606266;
}

.pie-chart-container {
  text-align: center;
}

.group-management {
  padding: 20px;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.groups-container {
  margin-top: 20px;
}

.group-card {
  margin-bottom: 20px;
  height: 400px;
  display: flex;
  flex-direction: column;
}

.group-card :deep(.el-card__body) {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.student-count {
  font-size: 12px;
  color: #909399;
  margin-left: 8px;
}

.student-list {
  min-height: 100px;
}

.student-item {
  display: flex;
  align-items: center;
  padding: 8px;
  margin-bottom: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
  cursor: move;
}

.student-item:hover {
  background-color: #ecf5ff;
}

.student-name {
  margin-left: 8px;
  flex: 1;
}

.student-id {
  color: #909399;
  font-size: 12px;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.group-actions {
  display: flex;
  align-items: center;
}

.groups-grid {
  height: calc(100vh - 200px);
  overflow-y: auto;
}

.text-danger {
  color: #f56c6c;
}

.unassigned-group {
  height: calc(100vh - 200px);
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
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px -1px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border-color: #e6f7ff;
  background: linear-gradient(to right bottom, white, #f8fdff);
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
  transition: all 0.3s ease;
}

.stat-card:hover .stat-icon {
  background: #1890ff;
  color: white;
  transform: scale(1.1);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  line-height: 1.2;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #8c8c8c;
  font-weight: 500;
}

.info-card,
.info-item,
.info-icon,
.info-content,
.info-label,
.info-value,
.info-divider {
  display: none;
}
</style>