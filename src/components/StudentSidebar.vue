<template>
  <div class="sidebar-container">
    <!-- 知微课研标题栏 -->
    <div class="sidebar-header">
      <i class="el-icon-school"></i>
      <span>知微课研</span>
    </div>

    <!-- 导航菜单 -->
    <el-menu
      default-active="1" 
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-menu-item index="1" @click="navigateTo('/myclass')">
        <i class="el-icon-notebook-2"></i>
        <span>我的课程</span>
      </el-menu-item>
      <el-menu-item index="2" @click="navigateTo('/assignments')">
        <i class="el-icon-edit-outline"></i>
        <span>作业/考试</span>
      </el-menu-item>
      <el-menu-item index="3" @click="navigateTo('/grades')">
        <i class="el-icon-data-line"></i>
        <span>我的成绩</span>
      </el-menu-item>
      <el-menu-item index="4" @click="navigateTo('/message')">
        <i class="el-icon-message"></i>
        <span>消息</span>
      </el-menu-item>
      <el-menu-item index="5" class="smart-assistant" @click="navigateTo('/assistant')">
        <i class="el-icon-message"></i>
        <span>智能助手</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  methods: {
    handleOpen(key, keyPath) {
      console.log('open', key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log('close', key, keyPath);
    },
    navigateTo(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style scoped>
.sidebar-container {
  width: 200px;
  height: 100vh;
  border-right: 1px solid #e6e6e6;
  float: left;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #409eff;
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.sidebar-header i {
  margin-right: 8px;
}

.el-menu-vertical-demo {
  border-right: none;
  flex: 1;
}

.smart-assistant {
  margin-top: auto;
  background-color: #f5f7fa;
}

.smart-assistant:hover {
  background-color: #e6e6e6;
}
</style> 