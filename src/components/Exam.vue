<template>
  <div class="exam-container">
    <!-- 发布作业/考试表单 -->
    <el-form :model="form" label-width="100px" class="exam-form">
      <el-form-item label="类型">
        <el-radio-group v-model="form.type">
          <el-radio label="homework">作业</el-radio>
          <el-radio label="exam">考试</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="form.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="截止时间">
        <el-date-picker
          v-model="form.deadline"
          type="datetime"
          placeholder="选择截止时间"
          format="YYYY-MM-DD HH:mm"
        />
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="请输入详细描述"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">发布</el-button>
      </el-form-item>
    </el-form>

    <!-- 作业/考试列表 -->
    <div class="exam-list">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="进行中" name="ongoing">
          <el-table :data="ongoingTasks" style="width: 100%">
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="type" label="类型">
              <template #default="scope">
                {{ scope.row.type === 'homework' ? '作业' : '考试' }}
              </template>
            </el-table-column>
            <el-table-column prop="deadline" label="截止时间" />
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button size="small" @click="viewDetail(scope.row)">查看</el-button>
                <el-button size="small" type="danger" @click="deleteTask(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="已结束" name="finished">
          <el-table :data="finishedTasks" style="width: 100%">
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="type" label="类型">
              <template #default="scope">
                {{ scope.row.type === 'homework' ? '作业' : '考试' }}
              </template>
            </el-table-column>
            <el-table-column prop="deadline" label="截止时间" />
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button size="small" @click="viewDetail(scope.row)">查看</el-button>
                <el-button size="small" type="danger" @click="deleteTask(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import axios from 'axios';

const route = useRoute();
const courseId = route.params.id;

const form = ref({
  type: 'homework',
  title: '',
  deadline: '',
  description: ''
});

const tasks = ref([]);
const activeTab = ref('ongoing');

// 获取作业和考试列表
const fetchTasks = async () => {
  try {
    const response = await axios.get(`/api/courses/${courseId}/tasks`);
    tasks.value = response.data;
  } catch (error) {
    console.error('获取作业/考试列表失败:', error);
    ElMessage.error('获取列表失败，请稍后重试');
  }
};

// 提交表单
const submitForm = async () => {
  if (!form.value.title || !form.value.deadline || !form.value.description) {
    ElMessage.warning('请填写完整信息');
    return;
  }

  try {
    await axios.post(`/api/courses/${courseId}/tasks`, form.value);
    ElMessage.success('发布成功！');
    form.value = {
      type: 'homework',
      title: '',
      deadline: '',
      description: ''
    };
    fetchTasks();
  } catch (error) {
    console.error('发布失败:', error);
    ElMessage.error('发布失败，请稍后重试');
  }
};

// 查看详情
const viewDetail = (task) => {
  ElMessageBox.alert(task.description, task.title, {
    confirmButtonText: '确定'
  });
};

// 删除任务
const deleteTask = async (task) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个任务吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    await axios.delete(`/api/courses/${courseId}/tasks/${task.id}`);
    ElMessage.success('删除成功');
    fetchTasks();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error);
      ElMessage.error('删除失败，请稍后重试');
    }
  }
};

// 计算进行中的任务
const ongoingTasks = computed(() => {
  const now = new Date();
  return tasks.value.filter(task => new Date(task.deadline) > now);
});

// 计算已结束的任务
const finishedTasks = computed(() => {
  const now = new Date();
  return tasks.value.filter(task => new Date(task.deadline) <= now);
});

// 组件挂载时获取任务列表
onMounted(() => {
  fetchTasks();
});
</script>

<style scoped>
.exam-container {
  padding: 20px;
}

.exam-form {
  max-width: 600px;
  margin-bottom: 30px;
}

.exam-list {
  margin-top: 20px;
}

.el-table {
  margin-top: 20px;
}
</style>