<template>
  <div class="recordings-page">
    <h1>课程录像</h1>
    
    <!-- 课程选择器 -->
    <div class="course-selector">
      <el-select 
        v-model="selectedCourseId" 
        placeholder="请选择课程" 
        @change="handleCourseChange"
        filterable
      >
        <el-option
          v-for="course in courses"
          :key="course.course_id"
          :label="course.title"
          :value="course.course_id"
        />
      </el-select>
    </div>
    
    <!-- 课程时间列表 -->
    <div class="course-times-container" v-if="selectedCourseId">
      <div class="filter-options">
        <el-checkbox v-model="onlyWithRecording">只显示有录像的课程</el-checkbox>
        <el-checkbox v-model="onlyWithAnalysis">只显示有情绪分析的课程</el-checkbox>
        <el-button type="primary" size="small" @click="loadCourseTimes">筛选</el-button>
      </div>
      
      <el-table
        :data="courseTimes"
        style="width: 100%"
        @row-click="handleRowClick"
        v-loading="loading"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="course_title" label="课程名称" width="180" />
        <el-table-column label="开始时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.begin_time) }}
          </template>
        </el-table-column>
        <el-table-column label="结束时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.end_time) }}
          </template>
        </el-table-column>
        <el-table-column label="录像状态">
          <template #default="scope">
            <el-tag v-if="scope.row.has_recording" type="success">有录像</el-tag>
            <el-tag v-else type="info">无录像</el-tag>
            
            <el-tag v-if="scope.row.has_processed_recording" type="success" style="margin-left: 5px">有分析录像</el-tag>
            <el-tag v-else type="info" style="margin-left: 5px">无分析录像</el-tag>
            
            <el-tag v-if="scope.row.has_emotion_analysis" type="success" style="margin-left: 5px">有情绪分析</el-tag>
            <el-tag v-else type="info" style="margin-left: 5px">无情绪分析</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button 
              size="small" 
              type="primary" 
              @click.stop="viewRecording(scope.row)"
              :disabled="!scope.row.has_recording && !scope.row.has_processed_recording"
            >
              查看录像
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页组件 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    
    <!-- 录像播放对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="课程录像"
      width="80%"
      :before-close="handleDialogClose"
    >
      <div class="recording-player-container">
        <div class="video-container">
          <h3>{{ currentRecording ? currentRecording.course_title : '' }} - {{ formatDate(currentRecording?.begin_time) }}</h3>
          
          <div class="video-type-selector">
            <el-radio-group v-model="selectedVideoType" size="small">
              <el-radio-button label="original">原始录像</el-radio-button>
              <el-radio-button label="processed">情绪分析录像</el-radio-button>
            </el-radio-group>
          </div>
          
          <!-- 视频格式提示 -->
          <div v-if="effectiveVideoUrl && effectiveVideoUrl.toLowerCase().endsWith('.webm')" class="webm-notice">
            <el-alert
              title="WebM格式视频"
              type="info"
              description="当前视频为WebM格式，如果无法在页面内播放，请尝试使用'在新窗口中打开'选项"
              :closable="false"
              show-icon
            />
          </div>
          
          <!-- 播放速度控制 -->
          <div class="playback-controls">
            <span>播放速度: </span>
            <el-select v-model="playbackRate" size="small" @change="updatePlaybackRate">
              <el-option label="0.25x 超慢速" value="0.25" />
              <el-option label="0.5x 慢速" value="0.5" />
              <el-option label="0.75x 较慢" value="0.75" />
              <el-option label="1.0x 正常" value="1.0" />
              <el-option label="1.5x 较快" value="1.5" />
              <el-option label="2.0x 快速" value="2.0" />
            </el-select>
          </div>
          
          <!-- 调试信息 -->
          <div class="debug-info" v-if="currentRecording">
            <p><strong>当前选择的视频类型:</strong> {{ selectedVideoType }}</p>
            <p v-if="selectedVideoType === 'original'">
              <strong>原始录像URL:</strong> {{ currentRecording.recording_url || '未提供' }}
            </p>
            <p v-else>
              <strong>处理后录像URL:</strong> {{ currentRecording.processed_recording_url || '未提供' }}
            </p>
            <p><strong>流式播放URL:</strong> {{ videoUrl }}</p>
            <p><strong>提示:</strong> 如果视频无法播放，请检查服务器是否正确配置了视频文件的访问权限和MIME类型。</p>
            
            <div class="alternative-options">
              <p><strong>备选播放方式:</strong></p>
              <div class="alternative-buttons">
                <el-button 
                  v-if="directVideoUrl"
                  type="primary" 
                  size="small" 
                  @click="useDirectUrl = !useDirectUrl"
                >
                  {{ useDirectUrl ? '使用流视频API' : '使用直接URL' }}
                </el-button>
                <el-button 
                  v-if="effectiveVideoUrl"
                  type="success" 
                  size="small" 
                  @click="openInNewWindow"
                >
                  在新窗口中打开
                </el-button>
              </div>
            </div>
          </div>
          
          <video
            ref="videoPlayer"
            controls
            class="video-player"
            preload="auto"
            @error="handleVideoError"
            @loadeddata="handleVideoLoaded"
            @loadstart="handleVideoLoadStart"
            @canplay="handleVideoCanPlay"
            @canplaythrough="handleVideoCanPlayThrough"
            @ratechange="handleRateChange"
          ></video>
          
          <div v-if="!effectiveVideoUrl" class="no-video-message">
            <el-empty description="没有可播放的视频" />
          </div>
          
          <!-- 视频加载错误信息 -->
          <div v-if="videoError" class="video-error">
            <el-alert
              title="视频加载错误"
              type="error"
              description="视频无法加载，可能是因为文件不存在或格式不支持。"
              :closable="false"
              show-icon
            />
            <p class="error-details">{{ videoError }}</p>
            
            <!-- 备用下载选项 -->
            <div class="download-options">
              <p>您可以尝试下载视频并在本地播放：</p>
              <div class="download-buttons">
                <el-button 
                  v-if="currentRecording && currentRecording.recording_url" 
                  type="primary" 
                  size="small" 
                  @click="downloadVideo('original')"
                >
                  下载原始录像
                </el-button>
                <el-button 
                  v-if="currentRecording && currentRecording.processed_recording_url" 
                  type="success" 
                  size="small" 
                  @click="downloadVideo('processed')"
                >
                  下载处理后录像
                </el-button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="emotion-analysis-container" v-if="currentRecording && currentRecording.emotion_analysis_json">
          <h3 class="emotion-analysis-title">情绪分析结果</h3>
          
          <el-collapse>
            <el-collapse-item 
              v-for="(data, studentName) in currentRecording.emotion_analysis_json.summary" 
              :key="studentName" 
              :title="`学生: ${studentName}`"
            >
              <div class="student-analysis" :id="`student-${studentName}`">
                <p class="total-records"><strong>总记录数:</strong> {{ data.total_records }}</p>
                
                <h4 class="status-title">状态统计:</h4>
                <div class="status-data-container">
                  <div class="status-table-container">
                <el-table :data="getStatusTableData(data.status_counts)" style="width: 100%">
                      <el-table-column prop="status" label="状态">
                        <template #default="scope">
                          <div class="status-label" :style="{color: scope.row.color}">
                            {{ scope.row.status }}
                          </div>
                        </template>
                      </el-table-column>
                  <el-table-column prop="count" label="次数" />
                  <el-table-column prop="percentage" label="百分比">
                    <template #default="scope">
                          <div :style="{color: scope.row.color, fontWeight: 'bold'}">
                      {{ scope.row.percentage }}%
                          </div>
                    </template>
                  </el-table-column>
                </el-table>
                  </div>
                
                <div class="chart-container" v-if="data.status_counts">
                    <div class="chart-title">情绪状态分布图</div>
                  <div :id="`chart-${studentName}`" class="pie-chart"></div>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      
      <el-button 
        type="danger" 
        size="small" 
        @click="reloadVideo"
      >
        强制重新加载视频
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted, nextTick, computed, watch, onBeforeUnmount } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import api from '@/api';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([TitleComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);

export default {
  name: 'RecordingsPage',
  
  setup() {
    // 课程数据
    const courses = ref([]);
    const selectedCourseId = ref('');
    
    // 课程时间数据
    const courseTimes = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    const loading = ref(false);
    
    // 筛选选项
    const onlyWithRecording = ref(false);
    const onlyWithAnalysis = ref(false);
    
    // 录像播放
    const dialogVisible = ref(false);
    const currentRecording = ref(null);
    const selectedVideoType = ref('processed');
    const videoError = ref(null);
    const videoPlayer = ref(null);
    const useDirectUrl = ref(true); // 是否使用直接URL而不是流API - 默认为true
    const playbackRate = ref(0.5); // 新增播放速度控制
    
    // 计算视频URL (流式API)
    const videoUrl = computed(() => {
      if (!currentRecording.value) {
        console.log('videoUrl: 没有当前录像数据');
        return '';
      }
      
      const streamUrl = api.getStreamUrl(currentRecording.value.id, selectedVideoType.value === 'processed' ? 'processed' : 'original');
      console.log(`流式API URL (${selectedVideoType.value}):`, streamUrl);
      return streamUrl;
    });
    
    // 计算直接视频URL
    const directVideoUrl = computed(() => {
      if (!currentRecording.value) {
        console.log('directVideoUrl: 没有当前录像数据');
        return '';
      }
      
      let url = '';
      if (selectedVideoType.value === 'processed' && currentRecording.value.processed_recording_url) {
        url = currentRecording.value.processed_recording_url;
        console.log('使用处理后录像URL:', url);
      } else if (currentRecording.value.recording_url) {
        url = currentRecording.value.recording_url;
        console.log('使用原始录像URL:', url);
      } else {
        console.log('没有可用的视频URL');
        return '';
      }
      
      // 确保URL以http或/开头
      if (!url.startsWith('http') && !url.startsWith('/')) {
        url = '/' + url;
        console.log('修正后的URL:', url);
      }
      
      return url;
    });
    
    // 最终使用的视频URL
    const effectiveVideoUrl = computed(() => {
      const url = useDirectUrl.value ? directVideoUrl.value : videoUrl.value;
      console.log('最终使用的视频URL:', url);
      return url;
    });
    
    // 存储创建的Blob URL以便后续释放
    const blobUrls = ref([]);
    
    // 使用Blob URL加载视频的方法
    const loadVideoWithBlobUrl = async (url) => {
      try {
        console.log('使用Blob URL加载视频:', url);
        
        // 添加加载状态指示
        loading.value = true;
        
        // 通过fetch获取视频文件
        const response = await fetch(url, {
          // 可选：添加凭据
          // credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error(`视频加载失败: ${response.status} ${response.statusText}`);
        }
        
        // 获取视频数据并创建Blob对象
        const videoBlob = await response.blob();
        
        // 根据原始url的后缀确定正确的MIME类型
        let mimeType = 'video/mp4';
        if (url.toLowerCase().endsWith('.webm')) {
          mimeType = 'video/webm';
        }
        
        // 使用正确的MIME类型创建新的Blob
        const typedBlob = new Blob([videoBlob], { type: mimeType });
        
        // 创建Blob URL
        const blobUrl = URL.createObjectURL(typedBlob);
        console.log('创建Blob URL成功:', blobUrl);
        
        // 保存Blob URL以便后续释放
        blobUrls.value.push(blobUrl);
        
        // 更新视频元素的src
        if (videoPlayer.value) {
          videoPlayer.value.src = blobUrl;
          
          // 添加加载和错误事件监听器
          videoPlayer.value.onloadeddata = () => {
            console.log('视频从Blob URL加载成功');
            loading.value = false;
            // 设置播放速度
            videoPlayer.value.playbackRate = parseFloat(playbackRate.value);
            console.log('Blob URL加载设置视频播放速度:', playbackRate.value);
          };
          
          videoPlayer.value.onerror = (e) => {
            console.error('视频加载错误:', videoPlayer.value.error);
            loading.value = false;
          };
          
          // 尝试播放视频
          try {
            await videoPlayer.value.play();
          } catch (playError) {
            console.warn('自动播放失败:', playError);
            // 播放失败可能是浏览器政策导致，不是关键错误
          }
        }
        
        return blobUrl;
      } catch (error) {
        console.error('加载视频失败:', error);
        loading.value = false;
        return null;
      }
    };
    
    // 处理视频加载错误
    const handleVideoError = (event) => {
      const video = event.target;
      console.error('视频加载错误:', video.error);
      console.error('错误代码:', video.error.code);
      console.error('错误消息:', video.error.message);
      
      // 显示错误信息给用户
      ElMessage.error(`视频加载失败: ${video.error.message || '未知错误'}`);
    };
    
    // 处理视频加载成功
    const handleVideoLoaded = () => {
      console.log('视频加载成功');
      loading.value = false;
      
      // 设置播放速度
      if (videoPlayer.value) {
        videoPlayer.value.playbackRate = parseFloat(playbackRate.value);
        console.log('设置视频播放速度:', playbackRate.value);
      }
    };
    
    // 下载视频
    const downloadVideo = (type) => {
      if (!currentRecording.value) return;
      
      let url = '';
      let filename = '';
      
      if (type === 'original' && currentRecording.value.recording_url) {
        url = currentRecording.value.recording_url;
        filename = url.split('/').pop() || `original_${currentRecording.value.id}.mp4`;
      } else if (type === 'processed' && currentRecording.value.processed_recording_url) {
        url = currentRecording.value.processed_recording_url;
        filename = url.split('/').pop() || `processed_${currentRecording.value.id}.mp4`;
      } else {
        ElMessage.error('没有可下载的视频文件');
        return;
      }
      
      // 确保URL以/开头
      if (url && !url.startsWith('http') && !url.startsWith('/')) {
        url = '/' + url;
      }
      
      // 创建下载链接
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      ElMessage.success(`开始下载视频: ${filename}`);
    };
    
    // 加载课程列表
    const loadCourses = async () => {
      try {
        const res = await api.getCourses();
        if (res.code === 200) {
          courses.value = res.data.items;
        } else {
          ElMessage.error(res.message || '获取课程列表失败');
        }
      } catch (error) {
        console.error('加载课程列表失败:', error);
        ElMessage.error('加载课程列表失败');
      }
    };
    
    // 加载课程时间列表
    const loadCourseTimes = async () => {
      if (!selectedCourseId.value) return;
      
      loading.value = true;
      try {
        const res = await api.getCourseTimesList(
          selectedCourseId.value,
          currentPage.value,
          pageSize.value,
          onlyWithRecording.value,
          onlyWithAnalysis.value
        );
        
        if (res.code === 200) {
          courseTimes.value = res.data.items;
          total.value = res.data.total;
        } else {
          ElMessage.error(res.message || '获取课程时间列表失败');
        }
      } catch (error) {
        console.error('加载课程时间列表失败:', error);
        ElMessage.error('加载课程时间列表失败');
      } finally {
        loading.value = false;
      }
    };
    
    // 查看录像
    const viewRecording = async (recording) => {
      try {
        console.log('查看录像:', recording);
        loading.value = true;
        
        // 向服务器请求录像详情
        const res = await api.getRecordingDetail(recording.id);
        
        if (res.code === 200 && res.data) {
          currentRecording.value = res.data;
          dialogVisible.value = true;
          
          // 确保页面更新后加载视频
          nextTick(() => {
            if (currentRecording.value && currentRecording.value.emotion_analysis_json) {
              initCharts();
            }
            
            // 检查是否需要使用特殊加载方式处理WebM视频
            if (effectiveVideoUrl.value && effectiveVideoUrl.value.toLowerCase().endsWith('.webm')) {
              // 设置延时，确保DOM已更新
              setTimeout(() => {
                reloadVideo(); // 使用专为WebM优化的加载方法
              }, 500);
            }
            
            // 设置默认播放速度为0.5x，适合情绪分析视频观看
            if (videoPlayer.value) {
              setTimeout(() => {
                videoPlayer.value.playbackRate = parseFloat(playbackRate.value);
                console.log('视频对话框打开设置默认播放速度:', playbackRate.value);
              }, 700);
            }
          });
        } else {
          ElMessage.error(res.message || '获取录像详情失败');
        }
      } catch (error) {
        console.error('查看录像失败:', error);
        ElMessage.error('查看录像失败');
      }
    };
    
    // 初始化图表
    const initCharts = () => {
      if (!currentRecording.value || !currentRecording.value.emotion_analysis_json) return;
      
      const summary = currentRecording.value.emotion_analysis_json.summary;
      
      // 延迟一下确保DOM已完全更新
      setTimeout(() => {
        for (const studentName in summary) {
          const data = summary[studentName];
          if (!data.status_counts) continue;
          
          // 准备饼图数据
          const pieData = Object.entries(data.status_counts).map(([status, count]) => ({
            name: status,
            value: count
          }));
          
          // 使用ID直接查找图表容器
          const chartContainer = document.getElementById(`chart-${studentName}`);
          if (chartContainer) {
            // 如果有旧图表，先销毁
            const existingChart = echarts.getInstanceByDom(chartContainer);
            if (existingChart) {
              existingChart.dispose();
            }
            
            const chart = echarts.init(chartContainer);
            
            const option = {
              title: {
                text: '',  // 改为空，使用CSS添加的标题
                left: 'center',
                top: 0,
                textStyle: {
                  fontSize: 16,
                  fontWeight: 'normal'
                }
              },
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
              },
              legend: {
                orient: 'horizontal',
                left: 'center',
                top: 20,
                itemGap: 20,
                itemWidth: 14,
                itemHeight: 14,
                textStyle: {
                  fontSize: 13,
                  color: '#333'
                },
                data: Object.keys(data.status_counts)
              },
              series: [
                {
                  name: '情绪状态',
                  type: 'pie',
                  radius: ['15%', '65%'],
                  center: ['50%', '55%'],
                  avoidLabelOverlap: false,
                  itemStyle: {
                    borderRadius: 6,
                    borderWidth: 2,
                    borderColor: '#fff',
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.1)'
                  },
                  label: {
                    show: true,
                    position: 'outside',
                    formatter: '{b}: {d}%',
                    fontSize: 13,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 4,
                    padding: [4, 8],
                    lineHeight: 20,
                    color: '#333',
                    distance: 10
                  },
                  emphasis: {
                    label: {
                      show: true,
                      fontSize: 16,
                      fontWeight: 'bold'
                    },
                    itemStyle: {
                      shadowBlur: 15,
                      shadowColor: 'rgba(0, 0, 0, 0.2)'
                    }
                  },
                  labelLine: {
                    show: true,
                    length: 15,
                    length2: 10,
                    smooth: true
                  },
                  color: ['#67c23a', '#e6a23c', '#f56c6c', '#909399', '#409eff'],
                  data: pieData
                }
              ]
            };
            
            chart.setOption(option);
            
            // 确保图表正确渲染
            window.addEventListener('resize', () => {
              chart.resize();
            });
          } else {
            console.warn(`找不到学生 ${studentName} 的图表容器`);
          }
        }
      }, 100);
    };
    
    // 处理表格行点击
    const handleRowClick = (row) => {
      if (row.has_recording || row.has_processed_recording) {
        viewRecording(row);
      }
    };
    
    // 关闭对话框
    const handleDialogClose = () => {
      // 停止视频播放
      if (videoPlayer.value) {
        videoPlayer.value.pause();
      }
      
      dialogVisible.value = false;
      currentRecording.value = null;
      videoError.value = null;
    };
    
    // 处理课程变更
    const handleCourseChange = () => {
      currentPage.value = 1;
      loadCourseTimes();
    };
    
    // 处理分页变化
    const handleSizeChange = (size) => {
      pageSize.value = size;
      loadCourseTimes();
    };
    
    const handleCurrentChange = (page) => {
      currentPage.value = page;
      loadCourseTimes();
    };
    
    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };
    
    // 获取状态表格数据
    const getStatusTableData = (statusCounts) => {
      if (!statusCounts) return [];
      
      return Object.entries(statusCounts).map(([status, count]) => {
        // 计算百分比
        const total = Object.values(statusCounts).reduce((sum, c) => sum + c, 0);
        const percentage = ((count / total) * 100).toFixed(2);
        
        // 设置颜色
        let color = '#909399';
        if (status.toLowerCase().includes('focused')) {
          color = '#67c23a';
        } else if (status.toLowerCase().includes('distracted')) {
          color = '#e6a23c';
        } else if (status.toLowerCase().includes('absent')) {
          color = '#f56c6c';
        }
        
        return {
          status,
          count,
          percentage,
          color
        };
      });
    };
    
    // 打开视频在新窗口中
    const openInNewWindow = () => {
      if (effectiveVideoUrl.value) {
        console.log('在新窗口中打开视频:', {
          url: effectiveVideoUrl.value,
          selectedType: selectedVideoType.value,
          usingDirectUrl: useDirectUrl.value,
          originalUrl: currentRecording.value?.recording_url,
          processedUrl: currentRecording.value?.processed_recording_url
        });
        
        // 使用直接URL打开
        window.open(effectiveVideoUrl.value, '_blank');
      }
    };
    
    // 添加新的事件处理函数
    const handleVideoLoadStart = () => {
      console.log('视频开始加载', effectiveVideoUrl.value);
    };
    
    const handleVideoCanPlay = () => {
      console.log('视频可以开始播放', effectiveVideoUrl.value);
    };
    
    const handleVideoCanPlayThrough = () => {
      console.log('视频可以流畅播放', effectiveVideoUrl.value);
    };
    
    // 强制重新加载视频
    const reloadVideo = () => {
      if (videoPlayer.value) {
        console.log('强制重新加载视频', effectiveVideoUrl.value);
        
        // 检查是否为WebM格式
        const isWebM = effectiveVideoUrl.value.toLowerCase().endsWith('.webm');
        if (isWebM) {
          console.log('检测到WebM格式视频，使用特殊加载方式');
          
          // 创建一个临时对象URL来强制刷新
          fetch(effectiveVideoUrl.value)
            .then(response => response.blob())
            .then(blob => {
              // 创建blob URL
              const blobUrl = URL.createObjectURL(blob);
              console.log('创建Blob URL:', blobUrl);
              
              // 替换视频源
              const videoElement = videoPlayer.value;
              const source = document.createElement('source');
              source.setAttribute('src', blobUrl);
              source.setAttribute('type', 'video/webm;codecs=vp8,vorbis');
              
              // 清空现有源
              while (videoElement.firstChild) {
                videoElement.removeChild(videoElement.firstChild);
              }
              
              // 添加新源并加载
              videoElement.appendChild(source);
              videoElement.load();
              
              // 设置播放速度并播放
              videoElement.playbackRate = parseFloat(playbackRate.value);
              videoElement.play().catch(e => console.error('播放失败:', e));
              
              // 使用完后释放blob URL
              videoElement.onloadeddata = () => {
                console.log('从Blob URL加载视频成功');
                console.log('设置视频播放速度:', playbackRate.value);
                URL.revokeObjectURL(blobUrl);
              };
            })
            .catch(error => {
              console.error('获取视频数据失败:', error);
              // 回退到普通加载
              videoPlayer.value.load();
            });
        } else {
          // 普通加载方式
          videoPlayer.value.load();
          // 确保正常加载模式下也设置播放速度
          videoPlayer.value.onloadeddata = () => {
            videoPlayer.value.playbackRate = parseFloat(playbackRate.value);
            console.log('普通加载模式设置视频播放速度:', playbackRate.value);
          };
        }
      }
    };
    
    // 监听视频类型变化，自动重新加载WebM视频
    watch(selectedVideoType, (newType, oldType) => {
      if (newType !== oldType && effectiveVideoUrl.value) {
        console.log('视频类型变化:', oldType, '->', newType);
        if (effectiveVideoUrl.value.toLowerCase().endsWith('.webm')) {
          console.log('检测到WebM格式视频，延时重新加载');
          setTimeout(() => {
            reloadVideo();
          }, 300);
        }
      }
    });
    
    // 监听播放速度变化
    watch(playbackRate, (newValue) => {
      console.log('播放速度变化:', newValue);
      if (videoPlayer.value) {
        videoPlayer.value.playbackRate = parseFloat(newValue);
        console.log('实时更新视频播放速度:', newValue);
      }
    });
    
    // 释放所有创建的Blob URLs
    const releaseBlobUrls = () => {
      blobUrls.value.forEach(url => {
        try {
          URL.revokeObjectURL(url);
          console.log('释放Blob URL:', url);
        } catch (e) {
          console.error('释放Blob URL失败:', e);
        }
      });
      blobUrls.value = [];
    };
    
    // 组件销毁时清理资源
    onBeforeUnmount(() => {
      releaseBlobUrls();
    });
    
    // 页面加载完成后执行
    onMounted(() => {
      loadCourses();
    });
    
    // 更新播放速度
    const updatePlaybackRate = () => {
      if (videoPlayer.value) {
        videoPlayer.value.playbackRate = playbackRate.value;
      }
    };
    
    // 处理视频播放速度变化
    const handleRateChange = (event) => {
      console.log('播放速度变化事件:', event);
      console.log('当前播放速度:', videoPlayer.value?.playbackRate);
    };
    
    return {
      courses,
      selectedCourseId,
      courseTimes,
      currentPage,
      pageSize,
      total,
      loading,
      onlyWithRecording,
      onlyWithAnalysis,
      dialogVisible,
      currentRecording,
      selectedVideoType,
      videoUrl,
      directVideoUrl,
      effectiveVideoUrl,
      videoPlayer,
      videoError,
      useDirectUrl,
      playbackRate,
      loadCourses,
      loadCourseTimes,
      viewRecording,
      handleRowClick,
      handleDialogClose,
      handleCourseChange,
      handleSizeChange,
      handleCurrentChange,
      formatDate,
      getStatusTableData,
      handleVideoError,
      handleVideoLoaded,
      downloadVideo,
      openInNewWindow,
      handleVideoLoadStart,
      handleVideoCanPlay,
      handleVideoCanPlayThrough,
      reloadVideo,
      updatePlaybackRate,
      handleRateChange
    };
  }
};
</script>

<style scoped>
.recordings-page {
  padding: 20px;
}

.course-selector {
  margin-bottom: 20px;
}

.filter-options {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.course-times-container {
  margin-top: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.recording-player-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 20px;
}

.video-container {
  width: 100%;
}

.video-type-selector {
  margin: 15px 0;
}

.video-player {
  width: 100%;
  max-height: 500px;
  background-color: #000;
}

/* 对WebM视频进行特殊处理 */
.video-player[src$=".webm"] {
  /* 一些浏览器可能需要特殊设置来更好地支持WebM */
  object-fit: contain;
  background: #000;
}

.no-video-message {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.emotion-analysis-container {
  margin-top: 20px;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.emotion-analysis-container :deep(.el-collapse) {
  border: none;
}

.emotion-analysis-container :deep(.el-collapse-item__header) {
  background-color: #f0f2f5;
  padding: 0 15px;
  height: 50px;
  line-height: 50px;
  border-radius: 6px;
  margin-bottom: 10px;
  border-bottom: none;
  font-weight: bold;
}

.emotion-analysis-container :deep(.el-collapse-item__content) {
  padding: 10px 5px 25px;
}

.student-analysis {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.status-data-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-top: 20px;
}

.status-table-container {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.chart-container {
  width: 100%;
  margin: 20px auto 0;
  height: 370px;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px 20px 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-title {
  display: inline-block;
  background-color: #409eff;
  color: white;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.pie-chart {
  width: 100%;
  height: 330px;
  border-radius: 8px;
}

/* 新增样式 */
.debug-info {
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
}

.video-error {
  margin-top: 15px;
}

.error-details {
  margin-top: 10px;
  color: #f56c6c;
  font-size: 14px;
}

.download-options {
  margin-top: 10px;
}

.download-buttons {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.alternative-options {
  margin-top: 10px;
}

.alternative-buttons {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.webm-notice {
  margin-bottom: 15px;
}

.playback-controls {
  margin: 15px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #f5f7fa;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #e6e6e6;
}

.playback-controls span {
  font-weight: bold;
  color: #606266;
}

.emotion-analysis-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.total-records {
  margin-bottom: 15px;
  font-size: 15px;
  color: #606266;
  background-color: #f0f2f5;
  padding: 8px 12px;
  border-radius: 4px;
  display: inline-block;
}

.status-title {
  margin: 5px 0 15px 0;
  font-size: 16px;
  color: #303133;
  border-left: 3px solid #409eff;
  padding-left: 10px;
  line-height: 1.4;
}

.status-label {
  font-weight: bold;
  display: flex;
  align-items: center;
}

.status-label::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  background-color: currentColor;
}

@media (max-width: 768px) {
  .status-data-container {
    flex-direction: column;
    gap: 20px;
  }
  
  .status-table-container {
    max-width: 100%;
  }
  
  .chart-container {
    height: 330px;
    padding: 15px 15px 5px;
  }
  
  .pie-chart {
    height: 290px;
  }
}

/* 表格样式 */
.status-table-container :deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.status-table-container :deep(.el-table th) {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: bold;
  padding: 12px 0;
}

.status-table-container :deep(.el-table td) {
  padding: 10px 0;
}

.status-table-container :deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: #fafafa;
}
</style> 