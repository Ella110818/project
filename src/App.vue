<!-- <template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view><router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style> -->

<template>
  <div id="app">
    <router-view></router-view>
    <EnvSwitcher v-if="showEnvSwitcher" />
  </div>
</template>

<script>
import Welcome from './components/Welcome.vue';
import EnvSwitcher from './components/EnvSwitcher.vue';
import { ref, onMounted } from 'vue';

export default {
  name: 'App',
  components: {
    Welcome,
    EnvSwitcher
  },
  setup() {
    const showEnvSwitcher = ref(false);
    
    onMounted(() => {
      // 判断是否显示环境切换器
      // 在生产环境可以设置为false，或通过配置控制
      showEnvSwitcher.value = true;
    });
    
    return {
      showEnvSwitcher
    };
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
