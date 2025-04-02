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
        :action="null"
        :http-request="customUpload"
        :before-upload="beforeUpload"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :show-file-list="false"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持任意格式文件，单个文件不超过100MB
          </div>
        </template>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmUpload">确定</el-button>
        </span>
      </template>
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import api from '@/api'
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

// 状态
const searchText = ref('')
const activeCategory = ref('all')
const currentFolder = ref('')
const uploadDialogVisible = ref(false)
const folderDialogVisible = ref(false)
const folderForm = ref({ name: '' })
const resources = ref([])
const loading = ref(false)

// 从props接收courseId
const props = defineProps({
  courseId: {
    type: [String, Number],
    required: true
  }
})

// 清理函数
const cleanup = () => {
  resources.value = []
  searchText.value = ''
  activeCategory.value = 'all'
  currentFolder.value = ''
  uploadDialogVisible.value = false
  folderDialogVisible.value = false
  folderForm.value = { name: '' }
  loading.value = false
}

// 组件卸载前清理
onBeforeUnmount(() => {
  cleanup()
})

// 获取资源列表
const fetchResources = async () => {
  if (!props.courseId) {
    console.warn('课程ID未提供')
    return
  }

  try {
    loading.value = true
    console.log('获取资源列表 - 课程ID:', props.courseId)
    
    const params = {
      page: 1,
      size: 1000
    }
    
    if (activeCategory.value !== 'all') {
      params.type = activeCategory.value
    }
    
    if (searchText.value) {
      params.search = searchText.value
    }
    
    const response = await api.getCourseResources(props.courseId, params)
    
    if (response.code === 200 && response.data && Array.isArray(response.data.items)) {
      resources.value = response.data.items.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        size: item.size,
        uploadTime: formatTime(item.upload_time),
        uploader: item.uploader
      }))
    } else {
      throw new Error(response.message || '获取资源列表失败')
    }
  } catch (error) {
    console.error('获取资源列表异常:', error)
    ElMessage.error(`获取资源列表失败: ${error.message}`)
    resources.value = []
  } finally {
    loading.value = false
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
      item.uploader?.toLowerCase().includes(keyword)
    )
  }
  
  return filtered
})

// 方法
const handleCategorySelect = (index) => {
  activeCategory.value = index
  fetchResources()
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

const handleDownload = async (file) => {
  try {
    ElMessage.info('正在准备下载...')
    const response = await api.downloadResource(file.id)
    
    if (response instanceof Blob) {
      // 处理文件流
      const url = window.URL.createObjectURL(response)
      const link = document.createElement('a')
      link.href = url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      ElMessage.success('下载成功')
    } else if (response.data && response.data.downloadUrl) {
      // 处理下载链接
      window.open(response.data.downloadUrl, '_blank')
      ElMessage.success('下载成功')
    } else {
      throw new Error('下载失败：无效的响应格式')
    }
  } catch (error) {
    console.error('下载失败:', error)
    ElMessage.error(`下载失败: ${error.message || '未知错误'}`)
  }
}

const handlePreview = async (file) => {
  try {
    const response = await api.getResourceDetail(file.id)
    const { type, url } = response.data
    
    switch (type) {
      case 'video':
        // 视频预览
        window.open(url, '_blank')
        break
      case 'document':
        // 文档预览
        window.open(url, '_blank')
        break
      case 'courseware':
        // 课件预览
        window.open(url, '_blank')
        break
      default:
        ElMessage.warning('该文件类型暂不支持预览')
    }
  } catch (error) {
    console.error('预览失败:', error)
    ElMessage.error('预览失败')
  }
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
  ).then(async () => {
    try {
      const response = await api.deleteResource(file.id)
      if (response.code === 200) {
        ElMessage.success('删除成功')
        // 刷新资源列表
        fetchResources()
      } else {
        throw new Error(response.message || '删除失败')
      }
    } catch (error) {
      console.error('删除资源失败:', error)
      ElMessage.error(error.message || '删除失败')
    }
  }).catch(() => {
    // 用户取消删除操作
  })
}

const handleRemove = (file, fileList) => {
  console.log(file, fileList)
}

const beforeRemove = (uploadFile) => {
  return ElMessageBox.confirm(
    `确定移除 ${uploadFile.name} ？`
  ).then(
    () => true,
    () => false
  )
}

const beforeUpload = (file) => {
  // 检查文件大小（100MB = 100 * 1024 * 1024 bytes）
  const maxSize = 100 * 1024 * 1024
  if (file.size > maxSize) {
    ElMessage.error('文件大小不能超过100MB')
    return false
  }
  return true
}

const customUpload = async ({ file }) => {
  let loadingInstance = null;
  try {
    // 显示上传进度
    loadingInstance = ElLoading.service({
      text: '正在上传...',
      background: 'rgba(0, 0, 0, 0.7)'
    });

    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('name', file.name);
    formData.append('type', getFileType(file));
    formData.append('course_id', props.courseId);
    
    console.log('准备上传文件:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      courseId: props.courseId
    });
    
    const response = await api.uploadCourseResource(props.courseId, formData);
    
    if (response.code === 200) {
      ElMessage.success('上传成功');
      // 刷新资源列表
      await fetchResources();
      // 关闭上传对话框
      uploadDialogVisible.value = false;
    } else {
      throw new Error(response.message || '上传失败');
    }
  } catch (error) {
    console.error('上传文件失败:', error);
    let errorMessage = '上传失败';
    
    if (error.response) {
      // 服务器返回了错误响应
      errorMessage = `上传失败: ${error.response.data?.detail || error.response.data?.message || error.message}`;
    } else if (error.request) {
      // 请求已发送但没有收到响应
      errorMessage = '服务器无响应，请检查网络连接';
    } else {
      // 请求设置时发生错误
      errorMessage = `上传出错: ${error.message}`;
    }
    
    ElMessage.error(errorMessage);
  } finally {
    // 关闭加载提示
    if (loadingInstance) {
      loadingInstance.close();
    }
  }
};

const getFileType = (file) => {
  const extension = file.name.split('.').pop().toLowerCase()
  const typeMap = {
    // 文档类型
    'doc': 'document',
    'docx': 'document',
    'pdf': 'document',
    'txt': 'document',
    // 课件类型
    'ppt': 'courseware',
    'pptx': 'courseware',
    // 视频类型
    'mp4': 'video',
    'avi': 'video',
    'mov': 'video'
  }
  return typeMap[extension] || 'other'
}

const confirmUpload = () => {
  uploadDialogVisible.value = false
  fetchResources()
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
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 组件挂载时获取资源列表
onMounted(() => {
  if (props.courseId) {
    fetchResources()
  }
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