<template>
  <div class="exam-page">
    <div class="card-header">
      <h1 class="exam-title">{{ isExamMode ? '考试开始' : '练习开始' }}</h1>
      <p class="exam-subtitle">计算机专业课试卷: {{ paperTitle }}</p>

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
        </div>
        <el-progress :percentage="calculateProgress" :color="progressColor" />
      </div>

      <div class="question-section" v-if="paperData">
        <!-- 单选题部分 -->
        <div v-if="paperData.choiceVOs && paperData.choiceVOs.length > 0" class="question-category">
          <h2 class="category-title">
            一、单项选择题（每题{{ paperData.choiceVOs[0].score }}分，共{{
              paperData.choiceVOs.length * paperData.choiceVOs[0].score
            }}分）
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
                  <div class="options-grid options-grid-cs">
                    <div
                      v-for="option in ['A', 'B', 'C', 'D']"
                      :key="option"
                      class="option-item option-item-cs"
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
              <!-- AI 解析结果显示区域 -->
              <div v-if="showAnalysis[`choice-${question.questionId}`]" class="analysis-container">
                <div class="analysis-title">AI 解析结果：</div>
                <div
                  class="markdown-body analysis-content"
                  v-html="renderMarkdown(analysisResults[`choice-${question.questionId}`])"
                ></div>
              </div>
              <!-- AI 解析按钮 -->
              <div
                v-if="showReference && !showAnalysis[`choice-${question.questionId}`]"
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
                  v-if="aiAnalysisStatus[`choice-${question.questionId}`] === 500"
                  class="ai-analysis-status-tooltip"
                >
                  提示：当前 AI 解析状态为 500，可能存在一些问题，请稍后再试。
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 解答题部分 -->
        <div v-if="paperData.solveVOs && paperData.solveVOs.length > 0" class="question-category">
          <h2 class="category-title">
            二、解答题（每题{{ paperData.solveVOs[0].score }}分，共{{
              paperData.solveVOs.length * paperData.solveVOs[0].score
            }}分）
          </h2>
          <div class="question-list">
            <div
              v-for="(question, questionIndex) in paperData.solveVOs"
              :key="'solve-' + question.questionId"
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { message } from 'ant-design-vue'
import { getProfessionalExam } from '@/api/exam'
import { getUser } from '@/api/user'
import MarkdownIt from 'markdown-it'
import type { Options as MarkdownItOptions } from 'markdown-it'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/themes/prism.css'
import markdownItKatexGpt from 'markdown-it-katex-gpt'
import { saveWrongQuestion } from '@/api/errorRecord'
import { SaveWrongQuestionData, WrongQuestionRecord } from '@/types/errorRecord'

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
const analysisAnswers = ref<string[]>([])

// AI 解析相关数据
const showAnalysis = ref<{ [key: string]: boolean }>({})
const analysisResults = ref<{ [key: string]: string }>({})
const aiAnalysisStatus = ref<{ [key: string]: number }>({})
let userId: number | null = null

// 初始化 Markdown
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

//用于接收错题的参数
export interface Question {
  questionId: string
  questionContent: string
  score: number
  correctAnswer?: string
  optionA?: string
  optionB?: string
  optionC?: string
  optionD?: string
  referenceAnswer?: string
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

// 将Markdown文本转换为HTML
const renderMarkdown = (text: string): string => {
  if (!text) return ''

  // 预处理文本，将特殊格式转换为标准Markdown
  let processedText = text

  // 处理连续井号的标题格式 (如 ####标题####)
  processedText = processedText.replace(/^(#{3,})([^#\n]+)(#{3,})$/gm, (_, _hash, titleContent) => {
    return `# ${titleContent.trim()}`
  })

  // 处理带空格的标题格式 (如 #### 标题)
  processedText = processedText.replace(/^(#{3,})\s+([^#\n]+)$/gm, (_, _hash, titleContent) => {
    return `# ${titleContent.trim()}`
  })

  // 处理特定的AI解析标题格式
  processedText = processedText.replace(/^#{3,}\s*题目解析\s*#{0,}$/gim, '# 题目解析')
  processedText = processedText.replace(
    /^#{3,}\s*\d+\.\s*考点映射\s*[:-]\s*\*\*核心考点\*\*$/gim,
    '## 考点映射 - 核心考点'
  )
  processedText = processedText.replace(/^#{3,}\s*\d+\.\s*考点映射\s*#{0,}$/gim, '## 考点映射')
  processedText = processedText.replace(
    /^#{3,}\s*\d+\.\s*干扰项设计逻辑\s*#{0,}$/gim,
    '## 干扰项设计逻辑'
  )
  processedText = processedText.replace(/^#{3,}\s*\d+\.\s*秒杀技巧\s*#{0,}$/gim, '## 秒杀技巧')

  // 处理数字编号标题 (如 ####1.考点映射)
  processedText = processedText.replace(/^#{3,}\s*(\d+)\.\s*([^#\n]+)$/gm, (_, _num, content) => {
    return `## ${content.trim()}`
  })

  // 处理其他以####开头的标题 (如 ####标题)
  processedText = processedText.replace(/^#{3,}([^#\s][^#\n]*)$/gm, (_, content) => {
    return `# ${content.trim()}`
  })

  // 处理可能的分隔符
  processedText = processedText.replace(/^-{3,}$/gm, '---')

  return md.render(processedText)
}

// 初始化 AI 解析数据
const initializeAnalysisData = () => {
  if (!paperData.value) return

  // 初始化单选题解析数据
  if (paperData.value.choiceVOs) {
    paperData.value.choiceVOs.forEach((question: any) => {
      showAnalysis.value[`choice-${question.questionId}`] = false
      analysisResults.value[`choice-${question.questionId}`] = ''
      aiAnalysisStatus.value[`choice-${question.questionId}`] = 0
    })
  }
}

// 分析题目 - 使用 SSE (Server-Sent Events) 的方式
const analyzeQuestionSSE = (questionId: string, questionType: string): void => {
  // 获取 token
  const token = localStorage.getItem('token') || ''

  // 使用 userId 构建请求 URL，如果 userId 不存在则不添加参数
  let requestUrl = `/api/ai/analysis?questionId=${questionId}&subject=computer`
  if (userId !== null) {
    requestUrl += `&userId=${userId}`
  }

  const abortController = new (window as any).AbortController()

  // 请求头设置
  const headers: Record<string, string> = {
    Accept: 'text/event-stream',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'X-Requested-With': 'XMLHttpRequest'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
    headers['token'] = token
  }

  fetch(requestUrl, {
    method: 'GET',
    headers,
    signal: abortController.signal,
    credentials: 'include'
  })
    .then(response => {
      console.log('响应状态码:', response.status)
      console.log('响应类型:', response.type)
      console.log('响应头:', [...response.headers.entries()])

      // 处理响应状态
      if (response.status === 500) {
        throw new Error('服务器内部错误，请稍后再试')
      } else if (!response.ok) {
        throw new Error(`HTTP 错误! 状态: ${response.status}`)
      }

      // 获取响应数据流
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('无法获取响应流')
      }

      const decoder = new TextDecoder()

      // 递归函数处理数据流
      const processStream = async () => {
        try {
          const { done, value } = await reader.read()

          if (done) {
            console.log('流数据接收完成')
            return
          }

          // 解码并处理数据块
          const chunk = decoder.decode(value, { stream: true })
          console.log('接收到数据块:', chunk)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data:')) {
              const data = line.slice(5).trim()

              if (data === '[DONE]') {
                console.log('收到 [DONE] 标记，解析完成')
                return
              }

              // 更新解析结果
              analysisResults.value[`${questionType}-${questionId}`] += data
            }
          }

          // 继续处理流
          return processStream()
        } catch (error) {
          console.error('处理流数据时出错:', error)
          throw error
        }
      }

      // 开始处理流
      return processStream()
    })
    .catch(error => {
      console.error('AI 解析请求失败:', error)
      aiAnalysisStatus.value[`${questionType}-${questionId}`] = 500
      message.error('AI 解析请求失败: ' + error.message)
    })
}

// 开始分析题目
const analyzeQuestion = (questionId: string, questionType: string) => {
  showAnalysis.value[`${questionType}-${questionId}`] = true
  analysisResults.value[`${questionType}-${questionId}`] = ''
  message.info('正在生成AI解析，请稍候...')
  analyzeQuestionSSE(questionId, questionType)
}

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

    const examName = '2024年全国硕士研究生招生考试计算机学科专业基础(408)真题'
    const response = await getProfessionalExam(examName)

    if (response.data) {
      paperData.value = response.data
      paperTitle.value = examName
      initializeAnswers()
      initializeAnalysisData() // 添加AI解析数据初始化

      clearInterval(loadingTimer)
      loadingPercentage.value = 100
      loading.value = false
    } else {
      message.error('获取试卷失败，服务器没有返回数据')
      clearInterval(loadingTimer)
      loading.value = false
    }
  } catch (error) {
    console.error('获取试卷失败：', error)
    message.error('获取试卷失败，请重试')
    loading.value = false
  }
}

const initializeAnswers = () => {
  if (!paperData.value) return

  // 初始化单选题答案
  if (paperData.value.choiceVOs) {
    singleChoiceAnswers.value = new Array(paperData.value.choiceVOs.length).fill('')
  }

  // 初始化解答题答案
  if (paperData.value.solveVOs) {
    analysisAnswers.value = new Array(paperData.value.solveVOs.length).fill('')
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

  // 统计解答题
  if (paperData.value.solveVOs) {
    answered += analysisAnswers.value.filter(a => a.trim()).length
    total += paperData.value.solveVOs.length
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

const saveWrongQuestions = async () => {
  if (!userId) {
    console.error('用户ID未获取到，无法保存错题')
    return
  }

  const wrongQuestions: WrongQuestionRecord[] = []

  // 处理单选题
  if (paperData.value?.choiceVOs) {
    paperData.value.choiceVOs.forEach((question: any, index: number) => {
      if (question.correctAnswer !== singleChoiceAnswers.value[index]) {
        wrongQuestions.push({
          questionId: question.questionId,
          userAnswer: singleChoiceAnswers.value[index]
        })
      }
    })
  }

  // 处理解答题
  if (paperData.value?.solveVOs) {
    paperData.value.solveVOs.forEach((question: any, index: number) => {
      if (
        question.referenceAnswer &&
        question.referenceAnswer.trim() !== analysisAnswers.value[index].trim()
      ) {
        wrongQuestions.push({
          questionId: question.questionId,
          userAnswer: analysisAnswers.value[index]
        })
      }
    })
  }

  // 保存错题
  if (wrongQuestions.length > 0) {
    const saveData: SaveWrongQuestionData = {
      userId: userId as number,
      type: route.query.type === 'isExamMode' ? '研究生考试' : '研究生练习',
      questionInfo: '408解答题',
      records: wrongQuestions
    }

    try {
      await saveWrongQuestion(saveData)
      message.success('错题已保存！')
    } catch (error) {
      message.error('保存错题失败，请重试')
      console.error('保存错题失败：', error)
    }
  }
}

// 提交答案
const submitAnswers = async () => {
  // 检查是否有未完成的题目
  const totalQuestions =
    (paperData.value.choiceVOs?.length || 0) + (paperData.value.solveVOs?.length || 0)

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
      return // 用户选择继续作答
    }
  }
  // 保存错题
  await saveWrongQuestions()

  // 直接显示参考答案，不发送到服务器
  showReference.value = true
  message.success('答案已提交')
}

// 返回主页
const returnToHome = () => {
  router.push('/exam/postgraduate')
}

onMounted(async () => {
  // 获取用户信息（为了AI解析功能）
  try {
    const response = await getUser()
    userId = Number(response.data.id)
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }

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
  top: 0;
  right: 0;
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

.options-grid-cs {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  width: 100%;
}

.option-item-cs {
  margin-bottom: 0;
  padding: 12px 16px;
  border-radius: 6px;
  transition: all 0.3s;
  position: relative;
  border: 1px solid #f0f0f0;
}

.option-item-cs:hover {
  background-color: #f5f5f5;
}

.option-item-cs .el-radio {
  width: 100%;
  margin-right: 0;
  display: flex;
  align-items: center;
}

.option-item-cs :deep(.el-radio__label) {
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
  z-index: 2; /* 确保图标在文本和radio上层 */
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
  color: white;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(215deg, #c332fb, #00dbde, #c332fb);
  background-size: 400%;
  border: 0;
  border-radius: 4px;
  z-index: 1;
  width: 77px;
}
@keyframes neon {
  from {
    background-position: 0%;
  }
  to {
    background-position: 400%;
  }
}
.ai-parse-button:hover {
  animation: neon 8s linear infinite;
}
.ai-parse-button::before {
  width: 87px;
  content: '';
  position: absolute;
  inset: -5px;
  z-index: -1;
  background: linear-gradient(215deg, #c332fb, #00dbde, #c332fb);
  background-size: 400%;
  border-radius: 40px;
  opacity: 0;
}
.ai-parse-button:hover::before {
  width: 87px;
  filter: blur(10px);
  opacity: 1;
  animation: neon 8s linear infinite;
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
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
  color: #262626;
}

.markdown-body h1 {
  font-size: 1.85em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.markdown-body h2 {
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.markdown-body h3 {
  font-size: 1.25em;
}

.markdown-body h4 {
  font-size: 1em;
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

.markdown-body ul,
.markdown-body ol {
  padding-left: 2em;
}

.markdown-body li + li {
  margin-top: 0.25em;
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
