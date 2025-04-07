<template>
  <div class="exam-page">
    <div class="card-header">
      <h1 class="exam-title">{{ isExamMode ? '考试开始' : '练习开始' }}</h1>
      <p class="exam-subtitle">思想政治试卷: {{ paperTitle }}</p>
    </div>

    <div v-if="isExamMode" class="real-exam-badge">
      <div class="timer" v-html="formatTime(timeLeft) + '<br>考试剩余时间'"></div>
    </div>

    <div v-if="loading" class="loading-container">
      <p>正在加载题目，请稍候...</p>
      <el-progress :percentage="loadingPercentage" :indeterminate="true" />
    </div>

    <div v-else>
      <div class="progress-container">
        <div class="progress-info">
          <span>答题进度</span>
          <span>{{ calculateProgress }}%</span>
        </div>
        <el-progress :percentage="calculateProgress" :color="progressColor" />
      </div>

      <div class="question-section" v-if="paperData">
        <!-- 单选题部分 -->
        <div v-if="paperData.choiceVOs && paperData.choiceVOs.length > 0" class="question-category">
          <h2 class="category-title">
            一、单项选择题（每题1分，共{{ paperData.choiceVOs.length }}分）
          </h2>
          <div class="question-list">
            <div
              v-for="(question, questionIndex) in paperData.choiceVOs"
              :key="'choice-' + question.questionId"
              class="question-item"
            >
              <div class="question-header">
                <span class="question-number">{{ questionIndex + 1 }}.</span>
                <div class="question-content" v-html="question.questionContent"></div>
              </div>
              <div class="options-container single-choice-options">
                <el-radio-group
                  v-model="singleChoiceAnswers[questionIndex]"
                  class="options-group"
                  :disabled="showReference"
                >
                  <div class="options-grid">
                    <div
                      v-for="option in ['A', 'B', 'C', 'D']"
                      :key="option"
                      class="option-item"
                      :class="{
                        'correct-option': showReference && option === question.correctAnswer,
                        'wrong-option':
                          showReference &&
                          singleChoiceAnswers[questionIndex] === option &&
                          option !== question.correctAnswer
                      }"
                    >
                      <el-radio :label="option">
                        <span v-html="question['option' + option]"></span>
                      </el-radio>
                      <template v-if="showReference">
                        <span v-if="option === question.correctAnswer" class="correct-icon">
                          <i class="el-icon-check"></i>
                        </span>
                        <span
                          v-else-if="singleChoiceAnswers[questionIndex] === option"
                          class="wrong-icon"
                        >
                          <i class="el-icon-close"></i>
                        </span>
                      </template>
                    </div>
                  </div>
                </el-radio-group>
              </div>
              <div v-if="showReference" class="reference-answer">
                <div class="reference-title">参考答案：</div>
                <div class="reference-content">{{ question.correctAnswer }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 多选题部分 -->
        <div
          v-if="paperData.multiChoiceVOs && paperData.multiChoiceVOs.length > 0"
          class="question-category"
        >
          <h2 class="category-title">
            二、多项选择题（每题2分，共{{ paperData.multiChoiceVOs.length * 2 }}分）
          </h2>
          <div class="question-list">
            <div
              v-for="(question, questionIndex) in paperData.multiChoiceVOs"
              :key="'multi-' + question.questionId"
              class="question-item"
            >
              <div class="question-header">
                <span class="question-number">{{ questionIndex + 1 }}.</span>
                <div class="question-content" v-html="question.questionContent"></div>
              </div>
              <div class="options-container multi-choice-options">
                <el-checkbox-group
                  v-model="multiChoiceAnswers[questionIndex]"
                  class="options-group"
                  :disabled="showReference"
                >
                  <div class="options-grid">
                    <div
                      v-for="option in ['A', 'B', 'C', 'D']"
                      :key="option"
                      class="option-item"
                      :class="{
                        'correct-option': showReference && question.correctAnswer.includes(option),
                        'wrong-option':
                          showReference &&
                          multiChoiceAnswers[questionIndex].includes(option) &&
                          !question.correctAnswer.includes(option)
                      }"
                    >
                      <el-checkbox :label="option">
                        <span v-html="question['option' + option]"></span>
                      </el-checkbox>
                      <template v-if="showReference">
                        <span v-if="question.correctAnswer.includes(option)" class="correct-icon">
                          <i class="el-icon-check"></i>
                        </span>
                        <span
                          v-else-if="multiChoiceAnswers[questionIndex].includes(option)"
                          class="wrong-icon"
                        >
                          <i class="el-icon-close"></i>
                        </span>
                      </template>
                    </div>
                  </div>
                </el-checkbox-group>
              </div>
              <div v-if="showReference" class="reference-answer">
                <div class="reference-title">参考答案：</div>
                <div class="reference-content">{{ question.correctAnswer }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 分析题部分 -->
        <div
          v-if="paperData.analysisVOs && paperData.analysisVOs.length > 0"
          class="question-category"
        >
          <h2 class="category-title">
            三、分析题（每题10分，共{{ paperData.analysisVOs.length * 10 }}分）
          </h2>
          <div class="question-list">
            <div
              v-for="(question, questionIndex) in paperData.analysisVOs"
              :key="'analysis-' + question.questionId"
              class="question-item"
            >
              <div class="question-header">
                <span class="question-number">{{ questionIndex + 1 }}.</span>
                <div class="question-content" v-html="question.questionContent"></div>
              </div>
              <div class="options-container analysis-options">
                <div class="analysis-answer-area">
                  <el-input
                    type="textarea"
                    v-model="analysisAnswers[questionIndex]"
                    :rows="8"
                    placeholder="请在此处作答..."
                    :disabled="showReference"
                  ></el-input>
                </div>
              </div>
              <div v-if="showReference" class="reference-answer">
                <div class="reference-title">参考答案：</div>
                <div
                  class="reference-content"
                  v-html="question.referenceAnswer.replace(/\n/g, '<br>')"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="button-group">
        <el-button type="primary" @click="submitAnswers" v-if="!showReference">提交答案</el-button>
        <el-button type="success" @click="returnToHome" v-else>返回主页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPoliticsPaperByName } from '@/api/exam'

const route = useRoute()
const router = useRouter()
const isExamMode = computed(() => route.query.type === 'exam')
const paperTitle = ref('')
const paperData = ref<any>(null)
const loading = ref(true)
const loadingPercentage = ref(0)
const showReference = ref(false)
const timeLeft = ref(7200) // 2小时，单位为秒
const timerId = ref<number | null>(null)

// 答案相关数据
const singleChoiceAnswers = ref<string[]>([])
const multiChoiceAnswers = ref<string[][]>([])
const analysisAnswers = ref<string[]>([])

// 加载试卷数据
const fetchPaper = async () => {
  loading.value = true
  loadingPercentage.value = 0
  
  try {
    // 模拟加载进度
    const loadingTimer = setInterval(() => {
      loadingPercentage.value += 10
      if (loadingPercentage.value >= 90) {
        clearInterval(loadingTimer)
      }
    }, 200)
    
    const examName = "2024年全国硕士研究生招生考试思想政治理论真题";
    const response = await getPoliticsPaperByName(examName);
    
    if (response.data) {
      paperData.value = response.data
      paperTitle.value = examName
      initializeAnswers()
      
      clearInterval(loadingTimer)
      loadingPercentage.value = 100
      loading.value = false
    } else {
      ElMessage.error('获取试卷失败，服务器没有返回数据')
      clearInterval(loadingTimer)
      loading.value = false
    }
    
  } catch (error) {
    console.error('获取试卷失败：', error)
    ElMessage.error('获取试卷失败，请重试')
    loading.value = false
  }
}

const initializeAnswers = () => {
  if (!paperData.value) return

  // 初始化单选题答案
  if (paperData.value.choiceVOs) {
    singleChoiceAnswers.value = new Array(paperData.value.choiceVOs.length).fill('')
  }

  // 初始化多选题答案
  if (paperData.value.multiChoiceVOs) {
    multiChoiceAnswers.value = new Array(paperData.value.multiChoiceVOs.length).fill(null).map(() => [])
  }

  // 初始化分析题答案
  if (paperData.value.analysisVOs) {
    analysisAnswers.value = new Array(paperData.value.analysisVOs.length).fill('')
  }
}

// 计算答题进度
const calculateProgress = computed(() => {
  if (!paperData.value) return 0

  let answered = 0
  let total = 0

  // 统计单选题
  if (paperData.value.choiceVOs) {
    answered += singleChoiceAnswers.value.filter(a => a).length
    total += paperData.value.choiceVOs.length
  }

  // 统计多选题
  if (paperData.value.multiChoiceVOs) {
    answered += multiChoiceAnswers.value.filter(a => a.length > 0).length
    total += paperData.value.multiChoiceVOs.length
  }

  // 统计分析题
  if (paperData.value.analysisVOs) {
    answered += analysisAnswers.value.filter(a => a.trim()).length
    total += paperData.value.analysisVOs.length
  }

  return total > 0 ? Math.floor((answered / total) * 100) : 0
})

// 进度条颜色
const progressColor = computed(() => {
  const progress = calculateProgress.value
  if (progress < 30) return '#ff4d4f'
  if (progress < 70) return '#faad14'
  return '#52c41a'
})

// 时间格式化
const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

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

// 提交答案
const submitAnswers = async () => {
  // 检查是否有未完成的题目
  const totalQuestions = (paperData.value.choiceVOs?.length || 0) +
                         (paperData.value.multiChoiceVOs?.length || 0) +
                         (paperData.value.analysisVOs?.length || 0)

  const answeredQuestions = singleChoiceAnswers.value.filter(a => a).length +
                           multiChoiceAnswers.value.filter(a => a.length > 0).length +
                           analysisAnswers.value.filter(a => a.trim()).length

  const unansweredCount = totalQuestions - answeredQuestions

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

  showReference.value = true
  ElMessage.success('答案已提交')
}

const returnToHome = () => {
  router.push('/exam/postgraduate')
}

onMounted(() => {
  fetchPaper()

  if (isExamMode.value) {
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
  padding-bottom: 80px;
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

.progress-container {
  margin-bottom: 20px;
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #262626;
  font-weight: 500;
}

.question-section {
  margin-top: 32px;
}

.question-category {
  margin-bottom: 40px;
}

.category-title {
  font-size: 20px;
  color: #262626;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.question-list {
  margin-bottom: 24px;
}

.question-item {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.question-header {
  display: flex;
  margin-bottom: 16px;
}

.question-number {
  font-weight: 600;
  color: #262626;
  margin-right: 8px;
  font-size: 16px;
}

.question-content {
  color: #262626;
  line-height: 1.6;
  font-size: 16px;
}

.options-container {
  margin-top: 16px;
}

.options-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
}

.option-item {
  margin-bottom: 0;
  padding: 12px 16px;
  border-radius: 6px;
  transition: all 0.3s;
  position: relative;
}

.option-item:hover {
  background-color: #f5f5f5;
}

.option-item .el-radio,
.option-item .el-checkbox {
  margin-right: 0;
  width: 100%;
  display: block;
  padding-right: 30px; /* 为图标留出空间 */
}

.option-item :deep(.el-radio__label),
.option-item :deep(.el-checkbox__label) {
  white-space: normal;
  line-height: 1.5;
  font-size: 15px;
  color: #262626;
}

.correct-option {
  background-color: rgba(82, 196, 26, 0.1);
  border: 1px solid #52c41a;
}

.wrong-option {
  background-color: rgba(255, 77, 79, 0.1);
  border: 1px solid #ff4d4f;
}

.correct-icon,
.wrong-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  z-index: 1; /* 确保图标在文本上层 */
}

.correct-icon {
  background-color: #52c41a;
  color: white;
}

.wrong-icon {
  background-color: #ff4d4f;
  color: white;
}

/* 多选题样式 */
.multi-choice-options .el-checkbox-group {
  display: block;
  width: 100%;
}

/* 分析题样式 */
.analysis-answer-area {
  margin-top: 16px;
}

.analysis-answer-area :deep(.el-textarea__inner) {
  font-size: 15px;
  padding: 12px;
  border-color: #d9d9d9;
  border-radius: 6px;
}

.analysis-answer-area :deep(.el-textarea__inner:focus) {
  border-color: #1677ff;
}

.reference-answer {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px dashed #d9d9d9;
}

.reference-title {
  font-weight: 600;
  color: #262626;
  margin-bottom: 8px;
}

.reference-content {
  color: #262626;
  line-height: 1.6;
  background-color: #f9f9f9;
  padding: 16px;
  border-radius: 6px;
  white-space: pre-line;
}

.button-group {
  display: flex;
  justify-content: center;
  margin-top: 48px;
  gap: 16px;
}

.button-group .el-button {
  min-width: 120px;
  padding: 12px 24px;
  font-size: 16px;
}

/* 确保移动端良好显示 */
@media (max-width: 768px) {
  .options-grid {
    grid-template-columns: 1fr;
  }
}
</style>
