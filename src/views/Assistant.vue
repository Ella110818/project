<template>
  <div class="assistant-container">
    <!-- 聊天界面 -->
    <div class="chat-container">
      <!-- 聊天记录 -->
      <div class="chat-messages" ref="messageContainer">
        <div v-for="(message, index) in messages" :key="index" :class="['message', message.type]">
          <div class="avatar">
            <el-avatar :size="40" :src="message.type === 'user' ? userAvatar : assistantAvatar" />
            <span class="name">{{ message.type === 'user' ? '我' : '智能助手' }}</span>
          </div>
          <div class="message-content">
            <div class="message-text" :class="{ 'typing': message.isTyping }">
              {{ message.content }}
              <div v-if="message.isTyping" class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div class="message-info">
              <span class="message-time">{{ message.time }}</span>
              <span v-if="message.type === 'user'" class="message-status">
                <el-icon v-if="message.status === 'sent'" class="status-icon"><Check /></el-icon>
                <el-icon v-else-if="message.status === 'delivered'" class="status-icon delivered"><Check /><Check /></el-icon>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入框区域 -->
      <div class="input-area">
        <!-- 工具栏 -->
        <div class="toolbar">
          <el-tooltip content="上传图片" placement="top">
            <el-button class="tool-btn" circle>
              <el-icon><Picture /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="发送文件" placement="top">
            <el-button class="tool-btn" circle>
              <el-icon><Document /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="录音" placement="top">
            <el-button class="tool-btn" circle>
              <el-icon><Microphone /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="表情" placement="top">
            <el-button class="tool-btn" circle>
              <el-icon><SmileFilled /></el-icon>
            </el-button>
          </el-tooltip>
        </div>

        <!-- 输入框 -->
        <div class="chat-input">
          <el-input
            v-model="inputMessage"
            type="textarea"
            :rows="3"
            placeholder="请输入您的问题..."
            @keyup.enter="sendMessage"
            resize="none"
            :maxlength="500"
            show-word-limit
          />
          <el-button type="primary" @click="sendMessage" :disabled="!inputMessage.trim()" class="send-btn">
            发送
          </el-button>
        </div>
      </div>
    </div>

    <!-- 右侧功能区 -->
    <div class="features-panel">
      <el-card class="feature-card">
        <template #header>
          <div class="card-header">
            <span>常用功能</span>
          </div>
        </template>
        <div class="feature-list">
          <el-button 
            v-for="feature in features" 
            :key="feature.id"
            @click="useFeature(feature)"
            plain
          >
            {{ feature.name }}
          </el-button>
        </div>
      </el-card>

      <el-card class="history-card">
        <template #header>
          <div class="card-header">
            <span>历史记录</span>
          </div>
        </template>
        <div class="history-list">
          <div 
            v-for="history in chatHistory" 
            :key="history.id" 
            class="history-item"
            @click="loadHistory(history)"
          >
            <span class="history-title">{{ history.title }}</span>
            <span class="history-time">{{ history.time }}</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { Check, Picture, Document, Microphone, SmileFilled } from '@element-plus/icons-vue'

export default {
  name: 'Assistant',
  components: {
    Check,
    Picture,
    Document,
    Microphone,
    SmileFilled
  },
  data() {
    return {
      inputMessage: '',
      messages: [
        {
          type: 'assistant',
          content: '你好！我是你的智能学习助手。我可以帮你解答课程相关的问题，提供学习建议，或者帮你规划学习计划。请问有什么我可以帮你的吗？',
          time: this.getCurrentTime(),
          status: 'delivered'
        }
      ],
      userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      assistantAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      features: [
        { id: 1, name: '课程答疑' },
        { id: 2, name: '学习建议' },
        { id: 3, name: '作业指导' },
        { id: 4, name: '考试复习' },
        { id: 5, name: '学习计划' },
        { id: 6, name: '资料推荐' }
      ],
      chatHistory: [
        { id: 1, title: '课程答疑 - 脑机接口', time: '2024-03-15' },
        { id: 2, title: '学习计划制定', time: '2024-03-14' },
        { id: 3, title: '考试复习指导', time: '2024-03-13' }
      ]
    }
  },
  methods: {
    getCurrentTime() {
      const now = new Date();
      return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    },
    sendMessage() {
      if (!this.inputMessage.trim()) return;

      // 添加用户消息
      const userMessage = {
        type: 'user',
        content: this.inputMessage,
        time: this.getCurrentTime(),
        status: 'sent'
      };
      this.messages.push(userMessage);

      // 模拟消息发送成功
      setTimeout(() => {
        userMessage.status = 'delivered';
      }, 500);

      // 模拟助手正在输入
      const typingMessage = {
        type: 'assistant',
        content: '正在思考...',
        time: this.getCurrentTime(),
        isTyping: true
      };
      setTimeout(() => {
        this.messages.push(typingMessage);
        this.scrollToBottom();

        // 模拟助手回复
        setTimeout(() => {
          const index = this.messages.indexOf(typingMessage);
          if (index > -1) {
            this.messages.splice(index, 1);
          }
          this.messages.push({
            type: 'assistant',
            content: '我理解你的问题。让我思考一下...',
            time: this.getCurrentTime(),
            status: 'delivered'
          });
          this.scrollToBottom();
        }, 2000);
      }, 1000);

      this.inputMessage = '';
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    scrollToBottom() {
      const container = this.$refs.messageContainer;
      container.scrollTop = container.scrollHeight;
    },
    useFeature(feature) {
      this.inputMessage = `请帮我${feature.name}`;
    },
    loadHistory(history) {
      console.log('加载历史对话:', history);
    }
  }
}
</script>

<style scoped>
.assistant-container {
  height: calc(100vh - 120px);
  display: flex;
  gap: 20px;
  padding: 20px;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.chat-messages {
  flex: 1;
  padding: 20px;
  padding-bottom: 10px;
  overflow-y: auto;
}

.message {
  display: flex;
  margin-bottom: 16px;
  gap: 12px;
  opacity: 0;
  transform: translateY(20px);
  animation: messageAppear 0.3s ease forwards;
}

@keyframes messageAppear {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  flex-direction: row-reverse;
}

.avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.name {
  font-size: 12px;
  color: #909399;
}

.message-content {
  max-width: 70%;
}

.message.user .message-content {
  align-items: flex-end;
}

.message-text {
  padding: 12px 16px;
  border-radius: 12px;
  background: #f4f4f5;
  line-height: 1.6;
  position: relative;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.message.assistant .message-text {
  border-bottom-left-radius: 4px;
}

.message.user .message-text {
  background: #ecf5ff;
  color: #409eff;
  border-bottom-right-radius: 4px;
}

.message-info {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.message-time {
  font-size: 12px;
  color: #909399;
}

.message-status {
  display: flex;
  align-items: center;
}

.status-icon {
  font-size: 12px;
  color: #909399;
}

.status-icon.delivered {
  color: #67C23A;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background: #409eff;
  border-radius: 50%;
  animation: typing 1s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.input-area {
  border-top: 1px solid #ebeef5;
  padding: 8px 20px 12px;
}

.toolbar {
  display: flex;
  gap: 8px;
  padding: 4px 0;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 8px;
}

.tool-btn {
  padding: 8px;
  font-size: 18px;
  color: #606266;
  transition: all 0.3s;
}

.tool-btn:hover {
  color: #409eff;
  background: #ecf5ff;
}

.chat-input {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.send-btn {
  padding: 12px 24px;
}

:deep(.el-textarea__inner) {
  resize: none;
  border-radius: 8px;
  padding: 12px;
  line-height: 1.6;
  font-size: 14px;
}

:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 2px rgba(64,158,255,0.1);
}

/* 自定义滚动条样式 */
.chat-messages {
  scrollbar-width: thin;
  scrollbar-color: #909399 #f4f4f5;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f4f4f5;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #909399;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #606266;
}

.features-panel {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-card, .history-card {
  flex: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.history-item:hover {
  background: #f5f7fa;
}

.history-title {
  font-size: 14px;
  color: #606266;
}

.history-time {
  font-size: 12px;
  color: #909399;
}
</style> 