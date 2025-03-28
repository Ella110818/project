<template>
  <div class="test-container">
    <h2>DataV 测试</h2>
    
    <div class="test-item">
      <h3>自定义CSS实现</h3>
      <div class="custom-decoration">
        <div class="decoration-line"></div>
        <div class="decoration-dot"></div>
        <div class="decoration-line"></div>
      </div>
    </div>
    
    <div class="test-item">
      <h3>datav-vue3 组件测试</h3>
      <!-- 根据文档正确使用组件 -->
      <div>标准用法：<dv-decoration-2 style="width:200px;height:5px;" /></div>
      <div>添加属性：<dv-decoration-2 :dur="2" style="width:200px;height:5px;" /></div>
      <div>垂直方向：<dv-decoration-2 :reverse="true" style="width:5px;height:150px;" /></div>
    </div>

    <div class="test-item">
      <h3>dv-decoration-10 测试</h3>
      <div style="background:#000;padding:20px;">
        <dv-decoration-10 style="width:90%;height:5px;" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestDatav'
}
</script>

<style scoped>
.test-container {
  padding: 20px;
  background: #f0f0f0;
  min-height: 100vh;
}

.test-item {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
}

.custom-decoration {
  width: 200px;
  height: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin: 20px 0;
}

.decoration-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, 
    rgba(0, 183, 255, 0.1),
    rgba(0, 183, 255, 0.7) 50%,
    rgba(0, 183, 255, 0.1)
  );
  animation: glow 1.5s ease-in-out infinite alternate;
}

.decoration-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00b7ff;
  box-shadow: 0 0 8px #00b7ff;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes glow {
  from {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
}
</style> 