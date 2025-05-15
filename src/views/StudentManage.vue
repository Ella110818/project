<template>
  <div class="page-content">
    <animated-background />
    <div class="gray-space"></div>
    <div class="content-wrapper">
      <div class="search-section">
        <el-button type="primary" @click="showDialog('add')">新增</el-button>
        <el-select
          v-model="selectedCourses"
          multiple
          placeholder="所有课程"
          class="course-select"
          @change="handleCourseChange"
          font-color="black"
        >
          <el-option
            v-for="item in courseOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="searchText"
          class="search-input"
          placeholder="搜索学生的姓名或学号"
          :suffix-icon="Search"
          @input="handleSearchChange"
        />
      </div>
      <div class="table"> 
        <el-table :data="tableData" style="width: 100%" :border="false" :cell-style="{ textAlign: 'center' }" v-loading="loading">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="班级" prop="className" width="150" align="center" />
        <el-table-column label="学生" width="150" align="center">
          <template #default="scope">
            <div class="user">
              <img class="avatar" :src="scope.row.avatar" />
              <div class="user-info">
                <p class="user-name">{{ scope.row.username }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="学号" prop="mobile" width="150" align="center" />
        <el-table-column label="邮箱" prop="email" width="200" align="center" />
        <el-table-column label="手机号" width="130" align="center">
          <template #default="scope">
            {{ scope.row.phone || '暂无' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="default"
              class="blue-button"
              @click="viewStudentDetail(scope.row)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      </div>
      
      <el-dialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
        width="30%"
      >
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="formData.username" />
          </el-form-item>
          <el-form-item label="学号" prop="studentId">
            <el-input v-model="formData.studentId" />
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="formData.sex">
              <el-option label="男" :value="1" />
              <el-option label="女" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="班级" prop="className">
            <el-select v-model="formData.className">
              <el-option
                v-for="item in classOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Edit, Delete, View } from '@element-plus/icons-vue';
import api from '@/api';  // 导入 api
import AnimatedBackground from '@/components/AnimatedBackground.vue';
import { useRouter } from 'vue-router'; // 导入路由

const router = useRouter(); // 使用路由

const dialogType = ref('add');
const dialogVisible = ref(false);
const loading = ref(false);

// 课程选项
const courseOptions = ref([]);
const selectedCourses = ref([]);

// 获取课程列表
const fetchCourses = async () => {
  try {
    const response = await api.getCourses();
    if (response.code === 200) {
      courseOptions.value = response.data.items.map(course => ({
        value: course.course_id,
        label: course.title
      }));
    } else {
      ElMessage.error(response.message || '获取课程列表失败');
    }
  } catch (error) {
    console.error('获取课程列表失败:', error);
    ElMessage.error('获取课程列表失败，请稍后重试');
  }
};

// 获取选中课程的学生列表
const fetchStudents = async (courseId) => {
  try {
    loading.value = true;
    console.log(`正在获取课程 ${courseId} 的学生列表...`);
    const response = await api.getCourseStudents(courseId);
    console.log(`课程 ${courseId} 的响应数据:`, response);

    if (response.code === 200) {
      console.log('API返回的原始数据:', response.data.items);
      const students = response.data.items.map(item => ({
        id: item.student_id,
        username: item.username,
        mobile: item.student_id,
        email: item.email,
        phone: item.phone,
        className: item.class_name,
        classSystem: item.class_system,
        avatar: item.avatar || '/teacher/image/song.png',
        staff_id: item.staff_id
      }));
      console.log('处理后的学生列表:', students);
      return students;
    } else {
      console.warn(`获取课程 ${courseId} 的学生列表失败:`, response.message);
      ElMessage.warning(response.message || `获取课程 ${courseId} 的学生列表失败`);
      return [];
    }
  } catch (error) {
    console.error(`获取课程 ${courseId} 的学生列表失败:`, error);
    if (error.response) {
      console.error('错误响应:', error.response);
      ElMessage.error(error.response.data?.message || `获取课程 ${courseId} 的学生列表失败`);
    } else {
      ElMessage.error(`获取课程 ${courseId} 的学生列表失败，请检查网络连接`);
    }
    return [];
  } finally {
    loading.value = false;
  }
};

// 更新学生列表
const updateStudentList = async () => {
  try {
    loading.value = true;
    let allStudents = [];
    
    // 获取所有选中课程的学生
    if (selectedCourses.value.length > 0) {
      console.log('选中的课程:', selectedCourses.value);
      for (const courseId of selectedCourses.value) {
        const students = await fetchStudents(courseId);
        allStudents = [...allStudents, ...students];
      }
    }
    
    // 如果有搜索文本，进行过滤
    if (searchText.value) {
      const searchLower = searchText.value.toLowerCase();
      allStudents = allStudents.filter(student => 
        student.username.toLowerCase().includes(searchLower) ||
        student.mobile.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower)
      );
    }
    
    console.log('更新后的学生列表:', allStudents);
    tableData.value = allStudents;

    // 如果没有数据，显示提示
    if (allStudents.length === 0 && selectedCourses.value.length > 0) {
      ElMessage.info('未找到符合条件的学生');
    }
  } catch (error) {
    console.error('更新学生列表失败:', error);
    ElMessage.error('更新学生列表失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const searchText = ref('');
const tableData = ref([]);

// 监听课程选择变化
const handleCourseChange = () => {
  updateStudentList();
};

// 监听搜索文本变化
const handleSearchChange = () => {
  updateStudentList();
};

// 组件挂载时初始化数据
onMounted(() => {
  fetchCourses();
  // 不再使用模拟数据，直接调用API
});

const formData = reactive({
  username: '',
  studentId: '',
  sex: 1,
  className: '',
  id: null,
});

const classOptions = ref([]);

// 删除学生
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该学生吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = tableData.value.findIndex(student => student.id === row.id);
    if (index !== -1) {
      tableData.value.splice(index, 1);
      updateStudentList();
      ElMessage.success('删除成功');
    }
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
};

// 编辑学生
const handleEdit = (row) => {
  showDialog('edit', row);
};

const showDialog = (type, row) => {
  dialogVisible.value = true;
  dialogType.value = type;

  if (type === 'edit' && row) {
    formData.username = row.username;
    formData.studentId = row.mobile;
    formData.sex = row.sex;
    formData.className = row.className;
    formData.id = row.id;
  } else {
    formData.username = '';
    formData.studentId = '';
    formData.sex = 1;
    formData.className = '';
    formData.id = null;
  }
};

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { pattern: /^\d{11}$/, message: '请输入正确的11位学号', trigger: 'blur' },
  ],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  className: [{ required: true, message: '请选择班级', trigger: 'change' }],
});

const formRef = ref(null);

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (dialogType.value === 'add') {
        const newUser = {
          id: tableData.value.length + 1,
          username: formData.username,
          mobile: formData.studentId,
          sex: formData.sex,
          className: formData.className,
          avatar: '/teacher/image/song.png',
          email: `${formData.username}@example.com`
        };
        tableData.value.push(newUser);
        ElMessage.success('添加成功');
      } else {
        const index = tableData.value.findIndex(item => item.id === formData.id);
        if (index !== -1) {
          tableData.value[index] = {
            ...tableData.value[index],
            username: formData.username,
            mobile: formData.studentId,
            sex: formData.sex,
            className: formData.className
          };
          ElMessage.success('更新成功');
        }
      }
      updateStudentList();
      dialogVisible.value = false;
    }
  });
};

// 修改查看详情的方法
const viewStudentDetail = (student) => {
  console.log('查看学生详情:', student);
  // 跳转到详情页，传递学生ID作为参数，使用配置的'/student/:id'路由
  router.push({
    path: `/student/${student.id}`,
    query: {
      name: student.username,
      studentId: student.mobile,
      className: student.className,
      avatar: student.avatar,
      email: student.email,
      phone: student.phone
    }
  });
};
</script>

<style lang="scss" scoped>
.page-content {
  width: 100%;
  max-width: 1480px;
  min-height: calc(100vh - 24px);
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  background-color: transparent;
  z-index: 1;
  isolation: isolate;
}

.gray-space {
  height: 12px;
  background-color: transparent;
}

.content-wrapper {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 
    rgba(99, 147, 244, 0.2) 0px 0px 0px 2px,
    rgba(99, 147, 244, 0.15) 0px 4px 16px;
  padding: 20px;
  margin-bottom: 20px;
  position: relative;
  z-index: 2;
}

.search-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  border: 1px solid rgba(99, 147, 244, 0.2);
  box-shadow: 0 2px 8px rgba(99, 147, 244, 0.1);
}

.el-button {
  margin-right: 20px;
  border-width: 2px;
  &.el-button--primary {
    border-color: rgba(99, 147, 244, 0.8);
    box-shadow: 0 2px 6px rgba(99, 147, 244, 0.15);
  }
}

.course-select {
  width: 240px;
  margin-right: 20px;
  :deep(.el-input__wrapper) {
    border: 1px solid rgba(99, 147, 244, 0.2);
    box-shadow: 0 2px 6px rgba(99, 147, 244, 0.08);
    &:hover {
      border-color: rgba(99, 147, 244, 0.4);
    }
    &.is-focus {
      border-color: rgba(99, 147, 244, 0.6);
      box-shadow: 0 0 0 2px rgba(99, 147, 244, 0.1);
    }
  }
}

.search-input {
  :deep(.el-input__wrapper) {
    border: 1px solid rgba(99, 147, 244, 0.2);
    box-shadow: 0 2px 6px rgba(99, 147, 244, 0.08);
    &:hover {
      border-color: rgba(99, 147, 244, 0.4);
    }
    &.is-focus {
      border-color: rgba(99, 147, 244, 0.6);
      box-shadow: 0 0 0 2px rgba(99, 147, 244, 0.1);
    }
  }
}

.table {
  background-color: white;
  border-radius: 8px;
  padding: 0;
  overflow: hidden;
  border: 1px solid rgba(99, 147, 244, 0.15);
  box-shadow: 0 2px 12px rgba(99, 147, 244, 0.08);
}

:deep(.el-table) {
  border: none;
  
  &::before {
    display: none;
  }
  
  .el-table__header-wrapper {
    th.el-table__cell {
      background-color: #f0f7ff;
      color: #333;
      font-weight: 600;
      border-bottom: 2px solid rgba(99, 147, 244, 0.2);
      height: 50px;
    }
  }

  .el-table__body-wrapper {
    .el-table__row {
      td {
        border-bottom: 1px solid rgba(99, 147, 244, 0.1);
        height: 60px;
      }
      
      &:hover {
        td {
          background-color: rgba(99, 147, 244, 0.05);
        }
      }
    }
  }
}

.table-actions {
  margin-bottom: 20px;
}

.user {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.user-info {
  margin-left: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
  border: 2px solid #ebeef5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-name {
  font-weight: 500;
  color: #333;
  margin: 0;
}

::v-deep(.el-table) {
  width: 100% !important;
  border-collapse: collapse;
  border: none;
}

::v-deep(.el-table__header-wrapper) {
  width: 100% !important;
  th.el-table__cell {
    background-color: #E6F2FF !important;
    font-weight: 600 !important;
    color: #000000 !important;
    height: 40px !important;
    line-height: 40px !important;
    padding: 8px 0;
  }
}

::v-deep(.el-table__body-wrapper) {
  width: 100% !important;
}

::v-deep(.el-table__header) {
  width: 100% !important;
  table-layout: fixed;
  background-color: #E6F2FF;
}

::v-deep(.el-table__body) {
  width: 100% !important;
  table-layout: fixed;
}

::v-deep(.el-table--border) {
  border: none;
}

::v-deep(.el-table__cell) {
  border: none !important;
}

::v-deep(.el-table--border .el-table__cell) {
  border: none !important;
}

::v-deep(.el-table__inner-wrapper::before) {
  display: none;
}

.table th, .table td { 
  border: none !important; 
}

.operation-divider {
  display: inline-block;
  width: 1px;
  height: 14px;
  background-color: #DCDFE6;
  margin: 0 8px;
  vertical-align: middle;
}

.search-input {
  width: 400px !important;
  margin: 0 20px 0 30px !important;
}

:deep(.el-input) {
  .el-input__wrapper {
    border-radius: 8px !important;
    background-color: white;
    
    &:hover {
      box-shadow: 0 0 0 1px #c0c4cc !important;
    }
    
    &.is-focus {
      box-shadow: 0 0 0 1px #409eff !important;
    }
  }
}

.blue-button {
  background-color: #409eff;
  border-color: #409eff;
  color: white;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s, border-color 0.3s;
  border: none;
  
  &:hover {
    background-color: #66b1ff;
    border-color: #66b1ff;
  }
}

:deep(.el-button--primary) {
  background-color: #409eff;
  border-color: #409eff;
  
  &:hover {
    background-color: #66b1ff;
    border-color: #66b1ff;
  }
}
</style>