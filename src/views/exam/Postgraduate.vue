<template>
  <div class="postgraduate-center">
    <h2>考试中心</h2>
    <el-tabs v-model="activeTab" class="custom-tabs">
      <el-tab-pane label="专项练习" name="specialized-practice">
        <el-card>
          <el-form>
            <div class="setting-item">
              <span>题目类型：</span>
              <el-radio-group v-model="selectedSubject">
                <el-radio label="英语">英语</el-radio>
                <el-radio label="思想政治">思想政治</el-radio>
                <el-radio label="专业课">计算机学科专业课</el-radio>
              </el-radio-group>
            </div>
            <div class="setting-item">
              <span>题型：</span>
              <template v-if="selectedSubject === '英语'">
                <el-radio-group v-model="selectedquestionType">
                  <el-radio label="完型填空">完型填空</el-radio>
                  <el-radio label="阅读理解">阅读理解</el-radio>
                  <el-radio label="序号匹配">序号匹配</el-radio>
                  <el-radio label="翻译">翻译</el-radio>
                  <el-radio label="小作文">小作文</el-radio>
                  <el-radio label="大作文">大作文</el-radio>
                </el-radio-group>
              </template>
              <template v-if="selectedSubject === '思想政治'">
                <el-radio-group v-model="selectedquestionType">
                  <el-radio label="1">1道题</el-radio>
                </el-radio-group>
              </template>
              <template v-if="selectedSubject === '计算机学科专业课'">
                <el-radio-group v-model="selectedquestionType">
                  <el-radio label="单选题">单选题</el-radio>
                  <el-radio label="多选题">多选题</el-radio>
                </el-radio-group>
              </template>
              <div class="setting-item">
                <span>题目数量：</span>
                <el-radio-group>
                  <el-radio label="1题">1题</el-radio>
                </el-radio-group>
              </div>
            </div>
          </el-form>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="历年真题" name="past-exams">
        <el-container>
          <el-header class="header">
            <el-button-group class="category-buttons">
              <el-button
                :type="currentCategory === 'all' ? 'primary' : ''"
                @click="filterCards('all')"
              >
                全部
              </el-button>

              <el-button
                :type="currentCategory === 'civil_service' ? 'primary' : ''"
                @click="filterCards('math')"
              >
                数学
              </el-button>
              <el-button
                :type="currentCategory === 'civil_service' ? 'primary' : ''"
                @click="filterCards('english')"
              >
                英语
              </el-button>
              <el-button
                :type="currentCategory === 'postgraduate' ? 'primary' : ''"
                @click="filterCards('politics')"
              >
                政治
              </el-button>
              <el-button
                :type="currentCategory === 'postgraduate' ? 'primary' : ''"
                @click="filterCards('professional')"
              >
                专业课
              </el-button>
            </el-button-group>
          </el-header>
          <el-main>
            <div class="card-container">
              <el-card v-for="(paper, index) in filteredPapers" :key="index" class="exam-card">
                <template #header>
                  <span>{{ paper.title }}</span>
                </template>
                <img :src="paper.imageUrl" alt="试卷封面" />
                <p>{{ paper.description }}</p>
                <el-button type="primary" @click="openExamDialog(paper)"> 使用试卷 </el-button>
                <el-button @click="previewPaper(paper.id)">预览</el-button>
              </el-card>
            </div>
          </el-main>
        </el-container>

        <!-- 考试对话框 -->
        <el-dialog v-model="isExamDialogVisible" title="开始考试">
          <img
            :src="currentExamPaper.imageUrl"
            alt="试卷封面"
            style="width: 100%; height: 200px; object-fit: cover; margin-bottom: 10px"
          />
          <p>{{ currentExamPaper.description }}</p>
          <div style="text-align: right; margin-top: 20px">
            <el-button @click="isExamDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="startExam(currentExamPaper.id)">开始考试</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
const selectedquestionType = ref('1')
import { ref, computed } from 'vue'
import {
  ElContainer,
  ElHeader,
  ElMain,
  ElButton,
  ElButtonGroup,
  ElCard,
  ElDialog
} from 'element-plus'
import router from '@/router'

const activeTab = ref('specialized-practice')
const selectedSubject = ref('英语')

// 模拟试卷数据
const papers = ref([
  {
    id: 1,
    title: '数学试卷1',
    description: '涵盖考公基础题型',
    category: 'math',
    imageUrl:
      'https://tse3-mm.cn.bing.net/th/id/OIP-C.pYapKznQKH66UYxie9jeVAHaHa?w=179&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7'
  },
  {
    id: 2,
    title: '计算机专业试卷',
    description: '选择题',
    category: 'professional',
    imageUrl:
      'https://tse3-mm.cn.bing.net/th/id/OIP-C.pYapKznQKH66UYxie9jeVAHaHa?w=179&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7'
  },
  {
    id: 3,
    title: '专业卷',
    description: '考研模拟卷',
    category: 'professional',
    imageUrl:
      'https://tse3-mm.cn.bing.net/th/id/OIP-C.pYapKznQKH66UYxie9jeVAHaHa?w=179&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7'
  },
  {
    id: 4,
    title: '政治试卷',
    description: '专项练习',
    category: 'politics',
    imageUrl:
      'https://tse3-mm.cn.bing.net/th/id/OIP-C.pYapKznQKH66UYxie9jeVAHaHa?w=179&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7'
  },
  {
    id: 5,
    title: '英语试卷',
    description: '考研英语专项练习',
    category: 'english',
    imageUrl:
      'https://tse3-mm.cn.bing.net/th/id/OIP-C.pYapKznQKH66UYxie9jeVAHaHa?w=179&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7'
  },
  {
    id: 6,
    title: '政治试卷',
    description: '考研英语专项练习',
    category: 'politics',
    imageUrl:
      'https://tse3-mm.cn.bing.net/th/id/OIP-C.pYapKznQKH66UYxie9jeVAHaHa?w=179&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7'
  },
  {
    id: 7,
    title: '计算机专业卷子',
    description: '卷子',
    category: 'professional',
    imageUrl:
      'https://tse3-mm.cn.bing.net/th/id/OIP-C.pYapKznQKH66UYxie9jeVAHaHa?w=179&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7'
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
const currentExamPaper = ref<any>()

// 打开考试对话框
const openExamDialog = (paper: any) => {
  currentExamPaper.value = paper
  isExamDialogVisible.value = true
}

// 模拟开始考试的方法
const startExam = (paperId: number) => {
  console.log('开始考试，试卷id：', paperId)
  isExamDialogVisible.value = false
  router.push({ path: '/exam/exam', query: { paperId } })
}

// 模拟预览试卷的方法
const previewPaper = (paperId: number) => {
  console.log('预览试卷，试卷id：', paperId)
  // 这里后续可以添加预览试卷内容等逻辑
}
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
  font-size: 20px;
}
.postgraduate-center {
  padding: 0 60px;
}
.el-tabs {
  margin-top: 40px;
  width: 100%;
}

/* 自定义tab样式 */
.custom-tabs .el-tabs__nav-wrap::after {
  background-color: #e4e7ed; /* 下划线颜色 */
  height: 1px;
}

.custom-tabs .el-tabs__item {
  font-size: 24px;
  color: white; /* 默认标签文字颜色 */
  padding: 0 20px;
  height: 50px;
  line-height: 50px;
  display: inline-block;
  list-style: none;
  position: relative;
  box-sizing: border-box;
  background-color: green; /* 默认背景颜色 */
  border-radius: 8px 8px 0 0; /* 圆角 */
  border: 2px solid transparent; /* 边框 */
  transition: all 0.3s ease; /* 平滑过渡 */
}

.custom-tabs .el-tabs__item.is-active {
  color: green; /* 激活标签文字颜色 */
  background-color: white; /* 激活标签背景颜色 */
  border-bottom-color: white; /* 底部边框颜色设为白色以覆盖父元素背景 */
  border: 2px solid green; /* 激活状态下的边框 */
}

.custom-tabs .el-tabs__item:hover {
  color: black; /* 鼠标悬停时的文字颜色 */
  border: 2px solid green; /* 鼠标悬停时的边框 */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.category-buttons {
  margin-left: auto;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  max-width: 100%;
}

.exam-card {
  flex: 1 1 calc(300px + 20px);
  max-width: calc(300px + 20px);
  box-sizing: border-box;
}

.exam-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  margin-bottom: 10px;
  display: block;
}

.exam-card p {
  margin-bottom: 10px;
}

.el-main {
  margin: 0;
  padding: 0;
  /* 去除 el-main 的内边距 */
  overflow: hidden;
  /* 确保内容不会超出容器 */
}

.content {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.card-container {
  padding: 0 20px;
}
.el-button > span {
  align-items: center;
  display: inline-flex;
  padding: 8px;
}
</style>
