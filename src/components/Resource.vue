<template>
  <div class="resource-container">
    <!-- 顶部操作栏 -->
    <div class="resource-header">
      <div class="left-actions">
        <el-button type="primary" @click="handleUpload">
          <el-icon><Upload /></el-icon>上传文件
        </el-button>
        <el-button @click="handleCreateFolder">
          <el-icon><Folder /></el-icon>新建文件夹
        </el-button>
      </div>
      <div class="right-actions">
        <el-input
          v-model="searchText"
          placeholder="搜索文件"
          prefix-icon="Search"
          style="width: 250px"
        />
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="resource-content">
      <!-- 左侧分类导航 -->
      <div class="resource-nav">
        <el-menu
          :default-active="activeCategory"
          @select="handleCategorySelect"
        >
          <el-menu-item index="all">
            <el-icon><Document /></el-icon>
            <span>全部文件</span>
          </el-menu-item>
          <el-menu-item index="courseware">
            <el-icon><Collection /></el-icon>
            <span>课件</span>
          </el-menu-item>
          <el-menu-item index="video">
            <el-icon><VideoPlay /></el-icon>
            <span>视频</span>
          </el-menu-item>
          <el-menu-item index="document">
            <el-icon><Files /></el-icon>
            <span>文档</span>
          </el-menu-item>
          <el-menu-item index="other">
            <el-icon><More /></el-icon>
            <span>其他</span>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 右侧文件列表 -->
      <div class="resource-list">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">课程资源</el-breadcrumb-item>
          <el-breadcrumb-item v-if="currentFolder">{{ currentFolder }}</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 文件列表 -->
        <el-table
          :data="filteredResources"
          style="width: 100%; margin-top: 20px;"
          @row-click="handleRowClick"
        >
          <el-table-column width="50">
            <template #default="scope">
              <el-icon :size="20">
                <component :is="getFileIcon(scope.row.type)" />
              </el-icon>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="文件名" min-width="200">
            <template #default="scope">
              <span class="file-name">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="size" label="大小" width="120">
            <template #default="scope">
              {{ formatFileSize(scope.row.size) }}
            </template>
          </el-table-column>
          <el-table-column prop="uploadTime" label="上传时间" width="180" />
          <el-table-column prop="uploader" label="上传者" width="120" />
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button link type="primary" @click.stop="handleDownload(scope.row)">
                下载
              </el-button>
              <el-button link type="primary" @click.stop="handlePreview(scope.row)">
                预览
              </el-button>
              <el-button link type="danger" @click.stop="handleDelete(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 上传文件对话框 -->
    <el-dialog
      v-model="uploadDialogVisible"
      title="上传文件"
      width="500px"
    >
      <el-upload
        class="upload-demo"
        drag
        :action="`/api/courses/${courseId}/resources/upload`"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :before-upload="beforeUpload"
        multiple
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持任意类型文件，单个文件不超过100MB
          </div>
        </template>
      </el-upload>
    </el-dialog>

    <!-- 新建文件夹对话框 -->
    <el-dialog
      v-model="folderDialogVisible"
      title="新建文件夹"
      width="400px"
    >
      <el-form :model="folderForm">
        <el-form-item label="文件夹名称">
          <el-input v-model="folderForm.name" placeholder="请输入文件夹名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="folderDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmCreateFolder">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import {
  Document,
  Folder,
  Upload,
  Search,
  Collection,
  VideoPlay,
  Files,
  More,
  UploadFilled
} from '@element-plus/icons-vue'

const route = useRoute()
const courseId = route.params.id

const searchText = ref('')
const activeCategory = ref('all')
const currentFolder = ref('')
const uploadDialogVisible = ref(false)
const folderDialogVisible = ref(false)
const folderForm = ref({ name: '' })

const resources = ref([])

// 获取资源列表
const fetchResources = async () => {
  try {
    const response = await axios.get(`/api/courses/${courseId}/resources`)
    resources.value = response.data
  } catch (error) {
    console.error('获取资源列表失败:', error)
    ElMessage.error('获取资源列表失败，请稍后重试')
  }
}

// 计算属性：过滤后的资源列表
const filteredResources = computed(() => {
  let filtered = resources.value
  
  // 按分类筛选
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(item => item.type === activeCategory.value)
  }
  
  // 按搜索关键词筛选
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(keyword) ||
      item.uploader.toLowerCase().includes(keyword)
    )
  }
  
  return filtered
})

// 方法
const handleCategorySelect = (index) => {
  activeCategory.value = index
}

const handleUpload = () => {
  uploadDialogVisible.value = true
}

const handleCreateFolder = () => {
  folderDialogVisible.value = true
}

const confirmCreateFolder = () => {
  if (!folderForm.value.name) {
    ElMessage.warning('请输入文件夹名称')
    return
  }
  // TODO: 创建文件夹逻辑
  ElMessage.success('文件夹创建成功')
  folderDialogVisible.value = false
  folderForm.value.name = ''
}

const handleRowClick = (row) => {
  if (row.type === 'folder') {
    currentFolder.value = row.name
    // TODO: 进入文件夹逻辑
  }
}

const handleDownload = (file) => {
  // TODO: 实现文件下载逻辑
  ElMessage.success(`开始下载：${file.name}`)
}

const handlePreview = (file) => {
  // TODO: 实现文件预览逻辑
  ElMessage.info(`预览文件：${file.name}`)
}

const handleDelete = (file) => {
  ElMessageBox.confirm(
    `确定要删除 ${file.name} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现文件删除逻辑
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleUploadSuccess = (response) => {
  ElMessage.success('上传成功')
  fetchResources()
}

const handleUploadError = () => {
  ElMessage.error('上传失败，请重试')
}

const beforeUpload = (file) => {
  const maxSize = 100 * 1024 * 1024 // 100MB
  if (file.size > maxSize) {
    ElMessage.error('文件大小不能超过100MB')
    return false
  }
  return true
}

// 工具方法
const getFileIcon = (type) => {
  const iconMap = {
    folder: Folder,
    courseware: Collection,
    video: VideoPlay,
    document: Files,
    other: Document
  }
  return iconMap[type] || Document
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 组件挂载时获取资源列表
onMounted(() => {
  fetchResources()
})
</script>

<style scoped>
.resource-container {
  padding: 20px;
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
}

.resource-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.left-actions {
  display: flex;
  gap: 10px;
}

.resource-content {
  flex: 1;
  display: flex;
  gap: 20px;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  height: 100%;
}

.resource-nav {
  width: 200px;
  border-right: 1px solid #e4e7ed;
}

.resource-list {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.file-name {
  cursor: pointer;
  color: #606266;
}

.file-name:hover {
  color: #409EFF;
}

:deep(.el-upload-dragger) {
  width: 100%;
}

:deep(.el-menu) {
  border-right: none;
}

:deep(.el-menu-item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

.el-icon {
  vertical-align: middle;
}
</style> 