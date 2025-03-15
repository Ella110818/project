<template>
  <div class="grades-container">
    <!-- 成绩概览卡片 -->
    <div class="grade-overview">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="overview-card">
            <template #header>
              <div class="card-header">
                <span>总平均分</span>
              </div>
            </template>
            <div class="card-content">
              <span class="grade-number">{{ averageScore }}</span>
              <span class="grade-unit">分</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="overview-card">
            <template #header>
              <div class="card-header">
                <span>最高分</span>
              </div>
            </template>
            <div class="card-content">
              <span class="grade-number">{{ highestScore }}</span>
              <span class="grade-unit">分</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="overview-card">
            <template #header>
              <div class="card-header">
                <span>最低分</span>
              </div>
            </template>
            <div class="card-content">
              <span class="grade-number">{{ lowestScore }}</span>
              <span class="grade-unit">分</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="overview-card">
            <template #header>
              <div class="card-header">
                <span>总课程数</span>
              </div>
            </template>
            <div class="card-content">
              <span class="grade-number">{{ totalCourses }}</span>
              <span class="grade-unit">门</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 成绩详情表格 -->
    <el-card class="grade-details">
      <template #header>
        <div class="card-header">
          <span>成绩详情</span>
          <el-select v-model="selectedSemester" placeholder="选择学期" style="width: 150px">
            <el-option
              v-for="item in semesters"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </template>
      
      <el-table :data="gradeList" style="width: 100%">
        <el-table-column prop="courseName" label="课程名称" min-width="180" />
        <el-table-column prop="courseType" label="课程类型" width="120" />
        <el-table-column prop="credit" label="学分" width="80" align="center" />
        <el-table-column label="成绩组成" width="300">
          <template #default="scope">
            <div class="grade-composition">
              <el-tooltip
                v-for="(item, index) in scope.row.composition"
                :key="index"
                :content="item.name + ': ' + item.score + '分'"
                placement="top"
              >
                <div class="composition-item">
                  <div class="composition-progress">
                    <el-progress
                      :percentage="item.score"
                      :color="getProgressColor(item.score)"
                      :show-text="false"
                      :stroke-width="8"
                    />
                  </div>
                  <span class="composition-label">{{ item.name }}</span>
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="finalScore" label="总评" width="100" align="center">
          <template #default="scope">
            <span :class="getScoreClass(scope.row.finalScore)">{{ scope.row.finalScore }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'StudentGrades',
  data() {
    return {
      averageScore: 88.5,
      highestScore: 95,
      lowestScore: 82,
      totalCourses: 5,
      selectedSemester: '2023-2024-2',
      semesters: [
        { value: '2023-2024-2', label: '2023-2024学年第二学期' },
        { value: '2023-2024-1', label: '2023-2024学年第一学期' }
      ],
      gradeList: [
        {
          courseName: '脑机接口导论',
          courseType: '专业必修',
          credit: 3,
          composition: [
            { name: '平时成绩', score: 90 },
            { name: '实验', score: 85 },
            { name: '期末考试', score: 88 }
          ],
          finalScore: 88
        },
        {
          courseName: '人工智能基础',
          courseType: '专业选修',
          credit: 2,
          composition: [
            { name: '平时成绩', score: 92 },
            { name: '项目', score: 95 },
            { name: '期末考试', score: 89 }
          ],
          finalScore: 92
        }
      ]
    }
  },
  methods: {
    getProgressColor(score) {
      if (score >= 90) return '#67C23A'
      if (score >= 80) return '#409EFF'
      if (score >= 60) return '#E6A23C'
      return '#F56C6C'
    },
    getScoreClass(score) {
      if (score >= 90) return 'score-excellent'
      if (score >= 80) return 'score-good'
      if (score >= 60) return 'score-pass'
      return 'score-fail'
    }
  }
}
</script>

<style scoped>
.grades-container {
  padding: 20px;
}

.grade-overview {
  margin-bottom: 20px;
}

.overview-card {
  height: 160px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  display: flex;
  justify-content: center;
  align-items: baseline;
  height: 80px;
}

.grade-number {
  font-size: 36px;
  font-weight: bold;
  color: #303133;
}

.grade-unit {
  margin-left: 4px;
  font-size: 14px;
  color: #909399;
}

.grade-composition {
  display: flex;
  gap: 10px;
}

.composition-item {
  flex: 1;
  min-width: 80px;
}

.composition-progress {
  margin-bottom: 4px;
}

.composition-label {
  font-size: 12px;
  color: #909399;
}

.score-excellent {
  color: #67C23A;
  font-weight: bold;
}

.score-good {
  color: #409EFF;
  font-weight: bold;
}

.score-pass {
  color: #E6A23C;
  font-weight: bold;
}

.score-fail {
  color: #F56C6C;
  font-weight: bold;
}

.overview-card :deep(.el-card__header) {
  padding: 10px 15px;
  border-bottom: 1px solid #EBEEF5;
}

.grade-details :deep(.el-card__header) {
  padding: 15px 20px;
}

.el-table {
  margin-top: 10px;
}
</style> 