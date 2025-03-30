# API使用示例

本文档提供调整后API的使用示例，帮助开发人员快速适应API变更。

## 引入API

```javascript
import api from '@/api';
```

## 用户认证相关

### 用户注册

```javascript
// 组件中的方法
async register() {
  try {
    const userData = {
      username: this.username, // 用作登录名
      password: this.password,
      email: this.email,
      role: this.role,
      name: this.name,
      phone: this.phone
    };
    
    const response = await api.register(userData);
    
    if (response.code === 200) {
      // 注册成功
      this.$message.success('注册成功');
      this.$router.push('/login');
    } else {
      // 注册失败
      this.$message.error(response.message);
    }
  } catch (error) {
    console.error('注册异常:', error);
    this.$message.error('注册失败，请稍后重试');
  }
}
```

### 用户登录

```javascript
// 组件中的方法
async login() {
  try {
    const loginData = {
      username: this.username, // 注意：不再使用userId
      password: this.password
    };
    
    const response = await api.login(loginData);
    
    if (response.code === 200) {
      // 登录成功，保存token和用户信息
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('role', response.data.role);
      
      this.$message.success('登录成功');
      this.$router.push('/dashboard');
    } else {
      // 登录失败
      this.$message.error(response.message);
    }
  } catch (error) {
    console.error('登录异常:', error);
    this.$message.error('登录失败，请稍后重试');
  }
}
```

### 用户登出

```javascript
// 组件中的方法
async logout() {
  try {
    const response = await api.logout();
    
    // 无论后端返回结果如何，前端都清除本地存储的用户信息
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    
    this.$message.success('已退出登录');
    this.$router.push('/login');
  } catch (error) {
    console.error('登出异常:', error);
    this.$message.error('操作失败，请稍后重试');
  }
}
```

## 课程相关

### 获取课程列表

```javascript
// 组件中的方法
async fetchCourses() {
  try {
    this.loading = true;
    const response = await api.getCourses(this.page, this.pageSize);
    
    if (response.code === 200) {
      this.courses = response.data.items;
      this.total = response.data.total;
    } else {
      this.$message.error(response.message || '获取课程列表失败');
    }
  } catch (error) {
    console.error('获取课程列表异常:', error);
    this.$message.error('获取课程列表失败，请稍后重试');
  } finally {
    this.loading = false;
  }
}
```

### 获取课程详情

```javascript
// 组件中的方法
async fetchCourseDetail() {
  try {
    this.loading = true;
    const response = await api.getCourseDetail(this.courseId);
    
    if (response.code === 200) {
      this.courseDetail = response.data;
    } else {
      this.$message.error(response.message || '获取课程详情失败');
    }
  } catch (error) {
    console.error('获取课程详情异常:', error);
    this.$message.error('获取课程详情失败，请稍后重试');
  } finally {
    this.loading = false;
  }
}
```

## 课程资源相关

### 获取课程资源列表

```javascript
// 组件中的方法
async fetchCourseResources() {
  try {
    this.loading = true;
    
    // 构建查询参数
    const params = {
      page: this.page,
      size: this.pageSize
    };
    
    // 添加可选筛选参数
    if (this.resourceType) {
      params.type = this.resourceType;
    }
    
    if (this.searchKeyword) {
      params.search = this.searchKeyword;
    }
    
    const response = await api.getCourseResources(this.courseId, params);
    
    if (response.code === 200) {
      this.resources = response.data.items;
      this.total = response.data.total;
    } else {
      this.$message.error(response.message || '获取课程资源失败');
    }
  } catch (error) {
    console.error('获取课程资源异常:', error);
    this.$message.error('获取课程资源失败，请稍后重试');
  } finally {
    this.loading = false;
  }
}
```

### 上传课程资源

```javascript
// 组件中的方法
async uploadResource(file) {
  try {
    this.uploading = true;
    
    // 构建上传数据
    const formData = {
      file: file,
      name: this.resourceName || file.name,
      type: this.resourceType || 'document',
      description: this.resourceDescription || ''
    };
    
    const response = await api.uploadCourseResource(this.courseId, formData);
    
    if (response.code === 200) {
      this.$message.success('上传成功');
      // 刷新资源列表
      this.fetchCourseResources();
    } else {
      this.$message.error(response.message || '上传失败');
    }
  } catch (error) {
    console.error('上传资源异常:', error);
    this.$message.error('上传失败，请稍后重试');
  } finally {
    this.uploading = false;
  }
}
```

### 下载资源

```javascript
// 组件中的方法
async downloadResource(resourceId) {
  try {
    this.downloading = true;
    
    const response = await api.downloadResource(resourceId);
    
    if (response.code === 200) {
      // 如果返回了下载链接
      if (response.data && response.data.downloadUrl) {
        window.open(response.data.downloadUrl, '_blank');
      } else {
        this.$message.error('下载链接无效');
      }
    } else {
      this.$message.error(response.message || '下载失败');
    }
  } catch (error) {
    console.error('下载资源异常:', error);
    this.$message.error('下载失败，请稍后重试');
  } finally {
    this.downloading = false;
  }
}
```

## 高级功能模块

### 获取课程公告

```javascript
// 组件中的方法
async fetchAnnouncements() {
  try {
    this.loading = true;
    
    const params = {
      page: this.page,
      size: this.pageSize
    };
    
    // 添加可选筛选参数
    if (this.announcementType) {
      params.type = this.announcementType;
    }
    
    const response = await api.getCourseAnnouncements(this.courseId, params);
    
    if (response.code === 200) {
      this.announcements = response.data.items;
      this.total = response.data.total;
    } else {
      this.$message.error(response.message || '获取公告失败');
    }
  } catch (error) {
    console.error('获取公告异常:', error);
    this.$message.error('获取公告失败，请稍后重试');
  } finally {
    this.loading = false;
  }
}
```

### 发布课程公告

```javascript
// 组件中的方法
async publishAnnouncement() {
  try {
    this.publishing = true;
    
    const data = {
      title: this.title,
      content: this.content,
      type: this.type // 公告类型：'info'普通, 'warning'重要, 'danger'紧急
    };
    
    const response = await api.publishCourseAnnouncement(this.courseId, data);
    
    if (response.code === 200) {
      this.$message.success('发布成功');
      this.resetForm();
      // 刷新公告列表
      this.fetchAnnouncements();
    } else {
      this.$message.error(response.message || '发布失败');
    }
  } catch (error) {
    console.error('发布公告异常:', error);
    this.$message.error('发布失败，请稍后重试');
  } finally {
    this.publishing = false;
  }
}
```

## 本地模式与生产环境切换

```javascript
// 切换到本地模式（使用模拟数据）
api.switchEnvironment(ApiEnv.LOCAL);

// 切换到生产环境
api.switchEnvironment(ApiEnv.PRODUCTION);

// 获取当前环境
const currentEnv = api.getCurrentEnvironment();
```

## 错误处理最佳实践

```javascript
async fetchData() {
  try {
    this.loading = true;
    const response = await api.someApiCall();
    
    if (response.code === 200) {
      // 成功处理
      this.data = response.data;
    } else if (response.code === 401 || response.code === 403) {
      // 权限或认证问题
      this.$message.error('您没有权限访问此资源');
      this.$router.push('/login');
    } else if (response.code === 404) {
      // 资源不存在
      this.$message.error('请求的资源不存在');
    } else {
      // 其他错误
      this.$message.error(response.message || '操作失败');
    }
  } catch (error) {
    // 网络错误或其他异常
    if (error.response) {
      // 服务器返回了错误状态码
      console.error('服务器错误:', error.response);
      this.$message.error(`服务器错误: ${error.response.status}`);
    } else if (error.request) {
      // 请求发送但未收到响应
      console.error('网络错误:', error.request);
      this.$message.error('网络错误，请检查您的网络连接');
    } else {
      // 请求设置时出错
      console.error('请求错误:', error.message);
      this.$message.error(`请求错误: ${error.message}`);
    }
  } finally {
    this.loading = false;
  }
}
``` 