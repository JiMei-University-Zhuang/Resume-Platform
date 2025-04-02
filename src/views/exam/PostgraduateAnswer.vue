<template>
  <div class="exam-page">
    <div class="card-header">
      <h1 class="exam-title">{{ route.query.type === 'exam' ? '考试开始' : '练习开始' }}</h1>
      <p class="exam-subtitle">
        <span v-if="route.query.type === 'exam'">
          当前试卷：{{ route.query.examName || '未知试卷' }}
        </span>
        <span v-else> 本次练习科目：{{ subject }}，题型：{{ questionType }}，题目数量：{{ count }} </span>
      </p>
    </div>
    <div v-if="route.query.type === 'exam'" class="real-exam-badge">
      <div
        class="timer"
        style="text-align: center"
        v-html="formatTime(timeLeft) + '<br>考试剩余时间'"
      ></div>
    </div>
    <div v-if="questions?.length > 0">
      <div class="material-analysis-question">
        <div v-for="(question, index) in questions" :key="index" class="question-container">
          <div class="question-header">
            <span class="question-number">题目编号：{{ question.questionId }}</span>
            <span class="question-score">分值&nbsp;{{ question.score }}</span>
          </div>
          
          <div class="question-content" v-html="formatText(question.questionContent)"></div>
          
          <div class="answer-section">
            <h3>我的解答</h3>
            <el-input
              v-model="userAnswers[index]"
              type="textarea"
              :rows="10"
              placeholder="请在这里输入您的解答..."
              :disabled="showReference"
            ></el-input>
          </div>

          <div v-if="showReference" class="reference-answer">
            <h3>参考答案</h3>
            <div v-html="formatText(question.referenceAnswer)"></div>
          </div>
        </div>
        
        <div class="button-group">
          <el-button type="primary" @click="submitAnswers" v-if="!showReference">提交答案</el-button>
          <el-button type="success" @click="returnToHome" v-else>返回主页</el-button>
        </div>
      </div>
    </div>
    <div v-else class="loading-container">
      <p>正在加载题目，请稍候...</p>
      <el-progress :percentage="loadingPercentage" :indeterminate="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getGSPractice } from '@/api/exam'
import { ElMessage, ElMessageBox } from 'element-plus'

// 定义题目接口
interface Question {
  questionId: string
  questionContent: string
  score: number
  isSensitive: number
  referenceAnswer: string
}

const route = useRoute()
const router = useRouter()
const subject = ref(route.query.subject as string)
const questionType = ref(route.query.questionType as string)
const count = ref(parseInt(route.query.count as string, 10))
const questions = ref<Question[]>([])
const userAnswers = ref<string[]>([])
const showReference = ref(false)
const timeLeft = ref(7200) // 2小时，单位为秒
const loadingPercentage = ref(0)
const timerId = ref<number | null>(null)

const formatText = (text: string) => {
  if (!text) return ''
  let processedText = text
  processedText = processedText.replace(/\\n/g, '\n')
  processedText = processedText.replace(/\r\n/g, '<br>')
  processedText = processedText.replace(/\n/g, '<br>')
  return processedText
}

// 添加时间格式化方法
const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

// 获取题目
const fetchQuestions = async () => {
  try {
    const isRealExam = route.query.type === 'exam'
    if (isRealExam) {
      // 暂未实现真题接口
      ElMessage.warning('研究生真题功能正在开发中')
    } else {
      const requestData = {
        subject: subject.value,
        questionType: questionType.value,
        count: count.value
      }
      
      // 使用模拟计时器模拟加载进度
      let progress = 0
      const loadingTimer = setInterval(() => {
        progress += 10
        loadingPercentage.value = Math.min(progress, 90)
        if (progress >= 90) clearInterval(loadingTimer)
      }, 200)
      
      const response = await getGSPractice(requestData)
      loadingPercentage.value = 100
      
      // 清除加载计时器
      setTimeout(() => {
        clearInterval(loadingTimer)
        if (response?.data) {
          questions.value = response.data
          // 初始化答案数组
          userAnswers.value = new Array(questions.value.length).fill('')
        }
      }, 300)
    }
  } catch (error) {
    ElMessage.error('获取题目失败，请重试')
    console.error('获取题目失败：', error)
  }
}

// 提交答案
const submitAnswers = async () => {
  // 检查是否有未回答的题目
  const unansweredCount = userAnswers.value.filter(answer => !answer.trim()).length
  
  if (unansweredCount > 0) {
    try {
      await ElMessageBox.confirm(
        `您还有 ${unansweredCount} 道题目未完成，确定要提交吗？`,
        '提交确认',
        {
          confirmButtonText: '确认提交',
          cancelButtonText: '继续作答',
          type: 'warning'
        }
      )
    } catch (error) {
      return // 用户选择继续作答
    }
  }
  
  ElMessage.success('答案已提交！')
  showReference.value = true // 显示参考答案
}

// 计时器
const startTimer = () => {
  timerId.value = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timerId.value as number)
      submitAnswers() // 时间到自动提交
    }
  }, 1000)
}

// 返回主页
const returnToHome = () => {
  showReference.value = false
  router.push('/exam/postgraduate')
}

onMounted(() => {
  fetchQuestions()
  if (route.query.type === 'exam') {
    startTimer()
  }
})

onBeforeUnmount(() => {
  if (timerId.value) {
    clearInterval(timerId.value)
  }
})
</script>

<style scoped>
.exam-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.card-header {
  text-align: center;
  margin-bottom: 28px;
}

.exam-title {
  font-size: 28px;
  color: #262626;
  margin-bottom: 12px;
}

.exam-subtitle {
  font-size: 16px;
  color: #595959;
}

.real-exam-badge {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.timer {
  background: linear-gradient(135deg, #fa541c 0%, #ff7a45 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(250, 84, 28, 0.2);
}

.loading-container {
  text-align: center;
  padding: 40px;
}

.loading-container p {
  margin-bottom: 20px;
  color: #8c8c8c;
}

.material-analysis-question {
  width: 100%;
  margin: 0 auto;
}

.question-container {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.question-number {
  font-size: 16px;
  color: #1677ff;
  font-weight: 500;
}

.question-score {
  background-color: #ff4d4f;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
}

.question-content {
  font-size: 16px;
  line-height: 1.8;
  color: #262626;
  margin-bottom: 24px;
  white-space: pre-line;
}

.answer-section {
  margin-bottom: 20px;
}

.answer-section h3, .reference-answer h3 {
  font-size: 18px;
  color: #262626;
  margin-bottom: 12px;
  font-weight: 500;
}

.reference-answer {
  background-color: #fafafa;
  padding: 16px;
  border-radius: 8px;
  margin-top: 20px;
}

.reference-answer div {
  font-size: 16px;
  line-height: 1.8;
  white-space: pre-line;
  color: #262626;
}

.button-group {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.button-group .el-button {
  padding: 12px 24px;
  font-size: 16px;
}

:deep(.el-textarea__inner) {
  line-height: 1.8;
  font-size: 16px;
  padding: 12px;
}
</style> 