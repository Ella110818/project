import requests
import json
from datetime import datetime, timedelta
import time
import sys
import argparse

# 基础URL (不要以斜杠结尾)
BASE_URL = "http://localhost:8000/api"
# 服务器根URL
SERVER_URL = "http://localhost:8000"

# 测试账号
TEACHER = {
    "username": "韩石",
    "password": "hd123456"
}

STUDENT = {
    "username": "松葭逸",
    "password": "sjy123456"
}

# 保存会话和CSRF令牌
teacher_session = requests.Session()
student_session = requests.Session()
teacher_token = None
student_token = None


def check_server_connection():
    """检查API服务器连接状态"""
    print("正在检查API服务器连接...")
    try:
        # 尝试访问CSRF端点，根据API文档使用正确的路径 /csrf/
        response = requests.get(f"{SERVER_URL}/csrf/", timeout=5)
        if response.status_code == 200:
            print("API服务器连接正常")
            return True
        else:
            print(f"API服务器返回非200状态码: {response.status_code}")
            print(f"响应内容: {response.text}")
            return False
    except requests.exceptions.ConnectionError:
        print("无法连接到API服务器，请确保服务器已启动")
        return False
    except requests.exceptions.Timeout:
        print("连接API服务器超时")
        return False
    except Exception as e:
        print(f"检查API服务器连接时发生未知错误: {str(e)}")
        return False


def get_csrf_token(session):
    """获取CSRF令牌"""
    try:
        # 使用正确的CSRF端点路径
        response = session.get(f"{SERVER_URL}/csrf/")
        # 检查响应是否成功
        if response.status_code != 200:
            print(f"获取CSRF令牌失败: 状态码 {response.status_code}")
            return None
        
        token = session.cookies.get("csrftoken")
        if not token:
            print("CSRF令牌未在响应Cookie中找到")
        return token
    except requests.exceptions.RequestException as e:
        print(f"获取CSRF令牌时发生网络错误: {str(e)}")
        return None


def login(session, username, password):
    """登录并返回认证信息"""
    try:
        csrf = get_csrf_token(session)
        if not csrf:
            print("无法获取CSRF令牌，登录可能失败")
        
        # 使用API文档中的正确登录路径
        response = session.post(
            f"{BASE_URL}/user/login/",
            json={"username": username, "password": password},
            headers={"X-CSRFToken": csrf} if csrf else {}
        )
        
        # 检查响应状态
        if response.status_code != 200:
            print(f"登录请求失败: 状态码 {response.status_code}")
            print(f"响应内容: {response.text}")
            return {"code": response.status_code, "message": "登录请求失败", "data": None}
        
        # 尝试解析JSON响应
        try:
            result = response.json()
            # 将token保存到session对象中
            if result.get("code") == 200 and result.get("data", {}).get("token"):
                token = result.get("data", {}).get("token")
                # 设置Authorization头部
                session.headers.update({"Authorization": f"Bearer {token}"})
            return result
        except json.JSONDecodeError:
            print(f"无法解析响应JSON: {response.text}")
            return {"code": 500, "message": "无法解析响应JSON", "data": None}
    
    except requests.exceptions.RequestException as e:
        print(f"登录时发生网络错误: {str(e)}")
        return {"code": 500, "message": f"网络错误: {str(e)}", "data": None}


def test_login():
    """测试登录功能"""
    global teacher_token, student_token
    
    print("=== 测试登录功能 ===")
    # 教师登录
    teacher_result = login(teacher_session, TEACHER["username"], TEACHER["password"])
    print(f"教师登录结果: {json.dumps(teacher_result, ensure_ascii=False, indent=2)}")
    
    # 保存教师token
    if teacher_result.get("code") == 200 and teacher_result.get("data", {}).get("token"):
        teacher_token = teacher_result.get("data", {}).get("token")
        print(f"成功保存教师token")
    
    # 学生登录
    student_result = login(student_session, STUDENT["username"], STUDENT["password"])
    print(f"学生登录结果: {json.dumps(student_result, ensure_ascii=False, indent=2)}")
    
    # 保存学生token
    if student_result.get("code") == 200 and student_result.get("data", {}).get("token"):
        student_token = student_result.get("data", {}).get("token")
        print(f"成功保存学生token")


def test_course_announcements(course_id=5):
    """测试课程公告相关功能"""
    print("\n=== 测试课程公告功能 ===")
    
    # 教师获取公告列表
    teacher_csrf = get_csrf_token(teacher_session)
    try:
        # 使用API文档中的正确路径
        headers = {"X-CSRFToken": teacher_csrf} if teacher_csrf else {}
        # 确保Authorization头部已设置
        if teacher_token and "Authorization" not in headers:
            headers["Authorization"] = f"Bearer {teacher_token}"
            
        response = teacher_session.get(
            f"{BASE_URL}/advanced/courses/{course_id}/announcements/",
            headers=headers
        )
        
        if response.status_code != 200:
            print(f"教师获取公告列表失败: 状态码 {response.status_code}")
            print(f"响应内容: {response.text}")
        else:
            try:
                print(f"教师获取公告列表: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")
            except json.JSONDecodeError:
                print(f"无法解析响应JSON: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"教师获取公告列表时发生网络错误: {str(e)}")
    
    # 教师发布公告
    announcement_data = {
        "title": "关于期中考试的通知",
        "content": "期中考试将于下周三下午2点在教学楼301举行，请同学们准时参加并带好学生证和文具。",
        "type": "warning"
    }
    try:
        # 使用API文档中的正确路径
        headers = {"X-CSRFToken": teacher_csrf} if teacher_csrf else {}
        # 确保Authorization头部已设置
        if teacher_token and "Authorization" not in headers:
            headers["Authorization"] = f"Bearer {teacher_token}"
            
        response = teacher_session.post(
            f"{BASE_URL}/advanced/courses/{course_id}/announcements/",
            json=announcement_data,
            headers=headers
        )
        
        if response.status_code != 200:
            print(f"教师发布公告失败: 状态码 {response.status_code}")
            print(f"响应内容: {response.text}")
            announcement_id = None
        else:
            try:
                result = response.json()
                print(f"教师发布公告结果: {json.dumps(result, ensure_ascii=False, indent=2)}")
                announcement_id = result.get("data", {}).get("id")
            except json.JSONDecodeError:
                print(f"无法解析响应JSON: {response.text}")
                announcement_id = None
    except requests.exceptions.RequestException as e:
        print(f"教师发布公告时发生网络错误: {str(e)}")
        announcement_id = None
    
    # 学生查看公告列表
    student_csrf = get_csrf_token(student_session)
    try:
        # 使用API文档中的正确路径
        headers = {"X-CSRFToken": student_csrf} if student_csrf else {}
        # 确保Authorization头部已设置
        if student_token and "Authorization" not in headers:
            headers["Authorization"] = f"Bearer {student_token}"
            
        response = student_session.get(
            f"{BASE_URL}/advanced/courses/{course_id}/announcements/",
            headers=headers
        )
        
        if response.status_code != 200:
            print(f"学生查看公告列表失败: 状态码 {response.status_code}")
            print(f"响应内容: {response.text}")
        else:
            try:
                print(f"学生查看公告列表: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")
            except json.JSONDecodeError:
                print(f"无法解析响应JSON: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"学生查看公告列表时发生网络错误: {str(e)}")
    
    return announcement_id


def test_assignments(course_id=5):
    """测试作业与考试相关功能"""
    print("\n=== 测试作业与考试功能 ===")
    
    # 教师获取作业列表
    teacher_csrf = get_csrf_token(teacher_session)
    try:
        # 使用API文档中的正确路径
        headers = {"X-CSRFToken": teacher_csrf} if teacher_csrf else {}
        # 确保Authorization头部已设置
        if teacher_token and "Authorization" not in headers:
            headers["Authorization"] = f"Bearer {teacher_token}"
            
        response = teacher_session.get(
            f"{BASE_URL}/advanced/courses/{course_id}/assignments/",
            headers=headers
        )
        
        if response.status_code != 200:
            print(f"教师获取作业列表失败: 状态码 {response.status_code}")
            print(f"响应内容: {response.text}")
        else:
            try:
                print(f"教师获取作业列表: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")
            except json.JSONDecodeError:
                print(f"无法解析响应JSON: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"教师获取作业列表时发生网络错误: {str(e)}")
    
    # 教师发布作业
    tomorrow = datetime.now() + timedelta(days=1)
    next_week = datetime.now() + timedelta(days=7)
    assignment_data = {
        "title": "计算机组成原理实验一",
        "type": "homework",
        "description": "完成实验一中的全部习题，并提交实验报告",
        "start_time": tomorrow.strftime("%Y-%m-%d %H:%M:%S"),
        "deadline": next_week.strftime("%Y-%m-%d %H:%M:%S"),
        "full_score": 100
    }
    try:
        # 使用API文档中的正确路径
        headers = {"X-CSRFToken": teacher_csrf} if teacher_csrf else {}
        # 确保Authorization头部已设置
        if teacher_token and "Authorization" not in headers:
            headers["Authorization"] = f"Bearer {teacher_token}"
            
        response = teacher_session.post(
            f"{BASE_URL}/advanced/courses/{course_id}/assignments/",
            json=assignment_data,
            headers=headers
        )
        
        if response.status_code != 200:
            print(f"教师发布作业失败: 状态码 {response.status_code}")
            print(f"响应内容: {response.text}")
            assignment_id = None
        else:
            try:
                result = response.json()
                print(f"教师发布作业结果: {json.dumps(result, ensure_ascii=False, indent=2)}")
                assignment_id = result.get("data", {}).get("id")
            except json.JSONDecodeError:
                print(f"无法解析响应JSON: {response.text}")
                assignment_id = None
    except requests.exceptions.RequestException as e:
        print(f"教师发布作业时发生网络错误: {str(e)}")
        assignment_id = None
    
    # 学生查看作业列表
    student_csrf = get_csrf_token(student_session)
    try:
        # 使用API文档中的正确路径
        headers = {"X-CSRFToken": student_csrf} if student_csrf else {}
        # 确保Authorization头部已设置
        if student_token and "Authorization" not in headers:
            headers["Authorization"] = f"Bearer {student_token}"
            
        response = student_session.get(
            f"{BASE_URL}/advanced/courses/{course_id}/assignments/",
            headers=headers
        )
        
        if response.status_code != 200:
            print(f"学生查看作业列表失败: 状态码 {response.status_code}")
            print(f"响应内容: {response.text}")
        else:
            try:
                print(f"学生查看作业列表: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")
            except json.JSONDecodeError:
                print(f"无法解析响应JSON: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"学生查看作业列表时发生网络错误: {str(e)}")
    
    return assignment_id


def test_groups(course_id=5):
    """测试分组管理功能"""
    print("\n=== 测试分组管理功能 ===")
    
    # 教师获取分组列表
    teacher_csrf = get_csrf_token(teacher_session)
    try:
        # 使用API文档中的正确路径
        headers = {"X-CSRFToken": teacher_csrf} if teacher_csrf else {}
        # 确保Authorization头部已设置
        if teacher_token and "Authorization" not in headers:
            headers["Authorization"] = f"Bearer {teacher_token}"
            
        response = teacher_session.get(
            f"{BASE_URL}/advanced/courses/{course_id}/groups/",
            headers=headers
        )
        
        if response.status_code != 200:
            print(f"教师获取分组列表失败: 状态码 {response.status_code}")
            print(f"响应内容: {response.text}")
            unassigned_students = []
        else:
            try:
                result = response.json()
                print(f"教师获取分组列表: {json.dumps(result, ensure_ascii=False, indent=2)}")
                unassigned_students = result.get("data", {}).get("unassignedStudents", [])
            except json.JSONDecodeError:
                print(f"无法解析响应JSON: {response.text}")
                unassigned_students = []
    except requests.exceptions.RequestException as e:
        print(f"教师获取分组列表时发生网络错误: {str(e)}")
        unassigned_students = []
    
    # 获取未分组学生ID
    student_ids = [student["id"] for student in unassigned_students[:2]]
    
    if student_ids:
        # 教师创建分组
        group_data = {
            "name": "实验小组1",
            "studentIds": student_ids
        }
        try:
            # 使用API文档中的正确路径
            headers = {"X-CSRFToken": teacher_csrf} if teacher_csrf else {}
            # 确保Authorization头部已设置
            if teacher_token and "Authorization" not in headers:
                headers["Authorization"] = f"Bearer {teacher_token}"
                
            response = teacher_session.post(
                f"{BASE_URL}/advanced/courses/{course_id}/groups/",
                json=group_data,
                headers=headers
            )
            
            if response.status_code != 200:
                print(f"教师创建分组失败: 状态码 {response.status_code}")
                print(f"响应内容: {response.text}")
                group_id = None
            else:
                try:
                    result = response.json()
                    print(f"教师创建分组结果: {json.dumps(result, ensure_ascii=False, indent=2)}")
                    group_id = result.get("data", {}).get("id")
                except json.JSONDecodeError:
                    print(f"无法解析响应JSON: {response.text}")
                    group_id = None
        except requests.exceptions.RequestException as e:
            print(f"教师创建分组时发生网络错误: {str(e)}")
            group_id = None
    
    # 教师自动分组
    auto_group_data = {
        "groupCount": 2,
        "method": "random"
    }
    try:
        # 使用API文档中的正确路径
        headers = {"X-CSRFToken": teacher_csrf} if teacher_csrf else {}
        # 确保Authorization头部已设置
        if teacher_token and "Authorization" not in headers:
            headers["Authorization"] = f"Bearer {teacher_token}"
            
        response = teacher_session.post(
            f"{BASE_URL}/advanced/courses/{course_id}/groups/auto",
            json=auto_group_data,
            headers=headers
        )
        
        if response.status_code != 200:
            print(f"教师自动分组失败: 状态码 {response.status_code}")
            print(f"响应内容: {response.text}")
        else:
            try:
                print(f"教师自动分组结果: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")
            except json.JSONDecodeError:
                print(f"无法解析响应JSON: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"教师自动分组时发生网络错误: {str(e)}")
    
    # 学生查看分组
    student_csrf = get_csrf_token(student_session)
    try:
        # 使用API文档中的正确路径
        headers = {"X-CSRFToken": student_csrf} if student_csrf else {}
        # 确保Authorization头部已设置
        if student_token and "Authorization" not in headers:
            headers["Authorization"] = f"Bearer {student_token}"
            
        response = student_session.get(
            f"{BASE_URL}/advanced/courses/{course_id}/groups/",
            headers=headers
        )
        
        if response.status_code != 200:
            print(f"学生查看分组失败: 状态码 {response.status_code}")
            print(f"响应内容: {response.text}")
        else:
            try:
                print(f"学生查看分组结果: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")
            except json.JSONDecodeError:
                print(f"无法解析响应JSON: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"学生查看分组时发生网络错误: {str(e)}")


def run_all_tests():
    """运行所有测试"""
    try:
        # 首先检查服务器连接
        if not check_server_connection():
            print("由于无法连接到API服务器，测试已中止")
            return
        
        # 先登录
        test_login()
        
        # 等待几秒，确保登录成功且服务器处理完毕
        print("等待登录处理完成...")
        time.sleep(2)
        
        # 测试各功能
        test_course_announcements()
        test_assignments()
        test_groups()
        
        print("\n所有测试完成！")
    except Exception as e:
        print(f"测试过程中发生错误: {str(e)}")


def main():
    """主函数，处理命令行参数"""
    parser = argparse.ArgumentParser(description='智慧课堂API测试工具')
    parser.add_argument('--test', choices=['all', 'login', 'announcements', 'assignments', 'groups'],
                        default='all', help='指定要运行的测试')
    parser.add_argument('--course-id', type=int, default=5, help='指定测试用的课程ID')
    
    args = parser.parse_args()
    
    # 首先检查服务器连接
    if not check_server_connection():
        print("由于无法连接到API服务器，测试已中止")
        return
    
    # 所有测试都需要先登录
    test_login()
    
    # 等待几秒，确保登录成功且服务器处理完毕
    print("等待登录处理完成...")
    time.sleep(2)
    
    try:
        if args.test == 'all':
            # 测试所有功能
            test_course_announcements(args.course_id)
            test_assignments(args.course_id)
            test_groups(args.course_id)
        elif args.test == 'login':
            # 登录已经测试过了
            pass
        elif args.test == 'announcements':
            test_course_announcements(args.course_id)
        elif args.test == 'assignments':
            test_assignments(args.course_id)
        elif args.test == 'groups':
            test_groups(args.course_id)
            
        print("\n测试完成！")
    except Exception as e:
        print(f"测试过程中发生错误: {str(e)}")


if __name__ == "__main__":
    main() 