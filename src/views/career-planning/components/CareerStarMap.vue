<template>
  <div class="career-star-map" ref="starMapContainer">
    <div class="star-background">
      <div class="galaxy-center"></div>
      <div v-for="i in 50" :key="`star-${i}`" class="star" :style="getRandomStarStyle()"></div>
      <div
        v-for="i in 10"
        :key="`shooting-star-${i}`"
        class="shooting-star"
        :style="getShootingStarStyle()"
      ></div>
    </div>

    <div class="map-controls">
      <div class="control-group">
        <button class="control-button reset-button" @click="resetView" title="重置视图">
          <Icon name="refresh" />
        </button>
        <button class="control-button" @click="zoomIn" title="放大">
          <Icon name="zoomIn" />
        </button>
        <button class="control-button" @click="zoomOut" title="缩小">
          <Icon name="zoomOut" />
        </button>
      </div>
      <div class="view-mode-toggle">
        <button
          class="view-mode-button"
          :class="{ active: viewMode === 'matchScore' }"
          @click="setViewMode('matchScore')"
        >
          匹配度视图
        </button>
        <button
          class="view-mode-button"
          :class="{ active: viewMode === 'trend' }"
          @click="setViewMode('trend')"
        >
          趋势视图
        </button>
      </div>
    </div>

    <div
      class="star-map-content"
      :style="mapStyle"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
      @wheel="onZoom"
    >
      <div class="user-position" v-if="showUserPosition">
        <div class="user-marker"></div>
        <div class="user-pulse"></div>
      </div>

      <transition-group name="career-node">
        <CareerNode
          v-for="career in careers"
          :key="career.id"
          :career="career"
          :is-selected="!!selectedCareer && selectedCareer.id === career.id"
          :is-highlighted="!!highlightedCareer && highlightedCareer.id === career.id"
          :connections="getCareerConnections(career)"
          :view-mode="viewMode"
          @click="selectCareer(career)"
          @mouseenter="highlightCareer(career)"
          @mouseleave="unhighlightCareer"
        />
      </transition-group>

      <!-- 连接线层 -->
      <svg class="connections-layer" :width="svgSize.width" :height="svgSize.height">
        <path
          v-for="(connection, index) in visibleConnections"
          :key="`connection-${index}`"
          :d="getConnectionPath(connection)"
          :style="getConnectionStyle(connection)"
          class="connection-path"
        />
      </svg>
    </div>

    <transition name="panel-slide">
      <div class="career-details" v-if="selectedCareer">
        <div class="panel-header">
          <h3>{{ selectedCareer.name }}</h3>
          <button class="close-button" @click="selectedCareer = null">
            <Icon name="close" />
          </button>
        </div>

        <div class="career-main-stats">
          <div class="stat-card match-stat">
            <div class="stat-icon-bg">
              <Icon name="target" />
            </div>
            <div class="stat-info">
              <span class="stat-label">匹配度</span>
              <span class="stat-value">{{ Math.round(selectedCareer.matchScore * 100) }}%</span>
            </div>
            <div class="match-bar">
              <div
                class="match-fill"
                :style="{ width: `${Math.round(selectedCareer.matchScore * 100)}%` }"
              ></div>
            </div>
          </div>

          <div class="stat-card trend-stat">
            <div class="stat-icon-bg" :class="getTrendClass(selectedCareer.trend)">
              <Icon :name="getTrendIcon(selectedCareer.trend)" />
            </div>
            <div class="stat-info">
              <span class="stat-label">发展趋势</span>
              <span class="stat-value" :class="getTrendClass(selectedCareer.trend)">
                {{ formatTrend(selectedCareer.trend) }}
              </span>
            </div>
          </div>
        </div>

        <div class="content-section">
          <div class="section-title">
            <div class="title-icon"><Icon name="info" /></div>
            <h4>职业描述</h4>
          </div>
          <p class="career-description">{{ selectedCareer.description }}</p>
        </div>

        <div class="content-section">
          <div class="section-title">
            <div class="title-icon"><Icon name="code" /></div>
            <h4>必备技能</h4>
          </div>
          <div class="skill-tags">
            <span v-for="(skill, index) in selectedCareer.skills" :key="index" class="skill-tag">
              {{ skill }}
            </span>
          </div>
        </div>

        <div class="content-section" v-if="getRelatedCareers().length">
          <div class="section-title">
            <div class="title-icon"><Icon name="git-branch" /></div>
            <h4>相关职业</h4>
          </div>
          <div class="related-list">
            <div
              v-for="career in getRelatedCareers()"
              :key="career.id"
              class="related-item"
              @click="selectCareer(career)"
            >
              <div class="related-name-container">
                <div class="connection-dot"></div>
                <span class="related-name">{{ career.name }}</span>
              </div>
              <div class="related-match-container">
                <span class="related-match">{{ Math.round(career.matchScore * 100) }}%</span>
                <Icon name="arrow-right" class="arrow-icon" />
              </div>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button class="ai-advice-button" @click="getAIAdvice">
            <Icon name="message-circle" /> 获取AI建议
          </button>
        </div>
      </div>
    </transition>

    <transition name="tooltip-fade">
      <div class="career-tooltip" v-if="tooltipVisible" :style="tooltipStyle">
        <div class="tooltip-name">{{ tooltipCareer?.name }}</div>
        <div class="tooltip-match">
          匹配度: {{ Math.round((tooltipCareer?.matchScore || 0) * 100) }}%
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CareerNode from './CareerNode.vue'
import Icon from '@/components/Icon.vue'
import type { Career } from '../utils/careerMapData'

export interface Connection {
  source: Career
  target: Career
  strength: number
}

const props = defineProps({
  careers: {
    type: Array as () => Career[],
    required: true
  },
  userPosition: {
    type: Object as () => { x: number; y: number; z: number },
    default: () => ({ x: 0, y: 0, z: 0 })
  },
  initialSelectedId: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['select-career', 'explore-career', 'ai-advice'])

const starMapContainer = ref<HTMLElement | null>(null)
const selectedCareer = ref<Career | null>(null)
const highlightedCareer = ref<Career | null>(null)
const tooltipCareer = ref<Career | null>(null)
const tooltipVisible = ref(false)
const tooltipPosition = ref({ x: 0, y: 0 })
const zoom = ref(1)
const pan = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const viewMode = ref<'matchScore' | 'trend'>('matchScore')
const showUserPosition = ref(true)
const animationFrame = ref<number | null>(null)

// SVG 尺寸
const svgSize = computed(() => {
  return {
    width: starMapContainer.value?.clientWidth || 1000,
    height: starMapContainer.value?.clientHeight || 800
  }
})

// 可见连接
const visibleConnections = computed(() => {
  if (highlightedCareer.value) {
    return getCareerConnections(highlightedCareer.value)
  }
  if (selectedCareer.value) {
    return getCareerConnections(selectedCareer.value)
  }
  return []
})

// 设置查看模式
const setViewMode = (mode: 'matchScore' | 'trend') => {
  viewMode.value = mode
}

// 工具提示样式
const tooltipStyle = computed(() => {
  return {
    left: `${tooltipPosition.value.x}px`,
    top: `${tooltipPosition.value.y}px`
  }
})

// Set initial selected career if provided
onMounted(() => {
  if (props.initialSelectedId) {
    const career = props.careers.find(c => c.id === props.initialSelectedId)
    if (career) {
      selectedCareer.value = career
    }
  }

  // 开始动画循环
  startAnimationLoop()

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 清理动画循环
  if (animationFrame.value !== null) {
    window.cancelAnimationFrame(animationFrame.value)
  }

  // 移除事件监听
  window.removeEventListener('resize', handleResize)
})

// 窗口大小变化处理
const handleResize = () => {
  // 在此处理布局重新计算等操作
}

// 动画循环
const startAnimationLoop = () => {
  const animate = () => {
    // 在此添加持续动画效果
    animationFrame.value = window.requestAnimationFrame(animate)
  }

  animationFrame.value = window.requestAnimationFrame(animate)
}

const mapStyle = computed(() => {
  return {
    transform: `translate(${pan.value.x}px, ${pan.value.y}px) scale(${zoom.value})`
  }
})

const getRandomStarStyle = () => {
  const size = Math.random() * 2 + 1
  const x = Math.random() * 100
  const y = Math.random() * 100
  const delay = Math.random() * 10
  const duration = Math.random() * 3 + 2
  const opacity = Math.random() * 0.5 + 0.5

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}%`,
    top: `${y}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    opacity: opacity
  }
}

// 生成流星样式
const getShootingStarStyle = () => {
  const top = Math.random() * 70
  const left = Math.random() * 100
  const delay = Math.random() * 15
  const duration = Math.random() * 2 + 1
  const size = Math.random() * 60 + 30

  return {
    top: `${top}%`,
    left: `${left}%`,
    width: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

const zoomIn = () => {
  zoom.value = Math.min(zoom.value + 0.2, 3)
}

const zoomOut = () => {
  zoom.value = Math.max(zoom.value - 0.2, 0.5)
}

const onZoom = (event: globalThis.WheelEvent) => {
  event.preventDefault()
  const zoomDelta = event.deltaY > 0 ? -0.1 : 0.1
  zoom.value = Math.max(0.5, Math.min(3, zoom.value + zoomDelta))
}

const startDrag = (event: globalThis.MouseEvent) => {
  if (event.target === event.currentTarget) {
    isDragging.value = true
    dragStart.value = { x: event.clientX - pan.value.x, y: event.clientY - pan.value.y }
  }
}

const onDrag = (event: globalThis.MouseEvent) => {
  if (isDragging.value) {
    pan.value = {
      x: event.clientX - dragStart.value.x,
      y: event.clientY - dragStart.value.y
    }
  }
}

const stopDrag = () => {
  isDragging.value = false
}

const resetView = () => {
  zoom.value = 1
  pan.value = { x: 0, y: 0 }
  selectedCareer.value = null
  highlightedCareer.value = null
}

const selectCareer = (career: Career) => {
  selectedCareer.value = career
  emit('select-career', career)
}

const highlightCareer = (career: Career) => {
  highlightedCareer.value = career
  tooltipCareer.value = career
  tooltipVisible.value = true

  // 计算工具提示位置（根据节点位置计算）
  const containerRect = starMapContainer.value?.getBoundingClientRect()
  if (containerRect) {
    const x = (containerRect.width * (career.position?.x || career.positionX || 50)) / 100
    const y = (containerRect.height * (career.position?.y || career.positionY || 50)) / 100
    tooltipPosition.value = { x, y: y - 60 } // 在节点上方显示
  }
}

const unhighlightCareer = () => {
  highlightedCareer.value = null
  tooltipVisible.value = false
}

// Get AI advice
const getAIAdvice = () => {
  if (selectedCareer.value) {
    emit('ai-advice', selectedCareer.value)
  }
}

// Get connections for a career
const getCareerConnections = (career: Career): Connection[] => {
  const connections: Connection[] = []

  props.careers.forEach(target => {
    if (target.id === career.id) return

    // Calculate connection strength based on skill overlap
    const skillOverlap = calculateSkillOverlap(career, target)

    if (skillOverlap > 0.2) {
      connections.push({
        source: career,
        target,
        strength: skillOverlap
      })
    }
  })

  return connections
}

const calculateSkillOverlap = (career1: Career, career2: Career) => {
  const skills1 = new Set(career1.skills)
  const skills2 = new Set(career2.skills)

  let overlapCount = 0
  skills2.forEach(skill => {
    if (skills1.has(skill)) {
      overlapCount++
    }
  })

  const totalUniqueSkills = new Set([...career1.skills, ...career2.skills]).size
  return totalUniqueSkills > 0 ? overlapCount / totalUniqueSkills : 0
}

const getRelatedCareers = () => {
  if (!selectedCareer.value) return []

  const connections = getCareerConnections(selectedCareer.value)

  return connections
    .map(conn => conn.target)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3)
}

// 获取趋势样式类名
const getTrendClass = (trend: number) => {
  if (trend > 15) return 'trend-high-up'
  if (trend > 0) return 'trend-up'
  if (trend < -15) return 'trend-high-down'
  if (trend < 0) return 'trend-down'
  return 'trend-stable'
}

// 格式化趋势文本
const formatTrend = (trend: number) => {
  if (trend > 0) return `+${trend}%`
  return `${trend}%`
}

// 获取趋势图标
const getTrendIcon = (trend: number) => {
  if (trend > 15) return 'arrow-up'
  if (trend > 0) return 'arrow-up-right'
  if (trend < -15) return 'arrow-down'
  if (trend < 0) return 'arrow-down-right'
  return 'minus'
}

// 获取连接路径
const getConnectionPath = (connection: Connection) => {
  const sourceX = connection.source.position?.x || connection.source.positionX || 50
  const sourceY = connection.source.position?.y || connection.source.positionY || 50
  const targetX = connection.target.position?.x || connection.target.positionX || 50
  const targetY = connection.target.position?.y || connection.target.positionY || 50

  // 转换为SVG坐标
  const svgWidth = svgSize.value.width
  const svgHeight = svgSize.value.height

  const x1 = (sourceX * svgWidth) / 100
  const y1 = (sourceY * svgHeight) / 100
  const x2 = (targetX * svgWidth) / 100
  const y2 = (targetY * svgHeight) / 100

  // 生成曲线路径
  const dx = x2 - x1
  const dy = y2 - y1
  const curve = Math.min(Math.abs(dx), Math.abs(dy)) * 0.5

  return `M${x1},${y1} C${x1 + curve},${y1} ${x2 - curve},${y2} ${x2},${y2}`
}

// 获取连接样式
const getConnectionStyle = (connection: Connection) => {
  // 基于连接强度和当前状态设置样式
  const baseOpacity = connection.strength * 0.7
  const isHighlighted =
    highlightedCareer.value &&
    (connection.source.id === highlightedCareer.value.id ||
      connection.target.id === highlightedCareer.value.id)

  return {
    opacity: isHighlighted ? Math.max(baseOpacity, 0.8) : baseOpacity,
    strokeWidth: isHighlighted ? '2px' : '1px',
    animation: isHighlighted ? 'connection-pulse 2s infinite' : 'none'
  }
}
</script>

<style scoped>
.career-star-map {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgba(5, 8, 20, 0.95);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.star-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.galaxy-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(89, 131, 255, 0.2) 0%,
    rgba(52, 152, 219, 0.1) 30%,
    rgba(16, 25, 65, 0) 70%
  );
  filter: blur(15px);
  animation: pulse 8s infinite alternate;
}

.star {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: twinkle 5s infinite alternate;
}

.shooting-star {
  position: absolute;
  height: 1px;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0)
  );
  transform: rotate(-45deg);
  animation: shooting 3s ease-in-out infinite;
}

@keyframes twinkle {
  0% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
}

@keyframes pulse {
  0% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes shooting {
  0% {
    transform: translateX(-100%) rotate(-45deg);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(200%) rotate(-45deg);
    opacity: 0;
  }
}

.star-map-content {
  position: relative;
  width: 100%;
  height: 100%;
  transform-origin: center;
  transition: transform 0.3s ease;
  z-index: 2;
}

.connections-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.connection-path {
  fill: none;
  stroke: rgba(89, 131, 255, 0.6);
  stroke-linecap: round;
  filter: drop-shadow(0 0 2px rgba(89, 131, 255, 0.4));
}

@keyframes connection-pulse {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 20;
  }
}

.map-controls {
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 10;
}

.control-group {
  display: flex;
  gap: 8px;
}

.control-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(26, 32, 58, 0.8);
  border: 1px solid rgba(89, 131, 255, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.control-button:hover {
  background: rgba(89, 131, 255, 0.3);
  border-color: rgba(89, 131, 255, 0.6);
  transform: translateY(-2px);
}

.reset-button {
  background: rgba(89, 131, 255, 0.2);
}

.view-mode-toggle {
  display: flex;
  gap: 4px;
  background: rgba(26, 32, 58, 0.6);
  border-radius: 6px;
  padding: 4px;
}

.view-mode-button {
  padding: 6px 12px;
  font-size: 12px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.view-mode-button.active {
  background: rgba(89, 131, 255, 0.3);
  color: white;
}

.user-position {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
}

.user-marker {
  width: 16px;
  height: 16px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(89, 131, 255, 0.8);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(89, 131, 255, 0.6);
}

.user-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.4);
  animation: user-pulse 2s infinite;
}

@keyframes user-pulse {
  0% {
    width: 16px;
    height: 16px;
    opacity: 1;
  }
  100% {
    width: 60px;
    height: 60px;
    opacity: 0;
  }
}

.career-details {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 320px;
  background: rgba(16, 24, 48, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  color: white;
  z-index: 10;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(89, 131, 255, 0.2);
  max-height: calc(100% - 40px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(89, 131, 255, 0.5) rgba(16, 24, 48, 0.3);
}

.career-details::-webkit-scrollbar {
  width: 6px;
}

.career-details::-webkit-scrollbar-track {
  background: rgba(16, 24, 48, 0.3);
}

.career-details::-webkit-scrollbar-thumb {
  background-color: rgba(89, 131, 255, 0.5);
  border-radius: 3px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.panel-header h3 {
  margin: 0;
  font-size: 20px;
  background: linear-gradient(135deg, #ffffff, #5983ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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

.career-main-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;
  padding: 10px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  transition: all 0.2s;
}

.stat-card:hover {
  background: rgba(89, 131, 255, 0.2);
}

.stat-icon-bg {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.stat-info {
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 5px;
  display: block;
}

.stat-value {
  font-size: 16px;
  font-weight: 500;
}

.match-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  margin-top: 10px;
}

.match-fill {
  height: 100%;
  background: linear-gradient(90deg, rgba(89, 131, 255, 0.7), rgba(89, 131, 255, 1));
  border-radius: 4px;
  transition: width 0.8s ease;
}

.content-section {
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.title-icon {
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.skill-tag {
  padding: 5px 10px;
  border-radius: 6px;
  background: rgba(89, 131, 255, 0.2);
  border: 1px solid rgba(89, 131, 255, 0.4);
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  transition: all 0.2s;
}

.skill-tag:hover {
  background: rgba(89, 131, 255, 0.3);
  transform: translateY(-2px);
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.related-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  transition: all 0.2s;
  cursor: pointer;
}

.related-item:hover {
  background: rgba(89, 131, 255, 0.2);
  transform: translateY(-2px);
}

.related-name-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.connection-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
}

.related-name {
  font-size: 14px;
  color: white;
}

.related-match-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.related-match {
  font-size: 12px;
  color: rgba(89, 131, 255, 1);
  font-weight: 500;
}

.arrow-icon {
  width: 12px;
  height: 12px;
  color: rgba(89, 131, 255, 1);
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.explore-button,
.ai-advice-button {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.explore-button {
  background: linear-gradient(135deg, #3498db, #5983ff);
  color: white;
}

.ai-advice-button {
  background: rgba(255, 255, 255, 0.08);
  color: white;
  border: 1px solid rgba(89, 131, 255, 0.4);
}

.explore-button:hover,
.ai-advice-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.explore-button:hover {
  background: linear-gradient(135deg, #4aa3e8, #6a94ff);
}

.ai-advice-button:hover {
  background: rgba(255, 255, 255, 0.15);
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

.career-description {
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  border-left: 3px solid rgba(89, 131, 255, 0.6);
}

.career-details h4 {
  font-size: 16px;
  margin: 0;
  color: white;
}

/* 面板滑入动画 */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -90%);
}

.career-node-enter-active,
.career-node-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.career-node-enter-from,
.career-node-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

@media (max-width: 768px) {
  .career-details {
    width: calc(100% - 40px);
    right: 10px;
    left: 10px;
    top: auto;
    bottom: 10px;
    max-height: 60vh;
  }

  .map-controls {
    bottom: 10px;
    left: 10px;
  }
}

.career-detail-panel {
  position: absolute;
  top: 50px;
  right: 20px;
  width: 360px;
  background: rgba(8, 15, 40, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  border: 1px solid rgba(89, 131, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  padding: 20px;
  color: #e0e0ff;
  overflow: hidden;
  transition: all 0.3s ease;
  z-index: 10;
}

.career-title h2 {
  margin: 0;
  font-size: 22px;
  background: linear-gradient(135deg, #ffffff, #5983ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.career-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 24px 0;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.label {
  font-size: 14px;
  color: rgba(224, 224, 255, 0.7);
  margin-bottom: 4px;
}

.value {
  font-size: 18px;
  color: rgba(224, 224, 255, 0.95);
  font-weight: 600;
}

.trending-up {
  color: #4cd964;
}

.trending-stable {
  color: #ffcc00;
}

.trending-down {
  color: #ff3b30;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 24px;
}

.primary-button,
.secondary-button {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-button {
  background: linear-gradient(135deg, #3498db, #5983ff);
  color: white;
  box-shadow: 0 4px 12px rgba(89, 131, 255, 0.3);
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(89, 131, 255, 0.4);
}

.secondary-button {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(224, 224, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.secondary-button:hover {
  background: rgba(255, 255, 255, 0.12);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
