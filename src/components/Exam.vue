<template>
  <el-card class="box-card">
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :icon="activity.icon"
        :type="activity.type"
        :color="activity.color"
        :size="activity.size"
        :hollow="activity.hollow"
        :timestamp="activity.timestamp"
        placement="top"
      >
        <el-card class="card">
          <h4>{{ activity.title }}</h4>
          <p>{{ activity.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <div class="button-container">
      <el-button type="primary" round @click="handleAdd">添加作业/考试</el-button>
    </div>
  </el-card>
</template>

<script>
import { ref } from 'vue';
import { ElCard, ElButton, ElTimeline, ElTimelineItem } from 'element-plus';
import { MoreFilled } from '@element-plus/icons-vue';

export default {
  components: {
    ElCard,
    ElButton,
    ElTimeline,
    ElTimelineItem,
  },
  setup() {
    const activities = ref([
      {
        content: '请大家认真准备期中考试。',
        timestamp: '2024-05-15',
        title: '期中考试',
        color: '#0bbd87',
        type: 'primary',
        size: 'large',
      },
      {
        content: '完成第一章的课后习题。',
        timestamp: '2024-05-10',
        title: '作业1',
        color: '#0bbd87',
      },
      {
        content: '复习第二章内容。',
        timestamp: '2024-05-05',
        title: '作业2',
        size: 'large',
        color: '#0bbd87',
      },
      {
        content: '提交第三章的课后习题。',
        timestamp: '2024-05-01',
        title: '作业3',
        hollow: true,
        color: '#0bbd87',
      },
      {
        content: '准备期末考试。',
        timestamp: '2024-06-01',
        title: '期末考试',
      },
    ]);

    const handleAdd = () => {
      console.log('添加作业/考试');
    };

    return {
      activities,
      handleAdd,
    };
  },
};
</script>

<style scoped>
.box-card {
  width: 980px;
}
.card{
background: linear-gradient(to right, #f0f8ff, #ffffff);
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
}
 .card:hover {
  transform: scale(1.01); /* 悬停时放大卡片 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 悬停时添加阴影 */
}
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.button-container {
  text-align: right;
  padding-top: 20px;
}

.el-timeline {
  margin: 0;
  padding: 0;
}

.el-timeline-item .el-timeline-item__timestamp {
  font-size: 13px;
  color: #909399;
}

.el-card {
  box-shadow: none;
}
</style>