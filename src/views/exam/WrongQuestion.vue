<template>
  <div class="wrong-question-page">
    <div class="header-content">
      <h1 class="page-title">
        <el-icon><Tickets /></el-icon>
        错题记录
      </h1>
      <p class="page-description">您可以查看您之前答题的错题记录，以便提高答题正确性</p>
    </div>
    <div v-if="loading">
      <div class="loading-spinner"></div>
      <p>正在加载错题记录，请稍候...</p>
    </div>
    <div v-else>
      <div v-if="recordCount > 0">
        <select v-model="selectedType" @change="fetchWrongQuestionRecordCountByType">
          <option value="公务员">公务员</option>
          <option value="研究生">研究生</option>
        </select>
        <select
          v-model="selectedRecordInfo"
          @change="selectedRecordInfo && fetchWrongQuestionsByRecordId(selectedRecordInfo)"
          style="padding: 20px"
        >
          <option :value="null">{{ selectDisplayText }}</option>
          <option v-for="recordInfo in recordIds" :value="recordInfo">
            答题记录 {{ recordInfo.recordId }} - 类型: {{ recordInfo.type }}
          </option>
        </select>
        <div v-if="selectedRecordInfo">
          <!-- 错题卡片展示区域 -->
          <div
            class="wrong-question-card"
            v-show="
              currentQuestionIndex >= 0 && currentQuestionIndex < selectedWrongQuestions.length
            "
          >
            <span class="question-header">
              错题 {{ currentQuestionIndex + 1 }}
              <span class="question-info"
                >题目类型: {{ selectedWrongQuestions[currentQuestionIndex].questionType }}</span
              >
            </span>
            <div class="question-details">
              <div class="question-info">
                <span>题目编号: {{ selectedWrongQuestions[currentQuestionIndex].questionId }}</span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p
                class="question-content"
                v-html="formatText(selectedWrongQuestions[currentQuestionIndex].questionContent)"
              ></p>
              <div
                v-if="
                  selectedWrongQuestions[currentQuestionIndex].optionA ||
                  selectedWrongQuestions[currentQuestionIndex].optionB ||
                  selectedWrongQuestions[currentQuestionIndex].optionC ||
                  selectedWrongQuestions[currentQuestionIndex].optionD
                "
                class="option-section"
              >
                <span
                  class="option-item"
                  v-if="selectedWrongQuestions[currentQuestionIndex].optionA"
                >
                  <span class="option-prefix">选项A: </span>
                  <span v-html="selectedWrongQuestions[currentQuestionIndex].optionA"></span> </span
                ><br />
                <span
                  class="option-item"
                  v-if="selectedWrongQuestions[currentQuestionIndex].optionB"
                >
                  <span class="option-prefix">选项B: </span>
                  <span v-html="selectedWrongQuestions[currentQuestionIndex].optionB"></span> </span
                ><br />
                <span
                  class="option-item"
                  v-if="selectedWrongQuestions[currentQuestionIndex].optionC"
                >
                  <span class="option-prefix">选项C: </span>
                  <span v-html="selectedWrongQuestions[currentQuestionIndex].optionC"></span> </span
                ><br />
                <span
                  class="option-item"
                  v-if="selectedWrongQuestions[currentQuestionIndex].optionD"
                >
                  <span class="option-prefix">选项D: </span>
                  <span v-html="selectedWrongQuestions[currentQuestionIndex].optionD"></span> </span
                ><br />
              </div>
              <div
                v-if="
                  selectedWrongQuestions[currentQuestionIndex]?.questionType === '行测选择题' ||
                  '408单选题' ||
                  '408解答题' ||
                  '政治材料分析题' ||
                  '申论主观题' ||
                  '政治单选题' ||
                  '政治多选题' ||
                  '英语完形填空' ||
                  '英语阅读理解' ||
                  '英语序号匹配' ||
                  '英语翻译' ||
                  '英语作文' ||
                  '历史单选题' ||
                  '心理单选题'
                "
                class="answer-section"
              >
                <p
                  class="answer-container"
                  v-if="selectedWrongQuestions[currentQuestionIndex].correctAnswer"
                >
                  正确答案:
                  <span class="correct-answer">{{
                    selectedWrongQuestions[currentQuestionIndex].correctAnswer
                  }}</span>
                </p>
                <p
                  v-else-if="selectedWrongQuestions[currentQuestionIndex].referenceAnswer"
                  class="answer-container"
                >
                  参考答案:
                  <span class="reference-answer">{{
                    selectedWrongQuestions[currentQuestionIndex].referenceAnswer
                  }}</span>
                </p>
                <p class="answer-container">
                  你的答案:
                  <span class="user-answer">{{
                    selectedWrongQuestions[currentQuestionIndex].userAnswer
                  }}</span>
                </p>
              </div>
              <div
                v-if="selectedWrongQuestions[currentQuestionIndex].questions"
                class="sub-question-section"
              >
                <span
                  v-for="(subQuestion, subIndex) in selectedWrongQuestions[currentQuestionIndex]
                    .questions"
                  :key="subIndex"
                >
                  <div class="sub-question-info">
                    小题{{ subQuestion.itemId }} :
                    <span
                      v-html="
                        formatText(
                          subQuestion.itemContent,
                          selectedWrongQuestions[currentQuestionIndex].questionType
                        )
                      "
                    ></span>

                    <div class="option-section">
                      <span class="option-item" v-if="subQuestion.optionA">
                        <span class="option-prefix">选项A: </span>
                        <span v-html="subQuestion.optionA"></span>
                      </span>
                      <span class="option-item" v-if="subQuestion.optionB">
                        <span class="option-prefix">选项B: </span>
                        <span v-html="subQuestion.optionB"></span>
                      </span>
                      <span class="option-item" v-if="subQuestion.optionC">
                        <span class="option-prefix">选项C: </span>
                        <span v-html="subQuestion.optionC"></span>
                      </span>
                      <span class="option-item" v-if="subQuestion.optionD">
                        <span class="option-prefix">选项D: </span>
                        <span v-html="subQuestion.optionD"></span>
                      </span>
                    </div>
                  </div>

                  <br />
                  <div class="sub-question-answerblock">
                    <span class="sub-question-answer answer-container">
                      你的答案: <span v-html="subQuestion.userAnswer"></span>
                    </span>
                    <span class="sub-question-answer answer-container">
                      正确答案:<br />
                      <span v-html="formatText(subQuestion.correctAnswer)"></span>
                    </span>
                  </div>
                  <br />
                </span>
              </div>
            </div>
          </div>
          <!-- 题数选择区域 -->
          <div class="question-number-select">
            <button
              v-for="(_index, num) in selectedWrongQuestions.length"
              :key="num"
              :class="{ 'question-number-btn': true, active: currentQuestionIndex === num }"
              @click="showQuestion(num)"
            >
              {{ num + 1 }}
            </button>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <div class="empty-illustration">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="180" height="180">
            <path fill="#e2eef9" d="M128,128h256v256H128Z" />
            <path fill="#bdd3e7" d="M256,128V384H128V128Z" />
            <path fill="#fff" d="M384,128V384H256V128Z" />
            <path fill="#4c6291" d="M117.33,96H394.67a21.34,21.34,0,0,1,21.33,21.33V394.67A21.34,21.34,0,0,1,394.67,416H117.33A21.34,21.34,0,0,1,96,394.67V117.33A21.34,21.34,0,0,1,117.33,96Zm0,21.33V394.67H394.67V117.33Z" />
            <path fill="#3182ce" d="M373.33,64A21.34,21.34,0,0,1,394.67,85.33V96H117.33V85.33A21.34,21.34,0,0,1,138.67,64Z" />
            <path fill="#1a365d" d="M373.33,64H138.67a21.34,21.34,0,0,0-21.34,21.33V96h128V64Z" />
            <circle fill="#f88" cx="160" cy="80" r="10.67"/>
            <circle fill="#fc5" cx="202.67" cy="80" r="10.67"/>
            <circle fill="#3f4" cx="245.33" cy="80" r="10.67"/>
            <path fill="#4c6291" d="M320 192h-128a10.67 10.67 0 0 1 0-21.33h128a10.67 10.67 0 0 1 0 21.33zM298.67 234.67H213.33a10.67 10.67 0 0 1 0-21.34h85.34a10.67 10.67 0 0 1 0 21.34zM234.67 277.33h-42.67a10.67 10.67 0 0 1 0-21.33h42.67a10.67 10.67 0 0 1 0 21.33z" />
            <path fill="#4c6291" d="M341.33,277.33h-64a10.67,10.67,0,1,1,0-21.33h64a10.67,10.67,0,0,1,0,21.33Z" />
            <path fill="#3182ce" d="M298.67,320H213.33a10.67,10.67,0,0,1,0-21.33h85.34a10.67,10.67,0,0,1,0,21.33Z" />
          </svg>
        </div>
        <h2 class="empty-title">暂无错题记录</h2>
        <p class="empty-description">
          您目前还没有错题记录。完成更多练习题目后，系统将自动记录您的错题，帮助您巩固知识点，提高解题能力。
        </p>
        <div class="empty-actions">
          <button class="primary-button" @click="goToPractice">
            <span class="button-icon">📝</span>
            去做练习题
          </button>
          <button class="secondary-button" @click="refreshPage">
            <span class="button-icon">🔄</span>
            刷新页面
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getWrongQuestionRecordCount, getWrongQuestion } from '@/api/errorRecord'
import { getUser } from '@/api/user'
import { GetRecordData, Question } from '@/types/errorRecord'
import { useRouter } from 'vue-router'
// 定义获取错题的响应数据类型
interface WrongQuestion {
  questionType: string
  score: number
  isSensitive: number
  questionId: number
  questionContent: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: string
  referenceAnswer?: string
  userAnswer: string
  questions?: {
    itemId: number
    itemContent: string
    options?: { label: string; value: string }[]
    optionA: string
    optionB: string
    optionC: string
    optionD: string
    correctAnswer: string
    userAnswer: string
    itemScore?: number
  }[]
}
const router = useRouter()
const loading = ref(true)
const recordCount = ref(0)
const recordIds = ref<{ recordId: number; type: string }[]>([])
const selectedWrongQuestions = ref<WrongQuestion[]>([])
const currentQuestionIndex = ref(0)
const selectDisplayText = ref('请选择你要选择的试卷')
let userId = Number(localStorage.getItem('userId'))
const selectedType = ref<'公务员' | '研究生'>('公务员')
const selectedRecordInfo = ref<{ recordId: number; type: string } | null>(null)
const formatText = (text: string, questionType?: string) => {
  if (!text) {
    return '（注意查看参考答案~）'
  }
  let processedText = text
  processedText = processedText.replace(/\\n/g, '\n')
  processedText = processedText.replace(/\r\n/g, '<br>')
  processedText = processedText.replace(/\n/g, '<br>')

  // 根据题目类型决定是否截取前四位
  if (questionType === '申论主观题') {
    processedText = processedText.length > 4 ? processedText.slice(4) : processedText
  }

  return processedText
}
// 切换题目展示的函数
const showQuestion = (num: number) => {
  currentQuestionIndex.value = num
}
// 获取用户ID
const fetchUserId = async () => {
  try {
    const response = await getUser()
    if (response && response.data && response.data.id) {
      userId = response.data.id
    } else {
      console.error('获取用户信息失败：返回数据结构异常')
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}
// 根据选择的类型获取错题记录数
const fetchWrongQuestionRecordCountByType = async () => {
  if (!userId) {
    console.error('用户ID未获取到，无法获取错题记录数')
    return
  }
  const data: GetRecordData = { userId, type: selectedType.value }
  try {
    const response = await getWrongQuestionRecordCount(data)
    if (Array.isArray(response.data) && response.data.length > 0) {
      recordCount.value = response.data.length
      recordIds.value = response.data.map(item => {
        return {
          recordId: item.recordId || 0,
          type: item.type || '未知类型'
        }
      })
    } else {
      console.error('获取错题记录数接口返回数据结构异常或无记录')
      recordCount.value = 0
      recordIds.value = []
    }
  } catch (error) {
    console.error('获取错题记录数失败:', error)
    recordCount.value = 0
    recordIds.value = []
  } finally {
    loading.value = false
  }
}
// 根据recordId获取那次答题的错题
const fetchWrongQuestionsByRecordId = async (recordInfo: { recordId: number; type: string }) => {
  if (!userId) {
    console.error('用户ID未获取到，无法获取错题')
    return
  }
  const recordId = recordInfo.recordId
  const type = recordInfo.type
  const data: Question = { userId, type, record: recordId }
  try {
    const response = await getWrongQuestion(data)
    if (Array.isArray(response.data)) {
      const convertedResults: WrongQuestion[] = []
      response.data.forEach(questionData => {
        const questionType = questionData.questionType || ''
        const score = typeof questionData.score === 'number' ? questionData.score : 0
        const isSensitive =
          typeof questionData.isSensitive === 'number' ? questionData.isSensitive : 0
        const questionId = questionData.questionId || 0
        const questionContent = questionData.questionContent || ''
        const optionA = questionData.optionA || ''
        const optionB = questionData.optionB || ''
        const optionC = questionData.optionC || ''
        const optionD = questionData.optionD || ''
        const correctAnswer = questionData.correctAnswer || ''
        const referenceAnswer = questionData.referenceAnswer || ''
        const userAnswer = questionData.userAnswer || ''
        const questions = questionData.questions || []
        const processOption = (option: string) =>
          option.length > 2 ? option.slice(2).trim() : option
        const processedOptionA = processOption(optionA)
        const processedOptionB = processOption(optionB)
        const processedOptionC = processOption(optionC)
        const processedOptionD = processOption(optionD)
        // 根据题目类型进一步处理数据
        if (questionType === '主观题') {
          // 主观题可能不需要处理选项等字段，可根据实际情况调整
        } else {
          // 客观题确保选项、答案等字段处理正确
        }
        convertedResults.push({
          questionType,
          score,
          isSensitive,
          questionId,
          questionContent,
          optionA: processedOptionA,
          optionB: processedOptionB,
          optionC: processedOptionC,
          optionD: processedOptionD,
          correctAnswer,
          referenceAnswer,
          userAnswer,
          questions
        })
      })
      selectedWrongQuestions.value = convertedResults
    } else {
      console.error('获取特定答题记录错题时，接口返回数据结构异常')
      selectedWrongQuestions.value = []
    }
  } catch (error) {
    console.error('获取特定答题记录错题失败:', error)
    selectedWrongQuestions.value = []
  } finally {
    loading.value = false
  }
}
// 跳转到练习页面
const goToPractice = () => {
  router.push('/exam/civil-service')
}
// 刷新页面
const refreshPage = () => {
  fetchWrongQuestionRecordCountByType()
}
onMounted(async () => {
  try {
    await fetchUserId()
    await fetchWrongQuestionRecordCountByType()
    if (recordIds.value.length > 0) {
      const firstRecordInfo = recordIds.value[0]
      await fetchWrongQuestionsByRecordId(firstRecordInfo)
    } else {
      loading.value = false
    }
  } catch (error) {
    console.error('页面挂载时获取数据失败:', error)
    loading.value = false
  }
})
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}
ul {
  list-style: none;
}
.wrong-question-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
  background-color: #f4f4f4;
}

/* 页面标题样式 */
.header-content {
  max-width: 1400px;
  margin: 0 auto;
  margin-bottom: 30px;
  background: linear-gradient(to right, #1a365d, #3182ce);
  border-radius: 8px;
  padding: 24px 40px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center; /* 文字居中 */
}

.page-title {
  font-size: 32px;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: white;
}

.page-title .el-icon {
  font-size: 32px;
}

.page-description {
  font-size: 18px;
  margin: 0;
  opacity: 0.9;
  max-width: 800px;
  line-height: 1.6;
}

/* 错题卡片样式 */
.wrong-question-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #fff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.03);
}
/* 题目编号选择区域样式 */
.question-number-select {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}
.question-number-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 50%;
  background-color: #f9f9f9;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
  padding: 0;
  min-width: 30px;
  box-sizing: border-box;
}
.question-number-btn.active {
  background-color: #3182ce;
  color: white;
  border-color: #3182ce;
}
.wrong-question-page li {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #fff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.03);
}
/* 卡片内文本样式 */
.question-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 24px;
  margin-bottom: 16px;
  border-bottom: 2px solid #e4e7ed;
  padding-bottom: 8px;
}
.question-header > span {
  margin-bottom: 0;
}
.question-details {
  padding: 0 10px;
}
.question-info {
  font-size: 18px;
  color: #4c6291;
  margin-bottom: 12px;
  display: flex;
  font-weight: 600;
  justify-content: space-between;
}
.question-content {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 12px;
}
.option-section {
  margin-bottom: 16px;
}
.option-item {
  display: block;
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 2px;
}
.option-prefix {
  color: #555;
  font-weight: bold;
  margin-right: 8px;
}
.answer-section {
  margin-bottom: 16px;
}
.answer-container {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 12px;
}
.correct-answer {
  color: green;
  font-weight: bold;
}
.reference-answer {
  color: #666;
}
.user-answer {
  color: red;
  font-weight: bold;
}
.sub-question-section {
  margin-bottom: 16px;
}
.sub-question-title {
  font-size: 20px;
  margin-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 4px;
}
.sub-question-info {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 8px;
}
.sub-option-container {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 8px;
}
.sub-option-item {
  display: block;
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 4px;
}
.sub-question-answer {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 4px;
  background-color: rgb(237, 241, 244);
  padding: 15px;
}
/* 下拉框 */
select {
  border: 2px solid #3182ce;
  border-radius: 8px;
  background-color: white;
  color: #333;
  font-size: 16px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  padding: 12px 16px;
  cursor: pointer;
  transition: border-color 0.3s ease;
  width: 100%;
  margin-bottom: 16px;
  background-image: url('@/assets/images/exam_imgs/downIcon.svg');
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px 16px;
}
select:hover {
  border-color: #1a365d;
  box-shadow: 0 0 5px rgba(49, 130, 206, 0.3);
}
/* 主观题 */
.sub-question-info {
  border: 2px solid #1a365d;
  padding: 50px;
  border-radius: 20px;
}
.sub-question-answerblock {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
/* 无数据状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  text-align: center;
  margin-top: 20px;
  min-height: 400px;
  transition: all 0.3s ease;
}

.empty-state:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-3px);
}

.empty-illustration {
  margin-bottom: 24px;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.empty-title {
  font-size: 28px;
  color: #1a365d;
  margin-bottom: 12px;
  font-weight: 600;
}

.empty-description {
  font-size: 16px;
  color: #4a5568;
  max-width: 500px;
  line-height: 1.6;
  margin-bottom: 32px;
}

.empty-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.primary-button, .secondary-button {
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-button {
  background: linear-gradient(135deg, #3182ce, #1a365d);
  color: white;
  border: none;
  box-shadow: 0 4px 10px rgba(49, 130, 206, 0.3);
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(49, 130, 206, 0.4);
}

.secondary-button {
  background-color: white;
  color: #3182ce;
  border: 2px solid #3182ce;
}

.secondary-button:hover {
  background-color: #e6f0ff;
}

.button-icon {
  font-size: 18px;
}

/* 加载状态样式优化 */
.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(49, 130, 206, 0.2);
  border-radius: 50%;
  border-top-color: #3182ce;
  margin: 40px auto 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
