# API路径映射表

本文档提供完整的API路径映射对照表，帮助开发团队快速了解API调整前后的差异。

## 用户管理模块

| 功能 | 调整前路径 | 调整后路径 | 方法 | 参数变化 |
|-----|-----------|-----------|------|---------|
| 用户注册 | `/api/register/` | `/api/user/register/` | POST | `userId` → `username`（作为登录名） |
| 用户登录 | `/api/login/` | `/api/user/login/` | POST | `userId` → `username`（作为登录名） |
| 用户登出 | `/api/logout/` | `/api/user/logout/` | POST | 无变化 |
| 刷新令牌 | `/api/token/refresh/` | `/api/user/token/refresh/` | POST | 无变化 |
| 获取用户消息 | 无 | `/api/user/user/messages/` | GET | 新增：`user_id` |

## 课程管理模块

| 功能 | 调整前路径 | 调整后路径 | 方法 | 参数变化 |
|-----|-----------|-----------|------|---------|
| 获取课程列表 | `/api/courses/` | `/api/course/courses/` | GET | 无变化：`page`, `size` |
| 获取课程详情 | `/api/courses/{id}/` | `/api/course/courses/{course_id}/` | GET | 参数命名：`id` → `course_id` |

## 课程资源模块

| 功能 | 调整前路径 | 调整后路径 | 方法 | 参数变化 |
|-----|-----------|-----------|------|---------|
| 获取课程资源列表 | `/api/courses/{id}/resources/` | `/api/course/courses/{course_id}/resources/` | GET | 参数命名：`id` → `course_id` |
| 上传课程资源 | `/api/courses/{id}/resources/` | `/api/course/courses/{course_id}/resources/` | POST | 参数命名：`id` → `course_id` |
| 获取资源详情 | `/api/resources/{id}/` | `/api/course/resources/{resource_id}/` | GET | 参数命名：`id` → `resource_id` |
| 删除资源 | `/api/resources/{id}/` | `/api/course/resources/{resource_id}/` | DELETE | 参数命名：`id` → `resource_id` |
| 下载资源 | `/api/resources/{id}/download/` | `/api/course/resources/{resource_id}/download/` | GET | 参数命名：`id` → `resource_id` |

## 高级功能模块

| 功能 | 调整前路径 | 调整后路径 | 方法 | 参数变化 |
|-----|-----------|-----------|------|---------|
| 获取课程公告列表 | `/api/courses/{id}/announcements/` | `/api/advanced/courses/{course_id}/announcements/` | GET | 参数命名：`id` → `course_id` |
| 发布课程公告 | `/api/courses/{id}/announcements/` | `/api/advanced/courses/{course_id}/announcements/` | POST | 参数命名：`id` → `course_id` |
| 获取作业和考试列表 | `/api/courses/{id}/assignments/` | `/api/advanced/courses/{course_id}/assignments/` | GET | 参数命名：`id` → `course_id` |
| 发布作业或考试 | `/api/courses/{id}/assignments/` | `/api/advanced/courses/{course_id}/assignments/` | POST | 参数命名：`id` → `course_id` |
| 获取课程分组列表 | `/api/courses/{id}/groups/` | `/api/advanced/courses/{course_id}/groups/` | GET | 参数命名：`id` → `course_id` |
| 创建或更新分组 | `/api/courses/{id}/groups/` | `/api/advanced/courses/{course_id}/groups/` | POST | 参数命名：`id` → `course_id` |
| 自动分组 | `/api/courses/{id}/groups/auto` | `/api/advanced/courses/{course_id}/groups/auto` | POST | 参数命名：`id` → `course_id` |

## 返回数据格式变化

### 调整前（不统一）：

各接口返回格式不一，部分接口直接返回数据：

```json
// 刷新Token
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 调整后（统一格式）：

除刷新Token外，所有接口统一返回格式：

```json
{
  "code": 200,      // 状态码，200表示成功，其他表示错误
  "message": "操作成功", // 状态消息
  "data": {}        // 返回数据，可能为null
}
```

## 错误码标准化

| 错误码 | 描述 |
|--------|------|
| 10000 | 用户不存在 |
| 10001 | 用户名或密码错误 |
| 10002 | 用户名已存在 |
| 10003 | 邮箱已存在 |
| 10004 | 旧密码无效 |

## 字段命名规范

调整前：使用驼峰命名法（camelCase）
```javascript
{
  userId: "1",
  userName: "张三",
  createTime: "2023-01-01"
}
```

调整后：使用下划线命名法（snake_case）
```javascript
{
  "user_id": "1",
  "user_name": "张三",
  "create_time": "2023-01-01"
}
```

## 注意事项

1. 本映射表不包含人脸识别相关接口
2. 前端代码中的所有API调用都需要按照新路径进行调整
3. 参数名称和返回值字段也需要相应调整 