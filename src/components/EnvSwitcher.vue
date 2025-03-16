<template>
  <div class="env-switcher">
    <el-popover
      placement="top"
      :width="200"
      trigger="click"
    >
      <template #reference>
        <el-button size="small" type="info">
          {{ isLocal ? '本地环境' : '生产环境' }}
          <el-icon class="el-icon--right"><Setting /></el-icon>
        </el-button>
      </template>
      
      <div class="env-switcher-content">
        <h4>API环境切换</h4>
        <el-divider />
        <el-radio-group v-model="currentEnv" @change="switchEnv">
          <el-radio-button :label="ApiEnv.LOCAL">本地模拟</el-radio-button>
          <el-radio-button :label="ApiEnv.PRODUCTION">生产环境</el-radio-button>
        </el-radio-group>
        <div class="env-info">
          <p>当前环境: <strong>{{ isLocal ? '本地模拟' : '生产环境' }}</strong></p>
          <p v-if="isLocal" class="env-note">使用localStorage存储的模拟数据</p>
          <p v-else class="env-note">连接到: https://wstier477.pythonanywhere.com</p>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { Setting } from '@element-plus/icons-vue';
import api, { ApiEnv } from '@/api';

export default {
  name: 'EnvSwitcher',
  components: {
    Setting
  },
  setup() {
    const currentEnv = ref(api.getCurrentEnvironment());
    
    const isLocal = computed(() => currentEnv.value === ApiEnv.LOCAL);
    
    const switchEnv = (env) => {
      api.switchEnvironment(env);
    };
    
    return {
      currentEnv,
      isLocal,
      switchEnv,
      ApiEnv
    };
  }
};
</script>

<style scoped>
.env-switcher {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.env-switcher-content {
  padding: 10px;
}

.env-switcher-content h4 {
  margin: 0 0 10px 0;
  text-align: center;
}

.el-radio-group {
  width: 100%;
  margin-bottom: 15px;
  display: flex;
}

.el-radio-button {
  flex: 1;
}

.env-info {
  margin-top: 15px;
  font-size: 12px;
}

.env-info p {
  margin: 5px 0;
}

.env-note {
  color: #909399;
  font-size: 11px;
}
</style> 