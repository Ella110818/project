$(function(){

	initTaskList(); 
    });
    var tasks = [
      { id: 0, text: "第二章 线性表mooc作业", completed: false },
      { id: 1, text: "第一章 章节测试", completed: false },
      { id: 2, text: "第二章 笔记提交", completed: false },
      { id: 3, text: "第三章 栈和队列预习", completed: false },
      { id: 4, text: "第二章 线性表上机作业", completed: false }
  ];
function initTaskList() {
  var taskList = document.getElementById('taskList');
  tasks.forEach(function(task) {
    var li = document.createElement('li');
    li.className = task.completed ? 'task-complete' : 'task-incomplete';
    li.dataset.taskId = task.id; // 存储任务ID，以便后续操作
    
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', function() {
      toggleTaskCompletion(li, task.id);
    });
    
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(' ' + task.text));
    taskList.appendChild(li);
  });
}

function toggleTaskCompletion(element, taskId) {
  // 切换任务的完成状态
  var task = tasks.find(function(t) { return t.id === taskId; });
  task.completed = !task.completed;
  
  // 更新列表项的样式
  element.className = task.completed ? 'task-complete' : 'task-incomplete';
}

// 更新任务样式
function updateTaskDisplayStyle(taskId, completed) {
  const listItems = document.getElementById('taskList').children;
  for (let i = 0; i < listItems.length; i++) {
      if (listItems[i].firstChild.nextElementSibling.textContent === tasks[taskId - 1].text) {
          listItems[i].className = completed ? 'task-complete' : 'task-incomplete';
          listItems[i].firstChild.checked = completed;
          break;
      }
  }
}
