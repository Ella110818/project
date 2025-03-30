<template>
  <div class="container">
    <div class="info-header">
      <div class="info-cards">
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ courseName }}</div>
            <div class="stat-label">课程名称</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ classInfo.studentCount }}</div>
            <div class="stat-label">班级人数</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><Location /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ classInfo.building }}</div>
            <div class="stat-label">{{ classInfo.roomNumber }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <el-tabs v-model="activeTab" @tab-click="handleTabClick" class="custom-tabs">
      <el-tab-pane label="发布公告" name="announce">
        <div class="announcement-container">
          <AnnouncementForm :course-id="courseId" />
        </div>
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
                  <span class="scheme-name">作业</span>
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
                  <div class="dashboard-wrapper">
                    <el-progress 
                      type="dashboard" 
                      :percentage="averageScore" 
                      :width="150" 
                      :stroke-width="10"
                      :show-text="false"
                    />
                    <div class="central-score">{{ averageScore }}</div>
                  </div>
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
                <div class="header-right">
                  <el-input
                    v-model="searchGradeText"
                    placeholder="搜索学生姓名或学号"
                    prefix-icon="Search"
                    clearable
                    style="width: 220px; margin-right: 16px;"
                  />
                  <el-button type="primary" @click="exportGrades">
                    <el-icon><Download /></el-icon>导出成绩单
                  </el-button>
                </div>
              </div>
            </template>
            <el-table 
              :data="filteredGradeList" 
              style="width: 100%"
              :default-sort="{ prop: 'totalScore', order: 'descending' }"
              border
              stripe
              row-key="index"
              highlight-current-row
              :header-cell-style="{
                backgroundColor: '#f5f7fa',
                color: '#606266',
                fontWeight: 'bold',
                textAlign: 'center',
                padding: '12px 0'
              }"
              :cell-style="{
                textAlign: 'center',
                padding: '8px 0'
              }"
            >
              <el-table-column prop="index" label="序号" width="70" sortable align="center" />
              <el-table-column prop="name" label="姓名" width="120" sortable align="center" />
              <el-table-column prop="studentId" label="学号" width="120" sortable align="center" />
              <el-table-column prop="classScore" label="课堂(30%)" width="140" sortable align="center">
                <template #default="scope">
                  <el-progress 
                    :percentage="Math.round(scope.row.classScore / 30 * 100)" 
                    :format="() => scope.row.classScore"
                    :status="getScoreStatus(scope.row.classScore, 30)"
                    :text-inside="true"
                    :stroke-width="14"
                  ></el-progress>
                </template>
              </el-table-column>
              <el-table-column prop="rainScore" label="作业(20%)" width="170" sortable align="center">
                <template #default="scope">
                  <el-progress 
                    :percentage="Math.round(scope.row.rainScore / 20 * 100)" 
                    :format="() => scope.row.rainScore"
                    :status="getScoreStatus(scope.row.rainScore, 20)"
                    :text-inside="true"
                    :stroke-width="14"
                  ></el-progress>
                </template>
              </el-table-column>
              <el-table-column prop="examScore" label="考试(50%)" width="140" sortable align="center">
                <template #default="scope">
                  <el-progress 
                    :percentage="Math.round(scope.row.examScore / 50 * 100)" 
                    :format="() => scope.row.examScore"
                    :status="getScoreStatus(scope.row.examScore, 50)"
                    :text-inside="true"
                    :stroke-width="14"
                  ></el-progress>
                </template>
              </el-table-column>
              <el-table-column prop="totalScore" label="总成绩" width="100" sortable align="center">
                <template #default="scope">
                  <span :class="getTotalScoreClass(scope.row.totalScore)">{{ scope.row.totalScore }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="130" fixed="right" align="center">
                <template #default="scope">
                  <el-button link type="primary" @click="editGrade(scope.row)">编辑</el-button>
                  <el-button link type="primary" @click="viewDetail(scope.row)">查看详情</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-pagination">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="gradeList.length"
              />
            </div>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="分组" name="group"> 
        <Group />
      </el-tab-pane>
      <el-tab-pane label="课程资源" name="resource">
        <Resource :course-id="courseId" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, nextTick, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import Exam from '@/components/Exam.vue';
import Group from '@/components/Group.vue';
import AnnouncementForm from '@/components/AnnouncementForm.vue';
import Resource from '@/components/Resource.vue';
import { Document, User, Location, Download } from '@element-plus/icons-vue';

const route = useRoute();
const courseId = ref(route.params.id || route.query.id || '5');
const courseName = ref('');
const classInfo = ref({
  studentCount: 0,
  location: '',
  building: '',
  roomNumber: ''
});

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
const searchGradeText = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const gradeList = ref([
  {
    index: 1,
    name: '张三',
    studentId: '2021001',
    classScore: 28,
    rainScore: 18,
    examScore: 45,
    totalScore: 91
  },
  {
    index: 2,
    name: '李四',
    studentId: '2021002',
    classScore: 26,
    rainScore: 15,
    examScore: 43,
    totalScore: 84
  },
  {
    index: 3,
    name: '王五',
    studentId: '2021003',
    classScore: 22,
    rainScore: 19,
    examScore: 38,
    totalScore: 79
  },
  {
    index: 4,
    name: '赵六',
    studentId: '2021004',
    classScore: 29,
    rainScore: 16,
    examScore: 41,
    totalScore: 86
  },
  {
    index: 5,
    name: '钱七',
    studentId: '2021005',
    classScore: 25,
    rainScore: 17,
    examScore: 47,
    totalScore: 89
  }
]);

// 筛选成绩列表数据
const filteredGradeList = computed(() => {
  if (!searchGradeText.value) {
    return gradeList.value;
  }
  
  const searchQuery = searchGradeText.value.toLowerCase();
  return gradeList.value.filter(item => 
    item.name.toLowerCase().includes(searchQuery) || 
    item.studentId.toLowerCase().includes(searchQuery)
  );
});

// 获取成绩状态（优/良/及格/不及格）
const getScoreStatus = (score, fullScore) => {
  const percentage = score / fullScore * 100;
  if (percentage >= 90) return 'success';
  if (percentage >= 75) return '';
  if (percentage >= 60) return 'warning';
  return 'exception';
};

// 获取总成绩的CSS类
const getTotalScoreClass = (score) => {
  if (score >= 90) return 'score-excellent';
  if (score >= 80) return 'score-good';
  if (score >= 70) return 'score-medium';
  if (score >= 60) return 'score-pass';
  return 'score-fail';
};

// 编辑学生成绩
const editGrade = (row) => {
  console.log('编辑学生成绩:', row);
  ElMessage.info(`正在编辑 ${row.name} 的成绩`);
  // 实际开发中这里应该弹出编辑对话框
};

// 查看学生详情
const viewDetail = (row) => {
  console.log('查看学生详情:', row);
  ElMessage.info(`正在查看 ${row.name} 的详细信息`);
  // 实际开发中这里应该跳转到详情页或显示详情弹窗
};

// 导出成绩单
const exportGrades = () => {
  console.log('导出成绩单');
  ElMessage.success('成绩单导出成功');
  // 实际开发中这里应该调用导出API
};

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

// 优化图表初始化和重绘
let gradeChart = null;

const initGradeDistChart = () => {
  const chartDom = document.querySelector('#gradeDistChart');
  if (!chartDom) return;

  // 如果已存在图表实例，先销毁
  if (gradeChart) {
    gradeChart.dispose();
  }

  gradeChart = echarts.init(chartDom);
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
  gradeChart.setOption(option);
  
  // 使用防抖处理 resize
  const handleResize = debounce(() => {
    if (gradeChart) {
      gradeChart.resize();
    }
  }, 100);

  window.addEventListener('resize', handleResize);

  // 在组件卸载时清理
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    if (gradeChart) {
      gradeChart.dispose();
      gradeChart = null;
    }
  });
};

// 防抖函数
function debounce(fn, delay) {
  let timer = null;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

// 加载课程信息
const loadClassInfo = async () => {
  try {
    // 从localStorage获取课程信息或从API获取
    classInfo.value = {
      studentCount: localStorage.getItem('currentCourseStudentCount') || 0,
      location: localStorage.getItem('currentCourseLocation') || '未知位置',
      building: localStorage.getItem('currentCourseLocation')?.split(' ')[0] || '未知教学楼',
      roomNumber: localStorage.getItem('currentCourseLocation')?.split(' ')[1] || '未知教室'
    };
    courseName.value = localStorage.getItem('currentCourseName') || '未知课程';
  } catch (error) {
    console.error('获取课程信息失败:', error);
    ElMessage.error('加载课程信息失败');
  }
};

onMounted(() => {
  console.log('Course ID:', courseId.value);
  loadClassInfo();
  
  // 使用 nextTick 确保 DOM 已更新
  nextTick(() => {
    if (activeTab.value === 'grade') {
      initGradeDistChart();
    }
  });
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

.header-right {
  display: flex;
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

.score-excellent {
  color: #67C23A;
  font-weight: bold;
}

.score-good {
  color: #409EFF;
  font-weight: bold;
}

.score-medium {
  color: #E6A23C;
  font-weight: bold;
}

.score-pass {
  color: #F56C6C;
  font-weight: bold;
}

.score-fail {
  color: #F56C6C;
  font-weight: bold;
  text-decoration: underline;
}

.table-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table) {
  --el-table-header-bg-color: #f5f7fa;
  --el-table-border-color: #e4e7ed;
  --el-table-row-hover-bg-color: #f5f7fa;
  --el-table-header-text-color: #606266;
  border-radius: 4px;
  overflow: hidden;
}

:deep(.el-table th) {
  font-weight: 500;
}

:deep(.el-table--border th),
:deep(.el-table--border td) {
  border-right: 1px solid var(--el-table-border-color);
}

:deep(.el-table--border::after),
:deep(.el-table--border::before) {
  background-color: var(--el-table-border-color);
}

:deep(.el-table__body tr:hover > td) {
  background-color: #ecf5ff;
}

:deep(.el-table .cell) {
  padding: 0 8px;
  line-height: 23px;
  text-align: center;
}

:deep(.el-table .is-leaf) {
  padding: 12px 8px;
  text-align: center;
}

:deep(.el-progress) {
  width: 100%;
  margin-bottom: 0;
}

:deep(.el-progress-bar__outer) {
  border-radius: 4px;
}

:deep(.el-progress-bar__inner) {
  border-radius: 4px;
}

:deep(.el-progress__text) {
  font-size: 13px !important;
  font-weight: 500;
  color: #fff;
}

:deep(.el-progress-bar__innerText) {
  font-size: 12px;
  color: #fff;
}

:deep(.el-table) {
  border-collapse: collapse;
}

:deep(.el-table__header-wrapper) {
  width: 100% !important;
}

:deep(.el-table__body-wrapper) {
  width: 100% !important;
}

:deep(.el-table__header) {
  width: 100% !important;
  table-layout: fixed;
}

:deep(.el-table__body) {
  width: 100% !important;
  table-layout: fixed;
}

:deep(.el-table .cell) {
  padding: 0 8px;
  line-height: 23px;
  text-align: center;
}

:deep(.el-table .is-leaf) {
  text-align: center;
}

.dashboard-wrapper {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.central-score {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 30px;
  font-weight: bold;
  color: #409EFF;
}

.announcement-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
}
</style>