<template>
  <div class="civil-service">
    <div class="card-header">
      <h1 class="welcome-title">欢迎来到考公中心</h1>
      <div class="header-buttons">
        <el-button @click="gotoWrongQuestion" class="wrong-question-button">错题回顾</el-button>
        <el-button @click="gotoHistoryScore" class="history-score-button">历史记录</el-button>
      </div>
      <div class="countdown-container">
        <h2
          class="countdown-title"
          style="
            color: white;
            text-shadow: 1px 1px 2px rgba(138, 187, 234, 0.1);
            -webkit-background-clip: text;
            background-clip: text;
          "
        >
          国考倒计时
        </h2>
        <p class="days-count">
          {{ days }}
          <span class="days-unit" style="font-size: 18px; font-weight: 400">&nbsp;天</span>
        </p>
        <p style="color: white; padding-top: 10px">2025年11月30日 星期日</p>
      </div>
    </div>

    <div class="card-body">
      <el-card class="Specialized-exercises">
        <div class="exercise-title">专项练习</div>
        <div class="exercise-description" style="line-height: 22px">
          无论你是<b>&nbsp;考公小白&nbsp;</b>，还是&nbsp;<b>久经沙场的老将</b>&nbsp;。我们的专项练习，就是你上岸的<span
            style="color: #cb3f23; font-weight: bold"
          >
            秘密武器</span
          >
          ！通过行测和申论的专业训练，让你像超级英雄一样<span style="font-size: 17px"
            ><b>&nbsp;轻松攻克&nbsp;</b></span
          >每个考点。准备好了吗？快点击<span style="color: gray; font-weight: 600; font-size: 17px"
            >" 练习设置 "</span
          >，把考点收入囊中吧！
        </div>
        <div class="exercise-image">
          <img src="@/assets/images/exam_imgs/exercises.jpg" alt="专项练习" />
        </div>

        <el-button type="primary" @click="showDialog">练习设置</el-button>
        <el-dialog
          v-model="dialogVisible"
          title="定制你的公考练习，行测 or 申论，题量任选，速来开练！"
          width="600px"
          style="padding: 50px; margin: 0 auto; top: 50%; transform: translateY(-50%)"
          append-to-body
        >
          <div class="setting-item">
            <span>题目类型：</span>
            <el-radio-group v-model="selectedSubject">
              <el-radio label="行测">行测</el-radio>
              <el-radio label="申论">申论</el-radio>
            </el-radio-group>
          </div>
          <div class="setting-item">
            <span>题目个数：</span>
            <template v-if="selectedSubject === '行测'">
              <el-radio-group v-model="selectedCount">
                <el-radio label="10">10道题</el-radio>
                <el-radio label="20">20道题</el-radio>
                <el-radio label="50">50道题</el-radio>
              </el-radio-group>
            </template>
            <template v-else>
              <el-tooltip content="申论类型建议只选择1道题" placement="right">
                <el-radio-group v-model="selectedCount">
                  <el-radio label="1">1道题</el-radio>
                </el-radio-group>
              </el-tooltip>
            </template>
          </div>
          <template #footer>
            <el-button type="primary" @click="startExam" class="saveBtn">开始考试</el-button>
          </template>
        </el-dialog>
      </el-card>
      <el-card class="Train-realexam">
        <div class="exercise-title">真题训练</div>
        <div class="exercise-image">
          <div class="exercise-description" style="text-align: left; line-height: 22px">
            想要在考公大军中脱颖而出？真题训练就是你的<span
              style="color: #cb3f23; font-weight: bold"
              >&nbsp;制胜法宝</span
            >&nbsp;！这里汇聚了历年海量真题。通过模拟真实考试情境，让你提前熟悉题型、把握节奏。<span
              style="color: gray; font-weight: 600; font-size: 17px"
              >精准攻克薄弱环节，积累实战经验，增强考试自信。</span
            >
          </div>
          <img src="@/assets/images/exam_imgs/realexam.jpg" alt="真题模考" />
        </div>
        <el-button @click="showExamDialog" class="exam-button">
          <i class="el-icon-document-checked"></i>
          真题模考
        </el-button>

        <!-- 真题试卷选择弹窗 -->
        <el-dialog
          v-model="examDialogVisible"
          title="选择真题试卷"
          width="600px"
          append-to-body
          class="exam-dialog"
        >
          <div class="exam-settings">
            <div class="setting-item">
              <span>试卷名称：</span>
              <el-select
                v-model="selectedExam"
                placeholder="请选择试卷"
                filterable
                style="width: 100%"
                class="exam-select"
              >
                <el-option
                  v-for="item in examList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
          <template #footer>
            <div class="dialog-footer">
              <el-button
                @click="startRealExam"
                :loading="loadingExam"
                :disabled="!selectedExam"
                class="start-btn"
                style="color: white"
              >
                开始考试
              </el-button>
              <el-button @click="examDialogVisible = false" class="cancel-btn"> 取消 </el-button>
            </div>
          </template>
        </el-dialog>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { onBeforeRouteLeave } from 'vue-router'
import { message } from 'ant-design-vue'

const router = useRouter()
const dialogVisible = ref(false)
const selectedSubject = ref('行测')
const selectedCount = ref('10')
const targetDate = new Date('2025-11-30T00:00:00').getTime()
const timeDifference = ref(targetDate - new Date().getTime())
const examDialogVisible = ref(false)
const selectedExam = ref('')
const loadingExam = ref(false)

const showDialog = () => {
  dialogVisible.value = true
}

// 预设试卷列表
const examList = [
  {
    value: '2020年国家公务员考试行测真题',
    label: '2020国考·行政职业能力测验真题',
    subject: '行测'
  },
  {
    value: '2020年国家公务员考试申论真题',
    label: '2020国考·申论真题',
    subject: '申论'
  }
]
// 显示选择弹窗
const showExamDialog = () => {
  examDialogVisible.value = true
  if (examList.length > 0) {
    selectedExam.value = examList[0].value
  }
}

const startRealExam = async () => {
  if (!selectedExam.value) {
    message.error('请选择试卷后再开始考试！')
    return
  }

  // 确保 selectedExamItem 不为 undefined
  const selectedExamItem = examList.find(item => item.value === selectedExam.value)

  if (!selectedExamItem) {
    message.error('未找到对应的试卷信息，请重试！')
    return
  }
  examDialogVisible.value = false
  router.push({
    name: 'ExamPage',
    query: {
      examName: selectedExam.value,
      type: 'exam',
      subject: selectedExamItem.subject || '未知科目'
    }
  })
}
const days = computed(() => Math.floor(timeDifference.value / (1000 * 60 * 60 * 24)))
let timerId: any = null
const startCountdown = () => {
  timerId = setInterval(() => {
    timeDifference.value = targetDate - new Date().getTime()
    if (timeDifference.value < 0) {
      clearInterval(timerId)
      timeDifference.value = 0 // 确保时间不会变成负数
    }
  }, 1000)
}

const startExam = () => {
  // 立即关闭弹窗
  dialogVisible.value = false

  // 添加微任务确保弹窗状态更新
  Promise.resolve().then(() => {
    // 手动清理残留弹窗
    const dialogs = document.querySelectorAll('.el-dialog__wrapper')
    dialogs.forEach(dialog => {
      if (dialog.parentNode) {
        dialog.parentNode.removeChild(dialog)
      }
    })
    const requestData = {
      subject: selectedSubject.value,
      count: parseInt(selectedCount.value, 10)
    }
    router.push({ name: 'ExamPage', query: { ...requestData, type: 'practice' } })
  })
}

const gotoHistoryScore = () => {
  router.push({ name: 'scorePage' })
}
const gotoWrongQuestion = () => {
  router.push({ name: 'wrongquestionPage' })
}
// 处理 keep-alive 缓存
onBeforeRouteLeave(() => {
  dialogVisible.value = false
})
onMounted(() => {
  if (examList.length > 0) {
    selectedExam.value = examList[0].value
  }
  startCountdown()
})
</script>

<style scoped>
.header-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}
.wrong-question-button,
.history-score-button {
  color: white;
  background: linear-gradient(to right, #1a365d, #3182ce);
  border: none;
  border-radius: 8px;
  padding: 20px 28px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.wrong-question-button:hover,
.history-score-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px #3182ce;
}
.card-body {
  width: 100%;
  display: flex;
  gap: 60px;
  padding: 60px 80px 0 80px;
}

.card-header {
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin-bottom: 10px;
}

.welcome-title {
  text-align: center;
  margin: 0;
  font-size: 2.5rem;
  background: linear-gradient(135deg, #1867ce 0%, #636e72 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 2px 2px 4px rgba(45, 52, 54, 0.1);
  position: relative;
  padding-bottom: 15px;
  margin: 1.5rem 0 1.5rem 0;
}

.welcome-title:hover {
  text-shadow: 3px 3px 6px rgba(45, 52, 54, 0.15);
  transform: scale(1.02);
  transition: all 0.3s ease;
}

/* 装饰线 */
.welcome-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 120px;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(45, 52, 54) 50%, transparent);
  transform: translateX(-50%);
}

.countdown-container {
  background: linear-gradient(145deg, #99d7eb 0%, #6dc1dc 100%);
  border-radius: 12px;
  padding: 10px 20px;
  box-shadow: 0 6px 20px rgba(206, 83, 83, 0.08);
  position: absolute;
  top: 80%;
  right: 8%;
  border: none;
  transform: translateY(-50%);
  transition: all 0.3s ease;
  text-align: center;
}

.countdown-container:hover {
  transform: translateY(-50%) scale(1.02);
}

.Specialized-exercises {
  flex: 1 1 0;
  padding: 10px 20px 50px 20px;
  position: relative;
}

.exercise-title {
  font-size: 24px;
  font-weight: bold;
  color: #717275;
  text-shadow: 0.2px 0.2px 1.5px rgb(92, 91, 91);
}

.exercise-description {
  text-indent: 2em;
  font-size: 14px;
  color: gray;
  padding: 10px 5px 0 5px;
}

.exercise-image {
  margin: 0 auto;
  width: 100%;
  text-align: center;
}

.exercise-image > img {
  width: 80%;
  padding: 20px;
}

.Train-realexam {
  flex: 1 1 0;
  padding: 20px;
  position: relative;
}

.el-button--primary {
  position: absolute;
  right: 2.75rem;
  bottom: 1.5rem;
  background: linear-gradient(to right, #1a365d, #3182ce);
  border: none;
  border-radius: 8px;
  padding: 12px 28px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.el-button--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px #3182ce;
}

.date-info {
  font-size: 0.9rem;
  color: #95a5a6;
  letter-spacing: 1px;
  margin-top: 8px;
  opacity: 0.8;
  font-family: 'Microsoft YaHei', sans-serif;
}

/* 添加数字跳动动画 */
@keyframes jump {
  0% {
    transform: translateY(0) rotate(-2deg);
  }

  50% {
    transform: translateY(-8px) rotate(2deg);
  }

  100% {
    transform: translateY(0) rotate(-2deg);
  }
}

.days-count {
  position: relative;
  display: inline-block;
  /* animation: jump 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; */
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: end;
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 0;
  color: #214956;
}

/* 添加数字装饰线 */
.days-count::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  width: 70%;
  height: 2px;
  background: linear-gradient(90deg, var(--primary-red), var(--secondary-red));
  transform: translateX(-50%);
  opacity: 0.5;
}

.exam-button {
  color: white;
  position: absolute;
  right: 2rem;
  bottom: 1.5rem;
  background: linear-gradient(to right, #1a365d, #3182ce);
  border: none;
  border-radius: 8px;
  padding: 12px 28px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(94, 200, 156, 0.2);
}

.exam-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px #3182ce;
}

/* 设置项样式 */
.exam-settings {
  padding: 16px 0;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 16px;

  > span {
    width: 80px;
    text-align: right;
    font-size: 14px;
    color: #606266;
  }
}
.setting-item {
  > span[data-v-d06752ee] {
    width: 100px;
  }
}
.el-select__wrapper {
  width: 95%;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
/* 新增弹窗按钮样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 20px; /* 增加按钮间距 */
  padding: 16px 24px;
  border-top: 1px solid #ebeef5;
}

.start-btn {
  padding: 12px 28px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: linear-gradient(to right, #1a365d, #3182ce);
  border: none;
}

.start-btn i {
  margin-right: 8px;
}

.cancel-btn {
  padding: 12px 24px;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid #dcdfe6;
}

.cancel-btn:hover {
  color: #16436c;
  border-color: #9bcbf8;
  background-color: #9bcbf8;
  box-shadow: 0 5px 15px #3182ce;
}

/* 优化真题卡片样式 */
.Train-realexam {
  flex: 1 1 0;
  padding: 20px;
  position: relative;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.exam-select {
  margin-top: 16px;
}

.exam-dialog {
  border-radius: 12px;
}

/* 按钮悬停效果 */
.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px #3182ce;
}
</style>
