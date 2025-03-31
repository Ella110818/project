<template>
  <div class="group-management">
    <div class="group-header">
      <div class="left-actions">
        <el-button type="primary" @click="handleAutoGroup">自动分组</el-button>
        <el-button @click="handleAddGroup">新建分组</el-button>
      </div>
      <div class="right-actions">
        <el-input
          v-model="searchText"
          placeholder="搜索学生"
          prefix-icon="Search"
          style="width: 200px"
        />
      </div>
    </div>

    <div class="groups-container">
      <el-row :gutter="20">
        <!-- 未分组学生列表 -->
        <el-col :span="6">
          <el-card class="group-card unassigned-group">
            <template #header>
              <div class="card-header">
                <span>未分组学生</span>
                <span class="student-count">{{ unassignedStudents.length }}人</span>
              </div>
            </template>
            <div class="student-list">
              <draggable
                v-model="unassignedStudents"
                group="students"
                item-key="id"
                ghost-class="ghost"
                @end="onDragEnd"
              >
                <template #item="{ element }">
                  <div class="student-item">
                    <el-avatar :size="32" :src="element.avatar">
                      {{ element.name.substring(0, 1) }}
                    </el-avatar>
                    <span class="student-name">{{ element.name }}</span>
                    <span class="student-id">{{ element.studentId }}</span>
                  </div>
                </template>
              </draggable>
            </div>
          </el-card>
        </el-col>

        <!-- 分组列表 -->
        <el-col :span="18">
          <div class="groups-grid">
            <el-row :gutter="20">
              <el-col :span="8" v-for="(group, index) in groups" :key="group.id">
                <el-card class="group-card">
                  <template #header>
                    <div class="card-header">
                      <el-input
                        v-model="group.name"
                        size="small"
                        placeholder="分组名称"
                        @blur="updateGroupName(group)"
                      />
                      <div class="group-actions">
                        <span class="student-count">{{ group.students.length }}人</span>
                        <el-dropdown>
                          <el-button link>
                            <el-icon><More /></el-icon>
                          </el-button>
                          <template #dropdown>
                            <el-dropdown-menu>
                              <el-dropdown-item @click="renameGroup(group)">重命名</el-dropdown-item>
                              <el-dropdown-item @click="deleteGroup(index)" class="text-danger">
                                删除分组
                              </el-dropdown-item>
                            </el-dropdown-menu>
                          </template>
                        </el-dropdown>
                      </div>
                    </div>
                  </template>
                  <div class="student-list">
                    <draggable
                      v-model="group.students"
                      group="students"
                      item-key="id"
                      ghost-class="ghost"
                      @end="onDragEnd"
                    >
                      <template #item="{ element }">
                        <div class="student-item">
                          <el-avatar :size="32" :src="element.avatar">
                            {{ element.name.substring(0, 1) }}
                          </el-avatar>
                          <span class="student-name">{{ element.name }}</span>
                          <span class="student-id">{{ element.studentId }}</span>
                        </div>
                      </template>
                    </draggable>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 自动分组对话框 -->
    <el-dialog
      v-model="autoGroupDialog"
      title="自动分组"
      width="400px"
    >
      <el-form :model="autoGroupForm" label-width="120px">
        <el-form-item label="分组数量">
          <el-input-number
            v-model="autoGroupForm.groupCount"
            :min="2"
            :max="10"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="分组方式">
          <el-radio-group v-model="autoGroupForm.method">
            <el-radio label="random">随机分组</el-radio>
            <el-radio label="average">平均分配</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="autoGroupDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmAutoGroup">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import draggable from 'vuedraggable'
import { Search, More } from '@element-plus/icons-vue'
import api from '@/api'

const searchText = ref('')
const autoGroupDialog = ref(false)
const autoGroupForm = ref({
  groupCount: 4,
  method: 'random'
})

// 从props接收courseId
const props = defineProps({
  courseId: {
    type: [String, Number],
    required: true
  }
})

// 状态数据
const unassignedStudents = ref([])
const groups = ref([])
const loading = ref(false)

// 获取分组数据
const fetchGroups = async () => {
  try {
    loading.value = true
    const response = await api.getCourseGroups(props.courseId)
    
    if (response.code === 200) {
      unassignedStudents.value = response.data.unassignedStudents
      groups.value = response.data.groups
    } else {
      throw new Error(response.message || '获取分组数据失败')
    }
  } catch (error) {
    console.error('获取分组数据失败:', error)
    ElMessage.error(error.message || '获取分组数据失败')
  } finally {
    loading.value = false
  }
}

// 处理拖拽结束
const onDragEnd = async () => {
  try {
    // 更新被修改的分组
    for (const group of groups.value) {
      await api.createOrUpdateGroup(props.courseId, {
        name: group.name,
        studentIds: group.students.map(student => student.id)
      })
    }
    ElMessage.success('分组更新成功')
  } catch (error) {
    console.error('更新分组失败:', error)
    ElMessage.error('更新分组失败，请重试')
    // 刷新数据
    await fetchGroups()
  }
}

// 添加新分组
const handleAddGroup = async () => {
  try {
    const newGroup = {
      name: `第${groups.value.length + 1}组`,
      studentIds: []
    }
    
    const response = await api.createOrUpdateGroup(props.courseId, newGroup)
    
    if (response.code === 200) {
      groups.value.push(response.data)
      ElMessage.success('新建分组成功')
    } else {
      throw new Error(response.message || '新建分组失败')
    }
  } catch (error) {
    console.error('新建分组失败:', error)
    ElMessage.error(error.message || '新建分组失败')
  }
}

// 删除分组
const deleteGroup = async (index) => {
  try {
    const group = groups.value[index]
    // 将组内学生移回未分组列表
    unassignedStudents.value.push(...group.students)
    
    // 更新未分组学生状态
    await api.createOrUpdateGroup(props.courseId, {
      name: '未分组',
      studentIds: unassignedStudents.value.map(student => student.id)
    })
    
    groups.value.splice(index, 1)
    ElMessage.success('分组已删除')
  } catch (error) {
    console.error('删除分组失败:', error)
    ElMessage.error('删除分组失败，请重试')
    // 刷新数据
    await fetchGroups()
  }
}

// 重命名分组
const renameGroup = (group) => {
  // 实现重命名逻辑
}

// 更新分组名称
const updateGroupName = async (group) => {
  try {
    const response = await api.createOrUpdateGroup(props.courseId, {
      name: group.name,
      studentIds: group.students.map(student => student.id)
    })
    
    if (response.code === 200) {
      ElMessage.success('更新分组名称成功')
    } else {
      throw new Error(response.message || '更新分组名称失败')
    }
  } catch (error) {
    console.error('更新分组名称失败:', error)
    ElMessage.error(error.message || '更新分组名称失败')
    // 刷新数据
    await fetchGroups()
  }
}

// 打开自动分组对话框
const handleAutoGroup = () => {
  autoGroupDialog.value = true
}

// 确认自动分组
const confirmAutoGroup = async () => {
  try {
    const response = await api.autoCreateGroups(props.courseId, {
      groupCount: autoGroupForm.value.groupCount,
      method: autoGroupForm.value.method
    })
    
    if (response.code === 200) {
      groups.value = response.data.groups
      unassignedStudents.value = []
      autoGroupDialog.value = false
      ElMessage.success('自动分组完成')
    } else {
      throw new Error(response.message || '自动分组失败')
    }
  } catch (error) {
    console.error('自动分组失败:', error)
    ElMessage.error(error.message || '自动分组失败')
  }
}

// 组件挂载时获取分组数据
onMounted(() => {
  if (props.courseId) {
    fetchGroups()
  }
})
</script>

<style scoped>
.group-management {
  padding: 20px;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.groups-container {
  margin-top: 20px;
}

.group-card {
  margin-bottom: 20px;
  height: 400px;
  display: flex;
  flex-direction: column;
}

.group-card :deep(.el-card__body) {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.student-count {
  font-size: 12px;
  color: #909399;
  margin-left: 8px;
}

.student-list {
  min-height: 100px;
}

.student-item {
  display: flex;
  align-items: center;
  padding: 8px;
  margin-bottom: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
  cursor: move;
}

.student-item:hover {
  background-color: #ecf5ff;
}

.student-name {
  margin-left: 8px;
  flex: 1;
}

.student-id {
  color: #909399;
  font-size: 12px;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.group-actions {
  display: flex;
  align-items: center;
}

.groups-grid {
  height: calc(100vh - 200px);
  overflow-y: auto;
}

.text-danger {
  color: #f56c6c;
}

.unassigned-group {
  height: calc(100vh - 200px);
}

.left-actions {
  display: flex;
  gap: 10px;
}
</style>
