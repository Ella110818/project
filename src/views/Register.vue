<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <div class="card-header">
          <h2>用户注册</h2>
          <div v-if="isLocalEnv" class="env-tip">
            <el-tag type="info" effect="plain" size="small">本地模拟环境</el-tag>
          </div>
        </div>
      </template>
      <el-form :model="registerForm" :rules="rules" ref="registerFormRef" label-width="80px">
        <el-form-item label="学工号" prop="userId">
          <el-input v-model="registerForm.userId" placeholder="请输入学工号"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-radio-group v-model="registerForm.role">
            <el-radio label="teacher">教师</el-radio>
            <el-radio label="student">学生</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRegister">注册</el-button>
          <el-button @click="goToLogin">返回登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import api, { ApiEnv } from '@/api'

export default {
  setup() {
    const router = useRouter()
    const store = useStore()
    const registerFormRef = ref(null)

    // 判断当前环境
    const isLocalEnv = computed(() => api.getCurrentEnvironment() === ApiEnv.LOCAL);

    const registerForm = reactive({
      userId: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'student'
    })

    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (registerForm.confirmPassword !== '') {
          registerFormRef.value?.validateField('confirmPassword')
        }
        callback()
      }
    }

    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    const rules = {
      userId: [
        { required: true, message: '请输入学工号', trigger: 'blur' },
        { min: 5, message: '学工号长度不能小于5位', trigger: 'blur' }
      ],
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
      ],
      password: [
        { validator: validatePass, trigger: 'blur' },
        { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
      ],
      confirmPassword: [
        { validator: validatePass2, trigger: 'blur' }
      ],
      role: [
        { required: true, message: '请选择角色', trigger: 'change' }
      ]
    }

    const handleRegister = () => {
      registerFormRef.value?.validate(async (valid) => {
        if (valid) {
          try {
            const response = await store.dispatch('register', {
              username: registerForm.username,
              password: registerForm.password,
              email: registerForm.email,
              name: registerForm.userId,
              role: registerForm.role
            })
            
            if (response.code === 200) {
              ElMessage.success('注册成功，请登录')
              router.push('/login')
            } else {
              ElMessage.error(response.message || '注册失败')
            }
          } catch (error) {
            console.error('注册失败:', error)
            ElMessage.error(error.message || '注册失败，请稍后再试')
          }
        }
      })
    }

    const goToLogin = () => {
      router.push('/login')
    }

    return {
      registerForm,
      registerFormRef,
      rules,
      handleRegister,
      goToLogin,
      isLocalEnv
    }
  }
}
</script>

<style scoped>
.register-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f2ee;
}

.register-card {
  width: 400px;
}

.card-header {
  text-align: center;
  position: relative;
}

.env-tip {
  position: absolute;
  top: 0;
  right: 0;
}

.card-header h2 {
  margin: 0;
  color: #333;
}

.el-form-item:last-child {
  margin-bottom: 0;
  text-align: center;
}

.el-button {
  margin: 0 10px;
}
</style> 