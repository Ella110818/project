$(function () {
  loadTasks(); // 加载保存的任务
  initTaskList();

  // 添加新任务的输入框
  var taskInput = document.createElement('input');
  taskInput.type = 'text';
  taskInput.placeholder = '输入新的待办事项';
  taskInput.className = 'new-task-input';

  var addButton = document.createElement('button');
  addButton.textContent = '添加';
  addButton.className = 'data-select';

  var inputContainer = document.createElement('div');
  inputContainer.className = 'task-input-container';
  inputContainer.appendChild(taskInput);
  inputContainer.appendChild(addButton);

  document.getElementById('taskList').parentNode.insertBefore(inputContainer, document.getElementById('taskList'));

  // 添加任务的事件处理
  addButton.addEventListener('click', function () {
    addNewTask(taskInput.value);
  });

  taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      addNewTask(taskInput.value);
    }
  });
});

// 初始待办事项
var tasks = [
  { id: 0, text: "第二章 线性表mooc作业", completed: false },
  { id: 1, text: "第一章 章节测试", completed: false },
  { id: 2, text: "第二章 笔记提交", completed: false },
  { id: 3, text: "第三章 栈和队列预习", completed: false },
  { id: 4, text: "第二章 线性表上机作业", completed: false }
];

// 从localStorage加载任务
function loadTasks() {
  const savedTasks = localStorage.getItem('studentTasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
}

// 保存任务到localStorage
function saveTasks() {
  localStorage.setItem('studentTasks', JSON.stringify(tasks));
}

function initTaskList() {
  var taskList = document.getElementById('taskList');
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    // 如果没有任务，添加默认任务
    tasks.push({
      id: 0,
      text: "第一章 章节测试",
      completed: false
    });
    saveTasks(); // 保存更改
  }

  tasks.forEach(function (task) {
    var li = document.createElement('li');
    li.className = task.completed ? 'task-complete' : 'task-incomplete';
    li.dataset.taskId = task.id;

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', function () {
      toggleTaskCompletion(li, task.id);
    });

    var textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = ' ' + task.text;

    textSpan.addEventListener('dblclick', function () {
      startEditing(textSpan, task.id);
    });

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    taskList.appendChild(li);
  });
}

function toggleTaskCompletion(element, taskId) {
  var task = tasks.find(function (t) { return t.id === taskId; });
  task.completed = !task.completed;

  if (task.completed) {
    // 如果任务被标记为完成，添加淡出动画效果
    element.style.transition = 'opacity 0.5s';
    element.style.opacity = '0';

    // 等待动画完成后删除任务
    setTimeout(function () {
      if (tasks.length > 1) {
        deleteTask(taskId);
      } else {
        // 如果是最后一个任务，重置它而不是删除
        task.completed = false;
        element.style.opacity = '1';
        element.className = 'task-incomplete';
        element.querySelector('.checkbox').checked = false;
        saveTasks(); // 保存更改
      }
    }, 500);
  }
}

// 开始编辑任务
function startEditing(textSpan, taskId) {
  const task = tasks.find(t => t.id === taskId);
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'edit-input';
  input.value = task.text;

  textSpan.parentNode.replaceChild(input, textSpan);
  input.focus();

  input.addEventListener('blur', function () {
    saveEdit(input, textSpan, taskId);
  });

  input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      saveEdit(input, textSpan, taskId);
    }
  });
}

// 保存编辑的内容
function saveEdit(input, textSpan, taskId) {
  const newText = input.value.trim();
  if (newText) {
    const task = tasks.find(t => t.id === taskId);
    task.text = newText;
    textSpan.textContent = ' ' + newText;
    saveTasks(); // 保存更改
  }
  input.parentNode.replaceChild(textSpan, input);
}

// 更新任务样式
function updateTaskDisplayStyle(taskId, completed) {
  const listItems = document.getElementById('taskList').children;
  for (let i = 0; i < listItems.length; i++) {
    if (listItems[i].querySelector('.task-text').textContent.trim() === tasks[taskId - 1].text) {
      listItems[i].className = completed ? 'task-complete' : 'task-incomplete';
      listItems[i].firstChild.checked = completed;
      break;
    }
  }
}

// 删除任务
function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  saveTasks(); // 保存更改
  initTaskList();
}

// 添加新任务
function addNewTask(text) {
  if (!text.trim()) {
    alert('请输入待办事项内容！');
    return;
  }

  const newId = Math.max(...tasks.map(t => t.id), -1) + 1;
  tasks.push({
    id: newId,
    text: text.trim(),
    completed: false
  });

  document.querySelector('.new-task-input').value = '';
  saveTasks(); // 保存更改
  initTaskList();
}
