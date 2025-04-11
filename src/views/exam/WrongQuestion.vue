<template>
  <div class="wrong-question-page">
    <h2>错题页面</h2>
    <div v-if="loading">
      <p>正在加载错题记录，请稍候...</p>
    </div>
    <div v-else>
      <div v-if="recordCount > 0">
        <select
          v-model="selectedRecordId"
          @change="selectedRecordId && fetchWrongQuestionsByRecordId(selectedRecordId)"
          style="padding: 20px"
        >
          <option v-for="recordId in recordIds" :value="recordId">答题记录 {{ recordId }}</option>
        </select>
        <ul v-if="selectedRecordId">
          <li v-for="(question, index) in selectedWrongQuestions" :key="index">
            <h3>错题 {{ index + 1 }}</h3>
            <p>题目类型: {{ question.questionType }}</p>
            <p>题目编号: {{ question.questionId }}</p>
            <p v-html="question.questionContent"></p>
            <p v-if="question.optionA || question.optionB || question.optionC || question.optionD">
              选项A:<span v-if="question.optionA" v-html="question.optionA"></span><br />
              选项B:<span v-if="question.optionB" v-html="question.optionB"></span><br />
              选项C:<span v-if="question.optionC" v-html="question.optionC"></span><br />
              选项D:<span v-if="question.optionD" v-html="question.optionD"></span><br />
            </p>
            <p>正确答案: {{ question.correctAnswer }}</p>
            <p v-if="question.referenceAnswer">参考答案: {{ question.referenceAnswer }}</p>
            <p>你的答案: {{ question.userAnswer }}</p>
            <p v-if="question.questions && question.questions.length > 0">
              <span v-for="(subQuestion, subIndex) in question.questions" :key="subIndex">
                小题{{ subQuestion.itemId }} - 小题内容: {{ subQuestion.itemContent }}
                <br />小题选项:
                <span
                  v-for="(subOption, subOptionIndex) in subQuestion.options"
                  :key="subOptionIndex"
                >
                  选项{{ getOptionLetter(subOptionIndex) }}: {{ subOption }}
                </span>
                <br />小题正确答案: {{ subQuestion.correctAnswer }} <br />您的小题答案:
                {{ subQuestion.userAnswer }} <br />小题分数: {{ subQuestion.itemScore }}
              </span>
            </p>
          </li>
        </ul>
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
const selectedRecordId = ref<number | null>(null) // 存储选择的记录ID，初始为null
const selectedWrongQuestions = ref<WrongQuestion[]>([]) // 存储选择的那次记录中的错题数据

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
      console.log('ddd', response.data)
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
}
ul {
  list-style: none;
}
.wrong-question-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
}

.wrong-question-page li {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  background-color: #fff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.03);
}
</style>
