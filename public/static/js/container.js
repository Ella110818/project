var data=[["张三", "计算机科学与技术2301", "90%"],
  ["李四", "计算机科学与技术2302", "85%"],
  ["王五", "计算机科学与技术2302", "85%"],
  ["宋六", "计算机科学与技术2302", "85%"],
  ["杨七", "计算机科学与技术2302", "85%"],
  ["汤八", "计算机科学与技术2302", "85%"],
  ["问九", "计算机科学与技术2302", "85%"],
  ["陈十", "计算机科学与技术2302", "85%"],
  ["赵", "计算机科学与技术2302", "85%"],
  ["钱", "计算机科学与技术2302", "85%"],
  ["孙", "计算机科学与技术2302", "85%"],
  ["李", "计算机科学与技术2302", "85%"],
  ["周", "计算机科学与技术2302", "85%"],
  ["吴", "计算机科学与技术2302", "85%"],
  ["郑", "计算机科学与技术2302", "85%"],
  ["王", "计算机科学与技术2302", "85%"],
  ["冯", "计算机科学与技术2305", "95%"],
  ["卫", "计算机科学与技术2302", "85%"]// 假设这是您的数据数组
]

// 按完成率从高到低排序数据
data.sort(function(a, b) {
  // 从百分比字符串中提取数值
  var percentA = parseFloat(a[2]);
  var percentB = parseFloat(b[2]);
  return percentB - percentA; // 从高到低排序
});

var currentIndex = 0; // 当前显示的数据索引
var displayCount = 6; // 一次展示的数据数量

function displayData(startIndex) {
  // 如果提供了起始索引则使用，否则使用当前索引
  currentIndex = startIndex !== undefined ? startIndex : currentIndex;
  
  // 确保索引不超过数据长度减去显示数量
  if (currentIndex > data.length - displayCount) {
    currentIndex = data.length - displayCount;
    if (currentIndex < 0) currentIndex = 0;
  }
  
  var tbody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
  tbody.innerHTML = ''; // 清空现有的数据行

  // 计算要显示的数据子集
  var displayData = data.slice(currentIndex, currentIndex + displayCount);
  displayData.forEach(function(rowData) {
    var row = tbody.insertRow();
    rowData.forEach(function(cellData) {
      var cell = row.insertCell();
      cell.textContent = cellData;
    });
  });
}

// 创建垂直滑动条
function createSlider() {
  var tableElement = document.getElementById('data-table');
  var tableParent = tableElement.parentNode;
  
  // 创建一个包含表格和滑动条的容器
  var containerDiv = document.createElement('div');
  containerDiv.style.display = 'flex';
  containerDiv.style.alignItems = 'flex-start';
  containerDiv.style.width = '100%';
  
  // 将表格从其父元素中移除
  tableParent.removeChild(tableElement);
  
  // 将表格添加到新容器中
  containerDiv.appendChild(tableElement);
  
  // 创建滑动条容器
  var sliderContainer = document.createElement('div');
  sliderContainer.style.marginLeft = '15px';
  sliderContainer.style.height = tableElement.offsetHeight + 'px';
  sliderContainer.style.display = 'flex';
  sliderContainer.style.flexDirection = 'column';
  sliderContainer.style.justifyContent = 'center';
  
  // 创建滑动条
  var slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '0';
  slider.max = Math.max(0, data.length - displayCount).toString();
  slider.value = '0';
  slider.style.height = tableElement.offsetHeight + 'px';
  slider.style.width = '10px';
  slider.style.appearance = 'slider-vertical'; // 用于Chrome、Safari、Edge等
  slider.style.webkitAppearance = 'slider-vertical'; // 用于Safari
  slider.style.writingMode = 'tb-rl'; // 从上到下 (top-to-bottom)
  
  // 滑动条事件监听
  slider.addEventListener('input', function() {
    var startIndex = parseInt(this.value);
    displayData(startIndex);
  });
  
  sliderContainer.appendChild(slider);
  containerDiv.appendChild(sliderContainer);
  
  // 将新容器添加到原表格的父元素中
  tableParent.appendChild(containerDiv);
  
  // 为了确保滑动条高度与表格匹配，我们在表格渲染后再次调整
  setTimeout(function() {
    sliderContainer.style.height = tableElement.offsetHeight + 'px';
    slider.style.height = tableElement.offsetHeight + 'px';
  }, 100);
}

// 初始化表格显示
displayData();
// 创建滑动条
createSlider();

// 移除定时器，不再自动滚动
// setInterval(displayData, 2000);