<template>
  <div class="assignment-container">
    <!-- 顶部搜索和筛选区域 -->
    <div class="assignment-header">
      <div class="search-filter">
        <el-input
          v-model="searchText"
          placeholder="搜索作业或考试"
          prefix-icon="Search"
          clearable
          style="width: 250px; margin-right: 16px;"
        />
        <el-select v-model="typeFilter" placeholder="类型" clearable style="width: 120px; margin-right: 16px;">
          <el-option label="全部" value="" />
          <el-option label="作业" value="homework" />
          <el-option label="考试" value="exam" />
        </el-select>
        <el-select v-model="statusFilter" placeholder="状态" clearable style="width: 120px;">
          <el-option label="全部" value="" />
          <el-option label="未开始" value="未开始" />
          <el-option label="进行中" value="进行中" />
          <el-option label="已截止" value="已截止" />
        </el-select>
      </div>
      <el-button type="primary" @click="showAddDialog">
        <el-icon><Plus /></el-icon>添加作业/考试
      </el-button>
    </div>

    <!-- 作业/考试列表 -->
    <div class="assignment-list">
      <el-empty v-if="filteredAssignments.length === 0" description="暂无作业或考试" />
      <el-card v-for="item in filteredAssignments" :key="item.id" class="assignment-item">
        <div class="assignment-header">
          <div class="assignment-title-group">
            <span class="assignment-type-tag" :class="item.type">{{ item.type === 'exam' ? '考试' : '作业' }}</span>
            <h3>{{ item.title }}</h3>
          </div>
          <el-tag :type="getStatusType(item.status)">{{ item.status }}</el-tag>
        </div>
        <div class="assignment-info">
          <p>{{ item.description }}</p>
          <div class="assignment-meta">
            <span><el-icon><Calendar /></el-icon> 开始时间：{{ item.startTime }}</span>
            <span><el-icon><Timer /></el-icon> 截止时间：{{ item.deadline }}</span>
            <span><el-icon><ScaleToOriginal /></el-icon> 满分：{{ item.fullScore }}分</span>
            <span><el-icon><User /></el-icon> 已提交：{{ item.submitted }}/{{ item.total }}</span>
          </div>
        </div>
        <div class="assignment-actions">
          <el-button-group>
            <el-button type="primary" @click="handleEdit(item)">
              <el-icon><Edit /></el-icon>编辑
            </el-button>
            <el-button type="success" @click="handleCheck(item)">
              <el-icon><View /></el-icon>查看提交
            </el-button>
            <el-button type="danger" @click="handleDelete(item)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </el-button-group>
        </div>
      </el-card>
    </div>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑作业/考试' : '添加作业/考试'"
      width="50%"
    >
      <el-form :model="formData" label-width="100px" :rules="rules" ref="formRef">
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio label="homework">作业</el-radio>
            <el-radio label="exam">考试</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            placeholder="请输入详细描述"
          />
        </el-form-item>
        <el-form-item label="满分" prop="fullScore">
          <el-input-number v-model="formData.fullScore" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="时间范围" prop="timeRange">
          <el-date-picker
            v-model="formData.timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="截止时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            :shortcuts="dateShortcuts"
          />
        </el-form-item>
        <el-form-item label="附件">
          <el-upload
            action="#"
            :auto-upload="false"
            :limit="5"
            multiple
            :on-exceed="handleExceed"
            :file-list="formData.fileList"
            style="width: 100%"
          >
            <el-button type="primary">
              <el-icon><Upload /></el-icon>上传附件
            </el-button>
            <template #tip>
              <div class="el-upload__tip">
                可上传文档、图片等文件，单个文件不超过10MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { 
  Calendar, 
  Timer, 
  ScaleToOriginal, 
  User, 
  Edit, 
  View, 
  Delete, 
  Search, 
  Plus, 
  Upload 
} from '@element-plus/icons-vue';

// 搜索和筛选
const searchText = ref('');
const typeFilter = ref('');
const statusFilter = ref('');

// 表单数据
const dialogVisible = ref(false);
const isEditing = ref(false);
const formRef = ref(null);
const formData = ref({
  id: '',
  title: '',
  type: 'homework',
  description: '',
  fullScore: 100,
  timeRange: [],
  fileList: []
});

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择类型', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入描述', trigger: 'blur' }
  ],
  fullScore: [
    { required: true, message: '请设置满分', trigger: 'blur' }
  ],
  timeRange: [
    { required: true, message: '请设置时间范围', trigger: 'change' }
  ]
};

// 日期快捷选项
const dateShortcuts = [
  {
    text: '一周',
    value: () => {
      const end = new Date();
      const start = new Date();
      end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: '两周',
    value: () => {
      const end = new Date();
      const start = new Date();
      end.setTime(end.getTime() + 3600 * 1000 * 24 * 14);
      return [start, end];
    },
  },
  {
    text: '一个月',
    value: () => {
      const end = new Date();
      const start = new Date();
      end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
];

// 作业和考试数据
const assignments = ref([
  {
    id: 1,
    title: '期中考试',
    type: 'exam',
    description: '请大家认真准备期中考试。包括第1-5章内容，考试时间2小时。',
    startTime: '2024-05-15 08:30',
    deadline: '2024-05-15 10:30',
    status: '进行中',
    fullScore: 100,
    submitted: 28,
    total: 35
  },
  {
    id: 2,
    title: '作业1 - 第一章课后习题',
    type: 'homework',
    description: '完成第一章的课后习题。请认真思考，独立完成。',
    startTime: '2024-05-01',
    deadline: '2024-05-10',
    status: '已截止',
    fullScore: 10,
    submitted: 32,
    total: 35
  },
  {
    id: 3,
    title: '作业2 - 第二章复习',
    type: 'homework',
    description: '复习第二章内容，完成章节小结。',
    startTime: '2024-05-03',
    deadline: '2024-05-12',
    status: '已截止',
    fullScore: 10,
    submitted: 30,
    total: 35
  },
  {
    id: 4,
    title: '作业3 - 第三章课后题',
    type: 'homework',
    description: '提交第三章的课后习题，包括计算题和论述题。',
    startTime: '2024-05-05',
    deadline: '2024-05-18',
    status: '进行中',
    fullScore: 15,
    submitted: 25,
    total: 35
  },
  {
    id: 5,
    title: '期末考试',
    type: 'exam',
    description: '本学期期末考试，包括所有章节内容。',
    startTime: '2024-06-01 14:00',
    deadline: '2024-06-01 16:00',
    status: '未开始',
    fullScore: 100,
    submitted: 0,
    total: 35
  },
]);

// 筛选后的作业/考试列表
const filteredAssignments = computed(() => {
  return assignments.value.filter(item => {
    const matchesSearch = searchText.value ? 
      item.title.toLowerCase().includes(searchText.value.toLowerCase()) || 
      item.description.toLowerCase().includes(searchText.value.toLowerCase()) : 
      true;
    
    const matchesType = typeFilter.value ? item.type === typeFilter.value : true;
    const matchesStatus = statusFilter.value ? item.status === statusFilter.value : true;
    
    return matchesSearch && matchesType && matchesStatus;
  });
});

// 获取状态对应的类型
const getStatusType = (status) => {
  const types = {
    '未开始': 'info',
    '进行中': 'warning',
    '已截止': 'danger'
  };
  return types[status] || 'info';
};

// 显示添加对话框
const showAddDialog = () => {
  isEditing.value = false;
  resetForm();
  dialogVisible.value = true;
};

// 重置表单
const resetForm = () => {
  formData.value = {
    id: '',
    title: '',
    type: 'homework',
    description: '',
    fullScore: 100,
    timeRange: [],
    fileList: []
  };
  if (formRef.value) {
    formRef.value.resetFields();
  }
};

// 处理编辑
const handleEdit = (item) => {
  isEditing.value = true;
  formData.value = {
    id: item.id,
    title: item.title,
    type: item.type,
    description: item.description,
    fullScore: item.fullScore,
    timeRange: [item.startTime, item.deadline],
    fileList: [] // 实际应用中应该加载已有附件
  };
  dialogVisible.value = true;
};

// 处理查看提交
const handleCheck = (item) => {
  ElMessage.info(`查看 ${item.title} 的提交记录，已有${item.submitted}人提交`);
  // 实际应用中应该跳转到提交列表页面
};

// 处理删除
const handleDelete = (item) => {
  ElMessageBox.confirm(
    `确定要删除 ${item.title} 吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      // 从列表中删除
      const index = assignments.value.findIndex(a => a.id === item.id);
      if (index !== -1) {
        assignments.value.splice(index, 1);
      }
      ElMessage.success('删除成功');
    })
    .catch(() => {
      // 取消删除操作
    });
};

// 处理文件上传超出限制
const handleExceed = () => {
  ElMessage.warning('最多只能上传5个文件');
};

// 提交表单
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      // 构建保存的数据
      const saveData = {
        id: isEditing.value ? formData.value.id : assignments.value.length + 1,
        title: formData.value.title,
        type: formData.value.type,
        description: formData.value.description,
        startTime: formData.value.timeRange[0],
        deadline: formData.value.timeRange[1],
        fullScore: formData.value.fullScore,
        status: new Date() > new Date(formData.value.timeRange[0]) ? '进行中' : '未开始',
        submitted: isEditing.value ? assignments.value.find(a => a.id === formData.value.id)?.submitted || 0 : 0,
        total: 35
      };

      if (isEditing.value) {
        // 更新现有项
        const index = assignments.value.findIndex(a => a.id === formData.value.id);
        if (index !== -1) {
          assignments.value[index] = saveData;
        }
        ElMessage.success('更新成功');
      } else {
        // 添加新项
        assignments.value.push(saveData);
        ElMessage.success('添加成功');
      }

      dialogVisible.value = false;
    } else {
      return false;
    }
  });
};
</script>

<style scoped>
.assignment-container {
  padding: 20px;
}

.assignment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-filter {
  display: flex;
  align-items: center;
}

.assignment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.assignment-item {
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 8px;
  border-left: 4px solid #409EFF;
}

.assignment-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.assignment-item.exam {
  border-left-color: #F56C6C;
}

.assignment-item.homework {
  border-left-color: #67C23A;
}

.assignment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.assignment-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.assignment-title-group h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.assignment-type-tag {
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 4px;
  color: white;
}

.assignment-type-tag.exam {
  background-color: #F56C6C;
}

.assignment-type-tag.homework {
  background-color: #67C23A;
}

.assignment-info {
  margin-bottom: 16px;
}

.assignment-info p {
  margin-top: 0;
  margin-bottom: 12px;
  color: #606266;
}

.assignment-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  font-size: 14px;
  color: #909399;
}

.assignment-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.assignment-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.el-upload__tip {
  color: #909399;
  font-size: 12px;
  margin-top: 8px;
}
</style>