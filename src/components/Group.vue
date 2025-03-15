<template>
  <div class="group-container">
    <div class="group-header">
      <el-button type="primary" @click="createGroup">创建新分组</el-button>
    </div>

    <el-row :gutter="20" class="group-list">
      <!-- 未分组学生列表 -->
      <el-col :span="6">
        <el-card class="group-card">
          <template #header>
            <div class="card-header">
              <span>未分组学生</span>
              <span class="student-count">({{ ungroupedStudents.length }}人)</span>
            </div>
          </template>
          <draggable
            v-model="ungroupedStudents"
            group="students"
            item-key="id"
            ghost-class="ghost"
            @end="onDragEnd"
          >
            <template #item="{ element }">
              <div class="student-item">
                <el-avatar :size="32" :src="element.avatar">
                  {{ element.name.charAt(0) }}
                </el-avatar>
                <span class="student-name">{{ element.name }}</span>
                <span class="student-id">{{ element.studentId }}</span>
              </div>
            </template>
          </draggable>
        </el-card>
      </el-col>

      <!-- 分组列表 -->
      <el-col :span="18">
        <el-row :gutter="20">
          <el-col :span="8" v-for="group in groups" :key="group.id">
            <el-card class="group-card">
              <template #header>
                <div class="card-header">
                  <div>
                    <span>{{ group.name }}</span>
                    <span class="student-count">({{ group.students.length }}人)</span>
                  </div>
                  <div class="group-actions">
                    <el-button
                      type="text"
                      size="small"
                      @click="editGroupName(group)"
                    >
                      重命名
                    </el-button>
                    <el-button
                      type="text"
                      size="small"
                      class="text-danger"
                      @click="deleteGroup(group)"
                    >
                      删除
                    </el-button>
                  </div>
                </div>
              </template>
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
                      {{ element.name.charAt(0) }}
                    </el-avatar>
                    <span class="student-name">{{ element.name }}</span>
                    <span class="student-id">{{ element.studentId }}</span>
                  </div>
                </template>
              </draggable>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import axios from 'axios';
import draggable from 'vuedraggable';

const route = useRoute();
const courseId = route.params.id;

const groups = ref([]);
const ungroupedStudents = ref([]);

// 获取分组和学生数据
const fetchGroupData = async () => {
  try {
    const [groupsResponse, studentsResponse] = await Promise.all([
      axios.get(`/api/courses/${courseId}/groups`),
      axios.get(`/api/courses/${courseId}/ungrouped-students`)
    ]);
    
    groups.value = groupsResponse.data;
    ungroupedStudents.value = studentsResponse.data;
  } catch (error) {
    console.error('获取分组数据失败:', error);
    ElMessage.error('获取分组数据失败，请稍后重试');
  }
};

// 创建新分组
const createGroup = async () => {
  try {
    const { value: groupName } = await ElMessageBox.prompt(
      '请输入分组名称',
      '创建新分组',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: (value) => {
          if (!value) {
            return '分组名称不能为空';
          }
          return true;
        }
      }
    );

    const response = await axios.post(`/api/courses/${courseId}/groups`, {
      name: groupName
    });
    
    groups.value.push(response.data);
    ElMessage.success('创建成功');
  } catch (error) {
    if (error !== 'cancel') {
      console.error('创建分组失败:', error);
      ElMessage.error('创建分组失败，请稍后重试');
    }
  }
};

// 编辑分组名称
const editGroupName = async (group) => {
  try {
    const { value: newName } = await ElMessageBox.prompt(
      '请输入新的分组名称',
      '重命名分组',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: group.name,
        inputValidator: (value) => {
          if (!value) {
            return '分组名称不能为空';
          }
          return true;
        }
      }
    );

    await axios.put(`/api/courses/${courseId}/groups/${group.id}`, {
      name: newName
    });
    
    group.name = newName;
    ElMessage.success('重命名成功');
  } catch (error) {
    if (error !== 'cancel') {
      console.error('重命名失败:', error);
      ElMessage.error('重命名失败，请稍后重试');
    }
  }
};

// 删除分组
const deleteGroup = async (group) => {
  try {
    await ElMessageBox.confirm(
      '删除分组后，该分组的学生将被移至未分组列表，是否继续？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    await axios.delete(`/api/courses/${courseId}/groups/${group.id}`);
    
    const index = groups.value.findIndex(g => g.id === group.id);
    if (index !== -1) {
      ungroupedStudents.value.push(...groups.value[index].students);
      groups.value.splice(index, 1);
    }
    
    ElMessage.success('删除成功');
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除分组失败:', error);
      ElMessage.error('删除分组失败，请稍后重试');
    }
  }
};

// 拖拽结束后更新分组
const onDragEnd = async () => {
  try {
    await axios.put(`/api/courses/${courseId}/groups/update`, {
      groups: groups.value,
      ungroupedStudents: ungroupedStudents.value
    });
  } catch (error) {
    console.error('更新分组失败:', error);
    ElMessage.error('更新分组失败，请稍后重试');
    // 如果更新失败，重新获取数据
    fetchGroupData();
  }
};

// 组件挂载时获取数据
onMounted(() => {
  fetchGroupData();
});
</script>

<style scoped>
.group-container {
  padding: 20px;
}

.group-header {
  margin-bottom: 20px;
}

.group-list {
  margin-top: 20px;
}

.group-card {
  margin-bottom: 20px;
  height: 400px;
}

.group-card :deep(.el-card__body) {
  height: calc(100% - 60px);
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
  gap: 8px;
}

.text-danger {
  color: #f56c6c;
}
</style>
