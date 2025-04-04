var data = [
  ["张某某", "计算机科学与技术2301", "90%"],
  ["李某某", "计算机科学与技术2302", "100%"],
  ["王某某", "计算机科学与技术2302", "83%"],
  ["宋某某", "计算机科学与技术2302", "75%"],
  ["杨某某", "计算机科学与技术2302", "77%"],
  ["汤某某", "计算机科学与技术2302", "99%"],
  ["问某某", "计算机科学与技术2302", "85%"],
  ["陈某某", "计算机科学与技术2302", "81%"],
  ["赵某某", "计算机科学与技术2302", "87%"],
  ["钱某某", "计算机科学与技术2302", "60%"],
  ["孙某某", "计算机科学与技术2302", "88%"],
  ["李某某", "计算机科学与技术2302", "10%"],
  ["周某某", "计算机科学与技术2302", "55%"],
  ["吴某某", "计算机科学与技术2302", "100%"],
  ["郑某某", "计算机科学与技术2302", "68%"],
  ["王某某", "计算机科学与技术2302", "73%"],
  ["冯某某", "计算机科学与技术2305", "95%"],
  ["卫某某", "计算机科学与技术2302", "62%"]
];

// 按完成率从高到低排序
data.sort((a, b) => parseFloat(b[2]) - parseFloat(a[2]));

var currentIndex = 0;
var displayCount = 6; // 显示 6 条数据
var slider; // 滑动条

function displayData() {
  var tbody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
  tbody.innerHTML = '';

  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex > data.length - displayCount) currentIndex = data.length - displayCount;

  var displayData = data.slice(currentIndex, currentIndex + displayCount);
  displayData.forEach(rowData => {
    var row = tbody.insertRow();
    rowData.forEach(cellData => {
      var cell = row.insertCell();
      cell.textContent = cellData;
    });
  });

  // 更新滑动条位置
  if (slider) {
    slider.value = currentIndex;
  }
}

// 监听鼠标滚轮事件，让滚轮滚动同步滑动条
document.getElementById('table-container').addEventListener('wheel', function (event) {
  event.preventDefault();
  currentIndex += event.deltaY > 0 ? 1 : -1;
  displayData();
});

// 创建滑动条
function createSlider() {
  var tableElement = document.getElementById('data-table');
  var tableParent = tableElement.parentNode;

  var containerDiv = document.createElement('div');
  containerDiv.style.display = 'flex';
  containerDiv.style.alignItems = 'flex-start';
  containerDiv.style.width = '100%';

  tableParent.removeChild(tableElement);
  containerDiv.appendChild(tableElement);

  var sliderContainer = document.createElement('div');
  sliderContainer.style.marginLeft = '15px';
  sliderContainer.style.height = tableElement.offsetHeight + 'px';
  sliderContainer.style.display = 'flex';
  sliderContainer.style.flexDirection = 'column';
  sliderContainer.style.justifyContent = 'center';

  slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '0';
  slider.max = Math.max(0, data.length - displayCount).toString();
  slider.value = '0';
  slider.style.height = tableElement.offsetHeight + 'px';
  slider.style.width = '10px';
  slider.style.appearance = 'slider-vertical';
  slider.style.webkitAppearance = 'slider-vertical';
  slider.style.writingMode = 'tb-rl';

  slider.addEventListener('input', function () {
    currentIndex = parseInt(this.value);
    displayData();
  });

  sliderContainer.appendChild(slider);
  containerDiv.appendChild(sliderContainer);
  tableParent.appendChild(containerDiv);

  setTimeout(() => {
    sliderContainer.style.height = tableElement.offsetHeight + 'px';
    slider.style.height = tableElement.offsetHeight + 'px';
  }, 100);
}

// 初始化
displayData();
createSlider();
