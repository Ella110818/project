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

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        layout="total, sizes, prev, pager, next, jumper"
      />
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
import { ref, computed, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import api from '@/api';
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

// 分页参数
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 作业列表数据
const assignments = ref([]);

// 模拟数据
const mockAssignments = [
  {
    id: 1,
    title: '第一章课后作业',
    type: 'homework',
    description: '完成教材第15-20页的习题',
    startTime: '2023-11-01 08:00',
    deadline: '2023-11-10 23:59',
    status: '已截止',
    fullScore: 100,
    submitted: 18,
    total: 24
  },
  {
    id: 2,
    title: '第二章编程实验',
    type: 'homework',
    description: '完成实验指导书中的编程任务，并提交源代码和报告',
    startTime: '2023-11-15 08:00',
    deadline: '2023-11-25 23:59',
    status: '进行中',
    fullScore: 100,
    submitted: 10,
    total: 24
  },
  {
    id: 3,
    title: '期中考试',
    type: 'exam',
    description: '考试范围：第1-5章，闭卷，时长120分钟',
    startTime: '2023-12-01 14:00',
    deadline: '2023-12-01 16:00',
    status: '未开始',
    fullScore: 100,
    submitted: 0,
    total: 24
  }
];

// 获取作业列表 - 使用本地数据代替API调用
const loadAssignments = async () => {
  try {
    // 模拟加载延迟
    setTimeout(() => {
      // 过滤数据
      let filtered = [...mockAssignments];
      
      if (typeFilter.value) {
        filtered = filtered.filter(item => item.type === typeFilter.value);
      }
      
      if (statusFilter.value) {
        filtered = filtered.filter(item => item.status === statusFilter.value);
      }
      
      // 模拟分页
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      assignments.value = filtered.slice(start, end);
      total.value = filtered.length;
      
    }, 300);
  } catch (error) {
    console.error('加载作业列表失败:', error);
    ElMessage.error('加载作业列表失败');
  }
};

// 监听筛选条件变化
watch([typeFilter, statusFilter], () => {
  currentPage.value = 1;
  loadAssignments();
});

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page;
  loadAssignments();
};

const handleSizeChange = (size) => {
  pageSize.value = size;
  currentPage.value = 1;
  loadAssignments();
};

// 筛选后的作业/考试列表
const filteredAssignments = computed(() => {
  if (!searchText.value) {
    return assignments.value;
  }
  
  const searchQuery = searchText.value.toLowerCase();
  return assignments.value.filter(item => 
    item.title.toLowerCase().includes(searchQuery) || 
    item.description.toLowerCase().includes(searchQuery)
  );
});

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
      // 从模拟数据中删除
      const index = mockAssignments.findIndex(a => a.id === item.id);
      if (index !== -1) {
        mockAssignments.splice(index, 1);
        loadAssignments(); // 重新加载列表
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
const handleSubmit = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const courseId = localStorage.getItem('currentCourseId');
        if (!courseId) {
          ElMessage.error('未找到课程信息');
          return;
        }

        // 构建保存的数据
        const saveData = {
          title: formData.value.title,
          type: formData.value.type,
          description: formData.value.description,
          start_time: formData.value.timeRange[0],
          deadline: formData.value.timeRange[1],
          full_score: formData.value.fullScore
        };

        // 模拟API保存
        setTimeout(() => {
          if (isEditing.value) {
            // 更新已有作业
            const index = mockAssignments.findIndex(item => item.id === formData.value.id);
            if (index !== -1) {
              mockAssignments[index] = {
                ...mockAssignments[index],
                title: saveData.title,
                type: saveData.type,
                description: saveData.description,
                startTime: saveData.start_time,
                deadline: saveData.deadline,
                fullScore: saveData.full_score
              };
            }
          } else {
            // 添加新作业
            const newItem = {
              id: Date.now(),
              title: saveData.title,
              type: saveData.type,
              description: saveData.description,
              startTime: saveData.start_time,
              deadline: saveData.deadline,
              status: '未开始',
              fullScore: saveData.full_score,
              submitted: 0,
              total: 24
            };
            mockAssignments.push(newItem);
          }
          
          ElMessage.success(isEditing.value ? '更新成功' : '添加成功');
          dialogVisible.value = false;
          loadAssignments(); // 重新加载列表
        }, 300);
      } catch (error) {
        console.error('保存失败:', error);
        ElMessage.error('保存失败');
      }
    } else {
      return false;
    }
  });
};

// 组件挂载时加载数据
onMounted(() => {
  loadAssignments();
});
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

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>