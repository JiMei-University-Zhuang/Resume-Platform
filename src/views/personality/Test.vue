<template>
  <div class="personality-test">
    <el-card v-if="!testStarted">
      <template #header>
        <div class="card-header">
          <h2>AI 性格测试</h2>
          <p>基于 MBTI 和大五人格理论的智能性格分析</p>
        </div>
      </template>
      <div class="test-intro">
        <h3>测试说明</h3>
        <ul>
          <li>测试包含 60 个问题，预计耗时 15-20 分钟</li>
          <li>请根据第一感觉作答，不要过度思考</li>
          <li>测试结果仅供参考，不代表完整的个人评价</li>
        </ul>
        <div class="start-button">
          <el-button type="primary" size="large" @click="startTest">开始测试</el-button>
        </div>
      </div>
    </el-card>

    <div v-else>
      <el-steps :active="currentStep" finish-status="success" simple style="margin: 20px 0">
        <el-step title="MBTI 测试" />
        <el-step title="大五人格测试" />
        <el-step title="开放问答" />
        <el-step title="分析报告" />
      </el-steps>

      <!-- 测试问题区域 -->
      <el-card v-if="currentStep < 2">
        <template #header>
          <div class="question-header">
            <span>问题 {{ currentQuestionIndex + 1 }}/{{ currentQuestions.length }}</span>
            <el-progress :percentage="(currentQuestionIndex + 1) / currentQuestions.length * 100" />
          </div>
        </template>
        
        <div class="question-content">
          <h3>{{ currentQuestion?.question }}</h3>
          <div class="options" v-if="currentQuestion">
            <el-radio-group v-model="currentAnswer" @change="handleAnswer" class="radio-group">
              <el-radio 
                v-for="option in currentQuestion.options" 
                :key="option.value" 
                :label="option.value"
                class="radio-item"
              >
                {{ option.label }}
              </el-radio>
            </el-radio-group>
          </div>
        </div>
      </el-card>

      <!-- 开放问答区域 -->
      <el-card v-else-if="currentStep === 2">
        <template #header>
          <div class="card-header">
            <h3>开放问答</h3>
            <p>请描述你的想法，AI 将分析你的回答</p>
          </div>
        </template>
        <div class="open-questions">
          <div v-for="(question, index) in openQuestions" :key="index" class="open-question">
            <h4>{{ question.question }}</h4>
            <el-input
              v-model="openAnswers[index]"
              type="textarea"
              :rows="4"
              :placeholder="question.placeholder"
            />
          </div>
          <div class="submit-area">
            <el-button type="primary" @click="submitOpenAnswers" :loading="analyzing">
              提交分析
            </el-button>
          </div>
        </div>
      </el-card>

      <!-- 分析报告 -->
      <el-card v-else class="analysis-report">
        <template #header>
          <div class="card-header">
            <h2>个性分析报告</h2>
            <el-button type="primary" @click="exportReport">导出报告</el-button>
          </div>
        </template>
        
        <el-collapse v-model="activeCollapse">
          <el-collapse-item title="MBTI 性格类型" name="1">
            <div class="mbti-result">
              <h3>{{ report.mbti.type }}</h3>
              <p>{{ report.mbti.description }}</p>
              <div class="trait-bars">
                <div v-for="(trait, index) in report.mbti.traits" :key="index" class="trait-bar">
                  <span>{{ trait.name }}</span>
                  <el-progress :percentage="trait.value" :format="format => `${trait.value}%`" />
                </div>
              </div>
            </div>
          </el-collapse-item>

          <el-collapse-item title="大五人格分析" name="2">
            <div class="big5-result">
              <div v-for="(dimension, index) in report.bigFive" :key="index" class="dimension">
                <h4>{{ dimension.name }}</h4>
                <el-progress :percentage="dimension.value" :format="format => `${dimension.value}%`" />
                <p>{{ dimension.description }}</p>
              </div>
            </div>
          </el-collapse-item>

          <el-collapse-item title="AI 深度洞察" name="3">
            <div class="ai-insights">
              <div v-for="(insight, index) in report.aiInsights" :key="index" class="insight">
                <h4>{{ insight.title }}</h4>
                <p>{{ insight.content }}</p>
              </div>
            </div>
          </el-collapse-item>

          <el-collapse-item title="职业匹配建议" name="4">
            <div class="career-suggestions">
              <el-table :data="report.careerSuggestions" style="width: 100%">
                <el-table-column prop="career" label="推荐职业" />
                <el-table-column prop="match" label="匹配度">
                  <template #default="scope">
                    <el-progress :percentage="scope.row.match" />
                  </template>
                </el-table-column>
                <el-table-column prop="reason" label="推荐理由" />
              </el-table>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { usePersonalityStore } from '@/stores'
import type { Question, OpenQuestion, PersonalityReport } from '@/types/personality'
import { mbtiQuestions, bigFiveQuestions, openQuestions } from '@/constants/personalityQuestions'

const personalityStore = usePersonalityStore()

const testStarted = ref(false)
const currentStep = ref(0)
const currentQuestionIndex = ref(0)
const currentAnswer = ref('')
const analyzing = ref(false)
const activeCollapse = ref(['1', '2', '3', '4'])

// 存储答案
const mbtiAnswers = ref<string[]>([])
const bigFiveAnswers = ref<string[]>([])
const openAnswers = ref<string[]>([])

// 根据当前步骤获取问题列表
const currentQuestions = computed(() => {
  if (currentStep.value === 0) return mbtiQuestions
  if (currentStep.value === 1) return bigFiveQuestions
  return []
})

// 当前问题
const currentQuestion = computed(() => {
  return currentQuestions.value[currentQuestionIndex.value] || null
})

// 处理答案
const handleAnswer = () => {
  // 记录当前答案
  if (currentStep.value === 0) {
    mbtiAnswers.value[currentQuestionIndex.value] = currentAnswer.value
  } else if (currentStep.value === 1) {
    bigFiveAnswers.value[currentQuestionIndex.value] = currentAnswer.value
  }

  // 检查是否还有下一个问题
  if (currentQuestionIndex.value < currentQuestions.value.length - 1) {
    // 还有问题，继续下一题
    currentQuestionIndex.value++
    currentAnswer.value = ''
  } else {
    // 当前部分的问题已答完
    if (currentStep.value === 0) {
      // MBTI测试完成，进入大五人格测试
      currentStep.value = 1
      currentQuestionIndex.value = 0
      currentAnswer.value = ''
      // 初始化大五人格答案数组
      bigFiveAnswers.value = new Array(bigFiveQuestions.length).fill('')
    } else {
      // 大五人格测试完成，进入开放问答
      currentStep.value = 2
      currentQuestionIndex.value = 0
      currentAnswer.value = ''
      // 初始化开放问答答案数组
      openAnswers.value = new Array(openQuestions.length).fill('')
    }
  }
}

// 开始测试
const startTest = () => {
  testStarted.value = true
  currentStep.value = 0
  currentQuestionIndex.value = 0
  currentAnswer.value = ''
  // 初始化答案数组
  mbtiAnswers.value = new Array(mbtiQuestions.length).fill('')
  bigFiveAnswers.value = new Array(bigFiveQuestions.length).fill('')
  openAnswers.value = new Array(openQuestions.length).fill('')
}

// 提交开放问答
const submitOpenAnswers = async () => {
  analyzing.value = true
  try {
    await personalityStore.analyzePersonality({
      mbtiAnswers: mbtiAnswers.value,
      bigFiveAnswers: bigFiveAnswers.value,
      openAnswers: openAnswers.value
    })
    currentStep.value = 3
  } catch (error) {
    ElMessage.error('分析失败，请重试')
  } finally {
    analyzing.value = false
  }
}

// 导出报告
const exportReport = () => {
  // TODO: 实现报告导出功能
  ElMessage.success('报告导出成功')
}

// 获取报告数据
const report = computed(() => personalityStore.report)
</script>

<style scoped lang="less">
.personality-test {
  padding: 20px;

  .test-intro {
    text-align: center;
    padding: 20px;

    ul {
      text-align: left;
      margin: 20px auto;
      max-width: 500px;
    }

    .start-button {
      margin-top: 30px;
    }
  }

  .question-header {
    display: flex;
    flex-direction: column;
    gap: 12px;

    span {
      font-size: 16px;
      font-weight: 500;
    }
  }

  .question-content {
    padding: 20px;
    
    h3 {
      margin-bottom: 24px;
      font-size: 18px;
      line-height: 1.6;
    }
    
    .options {
      margin-top: 20px;
      
      .radio-group {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 100%;
      }

      .radio-item {
        margin: 0;
        padding: 16px 20px;
        border-radius: 8px;
        transition: all 0.3s;
        width: 100%;
        height: auto;
        line-height: 1.5;
        border: 1px solid var(--el-border-color-lighter);

        &:hover {
          background-color: var(--el-fill-color-light);
          border-color: var(--el-border-color);
        }

        &.is-checked {
          background-color: var(--el-color-primary-light-9);
          border-color: var(--el-color-primary);
        }
      }
    }
  }

  .open-questions {
    .open-question {
      margin-bottom: 20px;
    }

    .submit-area {
      margin-top: 30px;
      text-align: center;
    }
  }

  .analysis-report {
    .trait-bars, .dimension {
      margin: 15px 0;
    }

    .insight {
      margin: 20px 0;
    }

    .career-suggestions {
      margin-top: 20px;
    }
  }
}
</style>
