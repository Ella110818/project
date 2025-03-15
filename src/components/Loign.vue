<!-- <template>
  <div class="login-page">
    <div class="login-box">
      <h3 class="h3">知微课研</h3>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="'密\xa0\xa0\xa0码'" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="captcharcode">
          <el-input v-model.number="ruleForm.captcharcode"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      ruleForm: {
        username: "",
        password: "",
        captcharcode: ""
      },
      rules: {
        username: [
          {
            required: true, //必填项
            message: "用户名不能为空", //提示语
            trigger: "blur" //
          }
        ],
        password: [
          {
            required: true, //必填项
            message: "密码不能为空", //提示语
            trigger: "blur" //
          }
        ],
        captcharcode: [
          {
            required: true, //必填项
            message: "验证码不能为空", //提示语
            trigger: "blur" //
          }
        ]
      }
    }
  },
  methods: {
    submitForm() {

    }
  },
  components: {

  }
}
</script>

<style lang="less" scoped>
.login-page {
  width: 100%;
  height: 100%;
  background: url(../../src/assets/back.png) center top no-repeat;
  position: relative;
  background-size: cover;

  .login-box {
    width: 400px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding-top: 20px;
    padding-right: 40px;
    border-radius: 20px;

    .h3 {
      text-align: center; //居中
      margin-bottom: 20px;
      padding-left: 50px;
    }

    .login-btn {
      width: 100%; // 或者其他您想要的宽度值
    }
  }
}
</style> -->


<template>
  <div class="login-container">
    <el-form class="login-form" :model="loginForm" :rules="loginRules" ref="loginRef">
      <h3 class="title">{{ title }}</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          auto-complete="off"
          placeholder="用户名"
        >
          <template #prefix>
            <svg-icon icon-name="user" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          :type="passwordType"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter="handleLogin"
        >
          <template #prefix>
            <svg-icon icon-name="password" class="el-input__icon input-icon" />
          </template>
        </el-input>
        <span class="show-password" @click="handleShowPassword">
          <svg-icon :icon-name="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="default"
          type="primary"
          class="login-button"
          @click.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const title = ref('知微课研') // 页面标题
const loginForm = ref({
  username: '',
  password: ''
})

// 密码类型
const passwordType = ref('password')
// 切换密码显示
function handleShowPassword() {
  passwordType.value = passwordType.value === 'password' ? 'text' : 'password'
}

// 表单验证规则
const loginRules = ref({
  username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
  password: [
    { required: true, trigger: 'blur', message: '密码不能为空' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
})

// 登录加载状态
const loading = ref(false)
const router = useRouter()
const store = useStore()
const loginRef = ref(null) // 表单引用

// 登录方法
async function handleLogin() {
  // 验证表单
  if (!loginRef.value) return
  const valid = await loginRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    // 调用 Vuex 的登录方法
    await store.dispatch('/login', loginForm.value)
    // 登录成功后跳转到首页
    router.push('/')
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
   background-image: url('@/assets/back1.png'); /* 设置背景图片 */
  background-size: cover; /* 背景图片覆盖整个容器 */
  background-position: center; /* 背景图片居中 */

  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #707070;
  }

  .login-form {
    border-radius: 6px;
    background: #ffffff;
    width: 400px;
    padding: 25px 25px 5px 25px;
    .el-input {
      height: 38px;
      input {
        height: 38px;
      }
      .input-icon {
        height: 39px;
        width: 14px;
        margin-left: 2px;
      }
    }
    .show-password {
      height: 39px;
      width: 14px;
      position: absolute;
      right: 10px;
      font-size: 16px;
      color: #889aa4;
      cursor: pointer;
      user-select: none;
    }
    .login-button {
      width: 100%;
    }
  }
}
</style>