<template>
  <div class="exam-page">
    <div class="card-header">
      <h1 class="exam-title">{{ route.query.type === 'exam' ? '考试开始' : '练习开始' }}</h1>
      <p class="exam-subtitle">
        <span v-if="route.query.type === 'exam'">
          当前试卷：{{ route.query.examName || '未知试卷' }}，总分：{{ totalScore_pre }}分
        </span>
        <span v-else>
          本次练习科目：{{ subject }}，题目数量：{{ count }}，总分：{{ totalScore_pre }}分</span
        >
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
      <template v-if="subject === '行测'">
        <div class="question-list">
          <div v-for="(question, index) in questions" :key="index" class="question-item">
            <div class="question-header" style="display: flex; justify-content: space-between">
              <span class="question-number">题目编号：{{ question.questionId }}</span>
              <span class="question-score">分值&nbsp;{{ question.score }}</span>
            </div>
            <div class="question-content" v-html="formatText(question.questionContent)"></div>
            <el-radio-group
              v-model="answers[index]"
              class="option-group"
              :disabled="showCorrectAnswers"
            >
              <div class="options-container">
                <div class="option-item">
                  <el-radio label="A" class="radio-option">
                    <span class="option-text" v-html="formatText(question.optionA)"></span>
                  </el-radio>
                </div>
                <div class="option-item">
                  <el-radio label="B" class="radio-option">
                    <span class="option-text" v-html="formatText(question.optionB)"></span>
                  </el-radio>
                </div>
                <div class="option-item">
                  <el-radio label="C" class="radio-option">
                    <span class="option-text" v-html="formatText(question.optionC)"></span>
                  </el-radio>
                </div>
                <div class="option-item">
                  <el-radio label="D" class="radio-option">
                    <span class="option-text" v-html="formatText(question.optionD)"></span>
                  </el-radio>
                </div>
              </div>
            </el-radio-group>
            <div
              v-if="showCorrectAnswers"
              :class="answerStatus[index]"
              class="correct-answer-container"
            >
              <div>
                正确答案
                <div class="correct-answer">{{ question.correctAnswer }}</div>
              </div>
              <div class="user-answer">
                我的答案
                <div
                  :class="
                    answers[index] === question.correctAnswer ? 'user-correct' : 'user-incorrect'
                  "
                >
                  {{ answers[index] }}
                </div>
              </div>
            </div>
            <div v-if="showAnalysis[index]" class="essay-answer-container">
              <div>
                分析结果：
                <pre id="response-{{ index }}" class="analysis-result">{{
                  essayAnalysisResults[index]
                }}</pre>
              </div>
            </div>
            <div
              v-if="showCorrectAnswers && !showAnalysis[index]"
              class="ai-parse-button-container"
            >
              <button class="neon-ai-parse-button" @click="analyzeQuestion(index)">AI 解析</button>
              <div v-if="aiAnalysisStatus[index] === 500" class="ai-analysis-status-tooltip">
                提示：当前 AI 解析状态为 500，可能存在一些问题，请稍后再试。
              </div>
            </div>
          </div>
          <div class="button-group">
            <el-button type="primary" @click="handleSubmit" v-if="!showReference"
              >提交答案</el-button
            >
            <el-button type="success" @click="returnToHome" v-else>返回主页</el-button>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="essay-question">
          <div v-for="(question, questionIndex) in questions" :key="questionIndex">
            <div class="question-title" style="font-size: 17px">
              <span v-html="formatText(question.questionContent)"></span>
            </div>
            <div
              v-for="(subQuestion, subIndex) in question.expoundingOptionInfos || []"
              :key="subIndex"
            >
              <div class="question-header">
                <p>第{{ subQuestion.itemId }}小题</p>
                <span class="question-score">分值&nbsp;{{ subQuestion.itemScore }}</span>
              </div>
              <p>
                <span v-html="formatText(subQuestion.itemContent)"></span>
              </p>
              <textarea
                v-model="
                  essayAnswers[
                    questionIndex * (question.expoundingOptionInfos?.length || 1) + subIndex
                  ]
                "
                rows="10"
                cols="80"
                :disabled="showEssayAnswers"
              ></textarea>
              <div v-if="showEssayAnswers" class="essay-answer-container">
                <div>
                  参考答案：
                  <div><span v-html="formatText(subQuestion.correctAnswer)"></span></div>
                </div>
              </div>
            </div>
          </div>

          <el-button type="primary" @click="submitRealExam" v-if="!showReference"
            >提交答案</el-button
          >
          <el-button type="success" @click="returnToHome" v-else>返回主页</el-button>
        </div>
      </template>
    </div>
    <div v-else>
      <p>正在加载题目，请稍候...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCSPractice, getCSExam, saveScore, ScoresaveData } from '@/api/exam'
import { saveWrongQuestion } from '@/api/errorRecord'
import { SaveWrongQuestionData, WrongQuestionRecord } from '@/types/errorRecord'
import { getUser } from '@/api/user'
import { ElMessageBox } from 'element-plus'
import { message } from 'ant-design-vue'
import passimg1 from '@/assets/images/exam_imgs/pass1.jpg'
import passimg2 from '@/assets/images/exam_imgs/pass2.png'
import failimg1 from '@/assets/images/exam_imgs/failpass1.png'
import failimg2 from '@/assets/images/exam_imgs/failpass2.png'
import { useExamStore } from '@/stores/examStore'
import router from '@/router'

// 定义题目接口
interface Question {
  questionId: string
  questionContent: string
  score: number
  isSensitive: number
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: string
  expoundingOptionInfos?: Array<{
    itemId: string
    itemContent: string
    correctAnswer: string
    itemScore: number
  }>
}

const route = useRoute()
const examStore = useExamStore()
const showReference = ref(false)
const subject = ref(route.query.subject as string)
const count = ref(parseInt(route.query.count as string, 10))
const questions = ref<Question[]>([])
const answers = ref<string[]>([])
const essayAnswers = ref<string[]>([])
const totalScore = ref<number>(0) //答题后的得分
const totalScore_pre = ref<number>(0) //答题前的总分
const showCorrectAnswers = ref<boolean>(false)
const timeLeft = ref(7200)
const isExamInProgress = ref<boolean>(false)
const essayAnalysisResults = ref<string[]>([])
const showEssayAnswers = ref<boolean>(false)
const showAnalysis = ref<boolean[]>([])
const aiAnalysisStatus = ref<number[]>([])
let userId: number | null = null
const wrongQuestions: WrongQuestionRecord[] = []
const questionInfo = ref<string>('') // 保存成绩接口的 questionInfo

const fetchQuestions = async () => {
  try {
    const isRealExam = route.query.type === 'exam'
    if (isRealExam) {
      // 调用真题接口
      const response = await getCSExam({
        examName: route.query.examName as string
      })
      questions.value = response?.data ? (response.data as unknown as Question[]) : []
    } else {
      const requestData = {
        subject: subject.value,
        count: count.value
      }
      const response = await getCSPractice(requestData)
      questions.value = response?.data ? (response.data as unknown as Question[]) : []
    }
    //计算所有题目总分（答题前）
    totalScore_pre.value = questions.value.reduce((sum, question) => sum + question.score, 0)
  } catch (error) {
    console.error('获取题目失败：', error)
  }
}
const formatText = (text: string) => {
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

const handleSubmit = async () => {
  try {
    await ElMessageBox.confirm('确定要提交试卷吗？提交后不可修改！', '提交确认', {
      confirmButtonText: '确定提交',
      cancelButtonText: '取消',
      type: 'warning'
    })
    submitExam()
    showCorrectAnswers.value = true
    isExamInProgress.value = false
  } catch (error) {
    console.log('用户取消提交')
  }
  showReference.value = true
}
const submitExam = async () => {
  if (!userId) {
    console.error('用户 ID 未获取到，无法保存成绩')
    return
  }
  let correctCount = 0
  questions.value.forEach((question, index) => {
    if (answers.value[index] === question.correctAnswer) {
      correctCount++
    } else {
      wrongQuestions.push({
        questionId: parseInt(question.questionId, 10),
        itemId: null,
        userAnswer: answers.value[index] || ''
      })
    }
  })

  const accuracy = (correctCount / questions.value.length) * 100
  totalScore.value = questions.value.reduce(
    (sum, q, i) => (answers.value[i] === q.correctAnswer ? sum + q.score : sum),
    0
  )

  // 动态设置 questionInfo
  if (route.query.type === 'exam') {
    questionInfo.value = route.query.examName as string
  } else {
    questionInfo.value = subject.value === '行测' ? '行测选择题' : '申论主观题'
  }

  // 调用保存成绩接口
  const scoreData: ScoresaveData = {
    userId,
    userScore: totalScore.value,
    totalScore: totalScore_pre.value,
    type: route.query.type === 'exam' ? '公务员考试' : '公务员练习',
    questionInfo: questionInfo.value
  }
  console.log('scoreData:', scoreData.questionInfo)

  try {
    await saveScore(scoreData)
  } catch (error) {
    console.error('保存成绩失败:', error)
  }
  saveScoreAndWrongQuestions()

  //结果弹窗
  const isPass = accuracy >= 60
  const title = '本次专项练习成绩'
  const statusText = isPass ? '正确率过六十啦🎉，真棒！' : '继续加油，相信自己一定行'

  ElMessageBox({
    message: `
          <div style="text-align: center; padding: 25px 32px;">
              <h3 style="margin: 0 0 20px 0; color: #333; font-size: 20px">${title}</h3>

              <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 40px;padding:20px">
                  ${
                    isPass
                      ? `<img src="${passimg1}" style="width: 120px; margin-right: 30px"/>`
                      : `<img src="${failimg1}" style="width: 120px; margin-right: 30px"/>`
                  }

                  <!-- 圆形框容器 -->
                  <div style="position: relative">
                      <div style="
                          width: 100px;
                          height: 100px;
                          border: 3px solid #FF4757;
                          border-radius: 50%;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          font-size: 24px;
                          color: #FF4757;
                          background: white;
                          margin: 0 20px;
                      ">
                          ${accuracy.toFixed(1)}%
                      </div>
                      <p style="
                          margin: 10px 0 0;
                          color: #666;
                          font-size: 18px;
                          position: absolute;
                          width: 100%;
                          font-weight: bold;
                          text-align: center;
                      ">正确率</p>
                  </div>

                  ${
                    isPass
                      ? `<img src="${passimg2}" style="width: 120px; margin-left: 30px"/>`
                      : `<img src="${failimg2}" style="width: 120px; margin-left: 30px"/>`
                  }
              </div>

              <div style="background: #f8f8f8; padding: 15px; border-radius: 8px; margin-top: 20px">
                  <p style="margin: 5px 0; color: #666;font-size:18px">总分：<strong style="color: #333">${totalScore.value}</strong></p>
                  <p style="margin: 5px 0; color: #FF4757; font-weight: bold">${statusText}</p>
              </div>
          </div>
          `,
    dangerouslyUseHTMLString: true,
    confirmButtonText: '确定',
    customClass: 'result-dialog',
    customStyle: {
      width: 'auto',
      maxWidth: '90vw',
      padding: '0 20px 20px'
    }
  })
  isExamInProgress.value = false
}

const answerStatus = computed(() => {
  return questions.value.map((question, index) => {
    return answers.value[index] === question.correctAnswer ? 'correct' : 'incorrect'
  })
})
const analyzeQuestionSSE = (questionId: string, index: number): void => {
  // 获取 token
  const token = localStorage.getItem('token') || ''

  const requestUrl = `/api/ai/analysis?questionId=${questionId}`

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
              essayAnalysisResults.value[index] += data
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
      aiAnalysisStatus.value[index] = 500
      message.error('AI 解析请求失败: ' + error.message)
    })
}
const analyzeQuestion = (index: number) => {
  const questionId = questions.value[index].questionId
  showAnalysis.value[index] = true
  message.info('正在生成AI解析，请稍候...')
  analyzeQuestionSSE(questionId, index)
}

// const submitRealExam = async () => {
//   showEssayAnswers.value = true
//   isExamInProgress.value = false
//   if (!userId) {
//     console.error('用户 ID 未获取到，无法保存成绩')
//     return
//   }
//   // 调用保存成绩接口
//   const scoreData: ScoresaveData = {
//     userId,
//     userScore: totalScore.value,
//     totalScore: totalScore_pre.value,
//     type: route.query.type === 'exam' ? '公务员考试' : '公务员练习',
//     questionInfo: questionInfo.value
//   }

//   try {
//     await saveScore(scoreData)
//   } catch (error) {
//     console.error('保存成绩失败:', error)
//   }
//   saveScoreAndWrongQuestions()
//   showReference.value = true
// }
const submitRealExam = async () => {
  showEssayAnswers.value = true
  isExamInProgress.value = false
  if (!userId) {
    console.error('用户 ID 未获取到，无法保存成绩')
    return
  }

  questions.value.forEach((question, questionIndex) => {
    const subQuestionCount = question.expoundingOptionInfos?.length || 1
    if (question.expoundingOptionInfos) {
      // 处理申论题目
      question.expoundingOptionInfos.forEach((subQuestion, subIndex) => {
        const essayAnswerIndex = questionIndex * subQuestionCount + subIndex
        const userAnswer = essayAnswers.value[essayAnswerIndex] || ''

        wrongQuestions.push({
          questionId: parseInt(question.questionId, 10),
          itemId: parseInt(subQuestion.itemId, 10),
          userAnswer: userAnswer
        })
      })
    } else {
      // 处理行测题目
      // 这里不需要进行评分，只需要记录用户的答案和题目编号
      wrongQuestions.push({
        questionId: parseInt(question.questionId, 10),
        itemId: null,
        userAnswer: answers.value[questionIndex] || ''
      })
    }
  })

  // 动态设置 questionInfo
  if (route.query.type === 'exam') {
    questionInfo.value = route.query.examName as string
  } else {
    questionInfo.value = subject.value === '行测' ? '行测选择题' : '申论主观题'
  }

  // 调用保存成绩接口
  const scoreData: ScoresaveData = {
    userId,
    userScore: 0, // 申论题目没有评分，因此设置为 0
    totalScore: totalScore_pre.value,
    type: route.query.type === 'exam' ? '公务员考试' : '公务员练习',
    questionInfo: questionInfo.value
  }
  try {
    await saveScore(scoreData)
  } catch (error) {
    console.error('保存成绩失败:', error)
  }
  saveScoreAndWrongQuestions()

  // 结果弹窗
  const statusText = '申论题目暂不支持评分~'

  ElMessageBox({
    message: `
          <div style="text-align: center; padding: 25px 32px;">
              <div style="padding: 15px; border-radius: 8px; margin-top: 20px">
                  <p style="margin: 5px 0; color: #FF4757; font-weight: bold">${statusText}</p>
              </div>
          </div>
          `,
    dangerouslyUseHTMLString: true,
    confirmButtonText: '确定',
    customClass: 'result-dialog',
    customStyle: {
      width: 'auto',
      maxWidth: '90vw',
      padding: '0 20px 20px'
    }
  })
  isExamInProgress.value = false
  showReference.value = true
}

const saveScoreAndWrongQuestions = async () => {
  if (userId === null) {
    console.error('用户 ID 未获取到，无法保存错题')
    return
  }
  // 保存错题
  const wrongQuestionData: SaveWrongQuestionData = {
    userId: userId,
    type: route.query.type === 'exam' ? '公务员考试' : '公务员练习',
    questionInfo: questionInfo.value,
    records: wrongQuestions
  }
  try {
    await saveWrongQuestion(wrongQuestionData)
  } catch (error) {}
}
const returnToHome = () => {
  router.push('/exam')
}

onMounted(async () => {
  try {
    const response = await getUser()
    userId = Number(response.data.id)
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
  fetchQuestions()
  if (route.query.type === 'exam') {
    const timer = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        clearInterval(timer)
        submitExam()
      }
    }, 1000)
  }
  examStore.setExamStatus(true)

  // 初始化 questionInfo
  if (route.query.type === 'exam') {
    questionInfo.value = route.query.examName as string
  } else {
    questionInfo.value = subject.value === '行测' ? '行测选择题' : '申论主观题'
  }
})
onUnmounted(() => {
  examStore.setExamStatus(false)
  saveScoreAndWrongQuestions()
})
</script>

<style scoped>
.exam-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
}

.card-header {
  margin-bottom: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.exam-title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 12px;
  color: #303133;
}

.exam-subtitle {
  text-align: center;
  color: #606266;
  font-size: 16px;
}

.question-list {
  width: 100%;
  margin: 0 auto;
  padding: 20px 0;
}

.question-item {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 30px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.3s;
}

.question-item:hover {
  box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.09);
}

.question-header {
  margin: 20px 0;
  padding: 4px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 22px;
}

.question-number {
  color: #409eff;
  font-weight: 500;
  font-size: 16px;
}

.question-score {
  border: 1px rgb(240, 132, 132) solid;
  background-color: rgb(233, 166, 177);
  color: white;
  border-radius: 10px;
  padding: 5px 8px;
  font-size: 16px;
  white-space: nowrap; /* 防止文本换行 */
}

.question-content {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 25px;
  color: #303133;
}
/* 行测答案显示处理 */
.correct-answer-container {
  display: flex;
  gap: 20px;
  margin: 20px 0;
  padding: 5px 20px;
  line-height: 25px;
  background-color: #c2e8cb;
  border-radius: 15px;
}
.correct-answer-container.correct {
  background-color: #c2e8cb; /* 绿色背景 */
}

.correct-answer-container.incorrect {
  background-color: #fde2e2; /* 红色背景 */
}

.user-correct {
  color: #67c23a;
  font-weight: bold;
}

.user-incorrect {
  color: #f56c6c;
  font-weight: bold;
}

.correct-answer {
  color: #67c23a;
  text-align: center;
  font-weight: bold;
}
.user-answer > div {
  text-align: center;
}

/* 申论答案显示处理 */
.essay-answer-container > div {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background-color: #f9f9f9;
}
.essay-answer-container div:first-child {
  color: #303133;
}
.essay-answer-container div:nth-child(2) {
  color: #67c23a;
  font-weight: bold;
}
.essay-answer-container div:last-child {
  color: #f56c6c;
}

/* 添加弹窗样式 */
.result-dialog {
  text-align: center;
}
.result-dialog .el-message-box__status {
  font-size: 40px !important;
}
.result-dialog .el-message-box__message {
  font-size: 16px;
}

.option-group {
  width: 100%;
  margin-top: 10px;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

.option-item {
  background-color: #f9f9f9;
  border-radius: 6px;
  transition: background-color 0.2s;
  width: 100%;
}

.option-item:hover {
  background-color: #f0f7ff;
}

.radio-option {
  padding: 12px 15px;
  margin: 0;
  width: 100%;
  display: flex;
  align-items: center;
}

.option-text {
  color: #606266;
  white-space: normal;
  word-break: break-word;
  line-height: 1.6;
}

.el-radio {
  height: auto;
  margin-right: 0;
}

.el-radio.is-checked .option-text {
  color: #409eff;
}

.el-radio__input {
  align-self: flex-start;
  margin-top: 2px;
}

.essay-question {
  width: 100%;
  margin: 0 auto;
  padding: 20px 0;
}

.essay-question > div {
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);
}

.essay-question p {
  margin-bottom: 15px;
  line-height: 1.6;
}

.essay-question p:first-child {
  font-weight: bold;
  color: #409eff;
  margin-bottom: 20px;
}

.essay-question textarea {
  width: 100%;
  margin-top: 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 12px;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
}

.el-button {
  display: block;
  margin: 30px auto;
  padding: 20px 30px;
  font-size: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

.el-message-box {
  width: auto !important;
  max-width: 90vw;
  min-width: 500px;
}

.result-dialog .el-message-box__content {
  min-width: 500px;
  padding: 15px 25px;
}

/* 图片容器自适应 */
.result-dialog .image-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}

.real-exam-badge {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 1000;
}

.timer {
  font-size: 18px;
  color: #c0392b;
  font-weight: bold;
  padding: 8px 15px;
  border: 2px solid #c0392b;
  border-radius: 8px;
  background: #fff0f0;
  margin-top: 60px;
}

.ai-parse-button-container {
  display: block;
  margin-top: 10px;
  position: relative;
}
.ai-parse-button-container.el-button.ai-parse-button {
  display: block;
  width: auto;
  float: left;
  margin: 0 auto;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  background-color: #409eff;
  border-color: #409eff;
  transition: background-color 0.3s ease;
}
.ai-parse-button-container.el-button.ai-parse-button:hover {
  background-color: #66b1ff;
}
.analysis-result {
  border: 1px solid #e4e7ed;
  border-radius: 5px;
  background-color: #f9f9f9;
  padding: 10px;
  white-space: pre-wrap;
  margin-top: 5px;
}
/* AI 解释按钮样式 */
.neon-ai-parse-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 25px;
  color: white;
  font-weight: 600;
  font-size: 24px;
  border: none;
  border-radius: 20px;
  margin: 40px auto 20px;
  width: 200px;
  position: relative;
  z-index: 1;
  cursor: pointer;
  background: linear-gradient(215deg, #c332fb, #00dbde, #c332fb);
  background-size: 400%;
}
.neon-ai-parse-button:hover {
  animation: neon 8s linear infinite;
}
@keyframes neon {
  from {
    background-position: 0%;
  }
  to {
    background-position: 400%;
  }
}
.neon-ai-parse-button::before {
  content: '';
  position: absolute;
  inset: -5px;
  z-index: -1;
  background: linear-gradient(215deg, #c332fb, #00dbde, #c332fb);
  background-size: 400%;
  border-radius: 40px;
  /* filter: blur(10px); */
  opacity: 0;
}
.neon-ai-parse-button:hover::before {
  filter: blur(10px);
  opacity: 1;
  animation: neon 8s linear infinite;
}
</style>
