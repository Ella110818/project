# 学生课程信息系统API文档

## 基础信息

- 基础URL: `https://wstier477.pythonanywhere.com/api`
- 响应格式: JSON
- 鉴权方式: JWT Token

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
| email | string | 否 | 邮箱地址 |
| password | string | 是 | 密码 |
| role | string | 是 | 角色，可选值：'teacher'(教师),'student'(学生) |

- **请求示例**:

```json
{
  "userId": "s20230001",
  "username": "张三",
  "email": "zhangsan@example.com",
  "password": "SecurePassword123",
  "role": "student"
}
```

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

#### 1.2 用户登录

- **URL**: `/api/login/`
- **方法**: POST
- **描述**: 用户登录
- **请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| userId | string | 是 | 学工号（用于登录认证） |
| password | string | 是 | 密码 |

- **请求示例**:

```json
{
  "userId": "s20230001",
  "password": "SecurePassword123"
}
```

- **响应示例**:

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "userId": "s20230001",
    "username": "张三",
    "role": "student",
    "avatar": "https://example.com/avatar.png"
  }
}
```

- **错误响应示例**:

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
- **描述**: 用户退出登录
- **请求头**:
  - Authorization: Bearer {token} （JWT访问令牌）
  
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
- **描述**: 刷新JWT令牌
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

### 2. 课程信息相关接口

#### 2.1 获取课程列表

- **URL**: `/api/courses/`
- **方法**: GET
- **描述**: 获取用户有权限查看的所有课程
- **请求头**:
  - Authorization: Bearer {token} （JWT访问令牌）

- **响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "title": "脑机接口",
      "description": "本课程介绍脑机接口的基本原理与应用技术，探讨人脑与计算机直接通信的实现方法。",
      "teacherName": "张教授",
      "location": "主教学楼301",
      "studentCount": 35
    },
    {
      "id": 2,
      "title": "人工智能原理",
      "description": "介绍人工智能的核心概念、算法与实践应用，包括机器学习、深度学习等技术。",
      "teacherName": "李教授",
      "location": "理科楼B204",
      "studentCount": 42
    }
  ]
}
```

#### 2.2 获取课程详情

- **URL**: `/api/courses/{id}/`
- **方法**: GET
- **描述**: 获取特定课程的详细信息
- **请求参数**: 
   - id: 课程ID (路径参数)
- **请求头**:
  - Authorization: Bearer {token} （JWT访问令牌）

- **响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "title": "脑机接口",
    "description": "本课程介绍脑机接口的基本原理与应用技术，探讨人脑与计算机直接通信的实现方法。",
    "teacherName": "张教授",
    "location": "主教学楼301",
    "studentCount": 35,
    "schedule": "周二 14:00-16:00",
    "semester": "2023春季学期"
  }
}
```

### 3. 课程公告相关接口

#### 3.1 获取课程公告

- **URL**: `/api/courses/{id}/announcements/`
- **方法**: GET
- **描述**: 获取课程的所有公告
- **请求参数**: 
   - id: 课程ID (路径参数)
- **请求头**:
  - Authorization: Bearer {token} （JWT访问令牌）

- **响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "title": "关于期中考试安排的通知",
      "content": "各位同学，期中考试将于下周三进行，请做好准备。考试内容包括前六章的所有内容。",
      "time": "2023-04-15 14:30",
      "authorName": "张教授"
    },
    {
      "id": 2,
      "title": "本周课堂安排调整",
      "content": "由于学校活动，本周五的课程将调整到下周一下午2点，地点不变。请各位同学相互通知。",
      "time": "2023-04-10 09:15",
      "authorName": "张教授"
    }
  ]
}
```

#### 3.2 发布课程公告 (教师权限)

- **URL**: `/api/courses/{id}/announcements/`
- **方法**: POST
- **描述**: 为课程发布新公告
- **请求参数**: 
   - id: 课程ID (路径参数)
- **请求体**:

```json
{
  "title": "关于期末考试安排",
  "content": "期末考试将于6月20日上午9点在主教学楼301进行，请携带学生证按时参加。"
}
```

- **请求头**:
  - Authorization: Bearer {token} （JWT访问令牌）

- **响应示例**:

```json
{
  "code": 200,
  "message": "发布成功",
  "data": {
    "id": 3,
    "title": "关于期末考试安排",
    "time": "2023-06-10 15:30"
  }
}
```

### 4. 作业与考试相关接口

#### 4.1 获取作业和考试列表

- **URL**: `/api/courses/{id}/assignments/`
- **方法**: GET
- **描述**: 获取课程的所有作业和考试
- **请求参数**: 
   - id: 课程ID (路径参数)
   - type: 类型筛选 (查询参数，可选，例如: homework/exam)
- **请求头**:
  - Authorization: Bearer {token} （JWT访问令牌）

- **响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "title": "脑机接口第一次作业",
      "type": "homework",
      "status": "已批改",
      "deadline": "2023-03-20 23:59",
      "score": 100,
      "description": "完成教材第一章的习题"
    },
    {
      "id": 2,
      "title": "期中考试",
      "type": "exam",
      "status": "进行中",
      "examTime": "2023-04-20 14:00",
      "duration": 120,
      "totalScore": 100
    }
  ]
}
```

#### 4.2 获取作业/考试详情

- **URL**: `/api/assignments/{id}/`
- **方法**: GET
- **描述**: 获取作业或考试的详细信息
- **请求参数**: 
   - id: 作业/考试ID (路径参数)
- **请求头**:
  - Authorization: Bearer {token} （JWT访问令牌）

- **响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "title": "脑机接口第一次作业",
    "type": "homework",
    "status": "已批改",
    "deadline": "2023-03-20 23:59",
    "score": 100,
    "description": "完成教材第一章的习题",
    "submitStatus": "已提交",
    "submitTime": "2023-03-19 22:30",
    "grade": 90,
    "feedback": "作业完成得很好，概念理解清晰，但第3题有些小错误。"
  }
}
```

#### 4.3 提交作业

- **URL**: `/api/assignments/{id}/submit/`
- **方法**: POST
- **描述**: 提交作业
- **请求参数**: 
   - id: 作业ID (路径参数)
- **请求头**:
  - Authorization: Bearer {token} （JWT访问令牌）
  - Content-Type: multipart/form-data

- **请求体**:
  - 表单数据，包含提交的文件和答案

- **响应示例**:

```json
{
  "code": 200,
  "message": "提交成功",
  "data": {
    "submitTime": "2023-04-18 15:30:22"
  }
}
```

#### 4.4 发布作业/考试 (教师权限)

- **URL**: `/api/courses/{id}/assignments/`
- **方法**: POST
- **描述**: 为课程发布新作业/考试
- **请求参数**: 
   - id: 课程ID (路径参数)
- **请求头**:
  - Authorization: Bearer {token} （JWT访问令牌）

- **请求体**:

```json
{
  "title": "脑机接口第二次作业",
  "type": "homework",
  "deadline": "2023-05-15 23:59",
  "score": 100,
  "description": "完成教材第三章的习题"
}
```

- **响应示例**:

```json
{
  "code": 200,
  "message": "发布成功",
  "data": {
    "id": 3,
    "title": "脑机接口第二次作业"
  }
}
```

### 5. 成绩相关接口

#### 5.1 获取学生成绩单

- **URL**: `/api/courses/{id}/grades/`
- **方法**: GET
- **描述**: 获取学生在该课程的成绩
- **请求参数**: 
   - id: 课程ID (路径参数)
- **请求头**:
  - Authorization: Bearer {token} （JWT访问令牌）

- **响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "averageScore": 87.5,
    "highestScore": 95,
    "lowestScore": 75,
    "assessmentScheme": [
      { "name": "课堂表现", "weight": 30 },
      { "name": "作业", "weight": 20 },
      { "name": "考试", "weight": 50 }
    ],
    "grades": [
      {
        "id": 1,
        "name": "课堂表现",
        "type": "class",
        "score": 27,
        "fullScore": 30
      },
      {
        "id": 2,
        "name": "第一次作业",
        "type": "homework",
        "score": 18,
        "fullScore": 20,
        "submitTime": "2023-03-19 22:30"
      },
      {
        "id": 3,
        "name": "期中考试",
        "type": "exam",
        "score": 42.5,
        "fullScore": 50,
        "submitTime": "2023-04-20 15:30"
      }
    ]
  }
}
```

#### 5.2 批改作业/考试 (教师权限)

- **URL**: `/api/assignments/{id}/grade/`
- **方法**: POST
- **描述**: 为学生的作业或考试评分
- **请求参数**: 
   - id: 作业/考试ID (路径参数)
- **请求头**:
  - Authorization: Bearer {token} （JWT访问令牌）

- **请求体**:

```json
{
  "studentId": "s20230001",
  "score": 90,
  "feedback": "作业完成得很好，概念理解清晰，但第3题有些小错误。"
}
```

- **响应示例**:

```json
{
  "code": 200,
  "message": "评分成功",
  "data": null
}
```

### 6. 课程资源相关接口

#### 6.1 获取课程资源

- **URL**: `/api/courses/{id}/resources/`
- **方法**: GET
- **描述**: 获取课程的所有资源
- **请求参数**: 
   - id: 课程ID (路径参数)
   - type: 资源类型 (查询参数，可选)
- **请求头**:
  - Authorization: Bearer {token} （JWT访问令牌）

- **响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "name": "脑机接口导论.pdf",
      "type": "document",
      "size": "2.5MB",
      "uploadTime": "2023-03-01",
      "uploader": "张教授",
      "url": "https://example.com/files/brain_interface_intro.pdf"
    },
    {
      "id": 2,
      "name": "脑机接口技术演示视频.mp4",
      "type": "video",
      "size": "68MB",
      "uploadTime": "2023-03-15",
      "uploader": "张教授",
      "url": "https://example.com/files/demo_video.mp4"
    }
  ]
}
```

#### 6.2 上传课程资源 (教师权限)

- **URL**: `/api/courses/{id}/resources/`
- **方法**: POST
- **描述**: 上传课程资源
- **请求参数**: 
   - id: 课程ID (路径参数)
- **请求头**:
  - Authorization: Bearer {token} （JWT访问令牌）
  - Content-Type: multipart/form-data

- **请求体**:
  - file: 文件数据
  - type: 资源类型
  - name: 资源名称

- **响应示例**:

```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "id": 3,
    "name": "期中复习资料.pdf",
    "url": "https://example.com/files/midterm_review.pdf"
  }
}
```

#### 6.3 下载课程资源

- **URL**: `/api/resources/{id}/download/`
- **方法**: GET
- **描述**: 下载特定资源
- **请求参数**: 
   - id: 资源ID (路径参数)
- **请求头**:
  - Authorization: Bearer {token} （JWT访问令牌）

- **响应**: 文件流

### 7. 学情分析相关接口

#### 7.1 获取学情数据

- **URL**: `/api/courses/{id}/learning-review/`
- **方法**: GET
- **描述**: 获取学生在课程中的学习情况统计
- **请求参数**: 
   - id: 课程ID (路径参数)
   - date: 日期 (查询参数，可选)
- **请求头**:
  - Authorization: Bearer {token} （JWT访问令牌）

- **响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "attendance": {
      "rate": 85,
      "total": 15,
      "attended": 13,
      "details": [
        {"date": "2023-03-01", "status": "attended"},
        {"date": "2023-03-08", "status": "attended"},
        {"date": "2023-03-15", "status": "missed"},
        {"date": "2023-03-22", "status": "attended"}
      ]
    },
    "performance": {
      "rate": 78,
      "classInteraction": 25
    },
    "calendarData": [
      {"date": "2023-03-01", "hasClass": true},
      {"date": "2023-03-02", "hasClass": false},
      {"date": "2023-03-03", "hasClass": true}
    ]
  }
}
```

#### 7.2 获取课程日历数据

- **URL**: `/api/courses/{id}/calendar/`
- **方法**: GET
- **描述**: 获取课程的日历数据
- **请求参数**: 
   - id: 课程ID (路径参数)
   - month: 月份 (查询参数，可选，格式YYYY-MM)
- **请求头**:
  - Authorization: Bearer {token} （JWT访问令牌）

- **响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "month": "2023-03",
    "days": [
      {"date": "2023-03-01", "hasClass": true},
      {"date": "2023-03-02", "hasClass": false},
      {"date": "2023-03-03", "hasClass": true}
    ]
  }
}
```

### 8. 用户管理相关接口

#### 8.1 获取用户资料

- **URL**: `/api/users/profile/`
- **方法**: GET
- **描述**: 获取当前用户资料
- **请求头**:
  - Authorization: Bearer {token} （JWT访问令牌）

- **响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "userId": "s20230001",
    "username": "张三",
    "email": "zhangsan@example.com",
    "role": "student",
    "avatar": "https://example.com/avatar.png"
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