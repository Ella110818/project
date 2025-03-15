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
        <div class="header-item">学术表现</div>
        <div class="header-item">行为习惯</div>
        <div class="header-item">学生总体评价</div>
      </div>

      <div class="evaluation-content">
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
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import axios from 'axios';

export default {
  setup() {
    const route = useRoute();
    const studentId = route.params.id;
    
    const currentDate = ref(new Date().toISOString().split('T')[0]);
    
    const studentInfo = ref({
      name: '',
      className: '',
      studentId: '',
      college: '',
      avatar: ''
    });
    
    const studentMetrics = ref({
      attention: 0,
      headDown: 0,
      confusion: 0,
      overall: 0
    });
    
    const evaluations = ref({
      homework: '',
      exam: ''
    });
    
    // 获取学生基本信息
    const fetchStudentInfo = async () => {
      try {
        const response = await axios.get(`/api/students/${studentId}`);
        studentInfo.value = response.data;
      } catch (error) {
        console.error('获取学生信息失败:', error);
        ElMessage.error('获取学生信息失败，请稍后重试');
      }
    };
    
    // 获取学生状态指标
    const fetchStudentMetrics = async () => {
      try {
        const response = await axios.get(`/api/students/${studentId}/metrics`);
        studentMetrics.value = response.data;
      } catch (error) {
        console.error('获取学生状态指标失败:', error);
        ElMessage.error('获取学生状态指标失败，请稍后重试');
      }
    };
    
    // 获取学生评价信息
    const fetchEvaluations = async () => {
      try {
        const response = await axios.get(`/api/students/${studentId}/evaluations`);
        evaluations.value = response.data;
      } catch (error) {
        console.error('获取学生评价信息失败:', error);
        ElMessage.error('获取学生评价信息失败，请稍后重试');
      }
    };
    
    // 组件挂载时获取所有数据
    onMounted(async () => {
      await Promise.all([
        fetchStudentInfo(),
        fetchStudentMetrics(),
        fetchEvaluations()
      ]);
    });

    return {
      currentDate,
      studentInfo,
      studentMetrics,
      evaluations
    };
  }
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

.header-item:hover {
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

.header-item:hover::after {
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