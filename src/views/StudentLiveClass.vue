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
            <el-button type="primary" size="default" icon="el-icon-microphone">麦克风</el-button>
            <el-button type="primary" size="default" icon="el-icon-video-camera">摄像头</el-button>
            <el-button type="primary" size="default" icon="el-icon-hand">举手提问</el-button>
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
            <div class="student-item" v-for="(name, i) in studentNames" :key="i">
              <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="学生头像" class="student-avatar">
              <div class="student-info">
                <span class="student-name">{{ name }}</span>
                <el-tag size="mini" type="success">在线</el-tag>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-panel">
          <div class="panel-header">
            <h3>课堂互动</h3>
          </div>
          <div class="chat-messages" ref="chatMessagesContainer">
            <div class="message-item" v-for="message in chatMessages" :key="message.id">
              <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="头像" class="message-avatar">
              <div class="message-content">
                <div class="message-header">
                  <span class="message-sender">{{ message.sender }}</span>
                  <span class="message-time">{{ message.time }}</span>
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
              @keyup.enter.native="sendMessage"
            ></el-input>
            <el-button type="primary" icon="el-icon-s-promotion" @click="sendMessage">发送</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import api from '@/api';  // 只保留这一个api导入

export default {
  name: 'StudentLiveClass',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const courseId = ref(null);
    const courseName = ref('');
    const courseLocation = ref('');
    const courseTeacher = ref('');
    const studentCount = ref(0);
    const chatMessage = ref('');
    const chatMessages = ref([]);
    const chatMessagesContainer = ref(null);
    const studentNames = ref([
      '张某某',
      '韩某某',
      '杨某某',
      '李某某',
      '王某某'
    ]);

    // 添加消息ID集合用于去重
    const receivedMessageIds = new Set();
    const pollInterval = ref(null);
    const lastMessageTime = ref(new Date().toISOString());
    let isLeavingPage = false;

    // 滚动到最新消息
    const scrollToBottom = () => {
      if (chatMessagesContainer.value) {
        setTimeout(() => {
          chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight;
        }, 100);
      }
    };

    // 监听消息列表变化，自动滚动到底部
    watch(() => chatMessages.value.length, () => {
      scrollToBottom();
    });

    // 开始轮询
    const startPolling = () => {
      // 清除已存在的轮询
      if (pollInterval.value) {
        clearInterval(pollInterval.value);
      }

      // 开始新的轮询
      const poll = async () => {
        if (!courseId.value || isLeavingPage) return;

        try {
          const response = await api.getChatMessages(courseId.value, lastMessageTime.value);
          if (response && Array.isArray(response) && response.length > 0) {
            // 过滤出新消息
            const newMessages = response.filter(msg => !receivedMessageIds.has(msg.id));
            
            if (newMessages.length > 0) {
              // 更新最后消息时间为最新消息的时间
              lastMessageTime.value = newMessages[newMessages.length - 1].timestamp;
              
              // 添加新消息到列表并记录ID
              newMessages.forEach(msg => {
                receivedMessageIds.add(msg.id);
                chatMessages.value.push({
                  id: msg.id,
                  sender: msg.sender_name,
                  text: msg.text,
                  time: msg.timestamp,
                  is_read: msg.is_read
                });
              });
              
              // 标记新消息为已读
              const unreadNewMessages = newMessages.filter(msg => !msg.is_read);
              if (unreadNewMessages.length > 0) {
                await markAsRead(unreadNewMessages);
              }
            }
          }
        } catch (error) {
          console.error('轮询消息失败:', error);
        }
      };

      // 每3秒轮询一次
      pollInterval.value = setInterval(poll, 3000);
      
      // 立即执行一次
      poll();
    };

    // 发送消息
    const sendMessage = async () => {
      if (!chatMessage.value.trim()) return;

      try {
        const response = await api.sendChatMessage(courseId.value, chatMessage.value);
        
        // 确保不重复添加消息
        if (!receivedMessageIds.has(response.id)) {
          receivedMessageIds.add(response.id);
          chatMessages.value.push({
            id: response.id,
            sender: response.sender_name,
            text: response.text,
            time: response.timestamp,
            is_read: true
          });
        }
        
        // 更新最后消息时间
        lastMessageTime.value = response.timestamp;
        
        // 清空输入框
        chatMessage.value = '';
      } catch (error) {
        console.error('发送消息失败:', error);
        ElMessage.error('发送消息失败，请重试');
      }
    };

    // 标记消息为已读
    const markAsRead = async (messages) => {
      try {
        const messageIds = messages.map(msg => msg.id);
        await api.markMessagesAsRead(messageIds);
      } catch (error) {
        console.error('标记消息已读失败:', error);
      }
    };

    // 清理函数
    const cleanup = () => {
      if (pollInterval.value) {
        clearInterval(pollInterval.value);
        pollInterval.value = null;
      }
      chatMessages.value = [];
      receivedMessageIds.clear();
      lastMessageTime.value = new Date().toISOString();
    };

    // 监听路由参数变化
    watch(() => route.params.id, (newId) => {
      if (newId && !isLeavingPage) {
        courseId.value = parseInt(newId);
        cleanup();
        startPolling();
      }
    }, { immediate: true });

    // 监听路由离开
    router.beforeEach((to, from, next) => {
      if (from.path.includes('/student-live-class')) {
        isLeavingPage = true;
        cleanup();
      }
      next();
    });

    // 组件卸载时清理
    onBeforeUnmount(() => {
      isLeavingPage = true;
      cleanup();
    });

    // 修改获取课程详情方法
    const fetchCourseDetail = async () => {
      try {
        if (!courseId.value) {
          ElMessage.error('课程ID不存在');
          router.push('/student/courses');  // 导航到课程列表
          return;
        }

        const response = await api.getCourseDetail(courseId.value);
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
        } else {
          ElMessage.error(response.message || '获取课程信息失败');
        }
      } catch (error) {
        console.error('获取课程信息失败:', error);
        ElMessage.error('获取课程信息失败，请稍后重试');
      }
    };

    // 检查未读消息
    const checkUnreadMessages = async () => {
      try {
        const response = await api.getUnreadMessageCount(courseId.value);
        if (response && response.data) {
          unreadMessageCount.value = response.data.unread_count;
        }
      } catch (error) {
        console.error('获取未读消息数量失败:', error);
      }
    };

    // 在组件挂载时获取课程详情
    onMounted(async () => {
      const routeCourseId = route.params.id;
      if (routeCourseId) {
        courseId.value = parseInt(routeCourseId);
        await fetchCourseDetail();
        startPolling();
      } else {
        ElMessage.error('课程ID不存在');
        router.push('/student/courses');
      }
    });

    // 在 setup() 函数中重新添加必要的响应式变量
    const unreadMessageCount = ref(0);

    // 修改 return 语句，确保只返回需要的变量
    return {
      courseName,
      courseLocation,
      courseTeacher,
      studentCount,
      chatMessage,
      chatMessages,
      chatMessagesContainer,
      studentNames,
      sendMessage,
      // 只返回实际使用的变量
      unreadMessageCount
    };
  }
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