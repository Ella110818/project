<!-- <template>
  <div class="container1">
    Message Content
  </div>
</template>

<script>
// 组件脚本内容
export default {
  name: 'Message',
  // 其他选项...
}
</script>

<style scoped>
.container1{
  background-color: #f5f5f5;
  width: 100%;
   width:1480px;
  height: 100vh;
}
</style> -->
<template>
  <div class="message-container">
    <!-- 左侧联系人列表 -->
    <div class="contact-list">
      <div class="contact-header">
        <div class="user-info">
          <el-avatar :size="50" :src="selectedPerson?.avatar" />
          <div class="user-details">
            <div class="name">{{ selectedPerson?.name }}</div>
            <div class="email">{{ selectedPerson?.email }}</div>
          </div>
        </div>
        <div class="search-box">
          <el-input v-model="searchQuery" placeholder="搜索联系人" prefix-icon="el-icon-search" clearable />
        </div>
        <el-dropdown trigger="click" placement="bottom-start">
          <span class="sort-btn">
            排序方式
            <el-icon class="el-icon--right">
              <i class="el-icon-arrow-down"></i>
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>按时间排序</el-dropdown-item>
              <el-dropdown-item>按名称排序</el-dropdown-item>
              <el-dropdown-item>全部标为已读</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <el-scrollbar>
        <div
          v-for="item in personList"
          :key="item.id"
          class="contact-item"
          :class="{ active: selectedPerson?.id === item.id }"
          @click="selectPerson(item)"
        >
          <div class="avatar-wrapper">
            <el-avatar :size="40" :src="item.avatar">
              {{ item.name.charAt(0) }}
            </el-avatar>
            <div class="status-dot" :class="{ online: item.online }"></div>
          </div>
          <div class="contact-info">
            <div class="info-top">
              <span class="contact-name">{{ item.name }}</span>
              <span class="last-time">{{ item.lastTime }}</span>
            </div>
            <div class="info-bottom">
              <span class="email">{{ item.email }}</span>
              <el-badge v-if="item.unread" :value="item.unread" class="unread-badge" />
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <!-- 右侧聊天区域 -->
    <div class="chat-area">
      <div class="chat-header">
        <div class="header-left">
          <span class="name">{{ selectedPerson?.name || '选择联系人' }}</span>
          <div class="status">
            <div class="dot" :class="{ online: selectedPerson?.online, offline: !selectedPerson?.online }"></div>
            <span class="status-text">{{ selectedPerson?.online ? '在线' : '离线' }}</span>
          </div>
        </div>
        <div class="header-right">
          <el-tooltip content="更多" placement="bottom">
            <el-button class="header-btn" circle>
              <el-icon><More /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="关闭" placement="bottom">
            <el-button class="header-btn" circle>
              <el-icon><Close /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="设置" placement="bottom">
            <el-button class="header-btn" circle>
              <el-icon><Setting /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </div>

      <!-- 聊天消息区域 -->
      <div class="chat-messages" ref="messageContainer">
        <div v-for="(message, index) in messages" :key="index" :class="['message', message.isMe ? 'message-right' : 'message-left']">
          <div class="avatar">
            <el-avatar :size="40" :src="message.avatar" />
            <span class="name">{{ message.sender }}</span>
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
              <span v-if="message.isMe" class="message-status">
                <el-icon v-if="message.status === 'sent'" class="status-icon"><Check /></el-icon>
                <el-icon v-else-if="message.status === 'delivered'" class="status-icon delivered"><Check /><Check /></el-icon>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
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
            v-model="messageText"
            type="textarea"
            :rows="3"
            placeholder="输入消息..."
            @keyup.enter="sendMessage"
            resize="none"
            :maxlength="500"
            show-word-limit
          />
          <el-button type="primary" @click="sendMessage" :disabled="!messageText.trim()" class="send-btn">
            发送
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { Check, Picture, Document, Microphone, SmileFilled, More, Close, Setting } from '@element-plus/icons-vue';

export default {
  name: 'Message',
  components: {
    Check,
    Picture,
    Document,
    Microphone,
    SmileFilled,
    More,
    Close,
    Setting
  },
  setup() {
    const searchQuery = ref('');
    const selectedPerson = ref(null);
    const messageText = ref('');
    const messageContainer = ref(null);
    const messageId = ref(3);

    const personList = ref([
      {
        id: 1,
        name: '小明',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        online: true,
        lastTime: '20小时前',
        unread: 0,
        email: 'xiaoming@example.com'
      },
      {
        id: 2,
        name: '小方',
        avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        online: true,
        lastTime: '2周前',
        unread: 6,
        email: 'xiaofang@example.com'
      }
    ]);

    const messages = ref([
      {
        id: 1,
        sender: 'Art Bot',
        content: '你好！我是你的AI助手，有什么我可以帮你的吗？',
        time: '10:00',
        isMe: false,
        avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        status: 'delivered'
      },
      {
        id: 2,
        sender: '我',
        content: '我想了解一下系统的使用方法。',
        time: '10:01',
        isMe: true,
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        status: 'delivered'
      }
    ]);

    const selectPerson = (person) => {
      selectedPerson.value = person;
    };

    const sendMessage = () => {
      const text = messageText.value.trim();
      if (!text) return;

      const newMessage = {
        id: messageId.value++,
        sender: '我',
        content: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        status: 'sent'
      };

      messages.value.push(newMessage);

      // 模拟消息发送成功
      setTimeout(() => {
        newMessage.status = 'delivered';
      }, 500);

      // 模拟对方正在输入
      setTimeout(() => {
        const typingMessage = {
          id: messageId.value++,
          sender: selectedPerson.value?.name || '对方',
          content: '正在输入...',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
          avatar: selectedPerson.value?.avatar,
          isTyping: true
        };
        messages.value.push(typingMessage);
        scrollToBottom();

        // 模拟对方回复
        setTimeout(() => {
          const index = messages.value.indexOf(typingMessage);
          if (index > -1) {
            messages.value.splice(index, 1);
          }
          messages.value.push({
            id: messageId.value++,
            sender: selectedPerson.value?.name || '对方',
            content: '好的，我明白了。',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: false,
            avatar: selectedPerson.value?.avatar,
            status: 'delivered'
          });
          scrollToBottom();
        }, 2000);
      }, 1000);

      messageText.value = '';
      scrollToBottom();
    };

    const scrollToBottom = () => {
      setTimeout(() => {
        if (messageContainer.value) {
          messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
        }
      }, 100);
    };

    onMounted(() => {
      scrollToBottom();
      selectedPerson.value = personList.value[0];
    });

    return {
      searchQuery,
      selectedPerson,
      personList,
      selectPerson,
      messageText,
      messages,
      sendMessage,
      messageContainer
    };
  }
};
</script>

<style lang="scss" scoped>
$device-ipad-pro: 1024px;
.message-container {
  height: calc(100vh - 120px);
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #f5f7fa;
}

.contact-list {
  width: 360px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.contact-header {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
}

.user-info {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.user-details {
  .name {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
  }

  .email {
    margin-top: 4px;
    font-size: 13px;
    color: #909399;
  }
}

.search-box {
  margin-bottom: 16px;
}

.sort-btn {
  cursor: pointer;
  color: #606266;
  font-size: 14px;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover,
  &.active {
    background: #f5f7fa;
  }

  .avatar-wrapper {
    position: relative;
    margin-right: 12px;

    .status-dot {
      position: absolute;
      right: 1px;
      bottom: 1px;
      width: 9px;
      height: 9px;
      background: #f56c6c;
      border-radius: 50%;
      border: 2px solid white;

      &.online {
        background: #67c23a;
      }
    }
  }

  .contact-info {
    flex: 1;
    min-width: 0;

    .info-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;

      .contact-name {
        font-size: 14px;
        font-weight: 500;
        color: #303133;
      }

      .last-time {
        font-size: 12px;
        color: #909399;
      }
    }

    .info-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .email {
        font-size: 12px;
        color: #909399;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

.chat-area {
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-left {
    .name {
      font-size: 16px;
      font-weight: 500;
      color: #303133;
    }

    .status {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 4px;

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;

        &.online {
          background: #67c23a;
        }

        &.offline {
          background: #909399;
        }
      }

      .status-text {
        font-size: 12px;
        color: #909399;
      }
    }
  }

  .header-right {
    display: flex;
    gap: 8px;

    .header-btn {
      padding: 8px;
      color: #606266;
      transition: all 0.3s;

      &:hover {
        color: #409eff;
        background: #ecf5ff;
      }
    }
  }
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

.message.message-right {
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

.message.message-right .message-content {
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

.message.message-right .message-text {
  background: #ecf5ff;
  color: #409eff;
  border-bottom-right-radius: 4px;
}

.message.message-left .message-text {
  border-bottom-left-radius: 4px;
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

@media only screen and (max-width: $device-ipad-pro) {
  .message-container {
    flex-direction: column;

    .contact-list {
      width: 100%;
      height: 170px;
      border-bottom: none;

      .contact-header {
        display: none;
      }
    }

    .chat-area {
      height: calc(70% - 30px);
    }
  }
}
</style>
