<!-- <style scoped>
.container {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  height: 100vh; /* 父容器占据整个视口高度 */
  padding: 0;
  margin: 0;
}
.word {
  display: flex;
  position: relative;
  flex-direction: column; /* 子元素按列排布 */
  gap: 8px; /* 添加间距 */
  justify-content: flex-start; 
  align-items: flex-start; 
  margin-left:30px;
}
.card {
  flex: 1; /* 让 el-tabs 占据剩余空间 */
  overflow: auto; 
  margin-top: 20px;
  width: 100%;
   width:1480px;
  height: 100vh;
}
.page-content {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  gap: 20px; /* 在每条公告之间添加 20px 的空隙 */
}

.announcement-item {
  margin-bottom: 20px; /* 在每条公告之间添加 20px 的空隙 */
}

/* 或者使用 :not(:last-child) */
.announcement-item:not(:last-child) {
  margin-bottom: 20px; /* 在每条公告之间添加 20px 的空隙，最后一条公告不加 */
}
.announce-form {
  background-color: #f5f5f5;
}
.announce-form .el-card {
  min-height: 800px; /* 设置一个最小高度，根据需要调整这个值 */
}
.input-with-select{
    width:350px;
}
.card-header{
    display: flex;
}
.common-layout{
    background-color: #f5f5f5;
  width: 100%;
  height: 100dvh;
}
</style> -->
<!-- <template>
  <div class="container">
    <h1>课程 ID: {{ courseId }}</h1>
    <div class="word">
      
    </div>
    
    <el-tabs
      v-model="activeName"
      type="card"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane label="发布公告" name="first">
        <AnnouncementForm />
      </el-tab-pane>
      <el-tab-pane label="作业/考试" name="second">
        
      </el-tab-pane>
      <el-tab-pane label="成绩单" name="third">
       
      </el-tab-pane>
      <el-tab-pane label="分组" name="fourth">
        
      </el-tab-pane>
      <el-tab-pane label="课程资源" name="fifth">
        
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ref } from 'vue';
import AnnouncementForm from '@/components/AnnouncementForm.vue';

export default {
  name: 'ClassInfo',
  components: {
    AnnouncementForm
    // ...其他组件
  },
  setup() {
    const activeName = ref('first');

    const handleClick = (tab, event) => {
      console.log(tab, event);
    };

    // ...其他响应式数据和方法

    return {
      activeName,
      handleClick,
      // ...其他需要返回的数据和方法
    };
  },
  computed: {
    courseId() {
      return this.$route.params.id; // 获取动态路由参数
    },
  },
  mounted() {
    console.log('Course ID:', this.courseId); // 打印课程 ID
  }
};
</script>

<style scoped>
/* ...其他样式 */
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
/* ...其他样式 */
</style> -->
<template>
  <div class="record-container">
    <el-card class="record-card">
      <template #header>
        <div class="card-header">
          <h2>记录管理</h2>
          <el-button type="primary" @click="handleAdd">新增记录</el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="学工号">
            <el-input v-model="searchForm.userId" placeholder="请输入学工号" clearable></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
              <el-option label="考勤记录" value="attendance"></el-option>
              <el-option label="成绩记录" value="grade"></el-option>
              <el-option label="请假记录" value="leave"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="searchForm.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 记录表格 -->
      <el-table :data="recordList" style="width: 100%" border>
        <el-table-column prop="userId" label="学工号" width="120"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120"></el-table-column>
        <el-table-column prop="type" label="类型" width="120">
          <template #default="scope">
            <el-tag :type="getTypeTag(scope.row.type)">{{ getTypeLabel(scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" min-width="200"></el-table-column>
        <el-table-column prop="date" label="日期" width="180"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增记录' : '编辑记录'"
      width="500px"
    >
      <el-form :model="recordForm" :rules="rules" ref="recordFormRef" label-width="100px">
        <el-form-item label="学工号" prop="userId">
          <el-input v-model="recordForm.userId" placeholder="请输入学工号"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="recordForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="recordForm.type" placeholder="请选择类型">
            <el-option label="考勤记录" value="attendance"></el-option>
            <el-option label="成绩记录" value="grade"></el-option>
            <el-option label="请假记录" value="leave"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="recordForm.content" rows="3" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="recordForm.date"
            type="datetime"
            placeholder="选择日期时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="recordForm.status" placeholder="请选择状态">
            <el-option label="待处理" value="待处理"></el-option>
            <el-option label="已处理" value="已处理"></el-option>
            <el-option label="已驳回" value="已驳回"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  setup() {
    const recordFormRef = ref(null)
    const dialogVisible = ref(false)
    const dialogType = ref('add')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)

    // 搜索表单
    const searchForm = reactive({
      userId: '',
      type: '',
      date: []
    })

    // 记录表单
    const recordForm = reactive({
      userId: '',
      name: '',
      type: '',
      content: '',
      date: '',
      status: '待处理'
    })

    // 表单验证规则
    const rules = {
      userId: [
        { required: true, message: '请输入学工号', trigger: 'blur' },
        { min: 5, message: '学工号长度不能小于5位', trigger: 'blur' }
      ],
      name: [
        { required: true, message: '请输入姓名', trigger: 'blur' }
      ],
      type: [
        { required: true, message: '请选择类型', trigger: 'change' }
      ],
      content: [
        { required: true, message: '请输入内容', trigger: 'blur' }
      ],
      date: [
        { required: true, message: '请选择日期', trigger: 'change' }
      ],
      status: [
        { required: true, message: '请选择状态', trigger: 'change' }
      ]
    }

    // 模拟数据
    const recordList = ref([
      {
        id: 1,
        userId: '2021001',
        name: '张三',
        type: 'attendance',
        content: '迟到30分钟',
        date: '2024-03-20 09:30:00',
        status: '待处理'
      },
      {
        id: 2,
        userId: '2021002',
        name: '李四',
        type: 'grade',
        content: '期中考试成绩录入',
        date: '2024-03-19 14:20:00',
        status: '已处理'
      }
    ])

    // 获取类型标签样式
    const getTypeTag = (type) => {
      const typeMap = {
        attendance: 'warning',
        grade: 'success',
        leave: 'info'
      }
      return typeMap[type] || 'info'
    }

    // 获取类型显示文本
    const getTypeLabel = (type) => {
      const typeMap = {
        attendance: '考勤记录',
        grade: '成绩记录',
        leave: '请假记录'
      }
      return typeMap[type] || type
    }

    // 获取状态标签样式
    const getStatusType = (status) => {
      const statusMap = {
        '待处理': 'warning',
        '已处理': 'success',
        '已驳回': 'danger'
      }
      return statusMap[status] || 'info'
    }

    // 处理搜索
    const handleSearch = () => {
      // 实现搜索逻辑
      console.log('搜索条件：', searchForm)
    }

    // 重置搜索
    const resetSearch = () => {
      searchForm.userId = ''
      searchForm.type = ''
      searchForm.date = []
    }

    // 处理新增
    const handleAdd = () => {
      dialogType.value = 'add'
      dialogVisible.value = true
      Object.assign(recordForm, {
        userId: '',
        name: '',
        type: '',
        content: '',
        date: '',
        status: '待处理'
      })
    }

    // 处理编辑
    const handleEdit = (row) => {
      dialogType.value = 'edit'
      dialogVisible.value = true
      Object.assign(recordForm, row)
    }

    // 处理删除
    const handleDelete = (row) => {
      ElMessageBox.confirm('确认删除该记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 实现删除逻辑
        ElMessage.success('删除成功')
      }).catch(() => {})
    }

    // 处理提交
    const handleSubmit = async () => {
      if (!recordFormRef.value) return
      
      await recordFormRef.value.validate((valid) => {
        if (valid) {
          // 实现提交逻辑
          ElMessage.success(dialogType.value === 'add' ? '添加成功' : '修改成功')
          dialogVisible.value = false
        }
      })
    }

    // 处理分页大小变化
    const handleSizeChange = (val) => {
      pageSize.value = val
      // 重新加载数据
    }

    // 处理页码变化
    const handleCurrentChange = (val) => {
      currentPage.value = val
      // 重新加载数据
    }

    onMounted(() => {
      // 初始化加载数据
      total.value = recordList.value.length
    })

    return {
      searchForm,
      recordList,
      recordForm,
      recordFormRef,
      rules,
      dialogVisible,
      dialogType,
      currentPage,
      pageSize,
      total,
      handleSearch,
      resetSearch,
      handleAdd,
      handleEdit,
      handleDelete,
      handleSubmit,
      handleSizeChange,
      handleCurrentChange,
      getTypeTag,
      getTypeLabel,
      getStatusType
    }
  }
}
</script>

<style lang="scss" scoped>
.record-container {
  padding: 20px;
  background-color: #f5f2ee;
  min-height: 100vh;
}

.record-card {
  margin: 0 auto;
  max-width: 1200px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-form-item) {
  margin-bottom: 18px;
}

:deep(.el-table) {
  margin-top: 20px;
}
</style>