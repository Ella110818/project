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
        <el-button 
          v-if="!isRecording" 
          type="danger" 
          @click="startRecording" 
          size="small" 
          icon="el-icon-video-camera" 
          :disabled="!cameraActive">开始录制</el-button>
        <el-button 
          v-else 
          type="warning" 
          @click="stopRecording" 
          size="small" 
          icon="el-icon-video-camera">停止录制</el-button>
        <el-button type="danger" @click="endClass" size="small" icon="el-icon-circle-close">结束授课</el-button>
      </div>
    </div>

    <div class="class-content">
      <div class="main-content">
        <div class="video-container">
          <!-- 本地摄像头视频 -->
          <video ref="videoRef" autoplay playsinline class="camera-video" v-show="cameraActive && !processedFrame"></video>
          
          <!-- 处理后的视频帧展示 -->
          <div class="processed-frame-container" v-if="processedFrame && cameraActive">
            <img :src="'data:image/jpeg;base64,'+processedFrame" class="processed-frame" alt="处理后的视频" />
            <div class="video-overlay">
              <div class="face-stats">
                <div class="stat-item">
                  <i class="el-icon-user"></i>
                  <span>检测到 {{ faceCount }} 张人脸</span>
                </div>
                <div class="stat-item" v-if="detectedStudents.length > 0">
                  <i class="el-icon-user-solid"></i>
                  <span>识别到 {{ detectedStudents.length }} 位学生</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 摄像头未激活的占位符 -->
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
              v-model="searchQuery"
            ></el-input>
          </div>
          <div class="student-items">
            <div 
              class="student-item" 
              v-for="(student, index) in filteredStudentList" 
              :key="index"
              :class="{'student-detected': detectedStudents.includes(student.name)}"
            >
              <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="学生头像" class="student-avatar">
              <div class="student-info">
                <span class="student-name">{{ student.name }}</span>
                <el-tag 
                  size="mini" 
                  :type="detectedStudents.includes(student.name) ? 'success' : 'info'"
                >
                  {{ detectedStudents.includes(student.name) ? '已检测' : '已到' }}
                </el-tag>
                
                <!-- 如果有情绪数据，显示当前情绪状态 -->
                <el-tag 
                  v-if="detectedStudents.includes(student.name) && getStudentEmotion(student.name)" 
                  size="mini" 
                  :type="getEmotionTagType(getStudentEmotion(student.name))"
                  class="ml-5"
                >
                  {{ getStudentEmotion(student.name) }}
                </el-tag>
              </div>
              <div class="student-actions">
                <el-button type="text" size="mini" icon="el-icon-mic"></el-button>
                <el-button type="text" size="mini" icon="el-icon-video-camera"></el-button>
              </div>
            </div>
            
            <!-- 如果列表为空 -->
            <div class="empty-list" v-if="filteredStudentList.length === 0">
              <i class="el-icon-warning-outline"></i>
              <span>未找到匹配的学生</span>
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

    <!-- 情绪分析对话框 -->
    <el-dialog
      title="课堂情绪分析"
      v-model="emotionAnalysisVisible"
      width="70%"
    >
      <div class="emotion-analysis">
        <!-- 整体情绪概览 -->
        <div class="emotion-overview">
          <h4>班级整体情绪状态</h4>
          <el-row :gutter="20">
            <el-col :span="18">
              <!-- 用饼图展示总体情绪分布 -->
              <div ref="overallEmotionChart" class="chart-container"></div>
            </el-col>
            <el-col :span="6">
              <div class="emotion-stats">
                <div class="stat-card">
                  <div class="stat-title">检测到的学生</div>
                  <div class="stat-value">{{ detectedStudents.length }}</div>
                </div>
                
                <div class="stat-card">
                  <div class="stat-title">当前主要情绪</div>
                  <div class="stat-value emotion-tag">
                    <el-tag :type="getEmotionTagType(dominantEmotion)">
                      {{ dominantEmotion || '无数据' }}
                    </el-tag>
                  </div>
                </div>
                
                <div class="stat-card">
                  <div class="stat-title">专注度</div>
                  <div class="stat-value">
                    <el-progress 
                      :percentage="focusRate" 
                      :color="getFocusColor(focusRate)"
                    ></el-progress>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        
        <!-- 学生情绪列表 -->
        <div class="students-emotion-list">
          <h4>学生情绪列表</h4>
          <div class="emotion-distribution">
            <div class="emotion-bar" v-for="(student, index) in studentsEmotionData" :key="index">
              <span class="emotion-label">{{ student.name }}</span>
              <el-progress 
                :percentage="student.percentages" 
                :color="getEmotionColor(student.dominantStatus)"
              ></el-progress>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import * as echarts from 'echarts';
import api from '@/api';

export default {
  name: 'LiveClassPage',
  setup() {
    const router = useRouter();
    
    // 基本信息
    const courseName = ref('');
    const courseLocation = ref('');
    const courseTeacher = ref('');
    const studentCount = ref(0);
    const onlineCount = ref(0);
    const chatMessage = ref('');
    
    // 摄像头和视频相关
    const videoRef = ref(null);
    const cameraActive = ref(false);
    const wsConnected = ref(false);
    const processedFrame = ref('');
    const faceCount = ref(0);
    const searchQuery = ref('');
    
    // 预览和上传
    const previewVisible = ref(false);
    const previewImage = ref('');
    const uploadLoading = ref(false);
    
    // 点名结果
    const attendanceResultVisible = ref(false);
    const attendanceResult = ref({
      message: '',
      attendance_records: []
    });
    
    // 情绪分析相关
    const emotionAnalysisVisible = ref(false);
    const emotionStats = ref(null);
    const detectedStudents = ref([]);
    const overallEmotionChart = ref(null);
    const emotionChartInstance = ref(null);
    
    // WebSocket和视频流
    let stream = null;
    let capturedImageData = null;
    let websocket = null;
    let frameProcessingInterval = null;
    
    // 录制相关
    const isRecording = ref(false);
    const mediaRecorder = ref(null);
    const recordedChunks = ref([]);
    const recordingBlob = ref(null);
    const uploadingRecording = ref(false);
    
    // 学生列表过滤
    const filteredStudentList = computed(() => {
      if (!searchQuery.value) return studentList.value;
      const query = searchQuery.value.toLowerCase();
      return studentList.value.filter(student => 
        student.name.toLowerCase().includes(query)
      );
    });
    
    // 计算主要情绪
    const dominantEmotion = computed(() => {
      if (!emotionStats.value || !emotionStats.value.overall_percentages) {
        return null;
      }
      
      // 找出百分比最高的情绪
      const percentages = emotionStats.value.overall_percentages;
      if (Object.keys(percentages).length === 0) return null;
      
      return Object.entries(percentages)
        .sort((a, b) => b[1] - a[1])
        .map(([emotion]) => emotion)[0];
    });
    
    // 计算专注度（简单计算：Focused状态的百分比）
    const focusRate = computed(() => {
      if (!emotionStats.value || !emotionStats.value.overall_percentages) {
        return 0;
      }
      
      return emotionStats.value.overall_percentages['Focused'] || 0;
    });
    
    // 学生情绪数据格式化
    const studentsEmotionData = computed(() => {
      if (!emotionStats.value || !emotionStats.value.student_emotions) {
        return [];
      }
      
      return Object.entries(emotionStats.value.student_emotions).map(([name, data]) => ({
        name,
        currentStatus: data.current_status,
        dominantStatus: data.dominant_status,
        percentages: data.percentages,
        history: data.history
      }));
    });
    
    // 添加学生列表数据（示例数据）
    const studentList = ref([
      { name: '李乐', online: true },
      { name: '陈文伟', online: true },
      { name: '杨依林', online: true },
      { name: '宋嘉怡', online: true },
      { name: '马莉岚', online: true },
      { name: '谢宛桐', online: true },
      { name: '汤燕', online: true }
    ]);

    // 添加聊天消息数据
    const chatMessages = ref([
      { 
        sender: '李乐',
        text: '老师，这个知识点我有点不太理解，能再讲解一下吗？'
      },
      { 
        sender: '汤燕',
        text: '我觉得这个概念很有意思，可以分享一下我的理解吗？'
      },
      { 
        sender: '杨依林',
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
          
          studentCount.value = 7; // 将学生数量固定为35
          onlineCount.value = 7; // 将在线人数设置为35
        } else {
          ElMessage.error(response.message || '获取课程信息失败');
        }
      } catch (error) {
        console.error('获取课程信息失败:', error);
        ElMessage.error('获取课程信息失败，请稍后重试');
      }
    };

    // WebSocket连接和通信
    const connectWebSocket = () => {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsHost = process.env.VUE_APP_WS_HOST || window.location.hostname;
      const wsPort = process.env.VUE_APP_WS_PORT || '8765';
      const wsUrl = `${wsProtocol}//${wsHost}:${wsPort}`;
      
      console.log(`正在连接到 WebSocket 服务器: ${wsUrl}`);
      
      websocket = new WebSocket(wsUrl);
      
      websocket.onopen = () => {
        console.log('WebSocket 连接已建立');
        wsConnected.value = true;
      };
      
      websocket.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          
          // 处理错误
          if (response.error) {
            console.error('WebSocket 错误:', response.error);
            return;
          }
          
          // 处理服务器发送的处理后的帧
          if (response.processed_frame) {
            processedFrame.value = response.processed_frame;
            faceCount.value = response.face_count || 0;
            
            // 更新检测到的学生列表
            if (response.students_detected) {
              const newDetected = new Set([...detectedStudents.value, ...response.students_detected]);
              detectedStudents.value = Array.from(newDetected);
            }
            
            // 全局已识别学生列表（服务器端维护）
            if (response.all_recognized_students) {
              detectedStudents.value = response.all_recognized_students;
            }
            
            // 更新情绪统计数据（如果有）
            if (response.emotion_stats) {
              emotionStats.value = response.emotion_stats;
              
              // 如果情绪分析对话框是打开的，则更新图表
              if (emotionAnalysisVisible.value && emotionChartInstance.value) {
                updateEmotionChart();
              }
            }
          }
          
          // 处理心跳响应
          if (response.type === 'pong') {
            console.log('收到服务器心跳响应');
          }
        } catch (error) {
          console.error('处理 WebSocket 消息时出错:', error);
        }
      };
      
      websocket.onclose = () => {
        console.log('WebSocket 连接已关闭');
        wsConnected.value = false;
        
        // 尝试重新连接
        setTimeout(() => {
          if (cameraActive.value) {
            connectWebSocket();
          }
        }, 5000);
      };
      
      websocket.onerror = (error) => {
        console.error('WebSocket 错误:', error);
        wsConnected.value = false;
      };
    };
    
    // 发送视频帧到WebSocket服务器
    const sendVideoFrame = () => {
      if (!websocket || websocket.readyState !== WebSocket.OPEN || !videoRef.value) {
        return;
      }
      
      try {
        const video = videoRef.value;
        const canvas = document.createElement('canvas');
        // 降低分辨率以减少数据量
        canvas.width = 480;  // 降低分辨率
        canvas.height = 360;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // 压缩图像，大幅降低质量以减少数据量
        const imageData = canvas.toDataURL('image/jpeg', 0.5);
        const base64Data = imageData.split(',')[1];
        
        // 发送到服务器
        websocket.send(JSON.stringify({
          type: 'video_frame',
          data: base64Data
        }));
      } catch (error) {
        console.error('发送视频帧时出错:', error);
      }
    };
    
    // 重置会话
    const resetSession = () => {
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify({
          type: 'reset'
        }));
        
        detectedStudents.value = [];
        emotionStats.value = null;
        ElMessage.success('会话已重置');
      }
    };
    
    // 心跳检测
    const sendPing = () => {
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify({ type: 'ping' }));
      }
    };

    // 开启摄像头
    const startCamera = async () => {
      try {
        // 指定更低的视频分辨率
        const constraints = {
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            frameRate: { ideal: 30 }
          },
          audio: false
        };
        
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!stream) {
          ElMessage.error('无法获取摄像头流');
          return;
        }
        console.log('摄像头流获取成功:', stream);
        videoRef.value.srcObject = stream;
        cameraActive.value = true;
        
        // 连接 WebSocket
        connectWebSocket();
        
        // 设置定时器，提高每秒发送帧数
        if (frameProcessingInterval) {
          clearInterval(frameProcessingInterval);
        }
        // 每40毫秒发送一帧，约等于25fps
        frameProcessingInterval = setInterval(sendVideoFrame, 40);
        
        // 设置心跳检测
        setInterval(sendPing, 30000); // 每30秒发送一次心跳
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
      
      // 关闭 WebSocket
      if (websocket) {
        websocket.close();
        websocket = null;
      }
      
      // 清除定时器
      if (frameProcessingInterval) {
        clearInterval(frameProcessingInterval);
        frameProcessingInterval = null;
      }
      
      // 清除处理后的帧
      processedFrame.value = '';
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
        const courseTimeId = localStorage.getItem('currentCourseTimeId');
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
            name: record.name || record.staff_id || '未知',
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
        // 处理 403 Forbidden 错误，提供更明确的错误信息
        if (error.code === 403 || (error.response && error.response.status === 403)) {
          ElMessage.error('您没有权限执行点名操作，请联系管理员');
        } else if (error.message && error.message.includes('403')) {
          ElMessage.error('点名失败：权限不足，请联系管理员');
        } else {
          ElMessage.error(error.message || '点名失败，请稍后重试');
        }
        
        // 测试模式下使用模拟数据
        if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
          console.log('开发环境下使用模拟数据');
          handleClosePreview();
          
          // 创建模拟点名结果
          const mockResult = {
            message: '测试模式：已生成考勤记录，出席人数：7，缺席人数：1',
            attendance_records: [
              { name: '李乐', present: true, confidence: 0.85 },
              { name: '陈文伟', present: true, confidence: 0.78 },
              { name: '杨依林', present: true, confidence: 0.76 },
              { name: '宋嘉怡', present: true, confidence: 0.45 },
              { name: '马莉岚', present: true, confidence: 0.45 },
              { name: '谢宛桐', present: true, confidence: 0.45 },
              { name: '汤燕', present: true, confidence: 0.45 },
              { name: '问思祺', present: false, confidence: 0.45 }
            ]
          };
          
          attendanceResult.value = mockResult;
          attendanceResultVisible.value = true;
          ElMessage.success('测试模式：点名完成');
        }
      } finally {
        uploadLoading.value = false;
      }
    };
    
    // 创建情绪分析图表
    const createEmotionChart = () => {
      if (!overallEmotionChart.value) {
        return;
      }
      
      // 如果已存在实例，先销毁
      if (emotionChartInstance.value) {
        emotionChartInstance.value.dispose();
      }
      
      // 创建新实例
      emotionChartInstance.value = echarts.init(overallEmotionChart.value);
      updateEmotionChart();
    };
    
    // 更新情绪图表数据
    const updateEmotionChart = () => {
      if (!emotionChartInstance.value || !emotionStats.value) {
        return;
      }
      
      const overallPercentages = emotionStats.value.overall_percentages || {};
      
      // 准备数据
      const data = Object.entries(overallPercentages).map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(1))
      }));
      
      // 设置图表选项
      const option = {
        title: {
          text: '班级情绪分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}%'
        },
        legend: {
          orient: 'horizontal',
          bottom: 'bottom'
        },
        series: [
          {
            name: '情绪分布',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: '{b}: {c}%'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: true
            },
            data: data
          }
        ],
        color: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#B983FF', '#FF6B6B']
      };
      
      // 应用选项
      emotionChartInstance.value.setOption(option);
    };
    
    // 获取学生情绪状态
    const getStudentEmotion = (studentName) => {
      if (!emotionStats.value || !emotionStats.value.student_emotions) {
        return null;
      }
      
      const studentData = emotionStats.value.student_emotions[studentName];
      return studentData ? studentData.current_status : null;
    };
    
    // 获取情绪标签类型
    const getEmotionTagType = (emotion) => {
      if (!emotion) return 'info';
      
      const types = {
        'Focused': 'success',
        'Confused': 'warning',
        'Distracted': 'danger',
        'Head Down': 'danger',
        'Turning LEFT': 'warning',
        'Turning RIGHT': 'warning',
        'No Face Detected': 'info'
      };
      
      return types[emotion] || 'info';
    };
    
    // 获取情绪颜色
    const getEmotionColor = (emotion) => {
      const colors = {
        'Focused': '#67C23A',
        'Confused': '#E6A23C',
        'Distracted': '#F56C6C',
        'Head Down': '#F56C6C',
        'Turning LEFT': '#909399',
        'Turning RIGHT': '#909399',
        'No Face Detected': '#909399'
      };
      
      return colors[emotion] || '#909399';
    };
    
    // 获取专注度颜色
    const getFocusColor = (percentage) => {
      if (percentage >= 80) return '#67C23A';
      if (percentage >= 60) return '#E6A23C';
      return '#F56C6C';
    };
    
    // 百分比格式化
    const percentFormat = (percentage) => {
      return `${percentage}%`;
    };
    
    // 开始录制
    const startRecording = () => {
      if (!cameraActive.value) {
        ElMessage.warning('请先开启摄像头');
        return;
      }
      
      try {
        const video = videoRef.value;
        const stream = video.srcObject;
        
        // 创建MediaRecorder实例
        const options = { mimeType: 'video/webm;codecs=vp9' };
        mediaRecorder.value = new MediaRecorder(stream, options);
        
        // 当有新数据可用时添加到recordedChunks
        mediaRecorder.value.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunks.value.push(event.data);
          }
        };
        
        // 录制结束时的处理
        mediaRecorder.value.onstop = () => {
          // 创建Blob对象
          recordingBlob.value = new Blob(recordedChunks.value, {
            type: 'video/webm'
          });
          
          // 显示保存录像确认框
          showSaveRecordingConfirm();
          
          // 清空录制数据，以便下次录制
          recordedChunks.value = [];
        };
        
        // 开始录制
        mediaRecorder.value.start(1000); // 每秒保存一次数据
        isRecording.value = true;
        ElMessage.success('录制已开始');
      } catch (error) {
        console.error('开始录制失败:', error);
        ElMessage.error('开始录制失败: ' + error.message);
      }
    };
    
    // 停止录制
    const stopRecording = () => {
      if (mediaRecorder.value && isRecording.value) {
        mediaRecorder.value.stop();
        isRecording.value = false;
        ElMessage.info('录制已停止');
      }
    };
    
    // 显示保存录像确认框
    const showSaveRecordingConfirm = () => {
      if (!recordingBlob.value) {
        ElMessage.error('没有可用的录像数据');
        return;
      }
      
      ElMessageBox.confirm(
        '是否保存录像？',
        '录制完成',
        {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          type: 'info',
        }
      )
        .then(() => {
          uploadRecording();
        })
        .catch(() => {
          ElMessage.info('已取消保存录像');
          recordingBlob.value = null;
        });
    };
    
    // 上传录像
    const uploadRecording = async () => {
      if (!recordingBlob.value) {
        ElMessage.error('没有可用的录像数据');
        return;
      }
      
      const courseTimeId = localStorage.getItem('currentCourseTimeId');
      console.log('课程时间ID:', courseTimeId);
      if (!courseTimeId) {
        ElMessage.error('未找到当前课程信息，无法上传录像');
        return;
      }
      
      try {
        uploadingRecording.value = true;
        
        // 创建文件对象
        const fileName = `recording_${courseTimeId}_${new Date().getTime()}.webm`;
        const recordingFile = new File([recordingBlob.value], fileName, { type: 'video/webm' });
        
        // 调用API上传录像
        const response = await api.uploadCourseRecording(courseTimeId, recordingFile);
        
        if (response.code === 200) {
          ElMessage.success('录像上传成功');
          
          // 上传成功后，发送录像进行情绪识别分析
          try {
            ElMessage.info('正在处理视频进行情绪识别分析，这可能需要一些时间...');
            console.log('传递给情绪识别API的参数 - 课程时间ID:', courseTimeId, '文件:', recordingFile);
            const emotionResponse = await api.processEmotionRecognition(recordingFile, courseTimeId);
            
            if (emotionResponse.code === 200) {
              ElMessage.success('情绪识别分析完成');
              console.log('情绪识别分析结果:', emotionResponse.data);
            } else {
              ElMessage.warning('情绪识别分析处理失败: ' + emotionResponse.message);
            }
          } catch (emotionError) {
            console.error('情绪识别处理失败:', emotionError);
            ElMessage.warning('情绪识别处理失败，但课程录像已保存');
          }
          
          recordingBlob.value = null;
        } else {
          ElMessage.error(response.message || '录像上传失败');
        }
      } catch (error) {
        console.error('上传录像失败:', error);
        ElMessage.error('上传录像失败: ' + error.message);
      } finally {
        uploadingRecording.value = false;
      }
    };

    // 组件挂载时
    onMounted(() => {
      // 获取课程详情
      fetchCourseDetail();
      
      // 监听窗口大小变化，重新渲染图表
      window.addEventListener('resize', () => {
        if (emotionChartInstance.value) {
          emotionChartInstance.value.resize();
        }
      });
    });
    
    // 监听情绪分析对话框
    watch(emotionAnalysisVisible, (newVal) => {
      if (newVal) {
        // 等待DOM更新后初始化图表
        setTimeout(() => {
          createEmotionChart();
        }, 300);
      }
    });

    // 组件卸载时
    onUnmounted(() => {
      // 如果还在录制，停止录制
      if (isRecording.value && mediaRecorder.value) {
        try {
          mediaRecorder.value.stop();
        } catch (e) {
          console.error('停止录制失败:', e);
        }
      }
      
      // 关闭摄像头
      stopCamera();
      
      // 销毁图表实例
      if (emotionChartInstance.value) {
        emotionChartInstance.value.dispose();
      }
      
      // 移除窗口大小变化监听
      window.removeEventListener('resize', () => {});
    });

    // 结束授课
    const endClass = () => {
      // 如果还在录制，先停止录制并上传
      if (isRecording.value) {
        ElMessageBox.confirm(
          '您当前正在录制课程，结束授课前需要停止录制并保存录像。是否继续？',
          '停止录制并结束授课',
          {
            confirmButtonText: '停止录制并结束授课',
            cancelButtonText: '取消',
            type: 'warning',
          }
        ).then(() => {
          stopRecording();
          // 给媒体录制器一些时间来完成停止过程
          setTimeout(() => {
            if (recordingBlob.value) {
              // 自动上传录像
              uploadRecording().then(() => {
                // 上传完成后结束课程
                finishClass();
              }).catch((error) => {
                console.error('上传录像失败:', error);
                ElMessage.warning('录像上传失败，但仍会结束课程');
                finishClass();
              });
            } else {
              finishClass();
            }
          }, 1000);
        }).catch(() => {
          // 用户取消操作
        });
        return;
      }
      
      // 如果没有在录制，直接确认结束课程
      ElMessageBox.confirm(
        '确定要结束当前授课吗？',
        '结束授课',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        finishClass();
      }).catch(() => {
        // 用户取消操作
      });
    };
    
    // 实际结束课程的函数
    const finishClass = async () => {
      // 关闭摄像头和WebSocket
      stopCamera();
      
      try {
        // 获取当前课程时间ID
        const courseTimeId = localStorage.getItem('currentCourseTimeId');
        if (courseTimeId) {
          // 调用结束上课API
          const endClassRes = await api.endClass(courseTimeId);
          if (endClassRes.code === 200) {
            ElMessage.success('已成功结束授课');
            // 清除localStorage中的课程时间ID
            localStorage.removeItem('currentCourseTimeId');
            // 跳转到StartClass页面而不是dashboard
            router.push('/startclass');
          } else {
            ElMessage.error(endClassRes.message || '结束授课失败');
          }
        } else {
          ElMessage.warning('未找到当前课程信息');
          // 跳转到StartClass页面
          router.push('/startclass');
        }
      } catch (error) {
        console.error('结束授课失败:', error);
        ElMessage.error('结束授课失败，请稍后重试');
        // 跳转到StartClass页面
        router.push('/startclass');
      }
    };

    return {
      // 基本信息
      courseName,
      courseLocation,
      courseTeacher,
      studentCount,
      onlineCount,
      chatMessage,
      studentList,
      chatMessages,
      searchQuery,
      filteredStudentList,
      
      // 视频和WebSocket
      videoRef,
      cameraActive,
      toggleCamera,
      processedFrame,
      faceCount,
      wsConnected,
      detectedStudents,
      
      // 点名相关
      captureImage,
      previewVisible,
      previewImage,
      handleClosePreview,
      handleConfirmUpload,
      uploadLoading,
      attendanceResultVisible,
      attendanceResult,
      
      // 情绪分析
      emotionAnalysisVisible,
      overallEmotionChart,
      emotionStats,
      dominantEmotion,
      focusRate,
      studentsEmotionData,
      getStudentEmotion,
      getEmotionTagType,
      getEmotionColor,
      getFocusColor,
      percentFormat,
      
      // 录制相关
      isRecording,
      startRecording,
      stopRecording,
      uploadingRecording,
      
      // 其他
      endClass,
      finishClass,
      resetSession
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

.processed-frame-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
}

.processed-frame {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.video-overlay {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  color: #fff;
}

.face-stats {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
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
  transition: background-color 0.3s;
}

.student-item.student-detected {
  background-color: #f0f9eb;
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

/* 情绪分析样式 */
.emotion-analysis {
  padding: 20px;
}

.emotion-overview {
  margin-bottom: 30px;
}

.emotion-overview h4,
.students-emotion-list h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  font-size: 16px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.chart-container {
  height: 300px;
  width: 100%;
}

.emotion-stats {
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
}

.stat-card {
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-title {
  font-size: 14px;
  color: #666;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stat-value.emotion-tag {
  font-size: 14px;
}

.emotion-distribution {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.emotion-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.emotion-label {
  min-width: 100px;
  font-size: 13px;
  color: #606266;
}

.emotion-history {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.history-tag {
  margin-right: 0;
}

.empty-list {
  padding: 30px;
  text-align: center;
  color: #909399;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.empty-list i {
  font-size: 24px;
}

.connection-status {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 8px 15px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  z-index: 1000;
  transition: all 0.3s ease;
}

.connection-status.connected {
  background-color: rgba(103, 194, 58, 0.8);
  color: white;
}

.connection-status.disconnected {
  background-color: rgba(245, 108, 108, 0.8);
  color: white;
}

.ml-5 {
  margin-left: 5px;
}
</style> 