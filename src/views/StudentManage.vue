<template>
  <div class="page-content">
    <div class="gray-space"></div>
    <div class="header">
        <el-button type="primary" style="margin-left: 20px;"  @click="showDialog('add')">新增</el-button>
        <el-select
        v-model="selectedCourses"
        multiple
        placeholder="所有课程"
        style="width: 240px; margin-left: 20px;"
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
      style="width: 400px; margin-left: 30px;"
      placeholder="搜索学生的姓名或学号"
      :suffix-icon="Search" 
      @input="handleSearchChange"
    />
    </div>
    <div class="table"> 
      <el-table :data="tableData" style="width: 100%" :border="false" :cell-style="{ textAlign: 'center' }" v-loading="loading">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="班级" prop="className" width="150" align="center" />
      <el-table-column label="系统" prop="classSystem" width="150" align="center" />
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
      <el-table-column label="操作" width="130" align="center">
        <template #default="scope">
          <el-button type="primary" :icon="Edit" circle @click="handleEdit(scope.row)"/>
          <span class="operation-divider"></span>
          <el-button type="danger" :icon="Delete" circle @click="handleDelete(scope.row)"/>
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
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Edit, Delete } from '@element-plus/icons-vue';
import api from '@/api';  // 导入 api

const dialogType = ref('add');
const dialogVisible = ref(false);
const loading = ref(false);

// 课程选项
const courseOptions = ref([]);
const selectedCourses = ref([]);

// 获取课程列表
const fetchCourses = async () => {
  try {
    const response = await api.getTeacherCourses();
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
      const students = response.data.items.map(item => ({
        id: item.student_id,
        username: item.name || item.student_id,
        mobile: item.student_id,
        email: item.email,
        className: item.class_name,
        classSystem: item.class_system,
        avatar: item.image || '/teacher/image/song.png'
      }));
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
</script>

<style lang="scss" scoped>
.page-content {
  width: 100%;
  max-width: 1480px;
  height: 100vh;
  background-color: #f5f5f5;
  margin: 0 auto;
  padding: 0 20px;

.gray-space {
  height: 12px; // 空隙的高度
  background-color: #f5f5f5; // 灰色背景
}
.header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 20px;
  margin-left: 0;
  height: 50px;
  background-color: white;
  border-radius: 13px;
  width: 100%;
  padding: 0 20px;
}
::v-deep .el-input__suffix .el-input__icon {
  color: #007bff; /* 设置图标颜色为蓝色 */
}
.table{
  width: 100%;
  border-radius: 13px;
  margin-left: 0;
  margin-right: 0;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  
  ::v-deep(.el-table__header) th {
    background-color:#E6F2FF !important;
  }
}
.table th, .table td { border: 1px solid #ddd; /* 设置单元格边框，以便看到圆角效果 */ }
.table th:first-child,.table td:first-child{
  border-top-left-radius:20px;
}
.table th:last-child,.table td:last-child{
  border-top-left-radius:20px;
}
    .search-actions {
      text-align: right;
      margin-top: 20px;
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
</style>