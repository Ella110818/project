<template>
  <div class="display-container">
    <iframe 
      :src="'/teacher/Teacher.html'" 
      frameborder="0" 
      class="display-frame"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'TeacherHtmlDisplay'
}
</script>

<style scoped>
.display-container {
  position: fixed;
  top: 63px; /* 导航栏高度 */
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.display-container iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.display-frame {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}
</style> 