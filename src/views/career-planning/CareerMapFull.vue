<template>
  <div class="career-map-container">
    <!-- 全屏控制和返回主页按钮 -->
    <div class="screen-controls">
      <div class="control-button fullscreen-control" @click="toggleFullScreen">
        <el-icon size="24">
          <FullScreen v-if="!isFullscreen" />
          <Close v-else />
        </el-icon>
      </div>
      <div class="control-button home-control" @click="returnHome">
        <el-icon size="24"><HomeFilled /></el-icon>
      </div>
    </div>

    <!-- 头部 -->
    <header class="header">
      <div class="header-left">
        <div class="header-decoration"></div>
      </div>
      <div class="header-center">
        <h1 class="title">职业星图</h1>
      </div>
      <div class="header-right">
        <div class="header-decoration"></div>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="content-area">
      <transition name="panel-slide">
        <div class="user-panel" v-if="showUserPanel">
          <div class="panel-header">
            <h2>技能概览</h2>
            <button class="close-button" @click="toggleUserPanel">
              <Icon name="close" />
            </button>
          </div>

          <div class="skill-tags">
            <div
              v-for="skill in userSkills"
              :key="skill.id"
              class="skill-tag"
              :style="{ '--skill-color': skill.color }"
            >
              <div class="skill-name">{{ skill.name }}</div>
              <div class="skill-level">
                <div class="skill-level-bar" :style="{ width: `${skill.level * 20}%` }"></div>
                <div class="skill-level-text">{{ getSkillLevelText(skill.level) }}</div>
              </div>
            </div>
          </div>

          <div class="panel-footer">
            <button class="secondary-button" @click="toggleAssistant">
              <Icon name="message-circle" />
              AI 职业顾问
            </button>
          </div>
        </div>
      </transition>

      <div class="star-map-wrapper">
        <CareerStarMap
          :careers="careerOptions"
          :user-position="userCareerPosition"
          :initial-selected-id="selectedCareer?.id"
          @select-career="selectCareer"
          @explore-career="exploreCareerPath"
          @ai-advice="toggleAssistant"
        />
      </div>
    </main>

    <transition name="fade">
      <div class="ai-assistant-overlay" v-if="showAssistant" @click.self="toggleAssistant">
        <AIAssistant @close="toggleAssistant" :context="currentCareerContext" />
      </div>
    </transition>

    <transition name="slide-up">
      <div class="career-detail-panel" v-if="selectedCareer && !showCareerFullDetails">
        <div class="panel-glow"></div>
        <div class="panel-content">
          <div class="career-title">
            <Icon name="star" class="career-icon" />
            <h2>{{ selectedCareer.title }}</h2>
          </div>

          <div class="career-stats">
            <div class="stat">
              <div class="stat-icon-bg match-bg">
                <Icon name="target" />
              </div>
              <div class="stat-info">
                <span class="label">匹配度</span>
                <span class="value highlight"
                  >{{ Math.round(selectedCareer.matchScore * 100) }}%</span
                >
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: Math.round(selectedCareer.matchScore * 100) + '%' }"
                  ></div>
                </div>
              </div>
            </div>

            <div class="stat">
              <div class="stat-icon-bg trend-bg" :class="trendClass(selectedCareer.trend)">
                <Icon name="trending-up" v-if="selectedCareer.trend >= 0" />
                <Icon name="trending-down" v-else />
              </div>
              <div class="stat-info">
                <span class="label">需求趋势</span>
                <span class="value" :class="trendClass(selectedCareer.trend)">
                  {{ formatTrend(selectedCareer.trend) }}
                </span>
              </div>
            </div>

            <div class="stat">
              <div class="stat-icon-bg salary-bg">
                <Icon name="dollar-sign" />
              </div>
              <div class="stat-info">
                <span class="label">薪资区间</span>
                <span class="value">{{ selectedCareer.salaryRange }}</span>
              </div>
            </div>
          </div>

          <div class="action-buttons">
            <button class="primary-button" @click="createLearningPlan">
              <Icon name="bar-chart-2" class="button-icon" />
              <span>详细分析</span>
            </button>
            <button class="secondary-button" @click="selectedCareer = null">
              <Icon name="x" class="button-icon" />
              <span>关闭</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div class="fullscreen-details" v-if="showCareerFullDetails">
        <div class="details-container">
          <div class="details-header">
            <h2>{{ selectedCareer?.title }}</h2>
            <button class="close-button" @click="showCareerFullDetails = false">
              <Icon name="close" />
            </button>
          </div>

          <div class="details-content">
            <div class="details-section">
              <h3>职业概览</h3>
              <p class="career-description">{{ selectedCareer?.description }}</p>

              <div class="career-stats-detailed">
                <div class="stat-detailed">
                  <div class="stat-icon"><Icon name="percent" /></div>
                  <div class="stat-info">
                    <div class="stat-label">匹配度</div>
                    <div class="stat-value">
                      {{ Math.round((selectedCareer?.matchScore || 0) * 100) }}%
                    </div>
                  </div>
                </div>
                <div class="stat-detailed">
                  <div class="stat-icon">
                    <Icon name="trending-up" v-if="(selectedCareer?.trend || 0) >= 0" />
                    <Icon name="trending-down" v-else />
                  </div>
                  <div class="stat-info">
                    <div class="stat-label">需求趋势</div>
                    <div class="stat-value" :class="trendClass(selectedCareer?.trend || 0)">
                      {{ formatTrend(selectedCareer?.trend || 0) }}
                    </div>
                  </div>
                </div>
                <div class="stat-detailed">
                  <div class="stat-icon"><Icon name="dollar-sign" /></div>
                  <div class="stat-info">
                    <div class="stat-label">薪资区间</div>
                    <div class="stat-value">{{ selectedCareer?.salaryRange }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="details-section">
              <h3>技能差距分析</h3>
              <div class="skill-gap-analysis">
                <div
                  class="skill-item"
                  v-for="skill in selectedCareer?.requiredSkills"
                  :key="skill.id"
                >
                  <div class="skill-name">{{ skill.name }}</div>
                  <div class="skill-progress-container">
                    <div
                      class="skill-progress-bar"
                      :style="{ width: getUserSkillLevel(skill.id) + '%' }"
                    ></div>
                    <div
                      class="skill-progress-marker"
                      :style="{ left: skill.requiredLevel + '%' }"
                    ></div>
                  </div>
                  <div class="skill-levels">
                    <span>当前水平: {{ getUserSkillLevelText(skill.id) }}</span>
                    <span>所需水平: {{ getRequiredLevelText(skill.requiredLevel) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="details-section">
              <h3>发展路径</h3>
              <div class="career-path">
                <div class="path-node current">当前技能</div>
                <div class="path-line"></div>
                <div class="path-node training">技能提升</div>
                <div class="path-line"></div>
                <div class="path-node target">{{ selectedCareer?.title }}</div>
                <div class="path-line dashed"></div>
                <div class="path-node future">未来发展</div>
              </div>
            </div>
          </div>

          <div class="details-footer">
            <button class="primary-button" @click="createLearningPlan">制定学习计划</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import CareerStarMap from './components/CareerStarMap.vue'
import AIAssistant from './components/AIAssistant.vue'
import Icon from '@/components/Icon.vue'
import {
  fetchUserCareerData,
  fetchCareerOptions,
  type User,
  type Skill,
  type Career
} from './utils/careerMapData'
import { FullScreen, Close, HomeFilled } from '@element-plus/icons-vue'

const router = useRouter()

// 状态管理
const userData = ref<User | null>(null)
const userSkills = ref<Skill[]>([])
const careerOptions = ref<Career[]>([])
const userCareerPosition = ref({ x: 50, y: 50, z: 0 })
const selectedCareer = ref<Career | null>(null)
const showAssistant = ref(false)
const showUserPanel = ref(false)
const showCareerFullDetails = ref(false)

// 全屏控制
const isFullscreen = ref(false)
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
      isFullscreen.value = false
    }
  }
}

// 返回主页
const returnHome = () => {
  router.push('/dashboard')
}

// 当前职业上下文，用于AI助手
const currentCareerContext = computed(() => {
  if (selectedCareer.value) {
    return {
      career: selectedCareer.value,
      userSkills: userSkills.value,
      gapAnalysis: calculateSkillGap(userSkills.value, selectedCareer.value.requiredSkills)
    }
  }
  return { career: null, userSkills: userSkills.value, gapAnalysis: [] }
})

// 生命周期钩子
onMounted(async () => {
  // 获取用户数据
  const { user, skills } = await fetchUserCareerData()
  userData.value = user
  userSkills.value = skills

  // 获取职业选项
  careerOptions.value = await fetchCareerOptions(user, skills)

  // 默认选择第一个职业以便测试面板是否显示
  if (careerOptions.value.length > 0) {
    setTimeout(() => {
      selectCareer(careerOptions.value[0])
      console.log('CareerMap: Default career selected:', careerOptions.value[0].title)
    }, 500)
  }
})

// 方法
const toggleAssistant = () => {
  showAssistant.value = !showAssistant.value
  // 如果打开助手，关闭详情面板
  if (showAssistant.value) {
    showCareerFullDetails.value = false
  }
}

const toggleUserPanel = () => {
  showUserPanel.value = !showUserPanel.value
}

const selectCareer = (career: Career) => {
  selectedCareer.value = career
  showCareerFullDetails.value = false
  console.log('CareerMap: Selected career:', career?.title || 'null')
}

const getUserSkillLevel = (skillId: string | number) => {
  const skill = userSkills.value.find(s => s.id === skillId)
  return skill ? skill.level * 20 : 0 // 转换为百分比
}

const getUserSkillLevelText = (skillId: string | number) => {
  const level = getUserSkillLevel(skillId) / 20
  return ['无', '基础', '中级', '熟练', '精通', '专家'][Math.floor(level)]
}

const getRequiredLevelText = (level: number) => {
  return ['无', '基础', '中级', '熟练', '精通', '专家'][Math.floor(level / 20)]
}

const getSkillLevelText = (level: number) => {
  return ['无', '基础', '中级', '熟练', '精通', '专家'][Math.floor(level)]
}

const trendClass = (trend: number) => {
  if (trend > 10) return 'trend-high-up'
  if (trend > 0) return 'trend-up'
  if (trend < -10) return 'trend-high-down'
  if (trend < 0) return 'trend-down'
  return 'trend-stable'
}

const formatTrend = (trend: number) => {
  if (trend > 0) return `+${trend}%`
  return `${trend}%`
}

const calculateSkillGap = (userSkills: Skill[], requiredSkills: Career['requiredSkills']) => {
  // 实现技能差距计算逻辑
  return requiredSkills
    .map(reqSkill => {
      const userSkill = userSkills.find(s => s.id === reqSkill.id)
      const userLevel = userSkill ? userSkill.level : 0
      return {
        skill: reqSkill,
        currentLevel: userLevel,
        requiredLevel: reqSkill.requiredLevel / 20,
        gap: Math.max(0, reqSkill.requiredLevel / 20 - userLevel)
      }
    })
    .filter(item => item.gap > 0)
}

const exploreCareerPath = () => {
  // 跳转到职业推荐页面
  if (selectedCareer.value) {
    router.push(`/career-planning/recommendation?careerId=${selectedCareer.value.id}`)
  }
}

const createLearningPlan = () => {
  // 生成学习计划
  if (selectedCareer.value) {
    router.push(`/career-planning/learning-plan?careerId=${selectedCareer.value.id}`)
  }
}
</script>

<style scoped>
.career-map-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a0e1a 0%, #121a33 100%);
  color: #e0e0ff;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

/* 全屏和返回按钮样式 */
.screen-controls {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 15px;
  z-index: 1000;
}

.view-mode-controls {
  position: fixed;
  top: 80px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 999;
}

.control-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(16, 24, 48, 0.7);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(89, 131, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #5983ff;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}

.control-button:hover {
  background: rgba(89, 131, 255, 0.2);
  border-color: rgba(89, 131, 255, 0.6);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(89, 131, 255, 0.3);
}

.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  background: rgba(10, 14, 26, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(89, 131, 255, 0.2);
  z-index: 100;
}

.header-left,
.header-right {
  flex: 1;
  display: flex;
  align-items: center;
}

.header-center {
  text-align: center;
  width: 40%;
  padding: 0 20px;
}

.title {
  font-size: 28px;
  font-weight: bold;
  background: linear-gradient(to bottom, #fff, #5983ff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(89, 131, 255, 0.5);
  margin: 0;
  padding: 10px 0;
}

.content-area {
  flex: 1;
  position: relative;
  display: flex;
}

.user-panel {
  width: 300px;
  background: rgba(16, 24, 48, 0.75);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  padding: 20px;
  display: flex;
  flex-direction: column;
  z-index: 5;
  overflow-y: auto;
  height: calc(100vh - 60px);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-header h2 {
  margin: 0;
  font-size: 18px;
  color: rgba(224, 224, 255, 0.95);
}

.close-button {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.skill-tags {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.skill-tag {
  --skill-color: #5983ff;

  background: rgba(16, 24, 48, 0.6);
  border-radius: 8px;
  padding: 12px;
  border-left: 3px solid var(--skill-color);
}

.skill-name {
  font-size: 14px;
  font-weight: 500;
  color: rgba(224, 224, 255, 0.95);
  margin-bottom: 8px;
}

.skill-level {
  position: relative;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.skill-level-bar {
  height: 100%;
  background: var(--skill-color);
  border-radius: 3px;
  transition: width 0.8s ease;
}

.skill-level-text {
  position: absolute;
  right: 0;
  top: -20px;
  font-size: 12px;
  color: rgba(224, 224, 255, 0.7);
}

.panel-footer {
  margin-top: auto;
  display: flex;
  justify-content: center;
}

.secondary-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 6px;
  background: rgba(89, 131, 255, 0.15);
  color: rgba(224, 224, 255, 0.9);
  border: 1px solid rgba(89, 131, 255, 0.3);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.secondary-button:hover {
  background: rgba(89, 131, 255, 0.25);
  transform: translateY(-2px);
}

.star-map-wrapper {
  flex: 1;
  position: relative;
}

.ai-assistant-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 14, 26, 0.7);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.career-detail-panel {
  position: absolute;
  top: 80px;
  left: 20px;
  width: 380px;
  background: rgba(16, 24, 48, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(89, 131, 255, 0.2);
  z-index: 10;
  transform-origin: top right;
}

.panel-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  background: radial-gradient(
    circle at bottom right,
    rgba(89, 131, 255, 0.2),
    rgba(16, 24, 48, 0) 70%
  );
  z-index: 1;
  animation: pulse-glow 4s infinite alternate;
}

@keyframes pulse-glow {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.panel-content {
  position: relative;
  z-index: 2;
}

.career-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.career-title h2 {
  background: linear-gradient(135deg, #ffffff, #64b5f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(100, 181, 246, 0.4);
  font-size: 1.6rem;
  margin: 0;
}

.career-icon {
  font-size: 24px;
  color: rgba(89, 131, 255, 0.9);
}

.career-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-icon-bg {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.match-bg {
  background: rgba(255, 204, 0, 0.1);
}

.trend-bg {
  background: rgba(76, 217, 100, 0.1);
}

.salary-bg {
  background: rgba(255, 59, 48, 0.1);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-bottom: 4px;
}

.value {
  font-size: 1.2rem;
  font-weight: 600;
}

.highlight {
  color: #ffcc00;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-top: 4px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #5983ff);
  border-radius: 4px;
  transition: width 0.8s ease;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.primary-button,
.secondary-button {
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  flex: 1;
}

.primary-button {
  background: linear-gradient(135deg, #3498db, #5983ff);
  color: white;
}

.secondary-button {
  background: rgba(255, 255, 255, 0.1);
  color: #e0e0ff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.primary-button:hover,
.secondary-button:hover {
  transform: translateY(-2px);
}

.primary-button:hover {
  box-shadow: 0 6px 12px rgba(89, 131, 255, 0.3);
}

.secondary-button:hover {
  background: rgba(255, 255, 255, 0.15);
}

.button-icon {
  margin-right: 8px;
}

.fullscreen-details {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 14, 26, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.details-container {
  width: 800px;
  max-width: 90%;
  max-height: 90vh;
  background: rgba(16, 24, 48, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(89, 131, 255, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.details-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(10, 14, 26, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.details-header h2 {
  margin: 0;
  font-size: 24px;
  background: linear-gradient(135deg, #ffffff, #5983ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.details-content {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.details-section {
  margin-bottom: 30px;
}

.details-section h3 {
  font-size: 18px;
  color: rgba(224, 224, 255, 0.95);
  margin: 0 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.career-description {
  font-size: 15px;
  line-height: 1.6;
  color: rgba(224, 224, 255, 0.8);
  margin-bottom: 20px;
}

.career-stats-detailed {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.stat-detailed {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(26, 32, 58, 0.5);
  border-radius: 8px;
  border-left: 3px solid #5983ff;
}

.stat-icon {
  font-size: 24px;
  color: rgba(89, 131, 255, 0.9);
}

.skill-gap-analysis {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skill-item {
  margin-bottom: 15px;
}

.skill-name {
  font-weight: 500;
  margin-bottom: 8px;
  color: rgba(224, 224, 255, 0.9);
}

.skill-progress-container {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  position: relative;
  margin-bottom: 5px;
}

.skill-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #5983ff);
  border-radius: 4px;
  transition: width 0.8s ease;
}

.skill-progress-marker {
  position: absolute;
  top: -3px;
  width: 3px;
  height: 14px;
  background: rgba(255, 204, 0, 0.9);
  border-radius: 1px;
}

.skill-levels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: rgba(224, 224, 255, 0.7);
}

.career-path {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
}

.path-node {
  width: 120px;
  padding: 10px;
  text-align: center;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}

.path-node.current {
  background: rgba(89, 131, 255, 0.2);
  border: 1px solid rgba(89, 131, 255, 0.4);
  color: #e0e0ff;
}

.path-node.training {
  background: rgba(76, 217, 100, 0.2);
  border: 1px solid rgba(76, 217, 100, 0.4);
  color: #e0e0ff;
}

.path-node.target {
  background: rgba(255, 204, 0, 0.2);
  border: 1px solid rgba(255, 204, 0, 0.4);
  color: #e0e0ff;
}

.path-node.future {
  background: rgba(255, 59, 48, 0.2);
  border: 1px solid rgba(255, 59, 48, 0.4);
  color: #e0e0ff;
}

.path-line {
  flex: 1;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  position: relative;
}

.path-line:after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-left: 6px solid rgba(255, 255, 255, 0.2);
}

.path-line.dashed {
  background: repeating-linear-gradient(
    to right,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0.2) 5px,
    transparent 5px,
    transparent 10px
  );
}

.details-footer {
  padding: 20px;
  display: flex;
  gap: 15px;
  background: rgba(10, 14, 26, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.trend-high-up {
  color: #4cd964;
}
.trend-up {
  color: #9cd94c;
}
.trend-stable {
  color: #ffcc00;
}
.trend-down {
  color: #ff9500;
}
.trend-high-down {
  color: #ff3b30;
}

/* 过渡动画 */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: transform 0.3s ease;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  transform: translateX(-100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(30px) scale(0.95);
  opacity: 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .career-detail-panel {
    width: calc(100% - 40px);
    left: auto;
    right: 20px;
    max-width: 380px;
  }

  .details-container {
    width: 100%;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    border-radius: 0;
  }

  .career-stats-detailed {
    flex-direction: column;
  }
}
</style>
