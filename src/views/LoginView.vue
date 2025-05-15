<template>
  <div class="login-container">
    <div class="illustration">
      <img src="@/assets/zengqiang2.png" alt="Illustration" />
    </div>
    <div class="login-form">
      <h2>明瞳智教</h2>
      <p>请选择登录身份后登录</p>
      <div class="identity-selector">
        <div class="identity-slider" :class="{ 'slide-teacher': activeIdentity === 'teacher' }"></div>
        <button 
          class="identity" 
          :class="{ active: activeIdentity === 'student' }" 
          @click="switchIdentity('student')"
        >
          学生
        </button>
        <button 
          class="identity" 
          :class="{ active: activeIdentity === 'teacher' }" 
          @click="switchIdentity('teacher')"
        >
          教师
        </button>
      </div>
      <div class="input-group">
        <label class="input-label">账号</label>
        <div class="input-wrapper">
          <img src="@/assets/yonghuming.png" alt="用户名" class="input-icon" />
          <input 
            type="text" 
            placeholder="请输入账号" 
            v-model="username"
            :disabled="loading"
          />
        </div>
      </div>
      <div class="input-group">
        <label class="input-label">密码</label>
        <div class="input-wrapper">
          <img src="@/assets/mima.png" alt="密码" class="input-icon" />
          <input 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="请输入密码" 
            v-model="password"
            :disabled="loading"
          />
          <img 
            src="@/assets/biyan.png"
            alt="显示/隐藏密码" 
            class="password-toggle"
            @click="showPassword = !showPassword"
          />
        </div>
      </div>
      <div class="remember-forgot">
        <label class="checkbox-wrapper">
          <input 
            type="checkbox" 
            v-model="rememberMe"
            :disabled="loading"
          />
          <span class="checkbox-label">记住密码</span>
        </label>
        <a href="#" class="forgot">忘记密码？</a>
      </div>
      <button 
        class="login-button" 
        @click="handleLogin"
        :disabled="loading"
      >
        <span>{{ loading ? '登录中...' : '确认登录' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api';

const router = useRouter();
const activeIdentity = ref('student');
const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const loading = ref(false);

const switchIdentity = (identity) => {
  activeIdentity.value = identity;
};

const handleLogin = async () => {
  // 表单验证
  if (!username.value) {
    alert('请输入账号');
    return;
  }
  if (!password.value) {
    alert('请输入密码');
    return;
  }

  try {
    loading.value = true;
    const response = await api.login({
      username: username.value,
      password: password.value
    });

    if (response.code === 200) {
      // 如果选择记住密码，保存用户名和密码
      if (rememberMe.value) {
        localStorage.setItem('rememberedUsername', username.value);
        localStorage.setItem('rememberedPassword', password.value);
      } else {
        localStorage.removeItem('rememberedUsername');
        localStorage.removeItem('rememberedPassword');
      }

      // 设置认证状态
      localStorage.setItem('isAuthenticated', 'true');

      // 根据角色跳转到不同页面
      const role = response.data.role;
      if (role === 'teacher') {
        router.push('/teacher-display');
      } else if (role === 'student') {
        router.push('/student-display');
      } else {
        router.push('/');  // 如果角色不明确，跳转到首页
      }
    } else {
      alert(response.message || '登录失败');
    }
  } catch (error) {
    console.error('登录错误:', error);
    alert(error.message || '登录失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 页面加载时检查是否有记住的账号密码
const checkRememberedCredentials = () => {
  const rememberedUsername = localStorage.getItem('rememberedUsername');
  const rememberedPassword = localStorage.getItem('rememberedPassword');
  
  if (rememberedUsername && rememberedPassword) {
    username.value = rememberedUsername;
    password.value = rememberedPassword;
    rememberMe.value = true;
  }
};

// 页面加载时执行
checkRememberedCredentials();
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

.login-container {
  display: flex;
  height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.illustration {
  flex: 1.35;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.illustration img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  margin: 0;
  padding: 0;
}

.login-form {
  flex: 0.65;
  padding: 0 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-bottom: 60px;
}

.login-form h2 {
  font-size: 40px;
  margin-bottom: 50px;
  color: #1A1A1A;
  font-weight: 600;
  margin-top: -120px;
  width: 100%;
  text-align: center;
}

.login-form p {
  color: #666;
  margin-bottom: 12px;
  font-size: 16px;
  opacity: 0.8;
  width: 75%;
  text-align: left;
}

.identity-selector {
  display: flex;
  position: relative;
  background: linear-gradient(to right, rgba(0, 153, 255, 0.1), rgba(0, 102, 255, 0.1));
  border-radius: 8px;
  height: 49px;
  padding: 2px;
  width: 75%;
  margin-bottom: 24px;
}

.identity-slider {
  position: absolute;
  width: 50%;
  height: calc(100% - 4px);
  background: linear-gradient(90deg, #00B3FF, #0066FF);
  border-radius: 6px;
  transition: transform 0.3s ease;
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0, 153, 255, 0.25);
}

.identity-slider.slide-teacher {
  transform: translateX(100%);
}

.identity {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  color: #666;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  height: 100%;
}

.identity.active {
  color: white;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.input-group {
  width: 75%;
  margin-bottom: 24px;
  text-align: left;
}

.input-label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-size: 18px;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 0 16px;
  height: 49px;
  transition: all 0.3s;
  background-color: #F5F7FA;
}

.input-wrapper:focus-within {
  border-color: #0099FF;
  box-shadow: 0 0 0 2px rgba(0, 153, 255, 0.1);
  background-color: #FFFFFF;
}

.input-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  opacity: 0.8;
}

.password-toggle {
  width: 20px;
  height: 20px;
  cursor: pointer;
  opacity: 0.6;
}

.password-toggle:hover {
  opacity: 1;
}

.input-wrapper input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  font-size: 15px;
  background: transparent;
}

.input-wrapper input::placeholder {
  color: #A3A9B5;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 24px 0;
  width: 75%;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-wrapper input[type="checkbox"] {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: #0099FF;
}

.checkbox-label {
  font-size: 18px;
  color: #606266;
}

.forgot {
  color: #606266;
  text-decoration: none;
  font-size: 18px;
}

.forgot:hover {
  color: #0099FF;
}

.login-button {
  width: 75%;
  height: 44px;
  background: linear-gradient(135deg, #00B3FF 0%, #0052FF 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  margin-top: 0;
}

.login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0099FF 0%, #0047FF 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.login-button:hover::before {
  opacity: 1;
}

.login-button span {
  position: relative;
  z-index: 1;
}

.login-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 153, 255, 0.2);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.input-wrapper input:disabled {
  background-color: #f5f7fa;
  cursor: not-allowed;
}
</style>
