<template>
  <div class="line-chart-container">
    <h2>{{ title }}</h2>
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup lang="ts" name="LineChart">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts';

const props = defineProps<{
  title?: string;
}>();

const title = props.title || '折线图111';
const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const getChartOptions = () => ({
  title: {
    text: title,
    left: 'center',
    textStyle: {
      color: '#333',
      fontSize: 24
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['蒸发量', '降水量'],
    top: 50,
    textStyle: {
      color: '#666'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    axisLine: {
      lineStyle: {
        color: '#ccc'
      }
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#ccc'
      }
    },
    splitLine: {
      lineStyle: {
        color: '#eee'
      }
    }
  },
  series: [
    {
      name: '蒸发量',
      type: 'line',
      stack: '总量',
      data: [120, 132, 101, 134, 90, 230, 210],
      smooth: true,
      lineStyle: {
        color: '#5470C6'
      }
    },
    {
      name: '降水量',
      type: 'line',
      stack: '总量',
      data: [220, 182, 191, 234, 290, 330, 310],
      smooth: true,
      lineStyle: {
        color: '#91CC75'
      }
    }
  ]
});

// 初始化
const initChart = async () => {
  await nextTick(); 
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
    chartInstance.setOption(getChartOptions());

    // 响应式处理
    window.addEventListener('resize', resizeChart);
  } else {
    console.error('chartRef is null!');
  }
};

// 销毁图表实例
const disposeChart = () => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
  window.removeEventListener('resize', resizeChart);
};

// 调整图表大小
const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};

watch(
  () => props.title,
  (newTitle) => {
    if (chartInstance) {
      chartInstance.setOption({
        title: {
          text: newTitle || '折线图test'
        }
      });
    }
  }
);

onMounted(() => {
  initChart();
});

onUnmounted(() => {
  disposeChart();
});
</script>

<style scoped>
.line-chart-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chart {
  width: 100%;
  height: 400px;
}
</style>