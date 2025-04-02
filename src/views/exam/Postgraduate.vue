<template>
  <div class="postgraduate-center">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">考研备考中心</h1>
        <p class="page-description">提供专业、系统的考研备考资源，助力你的学术梦想</p>
      </div>
      <div class="countdown-wrapper">
        <div class="countdown-card">
          <div class="countdown-title">2025年考研倒计时</div>
          <div class="countdown-value">245<span class="countdown-unit">天</span></div>
          <div class="countdown-date">2025年12月21日 星期六</div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-tabs">
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
      <div class="tab-content" v-if="activeTab === 'specialized-practice'">
        <div class="practice-card">
          <h3 class="card-title">自定义练习</h3>

          <div class="form-group">
            <div class="form-label">科目选择</div>
            <div class="radio-group">
              <label class="custom-radio" :class="{ 'radio-checked': selectedSubject === '英语' }">
                <input type="radio" v-model="selectedSubject" value="英语" />
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
                :class="{ 'radio-checked': selectedSubject === '专业课' }"
              >
                <input type="radio" v-model="selectedSubject" value="专业课" />
                <span class="radio-text">计算机学科专业课</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <div class="form-label">题型选择</div>
            <div class="radio-group" v-if="selectedSubject === '英语'">
              <label
                class="custom-radio"
                :class="{ 'radio-checked': selectedquestionType === '完型填空' }"
              >
                <input type="radio" v-model="selectedquestionType" value="完型填空" />
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
                :class="{ 'radio-checked': selectedquestionType === '小作文' }"
              >
                <input type="radio" v-model="selectedquestionType" value="小作文" />
                <span class="radio-text">小作文</span>
              </label>
              <label
                class="custom-radio"
                :class="{ 'radio-checked': selectedquestionType === '大作文' }"
              >
                <input type="radio" v-model="selectedquestionType" value="大作文" />
                <span class="radio-text">大作文</span>
              </label>
            </div>

            <div class="radio-group" v-if="selectedSubject === '思想政治'">
              <label
                class="custom-radio"
                :class="{ 'radio-checked': selectedquestionType === '1' }"
              >
                <input type="radio" v-model="selectedquestionType" value="1" />
                <span class="radio-text">1道题</span>
              </label>
            </div>

            <div class="radio-group" v-if="selectedSubject === '专业课'">
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
            </div>
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

          <button class="primary-button start-practice-btn" @click="startPractice">开始练习</button>
        </div>
      </div>

      <!-- 历年真题内容 -->
      <div class="tab-content" v-if="activeTab === 'past-exams'">
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

        <div class="paper-grid">
          <div v-for="(paper, index) in filteredPapers" :key="index" class="paper-card">
            <div class="paper-image">
              <img :src="paper.imageUrl" alt="试卷封面" />
            </div>
            <div class="paper-info">
              <h3 class="paper-title">{{ paper.title }}</h3>
              <p class="paper-description">{{ paper.description }}</p>
              <div class="paper-actions">
                <button class="primary-button" @click="openExamDialog(paper)">使用试卷</button>
                <button class="outline-button" @click="previewPaper(paper.id)">预览</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 考试对话框 -->
    <div class="modal-overlay" v-if="isExamDialogVisible" @click="isExamDialogVisible = false">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">开始考试</h3>
          <button class="modal-close" @click="isExamDialogVisible = false">×</button>
        </div>
        <div class="modal-body">
          <img :src="currentExamPaper.imageUrl" alt="试卷封面" class="modal-image" />
          <p class="modal-description">{{ currentExamPaper.description }}</p>
        </div>
        <div class="modal-footer">
          <button class="outline-button" @click="isExamDialogVisible = false">取消</button>
          <button class="primary-button" @click="startExam(currentExamPaper.id)">开始考试</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('specialized-practice')
const selectedSubject = ref('英语')
const selectedquestionType = ref('完型填空')
const selectedCount = ref('1')

// 模拟试卷数据
const papers = ref([
  {
    id: 1,
    title: '2024年考研数学一模拟试卷',
    description: '适合数学与应用数学、计算数学等学科专业的考生备考',
    category: 'math',
    imageUrl:
      'https://img1.baidu.com/it/u=1179842283,3228312369&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333'
  },
  {
    id: 2,
    title: '计算机学科 数据结构专题',
    description: '涵盖树、图、排序算法等重点考察内容',
    category: 'professional',
    imageUrl:
      'https://img1.baidu.com/it/u=2268689860,2470329386&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500'
  },
  {
    id: 3,
    title: '2023年专业课真题解析',
    description: '包含详细解答及考点分析',
    category: 'professional',
    imageUrl:
      'https://img2.baidu.com/it/u=3395592570,3040142441&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500'
  },
  {
    id: 4,
    title: '思想政治理论考研热点',
    description: '重点难点专项练习',
    category: 'politics',
    imageUrl:
      'https://img0.baidu.com/it/u=3645644055,1992011811&fm=253&fmt=auto&app=138&f=JPEG?w=794&h=500'
  },
  {
    id: 5,
    title: '英语二全真模拟',
    description: '考研英语阅读理解专项训练',
    category: 'english',
    imageUrl:
      'https://img2.baidu.com/it/u=1664294230,2438572169&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500'
  },
  {
    id: 6,
    title: '近五年政治真题汇编',
    description: '历年真题解析及答题技巧',
    category: 'politics',
    imageUrl:
      'https://img0.baidu.com/it/u=2768645936,2195354502&fm=253&fmt=auto&app=138&f=JPEG?w=888&h=500'
  },
  {
    id: 7,
    title: '计算机网络与操作系统',
    description: '计算机专业核心知识点练习',
    category: 'professional',
    imageUrl:
      'https://img1.baidu.com/it/u=997886866,3785565363&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500'
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
  console.log('开始考试，试卷id：', paperId)
  isExamDialogVisible.value = false
  router.push({ path: '/exam/exam', query: { paperId, type: 'real' } })
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
      questionType: selectedquestionType.value === '1' ? '材料分析题' : selectedquestionType.value,
      count: selectedCount.value,
      type: 'practice'
    }
  })
}

// 预览试卷的方法
const previewPaper = (paperId: number) => {
  console.log('预览试卷，试卷id：', paperId)
  // 实现预览试卷内容
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
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 28px;
  color: #262626;
  margin-bottom: 8px;
  font-weight: 500;
}

.page-description {
  font-size: 14px;
  color: #8c8c8c;
  max-width: 600px;
}

/* 倒计时卡片 */
.countdown-wrapper {
  min-width: 200px;
}

.countdown-card {
  background: linear-gradient(135deg, #1677ff 0%, #0958d9 100%);
  border-radius: 8px;
  padding: 16px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.countdown-title {
  font-size: 14px;
  margin-bottom: 8px;
  opacity: 0.9;
}

.countdown-value {
  font-size: 32px;
  font-weight: 600;
  margin: 4px 0 8px;
}

.countdown-unit {
  font-size: 16px;
  font-weight: normal;
  margin-left: 4px;
  opacity: 0.9;
}

.countdown-date {
  font-size: 12px;
  opacity: 0.7;
}

/* 内容标签页 */
.content-tabs {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  overflow: hidden;
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
}

.tab-item:hover {
  color: #1677ff;
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

.custom-radio:hover .radio-text {
  border-color: #1677ff;
  color: #1677ff;
}

.radio-checked .radio-text {
  background-color: #e6f4ff;
  border-color: #1677ff;
  color: #1677ff;
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
}

.primary-button:hover {
  background-color: #0958d9;
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.2);
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

.start-practice-btn {
  display: block;
  width: 200px;
  margin: 0 auto;
}

/* 历年真题筛选 */
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

/* 试卷卡片网格 */
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
}

.paper-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
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

/* 响应式样式 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .countdown-wrapper {
    margin-top: 16px;
    width: 100%;
  }

  .form-group,
  .radio-group {
    flex-direction: column;
  }

  .paper-grid {
    grid-template-columns: 1fr;
  }
}
</style>
