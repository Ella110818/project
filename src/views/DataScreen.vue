<template>
  <div class="content-body">
    <div class="header">
      <div class="header-left fl"></div>
      <div class="header-center fl">
        <div class="header-title">知微课研可视化平台</div>
        <div class="header-img"></div>
      </div>
      <div class="header-right fl" id="time"></div>
      <div class="header-bottom fl"></div>
    </div>

    <div class="content">
      <div class="content-con">
        <div class="left-body">
          <div class="left-top public-bg">
            <div class="public-title">课程信息</div>
            <div class="information">
              <p>课程名称：数据结构与算法</p>
              <p>课程教师：韩石</p>
              <p>课程学分：5学分</p>
              <p>课程学时：96学时</p>
              <p>学院：计算机与信息技术学院</p>
              <p>专业：基础专业</p>
              <p>联系电话：12345678</p>
            </div>
          </div>

          <div class="left-bottom public-bg">
            <div class="public-title">课堂认真top6
              <button @click="toggleFold"><span class="arrow"><img src="../assets/left.png" style="width: 90%;height: 10%;"></span></button>
            </div>
            <div class="title-nav" id="top6">
              <div class="foldable-section" :class="{ 'folded': isFolded }">
                <div class="level">
                  <img src="../assets/guo.png" alt="Student 1" class="student-avatar" :class="{ 'visible': !isFolded }">
                  <img src="../assets/song.png" alt="Student 2" class="student-avatar" :class="{ 'visible': !isFolded }">
                </div>
                <div class="level">
                  <img src="../assets/yang.png" alt="Student 3" class="student-avatar" :class="{ 'visible': !isFolded }">
                  <img src="../assets/wen.png" alt="Student 4" class="student-avatar" :class="{ 'visible': !isFolded }">
                </div>
                <div class="level">
                  <img src="../assets/tang.png" alt="Student 5" class="student-avatar" :class="{ 'visible': !isFolded }">
                  <img src="../assets/zhang.png" alt="Student 6" class="student-avatar" :class="{ 'visible': !isFolded }">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="center-body">
          <div class="center-top public-bg">
            <div class="public-title1">课堂情况回放</div>
            <div class="video-controls">
              <select v-model="selectedDate" class="date-select">
                <option value="">选择日期</option>
                <option value="2024-03-18">2024-03-18</option>
                <option value="2024-03-19">2024-03-19</option>
                <option value="2024-03-20">2024-03-20</option>
                <option value="2024-03-21">2024-03-21</option>
              </select>
              <select v-model="selectedCourse" class="course-select">
                <option value="">选择课程</option>
                <option value="数据结构与算法">数据结构与算法</option>
                <option value="计算机组成原理">计算机组成原理</option>
                <option value="操作系统">操作系统</option>
              </select>
              <button class="load-btn" @click="loadVideoPlayback">加载回放</button>
            </div>
            <div id="barrage-container">
              <div class="barrage-display-area"></div>
              <div class="video-container">
                <video ref="videoPlayer" controls width="100%" height="auto" v-if="showVideo">
                  <source :src="videoUrl" type="video/mp4">
                  您的浏览器不支持视频播放
                </video>
                <div class="video-placeholder" v-else>
                  <span>请选择日期和课程，然后点击"加载回放"按钮播放视频</span>
                </div>
              </div>
              <div class="barrage-input-container">
                <input type="text" id="barrage-input" placeholder="发送弹幕..." v-model="barrageText" @keyup.enter="sendBarrage">
                <button @click="sendBarrage">发送</button>
              </div>
            </div>
          </div>
          <div class="center-bottom public-bg">
            <div class="public-title">课后任务完成情况</div>
            <div id="table-container">
              <table id="data-table">
                <thead>
                  <tr>
                    <th>姓名</th>
                    <th>班级</th>
                    <th>完成率</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in tableData" :key="index">
                    <td>{{ item.name }}</td>
                    <td>{{ item.class }}</td>
                    <td>{{ item.rate }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="right-body">
          <div class="right-top1 public-bg">
            <div class="public-title">课堂情况占比情况</div>
            <div class="title-nav" id="piechart5"></div>
          </div>
          <div class="right-con public-bg">
            <div class="public-title">与上节课相比</div>
            <div class="title-nav" id="huaxing"></div>
          </div>
          <div class="right-bottom public-bg">
            <div class="public-title">课堂实时情况</div>
            <div class="title-nav" id="zhexian"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'DataScreenView',
  
  setup() {
    const isFolded = ref(false)
    const barrageText = ref('')
    const showVideo = ref(false)
    const videoUrl = ref('')
    const selectedDate = ref('')
    const selectedCourse = ref('')
    const videoPlayer = ref(null)
    
    const tableData = ref([
      { name: '李林', class: '计算机科学与技术2302', rate: '100%' },
      { name: '吴达', class: '计算机科学与技术2302', rate: '100%' },
      { name: '汤妍', class: '计算机科学与技术2302', rate: '99%' },
      { name: '冯丽', class: '计算机科学与技术2305', rate: '95%' },
      { name: '张朋', class: '计算机科学与技术2301', rate: '90%' },
      { name: '孙天', class: '计算机科学与技术2302', rate: '88%' },
    ])

    let charts = {
      pieChart: null,
      huaxingChart: null,
      zhexianChart: null
    }
    
    const toggleFold = () => {
      isFolded.value = !isFolded.value
    }

    const updateTime = () => {
      const myDate = new Date()
      const myYear = myDate.getFullYear()
      const myMonth = myDate.getMonth() + 1
      const myToday = myDate.getDate()
      const myDay = myDate.getDay()
      const myHour = myDate.getHours()
      const myMinute = myDate.getMinutes()
      const mySecond = myDate.getSeconds()
      const week = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
      
      const fillZero = (str) => {
        return str < 10 ? '0' + str : str
      }

      const nowTime = `${myYear}年${fillZero(myMonth)}月${fillZero(myToday)}日 ${fillZero(myHour)}:${fillZero(myMinute)}:${fillZero(mySecond)} ${week[myDay]}`
      
      if (document.getElementById('time')) {
        document.getElementById('time').innerHTML = nowTime
      }
    }

    const initPieChart = () => {
      const pieChart = echarts.init(document.getElementById('piechart5'))
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: ['专注', '走神', '睡觉', '玩手机'],
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: '课堂状态',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 335, name: '专注' },
              { value: 310, name: '走神' },
              { value: 234, name: '睡觉' },
              { value: 135, name: '玩手机' }
            ]
          }
        ]
      }
      pieChart.setOption(option)
      charts.pieChart = pieChart
    }

    const initHuaxingChart = () => {
      const huaxingChart = echarts.init(document.getElementById('huaxing'))
      const option = {
        title: {
          text: ''
        },
        tooltip: {},
        legend: {
          data: ['本节课', '上节课'],
          textStyle: {
            color: '#fff'
          }
        },
        radar: {
          indicator: [
            { name: '专注度', max: 100 },
            { name: '参与度', max: 100 },
            { name: '理解度', max: 100 },
            { name: '完成度', max: 100 }
          ]
        },
        series: [{
          name: '课堂表现',
          type: 'radar',
          data: [
            {
              value: [80, 90, 85, 95],
              name: '本节课'
            },
            {
              value: [70, 85, 80, 90],
              name: '上节课'
            }
          ]
        }]
      }
      huaxingChart.setOption(option)
      charts.huaxingChart = huaxingChart
    }

    const initZhexianChart = () => {
      const zhexianChart = echarts.init(document.getElementById('zhexian'))
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['专注度'],
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: {
          type: 'category',
          data: ['5min', '10min', '15min', '20min', '25min', '30min'],
          axisLabel: {
            color: '#fff'
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#fff'
          }
        },
        series: [{
          name: '专注度',
          type: 'line',
          data: [90, 85, 95, 80, 88, 92],
          smooth: true
        }]
      }
      zhexianChart.setOption(option)
      charts.zhexianChart = zhexianChart
    }

    const sendBarrage = () => {
      if (!barrageText.value) return
      
      const barrageItem = document.createElement('div')
      barrageItem.className = 'barrage-item'
      barrageItem.textContent = barrageText.value
      barrageItem.style.top = Math.random() * 70 + '%'
      
      document.querySelector('.barrage-display-area').appendChild(barrageItem)
      barrageText.value = ''
      
      barrageItem.addEventListener('animationend', () => {
        barrageItem.remove()
      })
    }
    
    // 加载视频回放的方法
    const loadVideoPlayback = () => {
      if (selectedDate.value && selectedCourse.value) {
        showVideo.value = true
        
        // 构建正确的视频URL格式
        const formattedDate = selectedDate.value
        const formattedCourse = selectedCourse.value === '数据结构与算法' ? 'shujujiegou' : 
                               selectedCourse.value === '计算机组成原理' ? 'zuocheng' : 
                               'caozuo'
        
        videoUrl.value = `/teacher/videos/${formattedDate}_${formattedCourse}.mp4`
        
        console.log('正在加载视频:', videoUrl.value)
        
        // 确保视频加载后自动播放
        nextTick(() => {
          if (videoPlayer.value) {
            videoPlayer.value.load()
            videoPlayer.value.play().catch(error => {
              console.error('视频播放失败:', error)
              alert('视频加载失败，请确认视频文件存在且格式正确')
            })
          }
        })
      } else {
        alert('请先选择日期和课程')
      }
    }

    let timeInterval

    onMounted(() => {
      updateTime()
      timeInterval = setInterval(updateTime, 1000)
      
      // 初始化图表
      initPieChart()
      initHuaxingChart()
      initZhexianChart()

      // 监听窗口大小变化，重绘图表
      window.addEventListener('resize', () => {
        Object.values(charts).forEach(chart => {
          chart && chart.resize()
        })
      })
    })

    onUnmounted(() => {
      clearInterval(timeInterval)
      // 销毁图表实例
      Object.values(charts).forEach(chart => {
        chart && chart.dispose()
      })
    })

    return {
      isFolded,
      toggleFold,
      barrageText,
      sendBarrage,
      tableData,
      showVideo,
      videoUrl,
      selectedDate,
      selectedCourse,
      videoPlayer,
      loadVideoPlayback
    }
  }
}
</script>

<style scoped>
@import '../assets/css/index.css';

/* 添加折叠动画相关样式 */
.foldable-section {
  transition: all 0.3s ease;
  overflow: hidden;
}

.foldable-section.folded {
  height: 0;
}

/* 添加按钮样式 */
.arrow {
  display: inline-block;
  transition: transform 0.3s ease;
}

.folded .arrow {
  transform: rotate(180deg);
}

/* 确保图表容器有正确的尺寸 */
#piechart5, #huaxing, #zhexian {
  width: 100%;
  height: calc(100% - 30px);
  min-height: 200px;
}

/* 视频控制相关样式 */
.video-controls {
  display: flex;
  justify-content: center;
  margin: 10px 0;
  gap: 15px;
}

.date-select, .course-select {
  padding: 6px 12px;
  border: 1px solid #164e85;
  border-radius: 4px;
  background-color: rgba(22, 78, 133, 0.3);
  color: #fff;
  outline: none;
}

.date-select option, .course-select option {
  background-color: #0b3a6b;
  color: #fff;
}

.load-btn {
  padding: 6px 15px;
  background-color: #1e88e5;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.load-btn:hover {
  background-color: #1565c0;
}

.video-container {
  width: 100%;
  height: 400px; /* 设置固定高度 */
  margin: 10px 0;
  background-color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* 防止视频溢出容器 */
}

.video-placeholder {
  color: #a7c6e2;
  font-size: 14px;
  text-align: center;
  padding: 20px;
}

video {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 保持视频比例并填充容器 */
  background: #000000;
}

/* 弹幕相关样式 */
.barrage-display-area {
  position: relative;
  height: 30px;
  width: 100%;
  overflow: hidden;
}

.barrage-item {
  position: absolute;
  white-space: nowrap;
  color: white;
  font-size: 18px;
  animation: barrageMove 8s linear;
  right: -100%;
}

@keyframes barrageMove {
  from {
    right: -100%;
  }
  to {
    right: 100%;
  }
}

.barrage-input-container {
  display: flex;
  margin-top: 10px;
}

.barrage-input-container input {
  flex: 1;
  padding: 6px 12px;
  border: 1px solid #164e85;
  border-radius: 4px 0 0 4px;
  background-color: rgba(22, 78, 133, 0.3);
  color: #fff;
}

.barrage-input-container button {
  padding: 6px 15px;
  background-color: #1e88e5;
  border: none;
  border-radius: 0 4px 4px 0;
  color: white;
  cursor: pointer;
}
</style>