# 学生课程信息系统API文档

## 基础信息

- 基础URL: `https://wstier477.pythonanywhere.com`
- 响应格式: JSON
- 鉴权方式: Bearer Token (JWT)
- 请求头: 
  ```
  Authorization: Bearer <token>
  ```

## 环境配置

系统支持两种运行环境：

- 生产环境 (PRODUCTION): 使用远程服务器API
- 本地环境 (LOCAL): 使用浏览器localStorage模拟API响应

可以通过前端切换环境，环境设置会保存在localStorage中。

## 通用响应格式

所有API接口返回统一的JSON格式：

```json
{
  "code": 200,      // 状态码，200表示成功，其他表示错误
  "message": "操作成功", // 状态消息
  "data": {}        // 返回数据，可能为null
}
```

## 错误码

| 错误码 | 描述 |
|--------|------|
| 200 | 操作成功 |
| 400 | 请求参数错误 |
| 401 | 未授权或授权失败 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 接口列表

### 1. 用户认证相关接口

#### 1.1 用户注册

- **URL**: `/api/register/`
- **方法**: POST
- **描述**: 用户注册
- **请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| userId | string | 是 | 学工号（唯一标识，用于登录） |
| username | string | 是 | 用户真实姓名 |
| email | string | 是 | 邮箱地址 |
| password | string | 是 | 密码（长度不少于6位） |
| role | string | 是 | 角色，可选值：'teacher'(教师),'student'(学生) |

- **响应示例**:

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "userId": "s20230001",
    "username": "张三"
  }
}
```

- **错误响应**:

```json
{
  "code": 400,
  "message": "该学工号已被注册",
  "data": null
}
```

#### 1.2 用户登录

- **URL**: `/api/auth/login/`
- **方法**: POST
- **描述**: 用户登录接口
- **Content-Type**: application/json
- **请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| username | string | 是 | 用户名（真实姓名） |
| password | string | 是 | 密码 |

- **响应示例**:

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "s20230001",
    "username": "张三",
    "role": "student"
  }
}
```

- **错误响应**:

```json
{
  "code": 401,
  "message": "学工号或密码错误",
  "data": null
}
```

#### 1.3 用户登出

- **URL**: `/api/logout/`
- **方法**: POST
- **描述**: 用户退出登录，使当前token失效
- **请求头**:
  - Authorization: Bearer {token}
- **响应示例**:

```json
{
  "code": 200,
  "message": "退出成功",
  "data": null
}
```

#### 1.4 刷新Token

- **URL**: `/api/token/refresh/`
- **方法**: POST
- **描述**: 使用刷新令牌获取新的访问令牌
- **请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| refresh | string | 是 | 刷新令牌 |

- **响应示例**:

```json
{
  "code": 200,
  "message": "Token刷新成功",
  "data": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

- **错误响应**:

```json
{
  "code": 401,
  "message": "刷新令牌无效或已过期",
  "data": null
}
```

### 2. 课程信息相关接口

#### 2.1 获取课程列表

- **URL**: `/api/courses/`
- **方法**: GET
- **描述**: 获取用户有权限查看的所有课程
- **请求头**:
  - Authorization: Bearer {token}

- **响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 2,
    "items": [
      {
        "id": "course_001",
        "title": "脑机接口",
        "location": "主教学楼301",
        "building": "主教学楼",
        "roomNumber": "301",
        "studentCount": 35
      }
    ]
  }
}
```

#### 2.2 获取课程详情

- **URL**: `/api/courses/{id}/`
- **方法**: GET
- **描述**: 获取特定课程的详细信息
- **请求头**:
  - Authorization: Bearer {token}
- **路径参数**: 
  - id: 课程ID

- **响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "course_001",
    "title": "脑机接口",
    "location": "主教学楼301",
    "building": "主教学楼",
    "roomNumber": "301",
    "studentCount": 35
  }
}
```

### 3. 课程公告相关接口

#### 3.1 获取课程公告列表

- **URL**: `/api/courses/{id}/announcements/`
- **方法**: GET
- **描述**: 获取课程的所有公告
- **请求头**:
  - Authorization: Bearer {token}
- **路径参数**: 
  - id: 课程ID
- **查询参数**:
  - page: number (可选) - 页码，默认1
  - size: number (可选) - 每页条数，默认10
  - type: string (可选) - 公告类型，可选值：'info', 'warning', 'danger'

- **响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 2,
    "items": [
      {
        "title": "关于期中考试的通知",
        "content": "各位同学请注意，期中考试将于下周三进行，请做好准备。",
        "type": "info"
      }
    ]
  }
}
```

#### 3.2 发布课程公告

- **URL**: `/api/courses/{id}/announcements/`
- **方法**: POST
- **描述**: 为课程发布新公告
- **请求头**:
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **路径参数**: 
  - id: 课程ID
- **请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| title | string | 是 | 公告标题 |
| content | string | 是 | 公告内容 |
| type | string | 是 | 公告类型：'info'(普通),'warning'(重要),'danger'(紧急) |

- **响应示例**:

```json
{
  "code": 200,
  "message": "发布成功",
  "data": {
    "title": "关于期中考试的通知",
    "content": "各位同学请注意，期中考试将于下周三进行，请做好准备。",
    "type": "info"
  }
}
```

### 4. 作业与考试相关接口

#### 4.1 获取作业和考试列表

- **URL**: `/api/courses/{id}/assignments/`
- **方法**: GET
- **描述**: 获取课程的所有作业和考试
- **请求头**:
  - Authorization: Bearer {token}
- **路径参数**: 
  - id: 课程ID
- **查询参数**:
  - type: string (可选) - 类型筛选，可选值：'homework'(作业),'exam'(考试)
  - status: string (可选) - 状态筛选，可选值：'未开始','进行中','已截止'
  - page: number (可选) - 页码，默认1
  - size: number (可选) - 每页条数，默认10

- **响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 2,
    "items": [
      {
        "id": 1,
        "title": "期中考试",
        "type": "exam",
        "description": "请大家认真准备期中考试。包括第1-5章内容，考试时间2小时。",
        "startTime": "2024-05-15 08:30",
        "deadline": "2024-05-15 10:30",
        "status": "进行中",
        "fullScore": 100,
        "submitted": 28,
        "total": 35
      }
    ]
  }
}
```

#### 4.2 发布作业/考试

- **URL**: `/api/courses/{id}/assignments/`
- **方法**: POST
- **描述**: 发布新作业或考试
- **请求头**:
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **路径参数**: 
  - id: 课程ID
- **请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| title | string | 是 | 标题 |
| type | string | 是 | 类型：'homework'或'exam' |
| description | string | 是 | 描述 |
| startTime | string | 是 | 开始时间 |
| deadline | string | 是 | 截止时间 |
| fullScore | number | 是 | 总分 |

- **响应示例**:

```json
{
  "code": 200,
  "message": "发布成功",
  "data": {
    "id": 1,
    "title": "期中考试",
    "type": "exam",
    "description": "请大家认真准备期中考试。包括第1-5章内容，考试时间2小时。",
    "startTime": "2024-05-15 08:30",
    "deadline": "2024-05-15 10:30",
    "status": "未开始",
    "fullScore": 100
  }
}
```

### 5. 分组管理相关接口

#### 5.1 获取课程分组列表

- **URL**: `/api/courses/{id}/groups/`
- **方法**: GET
- **描述**: 获取课程的所有分组信息
- **请求头**:
  - Authorization: Bearer {token}
- **路径参数**: 
  - id: 课程ID

- **响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "unassignedStudents": [
      {
        "id": 1,
        "name": "张三",
        "studentId": "2021001",
        "avatar": ""
      }
    ],
    "groups": [
      {
        "id": 1,
        "name": "第一组",
        "students": []
      }
    ]
  }
}
```

#### 5.2 创建/更新分组

- **URL**: `/api/courses/{courseId}/groups/`
- **方法**: POST
- **描述**: 创建新分组或更新现有分组
- **请求头**:
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **路径参数**: 
  - courseId: 课程ID
- **请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| name | string | 是 | 分组名称 |
| studentIds | number[] | 是 | 学生ID列表 |

- **响应示例**:

```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 1,
    "name": "第一组",
    "students": []
  }
}
```

#### 5.3 自动分组

- **URL**: `/api/courses/{courseId}/groups/auto`
- **方法**: POST
- **描述**: 自动将学生分配到指定数量的分组中
- **请求头**:
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **路径参数**: 
  - courseId: 课程ID
- **请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| groupCount | number | 是 | 分组数量 |
| method | string | 是 | 分组方式：'random'(随机),'average'(平均) |

- **响应示例**:

```json
{
  "code": 200,
  "message": "自动分组成功",
  "data": {
    "groups": [
      {
        "id": 1,
        "name": "第一组",
        "students": []
      }
    ]
  }
}
```

### 6. 成绩相关接口

#### 6.1 获取课程成绩列表

- **URL**: `/api/courses/{id}/grades/`
- **方法**: GET
- **描述**: 获取课程的所有学生成绩
- **请求头**:
  - Authorization: Bearer {token}
- **路径参数**: 
  - id: 课程ID
- **查询参数**:
  - page: number (可选) - 页码，默认1
  - size: number (可选) - 每页条数，默认10
  - search: string (可选) - 搜索学生姓名或学号

- **响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 35,
    "items": [
      {
        "index": 1,
        "name": "张三",
        "studentId": "2021001",
        "classScore": 28,
        "rainScore": 18,
        "examScore": 45,
        "totalScore": 91
      }
    ]
  }
}
```

### 7. 课程资源相关接口

#### 7.1 获取课程资源列表

- **URL**: `/api/courses/{id}/resources/`
- **方法**: GET
- **描述**: 获取课程的所有资源
- **请求头**:
  - Authorization: Bearer {token}
- **路径参数**: 
  - id: 课程ID
- **查询参数**:
  - type: string (可选) - 资源类型筛选，可选值：'document', 'video', 'image', 'other'
  - page: number (可选) - 页码，默认1
  - size: number (可选) - 每页条数，默认10
  - search: string (可选) - 搜索资源名称

- **响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 2,
    "items": [
      {
        "id": 1,
        "name": "脑机接口导论.pdf",
        "type": "document",
        "size": "2.5MB",
        "uploadTime": "2023-03-01 10:30:00",
        "updateTime": "2023-03-01 10:30:00",
        "uploader": {
          "userId": "t20230001",
          "name": "张教授"
        },
        "url": "https://example.com/files/brain_interface_intro.pdf",
        "downloadCount": 35,
        "description": "课程基础理论介绍"
      }
    ]
  }
}
```

#### 7.2 获取资源详情

- **URL**: `/api/resources/{id}/`
- **方法**: GET
- **描述**: 获取资源详细信息
- **请求头**:
  - Authorization: Bearer {token}
- **路径参数**: 
  - id: 资源ID

- **响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "name": "脑机接口导论.pdf",
    "type": "document",
    "size": "2.5MB",
    "uploadTime": "2023-03-01 10:30:00",
    "updateTime": "2023-03-01 10:30:00",
    "uploader": {
      "userId": "t20230001",
      "name": "张教授"
    },
    "url": "https://example.com/files/brain_interface_intro.pdf",
    "downloadCount": 35,
    "description": "课程基础理论介绍",
    "preview": {
      "available": true,
      "previewUrl": "https://example.com/preview/brain_interface_intro.pdf"
    },
    "metadata": {
      "pageCount": 30,
      "author": "张教授",
      "createTime": "2023-02-28"
    }
  }
}
```

#### 7.3 上传课程资源 (教师权限)

- **URL**: `/api/courses/{id}/resources/`
- **方法**: POST
- **描述**: 上传课程资源
- **请求头**:
  - Authorization: Bearer {token}
  - Content-Type: multipart/form-data
- **路径参数**: 
  - id: 课程ID
- **请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| file | file | 是 | 资源文件 |
| name | string | 否 | 资源名称，不填则使用文件名 |
| type | string | 否 | 资源类型，不填则自动识别 |
| description | string | 否 | 资源描述 |

- **响应示例**:

```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "id": 1,
    "name": "脑机接口导论.pdf",
    "url": "https://example.com/files/brain_interface_intro.pdf",
    "size": "2.5MB"
  }
}
```

#### 7.4 删除资源 (教师权限)

- **URL**: `/api/resources/{id}/`
- **方法**: DELETE
- **描述**: 删除资源
- **请求头**:
  - Authorization: Bearer {token}
- **路径参数**: 
  - id: 资源ID

- **响应示例**:

```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

#### 7.5 下载资源

- **URL**: `/api/resources/{id}/download/`
- **方法**: GET
- **描述**: 下载资源文件
- **请求头**:
  - Authorization: Bearer {token}
- **路径参数**: 
  - id: 资源ID

- **响应**: 文件流
- **Content-Type**: 根据文件类型自动设置
- **Content-Disposition**: attachment; filename="filename.ext"

### 8. 用户管理相关接口

#### 8.1 获取用户资料

- **URL**: `/api/users/profile/`
- **方法**: GET
- **描述**: 获取当前用户资料
- **请求头**:
  - Authorization: Bearer {token}

- **响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "userId": "s20230001",
    "username": "张三",
    "role": "student"
  }
}
```

#### 8.2 更新用户资料

- **URL**: `/api/users/profile/`
- **方法**: PUT
- **描述**: 更新当前用户资料
- **请求头**:
  - Authorization: Bearer {token} （JWT访问令牌）

- **请求体**:

```json
{
  "username": "张三",
  "email": "new_email@example.com",
  "avatar": "base64编码的图片数据"
}
```

- **响应示例**:

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "userId": "s20230001",
    "username": "张三",
    "email": "new_email@example.com"
  }
}
``` 