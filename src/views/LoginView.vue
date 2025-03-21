<template>
  <div class="auth-page">
    <div class="container">
      <!-- 登录内容 -->
      <div class="card">
        <!-- 左侧插图 -->
        <div class="illustration-container">
          <img src="@/assets/end.png" alt="3D blackboard" class="illustration-image" />
        </div>

        <!-- 右侧登录表单 -->
        <div class="login-container">
          <div class="login-content">
            <h1 class="login-title">敬请登录账号</h1>
            <p class="subtitle">智能脑机连接教学</p>
            
            <div class="form-inputs">
              <div class="input-wrapper">
                <div class="input-icon">
                  <el-icon><User /></el-icon>
                </div>
                <input v-model="loginForm.userId" placeholder="学工号" class="login-input" />
              </div>
              
              <div class="input-wrapper">
                <div class="input-icon">
                  <el-icon><Message /></el-icon>
                </div>
                <input v-model="loginForm.email" placeholder="邮箱" class="login-input" />
              </div>
              
              <div class="input-wrapper">
                <div class="input-icon">
                  <el-icon><Lock /></el-icon>
                </div>
                <div class="password-input-wrapper">
                  <input v-model="loginForm.password" :type="showPassword ? 'text' : 'password'" placeholder="密码" class="login-input" />
                  <button class="show-password" @click="showPassword = !showPassword">显示</button>
                </div>
              </div>
              
              <div class="remember-me">
                <el-checkbox v-model="agreeTerms">同意用户协议</el-checkbox>
              </div>
              
              <button type="button" class="login-btn" @click="submitLoginForm">确认登录</button>
            </div>
            
            <div class="version-info">
              脑机教学系统 v3.0
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Lock, User, Message } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';
import api, { ApiEnv } from '@/api';

export default {
  name: 'LoginView',
  components: {
    Lock,
    User,
    Message
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    // 判断当前环境
    const isLocalEnv = computed(() => api.getCurrentEnvironment() === ApiEnv.LOCAL);

    // 登录表单数据
    const loginForm = ref({
      userId: '',
      email: '',
      password: ''
    });
    
    // 显示密码
    const showPassword = ref(false);
    
    // 同意条款
    const agreeTerms = ref(false);

    // 登录表单提交方法
    const submitLoginForm = async () => {
      if (!loginForm.value.userId || !loginForm.value.password) {
        ElMessage.error('请输入学工号和密码');
        return;
      }
      
      if (!agreeTerms.value) {
        ElMessage.error('请同意用户协议');
        return;
      }
      
      try {
        const response = await store.dispatch('login', {
          userId: loginForm.value.userId,
          email: loginForm.value.email,
          password: loginForm.value.password
        });
        
        ElMessage.success('登录成功');
        router.push('/');
      } catch (error) {
        console.error('登录失败:', error);
        ElMessage.error(error.message || '学工号或密码错误');
      }
    };

    return {
      loginForm,
      showPassword,
      agreeTerms,
      submitLoginForm,
      isLocalEnv
    };
  }
};
</script>

<style scoped>
.auth-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(315deg, #79f2eb 0%, #1990c7 50%, #0c4793 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  position: relative;
  overflow: hidden;
}

.auth-page::before,
.auth-page::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  z-index: 0;
}

.auth-page::before {
  bottom: -300px;
  left: -300px;
  width: 1300px;
  height: 1300px;
  background: radial-gradient(circle, rgba(12, 71, 147, 0.3) 0%, rgba(12, 71, 147, 0) 70%);
}

.auth-page::after {
  top: -400px;
  right: -200px;
  width: 1300px;
  height: 1300px;
  background: radial-gradient(circle, rgba(121, 242, 235, 0.25) 0%, rgba(121, 242, 235, 0) 70%);
}

/* 添加左下角装饰性圆形 */
.container::before {
  content: '';
  position: absolute;
  bottom: -350px;
  left: -300px;
  width: 1100px;
  height: 1100px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(30, 126, 166, 0.3) 0%, rgba(30, 126, 166, 0) 70%);
  z-index: 0;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  z-index: 1;
}

.card {
  width: 1150px;
  height: 720px;
  display: flex;
  background-color: #0a1b2e;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.45);
  position: relative;
}

.illustration-container {
  width: 700px;
  height: 100%;
  padding: 0;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: #0a1b2e;
}

.illustration-image {
  width: 100%;
  max-height: 100%;
  height: auto;
  object-fit: contain;
  transform: scale(1.1);
  margin: 0 auto;
}

.login-container {
  width: 450px;
  padding: 150px 60px 0;
  display: flex;
  flex-direction: column;
  background: #0a1b2e;
  align-items: flex-start;
}

.login-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.login-title {
  color: white;
  font-size: 30px;
  margin-bottom: 8px;
  font-weight: 500;
  padding-left: 0;
}

.subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin-bottom: 50px;
  padding-left: 0;
}

.form-inputs {
  width: 65%;
  margin: 0;
}

.input-wrapper {
  position: relative;
  margin-bottom: 18px;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #0077ff;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-icon svg {
  font-size: 18px;
  opacity: 0.85;
}

.login-input {
  width: 100%;
  height: 48px;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  color: white;
  padding: 0 20px 0 45px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.login-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}

.login-input:focus {
  background-color: rgba(0, 0, 0, 0.3);
  border-color: rgba(24, 144, 255, 0.35);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
}

.password-input-wrapper {
  position: relative;
  width: 100%;
}

.show-password {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: white;
  font-size: 12px;
  cursor: pointer;
  opacity: 0.7;
}

.remember-me {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  color: white;
  font-size: 14px;
  width: 65%;
  margin-left: 0;
  margin-right: auto;
}

:deep(.el-checkbox__inner) {
  background-color: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #0077ff;
  border-color: #0077ff;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner::after) {
  border-color: #fff;
}

.login-btn {
  width: 65%;
  margin: 10px 0 0;
  height: 48px;
  background: #0077ff;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 119, 255, 0.3);
  display: block;
}

.login-btn:hover {
  background: #0066e8;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 119, 255, 0.4);
}

.login-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 10px rgba(0, 112, 243, 0.2);
}

.version-info {
  margin-top: 60px;
  text-align: center;
  color: rgba(255, 255, 255, 0.35);
  font-size: 13px;
  width: 65%;
  margin-left: 0;
  margin-right: auto;
}

@media (max-width: 1200px) {
  .card {
    width: 92%;
    height: auto;
    max-height: 85vh;
  }
  
  .illustration-container {
    width: 55%;
  }
  
  .login-container {
    width: 45%;
    padding: 80px 40px 0;
  }
}

@media (max-width: 900px) {
  .card {
    flex-direction: column;
  }
  
  .illustration-container {
    width: 100%;
    height: 350px;
  }
  
  .login-container {
    width: 100%;
  }
}
</style>
