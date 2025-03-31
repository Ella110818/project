<template>
  <div class="page-content">
    <div class="gray-space"></div>
    <div class="header">
        <el-button type="primary" style="margin-left: 20px;"  @click="showDialog('add')">新增</el-button>
        <el-select
        v-model="selectedClasses"
        multiple
        placeholder="所有班级"
        style="width: 240px; margin-left: 20px;"
        @change="handleClassChange"
        font-color="black"
        >
        <el-option
          v-for="item in classOptions"
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
      <el-table-column label="学生" width="150" align="center">
        <template #default="scope">
          <div class="user">
            <img class="avatar" :src="scope.row.avatar || '/teacher/image/song.png'" />
            <div class="user-info">
              <p class="user-name">{{ scope.row.username }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="学号" prop="mobile" width="150" align="center" />
      <el-table-column label="性别" prop="sex" width="100" align="center">
        <template #default="scope">
          {{ scope.row.sex === 1 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column label="详情" width="130" align="center">
        <template #default="{ row }">
          <router-link :to="{ name: 'details', params: { id: row.id } }">
            <el-button type="primary">查看详情</el-button>
          </router-link>
        </template>
      </el-table-column>
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
import api from '@/api';

const dialogType = ref('add');
const dialogVisible = ref(false);
const loading = ref(false);

const formData = reactive({
  username: '',
  studentId: '',
  sex: 1,
  className: '',
  id: null,
});

const searchText = ref('');
const classOptions = ref([]);
const selectedClasses = ref([]);
const tableData = ref([]);

// 获取教师课程（班级）列表
const fetchTeacherClasses = async () => {
  try {
    loading.value = true;
    const response = await api.getCourses();
    if (response.code === 200) {
      classOptions.value = response.data.items.map(course => ({
        value: course.course_id,
        label: `${course.title} (${course.system})`
      }));
    } else {
      ElMessage.error('获取班级列表失败');
    }
  } catch (error) {
    console.error('获取班级列表失败:', error);
    ElMessage.error('获取班级列表失败');
  } finally {
    loading.value = false;
  }
};

// 获取课程学生列表
const fetchCourseStudents = async (courseId) => {
  try {
    loading.value = true;
    const response = await api.getCourseDetail(courseId);
    if (response.code === 200 && response.data.students) {
      // 将学生信息转换为表格所需格式
      const students = response.data.students.map(student => ({
        id: student.id,
        username: student.name,
        mobile: student.student_id,
        sex: student.sex || 1,
        className: response.data.title,
        email: student.email
      }));
      return students;
    }
    return [];
  } catch (error) {
    console.error('获取学生列表失败:', error);
    return [];
  }
};

// 更新学生列表
const updateStudentList = async () => {
  try {
    loading.value = true;
    let allStudents = [];
    
    // 如果没有选择班级，获取所有班级的学生
    const coursesToFetch = selectedClasses.value.length > 0 
      ? selectedClasses.value 
      : classOptions.value.map(option => option.value);
    
    // 获取所有选中课程的学生
    for (const courseId of coursesToFetch) {
      const students = await fetchCourseStudents(courseId);
      allStudents = [...allStudents, ...students];
    }
    
    // 如果有搜索文本，进行过滤
    if (searchText.value) {
      const searchLower = searchText.value.toLowerCase();
      allStudents = allStudents.filter(student => 
        student.username.toLowerCase().includes(searchLower) ||
        student.mobile.toLowerCase().includes(searchLower)
      );
    }
    
    tableData.value = allStudents;
  } catch (error) {
    console.error('更新学生列表失败:', error);
    ElMessage.error('更新学生列表失败');
  } finally {
    loading.value = false;
  }
};

// 监听班级选择变化
const handleClassChange = () => {
  updateStudentList();
};

// 监听搜索文本变化
const handleSearchChange = () => {
  updateStudentList();
};

// 删除学生
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该学生吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里需要调用后端API删除学生
    ElMessage.success('删除成功');
    updateStudentList();
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
};

// 编辑学生
const handleEdit = (row) => {
  // 这里需要实现编辑学生的逻辑
  console.log('编辑学生:', row);
};

// 组件挂载时获取班级列表
onMounted(() => {
  fetchTeacherClasses();
});

const resetForm = () => {
  searchText.value = '';
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
          avatar: '/teacher/image/song.png'
        };
        tableData.value.push(newUser);
        ElMessage.success('添加成功');
      } else {
        const index = tableData.value.findIndex(item => item.mobile === formData.studentId);
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
    background-color: #E6F2FF !important;
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