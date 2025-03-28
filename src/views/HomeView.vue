<template>
  <div class="head-menu">
    <el-container>
      <el-container>
        <el-header>
          <div class="top-head">
            <div style="display: flex; align-items: center;">
              <div class="btn">
                <el-button @click="goHome" type="text">回首页</el-button>
              </div>
              <!-- 添加导航菜单 -->
              <div class="nav-menu">
                <component :is="sidebarComponent" />
              </div>
            </div>
            <el-space wrap size="large">
              <div style="width: 300px; display: flex; justify-content: space-around; align-items: center;">
                <!-- 消息 -->
                <el-popover trigger="hover" placement="bottom" :width="200">
                  <template #reference>
                    <el-badge type="danger" is-dot>
                      <el-icon><Calendar /></el-icon>
                    </el-badge>
                  </template>
                  <div>消息待定</div>
                </el-popover>
                <!-- 个人设置 -->
                <el-dropdown @command="handleCommand">
                  <div class="admin">
                    <el-avatar :size="50" :src="userAvatar" />
                    <div style="margin-left: 5px;">
                      <span class="el-dropdown-link">
                        <span>{{ username }}</span>
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                    </div>
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                      <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
                      <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </el-space>
          </div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="passwordDialogVisible"
      title="修改密码"
      width="400px"
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
            placeholder="请输入当前密码"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
            placeholder="请输入新密码"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
            placeholder="请再次输入新密码"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passwordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleChangePassword">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import TeacherSidebar from '@/components/TeacherSidebar.vue';
import StudentSidebar from '@/components/StudentSidebar.vue';
import { ElMessage } from 'element-plus';
import {
  House,
  Reading,
  User,
  Document,
  Calendar,
  ChatDotRound,
  Setting,
  ArrowDown
} from '@element-plus/icons-vue';

export default {
  name: 'HomeView',
  components: {
    TeacherSidebar,
    StudentSidebar,
    House,
    Reading,
    User,
    Document,
    Calendar,
    ChatDotRound,
    Setting,
    ArrowDown
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      tabsActive: 'notice',
      notices: [],
      news: [],
      untreateds: [],
      username: localStorage.getItem('name') || '未登录',
      userRole: localStorage.getItem('userRole') || 'teacher',
      userAvatar: localStorage.getItem('userAvatar') || '',
    });

    // 根据用户角色动态选择侧边栏组件
    const sidebarComponent = computed(() => {
      return state.userRole === 'teacher' ? TeacherSidebar : StudentSidebar;
    });

    const activeMenu = computed(() => route.path);
    const passwordDialogVisible = ref(false);
    const passwordFormRef = ref(null);

    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (value.length < 6) {
        callback(new Error('密码长度不能小于6位'));
      } else {
        if (passwordForm.value.confirmPassword !== '') {
          passwordFormRef.value?.validateField('confirmPassword');
        }
        callback();
      }
    };

    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== passwordForm.value.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    const passwordRules = {
      currentPassword: [
        { required: true, message: '请输入当前密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
      ],
      newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { validator: validatePass, trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        { validator: validatePass2, trigger: 'blur' }
      ]
    };

    const handleCommand = (command) => {
      switch (command) {
        case 'profile':
          router.push('/profile');
          break;
        case 'changePassword':
          passwordDialogVisible.value = true;
          break;
        case 'logout':
          // 清除所有相关的 localStorage 数据
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('userRole');
          localStorage.removeItem('name');
          localStorage.removeItem('userAvatar');
          // 跳转到登录页
          router.push('/login');
          break;
      }
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

    onMounted(() => {
      state.notices = [
        {id:1,icon:'el-icon-chat-dot-round',message:'通知通知通知通知通知',dateTime:'2021-01-22 12:15:21'},
        {id:2,icon:'el-icon-chat-dot-round',message:'通知通知通知通知通知',dateTime:'2021-01-22 12:15:21'},
        {id:3,icon:'el-icon-chat-dot-round',message:'通知通知通知通知通知',dateTime:'2021-01-22 12:15:21'},
        {id:4,icon:'el-icon-chat-dot-round',message:'通知通知通知通知通知',dateTime:'2021-01-22 12:15:21'},
      ];

      state.news = [
        {id:1,icon:'el-icon-chat-dot-round',message:'消息消息消息消息消息',dateTime:'2021-01-22 12:15:21'},
        {id:2,icon:'el-icon-chat-dot-round',message:'消息消息消息消息',dateTime:'2021-01-22 12:15:21'},
        {id:3,icon:'el-icon-chat-dot-round',message:'消息消息消息消息消息',dateTime:'2021-01-22 12:15:21'},
        {id:4,icon:'el-icon-chat-dot-round',message:'消息消息消息消息消息消息',dateTime:'2021-01-22 12:15:21'},
      ];

      state.untreateds = [
        {id:1,icon:'el-icon-chat-dot-round',message:'待办待办待办待办待办',dateTime:'2021-01-22 12:15:21'},
        {id:2,icon:'el-icon-chat-dot-round',message:'待办待办待办待办待办待办',dateTime:'2021-01-22 12:15:21'},
        {id:3,icon:'el-icon-chat-dot-round',message:'待办待办待办待办待办',dateTime:'2021-01-22 12:15:21'},
        {id:4,icon:'el-icon-chat-dot-round',message:'待办待办待办待办待办待办',dateTime:'2021-01-22 12:15:21'},
      ];

      // 检查登录状态
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      if (!isAuthenticated) {
        router.push('/login');
      }
    });

    const onManage = (id) => {
      console.log(id);
    };

    const onTab = (tab, event) => {
      console.log(tab, event);
    };

    return {
      ...toRefs(state),
      sidebarComponent,
      activeMenu,
      passwordDialogVisible,
      passwordForm,
      passwordRules,
      passwordFormRef,
      handleCommand,
      handleChangePassword,
      onTab,
      onManage,
    };
  },
  methods: {
    goHome() {
      this.$router.push('/login');
    },
  },
};
</script>

<style lang="less">
.head-menu {
  height: 100vh;
  .el-badge__content.is-fixed.is-dot {
    top: 15px;
  }
}

.el-header {
  padding: 0 10px;
}

.top-head {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #0b1834;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.nav-menu {
  margin-left: 20px;
}

.nav-menu :deep(.header-container) {
  display: flex;
  align-items: center;
}

.nav-menu :deep(.logo-container) {
  display: none;
}

.nav-menu :deep(.user-dropdown) {
  display: none;
}

.admin {
  width: auto;
  height: 100%;
  display: flex;
  align-items: center;
}

.el-container {
  height: 100%;
}
</style>