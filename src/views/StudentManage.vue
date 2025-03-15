<!-- <template>
  <div class="stu-management">
    <div class="main">
      <div class="header">
        <el-button type="primary" style="margin-left: 20px;" @click="handleAdd">新增</el-button>
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
      <div class="foot"> 
         <el-table
          ref="multipleTableRef"
          :data="tableData"
          row-key="id"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" :selectable="selectable" width="55" />
          <el-table-column label="姓名" width="120">
            <template #default="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column property="学号" label="Name" width="120" />
          <el-table-column property="address" label="Address" />
        </el-table>
        <div style="margin-top: 20px">
          <el-button @click="toggleSelection([tableData[1], tableData[2]])">
            Toggle selection status of second and third rows
          </el-button>
          <el-button @click="toggleSelection([tableData[1], tableData[2]], false)">
            Toggle selection status based on selectable
          </el-button>
          <el-button @click="toggleSelection()">Clear selection</el-button>
        </div>
      </div>
    </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Search } from '@element-plus/icons-vue'
const value1 = ref([])
const value2 = ref([])
const value3 = ref([])
const value4 = ref([])
const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
];
const users = ref([
  { username: '中小鱼', phone: '18670001991', gender: '女', department: '研发部', status: '创建', createdAt: '2020-09-09 10:01:10' },
  { username: '何小刚', phone: '17766664444', gender: '男', department: '电商部', status: '创建', createdAt: '2020-10-10 13:01:12' },
  { username: '拜赞龙', phone: '18670001987', gender: '女', department: '人事部', status: '创建', createdAt: '2020-11-14 20:14:45' },
  { username: '麦果旗', phone: '18670001986', gender: '女', department: '产品部', status: '创建', createdAt: '2020-11-14 09:01:20' },
  { username: '甜橙', phone: '18670001985', gender: '男', department: '财务部', status: '创建', createdAt: '2020-11-13 11:01:05' },
  { username: '冷月果桑', phone: '18670001984', gender: '男', department: '运营部', status: '创建', createdAt: '2020-10-11 13:10:26' },
  { username: '唐不密', phone: '18123520191', gender: '男', department: '客服部', status: '添加', createdAt: '2020-05-14 12:05:10' },
]);

const searchQuery = ref('');
const multipleTableRef = ref(null);
const multipleSelection = ref([]);

const selectable = (row) => ![1, 2].includes(row.id);

const toggleSelection = (rows, ignoreSelectable) => {
  if (rows) {
    rows.forEach((row) => {
      multipleTableRef.value.toggleRowSelection(row, undefined, ignoreSelectable);
    });
  } else {
    multipleTableRef.value.clearSelection();
  }
};

const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};

const tableData = [
  {
    id: 1,
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 2,
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 3,
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 4,
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 5,
    date: '2016-05-08',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 6,
    date: '2016-05-06',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 7,
    date: '2016-05-07',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
];

const filteredUsers = computed(() => {
  return users.value.filter(
    (user) =>
      user.username.includes(searchQuery.value) ||
      user.phone.includes(searchQuery.value)
  );
});

const handleAdd = () => {
  // 处理新增逻辑
  console.log('新增用户');
};

const handleEdit = (user) => {
  // 处理编辑逻辑
  console.log('编辑用户:', user);
};

const handleDelete = (user) => {
  // 处理删除逻辑
  console.log('删除用户:', user);
};
</script>

<style scoped>
.stu-management {
  width: 100%;
   width:1480px;
  height: 100vh;
  background-color:#f5f5f5 ;
}
.main{
  margin-top:30px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  margin-left:10px;
  background-color: white;
}
.foot{
  margin-top:20px;
}
h1 {
  margin-right: 20px;
}
</style> -->

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
      <el-table :data="tableData" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column label="班级" width="300">
        <template #default="scope">
          <div class="user" style="display: flex; align-items: center">
            <img class="avatar" :src="scope.row.avatar" />
            <div>
              <p class="user-name">{{ scope.row.username }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="学号" prop="mobile" />
      <el-table-column label="性别" prop="sex">
        <template #default="scope">
          {{ scope.row.sex === 1 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status">
        <template #default="scope">
          <el-tag :type="getTagType(scope.row.status)">
            {{ buildTagText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="详情" width="180">
        <template #default="{ row }">
          <router-link :to="{ name: 'details', params: { id: row.id } }">
            <el-button type="primary">查看详情</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <!-- <el-button type="text" @click="showDialog('edit', scope.row)">编辑</el-button> -->
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
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="formData.sex">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="dep">
          <el-select v-model="formData.dep">
            <el-option label="董事会部" :value="1" />
            <el-option label="市场部" :value="2" />
            <el-option label="技术部" :value="3" />
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
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import { Edit } from '@element-plus/icons-vue';
import {  Delete } from '@element-plus/icons-vue';
const dialogType = ref('add');
const dialogVisible = ref(false);

const formData = reactive({
  username: '',
  phone: '',
  sex: '男',
  dep: '',
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
    avatar: 'https://via.placeholder.com/40',
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
    avatar: 'https://via.placeholder.com/40',
  },
]);

const resetForm = () => {
  searchFormRef.value.resetFields();
};

const showDialog = (type, row) => {
  dialogVisible.value = true;
  dialogType.value = type;

  if (type === 'edit' && row) {
    formData.username = row.username;
    formData.phone = row.mobile;
    formData.sex = row.sex === 1 ? '男' : '女';
    formData.dep = row.dep;
  } else {
    formData.username = '';
    formData.phone = '';
    formData.sex = '男';
    formData.dep = '';
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
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' },
  ],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  dep: [{ required: true, message: '请选择部门', trigger: 'change' }],
});

const formRef = ref(null);

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
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
  width:100%;
   border-radius: 13px;
  margin-left:10px;
  overflow:hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05); /* 添加阴影效果 */
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
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 6px;
    }

    > div {
      margin-left: 10px;

      .user-name {
        font-weight: 500;
        color: #333;
      }

      .email {
        color: #666;
      }
    }
  }

</style>