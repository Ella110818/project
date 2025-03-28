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
                  <img :src="require('@/assets/image/left.png')" style="width: 90%; height: 10%" />
                </span>
              </button>
            </div>
            <div class="title-nav" id="top6">
              <div class="foldable-section" :class="{ folded: isFolded }">
                <div v-for="(row, index) in topStudents" :key="index" class="level">
                  <img v-for="student in row" 
                       :key="student.id"
                       :src="require(`@/assets/image/${student.avatar}`)"
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
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'DataDisplay',
  
  setup() {
    const barrageText = ref('')
    const barrageArea = ref(null)
    const realTimeChart = ref(null)
    const isFolded = ref(false)
    
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

    const taskCompletion = ref([])
    let chart = null

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
        // 配置图表选项...
      }
    }

    onMounted(() => {
      initChart()
      // 模拟获取任务完成数据
      taskCompletion.value = [
        { id: 1, name: '张三', class: '计科1班', completionRate: 95 },
        { id: 2, name: '李四', class: '计科2班', completionRate: 88 },
        { id: 3, name: '王五', class: '计科1班', completionRate: 92 }
      ]
    })

    onUnmounted(() => {
      if (chart) {
        chart.dispose()
      }
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

<style>
@import '@/assets/css/index.css';
</style> 