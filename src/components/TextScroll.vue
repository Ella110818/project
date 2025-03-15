<template>
  <div ref="containerRef" class="text-scroll-container" :class="[`text-scroll--${props.type}`]">
    <div class="left-icon">
      <i class="iconfont-sys"><el-icon><Bell /></el-icon></i>
    </div>
    <div class="scroll-wrapper">
      <div
        class="text-scroll-content"
        :class="{ scrolling: shouldScroll }"
        :style="scrollStyle"
        ref="scrollContent"
      >
        <div class="scroll-item">
          <div class="announcement-title">{{ props.title }}</div>
          <div class="announcement-content">{{ props.content }}</div>
        </div>
        <div class="scroll-item">
          <div class="announcement-title">{{ props.title }}</div>
          <div class="announcement-content">{{ props.content }}</div>
        </div>
      </div>
    </div>
    <div class="right-icon" @click="handleRightIconClick" v-if="showClose">
      <i class="iconfont-sys">&#xe83a;</i>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useElementHover } from '@vueuse/core'
import { useRoute } from 'vue-router'

const emit = defineEmits(['close'])
const route = useRoute()

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  speed: {
    type: Number,
    default: 70
  },
  direction: {
    type: String,
    default: 'left'
  },
  type: {
    type: String,
    default: 'default'
  },
  showClose: {
    type: Boolean,
    default: false
  },
  typewriter: {
    type: Boolean,
    default: false
  },
  typewriterSpeed: {
    type: Number,
    default: 100
  }
})

// 状态管理
const containerRef = ref(null)
const isHovered = useElementHover(containerRef)
const scrollContent = ref(null)
const animationDuration = ref(0)

// 打字机效果相关
const currentText = ref('')
let typewriterTimer = null
const isTypewriterComplete = ref(false)

// 计算属性
const shouldScroll = computed(() => {
  if (props.typewriter) {
    return !isHovered.value && isTypewriterComplete.value
  }
  return !isHovered.value
})

const sanitizedContent = computed(() => (props.typewriter ? currentText.value : props.content))

const scrollStyle = computed(() => ({
  '--animation-duration': `${animationDuration.value}s`,
  '--animation-play-state': shouldScroll.value ? 'running' : 'paused',
  '--animation-direction': props.direction === 'left' ? 'normal' : 'reverse'
}))

// 计算动画持续时间
const calculateDuration = () => {
  if (scrollContent.value) {
    const contentWidth = scrollContent.value.scrollWidth / 2
    console.log('Content Width:', contentWidth) // 打印内容宽度
    animationDuration.value = contentWidth / props.speed
  }
}

// 初始化滚动效果
const initializeScrollEffect = () => {
  calculateDuration()
  window.addEventListener('resize', calculateDuration)

  if (props.typewriter) {
    startTypewriter()
  }
}

// 处理右图标点击事件
const handleRightIconClick = () => {
  emit('close')
}

// 打字机效果
const startTypewriter = () => {
  let index = 0
  currentText.value = ''
  isTypewriterComplete.value = false

  const type = () => {
    if (index < props.content.length) {
      currentText.value += props.content[index]
      index++
      typewriterTimer = setTimeout(type, props.typewriterSpeed)
    } else {
      isTypewriterComplete.value = true
    }
  }

  type()
}

// 生命周期钩子
onMounted(() => {
  initializeScrollEffect()
})

// onUnmounted(() => {
//   window.removeEventListener('resize', calculateDuration)
//   if (typewriterTimer) {
//     clearTimeout(typewriterTimer)
//   }
// })
onMounted(() => {
  calculateDuration();
  window.addEventListener('resize', calculateDuration);
});

onUnmounted(() => {
  window.removeEventListener('resize', calculateDuration);
});

// 监听路由变化
watch(
  () => route.path,
  async () => {
    await nextTick() // 等待 DOM 更新
    initializeScrollEffect() // 重新初始化滚动效果
  }
)

// 监听文本变化
watch(
  () => props.content,
  () => {
    if (props.typewriter) {
      if (typewriterTimer) {
        clearTimeout(typewriterTimer)
      }
      startTypewriter()
    }
  }
)
</script>
<style scoped lang="scss">
.text-scroll-container {
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  padding-right: 16px;
  overflow: hidden;
  background-color: var(--el-color-primary-light-9) !important;
  border: 1px solid var(--main-color);
  border-radius: calc(var(--custom-radius) / 2 + 2px) !important;
  height: 60px; // 增加高度以适应两行文本

  .left-icon,
  .right-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    width: 40px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    background-color: var(--el-color-primary-light-9) !important;

    i {
      color: var(--main-color);
    }
  }

  .left-icon {
    left: 0;
  }

  .right-icon {
    right: 0;
    cursor: pointer;
    background-color: transparent !important;
  }

  .scroll-wrapper {
    flex: 1;
    margin-left: 34px;
    overflow: hidden;
  }

  .text-scroll-content {
    display: flex;
    height: 60px;
    white-space: nowrap;
    animation: scroll linear infinite;
    animation-duration: var(--animation-duration);
    animation-play-state: var(--animation-play-state);
    animation-direction: var(--animation-direction);

    .scroll-item {
      display: inline-block;
      min-width: 200%;
      padding: 5px 10px;
      font-size: 14px;
      text-align: left;

      .announcement-title {
        font-size: 15px;
        font-weight: 500;
        margin-bottom: 4px;
      }

      .announcement-content {
        font-size: 14px;
        opacity: 0.8;
      }
    }
  }

  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  // 类型样式
  &.text-scroll--default {
    background-color: var(--el-color-primary-light-9) !important;
    border-color: var(--el-color-primary);

    .left-icon i {
      color: var(--el-color-primary) !important;
    }

    .scroll-item {
      .announcement-title {
        color: var(--el-color-primary);
      }
      .announcement-content {
        color: var(--el-color-primary);
      }
    }
  }

  &.text-scroll--success {
    background-color: var(--el-color-success-light-9) !important;
    border-color: var(--el-color-success);

    .left-icon {
      background-color: var(--el-color-success-light-9) !important;

      i {
        color: var(--el-color-success);
      }
    }

    .scroll-item {
      .announcement-title {
        color: var(--el-color-success);
      }
      .announcement-content {
        color: var(--el-color-success);
      }
    }
  }

  &.text-scroll--warning {
    background-color: var(--el-color-warning-light-9) !important;
    border-color: var(--el-color-warning);

    .left-icon {
      background-color: var(--el-color-warning-light-9) !important;

      i {
        color: var(--el-color-warning);
      }
    }

    .scroll-item {
      .announcement-title {
        color: var(--el-color-warning);
      }
      .announcement-content {
        color: var(--el-color-warning);
      }
    }
  }

  &.text-scroll--danger {
    background-color: var(--el-color-danger-light-9) !important;
    border-color: var(--el-color-danger);

    .left-icon {
      background-color: var(--el-color-danger-light-9) !important;

      i {
        color: var(--el-color-danger);
      }
    }

    .scroll-item {
      .announcement-title {
        color: var(--el-color-danger);
      }
      .announcement-content {
        color: var(--el-color-danger);
      }
    }
  }

  &.text-scroll--info {
    background-color: var(--el-color-info-light-9) !important;
    border-color: var(--el-color-info);

    .left-icon {
      background-color: var(--el-color-info-light-9) !important;

      i {
        color: var(--el-color-info);
      }
    }

    .scroll-item {
      .announcement-title {
        color: var(--el-color-info);
      }
      .announcement-content {
        color: var(--el-color-info);
      }
    }
  }
}

// 打字机效果的光标样式
.text-scroll-content .scroll-item {
  &::after {
    content: '|';
    opacity: 0;
    animation: cursor 1s infinite;
  }
}

@keyframes cursor {
  0%,
  100% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }
}
</style>