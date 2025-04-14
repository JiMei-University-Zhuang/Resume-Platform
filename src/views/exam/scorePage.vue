<template>
  <div class="history-score-page">
    <div class="header-container">
      <h1 class="page-title">历史分数</h1>
      <div class="filter-container" style="width: 150px">
        <el-select v-model="selectedType" placeholder="选择类型">
          <el-option label="全部" value=""></el-option>
          <el-option label="练习" value="练习"></el-option>
          <el-option label="考试" value="考试"></el-option>
        </el-select>
      </div>
    </div>
    <el-card class="score-card">
      <el-table :data="currentPageFilteredScoreList" border stripe class="score-table">
        <el-table-column prop="createTime" label="考试时间"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="score" label="考试分数"></el-table-column>
        <el-table-column prop="record" label="记录次数"></el-table-column>
      </el-table>
    </el-card>
    <el-pagination
      v-if="filteredTotal > 0"
      :total="filteredTotal"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="handleCurrentChange"
      layout="prev, pager, next"
      class="pagination-style"
    />
  </div>
</template>

<script setup lang="ts">
import { getUser } from '@/api/user'
import { getScore, ScoregetData } from '@/api/exam'
import { ref, computed } from 'vue'

// 定义成绩数据接口
interface ScoreItem {
  createTime: string
  type: string
  score: number
  record: number
}

const scoreList = ref<ScoreItem[]>([])
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const selectedType = ref('')

// 计算过滤后的成绩列表
const filteredScoreList = computed(() => {
  let tempList = scoreList.value
  if (selectedType.value) {
    tempList = tempList.filter(item => item.type === selectedType.value)
  }
  return tempList
})

// 计算过滤后的总数
const filteredTotal = computed(() => filteredScoreList.value.length)

// 计算当前页要展示的过滤后的数据
const currentPageFilteredScoreList = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filteredScoreList.value.slice(startIndex, endIndex)
})

const main = async () => {
  try {
    const userResponse = await getUser()
    const userId = userResponse.data.id

    // 第一次请求，获取练习成绩
    const practiceRequestData = {
      userId,
      type: '练习'
    } as ScoregetData
    const practiceResponse = await getScore(practiceRequestData)
    let practiceScoreList: ScoreItem[] = []
    if (practiceResponse.data) {
      practiceScoreList = practiceResponse.data.map((item: any) => ({
        createTime: item.createTime,
        type: item.type,
        score: item.score,
        record: item.record
      }))
    }

    // 第二次请求，获取考试成绩
    const examRequestData = {
      userId,
      type: '考试'
    } as ScoregetData
    const examResponse = await getScore(examRequestData)
    let examScoreList: ScoreItem[] = []
    if (examResponse.data) {
      examScoreList = examResponse.data.map((item: any) => ({
        createTime: item.createTime,
        type: item.type,
        score: item.score,
        record: item.record
      }))
    }

    // 合并练习成绩和考试成绩
    scoreList.value = [...practiceScoreList, ...examScoreList]
    // 按照 createTime 进行升序排序
    scoreList.value.sort((a, b) => {
      const timeA = new Date(a.createTime)
      const timeB = new Date(b.createTime)
      return timeA.getTime() - timeB.getTime()
    })
    total.value = scoreList.value.length
  } catch (error) {
    console.error('获取用户信息或成绩失败:', error)
  }
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
}
main()
</script>

<style scoped>
/* 整体页面样式 */
.history-score-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

/* 鼠标悬停时整体页面效果 */
.history-score-page:hover {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* 标题容器样式 */
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
}

/* 页面标题样式 */
.page-title {
  margin: 0;
  font-size: 2.25rem;
  color: #1f2937;
  font-weight: 700;
  letter-spacing: -0.025em;
}

/* 分页样式 */
.pagination-style {
  margin-left: auto;
  margin-top: 1rem;
}

/* 分页按钮悬停和聚焦效果 */
.pagination-style .el-pagination__item:hover,
.pagination-style .el-pagination__item:focus {
  color: #007bff;
}

/* 成绩卡片样式 */
.score-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: #ffffff;
  transition: all 0.3s ease;
}

/* 鼠标悬停时成绩卡片效果 */
.score-card:hover {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* 表格样式 */
.score-table {
  width: 100%;
  border-collapse: collapse;
}

.score-table thead {
  background-color: #007bff;
  color: #ffffff;
  font-weight: 500;
}

.score-table tbody {
  background-color: #ffffff;
}

.score-table th,
.score-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

/* 表格行悬停效果 */
.score-table tbody tr:hover {
  background-color: #f3f4f6;
}

/* 筛选容器样式 */
.filter-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* 选择框样式 */
.filter-container .el-select {
  width: 100%;
}

/* 选择框悬停和聚焦效果 */
.filter-container .el-select:hover .el-input__inner,
.filter-container .el-select:focus .el-input__inner {
  border-color: #007bff;
}
</style>
