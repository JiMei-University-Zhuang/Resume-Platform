<template>
  <div class="history-score-page">
    <div class="header-container">
      <h1 class="page-title">我的分数</h1>
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
.history-score-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  margin: 0;
  font-size: 28px;
  color: #303133;
}

.pagination-style {
  margin-left: auto;
}

.score-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.score-table {
  width: 100%;
}

.score-table thead {
  background-color: #f4f4f4;
  color: #303133;
}

.score-table tbody {
  background-color: #fff;
}

.filter-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input {
  flex: 1;
}
</style>
