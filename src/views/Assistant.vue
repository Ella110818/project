<template>
  <div class="assistant-container">
    <div class="bg-image-container">
      <img src="~@/assets/背景10.jpg" alt="背景图片" class="bg-image" />
      <div class="overlay"></div>
    </div>
    
    <div class="content-wrapper">
      <!-- 聊天界面 -->
      <div class="chat-container">
        <div class="chat-decoration" small-bg>
          <dv-decoration-8 style="width:300px;height:50px;" />
        </div>
        <!-- 聊天记录 -->
        <div class="chat-messages" ref="messageContainer">
          <div v-for="(message, index) in messages" :key="index" :class="['message', message.type]">
            <div class="avatar">
              <el-avatar :size="40" :src="message.type === 'user' ? userAvatar : assistantAvatar" />
              <span class="name">{{ message.type === 'user' ? '用户' : '智能助手' }}</span>
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
          </div>

          <!-- 输入框 -->
          <div class="chat-input">
            <el-input
              v-model="inputMessage"
              type="textarea"
              :rows="3"
              placeholder="请输入指令..."
              @keyup.enter="sendMessage"
              resize="none"
              :maxlength="500"
            />
            <el-button type="primary" @click="sendMessage" :disabled="!inputMessage.trim()" class="send-btn">
              发送
            </el-button>
          </div>
        </div>
      </div>

      <!-- 右侧功能区 -->
      <div class="features-panel">
        <div class="feature-card" demo-bg>
          <dv-border-box-12>
            <div class="card-content" dv-bg>
              <div class="card-header">
                <div class="title-container">
                  <span class="card-title">系统功能</span>
                  <div small-bg class="title-decoration">
                    <dv-decoration-3 style="width:180px;height:30px;" />
                  </div>
                </div>
              </div>
              <div class="feature-list">
                <div 
                  v-for="feature in features" 
                  :key="feature.id"
                  @click="useFeature(feature)"
                  class="feature-item"
                >
                  {{ feature.name }}
                </div>
              </div>
            </div>
          </dv-border-box-12>
        </div>

        <div class="history-card" demo-bg>
          <dv-border-box-12>
            <div class="card-content" dv-bg>
              <div class="card-header">
                <div class="title-container">
                  <span class="card-title">会话记录</span>
                  <div small-bg class="title-decoration">
                    <dv-decoration-3 style="width:180px;height:30px;" />
                  </div>
                </div>
              </div>
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
            </div>
          </dv-border-box-12>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { Check, Picture, Document, Microphone, SmileFilled } from '@element-plus/icons-vue';
import { BorderBox12 as DvBorderBox12, Decoration3 as DvDecoration3, Decoration8 as DvDecoration8 } from '@kjgl77/datav-vue3';

const inputMessage = ref('');
const messageContainer = ref(null);

const userAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';
const assistantAvatar = require('@/assets/机器人.png');

const messages = ref([
  {
    type: 'assistant',
    content: '你好！我是你的智能学习助手。我可以帮你解答课程相关的问题，提供学习建议，或者帮你规划学习计划。请问有什么我可以帮你的吗？',
    time: getCurrentTime(),
    status: 'delivered'
  }
]);

const features = ref([
  { id: 1, name: '课程答疑' },
  { id: 2, name: '学习建议' },
  { id: 3, name: '作业指导' },
  { id: 4, name: '考试复习' },
  { id: 5, name: '学习计划' },
  { id: 6, name: '资料推荐' }
]);

const chatHistory = ref([
  { id: 1, title: '课程答疑 - 脑机接口', time: '2025-03-15' },
  { id: 2, title: '学习计划制定', time: '2025-03-14' },
  { id: 3, title: '考试复习指导', time: '2025-03-13' }
]);

function getCurrentTime() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

function sendMessage() {
  if (!inputMessage.value.trim()) return;

  // 添加用户消息
  const userMessage = {
    type: 'user',
    content: inputMessage.value,
    time: getCurrentTime(),
    status: 'sent'
  };
  messages.value.push(userMessage);

  // 模拟消息发送成功
  setTimeout(() => {
    userMessage.status = 'delivered';
  }, 500);

  // 模拟助手正在输入
  const typingMessage = {
    type: 'assistant',
    content: '正在思考...',
    time: getCurrentTime(),
    isTyping: true
  };
  setTimeout(() => {
    messages.value.push(typingMessage);
    scrollToBottom();

    // 模拟助手回复
    setTimeout(() => {
      const index = messages.value.indexOf(typingMessage);
      if (index > -1) {
        messages.value.splice(index, 1);
      }
      messages.value.push({
        type: 'assistant',
        content: '我理解你的问题。让我思考一下...',
        time: getCurrentTime(),
        status: 'delivered'
      });
      scrollToBottom();
    }, 2000);
  }, 1000);

  inputMessage.value = '';
  nextTick(() => {
    scrollToBottom();
  });
}

function scrollToBottom() {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
}

function useFeature(feature) {
  inputMessage.value = `请帮我${feature.name}`;
}

function loadHistory(history) {
  console.log('加载历史对话:', history);
}
</script>

<style scoped>
.assistant-container {
  height: 100%;
  position: relative;
  color: #67C2FF;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0 40px;
}

.content-wrapper {
  display: flex;
  gap: 20px;
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
}

.bg-image-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(11, 24, 52, 0.3), rgba(22, 41, 86, 0.3));
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(11, 24, 52, 0.5);
  border-radius: 0;
  box-shadow: 0 0 15px rgba(103, 194, 255, 0.3);
  border: 1px solid rgba(103, 194, 255, 0.3);
  backdrop-filter: blur(10px);
  padding: 15px;
  position: relative;
  overflow: hidden;
  margin: 0;
}

.chat-decoration {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}

.chat-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(to right, transparent, #67C2FF, transparent);
  opacity: 0.8;
}

.chat-messages {
  flex: 1;
  padding: 10px;
  padding-top: 45px;
  overflow-y: auto;
}

.message {
  display: flex;
  margin-bottom: 12px;
  gap: 8px;
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
  gap: 2px;
}

.avatar :deep(.el-avatar) {
  width: 36px;
  height: 36px;
}

.name {
  font-size: 11px;
  color: #8CC5FF;
}

.message-content {
  max-width: 60%;
}

.message.user .message-content {
  align-items: flex-end;
}

.message-text {
  padding: 10px 14px;
  border-radius: 8px;
  background: rgba(11, 32, 68, 0.6);
  border: 1px solid rgba(103, 194, 255, 0.2);
  line-height: 1.5;
  position: relative;
  box-shadow: 0 0 10px rgba(103, 194, 255, 0.1);
  color: #ffffff;
  word-break: break-word;
  font-size: 16px;
  text-align: left;
}

.message.assistant .message-text {
  border-bottom-left-radius: 0;
  border-left: 2px solid #FFB366;
}

.message.user .message-text {
  border-bottom-right-radius: 0;
  border-right: 2px solid #FF9966;
  color: #ffffff;
}

.message-info {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
}

.message-time {
  font-size: 11px;
  color: #8CC5FF;
}

.message-status {
  display: flex;
  align-items: center;
}

.status-icon {
  font-size: 12px;
  color: #8CC5FF;
}

.status-icon.delivered {
  color: #67FF7C;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background: #67C2FF;
  border-radius: 50%;
  animation: typing 1s infinite;
  box-shadow: 0 0 5px #67C2FF;
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
  border-top: 1px solid rgba(103, 194, 255, 0.3);
  padding: 8px 15px;
}

.toolbar {
  display: flex;
  gap: 8px;
  padding: 4px 0;
  border-bottom: 1px solid rgba(103, 194, 255, 0.2);
  margin-bottom: 8px;
}

.tool-btn {
  padding: 8px;
  font-size: 18px;
  background: transparent;
  transition: all 0.3s;
  border: none;
}

/* 图片上传按钮 */
.tool-btn:nth-child(1) {
  color: #FF9966;
  border: 1px solid #FF9966;
}

.tool-btn:nth-child(1):hover {
  color: #fff;
  background: rgba(255, 153, 102, 0.2);
  box-shadow: 0 0 10px rgba(255, 153, 102, 0.5);
}

/* 文件按钮 */
.tool-btn:nth-child(2) {
  color: #FFB366;
  border: 1px solid #FFB366;
}

.tool-btn:nth-child(2):hover {
  color: #fff;
  background: rgba(255, 179, 102, 0.2);
  box-shadow: 0 0 10px rgba(255, 179, 102, 0.5);
}

/* 录音按钮 */
.tool-btn:nth-child(3) {
  color: #FFCC66;
  border: 1px solid #FFCC66;
}

.tool-btn:nth-child(3):hover {
  color: #fff;
  background: rgba(255, 204, 102, 0.2);
  box-shadow: 0 0 10px rgba(255, 204, 102, 0.5);
}

.chat-input {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.send-btn {
  padding: 8px 16px;
  background: linear-gradient(135deg, #FF9966, #FFB366);
  border: 1px solid #FFB366;
  color: #fff;
  box-shadow: 0 0 10px rgba(255, 179, 102, 0.3);
  transition: all 0.3s;
}

.send-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #FFB366, #FF9966);
  box-shadow: 0 0 15px rgba(255, 179, 102, 0.5);
  transform: translateY(-2px);
}

.send-btn:disabled {
  opacity: 0.5;
  background: linear-gradient(135deg, #8B6B5D, #A68069);
  border-color: rgba(255, 179, 102, 0.2);
}

:deep(.el-textarea__inner) {
  resize: none;
  border-radius: 8px;
  padding: 12px;
  line-height: 1.6;
  font-size: 14px;
  background: rgba(11, 32, 68, 0.3);
  border: 1px solid rgba(103, 194, 255, 0.3);
  color: #67C2FF;
}

:deep(.el-textarea__inner::placeholder) {
  color: rgba(103, 194, 255, 0.7);
}

:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 10px rgba(103, 194, 255, 0.3);
  border-color: #67C2FF;
}

.chat-input :deep(.el-textarea__count) {
  visibility: hidden !important;
}

/* 自定义滚动条样式 */
.chat-messages {
  scrollbar-width: thin;
  scrollbar-color: #67C2FF rgba(11, 32, 68, 0.5);
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(11, 32, 68, 0.5);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(103, 194, 255, 0.5);
  border-radius: 3px;
  box-shadow: 0 0 5px rgba(103, 194, 255, 0.2);
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(103, 194, 255, 0.7);
}

.features-panel {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-right: 5px;
}

/* DataV 边框样式 */
.feature-card, .history-card {
  height: 48%;
  position: relative;
  margin: 0;
  padding: 0;
}

[demo-bg] {
  background-color: rgba(11, 24, 52, 0.3);
}

[dv-bg] {
  width: 100%;
  height: 100%;
  background-color: rgba(11, 32, 68, 0.3);
  padding: 12px;
  box-sizing: border-box;
}

.card-content {
  color: #67C2FF;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  padding-bottom: 5px;
  align-items: flex-start;
  padding-left: 0px;
  width: 100%;
  text-align: left;
}

.title-container {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.title-decoration {
  position: absolute;
  right: 0;
  top: -6px;
}

[small-bg] {
  background-color: transparent;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #67C2FF;
  margin-bottom: 5px;
  text-shadow: 0 0 10px rgba(103, 194, 255, 0.3);
  text-align: left;
  margin-right: auto;
  position: relative;
  left: 5px;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.feature-item {
  padding: 8px;
  background: rgba(21, 41, 88, 0.5);
  border: 1px solid rgba(103, 194, 255, 0.3);
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  color: #ffffff;
  font-size: 13px;
}

.feature-item:hover {
  background: rgba(103, 194, 255, 0.2);
  box-shadow: 0 0 10px rgba(103, 194, 255, 0.4);
  transform: translateY(-2px);
  color: #ffffff;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(21, 41, 88, 0.5);
  border: 1px solid rgba(103, 194, 255, 0.2);
  font-size: 13px;
}

.history-item:hover {
  background: rgba(103, 194, 255, 0.2);
  box-shadow: 0 0 10px rgba(103, 194, 255, 0.4);
  transform: translateY(-2px);
}

.history-title {
  font-size: 13px;
  color: #ffffff;
}

.history-time {
  font-size: 11px;
  color: #ffffff;
}

/* 媒体查询适配平板和手机 */
@media (max-width: 1200px) {
  .assistant-container {
    flex-direction: column;
  }
  
  .features-panel {
    width: 100%;
    flex-direction: row;
  }
  
  .feature-card, .history-card {
    height: 100%;
  }
}

@media (max-width: 768px) {
  .features-panel {
    flex-direction: column;
  }
  
  .feature-list {
    grid-template-columns: 1fr;
  }
}
</style> 