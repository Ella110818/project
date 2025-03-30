# API接口调整说明

## 背景

根据`api.md`文档中定义的接口规范，我们对前端API调用进行了统一和规范化。此次调整主要涉及API路径格式、参数结构和返回数据格式的统一，以确保前后端交互的一致性和可维护性。

## 主要变更

### 1. 接口路径调整

所有接口路径按功能模块进行了规范化分组：

| 功能模块 | 调整前路径格式 | 调整后路径格式 |
|---------|--------------|--------------|
| 用户认证 | `/api/register/` | `/api/user/register/` |
| 用户认证 | `/api/login/` | `/api/user/login/` |
| 用户认证 | `/api/logout/` | `/api/user/logout/` |
| 用户认证 | `/api/token/refresh/` | `/api/user/token/refresh/` |
| 课程管理 | `/api/courses/` | `/api/course/courses/` |
| 课程资源 | `/api/courses/{id}/resources/` | `/api/course/courses/{courseId}/resources/` |
| 高级功能 | `/api/courses/{id}/announcements/` | `/api/advanced/courses/{courseId}/announcements/` |

### 2. 参数和字段调整

1. **用户认证**：
   - 用户注册接口调整为使用`username`作为登录凭证（而非`userId`）
   - 错误码统一：用户名已存在(1001)，邮箱已存在(1002)，用户名或密码错误(1003)

2. **返回数据格式**：
   - 所有接口统一返回`{ code, message, data }`格式
   - Token刷新接口调整为返回`{ access }`格式以符合API文档规范

3. **字段命名规范**：
   - 采用下划线命名法（snake_case）而非驼峰命名法（camelCase）
   - 如：`courseId` -> `course_id`，`uploadTime` -> `upload_time`

### 3. 新增接口

为了完整实现API文档中定义的功能，新增了以下接口：

1. 获取用户消息：`getUserMessages(userId)`
2. 课程相关：
   - `getCourses(page, size)`
   - `getCourseDetail(courseId)`
3. 课程资源相关：
   - `getCourseResources(courseId, params)`
   - `uploadCourseResource(courseId, data)`
   - `getResourceDetail(resourceId)`
   - `deleteResource(resourceId)`
   - `downloadResource(resourceId)`
4. 高级功能相关：
   - `getCourseAnnouncements(courseId, params)`
   - `publishCourseAnnouncement(courseId, data)`
   - `getCourseAssignments(courseId, params)`
   - `publishAssignment(courseId, data)`
   - `getCourseGroups(courseId)`
   - `createOrUpdateGroup(courseId, data)`
   - `autoCreateGroups(courseId, data)`

## 使用说明

### 本地开发模式

为了方便开发和测试，保留了本地模拟API环境：

```javascript
// 切换到本地开发模式
api.switchEnvironment(ApiEnv.LOCAL);
```

本地模式下会使用模拟数据进行响应，无需实际后端服务。

### 生产环境

生产环境下将使用标准化的API路径与后端服务交互：

```javascript
// 切换到生产环境
api.switchEnvironment(ApiEnv.PRODUCTION);
```

## 注意事项

1. 人脸识别相关接口未包含在此次调整中
2. 前端组件需根据调整后的接口路径和参数结构进行相应修改
3. 返回数据的字段名称变更可能影响现有页面的数据展示

## 后续工作

1. 完善人脸识别模块的接口对接
2. 更新前端组件以适应API变更
3. 添加接口调用的错误处理和状态管理 