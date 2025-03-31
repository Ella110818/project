<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api'

const classOptions = ref([])  // 班级选项
const selectedClass = ref('')  // 选中的班级
const students = ref([])      // 学生列表
const loading = ref(false)    // 加载状态

// 获取教师班级列表
const fetchTeacherClasses = async () => {
  try {
    loading.value = true
    const response = await api.getTeacherCourses()
    classOptions.value = response.map(course => ({
      value: course.id,
      label: course.name
    }))
  } catch (error) {
    ElMessage.error('获取班级列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 获取班级学生列表
const fetchStudents = async (courseId) => {
  if (!courseId) return
  try {
    loading.value = true
    const response = await api.getCourseStudents(courseId)
    students.value = response.map(student => ({
      id: student.id,
      name: student.name,
      studentId: student.student_id,
      email: student.email
    }))
  } catch (error) {
    ElMessage.error('获取学生列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 监听班级选择变化
const handleClassChange = (value) => {
  selectedClass.value = value
  fetchStudents(value)
}

// 组件挂载时获取班级列表
onMounted(() => {
  fetchTeacherClasses()
})
</script>

<template>
  <div class="student-manage">
    <el-form :inline="true" class="search-form">
      <el-form-item label="选择班级">
        <el-select 
          v-model="selectedClass"
          placeholder="请选择班级"
          @change="handleClassChange"
          :loading="loading"
        >
          <el-option
            v-for="item in classOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <el-table
      :data="students"
      v-loading="loading"
      style="width: 100%"
    >
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="studentId" label="学号" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.student-manage {
  padding: 20px;
}
.search-form {
  margin-bottom: 20px;
}
</style> 