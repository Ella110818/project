<template>
  <div class="live-class-container">
    <div class="class-header">
      <div class="class-info">
        <h1>{{ courseName }}</h1>
        <div class="course-details">
          <span class="detail-item"><i class="el-icon-location"></i> {{ courseLocation }}</span>
          <span class="detail-item"><i class="el-icon-user"></i> {{ courseTeacher }}</span>
          <span class="detail-item"><i class="el-icon-user-solid"></i> {{ studentCount }}人</span>
          <span class="live-badge">实时授课中</span>
        </div>
      </div>
    </div>

    <div class="class-content">
      <div class="main-content">
        <div class="video-container">
          <div class="video-placeholder">
            <i class="el-icon-video-camera"></i>
            <h3>视频画面</h3>
            <p>教师实时授课视频流将在此处显示</p>
          </div>
        </div>

        <div class="control-panel">
          <el-button-group>
            <el-button type="primary" size="medium" icon="el-icon-microphone">麦克风</el-button>
            <el-button type="primary" size="medium" icon="el-icon-video-camera">摄像头</el-button>
            <el-button type="primary" size="medium" icon="el-icon-hand">举手提问</el-button>
          </el-button-group>
        </div>
      </div>

      <div class="interaction-panel">
        <div class="student-list">
          <div class="panel-header">
            <h3>在线学生 ({{ studentCount }})</h3>
            <el-input 
              placeholder="搜索学生" 
              prefix-icon="el-icon-search" 
              size="small"
              style="width: 150px;"
            ></el-input>
          </div>
          <div class="student-items">
            <div class="student-item" v-for="i in 5" :key="i">
              <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="学生头像" class="student-avatar">
              <div class="student-info">
                <span class="student-name">学生{{ i }}</span>
                <el-tag size="mini" type="success">在线</el-tag>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-panel">
          <div class="panel-header">
            <h3>课堂互动</h3>
          </div>
          <div class="chat-messages">
            <div class="message-item" v-for="i in 3" :key="i">
              <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="头像" class="message-avatar">
              <div class="message-content">
                <div class="message-header">
                  <span class="message-sender">学生{{ i }}</span>
                  <span class="message-time">{{ new Date().toLocaleTimeString() }}</span>
                </div>
                <p class="message-text">这是一条课堂互动消息，学生可以在这里提问或回答问题。</p>
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
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

export default {
  name: 'StudentLiveClass',
  setup() {
    const router = useRouter();
    const courseName = ref('');
    const courseLocation = ref('');
    const courseTeacher = ref('');
    const studentCount = ref(0);
    const chatMessage = ref('');

    onMounted(() => {
      // 从localStorage获取课程信息
      courseName.value = localStorage.getItem('currentCourseName') || '未知课程';
      courseLocation.value = localStorage.getItem('currentCourseLocation') || '未知位置';
      courseTeacher.value = localStorage.getItem('currentCourseTeacher') || '未知教师';
      studentCount.value = localStorage.getItem('currentCourseStudentCount') || 0;
    });

    return {
      courseName,
      courseLocation,
      courseTeacher,
      studentCount,
      chatMessage,
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
}

.video-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #909399;
}

.video-placeholder i {
  font-size: 48px;
  margin-bottom: 10px;
}

.video-placeholder h3 {
  margin: 0 0 10px 0;
}

.video-placeholder p {
  margin: 0;
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
</style> 