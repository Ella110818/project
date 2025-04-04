<template>
  <div class="live-class-container">
    <div class="class-header">
      <div class="class-info">
        <h1>{{ courseName }}</h1>
        <div class="course-details">
          <span class="detail-item"><i class="el-icon-location"></i> {{ courseLocation }}</span>
          <span class="detail-item"><i class="el-icon-user"></i> {{ courseTeacher }}</span>
          <span class="detail-item">在线：{{ onlineCount }}人</span>
          <span class="live-badge">实时授课中</span>
        </div>
      </div>
      <div class="header-actions">
        <el-button type="danger" @click="endClass" size="small" icon="el-icon-circle-close">结束授课</el-button>
      </div>
    </div>

    <div class="class-content">
      <div class="main-content">
        <div class="video-container">
          <video ref="videoRef" autoplay playsinline class="camera-video"></video>
          <div v-if="!cameraActive" class="video-placeholder">
            <div class="placeholder-content">
              <div class="title">视频画面</div>
              <div class="subtitle">教师端实时授课视频流将在此处显示</div>
            </div>
          </div>
        </div>

        <div class="control-panel">
          <el-button-group>
            <el-button type="primary" size="default" icon="el-icon-microphone">麦克风</el-button>
            <el-button :type="cameraActive ? 'success' : 'primary'" size="default" icon="el-icon-video-camera" @click="toggleCamera">摄像头</el-button>
            <el-button type="primary" size="default" icon="el-icon-monitor">共享屏幕</el-button>
            <el-button type="warning" size="default" icon="el-icon-upload">上传课件</el-button>
            <el-button type="success" size="default" icon="el-icon-s-claim" @click="captureImage">点名</el-button>
            <el-button type="info" size="default" icon="el-icon-data-analysis">课堂统计</el-button>
          </el-button-group>
        </div>
      </div>

      <div class="interaction-panel">
        <div class="student-list">
          <div class="panel-header">
            <h3>学生列表 ({{ studentCount }})</h3>
            <el-input 
              placeholder="搜索学生" 
              prefix-icon="el-icon-search" 
              size="small"
              style="width: 150px;"
            ></el-input>
          </div>
          <div class="student-items">
            <div class="student-item" v-for="(student, index) in studentList" :key="index">
              <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="学生头像" class="student-avatar">
              <div class="student-info">
                <span class="student-name">{{ student.name }}</span>
                <el-tag size="mini" type="success">在线</el-tag>
              </div>
              <div class="student-actions">
                <el-button type="text" size="mini" icon="el-icon-mic"></el-button>
                <el-button type="text" size="mini" icon="el-icon-video-camera"></el-button>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-panel">
          <div class="panel-header">
            <h3>课堂互动</h3>
          </div>
          <div class="chat-messages">
            <div class="message-item" v-for="(message, index) in chatMessages" :key="index">
              <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="头像" class="message-avatar">
              <div class="message-content">
                <div class="message-header">
                  <span class="message-sender">{{ message.sender }}</span>
                  <span class="message-time">{{ new Date().toLocaleTimeString() }}</span>
                </div>
                <p class="message-text">{{ message.text }}</p>
              </div>
            </div>
          </div>
          <div class="message-input">
            <el-input 
              type="textarea" 
              :rows="2" 
              placeholder="输入消息..." 
              v-model="chatMessage"
            ></el-input>
            <el-button type="primary" icon="el-icon-s-promotion">发送</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加预览对话框 -->
    <el-dialog
      title="签到照片预览"
      v-model="previewVisible"
      width="50%"
      :before-close="handleClosePreview"
    >
      <div class="preview-container">
        <img :src="previewImage" class="preview-image" alt="签到照片" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClosePreview">取消</el-button>
          <el-button type="primary" :loading="uploadLoading" @click="handleConfirmUpload">开始点名</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加点名结果对话框 -->
    <el-dialog
      title="点名结果"
      v-model="attendanceResultVisible"
      width="60%"
    >
      <div class="attendance-result">
        <el-alert
          v-if="attendanceResult.message"
          :title="attendanceResult.message"
          type="success"
          :closable="false"
          class="mb-20"
        />
        
        <el-table :data="attendanceResult.attendance_records" border>
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="present" label="出勤状态">
            <template #default="scope">
              <el-tag :type="scope.row.present ? 'success' : 'danger'">
                {{ scope.row.present ? '已到' : '未识别' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="attendanceResultVisible = false">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import api from '@/api';

export default {
  name: 'LiveClassPage',
  setup() {
    const router = useRouter();
    const courseName = ref('');
    const courseLocation = ref('');
    const courseTeacher = ref('');
    const studentCount = ref(0);
    const onlineCount = ref(0);
    const chatMessage = ref('');
    const videoRef = ref(null);
    const cameraActive = ref(false);
    const previewVisible = ref(false);
    const previewImage = ref('');
    const uploadLoading = ref(false);
    const attendanceResultVisible = ref(false);
    const attendanceResult = ref({
      message: '',
      attendance_records: []
    });
    let stream = null;
    let capturedImageData = null;

    // 添加学生列表数据
    const studentList = ref([
      { name: '张某某', online: true },
      { name: '韩某某', online: true },
      { name: '杨某某', online: true },
      { name: '李某某', online: true },
      { name: '王某某', online: true }
    ]);

    // 添加聊天消息数据
    const chatMessages = ref([
      { 
        sender: '张某某',
        text: '老师，这个知识点我有点不太理解，能再讲解一下吗？'
      },
      { 
        sender: '韩某某',
        text: '我觉得这个概念很有意思，可以分享一下我的理解吗？'
      },
      { 
        sender: '杨某某',
        text: '这个例子和实际应用有什么联系呢？'
      }
    ]);

    // 获取课程详情
    const fetchCourseDetail = async () => {
      try {
        const courseId = localStorage.getItem('currentCourseId');
        if (!courseId) {
          ElMessage.error('课程ID不存在');
          return;
        }

        const response = await api.getCourseDetail(courseId);
        if (response.code === 200) {
          const courseData = response.data;
          courseName.value = courseData.title;
          courseLocation.value = courseData.location;
          
          // 获取教师信息
          try {
            const teacherResponse = await api.getUserMessages(courseData.teacher);
            if (teacherResponse.code === 200 && teacherResponse.data && teacherResponse.data.username) {
              courseTeacher.value = teacherResponse.data.username;
            } else {
              courseTeacher.value = '未知教师';
            }
          } catch (error) {
            console.error('获取教师信息失败:', error);
            courseTeacher.value = '未知教师';
          }
          
          studentCount.value = 35; // 将学生数量固定为35
          onlineCount.value = 35; // 将在线人数设置为35
        } else {
          ElMessage.error(response.message || '获取课程信息失败');
        }
      } catch (error) {
        console.error('获取课程信息失败:', error);
        ElMessage.error('获取课程信息失败，请稍后重试');
      }
    };

    // 开启摄像头
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        if (!stream) {
          ElMessage.error('无法获取摄像头流');
          return;
        }
        console.log('摄像头流获取成功:', stream);
        videoRef.value.srcObject = stream;
        cameraActive.value = true;
      } catch (error) {
        console.error('摄像头访问错误:', error);
        ElMessage.error('无法访问摄像头：' + error.message);
      }
    };

    // 关闭摄像头
    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
      }
      if (videoRef.value) {
        videoRef.value.srcObject = null;
      }
      cameraActive.value = false;
    };

    // 切换摄像头状态
    const toggleCamera = async () => {
      if (cameraActive.value) {
        stopCamera();
      } else {
        await startCamera();
      }
    };

    // 截取当前帧
    const captureImage = () => {
      if (!cameraActive.value) {
        ElMessage.warning('请先开启摄像头');
        return;
      }

      try {
        const video = videoRef.value;
        if (!video || !video.videoWidth) {
          console.error('视频元素未就绪:', video);
          ElMessage.error('摄像头未就绪，请稍后重试');
          return;
        }

        const canvas = document.createElement('canvas');
        
        // 降低图片尺寸以减小文件大小
        const maxWidth = 800;
        const maxHeight = 600;
        let width = video.videoWidth;
        let height = video.videoHeight;
        
        console.log('原始视频尺寸:', width, 'x', height);
        
        // 保持宽高比的情况下调整尺寸
        if (width > maxWidth) {
          const ratio = maxWidth / width;
          width = maxWidth;
          height = Math.round(height * ratio);
        }
        if (height > maxHeight) {
          const ratio = maxHeight / height;
          height = maxHeight;
          width = Math.round(width * ratio);
        }
        
        console.log('调整后尺寸:', width, 'x', height);
        
        // 确保尺寸为整数
        width = Math.floor(width);
        height = Math.floor(height);
        
        canvas.width = width;
        canvas.height = height;
        
        const context = canvas.getContext('2d');
        if (!context) {
          console.error('无法获取 canvas 上下文');
          ElMessage.error('截图失败：无法创建图像上下文');
          return;
        }

        // 添加白色背景以确保图片格式正确
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, width, height);
        
        // 确保图像清晰
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        context.drawImage(video, 0, 0, width, height);
        
        // 将图片转换为 base64 格式，降低质量以减小文件大小
        const imageBase64 = canvas.toDataURL('image/jpeg', 0.7);
        console.log('生成的图片大小:', Math.round(imageBase64.length / 1024), 'KB');
        
        if (!imageBase64.startsWith('data:image/jpeg;base64,')) {
          console.error('图片格式不正确');
          ElMessage.error('截图失败：图片格式不正确');
          return;
        }
        
        // 保存图片数据并显示预览
        capturedImageData = imageBase64;
        previewImage.value = imageBase64;
        previewVisible.value = true;
      } catch (error) {
        console.error('截图失败:', error);
        ElMessage.error('截图失败：' + error.message);
      }
    };

    // 关闭预览
    const handleClosePreview = () => {
      previewVisible.value = false;
      previewImage.value = '';
      capturedImageData = null;
    };

    // 确认上传并开始点名
    const handleConfirmUpload = async () => {
      if (!capturedImageData) {
        console.error('没有可用的图片数据');
        ElMessage.warning('没有可用的图片数据');
        return;
      }

      if (!capturedImageData.startsWith('data:image/jpeg;base64,')) {
        console.error('图片数据格式不正确');
        ElMessage.error('图片数据格式不正确');
        return;
      }

      uploadLoading.value = true;
      try {
        // 将Base64转换为Blob
        const base64Data = capturedImageData.replace('data:image/jpeg;base64,', '');
        const byteCharacters = atob(base64Data);
        const byteArrays = [];
        
        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
          const slice = byteCharacters.slice(offset, offset + 1024);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        
        const blob = new Blob(byteArrays, { type: 'image/jpeg' });
        const file = new File([blob], 'attendance.jpg', { type: 'image/jpeg' });
        
        console.log('准备上传文件，大小:', file.size, 'bytes');
        const response = await api.checkAttendance(file);
        console.log('服务器响应:', response);
        
        // 解析考勤记录和消息
        let attendanceRecords = [];
        let resultMessage = '';
        
        // 根据不同的返回格式处理数据
        if (response.code === 200 && response.data) {
          // 标准格式响应 {code, message, data}
          attendanceRecords = response.data.attendance_records || [];
          resultMessage = response.message || '点名完成';
        } else if (response.status === 'success' && response.attendance_records) {
          // 旧版格式响应 {status, message, attendance_records}
          attendanceRecords = response.attendance_records;
          resultMessage = response.message || '点名完成';
        } else if (response.status === 'error') {
          // 错误响应
          if (!response.message.includes('测试模式')) {
            console.error('点名失败:', response.message);
            ElMessage.error(response.message || '点名失败');
            return;
          }
          resultMessage = response.message;
          attendanceRecords = response.attendance_records || [];
        } else {
          // 未知格式，尝试从各种可能的位置获取数据
          console.warn('未知的API响应格式，尝试解析:', response);
          attendanceRecords = response.attendance_records || 
                             response.data?.attendance_records || 
                             [];
          resultMessage = response.message || 
                         response.data?.message || 
                         '点名完成';
        }
        
        // 更新考勤结果
        attendanceResult.value = {
          message: resultMessage,
          attendance_records: Array.isArray(attendanceRecords) ? attendanceRecords.map(record => ({
            name: record.name || '未知',
            present: record.present === 1,
            confidence: record.confidence || 0
          })) : []
        };
        
        // 显示结果
        handleClosePreview();
        attendanceResultVisible.value = true;
        ElMessage.success(resultMessage);
      } catch (error) {
        console.error('点名失败:', error);
        ElMessage.error(error.message || '点名失败，请稍后重试');
      } finally {
        uploadLoading.value = false;
      }
    };

    onMounted(() => {
      // 获取课程详情
      fetchCourseDetail();
    });

    onUnmounted(() => {
      // 关闭摄像头
      stopCamera();
    });

    const endClass = () => {
      ElMessageBox.confirm(
        '确定要结束当前授课吗？',
        '结束授课',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          ElMessage.success('已结束授课');
          router.push('/dashboard');
        })
        .catch(() => {
          // 用户取消操作
        });
    };

    return {
      courseName,
      courseLocation,
      courseTeacher,
      studentCount,
      onlineCount,
      chatMessage,
      endClass,
      videoRef,
      cameraActive,
      toggleCamera,
      captureImage,
      previewVisible,
      previewImage,
      handleClosePreview,
      handleConfirmUpload,
      uploadLoading,
      attendanceResultVisible,
      attendanceResult,
      studentList,
      chatMessages
    };
  },
};
</script>

<style scoped>
.live-class-container {
  padding: 20px;
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
}

.class-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.class-info h1 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #333;
}

.course-details {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  color: #666;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.live-badge {
  background-color: #f56c6c;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
}

.class-content {
  display: flex;
  gap: 20px;
  flex: 1;
  overflow: hidden;
}

.main-content {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.video-container {
  flex: 1;
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
}

.placeholder-content {
  text-align: center;
}

.placeholder-content .title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.placeholder-content .subtitle {
  font-size: 14px;
  color: #666;
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.control-panel {
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 8px;
  display: flex;
  justify-content: center;
}

.interaction-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.student-list, .chat-panel {
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.student-list {
  flex: 1;
}

.chat-panel {
  flex: 2;
}

.panel-header {
  padding: 10px 15px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.student-items {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.student-item {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  border-bottom: 1px solid #f0f0f0;
}

.student-avatar, .message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
}

.student-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.student-name {
  font-weight: 500;
}

.student-actions {
  display: flex;
  gap: 5px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background-color: #f9f9f9;
}

.message-item {
  display: flex;
  margin-bottom: 15px;
}

.message-content {
  flex: 1;
  background-color: white;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.message-sender {
  font-weight: 500;
  color: #409EFF;
}

.message-time {
  font-size: 12px;
  color: #999;
}

.message-text {
  margin: 0;
  color: #333;
}

.message-input {
  padding: 10px;
  display: flex;
  gap: 10px;
  border-top: 1px solid #e0e0e0;
}

.message-input .el-textarea {
  flex: 1;
}

.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.preview-image {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
  border-radius: 4px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.mb-20 {
  margin-bottom: 20px;
}

.attendance-result {
  padding: 20px;
}

.attendance-result .el-table {
  margin-top: 20px;
}
</style> 