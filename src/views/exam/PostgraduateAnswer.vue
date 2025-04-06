<template>
  <div class="exam-page">
    <div class="card-header">
      <h1 class="exam-title">{{ route.query.type === 'exam' ? '考试开始' : '练习开始' }}</h1>
      <p class="exam-subtitle">
        <span v-if="route.query.type === 'exam'">
          当前试卷：{{ route.query.examName || '未知试卷' }}
        </span>
        <span v-else>
          本次练习科目：{{ subject }}，题型：{{ questionType }}，题目数量：{{ count }}
        </span>
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
      <div class="progress-container">
        <div class="progress-info">
          <span>答题进度</span>
          <span>{{ calculateProgress }}%</span>
        </div>
        <el-progress :percentage="calculateProgress" :color="progressColor" />
      </div>
      <div class="material-analysis-question">
        <div
          v-for="(question, index) in questions"
          :key="index"
          class="question-container"
          :id="`question-${index}`"
        >
          <div class="question-header">
            <span class="question-number">题目编号：{{ question.questionId }}</span>
            <span class="question-score">分值&nbsp;{{ question.score }}</span>
          </div>

          <div class="question-content" v-html="formatText(question.questionContent)"></div>

          <!-- 序号匹配题 -->
          <div v-if="isMatchingQuestion(question)" class="matching-section">
            <div class="matching-container">
              <div class="matching-passage">
                <div
                  v-for="(paragraph, pIdx) in extractParagraphs(question.questionContent)"
                  :key="pIdx"
                  class="paragraph-container"
                >
                  {{ paragraph }}
                </div>
              </div>
              <div class="matching-options">
                <div class="options-header">备选答案</div>
                <div class="options-list">
                  <div
                    v-for="opt in ['A', 'B', 'C', 'D', 'E', 'F', 'G']"
                    :key="opt"
                    class="option-item"
                  >
                    <div class="option-label">{{ opt }}</div>
                    <div class="option-content">
                      {{ extractOptionContent(question.questionContent, opt) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="matching-items">
              <div
                v-for="(option, optIdx) in question.matchingOptionInfos"
                :key="option.itemId"
                class="matching-item"
              >
                <div class="matching-item-header">
                  <div class="item-number">{{ option.itemId }}</div>
                  <div class="item-content">
                    {{ extractItemContent(question.questionContent, option.itemId) }}
                  </div>
                </div>
                <div class="matching-answers">
                  <div
                    v-for="opt in ['A', 'B', 'C', 'D', 'E', 'F', 'G']"
                    :key="opt"
                    class="answer-bubble"
                    :class="{
                      selected: userMatchingAnswers[index][optIdx] === opt,
                      correct: showReference && opt === option.correctAnswer,
                      incorrect:
                        showReference &&
                        userMatchingAnswers[index][optIdx] === opt &&
                        opt !== option.correctAnswer
                    }"
                    @click="selectMatchingAnswer(index, optIdx, opt)"
                  >
                    {{ opt }}
                    <el-icon
                      v-if="showReference && opt === option.correctAnswer"
                      class="correct-icon"
                      ><Check
                    /></el-icon>
                  </div>
                </div>
                <div
                  v-if="showReference"
                  class="option-answer"
                  :class="{
                    'correct-answer': userMatchingAnswers[index][optIdx] === option.correctAnswer,
                    'wrong-answer':
                      userMatchingAnswers[index][optIdx] !== option.correctAnswer &&
                      userMatchingAnswers[index][optIdx]
                  }"
                >
                  <template v-if="userMatchingAnswers[index][optIdx] === option.correctAnswer">
                    <el-icon><Check /></el-icon> 回答正确
                  </template>
                  <template v-else-if="userMatchingAnswers[index][optIdx]">
                    <el-icon><Close /></el-icon> 回答错误，正确答案: {{ option.correctAnswer }}
                  </template>
                  <template v-else>
                    <el-icon><InfoFilled /></el-icon> 未作答，正确答案: {{ option.correctAnswer }}
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- 翻译题 -->
          <div v-else-if="isTranslationQuestion(question)" class="translation-section">
            <div class="translation-container">
              <div
                v-for="(option, optIdx) in question.translationOptionInfos"
                :key="option.itemId"
                class="translation-item"
              >
                <div class="translation-item-header">
                  <div class="item-number">{{ option.itemId }}</div>
                  <div class="highlighted-text">
                    {{ extractTranslationText(question.questionContent, option.itemId) }}
                  </div>
                </div>
                <div class="translation-input">
                  <el-input
                    v-model="userTranslationAnswers[index][optIdx]"
                    type="textarea"
                    :rows="3"
                    :placeholder="'请在此输入翻译...' + option.itemId"
                    :disabled="showReference"
                  ></el-input>
                </div>
                <div v-if="showReference" class="translation-reference">
                  <div class="reference-header">
                    <el-icon><DocumentChecked /></el-icon>
                    <span>参考译文</span>
                  </div>
                  <div class="reference-content">{{ option.correctAnswer }}</div>
                  <div
                    class="translation-feedback"
                    :class="
                      getTranslationFeedbackClass(
                        userTranslationAnswers[index][optIdx],
                        option.correctAnswer
                      )
                    "
                  >
                    <template v-if="hasTranslationInput(userTranslationAnswers[index][optIdx])">
                      <div class="feedback-icon">
                        <el-icon
                          v-if="
                            isTranslationGood(
                              userTranslationAnswers[index][optIdx],
                              option.correctAnswer
                            )
                          "
                          ><Check
                        /></el-icon>
                        <el-icon v-else><Warning /></el-icon>
                      </div>
                      <div class="feedback-text">
                        {{
                          isTranslationGood(
                            userTranslationAnswers[index][optIdx],
                            option.correctAnswer
                          )
                            ? '译文符合要点！'
                            : '与参考答案有差异，请对比参考。'
                        }}
                      </div>
                    </template>
                    <template v-else>
                      <div class="feedback-icon">
                        <el-icon><InfoFilled /></el-icon>
                      </div>
                      <div class="feedback-text">未作答</div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 完型填空题 -->
          <div v-else-if="isClozeQuestion(question)" class="cloze-section">
            <div
              v-for="(option, optIdx) in question.clozeOptionInfos"
              :key="option.itemId"
              class="cloze-item"
            >
              <div class="cloze-item-header-row">
                <span class="cloze-item-number">{{ option.itemId }}.</span>
                <div class="option-group cloze-options">
                  <el-radio-group
                    v-model="userClozeAnswers[index][optIdx]"
                    :disabled="showReference"
                  >
                    <el-radio
                      v-for="opt in ['A', 'B', 'C', 'D']"
                      :key="opt"
                      :label="opt"
                      :class="{
                        'correct-option': showReference && opt === option.correctAnswer,
                        'wrong-option':
                          showReference &&
                          userClozeAnswers[index][optIdx] === opt &&
                          opt !== option.correctAnswer
                      }"
                    >
                      {{
                        opt === 'A'
                          ? option.optionA
                          : opt === 'B'
                            ? option.optionB
                            : opt === 'C'
                              ? option.optionC
                              : option.optionD
                      }}
                      <el-icon
                        v-if="
                          showReference &&
                          userClozeAnswers[index][optIdx] === opt &&
                          opt !== option.correctAnswer
                        "
                        class="wrong-icon"
                        ><Close
                      /></el-icon>
                    </el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div
                v-if="showReference"
                class="option-answer"
                :class="{
                  'correct-answer': userClozeAnswers[index][optIdx] === option.correctAnswer,
                  'wrong-answer':
                    userClozeAnswers[index][optIdx] !== option.correctAnswer &&
                    userClozeAnswers[index][optIdx]
                }"
              >
                <template v-if="userClozeAnswers[index][optIdx] === option.correctAnswer">
                  <el-icon><Check /></el-icon> 回答正确
                </template>
                <template v-else-if="userClozeAnswers[index][optIdx]">
                  <el-icon><Close /></el-icon> 回答错误，正确答案: {{ option.correctAnswer }}
                </template>
                <template v-else>
                  <el-icon><InfoFilled /></el-icon> 未作答，正确答案: {{ option.correctAnswer }}
                </template>
              </div>
            </div>
          </div>

          <!-- 阅读理解题 -->
          <div v-else-if="isReadingQuestion(question)" class="reading-section">
            <div
              v-for="(option, optIdx) in question.readingOptionInfos"
              :key="option.itemId"
              class="reading-item"
            >
              <div class="reading-item-header-row">
                <span class="reading-item-number">{{ option.itemId }}.</span>
                <div class="reading-item-content-wrapper">
                  <div class="reading-item-content">{{ option.itemContent }}</div>
                  <div class="option-group reading-options">
                    <el-radio-group
                      v-model="userReadingAnswers[index][optIdx]"
                      :disabled="showReference"
                    >
                      <el-radio
                        v-for="opt in ['A', 'B', 'C', 'D']"
                        :key="opt"
                        :label="opt"
                        :class="{
                          'correct-option': showReference && opt === option.correctAnswer,
                          'wrong-option':
                            showReference &&
                            userReadingAnswers[index][optIdx] === opt &&
                            opt !== option.correctAnswer
                        }"
                      >
                        {{
                          opt === 'A'
                            ? option.optionA
                            : opt === 'B'
                              ? option.optionB
                              : opt === 'C'
                                ? option.optionC
                                : option.optionD
                        }}
                        <el-icon
                          v-if="
                            showReference &&
                            userReadingAnswers[index][optIdx] === opt &&
                            opt !== option.correctAnswer
                          "
                          class="wrong-icon"
                          ><Close
                        /></el-icon>
                      </el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </div>
              <div
                v-if="showReference"
                class="option-answer"
                :class="{
                  'correct-answer': userReadingAnswers[index][optIdx] === option.correctAnswer,
                  'wrong-answer':
                    userReadingAnswers[index][optIdx] !== option.correctAnswer &&
                    userReadingAnswers[index][optIdx]
                }"
              >
                <template v-if="userReadingAnswers[index][optIdx] === option.correctAnswer">
                  <el-icon><Check /></el-icon> 回答正确
                </template>
                <template v-else-if="userReadingAnswers[index][optIdx]">
                  <el-icon><Close /></el-icon> 回答错误，正确答案: {{ option.correctAnswer }}
                </template>
                <template v-else>
                  <el-icon><InfoFilled /></el-icon> 未作答，正确答案: {{ option.correctAnswer }}
                </template>
              </div>
            </div>
          </div>

          <!-- 政治单选题 -->
          <div v-else-if="isPoliticsSingleChoice(question)" class="politics-single-choice-section">
            <div class="politics-choice-item">
              <div class="politics-item-header-row">
                <span class="politics-item-number">{{ question.questionId }}.</span>
                <div class="politics-item-content-wrapper">
                  <div class="option-group politics-options">
                    <el-radio-group
                      v-model="userPoliticsSingleAnswers[index]"
                      :disabled="showReference"
                    >
                      <el-radio
                        v-for="opt in ['A', 'B', 'C', 'D']"
                        :key="opt"
                        :label="opt"
                        :class="{
                          'correct-option': showReference && opt === question.correctAnswer,
                          'wrong-option':
                            showReference &&
                            userPoliticsSingleAnswers[index] === opt &&
                            opt !== question.correctAnswer
                        }"
                      >
                        {{
                          opt === 'A'
                            ? question.optionA || ''
                            : opt === 'B'
                              ? question.optionB || ''
                              : opt === 'C'
                                ? question.optionC || ''
                                : question.optionD || ''
                        }}
                        <el-icon
                          v-if="
                            showReference &&
                            userPoliticsSingleAnswers[index] === opt &&
                            opt !== question.correctAnswer
                          "
                          class="wrong-icon"
                          ><Close
                        /></el-icon>
                      </el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </div>
              <div
                v-if="showReference"
                class="option-answer"
                :class="{
                  'correct-answer': userPoliticsSingleAnswers[index] === question.correctAnswer,
                  'wrong-answer':
                    userPoliticsSingleAnswers[index] !== question.correctAnswer &&
                    userPoliticsSingleAnswers[index]
                }"
              >
                <template v-if="userPoliticsSingleAnswers[index] === question.correctAnswer">
                  <el-icon><Check /></el-icon> 回答正确
                </template>
                <template v-else-if="userPoliticsSingleAnswers[index]">
                  <el-icon><Close /></el-icon> 回答错误，正确答案: {{ question.correctAnswer || '未知' }}
                </template>
                <template v-else>
                  <el-icon><InfoFilled /></el-icon> 未作答，正确答案: {{ question.correctAnswer || '未知' }}
                </template>
              </div>
            </div>
          </div>

          <!-- 政治多选题 -->
          <div v-else-if="isPoliticsMultipleChoice(question)" class="politics-multiple-choice-section">
            <div class="politics-choice-item">
              <div class="politics-item-header-row">
                <span class="politics-item-number">{{ question.questionId }}.</span>
                <div class="politics-item-content-wrapper">
                  <div class="option-group politics-options">
                    <el-checkbox-group
                      v-model="userPoliticsMultiAnswers[index]"
                      :disabled="showReference"
                    >
                      <el-checkbox
                        v-for="opt in ['A', 'B', 'C', 'D']"
                        :key="opt"
                        :label="opt"
                        :class="{
                          'correct-option': showReference && question.correctAnswer && question.correctAnswer.includes(opt),
                          'wrong-option':
                            showReference &&
                            userPoliticsMultiAnswers[index].includes(opt) &&
                            question.correctAnswer && !question.correctAnswer.includes(opt)
                        }"
                      >
                        {{
                          opt === 'A'
                            ? question.optionA || ''
                            : opt === 'B'
                              ? question.optionB || ''
                              : opt === 'C'
                                ? question.optionC || ''
                                : question.optionD || ''
                        }}
                        <el-icon
                          v-if="
                            showReference &&
                            userPoliticsMultiAnswers[index].includes(opt) &&
                            question.correctAnswer && !question.correctAnswer.includes(opt)
                          "
                          class="wrong-icon"
                          ><Close
                        /></el-icon>
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
              </div>
              <div
                v-if="showReference"
                class="option-answer"
                :class="{
                  'correct-answer': isMultipleChoiceCorrect(userPoliticsMultiAnswers[index], question.correctAnswer),
                  'wrong-answer': !isMultipleChoiceCorrect(userPoliticsMultiAnswers[index], question.correctAnswer) && userPoliticsMultiAnswers[index].length > 0
                }"
              >
                <template v-if="isMultipleChoiceCorrect(userPoliticsMultiAnswers[index], question.correctAnswer)">
                  <el-icon><Check /></el-icon> 回答正确
                </template>
                <template v-else-if="userPoliticsMultiAnswers[index].length > 0">
                  <el-icon><Close /></el-icon> 回答错误，正确答案: {{ question.correctAnswer || '未知' }}
                </template>
                <template v-else>
                  <el-icon><InfoFilled /></el-icon> 未作答，正确答案: {{ question.correctAnswer || '未知' }}
                </template>
              </div>
            </div>
          </div>

          <!-- 常规题目（如材料分析题） -->
          <div v-else class="answer-section">
            <h3>我的解答</h3>
            <el-input
              v-model="userAnswers[index]"
              type="textarea"
              :rows="10"
              placeholder="请在这里输入您的解答..."
              :disabled="showReference"
            ></el-input>
          </div>

          <div
            v-if="
              showReference &&
              !isClozeQuestion(question) &&
              !isReadingQuestion(question) &&
              !isMatchingQuestion(question) &&
              !isTranslationQuestion(question) &&
              !isPoliticsSingleChoice(question) &&
              !isPoliticsMultipleChoice(question)
            "
            class="reference-answer"
          >
            <h3>参考答案</h3>
            <div v-html="formatText(question.referenceAnswer)"></div>
          </div>
        </div>

        <div class="button-group">
          <el-button type="primary" @click="submitAnswers" v-if="!showReference"
            >提交答案</el-button
          >
          <el-button type="success" @click="returnToHome" v-else>返回主页</el-button>
        </div>
      </div>
    </div>
    <div v-else class="loading-container">
      <p>正在加载题目，请稍候...</p>
      <el-progress :percentage="loadingPercentage" :indeterminate="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getGSPractice } from '@/api/exam'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check, Close, InfoFilled, Warning, DocumentChecked } from '@element-plus/icons-vue'

// 定义题目接口
interface ClozeOptionInfo {
  itemId: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: string
  itemScore: number
}

interface ReadingOptionInfo {
  itemId: string
  itemContent: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: string
  itemScore: number
}

interface MatchingOptionInfo {
  itemId: string
  correctAnswer: string
  itemScore: number
}

interface TranslationOptionInfo {
  itemId: string
  correctAnswer: string
  itemScore: number
}

interface Question {
  questionId: string
  questionContent: string
  score: number
  isSensitive: number
  referenceAnswer?: string
  clozeOptionInfos?: ClozeOptionInfo[]
  readingOptionInfos?: ReadingOptionInfo[]
  matchingOptionInfos?: MatchingOptionInfo[]
  translationOptionInfos?: TranslationOptionInfo[]
  optionA?: string
  optionB?: string
  optionC?: string
  optionD?: string
  correctAnswer?: string
}

const route = useRoute()
const router = useRouter()
const subject = ref(route.query.subject as string)
const questionType = ref(route.query.questionType as string)
const count = ref(parseInt(route.query.count as string, 10))
const questions = ref<Question[]>([])
const userAnswers = ref<string[]>([])
const userClozeAnswers = ref<string[][]>([])
const userReadingAnswers = ref<string[][]>([])
const userMatchingAnswers = ref<string[][]>([])
const userTranslationAnswers = ref<string[][]>([])
const userPoliticsSingleAnswers = ref<string[]>([])
const userPoliticsMultiAnswers = ref<string[][]>([])
const showReference = ref(false)
const timeLeft = ref(7200) // 2小时，单位为秒
const loadingPercentage = ref(0)
const timerId = ref<number | null>(null)
const currentQuestionIndex = ref(0)

// 判断是否为完型填空题
const isClozeQuestion = (question: Question) => {
  return question.clozeOptionInfos && question.clozeOptionInfos.length > 0
}

// 判断是否为阅读理解题
const isReadingQuestion = (question: Question) => {
  return question.readingOptionInfos && question.readingOptionInfos.length > 0
}

// 判断是否为序号匹配题
const isMatchingQuestion = (question: Question) => {
  return question.matchingOptionInfos && question.matchingOptionInfos.length > 0
}

// 判断是否为翻译题
const isTranslationQuestion = (question: Question) => {
  return question.translationOptionInfos && question.translationOptionInfos.length > 0
}

// 判断是否为政治单选题
const isPoliticsSingleChoice = (question: Question) => {
  return question.optionA && question.optionB && question.optionC && question.optionD && 
         question.correctAnswer && question.correctAnswer.length === 1
}

// 判断是否为政治多选题
const isPoliticsMultipleChoice = (question: Question) => {
  return question.optionA && question.optionB && question.optionC && question.optionD && 
         question.correctAnswer && question.correctAnswer.length > 1 && question.correctAnswer.includes(',')
}

const formatText = (text: string | undefined) => {
  if (!text) return ''
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

// 计算答题进度
const calculateProgress = computed(() => {
  if (!questions.value.length) return 0

  let answered = 0
  let total = 0

  questions.value.forEach((question, index) => {
    if (isClozeQuestion(question) && question.clozeOptionInfos) {
      answered += userClozeAnswers.value[index]?.filter(a => a).length || 0
      total += question.clozeOptionInfos.length
    } else if (isReadingQuestion(question) && question.readingOptionInfos) {
      answered += userReadingAnswers.value[index]?.filter(a => a).length || 0
      total += question.readingOptionInfos.length
    } else if (isMatchingQuestion(question) && question.matchingOptionInfos) {
      answered += userMatchingAnswers.value[index]?.filter(a => a).length || 0
      total += question.matchingOptionInfos.length
    } else if (isTranslationQuestion(question) && question.translationOptionInfos) {
      answered += userTranslationAnswers.value[index]?.filter(a => a && a.trim()).length || 0
      total += question.translationOptionInfos.length
    } else if (userAnswers.value[index]) {
      answered += 1
      total += 1
    } else {
      total += 1
    }
  })

  return Math.floor((answered / total) * 100)
})

// 进度条颜色计算
const progressColor = computed(() => {
  const progress = calculateProgress.value
  if (progress < 30) return '#ff4d4f'
  if (progress < 70) return '#faad14'
  return '#52c41a'
})

// 获取题目
const fetchQuestions = async () => {
  try {
    const isRealExam = route.query.type === 'exam'
    if (isRealExam) {
      // 暂未实现真题接口
      ElMessage.warning('研究生真题功能正在开发中')
    } else {
      const requestData = {
        subject: subject.value,
        questionType: questionType.value,
        count: count.value
      }

      // 使用模拟计时器模拟加载进度
      let progress = 0
      const loadingTimer = setInterval(() => {
        progress += 10
        loadingPercentage.value = Math.min(progress, 90)
        if (progress >= 90) clearInterval(loadingTimer)
      }, 200)

      const response = await getGSPractice(requestData)
      loadingPercentage.value = 100

      // 清除加载计时器
      setTimeout(() => {
        clearInterval(loadingTimer)
        if (response?.data) {
          questions.value = response.data
          // 初始化答案数组
          initializeAnswers()
        }
      }, 300)
    }
  } catch (error) {
    ElMessage.error('获取题目失败，请重试')
    console.error('获取题目失败：', error)
  }
}

// 提取段落（为序号匹配题）
const extractParagraphs = (content: string) => {
  if (!content) return []
  // 提取段落，忽略选项部分
  const mainContent = content.split(/\[\w\]/)[0]
  return mainContent.split(/\(\d+\)/).filter(p => p.trim() !== '')
}

// 提取选项内容
const extractOptionContent = (content: string, optionLabel: string) => {
  if (!content) return ''
  const optionPattern = new RegExp(`\\[${optionLabel}\\](.+?)(?=\\[|$)`, 's')
  const match = content.match(optionPattern)
  return match ? match[1].trim() : ''
}

// 提取序号项内容
const extractItemContent = (content: string, itemId: string) => {
  if (!content) return ''
  const itemPattern = new RegExp(`\\(${itemId}\\)\\s*([^(]+?)(?=\\(\\d+\\)|$)`, 's')
  const match = content.match(itemPattern)
  return match ? match[1].trim() : ''
}

// 提取翻译文本
const extractTranslationText = (content: string, itemId: string) => {
  if (!content) return ''
  const pattern = new RegExp(`\\(${itemId}\\)\\s*([^(]+?)(?=\\(\\d+\\)|$)`, 's')
  const match = content.match(pattern)
  return match ? match[1].trim() : ''
}

// 选择匹配题答案
const selectMatchingAnswer = (questionIndex: number, optionIndex: number, answer: string) => {
  if (showReference.value) return // 如果显示参考答案，禁止选择

  // 确保数组已初始化
  if (!userMatchingAnswers.value[questionIndex]) {
    userMatchingAnswers.value[questionIndex] = []
  }

  // 设置答案
  userMatchingAnswers.value[questionIndex][optionIndex] = answer
}

// 检查翻译是否有输入
const hasTranslationInput = (translation: string) => {
  return translation && translation.trim().length > 0
}

// 简单评估翻译质量（只是模拟）
const isTranslationGood = (userTranslation: string, reference: string) => {
  if (!userTranslation) return false

  // 这里简化了评估逻辑，实际应用中可能会用更复杂的NLP技术
  const userWords = userTranslation.split(/\s+/).filter(w => w.length > 1)
  const refWords = reference.split(/\s+/).filter(w => w.length > 1)

  let matchCount = 0
  userWords.forEach(word => {
    if (refWords.some(ref => ref.includes(word) || word.includes(ref))) {
      matchCount++
    }
  })

  return matchCount >= Math.min(3, refWords.length / 3)
}

// 获取翻译反馈的样式类
const getTranslationFeedbackClass = (userTranslation: string, reference: string) => {
  if (!hasTranslationInput(userTranslation)) {
    return 'feedback-neutral'
  }
  return isTranslationGood(userTranslation, reference)
    ? 'feedback-good'
    : 'feedback-needs-improvement'
}

// 初始化答案数组
const initializeAnswers = () => {
  userAnswers.value = new Array(questions.value.length).fill('')

  userClozeAnswers.value = questions.value.map(question => {
    if (isClozeQuestion(question) && question.clozeOptionInfos) {
      return new Array(question.clozeOptionInfos.length).fill('')
    }
    return []
  })

  userReadingAnswers.value = questions.value.map(question => {
    if (isReadingQuestion(question) && question.readingOptionInfos) {
      return new Array(question.readingOptionInfos.length).fill('')
    }
    return []
  })

  userMatchingAnswers.value = questions.value.map(question => {
    if (isMatchingQuestion(question) && question.matchingOptionInfos) {
      return new Array(question.matchingOptionInfos.length).fill('')
    }
    return []
  })

  userTranslationAnswers.value = questions.value.map(question => {
    if (isTranslationQuestion(question) && question.translationOptionInfos) {
      return new Array(question.translationOptionInfos.length).fill('')
    }
    return []
  })

  userPoliticsSingleAnswers.value = new Array(questions.value.length).fill('')

  userPoliticsMultiAnswers.value = questions.value.map(question => {
    if (isPoliticsMultipleChoice(question)) {
      return []
    }
    return []
  })
}

// 检查是否有未回答的题目
const hasUnansweredQuestions = () => {
  let unansweredCount = 0

  questions.value.forEach((question, index) => {
    if (isClozeQuestion(question) && question.clozeOptionInfos) {
      const answered = userClozeAnswers.value[index]?.filter(a => a).length || 0
      unansweredCount += question.clozeOptionInfos.length - answered
    } else if (isReadingQuestion(question) && question.readingOptionInfos) {
      const answered = userReadingAnswers.value[index]?.filter(a => a).length || 0
      unansweredCount += question.readingOptionInfos.length - answered
    } else if (isMatchingQuestion(question) && question.matchingOptionInfos) {
      const answered = userMatchingAnswers.value[index]?.filter(a => a).length || 0
      unansweredCount += question.matchingOptionInfos.length - answered
    } else if (isTranslationQuestion(question) && question.translationOptionInfos) {
      const answered = userTranslationAnswers.value[index]?.filter(a => a && a.trim()).length || 0
      unansweredCount += question.translationOptionInfos.length - answered
    } else if (!userAnswers.value[index]?.trim()) {
      unansweredCount += 1
    } else if (isPoliticsSingleChoice(question) && !userPoliticsSingleAnswers.value[index]) {
      unansweredCount += 1
    } else if (isPoliticsMultipleChoice(question) && (!userPoliticsMultiAnswers.value[index] || userPoliticsMultiAnswers.value[index].length === 0)) {
      unansweredCount += 1
    }
  })

  return unansweredCount
}

// 提交答案
const submitAnswers = async () => {
  // 检查是否有未回答的题目
  const unansweredCount = hasUnansweredQuestions()

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

  ElMessage.success('答案已提交！')
  showReference.value = true // 显示参考答案
}

// 计时器
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

// 返回主页
const returnToHome = () => {
  showReference.value = false
  router.push('/exam/postgraduate')
}

// 监听滚动事件以更新当前问题
onMounted(() => {
  fetchQuestions()
  if (route.query.type === 'exam') {
    startTimer()
  }

  // 添加题目ID属性
  window.addEventListener('scroll', updateCurrentQuestion)
})

onBeforeUnmount(() => {
  if (timerId.value) {
    clearInterval(timerId.value)
  }

  // 移除滚动监听
  window.removeEventListener('scroll', updateCurrentQuestion)
})

// 更新当前显示的问题
const updateCurrentQuestion = () => {
  const questionElements = Array.from(document.querySelectorAll('.question-container'))
  if (!questionElements.length) return

  const scrollPosition = window.scrollY + 200 // 添加偏移量使导航更自然

  for (let i = 0; i < questionElements.length; i++) {
    const element = questionElements[i] as HTMLElement
    const position = element.offsetTop
    const nextPosition =
      i < questionElements.length - 1
        ? (questionElements[i + 1] as HTMLElement).offsetTop
        : Number.MAX_SAFE_INTEGER

    if (scrollPosition >= position && scrollPosition < nextPosition) {
      currentQuestionIndex.value = i
      return
    }
  }
}

// 检查多选题答案是否正确
const isMultipleChoiceCorrect = (userAnswer: string[], correctAnswer: string | undefined) => {
  if (!userAnswer || !correctAnswer) return false
  
  const correctOptions = correctAnswer.split(',')
  if (userAnswer.length !== correctOptions.length) return false
  
  return correctOptions.every(opt => userAnswer.includes(opt)) && 
         userAnswer.every(opt => correctOptions.includes(opt))
}
</script>

<style scoped>
.exam-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  padding-bottom: 80px;
}

.card-header {
  text-align: center;
  margin-bottom: 28px;
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
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.timer {
  background: linear-gradient(135deg, #fa541c 0%, #ff7a45 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(250, 84, 28, 0.2);
}

.loading-container {
  text-align: center;
  padding: 40px;
}

.loading-container p {
  margin-bottom: 20px;
  color: #8c8c8c;
}

.material-analysis-question {
  width: 100%;
  margin: 0 auto;
}

.question-container {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.question-number {
  font-size: 16px;
  color: #1677ff;
  font-weight: 500;
}

.question-score {
  background-color: #ff4d4f;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
}

.question-content {
  font-size: 16px;
  line-height: 1.8;
  color: #262626;
  margin-bottom: 24px;
  white-space: pre-line;
}

/* 选项组样式 */
.option-group {
  margin: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-group .el-radio {
  display: flex;
  align-items: center;
  margin-right: 0;
  margin-bottom: 0;
  padding: 14px 18px;
  border-radius: 6px;
  transition: all 0.2s ease;
  border: 1px solid #f0f0f0;
  background-color: white;
}

.option-group .el-radio:hover {
  background-color: #e6f7ff;
  border-color: #1677ff;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.1);
}

.option-group .el-radio.is-checked {
  background-color: #e6f7ff;
  border-color: #1677ff;
}

.option-group :deep(.el-radio__input) {
  margin-top: 0;
  align-self: center;
}

.option-group :deep(.el-radio__label) {
  padding-left: 12px;
  color: #262626;
  line-height: 1.6;
  display: flex;
  align-items: center;
  width: calc(100% - 30px);
  white-space: normal;
  word-break: break-word;
}

/* 正确错误选项样式 */
.option-group .el-radio.correct-option {
  background-color: #f6ffed;
  border-color: #52c41a;
}

.option-group .el-radio.wrong-option {
  background-color: #fff2f0;
  border-color: #ff4d4f;
}

.option-group .el-radio.correct-option :deep(.el-radio__label),
.option-group .el-radio.correct-option :deep(.el-radio__input.is-checked .el-radio__inner) {
  color: #52c41a;
  border-color: #52c41a;
}

.option-group .el-radio.wrong-option :deep(.el-radio__label),
.option-group .el-radio.wrong-option :deep(.el-radio__input.is-checked .el-radio__inner) {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

.correct-icon,
.wrong-icon {
  margin-left: 8px;
  vertical-align: middle;
}

/* 常规题目样式 */
.answer-section {
  margin-bottom: 20px;
}

.answer-section h3,
.reference-answer h3 {
  font-size: 18px;
  color: #262626;
  margin-bottom: 12px;
  font-weight: 500;
}

.reference-answer {
  background-color: #fafafa;
  padding: 16px;
  border-radius: 8px;
  margin-top: 20px;
}

.reference-answer div {
  font-size: 16px;
  line-height: 1.8;
  white-space: pre-line;
  color: #262626;
}

.button-group {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.button-group .el-button {
  padding: 12px 24px;
  font-size: 16px;
}

:deep(.el-textarea__inner) {
  line-height: 1.8;
  font-size: 16px;
  padding: 12px;
}

/* 答题进度样式 */
.progress-container {
  margin-bottom: 20px;
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #262626;
  font-weight: 500;
}

.option-answer .el-icon {
  font-size: 16px;
  margin-right: 6px;
}

/* 完型填空题样式优化 */
.cloze-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.cloze-item {
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #1677ff;
  transition: all 0.3s ease;
}

.cloze-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.cloze-item-header-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
}

.cloze-item-number {
  font-weight: 600;
  color: #1677ff;
  margin-right: 12px;
  margin-top: 12px;
  min-width: 30px;
}

.cloze-options {
  flex: 1;
}

.cloze-options .el-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.cloze-options .el-radio {
  margin-right: 0;
  margin-bottom: 0;
  width: calc(50% - 5px);
  min-width: auto;
  padding: 10px 14px;
}

.cloze-options .el-radio:hover {
  transform: translateY(-2px);
}

.cloze-options .el-radio :deep(.el-radio__label) {
  width: calc(100% - 20px);
  white-space: normal;
  word-break: break-word;
  font-size: 14px;
  line-height: 1.5;
}

/* 阅读理解题样式优化 */
.reading-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.reading-item {
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #1677ff;
  transition: all 0.3s ease;
}

.reading-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.reading-item-header-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
}

.reading-item-number {
  font-weight: 600;
  color: #1677ff;
  margin-right: 12px;
  margin-top: 4px;
  min-width: 30px;
}

.reading-item-content-wrapper {
  flex: 1;
}

.reading-item-content {
  font-weight: 500;
  margin-bottom: 12px;
}

.reading-options {
  margin-top: 16px;
}

.reading-options .el-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.reading-options .el-radio {
  margin-right: 0;
  margin-bottom: 0;
  width: calc(50% - 5px);
  min-width: auto;
  padding: 10px 14px;
}

.reading-options .el-radio:hover {
  transform: translateY(-2px);
}

.reading-options .el-radio :deep(.el-radio__label) {
  width: calc(100% - 20px);
  white-space: normal;
  word-break: break-word;
  font-size: 14px;
  line-height: 1.5;
}

/* 适用于完形填空和阅读题的错误图标 */
.cloze-options .el-radio .wrong-icon,
.reading-options .el-radio .wrong-icon {
  color: #ff4d4f;
  margin-left: 8px;
  vertical-align: middle;
}

/* 确保底部导航栏不显示 */
.bottom-navigation {
  display: none !important;
}

/* 序号匹配题样式 */
.matching-section {
  margin-bottom: 24px;
}

.matching-container {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
}

.matching-passage {
  flex: 1;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  font-size: 15px;
  line-height: 1.8;
  color: #262626;
  max-height: 400px;
  overflow-y: auto;
  border-left: 4px solid #722ed1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.paragraph-container {
  margin-bottom: 16px;
  text-indent: 2em;
}

.matching-options {
  width: 300px;
  background-color: #f0f2ff;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #2f54eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.options-header {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 12px;
  text-align: center;
  color: #262626;
  border-bottom: 1px solid #d9d9d9;
  padding-bottom: 8px;
}

.options-list {
  max-height: 360px;
  overflow-y: auto;
}

.option-item {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  background-color: white;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.option-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.option-label {
  font-weight: 600;
  color: #1677ff;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e6f7ff;
  border-radius: 50%;
}

.option-content {
  flex: 1;
  font-size: 14px;
  line-height: 1.6;
}

.matching-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.matching-item {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  height: auto;
}

.matching-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.matching-item-header {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  align-items: flex-start;
}

.item-number {
  font-weight: 600;
  color: white;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1677ff;
  border-radius: 50%;
  flex-shrink: 0;
}

.item-content {
  font-size: 14px;
  line-height: 1.6;
  background-color: #f5f5f5;
  padding: 8px 12px;
  border-radius: 6px;
  position: relative;
  max-height: 120px;
  overflow-y: auto;
  scrollbar-width: thin;
}

.item-content::-webkit-scrollbar {
  width: 4px;
}

.item-content::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 10px;
}

.item-content::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 10px;
}

.item-content::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}

.item-content::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 10px;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 6px solid #f5f5f5;
}

.matching-answers {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.answer-bubble {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #595959;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid #d9d9d9;
  position: relative;
}

.answer-bubble:hover:not(.selected):not(.correct):not(.incorrect) {
  background-color: #e6f7ff;
  border-color: #1677ff;
  color: #1677ff;
  transform: scale(1.1);
}

.answer-bubble.selected {
  background-color: #1677ff;
  border-color: #1677ff;
  color: white;
}

.answer-bubble.correct {
  background-color: #f6ffed;
  border-color: #52c41a;
  color: #52c41a;
}

.answer-bubble.incorrect {
  background-color: #fff2f0;
  border-color: #ff4d4f;
  color: #ff4d4f;
}

/* 翻译题样式 */
.translation-section {
  margin-bottom: 24px;
}

.translation-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.translation-item {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.translation-item:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.translation-item-header {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
  align-items: flex-start;
}

.highlighted-text {
  flex: 1;
  font-size: 16px;
  line-height: 1.8;
  color: #262626;
  padding: 12px 16px;
  background-color: #fffbe6;
  border-radius: 6px;
  border-left: 3px solid #faad14;
  position: relative;
}

.highlighted-text::before {
  content: '';
  position: absolute;
  top: 15px;
  left: -10px;
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 7px solid #faad14;
}

.translation-input {
  margin-bottom: 16px;
}

.translation-input :deep(.el-textarea__inner) {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  transition: all 0.3s ease;
  padding: 12px;
  font-size: 15px;
  line-height: 1.8;
}

.translation-input :deep(.el-textarea__inner:focus) {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.translation-reference {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  border-left: 3px solid #1677ff;
}

.reference-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #1677ff;
  font-weight: 500;
}

.reference-content {
  font-size: 15px;
  line-height: 1.8;
  color: #262626;
  padding: 12px;
  background-color: white;
  border-radius: 6px;
}

.translation-feedback {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 6px;
}

.feedback-good {
  background-color: #f6ffed;
  border-left: 3px solid #52c41a;
}

.feedback-needs-improvement {
  background-color: #fffbe6;
  border-left: 3px solid #faad14;
}

.feedback-neutral {
  background-color: #f5f5f5;
  border-left: 3px solid #8c8c8c;
}

.feedback-icon {
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feedback-text {
  font-size: 14px;
  font-weight: 500;
}

.feedback-good .feedback-icon {
  color: #52c41a;
}

.feedback-needs-improvement .feedback-icon {
  color: #faad14;
}

.feedback-neutral .feedback-icon {
  color: #8c8c8c;
}

/* 修改相应的正确图标样式 */
.correct-icon {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #52c41a;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  padding: 2px;
}

/* 政治单选题和多选题样式 */
.politics-single-choice-section,
.politics-multiple-choice-section {
  margin-bottom: 24px;
}

.politics-choice-item {
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #1677ff;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.politics-choice-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.politics-item-header-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
}

.politics-item-number {
  font-weight: 600;
  color: #1677ff;
  margin-right: 12px;
  margin-top: 12px;
  min-width: 30px;
}

.politics-item-content-wrapper {
  flex: 1;
}

.politics-options {
  margin-top: 12px;
}

.politics-options .el-radio-group,
.politics-options .el-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.politics-options .el-radio,
.politics-options .el-checkbox {
  margin-right: 0;
  margin-bottom: 0;
  width: calc(50% - 5px);
  min-width: auto;
  padding: 10px 14px;
  border-radius: 6px;
  transition: all 0.2s ease;
  border: 1px solid #f0f0f0;
  background-color: white;
}

.politics-options .el-radio:hover,
.politics-options .el-checkbox:hover {
  background-color: #e6f7ff;
  border-color: #1677ff;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.1);
}

.politics-options .el-radio.is-checked,
.politics-options .el-checkbox.is-checked {
  background-color: #e6f7ff;
  border-color: #1677ff;
}

.politics-options :deep(.el-radio__input),
.politics-options :deep(.el-checkbox__input) {
  margin-top: 0;
  align-self: flex-start;
}

.politics-options :deep(.el-radio__label),
.politics-options :deep(.el-checkbox__label) {
  padding-left: 12px;
  color: #262626;
  line-height: 1.5;
  display: flex;
  align-items: center;
  width: calc(100% - 20px);
  white-space: normal;
  word-break: break-word;
  font-size: 14px;
}

.politics-options .el-radio.correct-option,
.politics-options .el-checkbox.correct-option {
  background-color: #f6ffed;
  border-color: #52c41a;
}

.politics-options .el-radio.wrong-option,
.politics-options .el-checkbox.wrong-option {
  background-color: #fff2f0;
  border-color: #ff4d4f;
}

.politics-options .el-radio.correct-option :deep(.el-radio__label),
.politics-options .el-radio.correct-option :deep(.el-radio__input.is-checked .el-radio__inner),
.politics-options .el-checkbox.correct-option :deep(.el-checkbox__label),
.politics-options .el-checkbox.correct-option :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  color: #52c41a;
  border-color: #52c41a;
}

.politics-options .el-radio.wrong-option :deep(.el-radio__label),
.politics-options .el-radio.wrong-option :deep(.el-radio__input.is-checked .el-radio__inner),
.politics-options .el-checkbox.wrong-option :deep(.el-checkbox__label),
.politics-options .el-checkbox.wrong-option :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

.politics-options .el-radio .wrong-icon,
.politics-options .el-checkbox .wrong-icon {
  color: #ff4d4f;
  margin-left: 8px;
  vertical-align: middle;
}
</style>
