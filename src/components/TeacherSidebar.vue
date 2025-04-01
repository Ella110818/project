<template>
  <div class="header-container">
    <!-- Logo区域 -->
    <div class="logo-container">
      <i class="el-icon-school"></i>
      <span class="platform-title">知微课研</span>
      <div class="decoration-container">
        <dv-decoration-2 :dur="2" />
      </div>
    </div>

    <!-- 导航菜单 -->
    <el-menu
      default-active="1" 
      class="el-menu-horizontal"
      mode="horizontal"
      @open="handleOpen"
      @close="handleClose"
      background-color="#0b1834"
      text-color="#ffffff"
      active-text-color="#00d8ff"
    >
      <el-menu-item index="1" @click="navigateTo('/teacher-display')">
        <i class="el-icon-data-analysis"></i>
        <span>数据显示屏</span>
      </el-menu-item>
      <el-menu-item index="2" @click="navigateTo('/startclass')">
        <i class="el-icon-video-play"></i>
        <span>开始上课</span>
      </el-menu-item>
      <el-menu-item index="3" @click="navigateTo('/myclass')">
        <i class="el-icon-notebook-2"></i>
        <span>我的课程</span>
      </el-menu-item>
      <el-menu-item index="4" @click="navigateTo('/studentmanage')">
        <i class="el-icon-user"></i>
        <span>学生管理</span>
      </el-menu-item>
      <el-menu-item index="5" @click="navigateTo('/assistant')">
        <i class="el-icon-robot"></i>
        <span>智能助手</span>
      </el-menu-item>
    </el-menu>

    <!-- 右侧用户信息 -->
    <el-dropdown class="user-dropdown" @command="handleCommand">
      <div class="admin">
        <el-avatar :size="50" :src="userAvatar" />
        <div style="margin-left: 5px;">
          <span class="el-dropdown-link">
            {{ userName }}
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
        </div>
      </div>
      <template #dropdown>
        <el-dropdown-menu class="custom-dropdown">
          <el-dropdown-item command="profile">
            <el-icon><User /></el-icon>
            个人信息
          </el-dropdown-item>
          <el-dropdown-item command="changePassword">
            <el-icon><Lock /></el-icon>
            修改密码
          </el-dropdown-item>
          <el-dropdown-item command="logout" divided>
            <el-icon><SwitchButton /></el-icon>
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 修改密码对话框 -->
    <el-dialog
      title="修改密码"
      v-model="passwordDialogVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input
            v-model="passwordForm.currentPassword"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passwordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleChangePassword">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Decoration2 as DvDecoration2 } from '@kjgl77/datav-vue3';

export default {
  components: {
    DvDecoration2
  },
  setup() {
    const router = useRouter();
    const passwordDialogVisible = ref(false);
    const passwordFormRef = ref(null);
    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    const passwordRules = {
      currentPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
      newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
      confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value !== passwordForm.value.newPassword) {
              callback(new Error('两次输入的密码不一致'));
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }
      ]
    };

    const handleChangePassword = async () => {
      if (!passwordFormRef.value) return;
      
      await passwordFormRef.value.validate(async (valid) => {
        if (valid) {
          try {
            // 获取当前用户信息
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const currentUserId = localStorage.getItem('userId');
            const currentUser = users.find(user => user.userId === currentUserId);

            if (!currentUser) {
              ElMessage.error('用户信息不存在');
              return;
            }

            // 验证当前密码
            if (currentUser.password !== passwordForm.value.currentPassword) {
              ElMessage.error('当前密码错误');
              return;
            }

            // 更新密码
            currentUser.password = passwordForm.value.newPassword;
            localStorage.setItem('users', JSON.stringify(users));

            ElMessage.success('密码修改成功');
            passwordDialogVisible.value = false;
            passwordForm.value = {
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            };
          } catch (error) {
            console.error('修改密码失败:', error);
            ElMessage.error('修改密码失败，请重试');
          }
        }
      });
    };

    const navigateTo = (path) => {
      // 使用绝对路径进行导航
      if (!path.startsWith('/')) {
        path = '/' + path;
      }
      router.push(path);
    };

    return {
      passwordDialogVisible,
      passwordFormRef,
      passwordForm,
      passwordRules,
      handleChangePassword,
      navigateTo
    };
  },
  data() {
    return {
      userAvatar: localStorage.getItem('userAvatar') || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', // 从localStorage获取头像
      userName: localStorage.getItem('username') || '未登录' // 从localStorage获取用户名
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log('open', key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log('close', key, keyPath);
    },
    handleCommand(command) {
      switch (command) {
        case 'profile':
          this.navigateTo('/profile');
          break;
        case 'changePassword':
          this.passwordDialogVisible = true;
          break;
        case 'logout':
          // 清除所有相关的 localStorage 数据
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('userRole');
          localStorage.removeItem('username');
          localStorage.removeItem('userAvatar');
          // 跳转到登录页
          this.$router.push('/login');
          break;
      }
    }
  },
};
</script>

<style scoped>
.header-container {
  width: 100%;
  height: 63px;
  background: linear-gradient(to right, #20345f, #0b3069);
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-container {
  display: flex;
  align-items: center;
  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
  margin-right: 40px;
  text-shadow: 0 0 10px rgba(0, 216, 255, 0.5);
  letter-spacing: 1px;
  position: relative;
}

.logo-container i {
  margin-right: 8px;
  font-size: 24px;
  color: #00d8ff;
  text-shadow: 0 0 10px rgba(0, 216, 255, 0.5);
}

.platform-title {
  background: linear-gradient(to bottom, #ffffff, #00d8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(0, 216, 255, 0.3);
}

.decoration-container {
  position: absolute;
  bottom: -2px;
  left: 0;
  z-index: 10;
  width: 100%;
  display: flex;
  justify-content: center;
}

.decoration-container > div {
  width: 100% !important;
  height: 3px !important;
}

.el-menu-horizontal {
  border-bottom: none;
  flex: 1;
  height: 63px;
  background: transparent !important;
}

.el-menu-horizontal > .el-menu-item {
  height: 63px;
  line-height: 63px;
  font-size: 14px;
  color: #ffffff !important;
  background: transparent !important;
  display: flex;
  align-items: center;
}

.el-menu-item i {
  margin-right: 5px;
  font-size: 16px;
  color: #ffffff !important;
}

.el-menu-item span {
  line-height: normal;
}

.user-dropdown {
  margin-left: 20px;
  margin-right: 20px;
  cursor: pointer;
}

.admin {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding-right: 10px;
}

.el-avatar {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  color: #ffffff;
  font-size: 14px;
  text-shadow: 0 0 10px rgba(0, 216, 255, 0.3);
}

.el-icon--right {
  margin-left: 5px;
  color: #00d8ff;
}

.el-dropdown-menu__item.divided {
  border-top: 1px solid #ebeef5;
  margin-top: 5px;
  padding-top: 5px;
}

/* 激活菜单项的样式 */
.el-menu-item.is-active {
  color: #00d8ff !important;
  border-bottom: 2px solid #00d8ff !important;
  background: rgba(0, 216, 255, 0.1) !important;
}

.el-menu-item.is-active i {
  color: #00d8ff !important;
}

/* 鼠标悬停效果 */
.el-menu-item:hover {
  background: rgba(0, 216, 255, 0.1) !important;
}

.el-menu-item:hover i {
  color: #00d8ff !important;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 用户下拉菜单样式 */
:deep(.custom-dropdown) {
  background: linear-gradient(to bottom, #0b1834, #0b3069);
  border: 1px solid rgba(0, 216, 255, 0.2);
  box-shadow: 0 2px 12px 0 rgba(0, 216, 255, 0.1);
}

:deep(.custom-dropdown .el-dropdown-menu__item) {
  color: #ffffff;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
}

:deep(.custom-dropdown .el-dropdown-menu__item:hover) {
  background-color: rgba(0, 216, 255, 0.1);
  color: #00d8ff;
}

:deep(.custom-dropdown .el-dropdown-menu__item.is-disabled) {
  color: rgba(255, 255, 255, 0.4);
}

:deep(.custom-dropdown .el-dropdown-menu__item.divided) {
  border-top: 1px solid rgba(0, 216, 255, 0.2);
  margin-top: 4px;
  padding-top: 8px;
}

:deep(.custom-dropdown .el-icon) {
  color: #00d8ff;
  font-size: 16px;
}
</style> 