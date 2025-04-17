<template>
  <div class="data-screen-container">
    <!-- 全屏控制和返回主页按钮 -->
    <div class="screen-controls">
      <div class="control-button fullscreen-control" @click="toggleFullScreen">
        <el-icon size="24">
          <FullScreen v-if="!isFullscreen" />
          <Close v-else />
        </el-icon>
      </div>
      <div class="control-button home-control" @click="returnHome">
        <el-icon size="24"><HomeFilled /></el-icon>
      </div>
    </div>

    <!-- 头部 -->
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

    <Decoration10 class="header-decoration" />

    <!-- 主体内容 -->
    <main class="main-content">
      <!-- 左侧面板 -->
      <section class="left-panel">
        <BorderBox8 class="panel-item">
          <div class="panel-header">
            <h3>日活跃用户</h3>
            <Decoration1 style="width: 40px; height: 25px; margin-left: 5px">实时监控</Decoration1>
          </div>
          <div class="chart-container active-users-container" v-if="mounted">
            <div class="active-users-grid">
              <div class="grid-item">
                <div class="chart-title">今日访问人数</div>
                <DigitalFlop :config="activeUserCountConfig" />
              </div>
              <div class="grid-item">
                <div class="chart-title" style="margin-bottom: 35px !important">用户类型占比</div>
                <ActiveRingChart :config="activeRingConfig" />
              </div>
              <div class="grid-item">
                <div class="chart-title">访问趋势</div>
                <div ref="miniLineChartRef" class="mini-chart"></div>
              </div>
              <div class="grid-item">
                <div class="chart-title">活跃时段</div>
                <div ref="hourlyBarChartRef" class="mini-chart"></div>
              </div>
            </div>
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
            <!-- <Decoration11 style="width:150px; height:30px;">核心指标</Decoration11> -->
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
            <Decoration6 style="width: 100px; height: 30px" />
          </div>
          <div class="chart-container" v-if="mounted">
            <ScrollBoard :config="regionConfig" style="" />
          </div>
        </BorderBox8>

        <BorderBox8 class="panel-item">
          <div class="panel-header">
            <h3>简历优化率</h3>
            <Decoration1 style="width: 100px; height: 25px; margin-left: 10px"
              >实时数据</Decoration1
            >
          </div>
          <div class="chart-container resume-container" v-if="mounted">
            <WaterLevelPond :config="resumeConfig" />
          </div>
        </BorderBox8>
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, reactive, nextTick } from 'vue'
import { useEventListener } from '@vueuse/core'
import { gsap } from 'gsap'

import {
  BorderBox7,
  BorderBox8,
  BorderBox12,
  Decoration5,
  Decoration10,
  Decoration1,
  Decoration6,
  ActiveRingChart,
  CapsuleChart,
  DigitalFlop,
  ScrollBoard,
  WaterLevelPond
} from '@kjgl77/datav-vue3'

// 引入 echarts
import * as echarts from 'echarts/core'
import { LineChart, BarChart } from 'echarts/charts'
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
  BarChart,
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

// 返回主页
const returnHome = () => {
  window.location.href = '/dashboard'
}

// 自动刷新数据的定时器
let dataRefreshTimer: number | null = null
// 折线图数据的单独定时器
let lineChartRefreshTimer: number | null = null
// 日活跃用户小图表实例
let miniLineChart: echarts.ECharts | null = null
let hourlyBarChart: echarts.ECharts | null = null

// 核心指标数据
const overviewData = ref([
  {
    label: '总用户数',
    value: 662,
    unit: '人',
    config: {
      number: [662],
      content: '{nt}',
      style: {
        fontSize: 48,
        fill: '#58a1ff',
        fontWeight: 'bold',
        textShadow: '0 0 10px rgba(88, 161, 255, 0.8)'
      },
      toFixed: 0,
      rowGap: 0,
      animationCurve: 'easeOutCubic',
      animationFrame: 50
    }
  },
  {
    label: '职业规划完成',
    value: 7843,
    unit: '份',
    config: {
      number: [243],
      content: '{nt}',
      style: {
        fontSize: 48,
        fill: '#00baff',
        fontWeight: 'bold',
        textShadow: '0 0 10px rgba(0, 186, 255, 0.8)'
      },
      toFixed: 0,
      rowGap: 0,
      animationCurve: 'easeOutCubic',
      animationFrame: 50
    }
  },
  {
    label: '简历生成量',
    value: 621,
    unit: '份',
    config: {
      number: [621],
      content: '{nt}',
      style: {
        fontSize: 48,
        fill: '#3de7c9',
        fontWeight: 'bold',
        textShadow: '0 0 10px rgba(61, 231, 201, 0.8)'
      },
      toFixed: 0,
      rowGap: 0,
      animationCurve: 'easeOutCubic',
      animationFrame: 50
    }
  },
  {
    label: 'AI对话次数',
    value: 756,
    unit: '次',
    config: {
      number: [756],
      content: '{nt}',
      style: {
        fontSize: 48,
        fill: '#e062ae',
        fontWeight: 'bold',
        textShadow: '0 0 10px rgba(224, 98, 174, 0.8)'
      },
      toFixed: 0,
      rowGap: 0,
      animationCurve: 'easeOutCubic',
      animationFrame: 50
    }
  }
])

// 今日访问人数数字翻牌器配置
const activeUserCountConfig = reactive({
  number: [328],
  content: '{nt}',
  style: {
    fontSize: 40,
    fill: '#3de7c9',
    fontWeight: 'bold',
    textShadow: '0 0 8px rgba(61, 231, 201, 0.8)'
  },
  toFixed: 0,
  rowGap: 0,
  animationCurve: 'easeOutCubic',
  animationFrame: 50
})

// 日活跃用户环图配置
const activeRingConfig = reactive({
  radius: '55%',
  activeRadius: '60%',
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
    fontSize: 14,
    fill: '#3de7c9',
    textAlign: 'center'
  },
  lineWidth: 5
})

// 访问趋势小图配置
const miniLineChartConfig = reactive({
  grid: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['00', '04', '08', '12', '16', '20'],
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#7EB9FF',
      fontSize: 10
    }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      show: false
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      show: false
    }
  },
  series: [
    {
      type: 'line',
      data: [35, 20, 45, 75, 55, 40],
      smooth: true,
      symbol: 'none',
      lineStyle: {
        color: '#3de7c9',
        width: 3
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
            { offset: 1, color: 'rgba(61, 231, 201, 0)' }
          ]
        }
      },
      emphasis: {
        focus: 'series'
      }
    }
  ],
  animation: true
})

// 活跃时段小图配置
const hourlyBarChartConfig = reactive({
  grid: {
    top: 10,
    right: 15,
    bottom: 10,
    left: 15,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['早晨', '上午', '下午', '晚上'],
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#7EB9FF',
      fontSize: 11
    }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      show: false
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      show: false
    }
  },
  series: [
    {
      type: 'bar',
      data: [25, 55, 70, 45],
      barWidth: 10,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#00baff' },
            { offset: 1, color: '#3de7c9' }
          ]
        },
        borderRadius: [3, 3, 0, 0]
      },
      emphasis: {
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#3de7c9' },
              { offset: 1, color: '#00baff' }
            ]
          }
        }
      }
    }
  ],
  animation: true
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
  header: ['城市', '规划数', '简历数', '投递率'],
  data: [
    [
      '<span style="color:#37a2da;">北京</span>',
      '1,245',
      '986',
      '<span style="color:#67e0e3;">85%</span>'
    ],
    [
      '<span style="color:#32c5e9;">上海</span>',
      '1,087',
      '876',
      '<span style="color:#9fe6b8;">82%</span>'
    ],
    [
      '<span style="color:#ffdb5c;">广州</span>',
      '854',
      '721',
      '<span style="color:#ff9f7f;">78%</span>'
    ],
    [
      '<span style="color:#fb7293;">深圳</span>',
      '832',
      '687',
      '<span style="color:#e062ae;">80%</span>'
    ],
    ['杭州', '<span style="color:#37a2da;">587</span>', '491', '75%'],
    ['成都', '<span style="color:#32c5e9;">476</span>', '365', '72%'],
    ['武汉', '<span style="color:#ffdb5c;">465</span>', '343', '70%'],
    ['南京', '354', '<span style="color:#fb7293;">302</span>', '68%'],
    ['西安', '343', '<span style="color:#e062ae;">274</span>', '65%'],
    ['重庆', '332', '<span style="color:#e7bcf3;">287</span>', '62%']
  ],
  index: true,
  columnWidth: [60, 65, 65, 65], // 进一步调整列宽
  align: ['center', 'center', 'center', 'center'], // 所有列居中对齐
  headerBGC: 'rgba(0, 80, 179, 0.6)', // 增加表头背景色明显度
  headerHeight: 45, // 增加表头高度
  oddRowBGC: 'rgba(0, 72, 179, 0.1)', // 奇数行背景色
  evenRowBGC: 'rgba(0, 72, 179, 0.2)', // 偶数行背景色
  waitTime: 2000 // 每页停留3秒
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
    // 创建一个轻微变化的数据，模拟实时数据流
    const currentPlanningData = [...examLineConfig.series[0].data]
    const currentChatData = [...examLineConfig.series[1].data]

    // 移除第一个数据点并在末尾添加新的随机数据点
    currentPlanningData.shift()
    currentChatData.shift()

    // 基于最后一个值添加一个相对平滑的新值（避免大幅波动）
    const lastPlanningValue = currentPlanningData[currentPlanningData.length - 1]
    const lastChatValue = currentChatData[currentChatData.length - 1]

    // 在上一个值的基础上增减一个小的随机量（保持在合理范围内）
    const newPlanningValue = Math.max(
      20,
      Math.min(100, lastPlanningValue + (Math.random() - 0.5) * 15)
    )
    const newChatValue = Math.max(30, Math.min(100, lastChatValue + (Math.random() - 0.5) * 15))

    currentPlanningData.push(newPlanningValue)
    currentChatData.push(newChatValue)

    // 更新图表配置
    examLineConfig.series[0].data = currentPlanningData
    examLineConfig.series[1].data = currentChatData

    // 更新x轴数据（时间轴前进）
    const currentTimeData = [...examLineConfig.xAxis.data]
    currentTimeData.shift()

    // 获取最后一个时间并增加2小时
    const lastTime = currentTimeData[currentTimeData.length - 1]
    const [hours] = lastTime.split(':').map(Number)
    const newHours = (hours + 2) % 24
    const newTime = `${newHours.toString().padStart(2, '0')}:00`
    currentTimeData.push(newTime)

    examLineConfig.xAxis.data = currentTimeData

    // 应用新数据到图表 - 添加动画效果强调时间轴更新
    lineChart.setOption({
      xAxis: {
        data: examLineConfig.xAxis.data,
        axisLabel: {
          color: (_value: string, index: number) => {
            // 最新的时间点显示为高亮颜色
            return index === 9 ? '#ffeb3b' : '#7EB9FF'
          },
          fontWeight: (_value: string, index: number) => {
            // 最新的时间点显示为粗体
            return index === 9 ? 'bold' : 'normal'
          },
          fontSize: (_value: string, index: number) => {
            // 最新的时间点字体稍大
            return index === 9 ? 14 : 12
          }
        }
      },
      series: [
        {
          data: examLineConfig.series[0].data,
          markPoint: {
            symbol: 'circle',
            symbolSize: 10,
            data: [
              { type: 'max', name: '最大值' },
              {
                coord: [9, currentPlanningData[9]],
                name: '最新点',
                itemStyle: {
                  color: '#00BAFF',
                  borderColor: '#fff',
                  borderWidth: 2
                }
              }
            ]
          }
        },
        {
          data: examLineConfig.series[1].data,
          markPoint: {
            symbol: 'circle',
            symbolSize: 10,
            data: [
              { type: 'max', name: '最大值' },
              {
                coord: [9, currentChatData[9]],
                name: '最新点',
                itemStyle: {
                  color: '#3DE7C9',
                  borderColor: '#fff',
                  borderWidth: 2
                }
              }
            ]
          }
        }
      ],
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut'
    })
  }
}

// 初始化所有图表
const initAllCharts = () => {
  // 初始化主折线图
  initLineChart()

  // 初始化访问趋势小折线图
  if (miniLineChartRef.value) {
    miniLineChart = echarts.init(miniLineChartRef.value)
    miniLineChart.setOption(miniLineChartConfig)
  }

  // 初始化活跃时段柱状图
  if (hourlyBarChartRef.value) {
    hourlyBarChart = echarts.init(hourlyBarChartRef.value)
    hourlyBarChart.setOption(hourlyBarChartConfig)
  }
}

// 更新所有小图表
const updateMiniCharts = () => {
  // 更新访问趋势
  if (miniLineChart) {
    const newData = Array(6)
      .fill(0)
      .map(() => Math.floor(15 + Math.random() * 65))

    miniLineChartConfig.series[0].data = newData

    miniLineChart.setOption({
      series: [
        {
          data: newData
        }
      ]
    })
  }

  // 更新活跃时段
  if (hourlyBarChart) {
    const newData = [
      Math.floor(15 + Math.random() * 35),
      Math.floor(40 + Math.random() * 30),
      Math.floor(50 + Math.random() * 30),
      Math.floor(30 + Math.random() * 30)
    ]

    hourlyBarChartConfig.series[0].data = newData

    hourlyBarChart.setOption({
      series: [
        {
          data: newData
        }
      ]
    })
  }

  // 更新今日访问人数数据
  const newUserCount = Math.floor(250 + Math.random() * 150)
  activeUserCountConfig.number = [newUserCount]
}

// 模拟数据刷新函数
const refreshData = () => {
  // 更新总用户数
  overviewData.value[0].value = Math.floor(500 + Math.random() * 200)
  overviewData.value[0].config.number = [overviewData.value[0].value]

  // 更新职业规划完成数
  overviewData.value[1].value = Math.floor(250 + Math.random() * 100)
  overviewData.value[1].config.number = [overviewData.value[1].value]

  // 更新简历生成量
  overviewData.value[2].value = Math.floor(2000 + Math.random() * 300)
  overviewData.value[2].config.number = [overviewData.value[2].value]

  // 更新AI对话次数
  overviewData.value[3].value = Math.floor(750 + Math.random() * 150)
  overviewData.value[3].config.number = [overviewData.value[3].value]

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

  // 更新所有小图表
  updateMiniCharts()

  // 完全随机化折线图数据
  examLineConfig.series[0].data = Array(10)
    .fill(0)
    .map(() => Math.floor(20 + Math.random() * 80))
  examLineConfig.series[1].data = Array(10)
    .fill(0)
    .map(() => Math.floor(30 + Math.random() * 70))

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
      // 初始化所有图表
      initAllCharts()

      // 执行进入动画
      initEnterAnimation()

      // 初始刷新一次数据
      refreshData()

      // 设置折线图数据动态更新定时器 - 每2.5秒更新一次
      lineChartRefreshTimer = window.setInterval(() => {
        updateLineChart()
        updateMiniCharts() // 同时更新小图表
      }, 2500)
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

  // 清除折线图更新定时器
  if (lineChartRefreshTimer) {
    clearInterval(lineChartRefreshTimer)
    lineChartRefreshTimer = null
  }

  // 销毁图表实例
  if (lineChart) {
    lineChart.dispose()
    lineChart = null
  }

  // 销毁小图表实例
  if (miniLineChart) {
    miniLineChart.dispose()
    miniLineChart = null
  }

  if (hourlyBarChart) {
    hourlyBarChart.dispose()
    hourlyBarChart = null
  }
})

// 添加小图表的DOM引用
const miniLineChartRef = ref(null)
const hourlyBarChartRef = ref(null)
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

  // 返回主页按钮
  .home-control {
    position: absolute;
    top: 20px;
    right: 70px;
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
    top: 40px; /* 调整到header高度位置 */
    left: 0;
    width: 100%;
    height: 5px;
    z-index: 10; /* 确保在其他元素之上 */
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
        font-size: 18px;
        font-weight: normal;
        margin: 0;
        color: #0ff;
        text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);

        h3 {
          font-size: 18px;
          font-weight: normal;
          margin: 0;
          color: #0ff;
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }

        &.center {
          justify-content: center;
          gap: 15px;
        }
      }

      .chart-container {
        height: calc(100% - 50px);
        width: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;

        &.active-users-container {
          padding: 10px;

          .active-users-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            gap: 10px;
            width: 100%;
            height: 100%;

            .grid-item {
              position: relative;
              background: rgba(6, 30, 93, 0.3);
              border-radius: 4px;
              border: 1px solid rgba(0, 150, 199, 0.2);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              overflow: hidden;

              &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(
                  to right,
                  transparent,
                  rgba(0, 198, 255, 0.5),
                  transparent
                );
              }

              .chart-title {
                position: absolute;
                top: 5px;
                left: 0;
                width: 100%;
                text-align: center;
                font-size: 12px;
                color: rgba(126, 185, 255, 0.9);
                z-index: 5;
              }

              .mini-chart {
                width: 100%;
                height: 100%;
                padding-top: 20px;
              }
              &:nth-child(1) {
                padding-top: 12px;

                .dv-active-ring-chart {
                  margin-top: 10px;
                }
              }

              &:nth-child(2) {
                padding-top: 12px;

                .dv-active-ring-chart {
                  margin-top: 10px;
                }
              }
            }
          }
        }

        &.resume-container {
          padding-bottom: 10px;
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
      height: calc(100% - 60px);
      padding: 10px 0;

      .overview-item {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        background: rgba(4, 21, 66, 0.7);
        border-radius: 4px;
        box-shadow: 0 0 20px rgba(0, 178, 255, 0.15);
        padding: 10px 5px;
        width: 22%;
        height: 85%;
        transition: all 0.4s;
        border: 1px solid rgba(32, 89, 162, 0.2);

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 195, 255, 0.3);
          border: 1px solid rgba(32, 89, 162, 0.5);
        }

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(to right, transparent, rgba(0, 198, 255, 0.5), transparent);
        }

        .data-label {
          font-size: 14px;
          color: rgba(126, 185, 255, 0.85);
          margin-top: 20px;
          font-weight: 500;
          letter-spacing: 1px;
        }
      }
    }
  }

  /* 确保DataV组件能够正确充满容器 */
  :deep(.dv-border-box-7),
  :deep(.dv-border-box-8),
  :deep(.dv-border-box-12),
  :deep(.dv-decoration-5),
  :deep(.dv-decoration-10),
  :deep(.dv-decoration-1) {
    width: 100% !important;
    height: 100% !important;
  }
  :deep(.dv-decoration-1) {
    width: 30% !important;
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
