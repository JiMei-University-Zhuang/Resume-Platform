<template>
  <div class="exam-page">
    <div class="card-header">
      <h1 class="exam-title">考试开始</h1>
      <p class="exam-subtitle">本次考试科目：{{ subject }}，题目数量：{{ count }}</p>
    </div>
    <div v-if="questions?.length > 0">
      <template v-if="subject === '行测'">
        <div class="question-list">
          <div v-for="(question, index) in questions" :key="index" class="question-item">
            <div class="question-header">
              <span class="question-number">题目编号：{{ question.questionId }}</span>
              <span class="question-score">分值{{ question.score }}</span>
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
                <div class="correct-answer">
                  {{ question.correctAnswer }}
                </div>
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
          </div>
          <el-button type="primary" @click="submitExam">提交试卷</el-button>
        </div>
      </template>
      <template v-else>
        <div class="essay-question">
          <div class="question-title">
            <p>{{ questions[0]?.questionContent }}</p>
            <span class="question-score">分值{{ questions[0]?.score }}</span>
          </div>
          <div v-for="(question, index) in questions[0]?.expoundingOptionInfos || []" :key="index">
            <p>
              题目编号：{{ questions[0]?.questionId }} -
              {{ question.itemId }}
            </p>
            <p>
              题目内容：{{ question.itemContent }}
              <span class="question-score">分值&nbsp;{{ question.itemScore }}</span>
            </p>
            <textarea v-model="essayAnswers[index]" rows="10" cols="80"></textarea>
          </div>
          <el-button type="primary" @click="submitEssayExam">提交申论答案</el-button>
        </div>
      </template>
    </div>
    <div v-else>
      <p>正在加载题目，请稍候...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getCSPractice } from '@/api/exam'
import { ElMessageBox } from 'element-plus'
import passimg1 from '@/assets/images/exam_imgs/pass1.jpg'
import passimg2 from '@/assets/images/exam_imgs/pass2.png'
import failimg1 from '@/assets/images/exam_imgs/failpass1.png'
import failimg2 from '@/assets/images/exam_imgs/failpass2.png'

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
const subject = ref(route.query.subject as string)
const count = ref(parseInt(route.query.count as string, 10))
const questions = ref<Question[]>([])
const answers = ref<string[]>([])
const essayAnswers = ref<string[]>([])
const totalScore = ref<number>(0)
const showCorrectAnswers = ref<boolean>(false)

const fetchQuestions = async () => {
  try {
    const requestData = {
      subject: subject.value,
      count: count.value
    }
    const response = await getCSPractice(requestData)
    // 安全地处理响应数据
    const responseData = response?.data ? (response.data as unknown as Question[]) : []
    questions.value = responseData

    if (subject.value === '行测') {
      answers.value = new Array(responseData.length).fill('')
    } else if (responseData.length > 0 && responseData[0]?.expoundingOptionInfos) {
      essayAnswers.value = new Array(responseData[0].expoundingOptionInfos.length).fill('')
    }
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

const submitExam = () => {
  let correctCount = 0
  questions.value.forEach((question, index) => {
    if (answers.value[index] === question.correctAnswer) {
      correctCount++
    }
  })

  const accuracy = (correctCount / questions.value.length) * 100
  totalScore.value = questions.value.reduce(
    (sum, q, i) => (answers.value[i] === q.correctAnswer ? sum + q.score : sum),
    0
  )
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
  showCorrectAnswers.value = true
  // sessionStorage.removeItem('examAnswers')
  // sessionStorage.removeItem('examEssayAnswers')
}

const answerStatus = computed(() => {
  return questions.value.map((question, index) => {
    return answers.value[index] === question.correctAnswer ? 'correct' : 'incorrect'
  })
})

const submitEssayExam = () => {
  // 申论提交逻辑
  console.log('提交的申论答案：', essayAnswers.value)
}

onMounted(() => {
  fetchQuestions()
  // // 从 sessionStorage 中恢复 answers
  // const storedAnswers = sessionStorage.getItem('examAnswers')
  // if (storedAnswers) {
  //   answers.value = JSON.parse(storedAnswers)
  // }

  // // 从 sessionStorage 中恢复 essayAnswers
  // const storedEssayAnswers = sessionStorage.getItem('examEssayAnswers')
  // if (storedEssayAnswers) {
  //   essayAnswers.value = JSON.parse(storedEssayAnswers)
  // }
})

// // 监听 answers 变化并存储到 sessionStorage
// watch(answers, newAnswers => {
//   sessionStorage.setItem('examAnswers', JSON.stringify(newAnswers))
// })

// // 监听 essayAnswers 变化并存储到 sessionStorage
// watch(essayAnswers, newEssayAnswers => {
//   sessionStorage.setItem('examEssayAnswers', JSON.stringify(newEssayAnswers))
// })

// onBeforeUnmount(() => {
//   if (questions.value.length > 0 && !showCorrectAnswers.value) {
//     const confirmed = window.confirm('您还有未完成的练习，确定要离开吗？')
//     if (confirmed) {
//       sessionStorage.removeItem('examAnswers')
//       sessionStorage.removeItem('examEssayAnswers')
//     } else {
//       throw new Error('Navigation cancelled by user')
//     }
//   }
// })
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
  margin-bottom: 20px;
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
  padding: 3px 6px;
  width: 60px;
  text-align: center;
  margin-left: 20px;
  font-size: 14px;
}

.question-content {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 25px;
  color: #303133;
}
/* 答案显示处理 */
.correct-answer-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  padding: 5px 20px;
  line-height: 25px;
  background-color: #c2e8cb;
  border-radius: 15px;
}
.correct-answer-container.correct {
  background-color: #c2e8cb;
}

.correct-answer-container.incorrect {
  background-color: #fde2e2;
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
  padding: 12px 30px;
  font-size: 16px;
}
/* 消除element默认宽度限制 */
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
</style>
