<template>
  <div class="assignments-container">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="作业" name="homework">
        <div class="assignments-list">
          <el-card v-for="assignment in assignments" :key="assignment.id" class="assignment-card">
            <div class="assignment-header">
              <h3>{{ assignment.title }}</h3>
              <el-tag :type="getStatusType(assignment.status)">{{ assignment.status }}</el-tag>
            </div>
            <div class="assignment-content">
              <p>{{ assignment.description }}</p>
              <div class="assignment-info">
                <span><i class="el-icon-date"></i> 截止日期：{{ assignment.deadline }}</span>
                <span><i class="el-icon-document"></i> 分值：{{ assignment.score }}分</span>
              </div>
            </div>
            <div class="assignment-footer">
              <el-button 
                type="primary" 
                size="small"
                @click="handleSubmit(assignment)"
                :disabled="assignment.status === '已提交'"
              >
                {{ assignment.status === '已提交' ? '已提交' : '提交作业' }}
              </el-button>
              <el-button 
                type="info" 
                size="small"
                @click="viewDetails(assignment)"
              >
                查看详情
              </el-button>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="考试" name="exam">
        <div class="assignments-list">
          <el-card v-for="exam in exams" :key="exam.id" class="assignment-card">
            <div class="assignment-header">
              <h3>{{ exam.title }}</h3>
              <el-tag :type="getStatusType(exam.status)">{{ exam.status }}</el-tag>
            </div>
            <div class="assignment-content">
              <p>{{ exam.description }}</p>
              <div class="assignment-info">
                <span><i class="el-icon-date"></i> 考试时间：{{ exam.examTime }}</span>
                <span><i class="el-icon-timer"></i> 时长：{{ exam.duration }}分钟</span>
                <span><i class="el-icon-document"></i> 总分：{{ exam.totalScore }}分</span>
              </div>
            </div>
            <div class="assignment-footer">
              <el-button 
                type="primary" 
                size="small"
                @click="startExam(exam)"
                :disabled="exam.status !== '未开始'"
              >
                {{ getExamButtonText(exam.status) }}
              </el-button>
              <el-button 
                type="info" 
                size="small"
                @click="viewExamDetails(exam)"
              >
                查看详情
              </el-button>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeTab = ref('homework');
const assignments = ref([
  {
    id: 1,
    title: '第一次作业',
    description: '完成教材第一章的练习题1-5',
    deadline: '2024-03-20 23:59',
    score: 100,
    status: '未提交'
  },
  {
    id: 2,
    title: '第二次作业',
    description: '完成课后实验报告',
    deadline: '2024-03-25 23:59',
    score: 100,
    status: '已提交'
  }
]);

const exams = ref([
  {
    id: 1,
    title: '期中考试',
    description: '本次考试范围为第1-5章',
    examTime: '2024-04-15 14:00',
    duration: 120,
    totalScore: 100,
    status: '未开始'
  },
  {
    id: 2,
    title: '第一次测验',
    description: '本次测验范围为第1-2章',
    examTime: '2024-03-10 10:00',
    duration: 60,
    totalScore: 100,
    status: '已完成'
  }
]);

const getStatusType = (status) => {
  const statusMap = {
    '未提交': 'warning',
    '已提交': 'success',
    '未开始': 'info',
    '已完成': 'success',
    '进行中': 'primary'
  };
  return statusMap[status];
};

const handleSubmit = (assignment) => {
  // 处理作业提交
  console.log('提交作业:', assignment);
};

const viewDetails = (assignment) => {
  // 查看作业详情
  console.log('查看作业详情:', assignment);
};

const startExam = (exam) => {
  // 开始考试
  console.log('开始考试:', exam);
};

const viewExamDetails = (exam) => {
  // 查看考试详情
  console.log('查看考试详情:', exam);
};

const getExamButtonText = (status) => {
  const textMap = {
    '未开始': '进入考试',
    '进行中': '继续考试',
    '已完成': '查看成绩'
  };
  return textMap[status];
};
</script>

<style scoped>
.assignments-container {
  padding: 20px;
}

.assignments-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.assignment-card {
  transition: all 0.3s ease;
}

.assignment-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.assignment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.assignment-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.assignment-content {
  margin-bottom: 15px;
}

.assignment-content p {
  color: #606266;
  margin-bottom: 10px;
}

.assignment-info {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  color: #909399;
  font-size: 14px;
}

.assignment-info span {
  display: flex;
  align-items: center;
}

.assignment-info i {
  margin-right: 5px;
}

.assignment-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}
</style> 