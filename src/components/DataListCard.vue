<template>
  <div class="basic-list-card">
    <div class="art-card art-custom-card">
      <div class="card-header">
        <p class="card-title">{{ title }}</p>
        <p class="card-subtitle">{{ subtitle }}</p>
      </div>
      <el-scrollbar :style="{ height: maxHeight + 'px' }">
        <div v-for="(item, index) in list" :key="index" class="list-item">
          <div class="item-icon" :class="item.class" v-if="item.icon">
            <i class="iconfont-sys" v-html="item.icon"></i>
          </div>
          <div class="item-content">
            <div class="item-title">{{ item.title }}</div>
            <div class="item-status">{{ item.status }}</div>
          </div>
          <div class="item-time">{{ item.time }}</div>
        </div>
      </el-scrollbar>
      <el-button class="more-btn" v-if="showMoreButton" @click="handleMore">
        查看更多
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasicListCard',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    maxCount: {
      type: Number,
      default: 5
    },
    showMoreButton: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    maxHeight() {
      return this.maxCount * 66; // Assuming each item has a height of 66px
    }
  },
  methods: {
    handleMore() {
      this.$emit('more');
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-list-card {
  .art-card {
    padding: 30px;
    background-color: var(--art-main-bg-color);
    border-radius: var(--custom-radius);

    .card-header {
      padding-bottom: 15px;

      .card-title {
        font-size: 18px;
        font-weight: 500;
        color: var(--art-gray-900);
      }

      .card-subtitle {
        font-size: 14px;
        color: var(--art-gray-500);
      }
    }
  }

  .list-item {
    display: flex;
    align-items: center;
    padding: 12px 0;

    .item-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      margin-right: 12px;
      border-radius: 8px;

      i {
        font-size: 20px;
      }
    }

    .item-content {
      flex: 1;

      .item-title {
        margin-bottom: 4px;
        font-size: 15px;
        color: var(--art-gray-900);
      }

      .item-status {
        font-size: 12px;
        color: var(--art-gray-600);
      }
    }

    .item-time {
      margin-left: 12px;
      font-size: 12px;
      color: var(--art-gray-500);
    }
  }

  .more-btn {
    width: 100%;
    margin-top: 25px;
    text-align: center;
  }
}
</style>
