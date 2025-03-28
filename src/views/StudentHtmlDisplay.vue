<template>
  <div class="display-container">
    <iframe 
      :src="'/student/Student.html'" 
      frameborder="0" 
      style="width: 100%; height: 100vh; border: none;"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'StudentHtmlDisplay'
}
</script>

<style scoped>
.display-container {
  position: fixed;
  top: 63px; /* 导航栏高度 */
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto; /* 改为auto，允许滚动 */
  background-color: #0b1834; /* 添加背景色，与内容一致 */
}

.display-container iframe {
  width: 100%;
  min-height: 100%;
  border: none;
  display: block; /* 防止iframe底部有间隙 */
}
</style>