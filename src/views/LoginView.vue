<template>
  <div class="auth-page">
    <div class="container" :class="{ 'right-panel-active': isRegister }">
      <!-- 登录表单 -->
      <div class="form-container sign-in-container">
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="80px">
          <h1>欢迎回来</h1>
          <p>还没有账号？ <span class="link" @click="toggleForm(true)">立即注册</span></p>
          <div v-if="isLocalEnv" class="env-tip">
            <el-alert type="info" :closable="false" show-icon>
              当前使用本地模拟环境
            </el-alert>
          </div>
          <el-form-item label="学工号" prop="userId">
            <el-input v-model="loginForm.userId" placeholder="请输入学号/工号">
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password>
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <div class="forgot-password">
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
          <el-button type="primary" class="submit-btn" @click="submitLoginForm">登录</el-button>
        </el-form>
      </div>

      <!-- 注册表单 -->
      <div class="form-container sign-up-container">
        <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" label-width="80px" class="register-form">
          <h1>创建账号</h1>
          <p>已有账号？ <span class="link" @click="toggleForm(false)">立即登录</span></p>
          <el-form-item label="姓名" prop="username">
            <el-input v-model="registerForm.username" placeholder="请输入姓名">
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="registerForm.email" placeholder="请输入邮箱">
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" show-password>
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请确认密码" show-password>
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select v-model="registerForm.role" placeholder="请选择角色">
              <el-option label="教师" value="teacher"></el-option>
              <el-option label="学生" value="student"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学工号" prop="userId">
            <el-input v-model="registerForm.userId" placeholder="请输入学号/工号">
              <template #prefix>
                <el-icon><Document /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="agreement">
            <el-checkbox v-model="registerForm.agreement">我已阅读并同意
              <el-link type="primary" :underline="false">服务条款</el-link>和
              <el-link type="primary" :underline="false">隐私政策</el-link>
            </el-checkbox>
          </el-form-item>
          <el-button type="primary" class="submit-btn" @click="submitRegisterForm" :disabled="!registerForm.agreement">
            立即注册
          </el-button>
        </el-form>
      </div>

      <!-- 动画插图部分 -->
      <div class="illustration-container">
        <div class="illustration-content">
          <img :src="currentImage" alt="Login illustration" class="illustration-image" />
          <h2>学习是一切创造力的开始</h2>
          <div class="dots">
            <span class="dot" :class="{ active: !isRegister }" @click="toggleForm(false)"></span>
            <span class="dot" :class="{ active: isRegister }" @click="toggleForm(true)"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Lock, User, Message, Document } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';
import api, { ApiEnv } from '@/api';

export default {
  name: 'LoginView',
  components: {
    Lock,
    User,
    Message,
    Document
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    // 判断当前环境
    const isLocalEnv = computed(() => api.getCurrentEnvironment() === ApiEnv.LOCAL);

    // 登录表单数据
    const loginForm = ref({
      userId: '',
      password: ''
    });

    // 注册表单数据
    const registerForm = ref({
      username: '',
      userId: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreement: false,
      role: ''
    });

    // 登录表单验证规则
    const loginRules = {
      userId: [
        { required: true, message: '请输入学号/工号', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
      ]
    };

    // 注册表单验证规则
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (value.length < 6) {
        callback(new Error('密码长度不能小于6位'));
      } else {
        if (registerForm.value.confirmPassword !== '') {
          registerFormRef.value.validateField('confirmPassword');
        }
        callback();
      }
    };

    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认密码'));
      } else if (value !== registerForm.value.password) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };

    const registerRules = {
      username: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        { min: 2, message: '姓名长度不能小于2位', trigger: 'blur' }
      ],
      userId: [
        { required: true, message: '请输入学号/工号', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
      ],
      password: [
        { validator: validatePass, trigger: 'blur' }
      ],
      confirmPassword: [
        { validator: validatePass2, trigger: 'blur' }
      ],
      role: [
        { required: true, message: '请选择角色', trigger: 'change' },
      ],
    };

    // 表单引用
    const loginFormRef = ref(null);
    const registerFormRef = ref(null);

    // 是否显示注册表单
    const isRegister = ref(false);

    // 计算当前显示的图片
    const currentImage = computed(() => {
      return isRegister.value ? require('@/assets/back3.png') : require('@/assets/login.png');
    });

    // 切换登录和注册表单
    const toggleForm = (isRegisterMode) => {
      isRegister.value = isRegisterMode;
    };

    // 登录表单提交方法
    const submitLoginForm = () => {
      loginFormRef.value?.validate(async (valid) => {
        if (valid) {
          try {
            const response = await store.dispatch('login', {
              userId: loginForm.value.userId,
              password: loginForm.value.password
            });
            
            ElMessage.success('登录成功');
            router.push('/');
          } catch (error) {
            console.error('登录失败:', error);
            ElMessage.error(error.message || '学工号或密码错误');
          }
        } else {
          console.log('登录表单验证失败');
        }
      });
    };

    // 注册表单提交方法
    const submitRegisterForm = () => {
      registerFormRef.value?.validate(async (valid) => {
        if (valid) {
          try {
            const response = await store.dispatch('register', {
              username: registerForm.value.username,
              password: registerForm.value.password,
              email: registerForm.value.email,
              userId: registerForm.value.userId,
              role: registerForm.value.role
            });
            
            if (response.code === 200) {
              ElMessage.success('注册成功，请登录');
              toggleForm(false); // 切换到登录表单
            } else {
              ElMessage.error(response.message || '注册失败');
            }
          } catch (error) {
            console.error('注册失败:', error);
            ElMessage.error(error.message || '注册失败，请稍后再试');
          }
        } else {
          console.log('注册表单验证失败');
        }
      });
    };

    return {
      loginForm,
      registerForm,
      loginRules,
      registerRules,
      loginFormRef,
      registerFormRef,
      isRegister,
      currentImage,
      toggleForm,
      submitLoginForm,
      submitRegisterForm,
      isLocalEnv
    };
  }
};
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f2ff 0%, #f0f9ff 50%, #e6f7ff 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.container {
  position: relative;
  width: 1000px;
  height: 600px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.05), 0 10px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-container {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  overflow-y: auto;
}

.sign-in-container {
  right: 0;
  z-index: 2;
}

.sign-up-container {
  left: 0;
  z-index: 1;
}

.container.right-panel-active .sign-in-container {
  transform: translateX(0);
  opacity: 1;
}

.container.right-panel-active .sign-up-container {
  transform: translateX(0);
  opacity: 1;
  z-index: 5;
}

.illustration-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background-color: #fef6f3;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 3;
}

.container.right-panel-active .illustration-container {
  transform: translateX(100%);
}

/* 移除之前的动画相关样式 */
.form-container form {
  width: 100%;
  max-width: 360px;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}

/* 调整表单容器的基础样式 */
.form-container {
  opacity: 1;
  visibility: visible;
}

/* 确保表单内容始终可见 */
.sign-in-container form,
.sign-up-container form {
  opacity: 1;
  transform: none;
}

/* 移除不必要的transform效果 */
.container.right-panel-active .sign-in-container form,
.container.right-panel-active .sign-up-container form {
  transform: none;
}

.el-form {
  width: 100%;
  max-width: 360px;
}

.register-form {
  height: auto;
  min-height: min-content;
}

.illustration-content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  text-align: center;
  transition: opacity 0.3s ease-in-out;
}

.illustration-image {
  width: 80%;
  max-height: 300px;
  object-fit: contain;
  margin-bottom: 30px;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

h1 {
  margin-bottom: 15px;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

h2 {
  margin: 20px 0;
  font-size: 20px;
  color: #333;
}

.dots {
  display: flex;
  gap: 8px;
  margin-top: 20px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ddd;
  transition: background-color 0.3s ease;
}

.dot.active {
  background-color: #666;
}

.link {
  color: #409EFF;
  cursor: pointer;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.submit-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
  margin-top: 20px;
  border-radius: 4px;
}

.forgot-password {
  text-align: right;
  margin: 10px 0;
}

.el-form-item {
  margin-bottom: 15px;
}

.el-form-item__label {
  font-weight: 500;
  color: #606266;
}

.el-input__wrapper {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

.el-input__wrapper:hover {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

.el-input__wrapper.is-focus {
  box-shadow: 0 0 0 1px #409eff inset;
}

/* 确保表单容器有足够的高度 */
.form-container .el-form {
  min-height: fit-content;
  padding: 20px 0;
}

/* 调整表单项间距 */
.el-form-item:last-child {
  margin-bottom: 0;
}

/* 优化滚动条样式 */
.form-container::-webkit-scrollbar {
  width: 6px;
}

.form-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.form-container::-webkit-scrollbar-track {
  background-color: transparent;
}

/* 调整标题和文字的间距 */
p {
  color: #606266;
  margin-bottom: 20px;
  font-size: 14px;
}

/* 优化复选框样式 */
.agreement {
  margin: 15px 0;
}

.el-checkbox {
  margin-right: 0;
  font-size: 14px;
  color: #606266;
}

/* 图标样式 */
.el-input__prefix {
  display: flex;
  align-items: center;
  color: #909399;
  margin-right: 8px;
}

.el-input__prefix .el-icon {
  font-size: 16px;
}

.login-container {
  display: none;
}

.login-card {
  width: 400px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  font-size: 24px;
  color: #2c3e50;
  font-weight: 600;
  margin: 0;
}

.login-form {
  margin-top: 20px;
}

:deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  border-color: #409EFF;
  background-color: #ffffff;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #409EFF;
  background-color: #ffffff;
  box-shadow: 0 0 0 1px #409EFF;
}

.login-button {
  width: 100%;
  margin-top: 20px;
  height: 40px;
  font-size: 16px;
  background: linear-gradient(90deg, #409EFF, #3a8ee6);
  border: none;
  transition: transform 0.3s ease;
}

.login-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.register-link {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  color: #606266;
}

.register-link a {
  color: #409EFF;
  text-decoration: none;
  margin-left: 5px;
}

.register-link a:hover {
  color: #66b1ff;
}

.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 5px;
  text-align: left;
}

.env-tip {
  margin-bottom: 15px;
  width: 100%;
}
</style>