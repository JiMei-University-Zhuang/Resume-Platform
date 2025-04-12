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
        <select
          v-model="selectedRecordId"
          @click="handleSelectClick"
          @change="selectedRecordId && fetchWrongQuestionsByRecordId(selectedRecordId)"
          style="padding: 20px"
        >
          <option :value="null">{{ selectDisplayText }}</option>
          <option v-for="recordId in recordIds" :value="recordId">答题记录 {{ recordId }}</option>
        </select>
        <div v-if="selectedRecordId">
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
                v-html="
                  `&ensp;&ensp;${selectedWrongQuestions[currentQuestionIndex].questionContent}`
                "
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
              <div class="answer-section">
                <p class="answer-container">
                  正确答案:
                  <span class="correct-answer">{{
                    selectedWrongQuestions[currentQuestionIndex].correctAnswer
                  }}</span>
                </p>
                <p
                  v-if="selectedWrongQuestions[currentQuestionIndex].referenceAnswer"
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
                <!-- <p class="sub-question-title">小题详情</p> -->
                <span
                  v-for="(subQuestion, subIndex) in selectedWrongQuestions[currentQuestionIndex]
                    .questions"
                  :key="subIndex"
                >
                  <span class="sub-question-info">
                    小题{{ subQuestion.itemId }} - 小题内容: {{ subQuestion.itemContent }} </span
                  ><br />
                  <span class="sub-option-container">小题选项:</span><br />
                  <span
                    v-for="(subOption, subOptionIndex) in subQuestion.options"
                    :key="subOptionIndex"
                  >
                    <span class="sub-option-item">
                      选项{{ getOptionLetter(subOptionIndex) }}: {{ subOption }}
                    </span> </span
                  ><br />
                  <span class="sub-question-answer">
                    小题正确答案: {{ subQuestion.correctAnswer }} </span
                  ><br />
                  <span class="sub-question-answer">
                    您的小题答案: {{ subQuestion.userAnswer }} </span
                  ><br />
                  <span class="sub-question-answer"> 小题分数: {{ subQuestion.itemScore }} </span
                  ><br />
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
      <p v-else>您目前没有错题记录。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getWrongQuestionRecordCount, getWrongQuestion } from '@/api/errorRecord'
import { getUser } from '@/api/user'
import { useRoute } from 'vue-router'

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
    options: string[]
    correctAnswer: string
    userAnswer: string
    itemScore: number
  }[]
}

const route = useRoute()
const loading = ref(true)
const recordCount = ref(0)
const recordIds = ref<number[]>([])
let userId: number
const selectedRecordId = ref<number | null>(null)
const selectedWrongQuestions = ref<WrongQuestion[]>([]) // 存储选择的那次记录中的错题数据
const currentQuestionIndex = ref(0) // 当前展示的题目索引
const selectDisplayText = ref('请选择你要选择的试卷')
// 切换题目展示的函数
const showQuestion = (num: number) => {
  currentQuestionIndex.value = num
}
// 获取用户 ID
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

// 获取错题记录数
const fetchWrongQuestionRecordCount = async () => {
  if (!userId) {
    console.error('用户 ID 未获取到，无法获取错题记录数')
    return
  }
  let type: '考试' | '练习'
  const routeType = route.query.type as string
  if (routeType === 'exam') {
    type = '考试'
  } else {
    type = '练习'
  }
  const data = { userId, type }
  try {
    const response = await getWrongQuestionRecordCount(data)
    if (Array.isArray(response.data)) {
      recordCount.value = response.data.length
      recordIds.value = response.data.map(item => {
        if (item.recordId !== undefined) {
          return item.recordId
        } else {
          console.error('获取错题记录数时，recordId未定义')
          return 0
        }
      })
    } else {
      console.error('获取错题记录数接口返回数据结构异常')
    }
  } catch (error) {
    console.error('获取错题记录数失败:', error)
  }
}

// 根据recordId获取那次答题的错题
const fetchWrongQuestionsByRecordId = async (recordId: number) => {
  if (!userId) {
    console.error('用户 ID 未获取到，无法获取错题')
    return
  }
  let type: '练习' | '考试'
  const routeType = route.query.type as string
  if (routeType === 'exam') {
    type = '考试'
  } else {
    type = '练习'
  }
  const data = { userId, type, recordId }
  try {
    const response = await getWrongQuestion(data)
    if (Array.isArray(response.data)) {
      const convertedResults: WrongQuestion[] = []
      response.data.forEach(questionData => {
        // 对每个字段进行必要的检查和转换
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
    }
  } catch (error) {
    console.error('获取特定答题记录错题失败:', error)
  } finally {
    // 数据获取完成，无论成功失败都更新loading状态
    loading.value = false
  }
}

// 辅助函数，将选项索引转换为字母
const getOptionLetter = (index: number): string => {
  return String.fromCharCode(65 + index)
}
// 监听下拉框是否被触碰，这里通过监听点击事件实现
const handleSelectClick = () => {
  if (recordIds.value.length > 0 && selectedRecordId.value === null) {
    selectedRecordId.value = recordIds.value[0]
    selectDisplayText.value = `答题记录 ${recordIds.value[0]}`
    fetchWrongQuestionsByRecordId(selectedRecordId.value)
  }
}
onMounted(async () => {
  try {
    await fetchUserId()
    await fetchWrongQuestionRecordCount()
    if (recordIds.value.length > 0) {
      selectedRecordId.value = recordIds.value[0]
      await fetchWrongQuestionsByRecordId(selectedRecordId.value)
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
</style>
