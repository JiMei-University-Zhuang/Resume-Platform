<template>
  <div class="exam-page">
    <div class="card-header">
      <h1 class="exam-title">{{ isExamMode ? '考试开始' : '练习开始' }}</h1>
      <p class="exam-subtitle">英语试卷: {{ paperTitle }}</p>

      <div v-if="isExamMode" class="real-exam-badge">
        <div class="timer" v-html="formatTime(timeLeft) + '<br>考试剩余时间'"></div>
      </div>
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
        <!-- 完形填空部分 -->
        <div v-if="paperData.clozeVO" class="question-category">
          <h2 class="category-title">
            Section I Cloze Test (每题1分，共20分)
          </h2>
          <div class="question-item">
            <div class="question-header">
              <div class="question-content passage-text" v-html="paperData.clozeVO.questionContent"></div>
            </div>
            <div class="cloze-options-container">
              <div
                v-for="(item, index) in paperData.clozeVO.clozeOptionInfos"
                :key="'cloze-' + item.itemId"
                class="cloze-item"
              >
                <div class="question-number">({{ item.itemId }})</div>
                <div class="options-container single-choice-options">
                  <el-radio-group
                    v-model="clozeAnswers[index]"
                    class="options-group"
                    :disabled="showReference"
                  >
                    <div class="options-grid-two-columns">
                      <div
                        v-for="option in ['A', 'B', 'C', 'D']"
                        :key="option"
                        class="option-item option-item-eng"
                        :class="{
                          'correct-option': showReference && option === item.correctAnswer,
                          'wrong-option':
                            showReference &&
                            clozeAnswers[index] === option &&
                            option !== item.correctAnswer
                        }"
                      >
                        <el-radio :label="option">
                          <span v-html="item['option' + option]"></span>
                        </el-radio>
                        <template v-if="showReference">
                          <span v-if="option === item.correctAnswer" class="correct-icon">
                            <i class="el-icon-check"></i>
                          </span>
                          <span
                            v-else-if="clozeAnswers[index] === option"
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
                  <div class="reference-content">{{ item.correctAnswer }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 阅读理解部分 -->
        <div v-if="paperData.readingVOs && paperData.readingVOs.length > 0" class="question-category">
          <h2 class="category-title">
            Section II Reading Comprehension (每题2分，共40分)
          </h2>
          <div 
            v-for="(reading, readingIndex) in paperData.readingVOs" 
            :key="'reading-' + reading.questionId"
            class="reading-passage"
          >
            <div class="question-item">
              <div class="reading-passage-header">
                <h3 class="reading-passage-title">Passage {{ readingIndex + 1 }}</h3>
              </div>
              <div class="reading-passage-content">
                <div class="question-content passage-text" v-html="reading.questionContent"></div>
              </div>
              <div class="reading-options-container">
                <div
                  v-for="(item, index) in reading.readingOptionInfos"
                  :key="'reading-' + readingIndex + '-' + item.itemId"
                  class="reading-item"
                >
                  <div class="question-content">
                    <span class="question-number">{{ item.itemId }}. </span>
                    <span v-html="item.itemContent"></span>
                  </div>
                  <div class="options-container single-choice-options">
                    <el-radio-group
                      v-model="readingAnswers[readingIndex][index]"
                      class="options-group"
                      :disabled="showReference"
                    >
                      <div class="options-grid-two-columns">
                        <div
                          v-for="option in ['A', 'B', 'C', 'D']"
                          :key="option"
                          class="option-item option-item-eng"
                          :class="{
                            'correct-option': showReference && option === item.correctAnswer,
                            'wrong-option':
                              showReference &&
                              readingAnswers[readingIndex][index] === option &&
                              option !== item.correctAnswer
                          }"
                        >
                          <el-radio :label="option">
                            <span v-html="item['option' + option]"></span>
                          </el-radio>
                          <template v-if="showReference">
                            <span v-if="option === item.correctAnswer" class="correct-icon">
                              <i class="el-icon-check"></i>
                            </span>
                            <span
                              v-else-if="readingAnswers[readingIndex][index] === option"
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
                    <div class="reference-content">{{ item.correctAnswer }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 匹配题部分 -->
        <div v-if="paperData.matchingVO" class="question-category">
          <h2 class="category-title">
            Section III Matching (每题2分，共10分)
          </h2>
          <div class="question-item">
            <div class="reading-passage-content">
              <div class="question-content passage-text" v-html="paperData.matchingVO.questionContent"></div>
            </div>
            <div class="matching-options-container">
              <div
                v-for="(item, index) in paperData.matchingVO.matchingOptionInfos"
                :key="'matching-' + item.itemId"
                class="matching-item"
              >
                <div class="matching-header">
                  <div class="question-number">{{ item.itemId }}</div>
                </div>
                <div class="matching-answer-container">
                  <el-select
                    v-model="matchingAnswers[index]"
                    placeholder="选择答案"
                    :disabled="showReference"
                    class="matching-select"
                  >
                    <el-option
                      v-for="option in ['A', 'B', 'C', 'D', 'E', 'F', 'G']"
                      :key="option"
                      :label="option"
                      :value="option"
                    />
                  </el-select>
                </div>
                <div v-if="showReference" class="reference-answer">
                  <div class="reference-title">参考答案：</div>
                  <div class="reference-content">{{ item.correctAnswer }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 翻译题部分 -->
        <div v-if="paperData.translationVO" class="question-category">
          <h2 class="category-title">
            Section IV Translation (每题2分，共10分)
          </h2>
          <div class="question-item">
            <div class="reading-passage-content">
              <div class="question-content passage-text" v-html="paperData.translationVO.questionContent"></div>
            </div>
            <div class="translation-options-container">
              <div
                v-for="(item, index) in paperData.translationVO.translationOptionInfos"
                :key="'translation-' + item.itemId"
                class="translation-item"
              >
                <div class="translation-header">
                  <div class="question-number">{{ item.itemId }}</div>
                </div>
                <div class="translation-answer-area">
                  <el-input
                    type="textarea"
                    v-model="translationAnswers[index]"
                    :rows="4"
                    placeholder="请在此处输入翻译..."
                    :disabled="showReference"
                  ></el-input>
                </div>
                <div v-if="showReference" class="reference-answer">
                  <div class="reference-title">参考答案：</div>
                  <div class="reference-content">{{ item.correctAnswer }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 写作题部分 -->
        <div v-if="paperData.writingVO" class="question-category">
          <h2 class="category-title">
            Section V Writing (10分)
          </h2>
          <div class="question-item">
            <div class="reading-passage-content">
              <div class="question-content passage-text" v-html="paperData.writingVO.questionContent"></div>
            </div>
            <div class="writing-answer-area">
              <el-input
                type="textarea"
                v-model="writingAnswer"
                :rows="10"
                placeholder="请在此处输入作文..."
                :disabled="showReference"
              ></el-input>
            </div>
            <div v-if="showReference" class="reference-answer">
              <div class="reference-title">参考范文：</div>
              <div class="reference-content writing-reference">
                <p>Dear Paul,</p>
                <p>I'm glad to offer some advice for your oral report on an ancient Chinese scientist.</p>
                <p>First, choose someone whose achievements are significant, like Zhang Heng (inventor of the first seismograph) or Zu Chongzhi (mathematical pioneer). Research their life story, contributions, and historical context.</p>
                <p>For your presentation, start with a brief introduction of the scientist's background. Then focus on their major discoveries and inventions, explaining why they were revolutionary. Visual aids like images or simple models would enhance your report. Finally, discuss how their work influenced modern science.</p>
                <p>Feel free to ask if you need more specific guidance on any particular scientist.</p>
                <p>Best regards,<br>Li Ming</p>
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
import { getEnglishExam } from '@/api/exam'

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
const clozeAnswers = ref<string[]>([])
const readingAnswers = ref<string[][]>([])
const matchingAnswers = ref<string[]>([])
const translationAnswers = ref<string[]>([])
const writingAnswer = ref('')

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

    const examName = '2024年全国硕士研究生招生考试英语一真题'
    const response = await getEnglishExam(examName)

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

  // 初始化完形填空答案
  if (paperData.value.clozeVO) {
    clozeAnswers.value = new Array(paperData.value.clozeVO.clozeOptionInfos.length).fill('')
  }

  // 初始化阅读理解答案
  if (paperData.value.readingVOs) {
    readingAnswers.value = paperData.value.readingVOs.map((reading: any) => {
      return new Array(reading.readingOptionInfos.length).fill('')
    })
  }

  // 初始化匹配题答案
  if (paperData.value.matchingVO) {
    matchingAnswers.value = new Array(paperData.value.matchingVO.matchingOptionInfos.length).fill('')
  }

  // 初始化翻译题答案
  if (paperData.value.translationVO) {
    translationAnswers.value = new Array(paperData.value.translationVO.translationOptionInfos.length).fill('')
  }

  // 初始化写作题答案
  if (paperData.value.writingVO) {
    writingAnswer.value = ''
  }
}

// 计算答题进度
const calculateProgress = computed(() => {
  if (!paperData.value) return 0

  let answered = 0
  let total = 0

  // 统计完形填空题
  if (paperData.value.clozeVO) {
    answered += clozeAnswers.value.filter(a => a).length
    total += paperData.value.clozeVO.clozeOptionInfos.length
  }

  // 统计阅读理解题
  if (paperData.value.readingVOs) {
    paperData.value.readingVOs.forEach((reading: any, index: number) => {
      answered += readingAnswers.value[index].filter((a: string) => a).length
      total += reading.readingOptionInfos.length
    })
  }

  // 统计匹配题
  if (paperData.value.matchingVO) {
    answered += matchingAnswers.value.filter(a => a).length
    total += paperData.value.matchingVO.matchingOptionInfos.length
  }

  // 统计翻译题
  if (paperData.value.translationVO) {
    answered += translationAnswers.value.filter(a => a.trim()).length
    total += paperData.value.translationVO.translationOptionInfos.length
  }

  // 统计写作题
  if (paperData.value.writingVO) {
    if (writingAnswer.value.trim()) {
      answered += 1
    }
    total += 1
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
  // 计算总题目数和已答题数
  let totalQuestions = 0
  let answeredQuestions = 0

  // 计算完形填空题
  if (paperData.value.clozeVO) {
    totalQuestions += paperData.value.clozeVO.clozeOptionInfos.length
    answeredQuestions += clozeAnswers.value.filter(a => a).length
  }

  // 计算阅读理解题
  if (paperData.value.readingVOs) {
    paperData.value.readingVOs.forEach((reading: any, index: number) => {
      totalQuestions += reading.readingOptionInfos.length
      answeredQuestions += readingAnswers.value[index].filter((a: string) => a).length
    })
  }

  // 计算匹配题
  if (paperData.value.matchingVO) {
    totalQuestions += paperData.value.matchingVO.matchingOptionInfos.length
    answeredQuestions += matchingAnswers.value.filter(a => a).length
  }

  // 计算翻译题
  if (paperData.value.translationVO) {
    totalQuestions += paperData.value.translationVO.translationOptionInfos.length
    answeredQuestions += translationAnswers.value.filter(a => a.trim()).length
  }

  // 计算写作题
  if (paperData.value.writingVO) {
    totalQuestions += 1
    if (writingAnswer.value.trim()) {
      answeredQuestions += 1
    }
  }

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

  // 直接显示参考答案，不发送到服务器
  showReference.value = true
  ElMessage.success('答案已提交')
}

// 返回主页
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
  position: relative;
}

.card-header {
  text-align: center;
  margin-bottom: 28px;
  position: relative;
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
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.timer {
  background: linear-gradient(135deg, #fa541c 0%, #ff7a45 100%);
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(250, 84, 28, 0.2);
  text-align: center;
  line-height: 1.3;
  animation: pulse-light 2s infinite alternate;
}

@keyframes pulse-light {
  0% {
    box-shadow: 0 4px 12px rgba(250, 84, 28, 0.2);
  }
  100% {
    box-shadow: 0 8px 20px rgba(250, 84, 28, 0.4);
  }
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
  padding: 15px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
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
  min-width: 30px;
}

.question-content {
  color: #262626;
  line-height: 1.6;
  font-size: 16px;
}

.passage-text {
  white-space: pre-line;
  line-height: 1.8;
  margin-bottom: 20px;
}

.cloze-options-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 24px;
}

.cloze-item {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background-color: #fafafa;
  margin-bottom: 10px;
}

.question-number {
  font-weight: 600;
  color: #262626;
  margin-right: 12px;
  font-size: 16px;
  min-width: 38px;
  margin-bottom: 8px;
}

.options-container {
  margin-top: 16px;
  width: 100%;
}

.options-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.options-grid-two-columns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
  margin-top: 16px;
}

.option-item-eng {
  margin-bottom: 10px;
  padding: 14px 16px;
  border-radius: 8px;
  transition: all 0.3s;
  position: relative;
  border: 1px solid #f0f0f0;
  background-color: white;
}

.option-item-eng:hover {
  background-color: #f5f5f5;
}

.option-item-eng .el-radio {
  width: 100%;
  margin-right: 0;
  display: flex;
  align-items: center;
}

.option-item-eng :deep(.el-radio__label) {
  white-space: normal;
  line-height: 1.5;
  font-size: 15px;
  color: #262626;
  display: inline-block;
  padding-right: 30px; /* 为图标留出空间 */
}

.correct-option {
  background-color: rgba(82, 196, 26, 0.1);
  border: 1px solid #52c41a !important;
}

.wrong-option {
  background-color: rgba(255, 77, 79, 0.1);
  border: 1px solid #ff4d4f !important;
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
  z-index: 2;
}

.correct-icon {
  background-color: #52c41a;
  color: white;
}

.wrong-icon {
  background-color: #ff4d4f;
  color: white;
}

.reference-answer {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px dashed #d9d9d9;
}

.reference-title {
  font-weight: 600;
  color: #262626;
  margin-bottom: 8px;
}

.reference-content {
  color: #262626;
  background-color: #f9f9f9;
  padding: 12px;
  border-radius: 6px;
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

/* 移动设备适配 */
@media (max-width: 768px) {
  .exam-page {
    padding: 16px;
  }
  
  .real-exam-badge {
    position: relative;
    top: 0;
    right: 0;
    margin: 16px auto;
    width: fit-content;
  }

  .matching-select {
    width: 100%;
  }

  .options-grid-two-columns {
    grid-template-columns: 1fr;
  }
  
  .option-item-eng {
    padding: 12px 14px;
  }
  
  .option-item-eng :deep(.el-radio__label) {
    font-size: 14px;
  }
  
  .matching-select,
  .translation-answer-area :deep(.el-textarea__inner),
  .writing-answer-area :deep(.el-textarea__inner) {
    width: 100%;
  }
}

/* 新增的CSS样式 */
.matching-header {
  margin-bottom: 16px;
}

.matching-item {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background-color: #fafafa;
  margin-bottom: 20px;
}

.matching-answer-container {
  margin: 16px 0;
}

.matching-select {
  width: 150px;
}

/* 修改翻译题样式 */
.translation-header {
  margin-bottom: 16px;
}

.translation-item {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background-color: #fafafa;
  margin-bottom: 20px;
}

.translation-answer-area {
  margin: 16px 0;
}
</style> 