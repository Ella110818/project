# 智库API接口文档


线上后端的部署地址为https://wstier477.pythonanywhere.com/
## 基础信息

- 基础URL: `/api`
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
| 10000 | 用户不存在 |
| 10001 | 用户名或密码错误 |
| 10002 | 用户名已存在 |
| 10003 | 邮箱已存在 |
| 10004 | 旧密码无效 |

## 接口列表

### 1. 注册

- **URL**: `/api/register/`
- **方法**: POST
- **描述**: 用户注册
- **请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码（需通过密码验证） |
| email | string | 是 | 邮箱地址（唯一） |
| role | string | 是 | 角色，可选值：'teacher'(教师),'student'(学生) |
| name | string | 是 | 姓名 |

- **请求示例**:

```json
{
  "username": "test_user",
  "password": "SecurePassword123",
  "email": "test@example.com",
  "role": "student",
  "name": "张三"
}
```

- **成功响应示例**:

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "userId": "1",
    "username": "test_user"
  }
}
```

- **错误响应示例**:

```json
{
  "code": 10002,
  "message": "用户名已存在",
  "data": null
}
```

### 2. 登录

- **URL**: `/api/login/`
- **方法**: POST
- **描述**: 用户登录
- **请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

- **请求示例**:

```json
{
  "username": "test_user",
  "password": "SecurePassword123"
}
```

- **成功响应示例**:

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "userId": "1",
    "username": "test_user",
    "role": "student",
    "avatar": "https://example.com/avatar.png"
  }
}
```

- **错误响应示例**:

```json
{
  "code": 10001,
  "message": "用户名或密码错误",
  "data": null
}
```

### 3. 登出

- **URL**: `/api/logout/`
- **方法**: POST
- **描述**: 用户退出登录
- **请求参数**: 无
- **请求头**:
  - Authorization: Bearer {token} （JWT访问令牌）
  
- **成功响应示例**:

```json
{
  "code": 200,
  "message": "退出成功",
  "data": null
}
```

### 4. 刷新Token

- **URL**: `/api/token/refresh/`
- **方法**: POST
- **描述**: 刷新JWT令牌
- **请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| refresh | string | 是 | 刷新令牌 |

- **请求示例**:

```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

- **成功响应示例**:

```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

## 用户模型

| 字段 | 类型 | 描述 |
|------|------|------|
| userId | string | 用户ID |
| username | string | 用户名 |
| name | string | 姓名 |
| email | string | 邮箱地址 |
| phone | string | 电话号码 |
| role | string | 角色(teacher/student) |
| avatar | string | 头像URL |
| createTime | string | 创建时间(格式：YYYY-MM-DD HH:MM:SS) | 