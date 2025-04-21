<template>
  <div class="digital-twin-container">
    <h2>个人数字孪生</h2>

    <div class="user-profile-section">
      <div class="user-avatar">
        <img :src="userData?.avatar || '/default-avatar.png'" alt="User Avatar" />
        <div class="user-level">Lv.{{ userData?.level || 1 }}</div>
      </div>

      <div class="user-info">
        <div class="user-name">{{ userData?.name || 'User Name' }}</div>
        <div class="user-title">{{ userData?.currentTitle || '求职中' }}</div>

        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-value">{{ userData?.completedLearningHours || 0 }}</span>
            <span class="stat-label">学习小时</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ userData?.assessmentsCompleted || 0 }}</span>
            <span class="stat-label">完成评估</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ userData?.skillsMastered || 0 }}</span>
            <span class="stat-label">掌握技能</span>
          </div>
        </div>
      </div>
    </div>

    <div class="skills-radar-section">
      <h3>核心技能分析</h3>
      <SkillRadar :skills="skills" />
    </div>

    <div class="personality-traits-section">
      <h3>职业性格特质</h3>
      <div class="traits-list">
        <div
          v-for="trait in personalityTraits"
          :key="trait.id"
          class="trait-item"
          :style="{
            '--strength': `${trait.strength}%`,
            '--color': trait.color
          }"
        >
          <div class="trait-label">{{ trait.name }}</div>
          <div class="trait-bar">
            <div class="trait-progress"></div>
          </div>
          <div class="trait-value">{{ trait.strength }}%</div>
        </div>
      </div>
    </div>

    <div class="career-match-section">
      <h3>最佳职业匹配</h3>
      <div class="career-matches">
        <div class="match-item" v-for="match in topMatches" :key="match.id">
          <div class="match-info">
            <div class="match-title">{{ match.title }}</div>
            <div class="match-description">{{ match.description }}</div>
          </div>
          <div class="match-score">{{ match.matchScore }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SkillRadar from './SkillRadar.vue'
import type { Skill, User } from '../utils/careerMapData'

interface Trait {
  id: number
  name: string
  strength: number
  color: string
}

interface Career {
  id: number
  title: string
  description: string
  matchScore: number
}

defineProps<{
  userData: User | null
  skills: Skill[]
}>()

// 处理个性特质数据
const personalityTraits = ref<Trait[]>([
  { id: 1, name: '分析思维', strength: 85, color: '#4cd964' },
  { id: 2, name: '创造力', strength: 72, color: '#5ac8fa' },
  { id: 3, name: '沟通能力', strength: 68, color: '#007aff' },
  { id: 4, name: '领导力', strength: 63, color: '#5856d6' },
  { id: 5, name: '团队协作', strength: 78, color: '#ff2d55' }
])

// 计算最佳职业匹配
const topMatches = computed<Career[]>(() => {
  // 这里应该从API获取，暂时使用静态数据
  return [
    {
      id: 1,
      title: '软件开发工程师',
      description: '根据您的技术技能和解决问题的能力',
      matchScore: 92
    },
    { id: 2, title: '数据分析师', description: '基于您的分析思维和数学能力', matchScore: 89 },
    { id: 3, title: '产品经理', description: '结合您的创造力和沟通技能', matchScore: 78 }
  ]
})
</script>

<style scoped>
.digital-twin-container {
  background: rgba(26, 32, 58, 0.5);
  border-radius: 16px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
}

.digital-twin-container h2 {
  margin: 0;
  font-size: 20px;
  background: linear-gradient(135deg, #3498db, #5983ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.digital-twin-container h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: rgba(224, 224, 255, 0.9);
}

.user-profile-section {
  display: flex;
  gap: 15px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-avatar {
  position: relative;
}

.user-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(89, 131, 255, 0.5);
}

.user-level {
  position: absolute;
  bottom: 0;
  right: 0;
  background: linear-gradient(135deg, #3498db, #5983ff);
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
}

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: rgba(224, 224, 255, 0.95);
}

.user-title {
  font-size: 14px;
  color: rgba(224, 224, 255, 0.7);
  margin-bottom: 10px;
}

.user-stats {
  display: flex;
  gap: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: rgba(224, 224, 255, 0.95);
}

.stat-label {
  font-size: 10px;
  color: rgba(224, 224, 255, 0.6);
}

.skills-radar-section {
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.personality-traits-section {
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.traits-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.trait-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.trait-label {
  width: 80px;
  font-size: 13px;
  color: rgba(224, 224, 255, 0.8);
}

.trait-bar {
  flex-grow: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.trait-progress {
  height: 100%;
  width: var(--strength);
  background: var(--color);
  border-radius: 3px;
}

.trait-value {
  width: 40px;
  text-align: right;
  font-size: 13px;
  font-weight: 500;
  color: rgba(224, 224, 255, 0.9);
}

.career-matches {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.match-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.05);
  padding: 12px;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
}

.match-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.match-title {
  font-size: 14px;
  font-weight: 500;
  color: rgba(224, 224, 255, 0.9);
  margin-bottom: 3px;
}

.match-description {
  font-size: 12px;
  color: rgba(224, 224, 255, 0.6);
}

.match-score {
  font-size: 18px;
  font-weight: 600;
  color: #4cd964;
}
</style>
