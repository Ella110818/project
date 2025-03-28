<template>
  <div class="data-display-panel">
    <div class="content-con">
      <!-- 左侧面板 -->
      <div class="left-body">
        <div class="left-top public-bg">
          <div class="public-title">课程信息</div>
          <div class="information">
            <p>课程名称：{{ courseInfo.name }}</p>
            <p>课程教师：{{ courseInfo.teacher }}</p>
            <p>课程学分：{{ courseInfo.credits }}学分</p>
            <p>课程学时：{{ courseInfo.hours }}学时</p>
            <p>学院：{{ courseInfo.college }}</p>
            <p>专业：{{ courseInfo.major }}</p>
            <p>联系电话：{{ courseInfo.phone }}</p>
          </div>
        </div>

        <div class="left-bottom public-bg">
          <div class="public-title">
            课堂认真top6
            <button @click="toggleFold">
              <span class="arrow">
                <img src="../assets/left.png" style="width: 90%; height: 10%" />
              </span>
            </button>
          </div>
          <div class="title-nav" id="top6">
            <div class="foldable-section" :class="{ folded: isFolded }">
              <div v-for="(row, index) in topStudents" :key="index" class="level">
                <img v-for="student in row" 
                     :key="student.id"
                     :src="require(`../assets/${student.avatar}`)"
                     :alt="student.name"
                     class="student-avatar" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 中间面板 -->
      <div class="center-body">
        <div class="center-top public-bg">
          <div class="public-title1">课堂情况直播</div>
          <!-- 直播内容组件 -->
          <div class="live-content">
            <div class="live-placeholder">
              <i class="el-icon-video-camera"></i>
              <span>课堂直播区域</span>
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
                <tr v-for="item in taskCompletion" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td>{{ item.class }}</td>
                  <td>{{ item.completionRate }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="right-body">
        <div class="right-top1 public-bg">
          <div class="public-title">课堂实时弹幕</div>
          <div class="title-nav">
            <div id="barrage-container">
              <div class="barrage-display-area" ref="barrageArea"></div>
              <div class="barrage-input-container">
                <input type="text" 
                       v-model="barrageText" 
                       @keyup.enter="sendBarrage"
                       placeholder="输入弹幕内容" />
                <button @click="sendBarrage">发送</button>
              </div>
            </div>
          </div>
        </div>
        <div class="right-bottom1 public-bg">
          <div class="public-title">课堂实时情况</div>
          <div class="title-nav" ref="realTimeChart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'DataDisplayPanel',
  
  setup() {
    const barrageText = ref('')
    const barrageArea = ref(null)
    const realTimeChart = ref(null)
    const isFolded = ref(false)
    let chart = null
    
    const courseInfo = ref({
      name: '数据结构与算法',
      teacher: '王某某',
      credits: 5,
      hours: 96,
      college: '计算机与信息技术学院',
      major: '计算机科学与技术',
      phone: '123456789'
    })

    const topStudents = ref([
      [{ id: 1, name: '郭同学', avatar: 'guo.png' }, { id: 2, name: '宋同学', avatar: 'song.png' }],
      [{ id: 3, name: '杨同学', avatar: 'yang.png' }, { id: 4, name: '文同学', avatar: 'wen.png' }],
      [{ id: 5, name: '唐同学', avatar: 'tang.png' }, { id: 6, name: '张同学', avatar: 'zhang.png' }]
    ])

    const taskCompletion = ref([
      { id: 1, name: '张三', class: '计科1班', completionRate: 95 },
      { id: 2, name: '李四', class: '计科2班', completionRate: 88 },
      { id: 3, name: '王五', class: '计科1班', completionRate: 92 }
    ])

    const toggleFold = () => {
      isFolded.value = !isFolded.value
    }

    const sendBarrage = () => {
      if (!barrageText.value.trim()) return
      
      const barrageItem = document.createElement('div')
      barrageItem.className = 'barrage-item'
      barrageItem.textContent = barrageText.value
      barrageItem.style.top = Math.random() * 70 + '%'
      
      barrageArea.value.appendChild(barrageItem)
      barrageText.value = ''

      setTimeout(() => {
        barrageArea.value.removeChild(barrageItem)
      }, 8000)
    }

    const initChart = () => {
      if (realTimeChart.value) {
        chart = echarts.init(realTimeChart.value)
        const option = {
          title: {
            text: '课堂实时数据',
            textStyle: {
              color: '#fff'
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: ['13:00', '13:10', '13:20', '13:30', '13:40', '13:50'],
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
            data: [85, 90, 88, 92, 86, 89],
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#409EFF'
            },
            itemStyle: {
              color: '#409EFF'
            }
          }]
        }
        chart.setOption(option)
      }
    }

    onMounted(() => {
      initChart()
      // 添加窗口大小变化监听
      window.addEventListener('resize', () => {
        chart?.resize()
      })
    })

    onUnmounted(() => {
      if (chart) {
        chart.dispose()
      }
      window.removeEventListener('resize', () => {
        chart?.resize()
      })
    })

    return {
      courseInfo,
      topStudents,
      taskCompletion,
      barrageText,
      barrageArea,
      realTimeChart,
      isFolded,
      toggleFold,
      sendBarrage
    }
  }
}
</script>

<style scoped>
.data-display-panel {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  color: #fff;
}

.content-con {
  display: flex;
  gap: 20px;
  height: calc(100vh - 103px); /* 减去顶部导航和padding */
}

.live-content {
  width: 100%;
  height: calc(100% - 40px); /* 减去标题高度 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.live-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #fff;
  opacity: 0.5;
}

.live-placeholder i {
  font-size: 48px;
}

/* 导入基础样式 */
@import '@/assets/css/index.css';

/* 覆盖一些特定样式 */
.public-bg {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.table-container {
  margin-top: 20px;
}

#data-table {
  width: 100%;
  border-collapse: collapse;
}

#data-table th,
#data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

#data-table th {
  font-weight: bold;
  color: #409EFF;
}

.barrage-input-container {
  background: rgba(255, 255, 255, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.barrage-input-container input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.barrage-input-container button {
  background: #409EFF;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.barrage-input-container button:hover {
  background: #66b1ff;
}
</style> 