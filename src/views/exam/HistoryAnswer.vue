<template>
  <div class="exam-page">
    <div class="card-header">
      <h1 class="exam-title">{{ isExamMode ? '考试开始' : '练习开始' }}</h1>
      <p class="exam-subtitle">历史学试卷: {{ paperTitle }}</p>

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
                <span
                  v-if="aiAnalysisStatus[`choice-${question.questionId}`] === 500"
                  class="ai-analysis-status-tooltip"
                >
                  解析请求失败，已使用备用数据
                </span>
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
            二、多项选择题（每题{{ paperData.multiChoiceVOs[0].score }}分，共{{
              paperData.multiChoiceVOs.length * paperData.multiChoiceVOs[0].score
            }}分）
          </h2>
          <div class="question-list">
            <div
              v-for="(question, questionIndex) in paperData.multiChoiceVOs"
              :key="'multiChoice-' + question.questionId"
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
                  <div class="options-grid options-grid-cs">
                    <div
                      v-for="option in ['A', 'B', 'C', 'D']"
                      :key="option"
                      class="option-item option-item-cs"
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

        <!-- 简答题部分 -->
        <div
          v-if="paperData.shortAnswerVOs && paperData.shortAnswerVOs.length > 0"
          class="question-category"
        >
          <h2 class="category-title">
            三、简答题（每题{{ paperData.shortAnswerVOs[0].score }}分，共{{
              paperData.shortAnswerVOs.length * paperData.shortAnswerVOs[0].score
            }}分）
          </h2>
          <div class="question-list">
            <div
              v-for="(question, questionIndex) in paperData.shortAnswerVOs"
              :key="'shortAnswer-' + question.questionId"
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
                    v-model="shortAnswerAnswers[questionIndex]"
                    :rows="5"
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

        <!-- 论述题部分 -->
        <div v-if="paperData.essayVOs && paperData.essayVOs.length > 0" class="question-category">
          <h2 class="category-title">
            四、论述题（每题{{ paperData.essayVOs[0].score }}分，共{{
              paperData.essayVOs.length * paperData.essayVOs[0].score
            }}分）
          </h2>
          <div class="question-list">
            <div
              v-for="(question, questionIndex) in paperData.essayVOs"
              :key="'essay-' + question.questionId"
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
                    v-model="essayAnswers[questionIndex]"
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
import MarkdownIt from 'markdown-it'
import type { Options as MarkdownItOptions } from 'markdown-it'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/themes/prism.css'
import markdownItKatexGpt from 'markdown-it-katex-gpt'
import { getHistoryExam } from '@/api/exam' // 导入真实API函数
import { getUser } from '@/api/user' // 导入获取用户信息的API
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
// 添加一个请求状态标志，防止重复请求
const isRequestPending = ref(false)

// 答案相关数据
const singleChoiceAnswers = ref<string[]>([])
const multiChoiceAnswers = ref<string[][]>([])
const shortAnswerAnswers = ref<string[]>([])
const essayAnswers = ref<string[]>([])

// AI 解析相关数据
const showAnalysis = ref<{ [key: string]: boolean }>({})
const analysisResults = ref<{ [key: string]: string }>({})
const aiAnalysisStatus = ref<{ [key: string]: number }>({})
// 用于请求参数，API调用时使用
const userId = ref<number | null>(null)

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
  return md.render(text)
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

// 开始分析题目
const analyzeQuestionSSE = (questionId: string, questionType: string): void => {
  if (!userId.value) {
    message.warning('无法获取用户ID，AI解析可能无法正常工作')
  }

  // 构建请求URL，增加用户ID参数
  let requestUrl = `/api/ai/analysis?questionId=${questionId}&subject=history`
  if (userId.value) {
    requestUrl += `&userId=${userId.value}`
  }

  fetch(requestUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('无法获取响应正文')
      }

      // 处理流数据
      const processStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read()

            if (done) {
              message.success('AI解析完成')
              break
            }

            // 解码获取的数据
            const textDecoder = new TextDecoder()
            const text = textDecoder.decode(value)

            // 处理SSE消息
            const lines = text.split('\n')
            for (const line of lines) {
              if (line.startsWith('data:')) {
                const data = line.substring(5).trim()
                if (data === '[DONE]') {
                  message.success('AI解析完成')
                  break
                }

                // 累加结果
                analysisResults.value[`${questionType}-${questionId}`] += data
              }
            }
          }
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
      message.error('AI 解析请求失败，使用本地备用解析')

      // 如果API调用失败，使用本地备用数据
      analysisResults.value[`${questionType}-${questionId}`] = getRandomAnalysis()
    })
}

// 开始分析题目
const analyzeQuestion = (questionId: string, questionType: string) => {
  showAnalysis.value[`${questionType}-${questionId}`] = true
  analysisResults.value[`${questionType}-${questionId}`] = ''

  message.info('正在生成AI解析，请稍候...')

  // 尝试使用SSE API进行分析
  try {
    analyzeQuestionSSE(questionId, questionType)
  } catch (error) {
    console.error('AI解析失败，使用本地解析:', error)
    // 回退到本地解析
    setTimeout(() => {
      analysisResults.value[`${questionType}-${questionId}`] = getRandomAnalysis()
    }, 1000)
  }
}

// 加载试卷数据
const fetchPaper = async () => {
  // 如果已经有请求在进行中，则不重复请求
  if (isRequestPending.value) return

  isRequestPending.value = true
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

    // 使用真实API调用替换mock数据
    try {
      const examName = '2024年全国硕士研究生招生考试历史学真题'
      console.log('开始请求历史学试卷数据...')
      // 直接使用类型断言，避免TypeScript错误
      const response: { data: any } = (await getHistoryExam(examName)) as any

      if (response.data) {
        paperData.value = response.data
        paperTitle.value = examName
        initializeAnswers()
        initializeAnalysisData()

        message.success('试卷加载成功')
      } else {
        throw new Error('获取试卷数据失败')
      }
    } catch (error) {
      console.error('获取试卷失败：', error)
      message.error('获取试卷失败，正在使用备用数据')

      // 如果API调用失败，回退到使用mock数据
      paperData.value = getMockHistoryExamData()
      paperTitle.value = '2023年全国硕士研究生招生考试历史学专业基础真题'
      initializeAnswers()
      initializeAnalysisData()
    }

    clearInterval(loadingTimer)
    loadingPercentage.value = 100
    loading.value = false
  } catch (error) {
    console.error('获取试卷失败：', error)
    message.error('获取试卷失败，请重试')
    loading.value = false
  } finally {
    isRequestPending.value = false
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
    multiChoiceAnswers.value = new Array(paperData.value.multiChoiceVOs.length).fill([])
  }

  // 初始化简答题答案
  if (paperData.value.shortAnswerVOs) {
    shortAnswerAnswers.value = new Array(paperData.value.shortAnswerVOs.length).fill('')
  }

  // 初始化论述题答案
  if (paperData.value.essayVOs) {
    essayAnswers.value = new Array(paperData.value.essayVOs.length).fill('')
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

  // 统计简答题
  if (paperData.value.shortAnswerVOs) {
    answered += shortAnswerAnswers.value.filter(a => a.trim()).length
    total += paperData.value.shortAnswerVOs.length
  }

  // 统计论述题
  if (paperData.value.essayVOs) {
    answered += essayAnswers.value.filter(a => a.trim()).length
    total += paperData.value.essayVOs.length
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
  if (!userId.value) {
    console.error('用户ID未获取到，无法保存错题')
    return
  }

  const wrongQuestions: WrongQuestionRecord[] = []

  // 单选题部分
  if (paperData.value.choiceVOs) {
    paperData.value.choiceVOs.forEach((question: any, index: any) => {
      if (question.correctAnswer !== singleChoiceAnswers.value[index]) {
        wrongQuestions.push({
          questionId: question.questionId,
          userAnswer: singleChoiceAnswers.value[index]
        })
      }
    })
  }

  // 多选题部分
  if (paperData.value.multiChoiceVOs) {
    paperData.value.multiChoiceVOs.forEach((question: any, index: any) => {
      const userAnswer = multiChoiceAnswers.value[index].sort().join(',')
      if (question.correctAnswer !== userAnswer) {
        wrongQuestions.push({
          questionId: question.questionId,
          userAnswer: userAnswer
        })
      }
    })
  }

  // 简答题部分
  if (paperData.value.shortAnswerVOs) {
    paperData.value.shortAnswerVOs.forEach((question: any, index: any) => {
      if (
        question.referenceAnswer &&
        question.referenceAnswer !== shortAnswerAnswers.value[index]
      ) {
        wrongQuestions.push({
          questionId: question.questionId,
          userAnswer: shortAnswerAnswers.value[index]
        })
      }
    })
  }

  // 论述题部分
  if (paperData.value.essayVOs) {
    paperData.value.essayVOs.forEach((question: any, index: any) => {
      if (question.referenceAnswer && question.referenceAnswer !== essayAnswers.value[index]) {
        wrongQuestions.push({
          questionId: question.questionId,
          userAnswer: essayAnswers.value[index]
        })
      }
    })
  }

  if (wrongQuestions.length === 0) {
    console.log('没有错题需要保存')
    return
  }

  const data: SaveWrongQuestionData = {
    userId: userId.value,
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
  // 检查是否有未完成的题目
  const totalQuestions =
    (paperData.value.choiceVOs?.length || 0) +
    (paperData.value.multiChoiceVOs?.length || 0) +
    (paperData.value.shortAnswerVOs?.length || 0) +
    (paperData.value.essayVOs?.length || 0)

  const answeredQuestions =
    singleChoiceAnswers.value.filter(a => a).length +
    multiChoiceAnswers.value.filter(a => a.length > 0).length +
    shortAnswerAnswers.value.filter(a => a.trim()).length +
    essayAnswers.value.filter(a => a.trim()).length

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
  saveWrongQuestions()

  // 直接显示参考答案，不发送到服务器
  showReference.value = true
  message.success('答案已提交')
}

// 返回主页
const returnToHome = () => {
  router.push('/exam/postgraduate')
}

// Mock数据生成函数
const getMockHistoryExamData = () => {
  return {
    choiceVOs: [
      {
        questionId: '1001',
        questionContent: '下列关于中国古代文明起源的说法，错误的是：',
        optionA: '中国古代文明是世界上最早的文明之一',
        optionB: '黄河流域是中国文明的主要发源地之一',
        optionC: '中国古代文明与两河流域文明没有任何联系',
        optionD: '考古发现表明中国早期文明有多中心发展特点',
        correctAnswer: 'C',
        score: 3
      },
      {
        questionId: '1002',
        questionContent: '下列哪位人物不属于"百家争鸣"时期的代表人物？',
        optionA: '孔子',
        optionB: '老子',
        optionC: '司马迁',
        optionD: '墨子',
        correctAnswer: 'C',
        score: 3
      },
      {
        questionId: '1003',
        questionContent: '汉代"丝绸之路"的开通始于：',
        optionA: '汉武帝时期',
        optionB: '汉高祖时期',
        optionC: '汉文帝时期',
        optionD: '汉景帝时期',
        correctAnswer: 'A',
        score: 3
      },
      {
        questionId: '1004',
        questionContent: '科举制度正式确立于：',
        optionA: '汉朝',
        optionB: '唐朝',
        optionC: '隋朝',
        optionD: '宋朝',
        correctAnswer: 'C',
        score: 3
      },
      {
        questionId: '1005',
        questionContent: '五四运动的导火索是：',
        optionA: '袁世凯称帝',
        optionB: '巴黎和会上中国外交的失败',
        optionC: '北洋政府与日本签订"二十一条"',
        optionD: '新文化运动的开展',
        correctAnswer: 'B',
        score: 3
      }
    ],
    multiChoiceVOs: [
      {
        questionId: '2001',
        questionContent: '下列关于春秋战国时期的社会变革，正确的有：',
        optionA: '铁器的广泛使用',
        optionB: '私有制的确立',
        optionC: '郡县制的推行',
        optionD: '商品经济的初步发展',
        correctAnswer: 'ACD',
        score: 4
      },
      {
        questionId: '2002',
        questionContent: '唐宋八大家包括：',
        optionA: '韩愈',
        optionB: '柳宗元',
        optionC: '李白',
        optionD: '苏轼',
        correctAnswer: 'ABD',
        score: 4
      },
      {
        questionId: '2003',
        questionContent: '明清时期，西方传教士带入中国的知识包括：',
        optionA: '数学',
        optionB: '天文学',
        optionC: '印刷术',
        optionD: '医学',
        correctAnswer: 'ABD',
        score: 4
      }
    ],
    shortAnswerVOs: [
      {
        questionId: '3001',
        questionContent: '简述中国古代的"礼乐文明"及其特点。',
        referenceAnswer:
          '中国古代的礼乐文明是中华文明的重要组成部分，以儒家思想为核心。主要特点包括：\n1. 强调礼制秩序，构建等级社会结构\n2. 注重音乐教化，以乐化民\n3. 重视伦理道德，强调五伦关系\n4. 追求"礼乐合一"的社会理想\n5. 礼乐文明融入政治制度，成为治国理政的重要手段',
        score: 10
      },
      {
        questionId: '3002',
        questionContent: '简述辛亥革命的历史意义。',
        referenceAnswer:
          '辛亥革命的历史意义：\n1. 推翻了清王朝的统治，结束了中国两千多年的封建君主专制制度\n2. 建立了中国历史上第一个资产阶级共和政府\n3. 传播了民主共和理念，促进了民主思想的发展\n4. 极大推动了中国社会变革\n5. 促进了社会风气和民众思想的转变\n6. 为中国近代化进程奠定了重要基础',
        score: 10
      }
    ],
    essayVOs: [
      {
        questionId: '4001',
        questionContent: '论述改革开放以来中国社会的重大变迁及其历史意义。',
        referenceAnswer:
          '改革开放以来中国社会的重大变迁及其历史意义\n\n一、改革开放以来中国社会的重大变迁\n\n1. 经济体制变革：从计划经济体制向社会主义市场经济体制转变\n- 农村家庭联产承包责任制的推行\n- 国有企业改革\n- 市场经济体制的确立和完善\n- 对外开放格局的形成和发展\n\n2. 社会结构转型\n- 城镇化进程加速，农村人口向城市转移\n- 社会阶层分化与新社会阶层出现\n- 人民生活水平显著提高，从温饱到全面小康\n\n3. 政治体制改革\n- 法治建设逐步推进\n- 民主政治制度的发展\n- 政府职能转变和行政体制改革\n\n4. 文化与思想观念变化\n- 文化多元化发展\n- 思想观念现代化\n- 教育普及和科技进步\n\n二、历史意义\n\n1. 实现了中国从贫困落后到繁荣发展的历史性转变\n2. 探索出一条中国特色社会主义发展道路\n3. 增强了中国国际地位和影响力\n4. 为中华民族伟大复兴奠定了坚实基础\n5. 对世界发展格局产生深远影响\n\n三、启示\n\n1. 坚持改革开放是中国发展的关键所在\n2. 发展必须立足中国国情和历史文化传统\n3. 经济建设与社会发展需要统筹协调\n4. 坚持以人民为中心的发展思想',
        score: 20
      }
    ]
  }
}

// 生成随机的AI解析内容
const getRandomAnalysis = () => {
  const analyses = [
    `# 题目解析\n\n## 考点映射\n此题主要考察中国古代文明与其他文明的关系。中国古代文明虽然有其独特性，但与其他文明存在交流互鉴的关系。\n\n## 选项分析\nA选项：正确，中国古代文明是世界上最早的文明之一，与两河流域文明、埃及文明、印度文明并称为世界四大文明古国。\n\nB选项：正确，黄河流域是中国文明的主要发源地之一，黄河流域的仰韶文化、龙山文化等都是中国早期文明的重要组成部分。\n\nC选项：错误，考古证据表明，中国古代文明与两河流域文明有着多方面的联系和交流，如西亚地区的小麦、青铜技术等传入中国，促进了中国文明的发展。丝绸之路的开通更是加强了东西方文明间的交流。\n\nD选项：正确，考古发现表明，中国早期文明呈现多中心发展的特点，长江流域的良渚文化、四川三星堆文化等都是中国古代文明的重要组成部分。\n\n## 解题技巧\n此类题目需要掌握中国古代文明的基本特点及其与世界其他文明的关系，理解文明交流互鉴的重要性。`,

    `# 题目解析\n\n## 考点映射\n本题考察春秋战国时期的历史人物，重点是对"百家争鸣"时期代表人物的识别。\n\n## 选项分析\nA选项：孔子(约前551年-前479年)，春秋末期思想家、教育家，儒家学派创始人，是"百家争鸣"时期的代表人物。\n\nB选项：老子，春秋末期思想家，道家学派创始人，著有《道德经》，是"百家争鸣"时期的代表人物。\n\nC选项：司马迁(约前145年-前87年)，西汉史学家，《史记》作者，与"百家争鸣"时期(春秋战国)不同时代，属于汉代人物。\n\nD选项：墨子(约前468年-前376年)，战国初期思想家，墨家学派创始人，是"百家争鸣"时期的代表人物。\n\n## 解题技巧\n解答此类题目需要掌握中国不同历史时期的代表性人物及其主要贡献，注意人物的生活年代和所属时期。"百家争鸣"主要发生在春秋战国时期，而司马迁则是西汉时期的人物，故选C。`,

    `# 题目解析\n\n## 考点映射\n本题考察中国古代对外交流的重要事件——丝绸之路的开通时间及相关历史背景。\n\n## 选项分析\nA选项：正确。丝绸之路的开通始于汉武帝时期，具体是公元前138年，汉武帝派遣张骞出使西域，开启了中国与西域各国的正式交往。\n\nB选项：错误。汉高祖刘邦(前202年-前195年在位)时期，汉朝刚刚建立，主要致力于巩固统治和恢复经济，尚未开展大规模的西域交往。\n\nC选项：错误。汉文帝刘恒(前180年-前157年在位)时期实行"文景之治"，以休养生息为主，未有开拓西域的政策。\n\nD选项：错误。汉景帝刘启(前157年-前141年在位)时期延续了文帝的政策，未开展西域交往。\n\n## 解题技巧\n解答此类题目需要掌握中国古代重大历史事件的时间节点及其所处的历史背景。丝绸之路的开通是汉武帝时期对外交往政策的重要组成部分，与打通西域、派遣张骞出使西域等事件相关联。`
  ]

  return analyses[Math.floor(Math.random() * analyses.length)]
}

onMounted(async () => {
  // 获取用户信息（为了AI解析功能）
  try {
    const response = await getUser()
    userId.value = Number(response.data.id)
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

.option-item-cs .el-radio,
.option-item-cs .el-checkbox {
  width: 100%;
  margin-right: 0;
  display: flex;
  align-items: center;
}

.option-item-cs :deep(.el-radio__label),
.option-item-cs :deep(.el-checkbox__label) {
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

/* 历史学试卷特殊样式 */
.history-highlight {
  background-color: #fffbe6;
  border-left: 3px solid #faad14;
  padding: 2px 8px;
  margin: 0 2px;
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
