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
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import draggable from 'vuedraggable'
import { Search, More } from '@element-plus/icons-vue'

const searchText = ref('')
const autoGroupDialog = ref(false)
const autoGroupForm = ref({
  groupCount: 4,
  method: 'random'
})

// 模拟数据
const unassignedStudents = ref([
  { id: 1, name: '张三', studentId: '2021001', avatar: '' },
  { id: 2, name: '李四', studentId: '2021002', avatar: '' },
  { id: 3, name: '王五', studentId: '2021003', avatar: '' },
  { id: 4, name: '赵六', studentId: '2021004', avatar: '' },
  { id: 5, name: '钱七', studentId: '2021005', avatar: '' },
  { id: 6, name: '孙八', studentId: '2021006', avatar: '' }
])

const groups = ref([
  {
    id: 1,
    name: '第一组',
    students: []
  },
  {
    id: 2,
    name: '第二组',
    students: []
  }
])

// 处理拖拽结束
const onDragEnd = () => {
  // 可以在这里保存分组状态
  console.log('Groups updated:', groups.value)
}

// 添加新分组
const handleAddGroup = () => {
  const newGroup = {
    id: Date.now(),
    name: `第${groups.value.length + 1}组`,
    students: []
  }
  groups.value.push(newGroup)
}

// 删除分组
const deleteGroup = (index) => {
  const group = groups.value[index]
  // 将组内学生移回未分组列表
  unassignedStudents.value.push(...group.students)
  groups.value.splice(index, 1)
  ElMessage.success('分组已删除')
}

// 重命名分组
const renameGroup = (group) => {
  // 实现重命名逻辑
}

// 更新分组名称
const updateGroupName = (group) => {
  // 实现更新分组名称的逻辑
  console.log('Group name updated:', group.name)
}

// 打开自动分组对话框
const handleAutoGroup = () => {
  autoGroupDialog.value = true
}

// 确认自动分组
const confirmAutoGroup = () => {
  const { groupCount, method } = autoGroupForm.value
  const allStudents = [...unassignedStudents.value]
  
  // 清空现有分组
  groups.value = []
  
  if (method === 'random') {
    // 随机打乱学生顺序
    for (let i = allStudents.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allStudents[i], allStudents[j]] = [allStudents[j], allStudents[i]]
    }
  }
  
  // 创建新分组
  for (let i = 0; i < groupCount; i++) {
    groups.value.push({
      id: Date.now() + i,
      name: `第${i + 1}组`,
      students: []
    })
  }
  
  // 分配学生
  allStudents.forEach((student, index) => {
    const groupIndex = index % groupCount
    groups.value[groupIndex].students.push(student)
  })
  
  // 清空未分组学生列表
  unassignedStudents.value = []
  
  autoGroupDialog.value = false
  ElMessage.success('自动分组完成')
}
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
