<template>
  <div class="data-screen-container">
    <!-- 全屏控制 -->
    <div class="fullscreen-control" @click="toggleFullScreen">
      <i :class="isFullscreen ? 'el-icon-close' : 'el-icon-full-screen'"></i>
    </div>

    <!-- 头部 -->
    <Decoration10 class="header-decoration" />
    <header class="header">
      <div class="header-left">
        <Decoration5 style="width: 200px; height: 60px" />
      </div>
      <div class="header-center">
        <BorderBox12>
          <h1 class="title">AI职业助手数据监控平台</h1>
        </BorderBox12>
      </div>
      <div class="header-right">
        <Decoration5 style="width: 200px; height: 60px" :reverse="true" />
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="main-content">
      <!-- 左侧面板 -->
      <section class="left-panel">
        <BorderBox8 class="panel-item">
          <div class="panel-header">
            <h3>日活跃用户</h3>
          </div>
          <div class="chart-container" v-if="mounted">
            <ActiveRingChart :config="activeRingConfig" />
          </div>
        </BorderBox8>

        <BorderBox8 class="panel-item">
          <div class="panel-header">
            <h3>用户年龄分布</h3>
          </div>
          <div class="chart-container" v-if="mounted">
            <CapsuleChart :config="ageDistributionConfig" />
          </div>
        </BorderBox8>
      </section>

      <!-- 中间面板 -->
      <section class="center-panel">
        <BorderBox7 class="panel-item center-top">
          <div class="panel-header center">
            <h3>核心指标</h3>
          </div>
          <div class="data-overview">
            <div class="overview-item" v-for="(item, index) in overviewData" :key="index">
              <DigitalFlop v-if="mounted" :config="item.config" />
              <div class="data-label">{{ item.label }}</div>
            </div>
          </div>
        </BorderBox7>

        <BorderBox7 class="panel-item center-bottom">
          <div class="panel-header center">
            <h3>每日服务量</h3>
          </div>
          <div class="chart-container" v-if="mounted">
            <div ref="lineChartRef" style="width: 100%; height: 100%"></div>
          </div>
        </BorderBox7>
      </section>

      <!-- 右侧面板 -->
      <section class="right-panel">
        <BorderBox8 class="panel-item">
          <div class="panel-header">
            <h3>用户地域分布</h3>
          </div>
          <div class="chart-container" v-if="mounted">
            <ScrollBoard :config="regionConfig" />
          </div>
        </BorderBox8>

        <BorderBox8 class="panel-item">
          <div class="panel-header">
            <h3>简历制作量</h3>
          </div>
          <div class="chart-container" v-if="mounted">
            <WaterLevelPond :config="resumeConfig" />
          </div>
        </BorderBox8>
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, reactive, nextTick, watch } from 'vue'
import { useEventListener } from '@vueuse/core'
import { gsap } from 'gsap'

// 确保正确引入DataV组件，使用正确的大写命名
import {
  BorderBox7,
  BorderBox8,
  BorderBox12,
  Decoration5,
  Decoration10,
  ActiveRingChart,
  CapsuleChart,
  DigitalFlop,
  ScrollBoard,
  WaterLevelPond
} from '@kjgl77/datav-vue3'

// 引入 echarts
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// 注册 ECharts 必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer
])

// 添加一个状态来控制组件渲染
const mounted = ref(false)
// 引用 DOM 元素
const lineChartRef = ref(null)
// 存储 ECharts 实例
let lineChart: echarts.ECharts | null = null

// 全屏控制
const isFullscreen = ref(false)
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
      isFullscreen.value = false
    }
  }
}

// 自动刷新数据的定时器
let dataRefreshTimer: number | null = null

// 核心指标数据
const overviewData = ref([
  {
    label: '总用户数',
    value: 15862,
    unit: '人',
    config: {
      number: [15862],
      content: '{nt}',
      style: {
        fontSize: 36,
        fill: '#58a1ff'
      }
    }
  },
  {
    label: '职业规划完成',
    value: 7843,
    unit: '份',
    config: {
      number: [7843],
      content: '{nt}',
      style: {
        fontSize: 36,
        fill: '#58a1ff'
      }
    }
  },
  {
    label: '简历生成量',
    value: 5621,
    unit: '份',
    config: {
      number: [5621],
      content: '{nt}',
      style: {
        fontSize: 36,
        fill: '#58a1ff'
      }
    }
  },
  {
    label: '就业成功率',
    value: 82,
    unit: '%',
    config: {
      number: [82],
      content: '{nt}%',
      style: {
        fontSize: 36,
        fill: '#58a1ff'
      }
    }
  },
  {
    label: 'AI对话次数',
    value: 12756,
    unit: '次',
    config: {
      number: [12756],
      content: '{nt}',
      style: {
        fontSize: 36,
        fill: '#58a1ff'
      }
    }
  }
])

// 日活跃用户环图配置
const activeRingConfig = reactive({
  radius: '40%',
  activeRadius: '45%',
  data: [
    {
      name: '新用户',
      value: 35
    },
    {
      name: '老用户',
      value: 65
    }
  ],
  color: ['#00baff', '#3de7c9'],
  digitalFlopStyle: {
    fontSize: 20
  }
})

// 用户年龄分布配置
const ageDistributionConfig = reactive({
  data: [
    {
      name: '18-24岁',
      value: 93
    },
    {
      name: '25-29岁',
      value: 82
    },
    {
      name: '30-34岁',
      value: 65
    },
    {
      name: '35-39岁',
      value: 47
    },
    {
      name: '40岁以上',
      value: 25
    }
  ],
  colors: ['#00baff', '#3de7c9', '#ff9800', '#e91e63', '#9c27b0'],
  unit: '人'
})

// 用户地域分布配置
const regionConfig = reactive({
  header: ['城市', '职业规划数', '简历生成数', '就业成功率'],
  data: [
    ['北京', '1,245', '986', '85%'],
    ['上海', '1,087', '876', '82%'],
    ['广州', '854', '721', '78%'],
    ['深圳', '832', '687', '80%'],
    ['杭州', '587', '491', '75%'],
    ['成都', '476', '365', '72%'],
    ['武汉', '465', '343', '70%'],
    ['南京', '354', '302', '68%'],
    ['西安', '343', '274', '65%'],
    ['重庆', '332', '287', '62%']
  ],
  index: true,
  columnWidth: [80],
  align: ['center']
})

// 每日答题量折线图配置
const examLineConfig = reactive({
  title: {
    text: '',
    textStyle: {
      color: '#fff'
    }
  },
  legend: {
    show: true,
    top: '5%',
    textStyle: {
      color: '#fff'
    }
  },
  grid: {
    left: '5%',
    right: '5%',
    top: '15%',
    bottom: '10%',
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line'
    }
  },
  xAxis: {
    type: 'category',
    data: [
      '00:00',
      '02:00',
      '04:00',
      '06:00',
      '08:00',
      '10:00',
      '12:00',
      '14:00',
      '16:00',
      '18:00'
    ],
    axisLine: {
      lineStyle: {
        color: '#1D385A'
      }
    },
    axisLabel: {
      color: '#7EB9FF',
      fontSize: 12
    }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        color: '#1D385A'
      }
    },
    axisLine: {
      show: false
    },
    axisLabel: {
      color: '#7EB9FF',
      fontSize: 12
    }
  },
  series: [
    {
      name: '职业规划',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      data: [15, 25, 28, 32, 67, 82, 59, 71, 49, 38],
      itemStyle: {
        color: '#00BAFF'
      },
      lineStyle: {
        width: 2,
        shadowColor: 'rgba(0, 186, 255, 0.3)',
        shadowBlur: 10
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(0, 186, 255, 0.3)' },
            { offset: 1, color: 'rgba(0, 186, 255, 0.1)' }
          ]
        }
      }
    },
    {
      name: 'AI对话',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      data: [25, 35, 48, 42, 57, 92, 69, 81, 49, 48],
      itemStyle: {
        color: '#3DE7C9'
      },
      lineStyle: {
        width: 2,
        shadowColor: 'rgba(61, 231, 201, 0.3)',
        shadowBlur: 10
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(61, 231, 201, 0.3)' },
            { offset: 1, color: 'rgba(61, 231, 201, 0.1)' }
          ]
        }
      }
    }
  ]
})

// 简历制作量水位图配置
const resumeConfig = reactive({
  data: [78],
  shape: 'round',
  colors: ['#00baff', '#3de7c9'],
  waveNum: 3,
  waveHeight: 40,
  waveOpacity: 0.4,
  formatter: '{value}%'
})

// 初始化折线图
const initLineChart = () => {
  if (lineChartRef.value) {
    // 初始化图表
    lineChart = echarts.init(lineChartRef.value)
    // 设置配置
    lineChart.setOption(examLineConfig)
  }
}

// 重新调整图表大小
const resizeLineChart = () => {
  if (lineChart) {
    lineChart.resize()
  }
}

// 更新折线图数据
const updateLineChart = () => {
  if (lineChart) {
    lineChart.setOption({
      series: [
        {
          data: examLineConfig.series[0].data
        },
        {
          data: examLineConfig.series[1].data
        }
      ]
    })
  }
}

// 监听配置变化
watch(
  () => [examLineConfig.series[0].data, examLineConfig.series[1].data],
  () => {
    updateLineChart()
  },
  { deep: true }
)

// 模拟数据刷新函数
const refreshData = () => {
  // 更新总用户数
  overviewData.value[0].value = Math.floor(15000 + Math.random() * 2000)
  overviewData.value[0].config.number = [overviewData.value[0].value]

  // 更新职业规划完成数
  overviewData.value[1].value = Math.floor(7500 + Math.random() * 1000)
  overviewData.value[1].config.number = [overviewData.value[1].value]

  // 更新简历生成量
  overviewData.value[2].value = Math.floor(5000 + Math.random() * 1000)
  overviewData.value[2].config.number = [overviewData.value[2].value]

  // 更新就业成功率
  overviewData.value[3].value = Math.floor(75 + Math.random() * 15)
  overviewData.value[3].config.number = [overviewData.value[3].value]

  // 更新AI对话次数
  overviewData.value[4].value = Math.floor(12000 + Math.random() * 1500)
  overviewData.value[4].config.number = [overviewData.value[4].value]

  // 更新日活跃用户环图数据
  const newUserPercent = Math.floor(30 + Math.random() * 10)
  activeRingConfig.data = [
    {
      name: '新用户',
      value: newUserPercent
    },
    {
      name: '老用户',
      value: 100 - newUserPercent
    }
  ]

  // 更新每日折线图数据
  const newPlanningData = Array(10)
    .fill(0)
    .map(() => Math.floor(20 + Math.random() * 80))
  const newChatData = Array(10)
    .fill(0)
    .map(() => Math.floor(30 + Math.random() * 70))

  examLineConfig.series[0].data = newPlanningData
  examLineConfig.series[1].data = newChatData

  // 更新用户年龄分布数据
  ageDistributionConfig.data = [
    { name: '18-24岁', value: Math.floor(80 + Math.random() * 30) },
    { name: '25-29岁', value: Math.floor(70 + Math.random() * 25) },
    { name: '30-34岁', value: Math.floor(50 + Math.random() * 30) },
    { name: '35-39岁', value: Math.floor(35 + Math.random() * 25) },
    { name: '40岁以上', value: Math.floor(15 + Math.random() * 20) }
  ]

  // 更新简历制作量水位图数据
  resumeConfig.data = [Math.floor(70 + Math.random() * 20)]
}

const initEnterAnimation = () => {
  // 标题动画
  gsap.from('.title', {
    duration: 1,
    opacity: 0,
    y: -50,
    ease: 'power3.out'
  })

  // 面板动画
  gsap.from('.panel-item', {
    duration: 0.8,
    opacity: 0,
    y: 30,
    stagger: 0.2,
    ease: 'power2.out'
  })
}

onMounted(async () => {
  // 确保所有DOM元素已加载完成
  await nextTick()

  // 立即初始化
  mounted.value = true

  // 等待图表组件挂载后开始动画
  await nextTick()

  // 延迟执行动画效果
  setTimeout(async () => {
    try {
      // 初始化折线图
      initLineChart()

      // 执行进入动画
      initEnterAnimation()

      // 初始刷新一次数据
      refreshData()
    } catch (error) {
      console.error('初始化图表错误:', error)
    }
  }, 500) // 增加延迟时间以确保DOM完全渲染

  // 设置定时刷新数据
  dataRefreshTimer = window.setInterval(() => {
    refreshData()
  }, 30000) // 每30秒刷新一次数据

  // 监听窗口调整大小事件
  useEventListener(window, 'resize', () => {
    // 重新调整图表大小
    resizeLineChart()
  })
})

onUnmounted(() => {
  // 清除定时器
  if (dataRefreshTimer) {
    clearInterval(dataRefreshTimer)
    dataRefreshTimer = null
  }

  // 销毁图表实例
  if (lineChart) {
    lineChart.dispose()
    lineChart = null
  }
})
</script>

<style lang="scss" scoped>
.data-screen-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(to bottom, #041527, #062c45);
  color: #fff;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGOEIxNTU1QjUzOTgxMUU5QTdFM0NGMTc2NzIzRTY2NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGOEIxNTU1QzUzOTgxMUU5QTdFM0NGMTc2NzIzRTY2NyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkY4QjE1NTU5NTM5ODExRTlBN0UzQ0YxNzY3MjNFNjY3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkY4QjE1NTVBNTM5ODExRTlBN0UzQ0YxNzY3MjNFNjY3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+4a6kQQAAABtJREFUeNpi+P//PwM6YGLAAogXZGRk/AcIMADxZA1RhTNBNwAAAABJRU5ErkJggg==');
    opacity: 0.6;
    pointer-events: none;
  }

  // 全屏控制按钮
  .fullscreen-control {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    background: rgba(0, 30, 60, 0.7);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 100;
    border: 1px solid rgba(0, 198, 255, 0.4);
    box-shadow: 0 0 10px rgba(0, 198, 255, 0.3);
    transition: all 0.3s;

    &:hover {
      background: rgba(0, 40, 80, 0.9);
      transform: scale(1.1);
    }

    i {
      font-size: 20px;
      color: #0ff;
    }
  }

  // 头部装饰
  .header-decoration {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
  }

  // 头部
  .header {
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
    position: relative;

    &-left,
    &-right {
      flex: 1;
      display: flex;
      align-items: center;
    }

    &-center {
      text-align: center;
      width: 40%;
      padding: 0 20px;

      .title {
        font-size: 28px;
        font-weight: bold;
        background: linear-gradient(to bottom, #fff, #7eb9ff);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 10px rgba(0, 198, 255, 0.5);
        margin: 0;
        padding: 10px 0;
      }
    }
  }

  // 主体内容
  .main-content {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    height: calc(100% - 80px);

    .left-panel,
    .right-panel {
      width: 25%;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .center-panel {
      width: 45%;
      display: flex;
      flex-direction: column;
      gap: 20px;

      .center-top {
        height: 30%;
      }

      .center-bottom {
        height: 65%;
      }
    }

    .panel-item {
      height: calc(50% - 10px);
      position: relative;
      box-sizing: border-box;
      padding: 5px;
      overflow: hidden; /* 防止内容溢出 */

      .panel-header {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        padding: 0 15px;

        h3 {
          font-size: 18px;
          font-weight: normal;
          margin: 0;
          color: #0ff;
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }

        &.center {
          justify-content: center;
        }
      }

      .chart-container {
        height: calc(100% - 50px);
        width: 100%;
        position: relative; /* 为绝对定位的子元素提供参考 */
        display: flex;
        justify-content: center;
        align-items: center;

        & > div {
          width: 100%;
          height: 100%;
        }

        /* 确保DataV组件能够正确充满容器 */
        :deep(.dv-charts-container) {
          width: 100% !important;
          height: 100% !important;
        }

        :deep(canvas) {
          width: 100% !important;
          height: 100% !important;
        }
      }
    }

    // 核心指标数据展示
    .data-overview {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: calc(100% - 50px);

      .overview-item {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .data-label {
          font-size: 16px;
          color: #7eb9ff;
          margin-top: 10px;
        }
      }
    }
  }

  /* 确保DataV组件能够正确充满容器 */
  :deep(.dv-border-box-7),
  :deep(.dv-border-box-8),
  :deep(.dv-border-box-12),
  :deep(.dv-decoration-5),
  :deep(.dv-decoration-10) {
    width: 100% !important;
    height: 100% !important;
  }

  :deep(.dv-active-ring-chart),
  :deep(.dv-capsule-chart),
  :deep(.dv-water-level-pond),
  :deep(.dv-scroll-board) {
    width: 100% !important;
    height: 100% !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
  }
}
</style>
