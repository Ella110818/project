<template>
  <div class="pro-container">
    <el-container>
      <el-aside style="width: 100%">
        <el-card class="card1">
          <template #header>
            <div class="card-header">
              <el-upload
                class="background-uploader"
                action="#"
                :show-file-list="false"
                :before-upload="beforeBackgroundUpload"
                :auto-upload="false"
                drag
              >
                <div v-if="backgroundImage" class="background-image" :style="{ backgroundImage: `url(${backgroundImage})` }">
                  <div class="background-overlay">
                    <el-icon class="background-uploader-icon"><Plus /></el-icon>
                  </div>
                </div>
                <div v-else class="background-placeholder">
                  <el-icon class="background-uploader-icon"><Plus /></el-icon>
                </div>
              </el-upload>
            </div>
          </template>
          <div class="user-info">
            <div class="user-profile">
              <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="userAvatar" :src="userAvatar" class="user-image" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
              <div class="user-name">
                <h2>{{ username }}</h2>
              </div>
            </div>
            <div class="user-details">
              <table class="user-table">
                <tr class="underlined-cell">
                  <td class="column1"><strong>学工号:</strong></td>
                  <td class="column2">
                    <span v-if="!isEditing.id">{{ userId }}</span>
                    <el-input v-else v-model="userInfo.id" size="small" />
                  </td>
                </tr>
                <tr class="underlined-cell">
                  <td class="column1"><strong>学院:</strong></td>
                  <td class="column2">
                    <span v-if="!isEditing.college">{{ userInfo.college }}</span>
                    <el-input v-else v-model="userInfo.college" size="small" />
                  </td>
                </tr>
                <tr class="underlined-cell">
                  <td class="column1"><strong>性别:</strong></td>
                  <td class="column2">
                    <span v-if="!isEditing.gender">{{ userInfo.gender }}</span>
                    <el-input v-else v-model="userInfo.gender" size="small" />
                  </td>
                </tr>
                <tr class="underlined-cell">
                  <td class="column1"><strong>手机号:</strong></td>
                  <td class="column2">
                    <span v-if="!isEditing.phone">{{ userInfo.phone }}</span>
                    <el-input v-else v-model="userInfo.phone" size="small" />
                  </td>
                </tr>
                <tr class="underlined-cell">
                  <td class="column1"><strong>个人介绍:</strong></td>
                  <td class="column2">
                    <span v-if="!isEditing.intro">{{ userInfo.intro }}</span>
                    <el-input v-else v-model="userInfo.intro" size="small" />
                  </td>
                </tr>
                <tr class="underlined-cell">
                  <td class="column1"><strong>教育经历:</strong></td>
                  <td class="column2">
                    <span v-if="!isEditing.education">{{ userInfo.education }}</span>
                    <el-input v-else v-model="userInfo.education" size="small" />
                  </td>
                </tr>
              </table>
              <div class="actions">
                <el-button v-if="!isEditing.all" type="primary" @click="startEditing">修改</el-button>
                <el-button v-else type="success" @click="saveChanges">保存</el-button>
                <el-button v-if="isEditing.all" type="danger" @click="cancelEditing">取消</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-aside>
    </el-container>
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api'

const username = ref('')
const userId = ref('')
const email = ref('')
const role = ref('')
const userAvatar = ref('')
const backgroundImage = ref('')
const isEditing = ref({
  all: false,
  id: false,
  college: false,
  gender: false,
  phone: false,
  intro: false,
  education: false
})

const userInfo = ref({
  id: '',
  college: '未设置',
  gender: '未设置',
  phone: '未设置',
  intro: '未设置',
  education: '未设置'
})

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const storedUserId = localStorage.getItem('userId')
    const storedUsername = localStorage.getItem('username')
    if (!storedUserId) {
      ElMessage.warning('请先登录')
      return
    }

    const response = await api.getUserMessages(storedUserId)
    
    if (response.code === 200) {
      const data = response.data
      username.value = storedUsername || data.name
      userId.value = data.userId
      email.value = data.email
      role.value = data.role
      userAvatar.value = data.avatar || ''
      
      // 更新用户信息
      userInfo.value = {
        id: data.userId,
        college: data.student_detail?.class_detail?.class_system || '未设置',
        gender: data.gender || '未设置',
        phone: data.phone || '未设置',
        intro: data.intro || '未设置',
        education: data.education || '未设置'
      }
      
      // 保存到localStorage
      localStorage.setItem('name', data.name)
      localStorage.setItem('email', data.email)
      localStorage.setItem('userRole', data.role)
      if (data.avatar) {
        localStorage.setItem('userAvatar', data.avatar)
      }
    } else {
      throw new Error(response.message || '获取用户信息失败')
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error(error.message || '获取用户信息失败')
  }
}

onMounted(() => {
  fetchUserInfo()
  backgroundImage.value = localStorage.getItem('backgroundImage') || ''
})

const startEditing = () => {
  isEditing.value.all = true
  isEditing.value.id = true
  isEditing.value.college = true
  isEditing.value.gender = true
  isEditing.value.phone = true
  isEditing.value.intro = true
  isEditing.value.education = true
}

const saveChanges = () => {
  // 保存修改到 localStorage
  localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
  isEditing.value.all = false
  isEditing.value.id = false
  isEditing.value.college = false
  isEditing.value.gender = false
  isEditing.value.phone = false
  isEditing.value.intro = false
  isEditing.value.education = false
  ElMessage.success('保存成功')
}

const cancelEditing = () => {
  // 重置编辑状态
  isEditing.value.all = false
  isEditing.value.id = false
  isEditing.value.college = false
  isEditing.value.gender = false
  isEditing.value.phone = false
  isEditing.value.intro = false
  isEditing.value.education = false
  // 从 localStorage 恢复数据
  const savedInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  userInfo.value = { ...userInfo.value, ...savedInfo }
}

const handleAvatarSuccess = (response, file) => {
  userAvatar.value = URL.createObjectURL(file.raw)
  localStorage.setItem('userAvatar', userAvatar.value)
  ElMessage.success('头像上传成功')
}

const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('上传头像图片只能是 JPG/PNG/GIF 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

const beforeBackgroundUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isJPG) {
    ElMessage.error('上传背景图片只能是 JPG/PNG/GIF 格式!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('上传背景图片大小不能超过 5MB!')
    return false
  }

  // 创建图片URL并保存
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    backgroundImage.value = reader.result
    localStorage.setItem('backgroundImage', backgroundImage.value)
    ElMessage.success('背景图片上传成功')
  }

  return false // 阻止自动上传
}
</script>

<style scoped>
.pro-container {
  background-color: #f5f2ee;
  width: 100%;
  max-width: 100%;
  height: 100vh;
  margin: 0;
  padding: 20px;
  box-sizing: border-box;
  overflow-x: hidden;
}

.card-header {
  width: 100%;
  height: 190px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  overflow: hidden;
  background: #f5f7fa; /* 默认背景色 */
}

.card1 {
  width: 800px;
  max-width: 100%;
  height: 830px;
  margin: 30px auto;
  position: relative;
  overflow: hidden;
}

.user-info {
  display: flex;
  flex-direction: column;
  margin-top: 90px;
  position: relative;
}

.user-profile {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 2;
}

.avatar-uploader {
  width: 125px;
  height: 125px;
  margin-right: 15px;
  position: relative;
  z-index: 2;
}

.avatar-uploader .user-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 7px;
  padding: 4px;
  background-color: rgb(125, 169, 216);
  box-sizing: border-box;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 125px;
  height: 125px;
  text-align: center;
  line-height: 125px;
  border-radius: 7px;
  background-color: rgb(125, 169, 216);
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.avatar-uploader-icon:hover {
  color: #409EFF;
  background-color: rgb(125, 169, 216, 0.8);
}

.user-name {
  position: relative;
  z-index: 2;
}

.user-name h2 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}

.user-details {
  margin-top: 20px;
  position: relative;
  z-index: 2;
}

.underlined-cell {
  position: relative;
  margin-bottom: 30px;
}

.underlined-cell::after {
  content: '';
  position: absolute;
  left: 160px;
  bottom: 0;
  width: 590px;
  height: 1px;
  background-color: #b43e3e;
}

.actions {
  margin-top: 10px;
}

.actions .el-button {
  margin-right: 10px;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: -38px;
  position: relative;
}

.user-table td {
  padding: 10px;
  text-decoration: none;
  margin-bottom: 15px;
}

.user-table tr {
  display: flex;
}

.user-table .column1 {
  flex: 0 0 200px;
  width: 200px;
  margin-left: 170px;
  text-align: left;
}

.user-table .column2 {
  flex: 1;
  width: auto;
  margin-right: 230px;
  text-align: left;
}

body,
html {
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

.el-aside {
  width: 100%;
  max-width: 100%;
}

.background-uploader {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
}

.background-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.background-image:hover .background-overlay {
  opacity: 1;
}

.background-placeholder {
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.background-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  cursor: pointer;
  transition: all 0.3s;
}

.background-uploader-icon:hover {
  color: #409EFF;
}

/* 确保上传组件可以接收点击事件 */
:deep(.el-upload) {
  width: 100%;
  height: 100%;
}

:deep(.el-upload-dragger) {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
}
</style> 

