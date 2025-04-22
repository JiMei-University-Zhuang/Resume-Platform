<template>
  <div class="dashboard">
    <!-- 鼠标特效组件 -->
    <MouseEffects />

    <!-- 顶部欢迎区域 -->
    <div class="hero-section">
      <div class="robot-container">
        <div class="particles-background"></div>
        <div class="robot-glow"></div>
        <img src="@/assets/images/robot.png" alt="AI Robot" class="robot-image" />
      </div>
      <div class="welcome-content">
        <div class="platform-logo">
          <span class="logo-text">{{ t('dashboard.careerPlatform') }}</span>
        </div>
        <h1 class="welcome-title">{{ t('dashboard.intelligentPlanning') }}</h1>
        <p class="welcome-subtitle">{{ t('dashboard.platformDescription') }}</p>
        <div class="hero-actions">
          <el-button
            type="primary"
            size="large"
            class="get-started-btn"
            @click="navigateTo('/career-planning/learning-plan')"
            id="start-planning-btn"
          >
            {{ t('dashboard.startPlanning') }}
            <el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </el-button>
          <el-button type="success" size="large" class="tour-btn" @click="startTour">
            <el-icon><Guide /></el-icon>
            {{ t('dashboard.guidedTour')}}
          </el-button>
          <el-button type="default" size="large" class="learn-more-btn" @click="scrollToFeatures">
            {{ t('dashboard.learnMore') }}
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主要功能卡片区域 -->
    <div class="features-section" id="features-section">
      <h2 class="section-title">{{ t('dashboard.whatWeCanHelp') }}</h2>

      <el-row :gutter="24">
        <!-- 职业分析卡片 -->
        <el-col :xs="24" :sm="12" :md="8">
          <el-card
            class="feature-card"
            shadow="hover"
            @click="navigateTo('/career-planning/analysis')"
            id="career-analysis-card"
          >
            <div class="card-content">
              <div class="card-icon">
                <el-icon><Aim /></el-icon>
              </div>
              <h3 class="card-title">{{ t('dashboard.careerAnalysis') }}</h3>
              <p class="card-description">
                {{ t('dashboard.careerAnalysisDesc') }}
              </p>
            </div>
            <div class="card-action">
              <el-button text
                >{{ t('dashboard.startAnalysis') }} <el-icon><ArrowRight /></el-icon
              ></el-button>
            </div>
          </el-card>
        </el-col>

        <!-- 发展规划卡片 -->
        <el-col :xs="24" :sm="12" :md="8">
          <el-card
            class="feature-card"
            shadow="hover"
            @click="navigateTo('/career-planning/roadmap')"
            id="development-plan-card"
          >
            <div class="card-content">
              <div class="card-icon">
                <el-icon><Guide /></el-icon>
              </div>
              <h3 class="card-title">{{ t('dashboard.developmentPlan') }}</h3>
              <p class="card-description">{{ t('dashboard.developmentPlanDesc') }}</p>
            </div>
            <div class="card-action">
              <el-button text
                >{{ t('dashboard.viewPath') }} <el-icon><ArrowRight /></el-icon
              ></el-button>
            </div>
          </el-card>
        </el-col>

        <!-- 职业推荐卡片 -->
        <el-col :xs="24" :sm="12" :md="8">
          <el-card
            class="feature-card"
            shadow="hover"
            @click="navigateTo('/career-planning/recommendation')"
            id="career-recommendation-card"
          >
            <div class="card-content">
              <div class="card-icon">
                <el-icon><StarFilled /></el-icon>
              </div>
              <h3 class="card-title">{{ t('dashboard.careerRecommendation') }}</h3>
              <p class="card-description">{{ t('dashboard.careerRecommendationDesc') }}</p>
            </div>
            <div class="card-action">
              <el-button text
                >{{ t('dashboard.getRecommendation') }} <el-icon><ArrowRight /></el-icon
              ></el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 平台数据统计 -->
    <div class="stats-section" id="stats-section">
      <h2 class="section-title">{{ t('dashboard.platformData') }}</h2>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="12" :md="8">
          <div class="stat-card">
            <div class="stat-icon">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <h3 class="stat-value">25,000+</h3>
              <p class="stat-label">{{ t('dashboard.usersCompleted') }}</p>
            </div>
          </div>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8">
          <div class="stat-card">
            <div class="stat-icon">
              <el-icon><Briefcase /></el-icon>
            </div>
            <div class="stat-info">
              <h3 class="stat-value">500+</h3>
              <p class="stat-label">{{ t('dashboard.careerTypesCount') }}</p>
            </div>
          </div>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8">
          <div class="stat-card">
            <div class="stat-icon">
              <el-icon><DocumentChecked /></el-icon>
            </div>
            <div class="stat-info">
              <h3 class="stat-value">98%</h3>
              <p class="stat-label">{{ t('dashboard.userSatisfaction') }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 平台优势区域 -->
    <div class="advantages-section" id="advantages-section">
      <h2 class="section-title">{{ t('dashboard.platformAdvantages') }}</h2>
      <div class="advantages-container">
        <div class="advantage-card">
          <div class="advantage-icon">
            <el-icon><Cpu /></el-icon>
          </div>
          <h3 class="advantage-title">{{ t('dashboard.aiAnalysis') }}</h3>
          <p class="advantage-description">
            {{ t('dashboard.aiAnalysisDesc') }}
          </p>
        </div>

        <div class="advantage-card">
          <div class="advantage-icon">
            <el-icon><DataAnalysis /></el-icon>
          </div>
          <h3 class="advantage-title">{{ t('dashboard.industryData') }}</h3>
          <p class="advantage-description">
            {{ t('dashboard.industryDataDesc') }}
          </p>
        </div>

        <div class="advantage-card">
          <div class="advantage-icon">
            <el-icon><UserFilled /></el-icon>
          </div>
          <h3 class="advantage-title">{{ t('dashboard.personalization') }}</h3>
          <p class="advantage-description">
            {{ t('dashboard.personalizationDesc') }}
          </p>
        </div>

        <div class="advantage-card">
          <div class="advantage-icon">
            <el-icon><SetUp /></el-icon>
          </div>
          <h3 class="advantage-title">{{ t('dashboard.comprehensiveService') }}</h3>
          <p class="advantage-description">
            {{ t('dashboard.comprehensiveServiceDesc') }}
          </p>
        </div>

        <div class="advantage-card">
          <div class="advantage-icon">
            <el-icon><DocumentChecked /></el-icon>
          </div>
          <h3 class="advantage-title">{{ t('dashboard.resumeOptimization') }}</h3>
          <p class="advantage-description">
            {{ t('dashboard.resumeOptimizationDesc') }}
          </p>
        </div>

        <div class="advantage-card">
          <div class="advantage-icon">
            <el-icon><Promotion /></el-icon>
          </div>
          <h3 class="advantage-title">{{ t('dashboard.continuousLearning') }}</h3>
          <p class="advantage-description">{{ t('dashboard.continuousLearningDesc') }}</p>
        </div>
      </div>
    </div>

    <!-- 其他功能展示 -->
    <div class="additional-features" id="additional-features">
      <h2 class="section-title">{{ t('dashboard.moreFeatures') }}</h2>

      <el-row :gutter="24">
        <!-- AI聊天 -->
        <el-col :xs="24" :sm="12">
          <el-card class="additional-card" shadow="hover" @click="navigateTo('/chat')">
            <div class="additional-content">
              <div class="additional-icon">
                <el-icon><ChatDotRound /></el-icon>
              </div>
              <div class="additional-info">
                <h3 class="additional-title">{{ t('dashboard.aiCareerAdvisor') }}</h3>
                <p class="additional-description">{{ t('dashboard.aiCareerAdvisorDesc') }}</p>
                <el-button text
                  >{{ t('dashboard.startChat') }} <el-icon><ArrowRight /></el-icon
                ></el-button>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 考试中心 -->
        <el-col :xs="24" :sm="12">
          <el-card
            class="additional-card"
            shadow="hover"
            @click="navigateTo('/exam/civil-service')"
          >
            <div class="additional-content">
              <div class="additional-icon">
                <el-icon><Reading /></el-icon>
              </div>
              <div class="additional-info">
                <h3 class="additional-title">{{ t('dashboard.examCenter') }}</h3>
                <p class="additional-description">{{ t('dashboard.examCenterDesc') }}</p>
                <el-button text
                  >{{ t('dashboard.enterCenter') }} <el-icon><ArrowRight /></el-icon
                ></el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 智能助手提示卡片 -->
    <el-card v-if="showSmartTips" class="smart-tips-card" shadow="hover" id="smart-tips-card">
      <template #header>
        <div class="card-header">
          <span class="header-title">
            <el-icon><Service /></el-icon>
            {{ t('dashboard.smartAssistantTips') }}
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
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MouseEffects from '@/components/MouseEffects/index.vue'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import {
  Aim,
  Guide,
  StarFilled,
  ArrowRight,
  ArrowDown,
  User,
  Briefcase,
  DocumentChecked,
  Cpu,
  DataAnalysis,
  UserFilled,
  SetUp,
  ChatDotRound,
  Reading,
  Service,
  Close,
  InfoFilled,
  Promotion
} from '@element-plus/icons-vue'

// 初始化国际化
const { t } = useI18n()

// 创建路由实例
const router = useRouter()

// 跳转函数
const navigateTo = (path: string) => {
  router.push(path)
}

// 滚动到特性区域
const scrollToFeatures = () => {
  const featuresSection = document.querySelector('.features-section')
  if (featuresSection) {
    featuresSection.scrollIntoView({ behavior: 'smooth' })
  }
}

// 智能提示数据
const showSmartTips = ref(false)
const smartTips = ref<string[]>([])

// 初始化 driver.js
const driverObj = driver({
  showProgress: true,
  showButtons: ['next', 'previous', 'close'],
  steps: [
    {
      element: '.el-scrollbar',
      popover: {
        title: '侧边导航栏',
        description: '这里是功能导航区域，您可以通过它快速访问平台的各项功能。',
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '.header',
      popover: {
        title: '顶部导航栏',
        description: '这里提供了产品官网、全屏切换、语言切换、消息通知和用户信息等快捷操作。',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '#features-section',
      popover: {
        title: '内容区域',
        description: '这里展示了平台的核心功能和内容，您可以在这里开始您的职业规划之旅。',
        side: 'top',
        align: 'center'
      }
    }
  ],
  nextBtnText: t('dashboard.tourNextBtn') || '下一步',
  prevBtnText: t('dashboard.tourPrevBtn') || '上一步',
  doneBtnText: t('dashboard.tourDoneBtn') || '完成'
})

// 开始引导之旅
const startTour = () => {
  // 确保智能提示卡片显示，以便可以引导到该元素
  showSmartTips.value = true
  driverObj.drive()
}

// 用户行为预测模拟
class BehaviorPredictor {
  private usagePattern: Map<string, number> = new Map()
  private lastVisitedPage: string = ''

  recordVisit(page: string): void {
    this.lastVisitedPage = page
    const count = this.usagePattern.get(page) || 0
    this.usagePattern.set(page, count + 1)
  }

  async predictNextAction(hour: number, day: number): Promise<string> {
    // 根据时间和历史行为预测
    if (hour >= 9 && hour <= 12 && (day === 1 || day === 2)) {
      return '查看职业分析结果'
    } else if (hour >= 14 && hour <= 18 && day >= 3 && day <= 5) {
      return '完善您的简历'
    } else if (this.lastVisitedPage === '/career-planning/analysis') {
      return '生成职业发展规划'
    } else if (this.usagePattern.get('/resume/create') || 0 > 2) {
      return '探索更多简历模板'
    }
    return ''
  }

  getPatternAnalysis(): string[] {
    return [
      '我们发现多数用户在完成职业分析后会更新简历',
      '提示：定期更新您的技能和经验，可以获得更精准的职业建议'
    ]
  }
}

const behaviorPredictor = new BehaviorPredictor()

// 初始化用户行为数据
const initializeBehaviorData = () => {
  // 模拟历史访问数据
  behaviorPredictor.recordVisit('/dashboard')
  behaviorPredictor.recordVisit('/career-planning/analysis')
  behaviorPredictor.recordVisit('/resume/create')
}

// 更新智能提示
const updateSmartTips = async () => {
  const now = new Date()
  const predictedAction = await behaviorPredictor.predictNextAction(now.getHours(), now.getDay())

  showSmartTips.value = true
  smartTips.value = [
    predictedAction
      ? `根据您的使用习惯，推荐您现在${predictedAction}`
      : '欢迎使用AI职业规划平台！随着您的使用，我们会逐渐学习您的偏好，提供更精准的建议。',
    ...behaviorPredictor.getPatternAnalysis()
  ]
}

onMounted(async () => {
  initializeBehaviorData()
  await updateSmartTips()

  // 设置智能提示更新定时器
  const tipsInterval = setInterval(
    async () => {
      await updateSmartTips()
    },
    5 * 60 * 1000
  )

  // 清理定时器
  onUnmounted(() => {
    clearInterval(tipsInterval)
  })

  initRobotParticles()

  // 判断是否是首次访问或者URL参数中有tour=true
  const shouldStartTour =
    localStorage.getItem('dashboardTourShown') !== 'true' ||
    (typeof window !== 'undefined' && window.location.search.includes('tour=true'))

  if (shouldStartTour) {
    // 稍微延迟一下，确保所有DOM元素已经加载
    setTimeout(() => {
      startTour()
      // 设置标记，避免每次都自动显示引导
      localStorage.setItem('dashboardTourShown', 'true')
    }, 1000)
  }
})

// 初始化机器人区域的粒子动画
function initRobotParticles() {
  const container = document.querySelector('.particles-background') as HTMLElement
  if (!container) return

  // 创建粒子 - 减少粒子数量
  const particleCount = 30 // 从50减少到30
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    particle.className = 'robot-particle'

    // 随机位置
    const posX = Math.random() * 100
    const posY = Math.random() * 100

    // 随机大小 (1-3px) - 减小粒子大小
    const size = Math.random() * 2 + 1 // 从(1-4px)改为(1-3px)

    // 随机动画延迟
    const delay = Math.random() * 5

    // 随机动画持续时间 (7-12s) - 缩短动画时间
    const duration = 7 + Math.random() * 5 // 从(5-15s)改为(7-12s)

    // 设置样式
    particle.style.cssText = `
      left: ${posX}%;
      top: ${posY}%;
      width: ${size}px;
      height: ${size}px;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      opacity: 0.5; /* 降低初始透明度 */
    `

    container.appendChild(particle)
  }
}
</script>

<style scoped>
.dashboard {
  padding: 0;
  background-color: #f8f9fa;
  min-height: calc(100vh - 84px);
  overflow-x: hidden;
}

/* 顶部欢迎区域样式 */
.hero-section {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 80px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  overflow: hidden;
  height: 420px;
}

.robot-container {
  position: relative;
  width: 40%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  perspective: 1000px;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
  cursor: pointer;
}

.robot-container:hover {
  transform: scale(1.05) rotate(2deg);
}

.robot-container:hover .robot-glow {
  opacity: 0.8;
  transform: scale(1.1);
}

.robot-container:hover .robot-image {
  filter: brightness(1.1) saturate(1.2);
  transform: translateY(-10px) rotate(-3deg);
}

.particles-background {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: -1;
  overflow: hidden;
}

.robot-particle {
  position: absolute;
  background: radial-gradient(circle, rgba(64, 158, 255, 0.8) 0%, rgba(94, 200, 156, 0) 70%);
  border-radius: 50%;
  opacity: 0.6;
  animation: floatParticle 10s infinite ease-in-out;
}

@keyframes floatParticle {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.6;
  }
  25% {
    transform: translate(20px, -15px) scale(1.2);
    opacity: 0.8;
  }
  50% {
    transform: translate(-10px, 20px) scale(0.8);
    opacity: 0.4;
  }
  75% {
    transform: translate(-20px, -10px) scale(1.1);
    opacity: 0.7;
  }
}

.robot-glow {
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle,
    rgba(94, 200, 156, 0.3) 0%,
    rgba(64, 158, 255, 0.1) 50%,
    rgba(0, 0, 0, 0) 70%
  );
  border-radius: 50%;
  z-index: -1;
  opacity: 0.5;
  filter: blur(20px);
  transition: all 0.5s ease;
  animation: pulse 4s infinite ease-in-out;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
}

.robot-image {
  max-width: 280px;
  height: auto;
  animation: float 6s ease-in-out infinite;
  transition: all 0.5s ease;
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2));
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

.welcome-content {
  position: relative;
  z-index: 2;
  width: 60%;
  max-width: 600px;
}

.platform-logo {
  margin-bottom: 1.5rem;
}

.logo-text {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #5ec89c 0%, #409eff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 1px;
}

.welcome-title {
  font-size: 2.6rem;
  font-weight: 700;
  color: #303133;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #303133 0%, #409eff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1.2;
}

.welcome-subtitle {
  font-size: 1.2rem;
  color: #606266;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.get-started-btn,
.learn-more-btn,
.tour-btn {
  padding: 12px 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.get-started-btn:hover,
.learn-more-btn:hover,
.tour-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.get-started-btn {
  background: linear-gradient(90deg, #409eff, #5ac8ff);
  border: none;
}

.tour-btn {
  background: linear-gradient(90deg, #67c23a, #95d475);
  border: none;
}

/* 修改driver.js默认样式，确保与我们的UI风格一致 */
:global(.driver-popover) {
  border-radius: 12px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
}

:global(.driver-popover-title) {
  font-family: var(--el-font-family) !important;
  font-weight: 600 !important;
  font-size: 1.2rem !important;
  color: #303133 !important;
}

:global(.driver-popover-description) {
  font-family: var(--el-font-family) !important;
  color: #606266 !important;
  font-size: 1rem !important;
  line-height: 1.6 !important;
}

:global(.driver-popover-footer button) {
  border-radius: 6px !important;
  padding: 8px 16px !important;
  font-weight: 500 !important;
  transition: all 0.3s !important;
}

:global(.driver-popover-footer .driver-next-btn) {
  background-color: #409eff !important;
}

:global(.driver-popover-footer .driver-prev-btn) {
  color: #606266 !important;
  background-color: #f2f3f5 !important;
}

:global(.driver-popover-footer .driver-close-btn) {
  color: #606266 !important;
  background-color: #f2f3f5 !important;
}

/* 功能区域样式 */
.features-section,
.stats-section,
.additional-features {
  padding: 60px 80px;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 40px;
  text-align: center;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #5ec89c, #67c23a);
  transform: translateX(-50%);
}

/* 功能卡片样式 */
.feature-card {
  height: 280px;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 20px;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.card-content {
  padding: 30px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-icon {
  font-size: 36px;
  margin-bottom: 20px;
  color: #5ec89c;
  background: rgba(94, 200, 156, 0.1);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 15px;
}

.card-description {
  font-size: 1rem;
  color: #606266;
  line-height: 1.6;
}

.card-action {
  padding: 15px 30px;
  border-top: 1px solid #ebeef5;
  text-align: right;
}

/* 统计区域样式 */
.stats-section {
  background-color: #f0f2f5;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 30px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 32px;
  color: #5ec89c;
  margin-right: 25px;
  background: rgba(94, 200, 156, 0.1);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  flex-grow: 1;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #303133;
  margin: 0 0 5px 0;
}

.stat-label {
  font-size: 1rem;
  color: #606266;
  margin: 0;
}

/* 其他功能卡片 */
.additional-card {
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  margin-bottom: 20px;
}

.additional-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.additional-card .el-card__body {
  height: 100%;
  padding: 0;
}

.additional-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
}

.additional-icon {
  font-size: 32px;
  color: #5ec89c;
  margin-right: 25px;
  background: rgba(94, 200, 156, 0.1);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.additional-info {
  flex-grow: 1;
}

.additional-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;
}

.additional-description {
  font-size: 1rem;
  color: #606266;
  line-height: 1.5;
  margin-bottom: 15px;
}

/* 智能提示卡片样式 */
.smart-tips-card {
  margin: 0 80px 60px 80px;
  background-color: #fff;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.smart-tips-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.tips-content {
  padding: 16px 20px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
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
  color: #5ec89c;
  margin-top: 2px;
  flex-shrink: 0;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .hero-section {
    padding: 40px;
    flex-direction: column;
    height: auto;
  }

  .robot-container {
    width: 100%;
    margin-bottom: 30px;
  }

  .welcome-content {
    width: 100%;
    max-width: 100%;
  }

  .features-section,
  .stats-section,
  .additional-features,
  .advantages-section,
  .footer {
    padding: 40px;
  }

  .smart-tips-card {
    margin: 0 40px 40px 40px;
  }

  .welcome-title {
    font-size: 2.2rem;
  }

  .footer-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .footer-logo {
    margin-bottom: 30px;
  }

  .footer-links {
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 30px 20px;
  }

  .hero-actions {
    flex-direction: column;
    gap: 10px;
  }

  .features-section,
  .stats-section,
  .additional-features,
  .advantages-section,
  .footer {
    padding: 30px 20px;
  }

  .smart-tips-card {
    margin: 0 20px 30px 20px;
  }

  .welcome-title {
    font-size: 1.8rem;
  }

  .welcome-subtitle {
    font-size: 1rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .advantages-container {
    grid-template-columns: 1fr;
  }

  .footer-links {
    flex-direction: column;
    gap: 30px;
  }
}

/* 平台优势区域样式 */
.advantages-section {
  padding: 60px 80px;
  background-color: #fff;
}

.advantages-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.advantage-card {
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
  text-align: center;
}

.advantage-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  background-color: #fff;
}

.advantage-icon {
  font-size: 36px;
  color: #409eff;
  background: rgba(64, 158, 255, 0.1);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.advantage-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 15px;
}

.advantage-description {
  font-size: 1rem;
  color: #606266;
  line-height: 1.6;
}

/* 媒体查询适配 */
@media (max-width: 1024px) {
  .advantages-section {
    padding: 40px;
  }
}

@media (max-width: 768px) {
  .advantages-section {
    padding: 30px 20px;
  }

  .advantages-container {
    grid-template-columns: 1fr;
  }
}

/* 页脚样式 */
.footer {
  padding: 60px 80px;
  background-color: #fff;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer-slogan {
  font-size: 1rem;
  color: #606266;
  margin-top: 10px;
}

.footer-links {
  display: flex;
  gap: 80px;
}

.links-group {
  display: flex;
  flex-direction: column;
}

.links-group h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}

.links-group ul {
  list-style: none;
  padding: 0;
}

.links-group ul li {
  margin-bottom: 10px;
}

.links-group ul li a {
  color: #606266;
  text-decoration: none;
}

.footer-bottom {
  margin-top: 40px;
  text-align: center;
}

.copyright {
  font-size: 1rem;
  color: #606266;
}
</style>
