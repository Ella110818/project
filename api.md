# 智慧课堂系统 API 接口文档

## 目录

- [用户管理](#用户管理)
- [课程管理](#课程管理)
- [人脸识别](#人脸识别)
- [高级功能](#高级功能)
- [系统功能](#系统功能)

## 用户管理

### 认证相关

#### 用户注册

- **接口路径**：`/api/user/register/`
- **方法**：POST
- **权限**：无需登录
- **请求参数**：
  - `username`：用户名
  - `password`：密码
  - `email`：邮箱
  - `role`：角色（student/teacher）
  - `name`：姓名
  - `phone`（可选）：手机号

- **返回数据**：
```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "userId": "用户ID",
    "username": "用户名"
  }
}
```

- **错误情况**：
```json
{
  "code": 1001,
  "message": "用户名已存在",
  "data": null
}
```
或
```json
{
  "code": 1002,
  "message": "邮箱已存在",
  "data": null
}
```

#### 用户登录

- **接口路径**：`/api/user/login/`
- **方法**：POST
- **权限**：无需登录
- **请求参数**：
  - `username`：用户名
  - `password`：密码

- **返回数据**：
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "访问令牌",
    "userId": "用户ID",
    "username": "用户名",
    "role": "用户角色",
    "avatar": "头像URL"
  }
}
```

- **错误情况**：
```json
{
  "code": 1003,
  "message": "用户名或密码错误",
  "data": null
}
```

#### 用户登出

- **接口路径**：`/api/user/logout/`
- **方法**：POST
- **权限**：无需登录
- **返回数据**：
```json
{
  "code": 200,
  "message": "退出成功",
  "data": null
}
```

#### 刷新令牌

- **接口路径**：`/api/user/token/refresh/`
- **方法**：POST
- **权限**：无需登录
- **请求参数**：
  - `refresh`：刷新令牌

- **返回数据**：
```json
{
  "access": "新的访问令牌"
}
```

### 用户消息相关

#### 获取用户消息

- **接口路径**：`/api/user/user/messages/`
- **方法**：GET
- **权限**：无需登录
- **请求参数**：
  - `user_id`：用户ID

- **返回数据**：
```json
{
  "code": 200,
  "message": "获取用户消息成功",
  "data": {
    "userId": "用户ID",
    "username": "用户名",
    "name": "姓名",
    "email": "邮箱",
    "phone": "手机号",
    "role": "角色",
    "avatar": "头像URL",
    "student_detail": {
      "student_id": "学生ID",
      "class_id": "班级ID",
      "class_detail": {
        "class_id": "班级ID",
        "class_name": "班级名称",
        "class_system": "所属系统"
      },
      "statuses": [
        {
          "id": "状态ID",
          "concentrate": "专注度",
          "sleepy": "瞌睡状态",
          "low_head": "低头状态",
          "half": "半身状态",
          "puzzle": "疑惑状态",
          "if_come": "是否出席",
          "course_time": "课程时间ID",
          "course_time_detail": {
            "id": "课程时间ID",
            "begin_time": "开始时间",
            "end_time": "结束时间",
            "course": "课程ID",
            "course_name": "课程名称"
          }
        }
      ],
      "courses": [
        {
          "id": "学生课程ID",
          "course": "课程ID",
          "course_detail": {
            "course_id": "课程ID",
            "title": "课程标题",
            "description": "课程描述",
            "location": "上课地点",
            "system": "所属系统",
            "schedule": "课程安排",
            "semester": "学期"
          }
        }
      ]
    },
    "teacher_detail": null
  }
}
```

- **错误情况**：
```json
{
  "code": 400,
  "message": "用户ID不能为空",
  "data": null
}
```
或
```json
{
  "code": 404,
  "message": "用户不存在",
  "data": null
}
```

#### 根据用户ID获取消息

- **接口路径**：`/api/user/user/messages/`
- **方法**：POST
- **权限**：无需登录
- **请求参数**：
  - `user_id`：用户ID

- **返回数据**：
```json
{
  "code": 200,
  "message": "获取用户消息成功",
  "data": {
    // 与GET方法相同的响应结构
  }
}
```

- **错误情况**：
```json
{
  "code": 400,
  "message": "用户ID不能为空",
  "data": null
}
```
或
```json
{
  "code": 404,
  "message": "用户不存在",
  "data": null
}
```
或
```json
{
  "code": 500,
  "message": "服务器错误: [错误详情]",
  "data": null
}
```

## 课程管理

### 课程相关

#### 获取课程列表

- **接口路径**：`/api/course/courses/`
- **方法**：GET
- **权限**：需要登录
- **请求参数**：
  - `page`（可选）：页码，默认为1
  - `size`（可选）：每页数量，默认为10

- **返回数据**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 总数量,
    "items": [
      {
        "course_id": "课程ID",
        "title": "课程标题",
        "teacher": "教师ID",
        "description": "课程描述",
        "location": "上课地点",
        "system": "所属系统",
        "schedule": "课程安排",
        "semester": "学期"
      }
    ]
  }
}
```

#### 获取课程详情

- **接口路径**：`/api/course/courses/<str:course_id>/`
- **方法**：GET
- **权限**：需要登录，且为该课程的教师或学生
- **返回数据**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "course_id": "课程ID",
    "title": "课程标题",
    "teacher": "教师ID",
    "description": "课程描述",
    "location": "上课地点",
    "system": "所属系统",
    "schedule": "课程安排",
    "semester": "学期",
    // 其他全部字段
  }
}
```

### 课程资源相关

#### 获取课程资源列表

- **接口路径**：`/api/course/courses/<str:course_id>/resources/`
- **方法**：GET
- **权限**：需要登录，且为该课程的教师或学生
- **请求参数**：
  - `type`（可选）：资源类型筛选
  - `search`（可选）：搜索关键词（搜索资源名称和描述）
  - `page`（可选）：页码，默认为1
  - `size`（可选）：每页数量，默认为10

- **返回数据**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 总数量,
    "items": [
      {
        "id": 资源ID,
        "name": "资源名称",
        "type": "资源类型",
        "description": "资源描述",
        "upload_time": "上传时间"
      }
    ]
  }
}
```

#### 上传课程资源

- **接口路径**：`/api/course/courses/<str:course_id>/resources/`
- **方法**：POST
- **权限**：需要登录，且为该课程的教师
- **请求参数**：
  - `file`：上传的文件
  - `name`（可选）：资源名称，默认为文件名
  - `type`（可选）：资源类型，默认为document
  - `description`（可选）：资源描述

- **返回数据**：
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "id": 资源ID,
    "name": "资源名称",
    "type": "资源类型",
    "description": "资源描述",
    "upload_time": "上传时间"
  }
}
```

#### 获取资源详情

- **接口路径**：`/api/course/resources/<int:resource_id>/`
- **方法**：GET
- **权限**：需要登录，且为该资源所属课程的教师或学生
- **返回数据**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 资源ID,
    "name": "资源名称",
    "type": "资源类型",
    "description": "资源描述",
    "file": "文件URL",
    "size": "文件大小",
    "course": "所属课程ID",
    "uploader": "上传者ID",
    "upload_time": "上传时间",
    "download_count": 下载次数
    // 所有字段
  }
}
```

#### 删除资源

- **接口路径**：`/api/course/resources/<int:resource_id>/`
- **方法**：DELETE
- **权限**：需要登录，且为该资源的上传者或所属课程的教师
- **返回数据**：
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

#### 下载资源

- **接口路径**：`/api/course/resources/<int:resource_id>/download/`
- **方法**：GET
- **权限**：需要登录，且为该资源所属课程的教师或学生
- **返回数据**：
  - 成功时返回文件流
  - 失败时返回：
```json
{
  "code": 200,
  "message": "下载链接生成成功",
  "data": {
    "downloadUrl": "下载链接URL"
  }
}
```

## 人脸识别

### 插入单个人脸

- **接口路径**：`/face_recognition/insert_face/`
- **方法**：POST
- **请求参数**：
  - `image`：人脸图像文件，文件名格式为`姓名_ID.扩展名`，如`张三_1.jpg`

- **返回数据**：
```json
{
  "status": "success",
  "message": "成功添加/更新张三的人脸",
  "id": 1
}
```

- **错误情况**：
```json
{
  "status": "error",
  "message": "未检测到人脸"
}
```
或
```json
{
  "status": "error",
  "message": "检测到多个人脸(2个)，请提供单人照片"
}
```

### 批量插入人脸

- **接口路径**：`/face_recognition/batch_insert_faces/`
- **方法**：POST
- **说明**：此功能目前尚未完全实现，仅返回测试数据

- **返回数据**：
```json
{
  "status": "success",
  "message": "测试模式：批量插入人脸功能暂未实现",
  "details": {
    "success": [],
    "failed": []
  }
}
```

### 人脸识别考勤

- **接口路径**：`/face_recognition/check_attendance/`
- **方法**：POST
- **请求参数**：
  - `image`：包含多个人脸的图像文件

- **返回数据**：
```json
{
  "status": "success",
  "message": "已生成考勤记录，检测到5个人脸，识别出3人",
  "file_path": "attendance_records/attendance_20230520_120000.txt",
  "attendance_records": [
    {
      "id": 1,
      "name": "张三",
      "present": 1,
      "confidence": 0.85
    },
    {
      "id": 2,
      "name": "李四",
      "present": 1,
      "confidence": 0.78
    },
    {
      "id": 3,
      "name": "王五",
      "present": 1,
      "confidence": 0.92
    },
    {
      "id": -1,
      "name": "未知",
      "present": 0,
      "confidence": 0.42
    },
    {
      "id": -1,
      "name": "未知",
      "present": 0,
      "confidence": 0.31
    }
  ]
}
```

- **错误情况**：
```json
{
  "status": "error",
  "message": "未检测到人脸"
}
```
或
```json
{
  "status": "error",
  "message": "数据库中没有已知人脸数据"
}
```

### 下载考勤文件

- **接口路径**：`/face_recognition/download_attendance_file/`
- **方法**：GET
- **请求参数**：
  - `filename`：考勤文件名

- **返回数据**：
  - 成功时返回文件流，内容格式为：`ID 姓名 出勤状态`
  - 失败时返回：
```json
{
  "status": "error",
  "message": "文件不存在"
}
```
或
```json
{
  "status": "error",
  "message": "未指定文件名"
}
```

## 高级功能

### 课程公告

#### 获取课程公告列表

- **接口路径**：`/api/advanced/courses/<int:course_id>/announcements/`
- **方法**：GET
- **权限**：需要登录，且为该课程的教师或学生
- **请求参数**：
  - `type`（可选）：公告类型筛选
  - `page`（可选）：页码，默认为1
  - `size`（可选）：每页数量，默认为10

- **返回数据**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 总数量,
    "items": [
      {
        "id": 公告ID,
        "title": "公告标题",
        "content": "公告内容",
        "type": "公告类型",
        "publisher_info": {
          // 发布者信息
        },
        "created_at": "创建时间",
        "updated_at": "更新时间"
      }
    ]
  }
}
```

#### 发布课程公告

- **接口路径**：`/api/advanced/courses/<int:course_id>/announcements/`
- **方法**：POST
- **权限**：需要登录，且为该课程的教师
- **请求参数**：
  - `title`：公告标题
  - `content`：公告内容
  - `type`：公告类型

- **返回数据**：
```json
{
  "code": 200,
  "message": "发布成功",
  "data": {
    "id": 公告ID,
    "title": "公告标题",
    "content": "公告内容",
    "type": "公告类型",
    "publisher_info": {
      // 发布者信息
    },
    "created_at": "创建时间",
    "updated_at": "更新时间"
  }
}
```

### 作业与考试

#### 获取作业和考试列表

- **接口路径**：`/api/advanced/courses/<int:course_id>/assignments/`
- **方法**：GET
- **权限**：需要登录，且为该课程的教师或学生
- **请求参数**：
  - `type`（可选）：作业/考试类型筛选
  - `status`（可选）：状态筛选
  - `page`（可选）：页码，默认为1
  - `size`（可选）：每页数量，默认为10

- **返回数据**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 总数量,
    "items": [
      {
        "id": 作业ID,
        "title": "作业标题",
        "type": "作业类型",
        "description": "作业描述",
        "start_time": "开始时间",
        "deadline": "截止时间",
        "status": "状态",
        "full_score": 满分,
        "submitted": 已提交数量,
        "total": 总学生数量
      }
    ]
  }
}
```

#### 发布作业或考试

- **接口路径**：`/api/advanced/courses/<int:course_id>/assignments/`
- **方法**：POST
- **权限**：需要登录，且为该课程的教师
- **请求参数**：
  - `title`：作业标题
  - `type`：作业类型
  - `description`：作业描述
  - `start_time`：开始时间
  - `deadline`：截止时间
  - `full_score`：满分

- **返回数据**：
```json
{
  "code": 200,
  "message": "发布成功",
  "data": {
    "id": 作业ID,
    "title": "作业标题",
    "type": "作业类型",
    "description": "作业描述",
    "start_time": "开始时间",
    "deadline": "截止时间",
    "status": "状态",
    "full_score": 满分,
    "submitted": 0,
    "total": 总学生数量
  }
}
```

### 分组管理

#### 获取课程分组列表

- **接口路径**：`/api/advanced/courses/<int:course_id>/groups/`
- **方法**：GET
- **权限**：需要登录，且为该课程的教师或学生
- **返回数据**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "unassignedStudents": [
      {
        "id": 学生ID,
        "name": "学生姓名",
        "studentId": "学号",
        "avatar": "头像URL"
      }
    ],
    "groups": [
      {
        "id": 分组ID,
        "name": "分组名称",
        "students": [
          {
            "id": 学生ID,
            "name": "学生姓名",
            "studentId": "学号",
            "avatar": "头像URL"
          }
        ]
      }
    ]
  }
}
```

#### 创建或更新分组

- **接口路径**：`/api/advanced/courses/<int:course_id>/groups/`
- **方法**：POST
- **权限**：需要登录，且为该课程的教师
- **请求参数**：
  - `name`：分组名称
  - `studentIds`：学生ID列表

- **返回数据**：
```json
{
  "code": 200,
  "message": "创建成功/更新成功",
  "data": {
    "id": 分组ID,
    "name": "分组名称",
    "students": [
      {
        "id": 学生ID,
        "name": "学生姓名",
        "studentId": "学号",
        "avatar": "头像URL"
      }
    ]
  }
}
```

#### 自动分组

- **接口路径**：`/api/advanced/courses/<int:course_id>/groups/auto`
- **方法**：POST
- **权限**：需要登录，且为该课程的教师
- **请求参数**：
  - `groupCount`：分组数量
  - `method`：分组方法，默认为"random"

- **返回数据**：
```json
{
  "code": 200,
  "message": "自动分组成功",
  "data": {
    "groups": [
      {
        "id": 分组ID,
        "name": "分组名称",
        "students": [
          {
            "id": 学生ID,
            "name": "学生姓名",
            "studentId": "学号",
            "avatar": "头像URL"
          }
        ]
      }
    ]
  }
}
```

## 系统功能

| 接口路径 | 方法 | 描述 |
| --- | --- | --- |
| `/csrf/` | GET | 设置CSRF Cookie |
| `/swagger/` | GET | Swagger API文档 |
| `/redoc/` | GET | ReDoc API文档 