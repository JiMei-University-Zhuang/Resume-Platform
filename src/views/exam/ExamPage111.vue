<template>
  <el-card style="padding: 0 150px; display: flex; justify-content: space-between">
    <div class="exam-page">
      <div class="question-area">
        <div class="question-header">
          <span>第{{ currentQuestionIndex + 1 }}题 (单选题)：</span>
        </div>
        <div class="question-text">
          <p>在输入输出设备的例行操作中，（ ）不属于监控的主要内容。</p>
        </div>
        <el-radio-group v-model="selectedAnswer" class="radio-group-vertical">
          <el-radio label="A">A. 支撑软件及硬件配置变动</el-radio>
          <el-radio label="B">B. 易损件使用情况</el-radio>
          <el-radio label="C">C. 用户的个人信息</el-radio>
          <el-radio label="D">D. 告警信息</el-radio>
        </el-radio-group>

        <div class="function-buttons">
          <el-button @click="toggleMark">标记</el-button>
          <div class="action-buttons">
            <el-button @click="prevQuestion">
              <span>上一题</span>
            </el-button>

            <el-button @click="nextQuestion">
              <span>下一题</span>
            </el-button>
          </div>
        </div>
      </div>

      <div class="answer-card-section">
        <div class="timer">
          <span>{{ `用时${timerText}` }}</span>
          <br />
          <el-button icon="el-icon-video-pause" @click="pauseTimer">暂停</el-button>
        </div>
        <div class="answer-card">
          <span>答题卡 {{ currentQuestionIndex + 1 }} / {{ totalQuestionCount }}</span>
          <div class="answer-options">
            <el-button
              v-for="(num, index) in totalQuestionCount"
              :key="index"
              style="border-radius: 50%; margin: 10px"
              :type="
                answerStatus[index] === 'answered'
                  ? 'primary'
                  : answerStatus[index] === 'marked'
                    ? 'warning'
                    : ''
              "
              @click="jumpToQuestion(index)"
            >
              {{ num }}
            </el-button>
          </div>
        </div>
        <div class="filter-section">
          <span><i class="el-icon-star-off"></i> 标记</span>
          <el-radio-group v-model="filterType">
            <el-radio label="answered">已做</el-radio>
            <el-radio label="unanswered">未做</el-radio>
          </el-radio-group>
        </div>
        <el-button type="primary" @click="submitExam">我要交卷</el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ElButton, ElRadioGroup, ElRadio } from 'element-plus'

// 题目总数
const totalQuestionCount = 9
// 当前题目索引
const currentQuestionIndex = ref(1)
// 已完成题目数量
const completedCount = ref(1)
// 选中的答案
const selectedAnswer = ref('')
// 答案状态，记录题目是否已答、标记等
const answerStatus = ref(new Array(totalQuestionCount).fill('unanswered'))
// 定时器相关
let timerId: any
const startTime = ref(new Date().getTime())
const timerText = ref('0:59')
const isTimerRunning = ref(true)
// 筛选类型
const filterType = ref('')

// 模拟上一题
const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}
// 模拟下一题
const nextQuestion = () => {
  if (currentQuestionIndex.value < totalQuestionCount - 1) {
    if (selectedAnswer.value) {
      answerStatus.value[currentQuestionIndex.value] = 'answered'
      completedCount.value++
    }
    currentQuestionIndex.value++
  }
}

// 模拟跳转到指定题目
const jumpToQuestion = (index: number) => {
  currentQuestionIndex.value = index
}

// 模拟标记题目
const toggleMark = () => {
  const status = answerStatus.value[currentQuestionIndex.value]
  answerStatus.value[currentQuestionIndex.value] = status === 'marked' ? 'unanswered' : 'marked'
}

// 模拟暂停定时器
const pauseTimer = () => {
  isTimerRunning.value = false
  clearInterval(timerId)
}

// 模拟交卷
const submitExam = () => {
  console.log('您已交卷')
}

// 计算剩余时间并更新timerText
const updateTimer = () => {
  if (isTimerRunning.value) {
    const now = new Date().getTime()
    const elapsedTime = now - startTime.value
    const minutes = Math.floor(elapsedTime / (1000 * 60))
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000)
    timerText.value = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }
}

onMounted(() => {
  timerId = setInterval(updateTimer, 1000)
})

watch(isTimerRunning, newValue => {
  if (newValue) {
    timerId = setInterval(updateTimer, 1000)
  } else {
    clearInterval(timerId)
  }
})
</script>

<style scoped>
.exam-page {
  display: flex;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #e4e7ed;
}

.question-area {
  padding: 20px 200px 20px 20px;
  border-bottom: 1px solid #e4e7ed;
  position: relative;
}

.question-header {
  margin-bottom: 10px;
}

.function-buttons {
  margin-top: 200px;
  display: flex;
  justify-content: right;
}

.action-buttons {
  display: flex;
  justify-content: center;
  padding: 0px 20px;
  /* border-bottom: 1px solid #e4e7ed; */
}

.answer-card-section {
  width: 200px;
  padding: 10px 20px;
  background-color: #f5f7fa;
}

.timer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.answer-card {
  margin-bottom: 10px;
}

.answer-options {
  display: flex;
  flex-wrap: wrap;
}

.answer-options.el-button {
  margin-right: 5px;
  margin-bottom: 5px;
}

.filter-section {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.radio-group-vertical.el-radio {
  display: block;
  margin-bottom: 10px;
}
</style>
