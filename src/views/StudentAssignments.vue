<template>
  <div class="assignments-container">
    <div class="bg-image-container">
      <img src="~@/assets/bg3.png" alt="背景图片" class="bg-image" />
      <div class="overlay"></div>
    </div>
    
    <div class="decoration-container">
      <dv-decoration2 :dur="2" style="width:1500px;height:5px;" />
    </div>
    
    <div v-if="activeTab === 'homework'" class="assignments-list">
      <el-card v-for="assignment in assignments" :key="assignment.id" class="assignment-card">
        <div class="assignment-header">
          <h3>{{ assignment.title }}</h3>
          <el-tag :type="getStatusType(assignment.status)">{{ assignment.status }}</el-tag>
        </div>
        <div class="assignment-content">
          <p>{{ assignment.description }}</p>
          <div class="assignment-info">
            <span><el-icon><Timer /></el-icon> 截止时间：{{ assignment.deadline }}</span>
            <span><el-icon><Document /></el-icon> 满分：{{ assignment.score }}分</span>
          </div>
        </div>
        <div class="assignment-footer">
          <el-button 
            type="primary" 
            @click="handleSubmit(assignment)"
            :disabled="assignment.status === '已截止'"
          >
            {{ assignment.status === '已提交' ? '查看详情' : '提交作业' }}
          </el-button>
          <el-button 
            type="info" 
            @click="viewDetails(assignment)"
          >
            查看要求
          </el-button>
        </div>
      </el-card>
    </div>

    <div v-else-if="activeTab === 'exam'" class="assignments-list">
      <el-card v-for="exam in exams" :key="exam.id" class="assignment-card">
        <div class="assignment-header">
          <h3>{{ exam.title }}</h3>
          <el-tag :type="getStatusType(exam.status)">{{ exam.status }}</el-tag>
        </div>
        <div class="assignment-content">
          <p>{{ exam.description }}</p>
          <div class="assignment-info">
            <span><el-icon><Calendar /></el-icon> 考试时间：{{ exam.examTime }}</span>
            <span><el-icon><Timer /></el-icon> 时长：{{ exam.duration }}分钟</span>
            <span><el-icon><Document /></el-icon> 总分：{{ exam.totalScore }}分</span>
          </div>
        </div>
        <div class="assignment-footer">
          <el-button 
            type="primary" 
            @click="startExam(exam)"
            :disabled="exam.status !== '未开始'"
          >
            {{ getExamButtonText(exam.status) }}
          </el-button>
          <el-button 
            type="info" 
            @click="viewExamDetails(exam)"
          >
            查看详情
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { Calendar, Timer, Document } from '@element-plus/icons-vue'
import { Decoration2 } from '@kjgl77/datav-vue3'

export default {
  name: 'StudentAssignments',
  components: {
    Calendar,
    Timer,
    Document,
    'dv-decoration2': Decoration2
  },
  data() {
    return {
      activeTab: 'homework',
      assignments: [],
      exams: [
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
      ]
    }
  },
  created() {
    // 从路由参数获取类型
    const typeParam = this.$route.query.type;
    if (typeParam) {
      this.activeTab = typeParam;
    }
    
    // 模拟获取作业数据
    this.getAssignments();
  },
  watch: {
    // 监听路由变化
    '$route.query.type': function(newType) {
      if (newType) {
        this.activeTab = newType;
      }
    }
  },
  methods: {
    getStatusType(status) {
      const statusMap = {
        '未提交': 'warning',
        '已提交': 'success',
        '未开始': 'info',
        '已完成': 'success',
        '进行中': 'primary'
      }
      return statusMap[status]
    },
    handleSubmit(assignment) {
      console.log('提交作业:', assignment)
    },
    viewDetails(assignment) {
      console.log('查看作业详情:', assignment)
    },
    startExam(exam) {
      console.log('开始考试:', exam)
    },
    viewExamDetails(exam) {
      console.log('查看考试详情:', exam)
    },
    getExamButtonText(status) {
      const textMap = {
        '未开始': '进入考试',
        '进行中': '继续考试',
        '已完成': '查看成绩'
      }
      return textMap[status]
    },
    getAssignments() {
      // 模拟获取作业数据
      this.assignments = [
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
      ];
    }
  }
}
</script>

<style scoped>
.assignments-container {
  min-height: 100vh;
  padding: 20px 40px 20px 60px;
  position: relative;
  z-index: 0;
}

.bg-image-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(11, 24, 52, 0.01), rgba(22, 41, 86, 0.01));
}

.decoration-container {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
  margin-left: 20px;
}

.assignments-list {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
  padding-left: 30px;
}

.assignment-card {
  background: url('@/assets/border7.png');
  background-size: 100% 100%;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
  min-height: 250px;
  position: relative;
  margin-left: 10px;
}

.assignment-card::before {
  content: '';
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  width: 120px;
  height: 120px;
  background: none;
  opacity: 0.5;
  pointer-events: none;
  z-index: 0;
}

.assignment-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

:deep(.el-card__body) {
  position: relative;
  z-index: 1;
  padding: 20px;
  height: calc(100% - 40px);
  display: flex;
  flex-direction: column;
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
  color: #fff;
}

.assignment-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.assignment-content p {
  color: #67C2FF;
  margin-bottom: 10px;
  text-align: left;
}

.assignment-info {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  color: #8CC5FF;
  font-size: 14px;
}

.assignment-info span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.assignment-footer {
  position: absolute;
  bottom: 10px;
  left: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

:deep(.el-button) {
  margin: 0;
  height: 32px;
  line-height: 32px;
  padding: 0 15px;
}

:deep(.el-tag) {
  border-radius: 4px;
}
</style> 