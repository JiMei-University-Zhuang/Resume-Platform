<template>
  <div class="dashboard">
    <h1 class="dashboard-title">系统概览</h1>
    
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="dashboard-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="header-title">
                <el-icon><User /></el-icon>
                数据统计
              </span>
            </div>
          </template>
          <div class="card-content">
            <el-statistic title="活跃用户" :value="1234">
              <template #suffix>
                <span class="suffix-label">人</span>
              </template>
            </el-statistic>
            <div class="trend-info">
              <el-tag type="success" effect="plain">
                <el-icon><ArrowUp /></el-icon>
                较昨日增长 5.2%
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="dashboard-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="header-title">
                <el-icon><Monitor /></el-icon>
                系统状态
              </span>
            </div>
          </template>
          <div class="card-content">
            <el-statistic title="系统运行时间" :value="99.9" suffix="%">
              <template #prefix>
                <el-icon class="status-icon"><CircleCheck /></el-icon>
              </template>
            </el-statistic>
            <div class="trend-info">
              <el-tag type="info" effect="plain">
                运行正常
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="dashboard-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="header-title">
                <el-icon><List /></el-icon>
                任务完成
              </span>
            </div>
          </template>
          <div class="card-content">
            <el-progress 
              type="dashboard"
              :percentage="80"
              :stroke-width="8"
              :width="120"
              :show-text="true"
              :color="progressColor"
            />
            <div class="trend-info">
              <el-tag type="warning" effect="plain">
                还有 3 个任务待处理
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 智能助手提示卡片 -->
    <el-card v-if="showSmartTips" class="smart-tips-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="header-title">
            <el-icon><Warning /></el-icon>
            智能助手提示
          </span>
          <el-button type="text" @click="showSmartTips = false">
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
      </template>
      <div class="tips-content">
        <div v-for="(tip, index) in smartTips" :key="index" class="tip-item">
          <el-icon><InfoFilled /></el-icon>
          {{ tip }}
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { behaviorPredictor } from '@/utils/userBehaviorPredictor'
import { 
  User,
  Monitor,
  List,
  Warning,
  Close,
  InfoFilled,
  ArrowUp,
  CircleCheck,
} from '@element-plus/icons-vue'

const showSmartTips = ref(false)
const smartTips = ref<string[]>([])

// 进度条颜色
const progressColor = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 }
]

// 添加一些模拟的用户行为数据
const initializeBehaviorData = () => {
  const actions = ['查看仪表盘', '查看用户列表', '系统设置', '查看日志']
  const now = new Date()
  
  // 记录一些模拟的用户行为
  for (let i = 0; i < 20; i++) {
    const randomAction = actions[Math.floor(Math.random() * actions.length)]
    behaviorPredictor.recordAction(randomAction)
  }
}

const updateSmartTips = async () => {
  const now = new Date()
  console.log('Updating smart tips...')
  
  const predictedAction = await behaviorPredictor.predictNextAction(
    now.getHours(),
    now.getDay()
  )
  
  console.log('Predicted action:', predictedAction)
  
  showSmartTips.value = true
  smartTips.value = [
    predictedAction 
      ? `根据您的使用习惯，现在可能需要${predictedAction}操作`
      : '欢迎使用智能助手！随着您的使用，我会逐渐学习您的操作习惯。',
    ...behaviorPredictor.getPatternAnalysis()
  ]
}

onMounted(async () => {
  console.log('Component mounted')
  initializeBehaviorData()
  await updateSmartTips()
  setInterval(async () => {
    await updateSmartTips()
  }, 5 * 60 * 1000)
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 84px);
}

.dashboard-title {
  font-size: 24px;
  color: #303133;
  margin-bottom: 24px;
  font-weight: 600;
}

.dashboard-card {
  height: 100%;
  transition: all 0.3s;
}

.dashboard-card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
}

.card-content {
  padding: 20px 0;
  text-align: center;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.trend-info {
  margin-top: 16px;
}

.suffix-label {
  margin-left: 4px;
  font-size: 14px;
  color: #909399;
}

.status-icon {
  color: #67C23A;
  margin-right: 8px;
}

.smart-tips-card {
  margin-top: 20px;
  background-color: #fff;
  transition: all 0.3s;
}

.smart-tips-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tips-content {
  padding: 16px 0;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  color: #606266;
  line-height: 1.5;
  border-bottom: 1px dashed #ebeef5;
}

.tip-item:last-child {
  border-bottom: none;
}

.tip-item .el-icon {
  color: #409EFF;
  flex-shrink: 0;
}

:deep(.el-statistic__number) {
  font-size: 28px !important;
  font-weight: 600;
  color: #303133;
}

:deep(.el-statistic__title) {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

:deep(.el-progress__text) {
  font-size: 20px !important;
  font-weight: 600;
}

.el-row {
  margin-bottom: 0 !important;
}

.el-col {
  margin-bottom: 20px;
}
</style>