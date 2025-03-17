<template>
  <div class="page-content">
    <div class="gray-space"></div>
    <div class="header">
        <el-button type="primary" style="margin-left: 20px;"  @click="showDialog('add')">新增</el-button>
        <el-select
        v-model="value1"
        multiple
        placeholder="所有班级"
        style="width: 240px; margin-left: 20px;"
        font-color="black"
        >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
       <el-input
      v-model="input2"
      style="width: 400px; margin-left: 30px;"
      placeholder="搜索学生的姓名或学号"
      :suffix-icon="Search" 
    />
    </div>
    <div class="table"> 
      <el-table :data="tableData" style="width: 100%" :border="false" :cell-style="{ textAlign: 'center' }">
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
      <el-table-column label="性别" prop="sex" width="100" align="center">
        <template #default="scope">
          {{ scope.row.sex === 1 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" width="100" align="center">
        <template #default="scope">
          <el-tag :type="getTagType(scope.row.status)">
            {{ buildTagText(scope.row.status) }}
          </el-tag>
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
          <el-button type="primary" :icon="Edit" circle @click="showDialog('edit', scope.row)"/>
          <el-button type="danger" :icon="Delete" circle @click="deleteUser('delete', scope.row)"/>
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
              v-for="item in options"
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
import { Search } from '@element-plus/icons-vue';
import { Edit } from '@element-plus/icons-vue';
import {  Delete } from '@element-plus/icons-vue';
const dialogType = ref('add');
const dialogVisible = ref(false);

const formData = reactive({
  username: '',
  studentId: '',
  sex: 1,
  className: '',
});

const searchFormRef = ref(null);
const searchForm = reactive({
  name: '',
  phone: '',
  email: '',
  account: '',
  id: '',
  sex: '',
  level: '',
});

const tableData = ref([
  {
    id: 1,
    username: '用户1',
    email: 'user1@example.com',
    mobile: '12345678901',
    sex: 1,
    dep: '技术部',
    status: '1',
    create_time: '2023-01-01',
    avatar: '',
    className: '计算机科学1班'
  },
  {
    id: 2,
    username: '用户2',
    email: 'user2@example.com',
    mobile: '12345678902',
    sex: 2,
    dep: '市场部',
    status: '2',
    create_time: '2023-01-02',
    avatar: '',
    className: '计算机科学2班'
  },
]);

// 班级选项
const options = ref([
  {
    value: '计算机科学1班',
    label: '计算机科学1班',
  },
  {
    value: '计算机科学2班',
    label: '计算机科学2班',
  },
  {
    value: '软件工程1班',
    label: '软件工程1班',
  },
  {
    value: '人工智能1班',
    label: '人工智能1班',
  },
]);

const value1 = ref([]);
const input2 = ref('');

// 从localStorage获取学生头像
const loadStudentAvatars = () => {
  // 实际应用中，这里应该从API获取学生数据及其头像
  // 这里我们使用localStorage模拟
  const defaultAvatar = localStorage.getItem('userAvatar') || '';
  
  tableData.value.forEach(student => {
    // 如果学生有特定的头像数据，可以在这里获取
    // 这里简单地使用Profile.vue中的头像作为演示
    student.avatar = defaultAvatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
  });
};

onMounted(() => {
  loadStudentAvatars();
});

const resetForm = () => {
  searchFormRef.value.resetFields();
};

const showDialog = (type, row) => {
  dialogVisible.value = true;
  dialogType.value = type;

  if (type === 'edit' && row) {
    formData.username = row.username;
    formData.studentId = row.mobile;
    formData.sex = row.sex;
    formData.className = row.className;
  } else {
    formData.username = '';
    formData.studentId = '';
    formData.sex = 1;
    formData.className = '';
  }
};

const deleteUser = (row) => {
  ElMessageBox.confirm('确定要删除该用户吗？', '删除用户', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'error',
  }).then(() => {
    ElMessage.success('删除成功');
  });
};

const search = () => {
  ElMessage.success('搜索成功');
};

const filterTag = (value, row) => {
  return row.status === value;
};

const getTagType = (status) => {
  switch (status) {
    case '1':
      return 'success';
    case '2':
      return 'info';
    case '3':
      return 'warning';
    case '4':
      return 'danger';
    default:
      return 'info';
  }
};

const buildTagText = (status) => {
  switch (status) {
    case '1':
      return '在线';
    case '2':
      return '离线';
    case '3':
      return '异常';
    case '4':
      return '注销';
    default:
      return '';
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
      // 如果是添加操作，将新用户添加到表格数据中
      if (dialogType.value === 'add') {
        const newUser = {
          id: tableData.value.length + 1,
          username: formData.username,
          mobile: formData.studentId,
          sex: formData.sex,
          status: '1', // 默认设置为在线状态
          className: formData.className,
          avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
        };
        tableData.value.push(newUser);
      } else {
        // 如果是编辑操作，更新表格中对应的用户数据
        const index = tableData.value.findIndex(item => item.id === formData.id);
        if (index !== -1) {
          tableData.value[index].username = formData.username;
          tableData.value[index].mobile = formData.studentId;
          tableData.value[index].sex = formData.sex;
          tableData.value[index].className = formData.className;
          // 保持原有状态不变
        }
      }
      
      ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功');
      dialogVisible.value = false;
    }
  });
};
</script>

<style lang="scss" scoped>
.page-content {
  width: 100%;
   width:1480px;
  height: 100vh;
  background-color:#f5f5f5 ;

.gray-space {
  height: 12px; // 空隙的高度
  background-color: #f5f5f5; // 灰色背景
}
.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  margin-left:10px;
  height:50px;
  background-color: white;
      border-radius: 13px;
}
::v-deep .el-input__suffix .el-input__icon {
  color: #007bff; /* 设置图标颜色为蓝色 */
}
.table{
  width: 100%;
  border-radius: 13px;
  margin-left: 10px;
  margin-right: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
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
}

::v-deep(.el-table__body-wrapper) {
  width: 100% !important;
}

::v-deep(.el-table__header) {
  width: 100% !important;
  table-layout: fixed;
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
</style>