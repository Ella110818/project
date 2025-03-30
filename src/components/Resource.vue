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
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="uploadForm" label-width="80px" :rules="uploadRules" ref="uploadFormRef">
        <el-form-item label="类型" prop="type">
          <el-select v-model="uploadForm.type" placeholder="请选择资源类型" style="width: 100%;">
            <el-option
              v-for="item in resourceTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="uploadForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入资源描述"
          />
        </el-form-item>
        <el-upload
          ref="uploadRef"
          class="upload-demo"
          drag
          :auto-upload="false"
          :multiple="true"
          :on-change="handleFileChange"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :file-list="fileList"
          accept="*"
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
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelUpload">取消</el-button>
          <el-button type="primary" @click="handleUploadSubmit" :loading="uploading">
            {{ uploading ? '上传中...' : '确认上传' }}
          </el-button>
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
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'
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

const route = useRoute()

// 定义props
const props = defineProps({
  courseId: {
    type: [String, Number],
    required: true
  }
})

// 状态
const searchText = ref('')
const activeCategory = ref('all')
const currentFolder = ref('')
const uploadDialogVisible = ref(false)
const folderDialogVisible = ref(false)
const folderForm = ref({ name: '' })

// 添加上传相关的状态
const uploadForm = ref({
  type: '',
  description: ''
})
const fileList = ref([])
const uploading = ref(false)
const uploadFormRef = ref(null)
const uploadRef = ref(null)

// 上传表单验证规则
const uploadRules = {
  type: [
    { required: true, message: '请选择资源类型', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入资源描述', trigger: 'blur' }
  ]
}

// 资源类型选项
const resourceTypes = [
  { label: '课件', value: 'courseware' },
  { label: '视频', value: 'video' },
  { label: '文档', value: 'document' },
  { label: '其他', value: 'other' }
]

// 移除模拟数据，改用ref
const resources = ref([])

// 添加初始化方法
onMounted(async () => {
  await fetchResources()
})

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

const handleDownload = async (file) => {
  try {
    ElMessage.info(`正在获取下载链接：${file.name}`)
    const response = await api.downloadResource(file.id)
    
    // 检查响应类型
    if (response instanceof Blob) {
      // 处理二进制文件流
      const blob = new Blob([response], { type: response.type })
      const downloadUrl = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      
      // 清理
      document.body.removeChild(link)
      URL.revokeObjectURL(downloadUrl)
      
      ElMessage.success(`开始下载：${file.name}`)
    } else if (response.code === 200 && response.data && response.data.downloadUrl) {
      // 处理下载链接
      const link = document.createElement('a')
      link.href = response.data.downloadUrl
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      ElMessage.success(`开始下载：${file.name}`)
    } else {
      console.error('下载响应异常:', response)
      ElMessage.error(response.message || '获取下载链接失败')
    }
  } catch (error) {
    console.error('下载文件失败:', error)
    if (error.response) {
      const { status, data } = error.response
      ElMessage.error(`下载失败: ${data?.message || `服务器返回 ${status} 错误`}`)
    } else if (error.request) {
      ElMessage.error('下载失败: 无法连接到服务器')
    } else {
      ElMessage.error(`下载失败: ${error.message || '未知错误'}`)
    }
  }
}

const handlePreview = async (file) => {
  try {
    const response = await api.getResourceDetail(file.id)
    
    if (response.code === 200) {
      // 根据资源类型决定预览方式
      const resourceData = response.data
      if (resourceData.type === 'video') {
        // 视频预览
        window.open(resourceData.file, '_blank')
      } else if (resourceData.type === 'document' || resourceData.type === 'courseware') {
        // 文档预览
        window.open(resourceData.file, '_blank')
      } else {
        // 其他类型可能无法预览
        ElMessage.info('该类型文件可能无法预览，建议下载后查看')
      }
    } else {
      ElMessage.error(response.message || '获取资源详情失败')
    }
  } catch (error) {
    console.error('预览文件失败:', error)
    ElMessage.error(`预览失败: ${error.message || '未知错误'}`)
  }
}

const handleDelete = async (file) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除 ${file.name} 吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const response = await api.deleteResource(file.id)
    
    if (response.code === 200) {
      ElMessage.success('删除成功')
      // 刷新资源列表
      await fetchResources()
    } else {
      ElMessage.error(response.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除文件失败:', error)
      ElMessage.error(`删除失败: ${error.message || '未知错误'}`)
    }
  }
}

const handleFileChange = (uploadFile, uploadFiles) => {
  console.log('文件改变:', uploadFile, uploadFiles)
  // 直接使用uploadFiles，不需要.value
  fileList.value = uploadFiles
}

const handleRemove = (file, uploadFiles) => {
  fileList.value = uploadFiles
}

const beforeRemove = (uploadFile) => {
  return ElMessageBox.confirm(`确定移除 ${uploadFile.name} ？`)
}

const handleUploadSubmit = async () => {
  if (!uploadFormRef.value) return

  try {
    // 1. 验证表单
    await uploadFormRef.value.validate()
    
    // 2. 检查是否有文件要上传
    if (!fileList.value || fileList.value.length === 0) {
      ElMessage.warning('请选择要上传的文件')
      return
    }

    // 3. 检查课程ID
    if (!props.courseId) {
      ElMessage.error('课程ID不能为空，请确保正确传入courseId')
      console.error('当前courseId:', props.courseId)
      return
    }

    // 4. 开始上传
    uploading.value = true
    
    try {
      // 遍历文件列表，逐个上传
      for (const file of fileList.value) {
        if (file.status !== 'success') { // 只上传未成功的文件
          await uploadSingleFile(file)
        }
      }
      
      // 所有文件上传完成
      ElMessage.success('所有文件上传完成')
      // 先关闭对话框
      cancelUpload()
      // 然后刷新资源列表
      await fetchResources()
    } catch (error) {
      console.error('上传过程中出错:', error)
      ElMessage.error('上传过程中出错，请重试')
    } finally {
      uploading.value = false
    }
  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.error('请完善表单信息')
  }
}

const uploadSingleFile = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file.raw)
    formData.append('name', file.name)
    formData.append('type', uploadForm.value.type)
    formData.append('description', uploadForm.value.description)

    console.log('准备上传文件:', {
      courseId: props.courseId,
      fileName: file.name,
      fileSize: file.size,
      type: uploadForm.value.type,
      description: uploadForm.value.description
    })

    const response = await api.uploadCourseResource(props.courseId, formData)

    if (response.code === 200) {
      file.status = 'success'
      ElMessage.success(`${file.name} 上传成功`)
      return true
    } else {
      throw new Error(response.message || '服务器错误')
    }
  } catch (error) {
    file.status = 'error'
    console.error(`文件 ${file.name} 上传失败:`, error)
    ElMessage.error(`文件 ${file.name} 上传失败: ${error.message || '未知错误'}`)
    throw error
  }
}

const cancelUpload = () => {
  uploadDialogVisible.value = false
  uploadForm.value = {
    type: '',
    description: ''
  }
  fileList.value = []
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
}

const customUpload = async ({ file }) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', file.name)
    formData.append('type', uploadForm.value.type)
    formData.append('description', uploadForm.value.description)

    // 调试信息
    console.log('准备上传文件:', {
      courseId: props.courseId,
      fileName: file.name,
      fileSize: file.size,
      type: uploadForm.value.type,
      description: uploadForm.value.description
    })

    const response = await api.uploadCourseResource(props.courseId, formData)

    if (response.code === 200) {
      ElMessage.success(`${file.name} 上传成功`)
      // 如果所有文件都上传完成，关闭对话框并刷新列表
      if (fileList.value.every(f => f.status === 'success')) {
        cancelUpload()
        fetchResources()
      }
    } else {
      throw new Error(response.message || '服务器错误')
    }
  } catch (error) {
    console.error('上传文件失败:', error)
    if (error.response) {
      const { status, data } = error.response
      ElMessage.error(`上传失败: ${data?.message || `服务器返回 ${status} 错误`}`)
    } else if (error.request) {
      ElMessage.error('上传失败: 无法连接到服务器')
    } else {
      ElMessage.error(`上传失败: ${error.message || '未知错误'}`)
    }
    // 标记文件上传失败
    file.status = 'error'
  }
}

const beforeUpload = (file) => {
  const maxSize = 100 * 1024 * 1024 // 100MB
  if (file.size > maxSize) {
    ElMessage.error('文件大小不能超过100MB')
    return false
  }
  return true
}

const fetchResources = async () => {
  try {
    if (!props.courseId) {
      ElMessage.error('课程ID不能为空')
      return
    }

    const params = {
      page: 1,
      size: 1000,
      type: activeCategory.value === 'all' ? undefined : activeCategory.value,
      search: searchText.value || undefined
    }
    
    console.log('获取资源列表，参数:', {
      courseId: props.courseId,
      params
    })
    
    const response = await api.getCourseResources(props.courseId, params)
    
    if (response.code === 200) {
      resources.value = response.data.items
      console.log('资源列表更新成功:', resources.value)
    } else {
      throw new Error(response.message || '获取资源列表失败')
    }
  } catch (error) {
    console.error('获取资源列表异常:', error)
    ElMessage.error(`获取资源列表失败: ${error.message}`)
  }
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