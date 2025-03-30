<template>
  <div class="insights-container">
    <!-- 行业概览 -->
    <el-row :gutter="20" class="mb-20">
      <el-col :span="6" v-for="stat in statistics" :key="stat.title">
        <el-card class="stat-card" :body-style="{ padding: '20px' }">
          <div class="stat-content">
            <el-icon class="stat-icon" :class="stat.type">
              <component :is="stat.icon" />
            </el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-title">{{ stat.title }}</div>
            </div>
          </div>
          <div class="stat-trend" :class="stat.trend > 0 ? 'up' : 'down'">
            {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 薪资分布 -->
    <el-row :gutter="20" class="mb-20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>薪资分布</span>
              <el-select v-model="salaryCity" placeholder="选择城市">
                <el-option
                  v-for="city in cities"
                  :key="city.value"
                  :label="city.label"
                  :value="city.value"
                />
              </el-select>
            </div>
          </template>
          <div class="chart-container">
            <<<<<<< HEAD
            <div id="salaryChart" ref="salaryChart" style="width: 100%; height: 300px"></div>
            =======
            <div ref="salaryChart" style="width: 100%; height: 300px"></div>
            >>>>>>> main
          </div>
        </el-card>
      </el-col>

      <!-- 技能需求热度 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>技能需求热度</span>
              <el-radio-group v-model="skillType" size="small">
                <el-radio-button label="tech">技术类</el-radio-button>
                <el-radio-button label="soft">软技能</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <div id="skillsChart" ref="skillsChart" style="width: 100%; height: 300px"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 职位趋势 -->
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>职位发展趋势</span>
              <div class="trend-filters">
                <el-select
                  v-model="trendPosition"
                  placeholder="选择职位"
                  style="width: 150px; margin-right: 10px"
                >
                  <el-option
                    v-for="position in positions"
                    :key="position.value"
                    :label="position.label"
                    :value="position.value"
                  />
                </el-select>
                <el-select v-model="trendPeriod" placeholder="时间周期" style="width: 120px">
                  <el-option label="近3个月" value="3" />
                  <el-option label="近6个月" value="6" />
                  <el-option label="近1年" value="12" />
                </el-select>
              </div>
            </div>
          </template>
          <div class="chart-container">
            <<<<<<< HEAD
            <div id="trendChart" ref="trendChart" style="width: 100%; height: 350px"></div>
            =======
            <div ref="trendChart" style="width: 100%; height: 350px"></div>
            >>>>>>> main
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 行业报告 -->
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="report-card">
          <template #header>
            <div class="card-header">
              <span>行业深度报告</span>
              <el-button type="primary" text @click="generateReport"> 生成完整报告 </el-button>
            </div>
          </template>
          <div class="report-content" v-loading="generatingReport">
            <div v-if="!generatingReport">
              <h3>{{ report.title }}</h3>
              <p class="report-summary">{{ report.summary }}</p>
              <el-divider>核心观点</el-divider>
              <div class="key-points">
                <div v-for="(point, index) in report.keyPoints" :key="index" class="point-item">
                  <div class="point-number">
                    {{ index + 1 }}
                  </div>
                  <div class="point-content">
                    <h4>{{ point.title }}</h4>
                    <p>{{ point.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 招聘热点 -->
      <el-col :span="8">
        <el-card class="hotspot-card">
          <template #header>
            <div class="card-header">
              <span>招聘热点</span>
              <el-tag type="success">实时更新</el-tag>
            </div>
          </template>
          <div class="hotspot-list">
            <div v-for="(item, index) in hotspots" :key="index" class="hotspot-item">
              <div class="hotspot-rank" :class="{ top3: index < 3 }">
                {{ index + 1 }}
              </div>
              <div class="hotspot-info">
                <div class="hotspot-title">
                  {{ item.title }}
                </div>
                <div class="hotspot-stats">
                  <span>{{ item.companies }}家公司</span>
                  <span>{{ item.positions }}个职位</span>
                </div>
              </div>
              <div class="hotspot-trend" :class="item.trend">
                {{ item.trend === 'up' ? '↑' : '↓' }}
                {{ item.change }}%
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

// 统计数据
const statistics = [
  {
    title: '平均薪资',
    value: '25.5K',
    trend: 5.2,
    type: 'success',
    icon: 'TrendCharts'
  },
  {
    title: '职位数量',
    value: '12,354',
    trend: 12.3,
    type: 'primary',
    icon: 'PieChart'
  },
  {
    title: '需求增长',
    value: '23.4%',
    trend: 8.7,
    type: 'warning',
    icon: 'Promotion'
  },
  {
    title: '人才缺口',
    value: '5,234',
    trend: -3.2,
    type: 'info',
    icon: 'Operation'
  }
]

// 城市选项
const cities = [
  { value: 'beijing', label: '北京' },
  { value: 'shanghai', label: '上海' },
  { value: 'guangzhou', label: '广州' },
  { value: 'shenzhen', label: '深圳' }
]

// 职位选项
const positions = [
  { value: 'java', label: 'Java开发' },
  { value: 'python', label: 'Python开发' },
  { value: 'frontend', label: '前端开发' },
  { value: 'ai', label: 'AI工程师' }
]

// 选中的值
const salaryCity = ref('beijing')
const skillType = ref('tech')
const trendPosition = ref('java')
const trendPeriod = ref('6')

// 图表实例
const salaryChart = ref(null)
const skillsChart = ref(null)
const trendChart = ref(null)

// 报告相关
const generatingReport = ref(false)
const report = ref({
  title: '2025年互联网行业人才发展报告',
  summary:
    '随着AI技术的快速发展，互联网行业的人才需求正在发生显著变化。本报告深入分析了当前市场趋势和未来发展方向。',
  keyPoints: [
    {
      title: 'AI驱动的技术革新',
      content: '人工智能正在重塑传统岗位，对算法工程师和机器学习专家的需求持续上升。'
    },
    {
      title: '全栈化发展趋势',
      content: '企业更倾向于招聘具备全栈开发能力的人才，尤其是在中小型企业中这一趋势更为明显。'
    },
    {
      title: '远程办公新常态',
      content: '远程办公模式的普及带来了工作方式的革新，对人才的自主管理能力提出了更高要求。'
    }
  ]
})

// 招聘热点
const hotspots = [
  {
    title: 'AI算法工程师',
    companies: 234,
    positions: 567,
    trend: 'up',
    change: 45
  },
  {
    title: '全栈开发工程师',
    companies: 189,
    positions: 432,
    trend: 'up',
    change: 32
  },
  {
    title: '数据分析师',
    companies: 156,
    positions: 378,
    trend: 'up',
    change: 28
  },
  {
    title: 'DevOps工程师',
    companies: 123,
    positions: 289,
    trend: 'down',
    change: 12
  },
  {
    title: '产品经理',
    companies: 98,
    positions: 245,
    trend: 'up',
    change: 15
  }
]

// 初始化图表
const initCharts = () => {
  if (!salaryChart.value || !skillsChart.value || !trendChart.value) return

  const salary = echarts.init(salaryChart.value)
  salary.setOption({
    // ... 薪资分布图表配置
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    xAxis: {
      type: 'category',
      data: ['<10K', '10-15K', '15-20K', '20-25K', '25-30K', '30-40K', '>40K']
    },
    yAxis: {
      type: 'value',
      name: '职位数量'
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        barWidth: '60%',
        itemStyle: {
          color: '#409EFF'
        }
      }
    ]
  })

  const skills = echarts.init(skillsChart.value)
  skills.setOption({
    // ... 技能需求图表配置
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
        data: [
          { value: 40, name: 'JavaScript' },
          { value: 38, name: 'Python' },
          { value: 32, name: 'Java' },
          { value: 30, name: 'React' },
          { value: 28, name: 'Vue' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  })

  const trend = echarts.init(trendChart.value)
  trend.setOption({
    // ... 趋势图表配置
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value',
      name: '职位数量'
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147],
        type: 'line',
        smooth: true
      }
    ]
  })
}

import { useRoute } from 'vue-router'

const route = useRoute()

// 监听路由变化，重新初始化图表
const handleRouteChange = () => {
  // 使用setTimeout确保DOM已经更新
  setTimeout(() => {
    initCharts()
  }, 0)
}

onMounted(() => {
  // 组件挂载后初始化图表
  handleRouteChange()
})

// 监听路由变化
watch(
  () => route.path,
  () => {
    handleRouteChange()
  }
)

// 生成报告
const generateReport = async () => {
  generatingReport.value = true
  try {
    // 这里调用 AI 接口生成报告
    await new Promise(resolve => setTimeout(resolve, 2000))
    // 更新报告内容
  } finally {
    generatingReport.value = false
  }
}
</script>

<style scoped>
.insights-container {
  padding: 20px;
}

.mb-20 {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 统计卡片样式 */
.stat-card {
  .stat-content {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .stat-icon {
    font-size: 24px;
    padding: 12px;
    border-radius: 8px;

    &.success {
      background: #f0f9eb;
      color: #67c23a;
    }
    &.primary {
      background: #ecf5ff;
      color: #409eff;
    }
    &.warning {
      background: #fdf6ec;
      color: #e6a23c;
    }
    &.info {
      background: #f4f4f5;
      color: #909399;
    }
  }

  .stat-info {
    flex: 1;
  }

  .stat-value {
    font-size: 24px;
    font-weight: bold;
    line-height: 1;
    margin-bottom: 8px;
  }

  .stat-title {
    color: #666;
    font-size: 14px;
  }

  .stat-trend {
    margin-top: 10px;
    font-size: 14px;

    &.up {
      color: #67c23a;
    }
    &.down {
      color: #f56c6c;
    }
  }
}

/* 图表容器样式 */
.chart-container {
  height: 300px;
}

/* 报告样式 */
.report-card {
  height: 600px;
  overflow-y: auto;
}

.report-summary {
  color: #666;
  line-height: 1.6;
  margin: 20px 0;
}

.key-points {
  .point-item {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
  }

  .point-number {
    width: 24px;
    height: 24px;
    background: #1849ea;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }

  .point-content {
    flex: 1;

    h4 {
      margin: 0 0 8px;
      color: #333;
    }

    p {
      color: #666;
      line-height: 1.6;
      margin: 0;
    }
  }
}

/* 热点列表样式 */
.hotspot-card {
  height: 600px;
  overflow-y: auto;
}

.hotspot-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
}

.hotspot-rank {
  width: 24px;
  height: 24px;
  background: #f4f4f5;
  color: #909399;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;

  &.top3 {
    background: #1849ea;
    color: white;
  }
}

.hotspot-info {
  flex: 1;
}

.hotspot-title {
  font-weight: 500;
  margin-bottom: 5px;
}

.hotspot-stats {
  font-size: 12px;
  color: #909399;

  span {
    margin-right: 10px;
  }
}

.hotspot-trend {
  font-size: 14px;

  &.up {
    color: #67c23a;
  }
  &.down {
    color: #f56c6c;
  }
}
</style>
