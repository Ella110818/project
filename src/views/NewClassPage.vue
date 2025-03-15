<template>
  <div class="new-class-page">
    <div class="form-card">
      <h2>选择课程和班级</h2>
      <el-form>
        <el-form-item label="课程">
          <el-input placeholder="与关于"></el-input>
          <el-button type="primary" plain>+ 添加</el-button>
        </el-form-item>
        <el-form-item label="班级">
          <el-input placeholder="脑机接口"></el-input>
          <el-button type="primary" plain>+ 添加</el-button>
        </el-form-item>
        <el-form-item label="标题">
          <el-input placeholder="3月12日授课" disabled></el-input>
        </el-form-item>
        <el-form-item label="课件">
          <el-input placeholder="选择课件">
            <template #prefix>
              <el-icon><FolderOpened /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button>取消</el-button>
          <el-button type="primary">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { FolderOpened } from '@element-plus/icons-vue';
</script>

<style scoped>
.new-class-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #0a1f44;
}

.form-card {
  background-color: #ffffff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 450px;
  max-width: 90%;
}

h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #2c3e50;
  text-align: center;
}

.el-form-item {
  margin-bottom: 25px;
}

.el-button {
  margin-left: 10px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.el-button:hover {
  background-color: #409eff;
  transform: translateY(-2px);
}

.el-input {
  width: calc(100% - 80px);
}

.el-form-item:last-child {
  text-align: center;
}
</style> 