<template>
  <div class="data-screen-container">
    <!-- 头部 -->
    <header class="header">
      <div class="header-left">
        <div class="decoration-line"></div>
      </div>
      <div class="header-center">
        <h1 class="title">数据可视化平台</h1>
        <div class="title-decoration"></div>
      </div>
      <div class="header-right">
        <div class="decoration-line"></div>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="main-content">
      <!-- 左侧面板 -->
      <section class="left-panel">
        <div class="panel-item chart-box">
          <div class="panel-header">
            <h3>销售业绩TOP5</h3>
            <div class="decoration"></div>
          </div>
          <div class="chart-container" ref="rankChartRef"></div>
        </div>
        <div class="panel-item chart-box">
          <div class="panel-header">
            <h3>销售趋势</h3>
            <div class="decoration"></div>
          </div>
          <div class="chart-container" ref="trendChartRef"></div>
        </div>
      </section>

      <!-- 中间面板 -->
      <section class="center-panel">
        <div class="panel-item chart-box">
          <div class="panel-header center">
            <h3>核心指标</h3>
            <div class="decoration"></div>
          </div>
          <div class="data-overview">
            <div class="overview-item" v-for="(item, index) in overviewData" :key="index">
              <div class="data-value" ref="countRefs">{{ formatNumber(item.value) }}</div>
              <div class="data-label">{{ item.label }}</div>
            </div>
          </div>
          <div class="center-chart">
            <div class="chart-container" ref="centerChartRef"></div>
          </div>
        </div>
      </section>

      <!-- 右侧面板 -->
      <section class="right-panel">
        <div class="panel-item chart-box">
          <div class="panel-header">
            <h3>区域分布</h3>
            <div class="decoration"></div>
          </div>
          <div class="chart-container" ref="mapChartRef"></div>
        </div>
        <div class="panel-item chart-box">
          <div class="panel-header">
            <h3>实时监控</h3>
            <div class="decoration"></div>
          </div>
          <div class="chart-container" ref="monitorChartRef"></div>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { useEventListener } from '@vueuse/core'
import { gsap } from 'gsap'
import { CountUp } from 'countup.js'

const countUpRefs = ref<CountUp[]>([])

// 数字动画
const initCountUp = () => {
  const options = {
    duration: 2.5,
    useEasing: true,
    useGrouping: true,
    separator: ',',
    decimal: '.',
    prefix: '',
    suffix: ''
  }

  overviewData.value.forEach((item, index) => {
    const element = document.getElementById(`count-${index}`)
    if (element) {
      const countUp = new CountUp(element, item.value, options)
      if (!countUp.error) {
        countUpRefs.value.push(countUp)
        countUp.start()
      }
    }
  })
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

  // 装饰线动画
  gsap.from('.decoration-line', {
    duration: 1.5,
    scaleY: 0,
    ease: 'elastic.out(1, 0.5)',
    stagger: 0.1
  })
}

const overviewData = ref([
  { label: '销售额', value: 15862, unit: '万' },
  { label: '订单量', value: 8546, unit: '个' },
  { label: '用户数', value: 3375, unit: '人' }
])

// 格式化数字
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('zh-CN').format(num)
}

// 图表实例
const rankChartRef = ref<HTMLElement | null>(null)
const trendChartRef = ref<HTMLElement | null>(null)
const centerChartRef = ref<HTMLElement | null>(null)
const mapChartRef = ref<HTMLElement | null>(null)
const monitorChartRef = ref<HTMLElement | null>(null)

let charts: echarts.ECharts[] = []

const initRankChart = () => {
  if (!rankChartRef.value) return
  const chart = echarts.init(rankChartRef.value)
  charts.push(chart)

  const option = {
    grid: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
      containLabel: true
    },
    xAxis: {
      type: 'value',
      show: false
    },
    yAxis: {
      type: 'category',
      data: ['销售A', '销售B', '销售C', '销售D', '销售E'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#fff'
      }
    },
    series: [
      {
        type: 'bar',
        data: [85632, 75842, 65234, 54321, 45678],
        barWidth: 10,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#0B4FA7' },
            { offset: 1, color: '#38B2E6' }
          ])
        },

        label: {
          show: true,
          position: 'right',
          color: '#fff'
        }
      }
    ]
  }

  chart.setOption(option)
}

const initTrendChart = () => {
  if (!trendChartRef.value) return
  const chart = echarts.init(trendChartRef.value)
  charts.push(chart)

  const option = {
    grid: {
      top: 30,
      right: 30,
      bottom: 30,
      left: 30
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
      axisLine: {
        lineStyle: {
          color: '#fff'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#fff'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255,255,255,0.1)'
        }
      }
    },
    series: [
      {
        data: [45, 52, 78, 85, 65, 92],
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#67a1e5'
        },

        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(103,161,229,0.3)'
            },
            {
              offset: 1,
              color: 'rgba(103,161,229,0)'
            }
          ])
        },
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#67a1e5',
          borderColor: '#fff',
          borderWidth: 2
        }
      }
    ]
  }

  chart.setOption(option)
}

const initMapChart = () => {
  if (!mapChartRef.value) return
  const chart = echarts.init(mapChartRef.value)
  charts.push(chart)

  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: {
        color: '#fff'
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        data: [
          { value: 25, name: '北京' },
          { value: 30, name: '上海' },
          { value: 20, name: '广州' },
          { value: 25, name: '深圳' }
        ],
        label: {
          color: '#fff'
        },
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },

        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  chart.setOption(option)
}

// const initMonitorChart = () => {
//   if (!monitorChartRef.value) return
//   const chart = echarts.init(monitorChartRef.value)
//   charts.push(chart)
// }

const handleResize = () => {
  charts.forEach(chart => chart.resize())
}

const initCharts = () => {
  initRankChart()
  initTrendChart()
  initMapChart()
  // initMonitorChart()
}

//
onMounted(() => {
  initCharts()
  initCountUp()
  initEnterAnimation()
  useEventListener(window, 'resize', handleResize)
})

onUnmounted(() => {
  charts.forEach(chart => chart.dispose())
  charts = []
  countUpRefs.value = []
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

  .header {
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
    background: linear-gradient(
      90deg,
      rgba(6, 44, 69, 0) 0%,
      rgba(6, 44, 69, 0.8) 50%,
      rgba(6, 44, 69, 0) 100%
    );
    position: relative;

    &-left,
    &-right {
      flex: 1;
      display: flex;
      align-items: center;

      .decoration-line {
        height: 60px;
        width: 2px;
        background: linear-gradient(to bottom, transparent, #0ff, transparent);
        position: relative;
        margin: 0 20px;

        &::before,
        &::after {
          content: '';
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #0ff;
          left: 50%;
          transform: translateX(-50%);
        }

        &::before {
          top: 0;
        }
        &::after {
          bottom: 0;
        }
      }
    }

    &-center {
      text-align: center;

      .title {
        font-size: 36px;
        font-weight: bold;
        background: linear-gradient(to bottom, #fff, #7eb9ff);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 10px rgba(0, 198, 255, 0.5);
        margin: 0;
      }
    }
  }

  .main-content {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    height: calc(100% - 80px);

    .left-panel,
    .right-panel {
      width: 25%;
    }

    .center-panel {
      width: 45%;
    }

    .panel-item {
      height: calc(50% - 10px);
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .chart-box {
      background: rgba(6, 30, 93, 0.5);
      border-radius: 4px;
      padding: 12px;
      box-shadow: 0 0 20px rgba(0, 198, 255, 0.1);
      backdrop-filter: blur(5px);
      border: 1px solid rgba(0, 198, 255, 0.1);
      .panel-header {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;

        h3 {
          font-size: 18px;
          font-weight: normal;
          margin: 0;
          padding-left: 10px;
          position: relative;

          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 3px;
            height: 16px;
            background: #0ff;
            border-radius: 2px;
          }
        }

        &.center {
          justify-content: center;
        }
      }

      .chart-container {
        height: calc(100% - 50px);
      }
    }

    .data-overview {
      display: flex;
      justify-content: space-around;
      margin: 20px 0;

      .overview-item {
        text-align: center;

        .data-value {
          font-size: 36px;
          font-weight: bold;
          background: linear-gradient(to bottom, #fff, #7eb9ff);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 5px;
        }

        .data-label {
          font-size: 14px;
          color: #7eb9ff;
        }
      }
    }
  }
}
</style>

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

  .header {
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
    background: linear-gradient(
      90deg,
      rgba(6, 44, 69, 0) 0%,
      rgba(6, 44, 69, 0.8) 50%,
      rgba(6, 44, 69, 0) 100%
    );
    position: relative;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 0;
      width: 50%;
      height: 100%;
      z-index: -1;
    }

    &::before {
      left: 0;
      background: linear-gradient(90deg, transparent, rgba(0, 198, 255, 0.1));
    }

    &::after {
      right: 0;
      background: linear-gradient(-90deg, transparent, rgba(0, 198, 255, 0.1));
    }

    .decoration-left,
    .decoration-right {
      display: flex;
      gap: 8px;

      .decoration-item {
        width: 4px;
        height: 30px;
        background: linear-gradient(to bottom, #568aea, #000000);
        transform: skewX(-15deg);
      }
    }

    .decoration-right .decoration-item {
      transform: skewX(15deg);
    }

    .title {
      font-size: 36px;
      position: relative;
      text-align: center;
      background: linear-gradient(to bottom, #fff, #7eb9ff);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 10px rgba(0, 198, 255, 0.5);
      font-weight: bold;
      letter-spacing: 4px;

      .title-decoration {
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 6px;

        .decoration-bar {
          width: 30px;
          height: 4px;
          background: linear-gradient(to right, #50e3c2, #67a1e5);
        }
      }
    }
  }

  .main-content {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    height: calc(100% - 80px);

    .left-panel,
    .right-panel {
      width: 25%;

      .panel-item {
        height: 45%;
        margin-bottom: 20px;

        .chart-title {
          height: 40px;
          line-height: 40px;
          text-align: center;
          font-size: 20px;
        }

        .chart-content {
          height: calc(100% - 40px);

          .echarts {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .center-panel {
      width: 45%;

      .center-title {
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;

        span {
          margin: 0 20px;
        }
      }

      .digital-flop-container {
        display: flex;
        justify-content: space-around;
        margin-top: 40px;

        .digital-flop-item {
          text-align: center;

          .digital-flop-title {
            margin-top: 10px;
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>
