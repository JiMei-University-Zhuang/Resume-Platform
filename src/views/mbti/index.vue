<template>
  <div class="mbti-container">
    <!-- 测试进度 -->
    <el-progress
      :percentage="progressPercentage"
      :format="format"
      class="progress-bar animate__animated animate__fadeIn"
    />

    <!-- 问题卡片 -->
    <el-card v-if="!testCompleted" class="question-card animate__animated" :class="questionAnimation">
      <template #header>
        <div class="card-header">
          <span>问题 {{ currentQuestionIndex + 1 }}/{{ questions.length }}</span>
        </div>
      </template>
      <div class="question-content">
        <h3>{{ currentQuestion.question }}</h3>
        <div class="options">
          <el-radio-group v-model="currentAnswer" @change="handleAnswer">
            <el-radio
              v-for="option in currentQuestion.options"
              :key="option.value"
              :label="option.value"
              border
            >
              {{ option.text }}
            </el-radio>
          </el-radio-group>
        </div>
      </div>
    </el-card>

    <!-- 结果展示 -->
    <el-card v-else class="result-card animate__animated animate__fadeIn">
      <template #header>
        <div class="card-header">
          <span>您的MBTI性格类型是：{{ mbtiResult }}</span>
        </div>
      </template>
      <div class="result-content">
        <div class="chart-container">
          <canvas ref="chartRef"></canvas>
        </div>
        <div class="type-description">
          <h3>性格特征描述：</h3>
          <p>{{ typeDescriptions[mbtiResult] }}</p>
        </div>
        <div class="career-suggestions">
          <h3>职业建议：</h3>
          <el-tag
            v-for="career in careerSuggestions[mbtiResult]"
            :key="career"
            class="career-tag"
          >
            {{ career }}
          </el-tag>
        </div>
        <el-button type="primary" @click="restartTest">重新测试</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'
import 'animate.css'

Chart.register(...registerables)

interface Question {
  question: string
  options: Array<{
    text: string
    value: string
    dimension: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'
  }>
}

// MBTI问题库
const questions = ref<Question[]>([
  {
    question: "在社交场合中，你通常会：",
    options: [
      { text: "主动与他人交谈，享受社交", value: "E", dimension: "E" },
      { text: "更喜欢与少数人深入交谈", value: "I", dimension: "I" }
    ]
  },
  {
    question: "在处理问题时，你倾向于：",
    options: [
      { text: "关注具体的细节和事实", value: "S", dimension: "S" },
      { text: "关注整体概念和可能性", value: "N", dimension: "N" }
    ]
  },
  // ... 更多问题
])

const currentQuestionIndex = ref(0)
const currentAnswer = ref('')
const answers = ref<string[]>([])
const testCompleted = ref(false)
const questionAnimation = ref('animate__fadeIn')
const chartRef = ref<HTMLCanvasElement | null>(null)

// 计算进度
const progressPercentage = computed(() => 
  Math.round((currentQuestionIndex.value / questions.value.length) * 100)
)

// 获取当前问题
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

// 处理答案
const handleAnswer = () => {
  answers.value[currentQuestionIndex.value] = currentAnswer.value
  questionAnimation.value = 'animate__fadeOut'
  
  setTimeout(() => {
    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++
      currentAnswer.value = ''
      questionAnimation.value = 'animate__fadeIn'
    } else {
      calculateResult()
    }
  }, 500)
}

// 计算MBTI结果
const mbtiResult = ref('')
const calculateResult = () => {
  const dimensions = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  }

  answers.value.forEach(answer => {
    dimensions[answer as keyof typeof dimensions]++
  })

  mbtiResult.value = [
    dimensions.E > dimensions.I ? 'E' : 'I',
    dimensions.S > dimensions.N ? 'S' : 'N',
    dimensions.T > dimensions.F ? 'T' : 'F',
    dimensions.J > dimensions.P ? 'J' : 'P'
  ].join('')

  testCompleted.value = true
  setTimeout(createChart, 100)
}

// 创建结果图表
const createChart = () => {
  if (!chartRef.value) return

  new Chart(chartRef.value, {
    type: 'radar',
    data: {
      labels: ['外向-内向', '感觉-直觉', '思维-情感', '判断-知觉'],
      datasets: [{
        label: '您的性格维度分布',
        data: [
          // 计算每个维度的得分百分比
          // ...
        ],
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)'
      }]
    },
    options: {
      scales: {
        r: {
          angleLines: {
            display: true
          },
          suggestedMin: 0,
          suggestedMax: 100
        }
      }
    }
  })
}

// 性格类型描述
const typeDescriptions = {
  'INTJ': '建筑师型人格 - 富有想象力和战略性的思考者，一切都在计划之中',
  'INTP': '逻辑学家型人格 - 具有创新意念的发明家，渴望了解一切事物的原理',
  // ... 其他类型描述
}

// 职业建议
const careerSuggestions = {
  'INTJ': ['系统架构师', '战略分析师', '科学研究员', '企业顾问'],
  'INTP': ['软件工程师', '数据科学家', '研究员', '大学教授'],
  // ... 其他类型职业建议
}

// 重新开始测试
const restartTest = () => {
  currentQuestionIndex.value = 0
  currentAnswer.value = ''
  answers.value = []
  testCompleted.value = false
  mbtiResult.value = ''
}

// 格式化进度条
const format = (percentage: number) => {
  return `${percentage}%`
}
</script>

<style scoped>
.mbti-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.progress-bar {
  margin-bottom: 20px;
}

.question-card {
  margin-bottom: 20px;
}

.question-content {
  padding: 20px 0;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.result-card {
  text-align: center;
}

.chart-container {
  width: 100%;
  max-width: 500px;
  margin: 20px auto;
}

.type-description {
  margin: 20px 0;
  text-align: left;
}

.career-suggestions {
  margin: 20px 0;
}

.career-tag {
  margin: 5px;
}

.el-radio {
  margin-bottom: 10px;
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
