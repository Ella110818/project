<template>
  <div class="assistant-container">
    <div class="bg-image-container">
      <img src="~@/assets/背景10.png" alt="背景图片" class="bg-image" />
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
                <span v-if="message.hasReasoning" class="reasoning-btn" @click="toggleReasoning(message)">
                  <el-button type="text" size="small">
                    {{ message.showReasoning ? '隐藏思考过程' : '查看思考过程' }}
                  </el-button>
                </span>
              </div>
              <!-- 思考过程展示区域 -->
              <div v-if="message.hasReasoning && message.showReasoning" class="reasoning-content">
                <div class="reasoning-text">{{ message.reasoning }}</div>
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
                  <span class="card-title">知识库</span>
                  <div small-bg class="title-decoration">
                    <dv-decoration-3 style="width:180px;height:30px;" />
                  </div>
                </div>
              </div>
              <div class="history-list knowledge-list">
                <div v-if="knowledgeBase.length === 0" class="empty-knowledge">
                  暂无本地知识库数据
                </div>
                <div 
                  v-for="item in knowledgeBase" 
                  :key="item.id" 
                  class="history-item knowledge-item"
                  @click="useKnowledge(item)"
                >
                  <span class="history-title knowledge-title">{{ item.question }}</span>
                  <span class="history-time knowledge-category">{{ item.category }}</span>
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
import { Check, Picture, Document, Microphone } from '@element-plus/icons-vue';
import { BorderBox12 as DvBorderBox12, Decoration3 as DvDecoration3, Decoration8 as DvDecoration8 } from '@kjgl77/datav-vue3';
import axios from 'axios';
import assistantAvatar from '@/assets/机器人.png';

const inputMessage = ref('');
const messageContainer = ref(null);

const userAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';

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

// 本地知识库
const knowledgeBase = ref([
  { 
    id: 1, 
    question: '什么是脑机接口？', 
    answer: '脑机接口(BCI)是一种能够在大脑和外部设备之间建立直接通信渠道的技术，无需传统的外围神经和肌肉介入。它可以将大脑的神经信号转换成控制指令，用于控制外部设备或软件应用。',
    keywords: ['脑机接口', 'BCI', '神经', '大脑', '控制'],
    category: '课程概念'
  },
  { 
    id: 2, 
    question: '脑机接口有哪些类型？', 
    answer: '脑机接口主要分为侵入式和非侵入式两大类。侵入式BCI需要手术植入电极，直接采集脑神经元活动，信噪比高但有风险；非侵入式BCI通过头皮表面电极采集信号（如EEG），安全但信号质量较低。另外还有半侵入式BCI，将电极置于硬脑膜上。',
    keywords: ['脑机接口', '类型', '侵入式', '非侵入式', 'EEG'],
    category: '课程分类'
  },
  { 
    id: 3, 
    question: '脑机接口的主要应用领域有哪些？', 
    answer: '脑机接口的主要应用领域包括：1）医疗康复：帮助瘫痪患者控制假肢或通信设备；2）游戏娱乐：通过意念控制游戏；3）智能控制：意念控制智能家居；4）认知增强：监测和提升注意力水平；5）军事与航天：增强飞行员和宇航员的能力；6）脑功能研究：探索大脑工作机制。',
    keywords: ['脑机接口', '应用', '医疗', '康复', '游戏', '控制'],
    category: '应用领域'
  },
  { 
    id: 4, 
    question: '学习脑机接口需要哪些基础知识？', 
    answer: '学习脑机接口需要多学科知识基础：1）神经科学基础：了解大脑结构和功能；2）电子工程：信号采集与处理；3）计算机科学：机器学习和数据分析；4）生物医学工程：生物兼容性和临床实验设计；5）数学基础：信号处理和统计分析。',
    keywords: ['脑机接口', '学习', '基础', '神经科学', '计算机', '工程'],
    category: '学习指南'
  },
  { 
    id: 5, 
    question: '如何制定脑机接口学习计划？', 
    answer: '制定脑机接口学习计划：1）打好基础：学习神经科学入门课程、信号处理和机器学习基础；2）实践技能：使用OpenBCI等开源硬件平台进行实验；3）项目实践：参与小型脑机接口项目，如意念控制小游戏；4）深入学习：研究特定领域如运动想象BCI、P300拼写器等；5）跟踪前沿：阅读IEEE、Nature BME等期刊最新研究。',
    keywords: ['学习计划', '脑机接口', '学习', '规划', '课程'],
    category: '学习计划'
  }
]);

// 快速响应库 - 常见问题的预加载回复
const quickResponses = {
  '你好': '你好！很高兴为您服务。请问有什么我可以帮助您的吗？',
  '你是谁': '我是智能学习助手，可以回答您关于学习的各种问题。',
  '谢谢': '不客气！如果还有其他问题，随时可以问我。',
  '再见': '再见！祝您学习愉快！',
  '学习建议': '良好的学习习惯很重要，建议您制定合理的学习计划，保持规律的作息，多做练习题巩固知识点。',
  '考试复习': '考试复习建议：1. 整理知识点 2. 做真题模拟 3. 找出薄弱环节重点攻克 4. 保持良好心态',
  '学习计划': '高效学习计划应包括：清晰的学习目标、每日固定学习时间、适当休息、定期回顾、自我检测等环节。'
};

const chatHistory = ref([
  { id: 1, title: '课程答疑 - 脑机接口', time: '2025-03-15' },
  { id: 2, title: '学习计划制定', time: '2025-03-14' },
  { id: 3, title: '考试复习指导', time: '2025-03-13' }
]);

function getCurrentTime() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

// 知识库管理函数 - 添加新知识
function addKnowledge(question, answer, keywords, category) {
  const id = knowledgeBase.value.length > 0 ? 
    Math.max(...knowledgeBase.value.map(item => item.id)) + 1 : 1;
  
  knowledgeBase.value.push({
    id,
    question,
    answer,
    keywords,
    category
  });
  
  // 保存到本地存储
  saveKnowledgeBase();
}

// 从本地存储加载知识库
function loadKnowledgeBase() {
  const savedKnowledge = localStorage.getItem('zwky_knowledge_base');
  if (savedKnowledge) {
    try {
      knowledgeBase.value = JSON.parse(savedKnowledge);
      console.log('成功加载本地知识库，共', knowledgeBase.value.length, '条记录');
    } catch (e) {
      console.error('加载知识库失败:', e);
    }
  }
}

// 保存知识库到本地存储
function saveKnowledgeBase() {
  try {
    localStorage.setItem('zwky_knowledge_base', JSON.stringify(knowledgeBase.value));
    console.log('知识库已保存到本地存储');
  } catch (e) {
    console.error('保存知识库失败:', e);
  }
}

// 在组件挂载时加载知识库
onMounted(() => {
  loadKnowledgeBase();
});

// 文本相似度计算函数 (简化版TF-IDF)
function calculateSimilarity(query, text) {
  query = query.toLowerCase();
  text = text.toLowerCase();
  
  // 移除标点符号并分词
  const queryWords = query.replace(/[.,?!;:""]/g, '').split(/\s+/);
  const textWords = text.replace(/[.,?!;:""]/g, '').split(/\s+/);
  
  // 计算共有词数
  const commonWords = queryWords.filter(word => textWords.includes(word));
  
  // 简单相似度计算：共有词数 / 查询词数
  return commonWords.length / queryWords.length;
}

// 搜索知识库并返回最匹配的回答
function searchKnowledgeBase(query) {
  // 清理查询文本
  query = query.trim();
  if (!query) return null;
  
  let bestMatch = null;
  let highestSimilarity = 0.3; // 设置相似度阈值
  
  // 首先检查是否有精确匹配的问题
  const exactMatch = knowledgeBase.value.find(item => 
    item.question.toLowerCase() === query.toLowerCase()
  );
  
  if (exactMatch) return exactMatch;
  
  // 检查关键词匹配
  const keywordMatch = knowledgeBase.value.find(item => 
    item.keywords.some(keyword => query.toLowerCase().includes(keyword.toLowerCase()))
  );
  
  if (keywordMatch) {
    const keywordSimilarity = calculateSimilarity(query, keywordMatch.question);
    if (keywordSimilarity > highestSimilarity) {
      bestMatch = keywordMatch;
      highestSimilarity = keywordSimilarity;
    }
  }
  
  // 检查文本相似度
  knowledgeBase.value.forEach(item => {
    const questionSimilarity = calculateSimilarity(query, item.question);
    if (questionSimilarity > highestSimilarity) {
      bestMatch = item;
      highestSimilarity = questionSimilarity;
    }
  });
  
  return bestMatch;
}

async function sendMessage(retryCount = 0) {
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
  }, 300);

  // 保存用户输入并清空输入框
  const userInput = inputMessage.value;
  inputMessage.value = '';

  // 首先检查知识库是否有匹配的回答
  const knowledgeMatch = searchKnowledgeBase(userInput);
  
  if (knowledgeMatch) {
    handleKnowledgeBaseResponse(knowledgeMatch);
    return;
  }

  // 检查是否有预加载响应
  const exactMatch = quickResponses[userInput.trim()];
  const fuzzyMatch = Object.keys(quickResponses).find(key => 
    userInput.toLowerCase().includes(key.toLowerCase())
  );
  
  if (exactMatch || fuzzyMatch) {
    handleQuickResponse(exactMatch || quickResponses[fuzzyMatch]);
    return;
  }

  // 添加正在输入的提示
  const typingMessage = {
    type: 'assistant',
    content: '正在思考...',
    time: getCurrentTime(),
    isTyping: true
  };
  messages.value.push(typingMessage);
  scrollToBottom();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2分钟超时

    const response = await axios.post('/api/ai/chat/', {
      message: userInput
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      withCredentials: true,
      signal: controller.signal,
      onDownloadProgress: (progressEvent) => {
        // 如果服务器支持流式响应，这里可以处理部分响应
        if (progressEvent.event.target.responseText) {
          try {
            const partialData = JSON.parse(progressEvent.event.target.responseText);
            updateTypingMessage(typingMessage, partialData.content || '正在生成回答...');
          } catch (e) {
            // 解析错误说明响应尚未完成，忽略即可
          }
        }
      }
    });

    clearTimeout(timeoutId);

    // 移除输入中的提示
    const index = messages.value.indexOf(typingMessage);
    if (index > -1) {
      messages.value.splice(index, 1);
    }

    console.log('AI响应:', response.data);

    // 添加AI的回复
    const aiMessage = {
      type: 'assistant',
      content: response.data.content || '对不起，我无法理解您的问题',
      reasoning: response.data.reasoning,
      hasReasoning: response.data.has_reasoning,
      showReasoning: false,
      time: getCurrentTime(),
      status: 'delivered'
    };
    messages.value.push(aiMessage);
    
    // 处理知识库更新
    handleKnowledgeBaseUpdate(userInput, response.data);

  } catch (error) {
    console.error('AI请求错误:', error);
    
    // 移除输入中的提示
    const index = messages.value.indexOf(typingMessage);
    if (index > -1) {
      messages.value.splice(index, 1);
    }

    // 处理重试逻辑
    if (retryCount < 2 && (error.code === 'ECONNABORTED' || error.message.includes('timeout'))) {
      console.log(`尝试第 ${retryCount + 1} 次重试...`);
      messages.value.push({
        type: 'assistant',
        content: `网络请求超时，正在进行第 ${retryCount + 1} 次重试...`,
        time: getCurrentTime(),
        status: 'retrying'
      });
      
      // 延迟1秒后重试
      setTimeout(() => {
        sendMessage(retryCount + 1);
      }, 1000);
      return;
    }

    // 显示错误消息
    const errorMessage = error.response?.data?.error || error.message || '未知错误';
    const friendlyError = getFriendlyErrorMessage(errorMessage);
    
    messages.value.push({
      type: 'assistant',
      content: friendlyError,
      time: getCurrentTime(),
      status: 'error'
    });
  }

  nextTick(() => {
    scrollToBottom();
  });
}

// 处理知识库响应
function handleKnowledgeBaseResponse(knowledgeMatch) {
  const typingMessage = {
    type: 'assistant',
    content: '正在回复...',
    time: getCurrentTime(),
    isTyping: true
  };
  messages.value.push(typingMessage);
  scrollToBottom();
  
  setTimeout(() => {
    const index = messages.value.indexOf(typingMessage);
    if (index > -1) {
      messages.value.splice(index, 1);
    }
    
    messages.value.push({
      type: 'assistant',
      content: knowledgeMatch.answer,
      time: getCurrentTime(),
      status: 'delivered',
      fromKnowledgeBase: true
    });
    
    scrollToBottom();
  }, 500);
}

// 处理快速响应
function handleQuickResponse(response) {
  const typingMessage = {
    type: 'assistant',
    content: '正在回复...',
    time: getCurrentTime(),
    isTyping: true
  };
  messages.value.push(typingMessage);
  scrollToBottom();
  
  setTimeout(() => {
    const index = messages.value.indexOf(typingMessage);
    if (index > -1) {
      messages.value.splice(index, 1);
    }
    
    messages.value.push({
      type: 'assistant',
      content: response,
      time: getCurrentTime(),
      status: 'delivered'
    });
    
    scrollToBottom();
  }, 500);
}

// 更新打字消息
function updateTypingMessage(message, content) {
  if (messages.value.includes(message)) {
    message.content = content;
  }
}

// 获取友好的错误消息
function getFriendlyErrorMessage(error) {
  if (error.includes('timeout')) {
    return '抱歉，服务器响应时间过长。请稍后再试或尝试简化您的问题。';
  }
  if (error.includes('network')) {
    return '网络连接出现问题，请检查您的网络连接并重试。';
  }
  if (error.includes('rate limit')) {
    return '请求过于频繁，请稍等片刻后再试。';
  }
  return `抱歉，我遇到了一些问题：${error}`;
}

// 处理知识库更新
function handleKnowledgeBaseUpdate(userInput, responseData) {
  const shouldAddToKnowledgeBase = responseData.content && 
                                  responseData.content.length > 50 && 
                                  userInput.length > 10;
  
  if (shouldAddToKnowledgeBase) {
    const keywords = extractKeywords(userInput);
    const category = determineCategory(userInput);
    addKnowledge(userInput, responseData.content, keywords, category);
  }
}

// 提取关键词
function extractKeywords(text) {
  const words = text.toLowerCase().replace(/[.,?!;:""]/g, '').split(/\s+/);
  const stopWords = ['的', '是', '在', '了', '和', '与', '或', '什么', '如何', '为什么', '怎么', '有哪些'];
  return [...new Set(words.filter(word => word.length > 1 && !stopWords.includes(word)))].slice(0, 5);
}

// 确定分类
function determineCategory(text) {
  if (text.includes('学习') || text.includes('课程')) return '学习指南';
  if (text.includes('概念') || text.includes('是什么')) return '课程概念';
  if (text.includes('类型') || text.includes('分类')) return '课程分类';
  if (text.includes('应用') || text.includes('用途')) return '应用领域';
  return '其他';
}

function scrollToBottom() {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
}

function useFeature(feature) {
  inputMessage.value = `请帮我${feature.name}`;
}

function useKnowledge(item) {
  // 显示知识库内容
  messages.value.push({
    type: 'assistant',
    content: `问题: ${item.question}\n\n${item.answer}`,
    time: getCurrentTime(),
    status: 'delivered',
    fromKnowledgeBase: true
  });
  scrollToBottom();
}

function loadHistory(history) {
  console.log('加载历史对话:', history);
}

function toggleReasoning(message) {
  message.showReasoning = !message.showReasoning;
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
  transform: translateY(10px);
  animation: messageAppear 0.2s ease forwards;
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
  display: inline-flex;
  align-items: center;
  margin-left: 5px;
}

.typing-indicator span {
  width: 5px;
  height: 5px;
  margin: 0 1px;
  background-color: #67C2FF;
  border-radius: 50%;
  display: inline-block;
  opacity: 0.6;
  animation: typing 1s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-3px);
  }
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

.reasoning-btn {
  margin-left: 10px;
  cursor: pointer;
  color: #67C2FF;
}

.reasoning-content {
  margin-top: 10px;
  padding: 10px;
  background: rgba(11, 24, 52, 0.6);
  border-radius: 5px;
  border-left: 3px solid #67C2FF;
  font-size: 0.9em;
  color: #aac8dc;
}

.reasoning-text {
  white-space: pre-wrap;
  line-height: 1.5;
}

.empty-knowledge {
  text-align: center;
  padding: 10px;
  color: rgba(103, 194, 255, 0.6);
  font-style: italic;
  font-size: 13px;
}

.knowledge-list {
  max-height: 300px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #67C2FF rgba(11, 32, 68, 0.5);
}

.knowledge-list::-webkit-scrollbar {
  width: 4px;
}

.knowledge-list::-webkit-scrollbar-track {
  background: rgba(11, 32, 68, 0.5);
  border-radius: 2px;
}

.knowledge-list::-webkit-scrollbar-thumb {
  background: rgba(103, 194, 255, 0.5);
  border-radius: 2px;
}

.knowledge-item {
  border-left: 2px solid #67C2FF;
}

.knowledge-category {
  padding: 2px 4px;
  background: rgba(103, 194, 255, 0.2);
  border-radius: 3px;
  font-size: 10px;
}

.message-text.from-knowledge {
  border-left: 2px solid #67FF7C;
}
</style> 