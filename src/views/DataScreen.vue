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
              <p>课程教师：王某某</p>
              <p>课程学分：5学分</p>
              <p>课程学时：96学时</p>
              <p>学院：计算机与信息技术学院</p>
              <p>专业：计算机科学与技术</p>
              <p>联系电话：123456789</p>
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
            <div id="barrage-container">
              <div class="barrage-display-area"></div>
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
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'DataScreenView',
  
  setup() {
    const isFolded = ref(false)
    const barrageText = ref('')
    const tableData = ref([
      { name: '张三', class: '计算机1班', rate: '95%' },
      { name: '李四', class: '计算机1班', rate: '88%' },
      { name: '王五', class: '计算机2班', rate: '92%' },
      { name: '赵六', class: '计算机2班', rate: '85%' },
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
      tableData
    }
  }
}
</script>

<style>
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
</style>