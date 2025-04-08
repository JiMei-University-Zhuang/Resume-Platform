<template>
  <div class="postgraduate-center">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-container">
          <h1 class="page-title">考研备考中心</h1>
          <div class="title-decoration">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p class="page-description">提供专业、系统的考研备考资源，助力你的学术梦想</p>
          <div class="title-action">
            <button class="get-started-btn" @click="scrollToContent">
              <span>开始备考</span>
            </button>
          </div>
        </div>
      </div>
      <div class="countdown-wrapper">
        <div class="countdown-card">
          <div class="countdown-title">2025年考研倒计时</div>
          <div class="countdown-digits">
            <div class="countdown-digit-group">
              <div class="countdown-value">{{ daysLeft.toString().padStart(3, '0') }}</div>
              <div class="countdown-label">天</div>
            </div>
            <div class="countdown-digit-group">
              <div class="countdown-value">{{ hoursLeft.toString().padStart(2, '0') }}</div>
              <div class="countdown-label">时</div>
            </div>
            <div class="countdown-digit-group">
              <div class="countdown-value">{{ minutesLeft.toString().padStart(2, '0') }}</div>
              <div class="countdown-label">分</div>
            </div>
            <div class="countdown-digit-group">
              <div class="countdown-value">{{ secondsLeft.toString().padStart(2, '0') }}</div>
              <div class="countdown-label">秒</div>
            </div>
          </div>
          <div class="countdown-date">2025年12月21日 星期六</div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-tabs" :class="{ 'content-loaded': !isLoading }">
      <div class="tab-header">
        <div
          class="tab-item"
          :class="{ active: activeTab === 'specialized-practice' }"
          @click="activeTab = 'specialized-practice'"
        >
          专项练习
        </div>
        <div
          class="tab-item"
          :class="{ active: activeTab === 'past-exams' }"
          @click="activeTab = 'past-exams'"
        >
          历年真题
        </div>
      </div>

      <!-- 专项练习内容 -->
      <transition name="fade">
        <div class="tab-content" v-if="activeTab === 'specialized-practice' && animationReady">
          <div class="practice-card">
            <h3 class="card-title">自定义练习</h3>

            <div class="form-group">
              <div class="form-label">科目选择</div>
              <div class="radio-group">
                <label
                  class="custom-radio"
                  :class="{ 'radio-checked': selectedSubject === '英语一' }"
                >
                  <input type="radio" v-model="selectedSubject" value="英语一" />
                  <span class="radio-text">英语</span>
                </label>
                <label
                  class="custom-radio"
                  :class="{ 'radio-checked': selectedSubject === '思想政治' }"
                >
                  <input type="radio" v-model="selectedSubject" value="思想政治" />
                  <span class="radio-text">思想政治</span>
                </label>
                <label
                  class="custom-radio"
                  :class="{ 'radio-checked': selectedSubject === '计算机学科专业课' }"
                >
                  <input type="radio" v-model="selectedSubject" value="计算机学科专业课" />
                  <span class="radio-text">计算机学科专业课</span>
                </label>
              </div>
            </div>

            <div class="form-group">
              <div class="form-label">题型选择</div>
              <transition name="scale" mode="out-in">
                <div class="radio-group" v-if="selectedSubject === '英语一'" key="english">
                  <label
                    class="custom-radio"
                    :class="{ 'radio-checked': selectedquestionType === '完形填空' }"
                  >
                    <input type="radio" v-model="selectedquestionType" value="完形填空" />
                    <span class="radio-text">完型填空</span>
                  </label>
                  <label
                    class="custom-radio"
                    :class="{ 'radio-checked': selectedquestionType === '阅读理解' }"
                  >
                    <input type="radio" v-model="selectedquestionType" value="阅读理解" />
                    <span class="radio-text">阅读理解</span>
                  </label>
                  <label
                    class="custom-radio"
                    :class="{ 'radio-checked': selectedquestionType === '序号匹配' }"
                  >
                    <input type="radio" v-model="selectedquestionType" value="序号匹配" />
                    <span class="radio-text">序号匹配</span>
                  </label>
                  <label
                    class="custom-radio"
                    :class="{ 'radio-checked': selectedquestionType === '翻译' }"
                  >
                    <input type="radio" v-model="selectedquestionType" value="翻译" />
                    <span class="radio-text">翻译</span>
                  </label>
                  <label
                    class="custom-radio"
                    :class="{ 'radio-checked': selectedquestionType === '作文' }"
                  >
                    <input type="radio" v-model="selectedquestionType" value="作文" />
                    <span class="radio-text">作文</span>
                  </label>
                </div>

                <div class="radio-group" v-else-if="selectedSubject === '思想政治'" key="politics">
                  <label
                    class="custom-radio"
                    :class="{ 'radio-checked': selectedquestionType === '单选题' }"
                  >
                    <input type="radio" v-model="selectedquestionType" value="单选题" />
                    <span class="radio-text">单选题</span>
                  </label>
                  <label
                    class="custom-radio"
                    :class="{ 'radio-checked': selectedquestionType === '多选题' }"
                  >
                    <input type="radio" v-model="selectedquestionType" value="多选题" />
                    <span class="radio-text">多选题</span>
                  </label>
                  <label
                    class="custom-radio"
                    :class="{ 'radio-checked': selectedquestionType === '材料分析题' }"
                  >
                    <input type="radio" v-model="selectedquestionType" value="材料分析题" />
                    <span class="radio-text">材料分析题</span>
                  </label>
                </div>

                <div
                  class="radio-group"
                  v-else-if="selectedSubject === '计算机学科专业课'"
                  key="cs"
                >
                  <label
                    class="custom-radio"
                    :class="{ 'radio-checked': selectedquestionType === '单选题' }"
                  >
                    <input type="radio" v-model="selectedquestionType" value="单选题" />
                    <span class="radio-text">单选题</span>
                  </label>
                  <label
                    class="custom-radio"
                    :class="{ 'radio-checked': selectedquestionType === '解答题' }"
                  >
                    <input type="radio" v-model="selectedquestionType" value="解答题" />
                    <span class="radio-text">解答题</span>
                  </label>
                </div>
              </transition>
            </div>

            <div class="form-group">
              <div class="form-label">题目数量</div>
              <div class="radio-group">
                <label class="custom-radio" :class="{ 'radio-checked': selectedCount === '1' }">
                  <input type="radio" v-model="selectedCount" value="1" />
                  <span class="radio-text">1道题</span>
                </label>
                <label class="custom-radio" :class="{ 'radio-checked': selectedCount === '5' }">
                  <input type="radio" v-model="selectedCount" value="5" />
                  <span class="radio-text">5道题</span>
                </label>
                <label class="custom-radio" :class="{ 'radio-checked': selectedCount === '10' }">
                  <input type="radio" v-model="selectedCount" value="10" />
                  <span class="radio-text">10道题</span>
                </label>
              </div>
            </div>

            <button class="primary-button start-practice-btn" @click="startPractice">
              <span>开始练习</span>
            </button>
          </div>
        </div>
      </transition>

      <!-- 历年真题内容 -->
      <transition name="fade">
        <div class="tab-content" v-if="activeTab === 'past-exams' && animationReady">
          <div class="filter-header">
            <div class="filter-title">分类筛选：</div>
            <div class="filter-options">
              <div
                class="filter-option"
                :class="{ active: currentCategory === 'all' }"
                @click="filterCards('all')"
              >
                全部
              </div>
              <div
                class="filter-option"
                :class="{ active: currentCategory === 'math' }"
                @click="filterCards('math')"
              >
                数学
              </div>
              <div
                class="filter-option"
                :class="{ active: currentCategory === 'english' }"
                @click="filterCards('english')"
              >
                英语
              </div>
              <div
                class="filter-option"
                :class="{ active: currentCategory === 'politics' }"
                @click="filterCards('politics')"
              >
                政治
              </div>
              <div
                class="filter-option"
                :class="{ active: currentCategory === 'professional' }"
                @click="filterCards('professional')"
              >
                专业课
              </div>
            </div>
          </div>

          <transition-group name="paper-list" tag="div" class="paper-grid">
            <div v-for="paper in filteredPapers" :key="paper.id" class="paper-card">
              <div class="paper-image">
                <img :src="paper.imageUrl" alt="试卷封面" />
              </div>
              <div class="paper-info">
                <h3 class="paper-title">{{ paper.title }}</h3>
                <p class="paper-description">{{ paper.description }}</p>
                <div class="paper-actions">
                  <button class="primary-button" @click="openExamDialog(paper)">
                    <span>使用试卷</span>
                  </button>
                  <button class="outline-button" @click="previewPaper(paper.id)">
                    <span>预览</span>
                  </button>
                </div>
              </div>
            </div>
          </transition-group>
        </div>
      </transition>
    </div>

    <!-- 考试对话框 -->
    <transition name="modal">
      <div class="modal-overlay" v-if="isExamDialogVisible" @click="isExamDialogVisible = false">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              {{ currentExamPaper.category === 'politics' ? '政治考试' : '开始考试' }}
              <span v-if="currentExamPaper.category === 'politics'" class="category-badge politics"
                >政治</span
              >
            </h3>
            <button class="modal-close" @click="isExamDialogVisible = false">×</button>
          </div>
          <div class="modal-body">
            <img :src="currentExamPaper.imageUrl" alt="试卷封面" class="modal-image" />
            <h4 class="modal-paper-title">{{ currentExamPaper.title }}</h4>
            <p class="modal-description">{{ currentExamPaper.description }}</p>

            <!-- 政治试卷额外信息 -->
            <div v-if="currentExamPaper.category === 'politics'" class="politics-info">
              <div class="info-item">
                <span class="info-label">题目类型：</span>
                <span class="info-value">单选题、多选题、分析题</span>
              </div>
              <div class="info-item">
                <span class="info-label">考试时间：</span>
                <span class="info-value">120分钟</span>
              </div>
              <div class="info-item">
                <span class="info-label">总分：</span>
                <span class="info-value">100分</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="outline-button" @click="isExamDialogVisible = false">
              <span>取消</span>
            </button>
            <button class="primary-button" @click="startExam(currentExamPaper.id)">
              <span>{{ currentExamPaper.category === 'politics' ? '开始答题' : '开始考试' }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import zhengzhi1Image from '@/assets/images/paper_imgs/zhengzhi1.png'

const router = useRouter()
const activeTab = ref('specialized-practice')
const selectedSubject = ref('英语一')
const selectedquestionType = ref('完型填空')
const selectedCount = ref('1')
const isLoading = ref(true)
const animationReady = ref(false)

// 科目变更时自动选择默认题型
watch(selectedSubject, newSubject => {
  if (newSubject === '英语一') {
    selectedquestionType.value = '完型填空'
  } else if (newSubject === '思想政治') {
    selectedquestionType.value = '单选题'
  } else if (newSubject === '计算机学科专业课') {
    selectedquestionType.value = '单选题'
  }
})

// 选项卡切换效果
watch(activeTab, () => {
  animationReady.value = false
  nextTick(() => {
    animationReady.value = true
  })
})

// 滚动到内容区域
const scrollToContent = () => {
  const contentElement = document.querySelector('.content-tabs')
  if (contentElement) {
    contentElement.scrollIntoView({ behavior: 'smooth' })
  }
}

// 考研倒计时相关
const daysLeft = ref(245)
const hoursLeft = ref(0)
const minutesLeft = ref(0)
const secondsLeft = ref(0)

// 计算精确的倒计时
const calculateCountdown = () => {
  const examDate = new Date('2025/12/21 00:00:00')
  const now = new Date()

  const diff = examDate.getTime() - now.getTime()

  if (diff <= 0) {
    // 考试已经开始
    daysLeft.value = 0
    hoursLeft.value = 0
    minutesLeft.value = 0
    secondsLeft.value = 0
    return
  }

  // 计算天、时、分、秒
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  daysLeft.value = days
  hoursLeft.value = hours
  minutesLeft.value = minutes
  secondsLeft.value = seconds
}

// 启动倒计时
onMounted(() => {
  calculateCountdown()
  setInterval(calculateCountdown, 1000)

  // 添加页面初始化动画
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    animationReady.value = true
  }, 300)
})

// 模拟试卷数据
const papers = ref([
  {
    id: 1,
    title: '2024年考研数学一模拟试卷',
    description: '适合数学与应用数学、计算数学等学科专业的考生备考',
    category: 'math',
    imageUrl: zhengzhi1Image
  },
  {
    id: 2,
    title: '计算机学科 数据结构专题',
    description: '涵盖树、图、排序算法等重点考察内容',
    category: 'professional',
    imageUrl: zhengzhi1Image
  },
  {
    id: 3,
    title: '2023年专业课真题解析',
    description: '包含详细解答及考点分析',
    category: 'professional',
    imageUrl: zhengzhi1Image
  },
  {
    id: 5,
    title: '英语二全真模拟',
    description: '考研英语阅读理解专项训练',
    category: 'english',
    imageUrl: zhengzhi1Image
  },
  {
    id: 6,
    title: '2024年考研政治真题',
    description: '历年真题解析及答题技巧',
    category: 'politics',
    imageUrl: zhengzhi1Image
  },
  {
    id: 7,
    title: '计算机网络与操作系统',
    description: '计算机专业核心知识点练习',
    category: 'professional',
    imageUrl: zhengzhi1Image
  }
])

const currentCategory = ref('all')
const filterCards = (category: string) => {
  currentCategory.value = category
}

const filteredPapers = computed(() => {
  if (currentCategory.value === 'all') {
    return papers.value
  }
  return papers.value.filter(paper => paper.category === currentCategory.value)
})

// 考试对话框相关状态
const isExamDialogVisible = ref(false)
const currentExamPaper = ref<any>({})

// 打开考试对话框
const openExamDialog = (paper: any) => {
  currentExamPaper.value = paper
  isExamDialogVisible.value = true
}

// 开始考试的方法
const startExam = (paperId: number) => {
  isExamDialogVisible.value = false

  // 根据试卷类型决定跳转路径
  const paperCategory = papers.value.find(p => p.id === paperId)?.category

  if (paperCategory === 'politics') {
    // 政治试卷跳转到politics-answer
    router.push({
      path: '/exam/politics-answer',
      query: {
        id: paperId.toString(),
        type: 'exam'
      }
    })
  } else {
    router.push({
      path: '/exam/postgraduate-answer',
      query: {
        id: paperId.toString(),
        type: 'exam'
      }
    })
  }
}

// 开始专项练习
const startPractice = () => {
  console.log('开始专项练习', {
    subject: selectedSubject.value,
    questionType: selectedquestionType.value,
    count: selectedCount.value
  })

  router.push({
    path: '/exam/postgraduate-answer',
    query: {
      subject: selectedSubject.value,
      questionType: selectedquestionType.value,
      count: selectedCount.value,
      type: 'practice'
    }
  })
}

// 预览试卷的方法
const previewPaper = (paperId: number) => {
  console.log('预览试卷，试卷id：', paperId)

  // 查找对应的试卷
  const paper = papers.value.find(p => p.id === paperId)
  if (paper) {
    // 打开预览对话框
    currentExamPaper.value = paper
    isExamDialogVisible.value = true
  }
}
</script>

<style scoped>
/* 全局重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 页面布局 */
.postgraduate-center {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 48px;
  padding: 48px 0 24px;
  border-bottom: 1px solid rgba(22, 119, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: -120px;
  left: -120px;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(22, 119, 255, 0.1) 0%, rgba(22, 119, 255, 0) 70%);
  z-index: 0;
  animation: float 10s infinite ease-in-out;
}

.page-header::after {
  content: '';
  position: absolute;
  bottom: -80px;
  right: -80px;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(250, 84, 28, 0.08) 0%, rgba(250, 84, 28, 0) 70%);
  z-index: 0;
  animation: float 12s infinite ease-in-out reverse;
}

@keyframes float {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(15px, 15px);
  }
  100% {
    transform: translate(0, 0);
  }
}

.header-content {
  flex: 1;
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title-container {
  text-align: center;
  max-width: 600px;
}

.page-title {
  font-size: 36px;
  font-weight: 600;
  background: linear-gradient(120deg, #1677ff, #0958d9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 16px;
  letter-spacing: 1px;
  position: relative;
  display: inline-block;
}

.title-decoration {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.title-decoration span {
  height: 4px;
  border-radius: 2px;
}

.title-decoration span:nth-child(1) {
  width: 24px;
  background-color: rgba(22, 119, 255, 0.6);
}

.title-decoration span:nth-child(2) {
  width: 48px;
  background-color: rgba(22, 119, 255, 0.8);
}

.title-decoration span:nth-child(3) {
  width: 24px;
  background-color: rgba(22, 119, 255, 0.6);
}

.page-description {
  font-size: 16px;
  color: #595959;
  margin-bottom: 24px;
  line-height: 1.6;
  animation: fadeIn 1s ease-in-out;
}

.title-action {
  margin-top: 20px;
}

.get-started-btn {
  background: linear-gradient(120deg, #1677ff, #0958d9);
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 6px 16px rgba(22, 119, 255, 0.3);
}

.get-started-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(22, 119, 255, 0.4);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 倒计时卡片 */
.countdown-wrapper {
  min-width: 280px;
  position: relative;
  z-index: 1;
}

.countdown-card {
  background: linear-gradient(135deg, #1677ff 0%, #0958d9 100%);
  border-radius: 8px;
  padding: 16px;
  color: white;
  box-shadow: 0 8px 24px rgba(22, 119, 255, 0.3);
  text-align: center;
  animation: pulse 2s infinite alternate;
  transition: all 0.3s ease;
}

.countdown-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(22, 119, 255, 0.4);
}

.countdown-title {
  font-size: 14px;
  margin-bottom: 12px;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
}

.countdown-digits {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.countdown-digit-group {
  position: relative;
}

.countdown-value {
  font-size: 24px;
  font-weight: 600;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  padding: 4px 6px;
  min-width: 32px;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
}

.countdown-value::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
}

.countdown-label {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 4px;
}

.countdown-date {
  font-size: 12px;
  opacity: 0.7;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 8px;
  margin-top: 8px;
}

@keyframes pulse {
  0% {
    box-shadow: 0 8px 24px rgba(22, 119, 255, 0.3);
  }
  100% {
    box-shadow: 0 8px 28px rgba(22, 119, 255, 0.5);
  }
}

/* 响应式样式 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: center;
    padding: 24px 0;
  }

  .header-content {
    margin-bottom: 24px;
  }

  .page-title {
    font-size: 28px;
  }

  .countdown-wrapper {
    margin-top: 16px;
    width: 100%;
  }

  .countdown-digits {
    flex-wrap: wrap;
  }

  .countdown-digit-group {
    flex: 1;
    min-width: 40%;
  }

  .form-group,
  .radio-group {
    flex-direction: column;
  }

  .paper-grid {
    grid-template-columns: 1fr;
  }
}

/* 内容标签页 */
.content-tabs {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  transition: all 0.5s ease;
  opacity: 0;
  transform: translateY(20px);
}

.content-tabs.content-loaded {
  opacity: 1;
  transform: translateY(0);
}

.tab-header {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
}

.tab-item {
  padding: 14px 24px;
  font-size: 16px;
  color: #595959;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.tab-item:hover {
  color: #1677ff;
  background-color: rgba(22, 119, 255, 0.05);
}

.tab-item.active {
  color: #1677ff;
  font-weight: 500;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 24px;
  right: 24px;
  height: 2px;
  background-color: #1677ff;
  animation: slideIn 0.3s ease-out forwards;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.tab-content {
  padding: 24px;
}

/* 专项练习卡片 */
.practice-card {
  background-color: white;
  border-radius: 4px;
  padding: 24px;
}

.card-title {
  font-size: 18px;
  color: #262626;
  margin-bottom: 24px;
  font-weight: 500;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  font-size: 14px;
  color: #595959;
  margin-bottom: 12px;
  font-weight: 500;
}

.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.custom-radio {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s;
}

.custom-radio input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.radio-text {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  color: #595959;
  transition: all 0.3s;
}

.custom-radio:hover {
  transform: translateY(-2px);
}

.custom-radio:hover .radio-text {
  border-color: #1677ff;
  color: #1677ff;
  box-shadow: 0 3px 10px rgba(22, 119, 255, 0.15);
}

.radio-checked .radio-text {
  background-color: #e6f4ff;
  border-color: #1677ff;
  color: #1677ff;
  animation: pulse 0.3s ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* 按钮样式 */
.primary-button {
  background-color: #1677ff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.primary-button:hover {
  background-color: #0958d9;
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.2);
}

.primary-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition:
    width 0.5s,
    height 0.5s;
  z-index: 0;
}

.primary-button:hover::after {
  width: 300px;
  height: 300px;
}

.primary-button span {
  position: relative;
  z-index: 1;
}

.outline-button {
  background-color: white;
  color: #595959;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.outline-button:hover {
  color: #1677ff;
  border-color: #1677ff;
}

.outline-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition:
    width 0.5s,
    height 0.5s;
  z-index: 0;
}

.outline-button:hover::after {
  width: 300px;
  height: 300px;
}

.outline-button span {
  position: relative;
  z-index: 1;
}

.start-practice-btn {
  display: block;
  width: 200px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  animation: buttonFloat 3s infinite alternate ease-in-out;
}

@keyframes buttonFloat {
  0% {
    transform: translateY(0);
    box-shadow: 0 4px 10px rgba(22, 119, 255, 0.2);
  }
  100% {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(22, 119, 255, 0.3);
  }
}

.filter-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.filter-title {
  font-size: 14px;
  color: #595959;
  margin-right: 16px;
  white-space: nowrap;
}

.filter-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-option {
  padding: 6px 16px;
  font-size: 14px;
  color: #595959;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #f5f5f5;
}

.filter-option:hover {
  color: #1677ff;
  background-color: #e6f4ff;
}

.filter-option.active {
  color: white;
  background-color: #1677ff;
}

.paper-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.paper-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  transition: all 0.3s;
  border: 1px solid #f0f0f0;
  transform-origin: center bottom;
}

.paper-card:hover {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  transform: translateY(-8px) scale(1.02);
}

.paper-image {
  height: 160px;
  overflow: hidden;
  position: relative;
}

.paper-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.paper-card:hover .paper-image img {
  transform: scale(1.05);
}

.paper-info {
  padding: 16px;
}

.paper-title {
  font-size: 16px;
  color: #262626;
  margin-bottom: 8px;
  font-weight: 500;
}

.paper-description {
  font-size: 14px;
  color: #8c8c8c;
  margin-bottom: 16px;
  line-height: 1.5;
  height: 42px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.paper-actions {
  display: flex;
  gap: 8px;
}

.paper-actions button {
  flex: 1;
}

/* 模态对话框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  animation: modal-fade-in 0.3s;
}

@keyframes modal-fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-title {
  font-size: 18px;
  color: #262626;
  font-weight: 500;
}

.modal-close {
  background: none;
  border: none;
  font-size: 20px;
  color: #8c8c8c;
  cursor: pointer;
  transition: color 0.3s;
}

.modal-close:hover {
  color: #262626;
}

.modal-body {
  padding: 24px;
}

.modal-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 16px;
}

.modal-description {
  font-size: 14px;
  color: #595959;
  line-height: 1.6;
  margin-bottom: 16px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
}

/* 添加动画 */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.5s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 添加内容加载动画 */
.content-tabs {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  transition: all 0.5s ease;
  opacity: 0;
  transform: translateY(20px);
}

.content-tabs.content-loaded {
  opacity: 1;
  transform: translateY(0);
}

/* 模态对话框动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
  opacity: 0;
}

/* 纸卡片列表动画 */
.paper-list-enter-active,
.paper-list-leave-active {
  transition: all 0.5s ease;
}

.paper-list-enter-from,
.paper-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.paper-list-move {
  transition: transform 0.5s ease;
}

.category-badge {
  display: inline-block;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: 8px;
  font-weight: normal;
  vertical-align: middle;
}

.category-badge.politics {
  background-color: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.modal-paper-title {
  font-size: 18px;
  font-weight: 500;
  color: #262626;
  margin-bottom: 12px;
}

.politics-info {
  margin-top: 16px;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border-left: 3px solid #52c41a;
}

.info-item {
  margin-bottom: 8px;
  font-size: 14px;
  display: flex;
}

.info-label {
  color: #8c8c8c;
  margin-right: 8px;
  min-width: 70px;
}

.info-value {
  color: #262626;
  font-weight: 500;
}
</style>
