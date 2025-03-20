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

- **URL**: `/api/login/`
- **方法**: POST
- **描述**: 用户登录并获取访问令牌
- **请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| userId | string | 是 | 学工号 |
| password | string | 是 | 密码 |

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
- **查询参数**:
  - role: string (可选) - 按角色筛选，可选值：'teacher', 'student'
  - semester: string (可选) - 按学期筛选，例如：'2023-spring'

- **响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "title": "脑机接口",
      "description": "本课程介绍脑机接口的基本原理与应用技术",
      "teacherName": "张教授",
      "location": "主教学楼301",
      "studentCount": 35,
      "semester": "2023春季学期"
    }
  ]
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
    "id": 1,
    "title": "脑机接口",
    "description": "本课程介绍脑机接口的基本原理与应用技术",
    "teacherName": "张教授",
    "location": "主教学楼301",
    "studentCount": 35,
    "semester": "2023春季学期",
    "assessmentScheme": [
      { "name": "课堂表现", "weight": 30 },
      { "name": "作业", "weight": 20 },
      { "name": "考试", "weight": 50 }
    ]
  }
}
```

#### 2.3 创建新课程 (教师权限)

- **URL**: `/api/courses/`
- **方法**: POST
- **描述**: 创建新课程
- **请求头**:
  - Authorization: Bearer {token}
- **请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| title | string | 是 | 课程名称 |
| description | string | 是 | 课程描述 |
| location | string | 是 | 上课地点 |
| semester | string | 是 | 学期 |

- **响应示例**:

```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 1,
    "title": "脑机接口"
  }
}
```

#### 2.4 更新课程信息 (教师权限)

- **URL**: `/api/courses/{id}/`
- **方法**: PUT
- **描述**: 更新课程信息
- **请求头**:
  - Authorization: Bearer {token}
- **路径参数**: 
  - id: 课程ID
- **请求参数**: 同创建课程

- **响应示例**:

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 1,
    "title": "脑机接口（更新）"
  }
}
```

#### 2.5 删除课程 (教师权限)

- **URL**: `/api/courses/{id}/`
- **方法**: DELETE
- **描述**: 删除课程
- **请求头**:
  - Authorization: Bearer {token}
- **路径参数**: 
  - id: 课程ID

- **响应示例**:

```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
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
        "title": "关于期中考试安排的通知",
        "content": "各位同学，期中考试将于下周三进行，请做好准备。",
        "createTime": "2023-04-15 14:30",
        "updateTime": "2023-04-15 14:30",
        "authorName": "张教授",
        "important": true
      }
    ]
  }
}
```

#### 3.2 获取公告详情

- **URL**: `/api/announcements/{id}/`
- **方法**: GET
- **描述**: 获取公告详细信息
- **请求头**:
  - Authorization: Bearer {token}
- **路径参数**: 
  - id: 公告ID

- **响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "title": "关于期中考试安排的通知",
    "content": "各位同学，期中考试将于下周三进行，请做好准备。",
    "createTime": "2023-04-15 14:30",
    "updateTime": "2023-04-15 14:30",
    "authorName": "张教授",
    "important": true,
    "attachments": [
      {
        "id": 1,
        "name": "考试大纲.pdf",
        "url": "https://example.com/files/exam_outline.pdf",
        "size": "1.2MB"
      }
    ]
  }
}
```

#### 3.3 发布课程公告 (教师权限)

- **URL**: `/api/courses/{id}/announcements/`
- **方法**: POST
- **描述**: 为课程发布新公告
- **请求头**:
  - Authorization: Bearer {token}
  - Content-Type: multipart/form-data
- **路径参数**: 
  - id: 课程ID
- **请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| title | string | 是 | 公告标题 |
| content | string | 是 | 公告内容 |
| important | boolean | 否 | 是否重要公告，默认false |
| attachments | file[] | 否 | 附件文件列表 |

- **响应示例**:

```json
{
  "code": 200,
  "message": "发布成功",
  "data": {
    "id": 1,
    "title": "关于期中考试安排的通知",
    "createTime": "2023-04-15 14:30"
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
  - status: string (可选) - 状态筛选，可选值：'not_started'(未开始),'in_progress'(进行中),'ended'(已结束)
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
        "title": "脑机接口第一次作业",
        "type": "homework",
        "status": "已批改",
        "startTime": "2023-03-10 00:00",
        "deadline": "2023-03-20 23:59",
        "score": 100,
        "description": "完成教材第一章的习题",
        "submitStatus": "已提交",
        "submitTime": "2023-03-19 22:30",
        "grade": 90
      },
      {
        "id": 2,
        "title": "期中考试",
        "type": "exam",
        "status": "进行中",
        "startTime": "2023-04-20 14:00",
        "endTime": "2023-04-20 16:00",
        "duration": 120,
        "totalScore": 100,
        "submitStatus": "未提交"
      }
    ]
  }
}
```

#### 4.2 获取作业/考试详情

- **URL**: `/api/assignments/{id}/`
- **方法**: GET
- **描述**: 获取作业或考试的详细信息
- **请求头**:
  - Authorization: Bearer {token}
- **路径参数**: 
  - id: 作业/考试ID

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
    "startTime": "2023-03-10 00:00",
    "deadline": "2023-03-20 23:59",
    "score": 100,
    "description": "完成教材第一章的习题",
    "submitStatus": "已提交",
    "submitTime": "2023-03-19 22:30",
    "grade": 90,
    "feedback": "作业完成得很好，概念理解清晰，但第3题有些小错误。",
    "attachments": [
      {
        "id": 1,
        "name": "作业要求.pdf",
        "url": "https://example.com/files/homework_requirements.pdf",
        "size": "500KB"
      }
    ]
  }
}
```

#### 4.3 提交作业/考试

- **URL**: `/api/assignments/{id}/submit/`
- **方法**: POST
- **描述**: 提交作业或考试答案
- **请求头**:
  - Authorization: Bearer {token}
  - Content-Type: multipart/form-data
- **路径参数**: 
  - id: 作业/考试ID
- **请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| answers | object[] | 是 | 答案列表，每个对象包含questionId和answer字段 |
| attachments | file[] | 否 | 附件文件列表 |

- **响应示例**:

```json
{
  "code": 200,
  "message": "提交成功",
  "data": {
    "submitTime": "2023-04-18 15:30:22",
    "submitStatus": "已提交"
  }
}
```

#### 4.4 发布作业/考试 (教师权限)

- **URL**: `/api/courses/{id}/assignments/`
- **方法**: POST
- **描述**: 发布新作业或考试
- **请求头**:
  - Authorization: Bearer {token}
  - Content-Type: multipart/form-data
- **路径参数**: 
  - id: 课程ID
- **请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| title | string | 是 | 标题 |
| type | string | 是 | 类型：'homework'或'exam' |
| description | string | 是 | 描述 |
| startTime | string | 是 | 开始时间 |
| deadline/endTime | string | 是 | 截止/结束时间 |
| totalScore | number | 是 | 总分 |
| questions | object[] | 是 | 题目列表 |
| attachments | file[] | 否 | 附件文件列表 |

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

#### 5.1 获取课程成绩概览

- **URL**: `/api/courses/{id}/grades/overview/`
- **方法**: GET
- **描述**: 获取课程的成绩统计信息
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
    "averageScore": 87.5,
    "highestScore": 95,
    "lowestScore": 75,
    "distribution": [
      { "range": "90-100", "count": 10 },
      { "range": "80-89", "count": 15 },
      { "range": "70-79", "count": 8 },
      { "range": "60-69", "count": 2 },
      { "range": "0-59", "count": 0 }
    ],
    "assessmentScheme": [
      { "name": "课堂表现", "weight": 30 },
      { "name": "作业", "weight": 20 },
      { "name": "考试", "weight": 50 }
    ]
  }
}
```

#### 5.2 获取课程成绩列表

- **URL**: `/api/courses/{id}/grades/`
- **方法**: GET
- **描述**: 获取课程的所有学生成绩
- **请求头**:
  - Authorization: Bearer {token}
- **路径参数**: 
  - id: 课程ID
- **查询参数**:
  - sort: string (可选) - 排序字段，可选值：'totalScore', 'classScore', 'homeworkScore', 'examScore'
  - order: string (可选) - 排序方式，可选值：'asc', 'desc'
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
        "studentId": "s20230001",
        "name": "张三",
        "totalScore": 87.5,
        "classScore": 27,
        "homeworkScore": 18,
        "examScore": 42.5,
        "rank": 1
      }
    ]
  }
}
```

#### 5.3 获取学生个人成绩

- **URL**: `/api/courses/{id}/grades/{studentId}/`
- **方法**: GET
- **描述**: 获取特定学生在课程中的详细成绩
- **请求头**:
  - Authorization: Bearer {token}
- **路径参数**: 
  - id: 课程ID
  - studentId: 学生ID

- **响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "studentInfo": {
      "studentId": "s20230001",
      "name": "张三",
      "avatar": "https://example.com/avatar.png"
    },
    "totalScore": 87.5,
    "rank": 1,
    "components": [
      {
        "name": "课堂表现",
        "score": 27,
        "fullScore": 30,
        "weight": 30,
        "details": [
          {
            "date": "2023-03-01",
            "score": 9,
            "fullScore": 10,
            "comment": "课堂参与度高"
          }
        ]
      },
      {
        "name": "作业",
        "score": 18,
        "fullScore": 20,
        "weight": 20,
        "details": [
          {
            "title": "第一次作业",
            "score": 9,
            "fullScore": 10,
            "submitTime": "2023-03-19 22:30",
            "feedback": "完成得很好"
          }
        ]
      },
      {
        "name": "考试",
        "score": 42.5,
        "fullScore": 50,
        "weight": 50,
        "details": [
          {
            "title": "期中考试",
            "score": 42.5,
            "fullScore": 50,
            "examTime": "2023-04-20 14:00",
            "feedback": "整体表现良好"
          }
        ]
      }
    ]
  }
}
```



### 6. 课程资源相关接口

#### 6.1 获取课程资源列表

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

#### 6.2 获取资源详情

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

#### 6.3 上传课程资源 (教师权限)

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


#### 6.5 删除资源 (教师权限)

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

#### 6.6 下载资源

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

### 7. 学情分析相关接口



#### 7.2 获取学生个人学情分析

- **URL**: `/api/courses/{id}/learning-analytics/students/{studentId}/`
- **方法**: GET
- **描述**: 获取特定学生的学习情况分析
- **请求头**:
  - Authorization: Bearer {token}
- **路径参数**: 
  - id: 课程ID
  - studentId: 学生ID
- **查询参数**:
  - startDate: string (可选) - 开始日期，格式：YYYY-MM-DD
  - endDate: string (可选) - 结束日期，格式：YYYY-MM-DD

- **响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "studentInfo": {
      "studentId": "s20230001",
      "name": "张三",
      "avatar": "https://example.com/avatar.png"
    },
    "attendance": {
      "rate": 93.3,
      "total": 15,
      "attended": 14,
      "details": [
        {
          "date": "2023-03-01",
          "status": "attended",
          "duration": 90,
          "note": "准时到课"
        }
      ]
    },
    "performance": {
      "overallScore": 87.5,
      "rank": 5,
      "trend": [
        {
          "date": "2023-03-01",
          "score": 85
        }
      ]
    },
    "participation": {
      "classInteraction": 25,
      "questionCount": 8,
      "answerCount": 12,
      "discussionCount": 5
    },
    "assignments": {
      "submissionRate": 100,
      "averageScore": 88.5,
      "details": [
        {
          "id": 1,
          "title": "第一次作业",
          "submitTime": "2023-03-19 22:30",
          "score": 90,
          "classAverage": 85
        }
      ]
    },
    "learningBehavior": {
      "resourceAccess": {
        "total": 45,
        "distribution": {
          "document": 25,
          "video": 15,
          "other": 5
        }
      },
      "onlineDuration": {
        "total": 1200,
        "averagePerDay": 80,
        "distribution": {
          "morning": 400,
          "afternoon": 600,
          "evening": 200
        }
      }
    }
  }
}
```

#### 7.3 获取课程日历数据

- **URL**: `/api/courses/{id}/calendar/`
- **方法**: GET
- **描述**: 获取课程的日历数据，包括课程安排、作业和考试日期等
- **请求头**:
  - Authorization: Bearer {token}
- **路径参数**: 
  - id: 课程ID
- **查询参数**:
  - month: string (可选) - 月份，格式：YYYY-MM
  - type: string (可选) - 事件类型筛选，可选值：'class'(课程),'homework'(作业),'exam'(考试),'all'(默认)

- **响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "month": "2023-03",
    "events": [
      {
        "date": "2023-03-01",
        "type": "class",
        "title": "第一节课",
        "startTime": "14:00",
        "endTime": "15:30",
        "location": "主教学楼301"
      },
      {
        "date": "2023-03-15",
        "type": "homework",
        "title": "第一次作业",
        "deadline": "23:59",
        "status": "not_started"
      },
      {
        "date": "2023-03-20",
        "type": "exam",
        "title": "期中考试",
        "startTime": "14:00",
        "endTime": "16:00",
        "location": "主教学楼301"
      }
    ]
  }
}
```

#### 7.4 获取学习预警信息 (教师权限)

- **URL**: `/api/courses/{id}/learning-analytics/warnings/`
- **方法**: GET
- **描述**: 获取需要特别关注的学生学习预警信息
- **请求头**:
  - Authorization: Bearer {token}
- **路径参数**: 
  - id: 课程ID
- **查询参数**:
  - type: string (可选) - 预警类型，可选值：'attendance'(出勤),'performance'(成绩),'participation'(参与度),'all'(默认)
  - severity: string (可选) - 严重程度，可选值：'high'(严重),'medium'(中等),'low'(轻微)

- **响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 5,
    "items": [
      {
        "studentId": "s20230001",
        "name": "张三",
        "type": "attendance",
        "severity": "high",
        "description": "连续3次未到课",
        "createTime": "2023-03-15 10:30:00",
        "suggestions": [
          "建议与学生沟通了解情况",
          "可考虑调整考勤方式"
        ]
      }
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