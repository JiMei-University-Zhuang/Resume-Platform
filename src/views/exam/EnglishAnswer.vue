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
          <h2 class="category-title">Section I Cloze Test (每题1分，共20分)</h2>
          <div class="question-item">
            <div class="question-header">
              <div
                class="question-content passage-text"
                v-html="paperData.clozeVO.questionContent"
              ></div>
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
                          <span v-else-if="clozeAnswers[index] === option" class="wrong-icon">
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
        <div
          v-if="paperData.readingVOs && paperData.readingVOs.length > 0"
          class="question-category"
        >
          <h2 class="category-title">Section II Reading Comprehension (每题2分，共40分)</h2>
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
          <h2 class="category-title">Section III Matching (每题2分，共10分)</h2>
          <div class="question-item">
            <div class="reading-passage-content">
              <div
                class="question-content passage-text"
                v-html="paperData.matchingVO.questionContent"
              ></div>
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
          <h2 class="category-title">Section IV Translation (每题2分，共10分)</h2>
          <div class="question-item">
            <div class="reading-passage-content">
              <div
                class="question-content passage-text"
                v-html="paperData.translationVO.questionContent"
              ></div>
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
          <h2 class="category-title">Section V Writing (10分)</h2>
          <div class="question-item">
            <div class="reading-passage-content">
              <div
                class="question-content passage-text"
                v-html="paperData.writingVO.questionContent"
              ></div>
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
                <p>
                  I'm glad to offer some advice for your oral report on an ancient Chinese
                  scientist.
                </p>
                <p>
                  First, choose someone whose achievements are significant, like Zhang Heng
                  (inventor of the first seismograph) or Zu Chongzhi (mathematical pioneer).
                  Research their life story, contributions, and historical context.
                </p>
                <p>
                  For your presentation, start with a brief introduction of the scientist's
                  background. Then focus on their major discoveries and inventions, explaining why
                  they were revolutionary. Visual aids like images or simple models would enhance
                  your report. Finally, discuss how their work influenced modern science.
                </p>
                <p>
                  Feel free to ask if you need more specific guidance on any particular scientist.
                </p>
                <p>Best regards,<br />Li Ming</p>
              </div>
            </div>
            <div
              v-if="showAnalysis[`writing-${paperData.writingVO.questionId}`]"
              class="analysis-container"
            >
              <div class="analysis-title">AI 解析结果：</div>
              <div
                class="markdown-body analysis-content"
                v-html="
                  renderMarkdown(analysisResults[`writing-${paperData.writingVO.questionId}`])
                "
              ></div>
            </div>
            <div
              v-if="showReference && !showAnalysis[`writing-${paperData.writingVO.questionId}`]"
              class="ai-parse-button-container"
            >
              <el-button
                type="primary"
                @click="analyzeQuestion(paperData.writingVO.questionId, 'writing')"
                class="ai-parse-button"
              >
                AI 解析
              </el-button>
              <div
                v-if="aiAnalysisStatus[`writing-${paperData.writingVO.questionId}`] === 500"
                class="ai-analysis-status-tooltip"
              >
                提示：当前 AI 解析状态为 500，可能存在一些问题，请稍后再试。
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
import { getEnglishExam } from '@/api/exam'
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
const clozeAnswers = ref<string[]>([])
const readingAnswers = ref<string[][]>([])
const matchingAnswers = ref<string[]>([])
const translationAnswers = ref<string[]>([])
const writingAnswer = ref('')

// 添加 AI 解析相关数据
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

  // 初始化写作题解析数据
  if (paperData.value.writingVO) {
    showAnalysis.value[`writing-${paperData.value.writingVO.questionId}`] = false
    analysisResults.value[`writing-${paperData.value.writingVO.questionId}`] = ''
    aiAnalysisStatus.value[`writing-${paperData.value.writingVO.questionId}`] = 0
  }
}

// 分析题目 - 使用 SSE (Server-Sent Events) 的方式
const analyzeQuestionSSE = (questionId: string, questionType: string): void => {
  // 获取 token
  const token = localStorage.getItem('token') || ''

  // 使用 userId 构建请求 URL，如果 userId 不存在则不添加参数
  let requestUrl = `/api/ai/analysis?questionId=${questionId}&subject=english`
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

    const examName = '2024年全国硕士研究生招生考试英语一真题'
    const response = await getEnglishExam(examName)

    if (response.data) {
      paperData.value = response.data
      paperTitle.value = examName
      initializeAnswers()
      initializeAnalysisData() // 初始化AI解析数据

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
    matchingAnswers.value = new Array(paperData.value.matchingVO.matchingOptionInfos.length).fill(
      ''
    )
  }

  // 初始化翻译题答案
  if (paperData.value.translationVO) {
    translationAnswers.value = new Array(
      paperData.value.translationVO.translationOptionInfos.length
    ).fill('')
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
// 保存错题的方法
const saveWrongQuestions = async () => {
  // 假设用户ID已经获取到
  if (!userId) {
    console.error('用户ID未获取到，无法保存错题')
    return
  }

  const wrongQuestions: WrongQuestionRecord[] = []

  // 完形填空部分
  if (paperData.value.clozeVO) {
    paperData.value.clozeVO.clozeOptionInfos.forEach((item: any, index: any) => {
      if (item.correctAnswer !== clozeAnswers.value[index]) {
        wrongQuestions.push({
          questionId: paperData.value.clozeVO.questionId,
          itemId: item.itemId,
          userAnswer: clozeAnswers.value[index]
        })
      }
    })
  }

  // 阅读理解部分
  if (paperData.value.readingVOs) {
    paperData.value.readingVOs.forEach((reading: any, readingIndex: any) => {
      reading.readingOptionInfos.forEach((item: any, index: any) => {
        if (item.correctAnswer !== readingAnswers.value[readingIndex][index]) {
          wrongQuestions.push({
            questionId: reading.questionId,
            itemId: item.itemId,
            userAnswer: readingAnswers.value[readingIndex][index]
          })
        }
      })
    })
  }

  // 匹配题部分
  if (paperData.value.matchingVO) {
    paperData.value.matchingVO.matchingOptionInfos.forEach((item: any, index: any) => {
      if (item.correctAnswer !== matchingAnswers.value[index]) {
        wrongQuestions.push({
          questionId: paperData.value.matchingVO.questionId,
          itemId: item.itemId,
          userAnswer: matchingAnswers.value[index]
        })
      }
    })
  }

  // 翻译题部分
  if (paperData.value.translationVO) {
    paperData.value.translationVO.translationOptionInfos.forEach((item: any, index: any) => {
      if (item.correctAnswer !== translationAnswers.value[index]) {
        wrongQuestions.push({
          questionId: paperData.value.translationVO.questionId,
          itemId: item.itemId,
          userAnswer: translationAnswers.value[index]
        })
      }
    })
  }

  if (wrongQuestions.length === 0) {
    console.log('没有错题需要保存')
    return
  }

  const data: SaveWrongQuestionData = {
    userId: userId,
    type: route.query.type === 'isExamMode' ? '研究生考试' : '研究生练习',
    questionInfo: paperTitle.value,
    records: wrongQuestions
  }

  try {
    const response = await saveWrongQuestion(data)
    if (response && response.data) {
      message.success('错题保存成功')
    } else {
      console.error('保存错题失败：返回数据结构异常')
      message.error('保存错题失败，请重试')
    }
  } catch (error) {
    console.error('保存错题失败:', error)
    message.error('保存错题失败，请重试')
  }
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
  saveWrongQuestions()

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
