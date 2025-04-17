<template>
  <div class="exam-page">
    <div class="card-header">
      <h1 class="exam-title">{{ isExamMode ? '考试开始' : '练习开始' }}</h1>
      <p class="exam-subtitle">心理学专业课试卷: {{ paperTitle }}</p>

      <div v-if="isExamMode" class="real-exam-badge" :class="{ 'time-warning': showTimeWarning }">
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
          <div class="auto-save-indicator">自动保存已启用</div>
        </div>
        <el-progress :percentage="calculateProgress" :color="progressColor" />
      </div>

      <div class="question-section" v-if="paperData">
        <!-- 单选题部分 -->
        <div v-if="filteredChoiceQuestions.length > 0" class="question-category">
          <h2 class="category-title">
            一、单项选择题（每题{{ filteredChoiceQuestions[0].score }}分，共{{
              filteredChoiceQuestions.length * filteredChoiceQuestions[0].score
            }}分）
          </h2>
          <div class="question-list">
            <div
              v-for="(question, questionIndex) in filteredChoiceQuestions"
              :key="'choice-' + question.questionId"
              class="question-item"
            >
              <div class="question-header">
                <span class="question-number">{{ questionIndex + 1 }}.</span>
                <div class="question-content" v-html="question.questionContent"></div>
                <span
                  v-if="examSettings.showDifficulty"
                  class="difficulty-tag"
                  :class="getDifficultyClass(question.difficulty)"
                >
                  {{ question.difficulty }}
                </span>
              </div>
              <div class="options-container single-choice-options">
                <el-radio-group
                  v-model="
                    singleChoiceAnswers[
                      paperData.choiceVOs?.findIndex(q => q.questionId === question.questionId) ??
                        -1
                    ]
                  "
                  class="options-group"
                  :disabled="showReference"
                >
                  <div class="options-grid options-grid-psy">
                    <div
                      v-for="option in ['A', 'B', 'C', 'D']"
                      :key="option"
                      class="option-item option-item-psy"
                      :class="{
                        'correct-option': showReference && option === question.correctAnswer,
                        'wrong-option':
                          showReference &&
                          singleChoiceAnswers[
                            paperData.choiceVOs?.findIndex(
                              q => q.questionId === question.questionId
                            ) ?? -1
                          ] === option &&
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
                          v-else-if="
                            singleChoiceAnswers[
                              paperData.choiceVOs?.findIndex(
                                q => q.questionId === question.questionId
                              ) ?? -1
                            ] === option
                          "
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
              <!-- AI 解析结果显示区域 -->
              <div v-if="showAnalysis[`choice-${question.questionId}`]" class="analysis-container">
                <div class="analysis-title">AI 解析结果：</div>
                <div
                  v-if="aiAnalysisStatus[`choice-${question.questionId}`] === 1 && !analysisResults[`choice-${question.questionId}`]"
                  class="analysis-loading"
                >
                  <el-progress
                    type="circle"
                    :percentage="0"
                    :indeterminate="true"
                    :width="30"
                  ></el-progress>
                  <span class="loading-text">AI解析生成中...</span>
                </div>
                <div v-else-if="aiAnalysisStatus[`choice-${question.questionId}`] === 4"
                  class="analysis-empty"
                >
                  <span>暂无解析结果，请稍后再试。</span>
                </div>
                <div v-else-if="aiAnalysisStatus[`choice-${question.questionId}`] === 3"
                  class="analysis-error"
                >
                  <span>解析请求失败，请稍后重试。</span>
                  <el-button size="small" type="primary" @click="retryAnalysis(question.questionId, 'choice')" class="retry-button">
                    重试
                  </el-button>
                </div>
                <div v-else
                  class="markdown-body analysis-content"
                >
                  <div v-html="renderMarkdown(analysisResults[`choice-${question.questionId}`] || '')"></div>
                  <div v-if="aiAnalysisStatus[`choice-${question.questionId}`] === 1" class="analysis-streaming-indicator">
                    <span class="loading-dot"></span>
                    <span class="loading-dot"></span>
                    <span class="loading-dot"></span>
                  </div>
                </div>
              </div>
              <!-- AI 解析按钮 -->
              <div
                v-if="
                  examSettings.showAIAnalysis &&
                  showReference &&
                  !showAnalysis[`choice-${question.questionId}`]
                "
                class="ai-parse-button-container"
              >
                <el-button
                  type="primary"
                  @click="analyzeQuestion(question.questionId, 'choice')"
                  class="ai-parse-button"
                >
                  AI 解析
                </el-button>
                <div
                  v-if="aiAnalysisStatus[`choice-${question.questionId}`] === 3"
                  class="ai-analysis-status-tooltip"
                >
                  提示：解析请求失败，请点击"AI 解析"按钮重试。
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 解答题部分 -->
        <div v-if="filteredSolveQuestions.length > 0" class="question-category">
          <h2 class="category-title">
            二、解答题（每题{{ filteredSolveQuestions[0].score }}分，共{{
              filteredSolveQuestions.length * filteredSolveQuestions[0].score
            }}分）
          </h2>
          <div class="question-list">
            <div
              v-for="(question, questionIndex) in filteredSolveQuestions"
              :key="'solve-' + question.questionId"
              class="question-item"
            >
              <div class="question-header">
                <span class="question-number">{{ questionIndex + 1 }}.</span>
                <div class="question-content" v-html="question.questionContent"></div>
                <span
                  v-if="examSettings.showDifficulty"
                  class="difficulty-tag"
                  :class="getDifficultyClass(question.difficulty)"
                >
                  {{ question.difficulty }}
                </span>
              </div>
              <div class="options-container analysis-options">
                <div class="analysis-answer-area">
                  <el-input
                    type="textarea"
                    v-model="
                      analysisAnswers[
                        paperData.solveVOs?.findIndex(q => q.questionId === question.questionId) ??
                          -1
                      ]
                    "
                    :rows="8"
                    placeholder="请在此处作答..."
                    :disabled="showReference"
                  ></el-input>
                </div>
              </div>
              <div v-if="showReference && question.referenceAnswer" class="reference-answer">
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { message } from 'ant-design-vue'
import { getPsychologyExam } from '@/api/exam'
import { getUser } from '@/api/user'
import MarkdownIt from 'markdown-it'
import type { Options as MarkdownItOptions } from 'markdown-it'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/themes/prism.css'
import markdownItKatexGpt from 'markdown-it-katex-gpt'
import type { ExamPaper } from '@/types/exam'

const route = useRoute()
const router = useRouter()
const isExamMode = computed(() => route.query.type === 'exam')
const paperTitle = ref('')
const paperData = ref<ExamPaper | null>(null)
const loading = ref(true)
const loadingPercentage = ref(0)
const showReference = ref(false)
const timeLeft = ref(7200)
const timerId = ref<number | null>(null)

const singleChoiceAnswers = ref<string[]>([])
const analysisAnswers = ref<string[]>([])

const ANALYSIS_STATUS = {
  IDLE: 0,
  LOADING: 1,
  SUCCESS: 2,
  ERROR: 3,
  EMPTY: 4
}

const showAnalysis = ref<{ [key: string]: boolean }>({})
const analysisResults = ref<{ [key: string]: string }>({})
const aiAnalysisStatus = ref<{ [key: string]: number }>({})
const userId = ref<number | null>(null)

const examSettings = ref({
  showDifficulty: true,
  filterByDifficulty: false,
  selectedDifficulty: '全部',
  timeLimit: 7200,
  showAIAnalysis: true
})

const showTimeWarning = ref(false)

watch(timeLeft, newValue => {
  if (newValue <= 60 && !showTimeWarning.value) {
    showTimeWarning.value = true
    message.warning('考试时间剩余不足1分钟，请抓紧时间！')
  }
})

const mdOptions: MarkdownItOptions = {
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
  highlight: (str: string, lang: string) => {
    if (lang && Prism.languages[lang]) {
      try {
        return `<pre class="code-block language-${lang}"><code class="language-${lang}">${Prism.highlight(
          str,
          Prism.languages[lang],
          lang
        )}</code></pre>`
      } catch (__) {}
    }
    return `<pre class="code-block"><code>${str}</code></pre>`
  }
}

const md = new MarkdownIt(mdOptions)
md.use(markdownItKatexGpt, {
  delimiters: [
    { left: '\\[', right: '\\]', display: true },
    { left: '\\(', right: '\\)', display: false },
    { left: '$$', right: '$$', display: true },
    { left: '$', right: '$', display: false }
  ]
})

const renderMarkdown = (text: string): string => {
  if (!text) return ''

  let processedText = text

  processedText = processedText.replace(/^(#{1,6})([^#\n]+)(#{1,6})$/gm, (_, hash, titleContent) => {
    return `${hash} ${titleContent.trim()}`
  })

  processedText = processedText.replace(/^(#{3,})\s+([^#\n]+)$/gm, (_, hash, titleContent) => {
    return `${hash.substring(0, 2)} ${titleContent.trim()}`
  })

  processedText = processedText.replace(/^#{3,}\s*题目解析\s*#{0,}$/gim, '# 题目解析')
  processedText = processedText.replace(/^#{3,}\s*\d+\.\s*考点映射\s*[:-]\s*\*\*核心考点\*\*$/gim, '## 考点映射 - 核心考点')
  processedText = processedText.replace(/^#{3,}\s*\d+\.\s*考点映射\s*#{0,}$/gim, '## 考点映射')
  processedText = processedText.replace(/^#{3,}\s*\d+\.\s*干扰项设计逻辑\s*#{0,}$/gim, '## 干扰项设计逻辑')
  processedText = processedText.replace(/^#{3,}\s*\d+\.\s*秒杀技巧\s*#{0,}$/gim, '## 秒杀技巧')

  processedText = processedText.replace(/^#{3,}\s*(\d+)\.\s*([^#\n]+)$/gm, (_, num, content) => {
    return `## ${num}. ${content.trim()}`
  })

  processedText = processedText.replace(/^#{3,}([^#\s][^#\n]*)$/gm, (_, content) => {
    return `# ${content.trim()}`
  })

  processedText = processedText.replace(/^-{3,}$/gm, '---')

  return md.render(processedText)
}

const fetchPaper = async () => {
  loading.value = true
  loadingPercentage.value = 0

  try {
    const loadingTimer = setInterval(() => {
      loadingPercentage.value += 10
      if (loadingPercentage.value >= 90) {
        clearInterval(loadingTimer)
      }
    }, 200)

    const examName = '2024年全国硕士研究生招生考试心理学真题'
    const response = await getPsychologyExam(examName) as { data: ExamPaper }

    if (response.data) {
      paperData.value = response.data
      paperTitle.value = examName
      initializeAnswers()
      initializeAnalysisData()

      clearInterval(loadingTimer)
      loadingPercentage.value = 100
      loading.value = false

      if (route.query.timeLimit) {
        const customTimeLimit = Number(route.query.timeLimit)
        if (!isNaN(customTimeLimit) && customTimeLimit > 0) {
          timeLeft.value = customTimeLimit * 60
          examSettings.value.timeLimit = customTimeLimit * 60
        }
      }
    } else {
      message.error('获取试卷失败，服务器没有返回数据')
      clearInterval(loadingTimer)
      loading.value = false
    }
  } catch (error) {
    message.error('获取试卷失败，请重试')
    loading.value = false
  }
}

const initializeAnswers = () => {
  if (!paperData.value) return

  if (paperData.value.choiceVOs) {
    singleChoiceAnswers.value = new Array(paperData.value.choiceVOs.length).fill('')
  }

  if (paperData.value.solveVOs) {
    analysisAnswers.value = new Array(paperData.value.solveVOs.length).fill('')
  }
}

const calculateProgress = computed(() => {
  if (!paperData.value) return 0

  let answered = 0
  let total = 0

  if (paperData.value.choiceVOs) {
    answered += singleChoiceAnswers.value.filter(a => a).length
    total += paperData.value.choiceVOs.length
  }

  if (paperData.value.solveVOs) {
    answered += analysisAnswers.value.filter(a => a.trim()).length
    total += paperData.value.solveVOs.length
  }

  return total > 0 ? Math.floor((answered / total) * 100) : 0
})

const progressColor = computed(() => {
  const progress = calculateProgress.value
  if (progress < 30) return '#ff4d4f'
  if (progress < 70) return '#faad14'
  return '#52c41a'
})

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const autoSaveAnswers = () => {
  try {
    const answerData = {
      examName: paperTitle.value,
      singleChoiceAnswers: singleChoiceAnswers.value,
      analysisAnswers: analysisAnswers.value,
      timeLeft: timeLeft.value
    }
    localStorage.setItem('psychology_exam_progress', JSON.stringify(answerData))
  } catch (error) {
  }
}

const loadSavedAnswers = () => {
  try {
    const savedData = localStorage.getItem('psychology_exam_progress')
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      if (parsedData.examName === paperTitle.value) {
        if (
          parsedData.singleChoiceAnswers &&
          parsedData.singleChoiceAnswers.length === singleChoiceAnswers.value.length
        ) {
          singleChoiceAnswers.value = parsedData.singleChoiceAnswers
        }
        if (
          parsedData.analysisAnswers &&
          parsedData.analysisAnswers.length === analysisAnswers.value.length
        ) {
          analysisAnswers.value = parsedData.analysisAnswers
        }
        if (
          parsedData.timeLeft &&
          parsedData.timeLeft > 0 &&
          parsedData.timeLeft < examSettings.value.timeLimit
        ) {
          timeLeft.value = parsedData.timeLeft
        }
        return true
      }
    }
    return false
  } catch (error) {
    return false
  }
}

const startTimer = () => {
  const autoSaveTimer = window.setInterval(() => {
    autoSaveAnswers()
  }, 30000)

  timerId.value = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timerId.value as number)
      clearInterval(autoSaveTimer)
      submitAnswers()
    }
  }, 1000)
}

const submitAnswers = async () => {
  const totalQuestions =
    (paperData.value?.choiceVOs?.length || 0) + (paperData.value?.solveVOs?.length || 0)

  const answeredQuestions =
    singleChoiceAnswers.value.filter(a => a).length +
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
      return
    }
  }

  showReference.value = true
  message.success('答案已提交')
  
  initializeAnalysisData()
}

const returnToHome = () => {
  router.push('/exam/postgraduate')
}

const filteredChoiceQuestions = computed(() => {
  if (
    !paperData.value?.choiceVOs ||
    !examSettings.value.filterByDifficulty ||
    examSettings.value.selectedDifficulty === '全部'
  ) {
    return paperData.value?.choiceVOs || []
  }

  return paperData.value.choiceVOs.filter(
    q => q.difficulty === examSettings.value.selectedDifficulty
  )
})

const filteredSolveQuestions = computed(() => {
  if (
    !paperData.value?.solveVOs ||
    !examSettings.value.filterByDifficulty ||
    examSettings.value.selectedDifficulty === '全部'
  ) {
    return paperData.value?.solveVOs || []
  }

  return paperData.value.solveVOs.filter(
    q => q.difficulty === examSettings.value.selectedDifficulty
  )
})

const getDifficultyClass = (difficulty: string): string => {
  switch (difficulty) {
    case '简单':
      return 'easy-difficulty'
    case '中等':
      return 'medium-difficulty'
    case '较难':
      return 'hard-difficulty'
    case '困难':
      return 'very-hard-difficulty'
    default:
      return ''
  }
}

const initializeAnalysisData = () => {
  if (!paperData.value) return
  
  const allQuestions = [
    ...(paperData.value.choiceVOs || [])
  ]
  
  allQuestions.forEach((question: any) => {
    const questionType = getQuestionType(question)
    const key = `${questionType}-${question.questionId}`
    showAnalysis.value[key] = false
    analysisResults.value[key] = ''
    aiAnalysisStatus.value[key] = ANALYSIS_STATUS.IDLE
  })
}

const getQuestionType = (question: any): string => {
  if (Object.prototype.hasOwnProperty.call(question, 'optionA')) return 'choice'
  if (Object.prototype.hasOwnProperty.call(question, 'scaleMin')) return 'scale'
  return 'shortAnswer'
}

const analyzeQuestionSSE = (questionId: string, questionType: string): void => {
  aiAnalysisStatus.value[`${questionType}-${questionId}`] = ANALYSIS_STATUS.LOADING
  
  if (!userId.value) {
    message.warning('无法获取用户ID，AI解析可能无法正常工作')
  }

  let requestUrl = `/api/ai/analysis?questionId=${questionId}&subject=psychology`
  if (userId.value) {
    requestUrl += `&userId=${userId.value}`
  }

  analysisResults.value[`${questionType}-${questionId}`] = ''
  
  try {
    const eventSource = new EventSource(requestUrl)
    
    eventSource.onopen = () => {
      // Connection opened
    }
    
    eventSource.onerror = () => {
      aiAnalysisStatus.value[`${questionType}-${questionId}`] = ANALYSIS_STATUS.ERROR
      message.error('AI解析连接失败，请稍后重试')
      eventSource.close()
    }
    
    eventSource.onmessage = (event) => {
      if (event.data === '[DONE]') {
        eventSource.close()
        
        if (!analysisResults.value[`${questionType}-${questionId}`] || 
            analysisResults.value[`${questionType}-${questionId}`].trim() === '') {
          aiAnalysisStatus.value[`${questionType}-${questionId}`] = ANALYSIS_STATUS.EMPTY
        } else {
          aiAnalysisStatus.value[`${questionType}-${questionId}`] = ANALYSIS_STATUS.SUCCESS
          message.success('AI解析完成')
        }
        return
      }
      
      const key = `${questionType}-${questionId}`
      const currentText = analysisResults.value[key] || ''
      const newText = currentText + event.data
      
      analysisResults.value[key] = newText
      
      const newResults = { ...analysisResults.value }
      analysisResults.value = newResults
    }
    
    setTimeout(() => {
      if (aiAnalysisStatus.value[`${questionType}-${questionId}`] === ANALYSIS_STATUS.LOADING) {
        eventSource.close()
        
        if (analysisResults.value[`${questionType}-${questionId}`] && 
            analysisResults.value[`${questionType}-${questionId}`].trim() !== '') {
          aiAnalysisStatus.value[`${questionType}-${questionId}`] = ANALYSIS_STATUS.SUCCESS
        } else {
          aiAnalysisStatus.value[`${questionType}-${questionId}`] = ANALYSIS_STATUS.ERROR
          message.error('AI解析请求超时')
        }
      }
    }, 30000)
    
  } catch (error) {
    aiAnalysisStatus.value[`${questionType}-${questionId}`] = ANALYSIS_STATUS.ERROR
    message.error('AI 解析请求失败：' + (error instanceof Error ? error.message : String(error)))
  }
}

const analyzeQuestion = (questionId: string, questionType: string) => {
  showAnalysis.value[`${questionType}-${questionId}`] = true
  
  message.info('正在生成AI解析，请稍候...')

  try {
    analyzeQuestionSSE(questionId, questionType)
  } catch (error) {
    aiAnalysisStatus.value[`${questionType}-${questionId}`] = ANALYSIS_STATUS.ERROR
    message.error('AI解析初始化失败: ' + (error instanceof Error ? error.message : String(error)))
  }
}

const retryAnalysis = (questionId: string, questionType: string) => {
  aiAnalysisStatus.value[`${questionType}-${questionId}`] = ANALYSIS_STATUS.IDLE
  analyzeQuestion(questionId, questionType)
}


onMounted(async () => {
  try {
    const response = await getUser() as { data: { id: number } }
    userId.value = Number(response.data.id)
  } catch (error) {
    // Error handling
  }

  await fetchPaper()

  if (paperData.value) {
    loadSavedAnswers()
  }

  if (isExamMode.value) {
    startTimer()
  }

  initializeAnalysisData()
})

onBeforeUnmount(() => {
  if (timerId.value) {
    clearInterval(timerId.value)
  }
  if (!showReference.value) {
    autoSaveAnswers()
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
  top: 0;
  right: 0;
  z-index: 10;
}

.timer {
  background: linear-gradient(135deg, #1677ff 0%, #69b4ff 100%);
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.2);
  text-align: center;
  line-height: 1.3;
  animation: pulse-light 2s infinite alternate;
}

@keyframes pulse-light {
  0% {
    box-shadow: 0 4px 12px rgba(22, 119, 255, 0.2);
  }
  100% {
    box-shadow: 0 8px 20px rgba(22, 119, 255, 0.4);
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

.options-grid-psy {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  width: 100%;
}

.option-item-psy {
  margin-bottom: 0;
  padding: 12px 16px;
  border-radius: 6px;
  transition: all 0.3s;
  position: relative;
  border: 1px solid #f0f0f0;
}

.option-item-psy:hover {
  background-color: #f5f5f5;
}

.option-item-psy .el-radio {
  width: 100%;
  margin-right: 0;
  display: flex;
  align-items: center;
}

.option-item-psy :deep(.el-radio__label) {
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

/* 解答题样式 */
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

/* AI 解析相关样式 */
.analysis-container {
  margin-top: 16px;
  padding: 16px;
  background-color: #f0f7ff;
  border-radius: 8px;
  border: 1px solid #d6e4ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
}

.analysis-title {
  font-weight: 600;
  color: #1677ff;
  margin-bottom: 12px;
}

.analysis-content {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #262626;
  background-color: transparent;
  font-family: inherit;
  font-size: 14px;
  padding: 0;
  margin: 0;
}

.ai-parse-button-container {
  margin-top: 16px;
  display: flex;
  align-items: center;
  position: relative;
}

.ai-parse-button {
  padding: 8px 16px;
  font-size: 14px;
}

.ai-analysis-status-tooltip {
  margin-left: 16px;
  font-size: 13px;
  color: #ff4d4f;
}

/* Markdown样式 */
.markdown-body {
  color: #24292e;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 16px;
  margin-bottom: 8px;
  font-weight: 600;
  line-height: 1.25;
  color: #262626;
}

.markdown-body h1 {
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.2em;
}

.markdown-body h2 {
  font-size: 1.25em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.2em;
}

.markdown-body h3 {
  font-size: 1.1em;
}

.markdown-body h4 {
  font-size: 1em;
}

.markdown-body p {
  margin-top: 0;
  margin-bottom: 8px;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 2em;
  margin-top: 0;
  margin-bottom: 8px;
}

.markdown-body li + li {
  margin-top: 0.1em;
}

.markdown-body li p {
  margin-top: 4px;
  margin-bottom: 4px;
}

.markdown-body code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
}

.markdown-body pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
}

.markdown-body blockquote {
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
  margin: 0 0 16px 0;
}

.markdown-body blockquote > :first-child {
  margin-top: 0;
}

.markdown-body blockquote > :last-child {
  margin-bottom: 0;
}

.markdown-body table {
  display: block;
  width: 100%;
  overflow: auto;
  border-spacing: 0;
  border-collapse: collapse;
  margin: 16px 0;
}

.markdown-body table th,
.markdown-body table td {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.markdown-body table tr {
  background-color: #fff;
  border-top: 1px solid #c6cbd1;
}

.markdown-body table tr:nth-child(2n) {
  background-color: #f6f8fa;
}

.markdown-body img {
  max-width: 100%;
  box-sizing: border-box;
}

.difficulty-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 10px;
  color: #fff;
}

.easy-difficulty {
  background-color: #52c41a;
}

.medium-difficulty {
  background-color: #1890ff;
}

.hard-difficulty {
  background-color: #faad14;
}

.very-hard-difficulty {
  background-color: #ff4d4f;
}

.exam-settings {
  background-color: #f5f7fa;
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.setting-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.auto-save-indicator {
  font-size: 12px;
  color: #52c41a;
  margin-left: 12px;
}

.time-warning {
  animation: pulse 1s infinite;
  background-color: rgba(255, 77, 79, 0.8);
}

.analysis-loading {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 20px 0;
}

.loading-text {
  color: #1890ff;
  font-size: 14px;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

/* 深色模式适配 */
:deep(html.dark) .exam-settings {
  background-color: #1f1f1f;
}

:deep(html.dark) .auto-save-indicator {
  color: #73d13d;
}

.analysis-empty,
.analysis-error {
  padding: 16px;
  text-align: center;
  color: #8c8c8c;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-top: 8px;
  font-size: 14px;
}

.analysis-error {
  color: #ff4d4f;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.retry-button {
  margin-top: 8px;
  padding: 4px 12px;
}

.analysis-streaming-indicator {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.loading-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin: 0 4px;
  background-color: #1677ff;
  border-radius: 50%;
  animation: dot-pulse 1.5s infinite ease-in-out;
}

.loading-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dot-pulse {
  0%, 100% {
    transform: scale(0.6);
    opacity: 0.6;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>

<style>
/* 确保Prism样式在全局生效 */
.code-block {
  margin: 16px 0;
  border-radius: 6px;
  overflow: hidden;
}

.code-block code {
  display: block;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  padding: 16px;
  overflow-x: auto;
  line-height: 1.45;
  background-color: #f6f8fa;
  font-size: 85%;
}

/* 数学公式样式 */
.katex-display {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 8px 0;
}
</style>
