<template>
  <div
    class="career-node"
    :class="{
      'career-node--selected': isSelected,
      'career-node--highlighted': isHighlighted,
      [`career-node--${viewMode}`]: true
    }"
    :style="nodeStyle"
    @click="$emit('click')"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
  >
    <div class="career-node__connections">
      <div
        v-for="(connection, index) in connections"
        :key="index"
        class="career-node__connection"
        :style="getConnectionStyle(connection)"
      ></div>
    </div>

    <div class="career-node__content">
      <div class="career-node__icon">
        <Icon :name="career.icon || 'briefcase'" />
      </div>
      <div class="career-node__name">{{ career.name }}</div>
      <div class="career-node__indicator">
        <template v-if="viewMode === 'matchScore'">
          <div class="match-indicator">{{ Math.round(career.matchScore * 100) }}%</div>
        </template>
        <template v-else-if="viewMode === 'trend'">
          <div class="trend-indicator" :class="getTrendClass(career.trend)">
            {{ formatTrend(career.trend) }}
          </div>
        </template>
      </div>
    </div>

    <div class="career-node__glow"></div>
    <div class="career-node__ring"></div>
    <div class="career-node__pulse" v-if="isSelected || isHighlighted"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import Icon from '@/components/Icon.vue'
import type { Career, Connection } from '../utils/careerMapData'

const props = defineProps({
  career: {
    type: Object as PropType<Career>,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  isHighlighted: {
    type: Boolean,
    default: false
  },
  connections: {
    type: Array as PropType<Connection[]>,
    default: () => []
  },
  viewMode: {
    type: String as PropType<'matchScore' | 'trend'>,
    default: 'matchScore'
  }
})

defineEmits(['click', 'mouseenter', 'mouseleave'])

const nodeStyle = computed(() => {
  const size = props.career.size || 1
  const matchScore = props.career.matchScore || 0
  const trend = props.career.trend || 0

  // 节点大小可以根据匹配度或趋势来调整
  let nodeSize = size
  if (props.viewMode === 'matchScore') {
    nodeSize = size * (0.8 + matchScore * 0.4)
  } else if (props.viewMode === 'trend' && Math.abs(trend) > 5) {
    nodeSize = size * (0.9 + Math.abs(trend) / 100)
  }

  // 生成颜色
  let colorValue: string

  if (props.viewMode === 'trend') {
    // 趋势为正时偏蓝绿色，为负时偏红橙色
    colorValue =
      trend > 0
        ? `rgba(52, ${130 + Math.min(trend * 5, 125)}, 219, var(--opacity))`
        : `rgba(${219 + Math.min(Math.abs(trend) * 3, 36)}, ${130 - Math.min(Math.abs(trend) * 5, 80)}, 52, var(--opacity))`
  } else {
    colorValue = `rgba(52, ${130 + Math.round(matchScore * 125)}, 219, var(--opacity))`
  }

  return {
    left: `${props.career.position?.x || props.career.positionX || 50}%`,
    top: `${props.career.position?.y || props.career.positionY || 50}%`,
    '--match-score': matchScore,
    '--trend-value': trend,
    '--node-size': nodeSize,
    '--node-color': colorValue,
    '--pulse-scale': props.isSelected ? 1.5 : 1.2
  }
})

// 获取连接样式
const getConnectionStyle = (connection: Connection) => {
  const { x: targetX, y: targetY } = connection.target.position || {
    x: connection.target.positionX || 50,
    y: connection.target.positionY || 50
  }

  const { x: sourceX, y: sourceY } = props.career.position || {
    x: props.career.positionX || 50,
    y: props.career.positionY || 50
  }

  const dx = targetX - sourceX
  const dy = targetY - sourceY
  const distance = Math.sqrt(dx * dx + dy * dy)

  // 获取角度（度数）
  const angle = Math.atan2(dy, dx) * (180 / Math.PI)

  // 连接强度影响颜色饱和度
  const opacity = 0.3 + connection.strength * 0.7

  return {
    width: `${distance}%`,
    transform: `rotate(${angle}deg)`,
    opacity: opacity,
    backgroundColor:
      props.isHighlighted || props.isSelected
        ? 'rgba(89, 131, 255, var(--opacity))'
        : 'rgba(255, 255, 255, var(--opacity))'
  }
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
</script>

<style scoped>
.career-node {
  --size: calc(80px * var(--node-size, 1));
  --color: var(--node-color, rgba(89, 131, 255, 0.8));
  --opacity: 0.8;

  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 10;
}

.career-node__content {
  width: var(--size);
  height: var(--size);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  background: rgba(16, 24, 48, 0.7);
  border: 2px solid var(--color);
  box-shadow: 0 0 15px rgba(89, 131, 255, 0.2);
  transition: all 0.4s ease;
  position: relative;
  z-index: 2;
  backdrop-filter: blur(5px);
}

.career-node__icon {
  font-size: calc(var(--size) * 0.28);
  color: var(--color);
  margin-bottom: 4px;
  transition: all 0.3s ease;
}

.career-node__name {
  font-size: calc(var(--size) * 0.15);
  text-align: center;
  color: white;
  font-weight: 500;
  max-width: calc(var(--size) * 0.8);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
}

.career-node__indicator {
  font-size: calc(var(--size) * 0.14);
  transition: all 0.3s ease;
}

.match-indicator {
  background: var(--color);
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 500;
}

.trend-indicator {
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 500;
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

.career-node__connections {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: -1;
}

.career-node__connection {
  position: absolute;
  height: 1.5px;
  background: linear-gradient(
    90deg,
    rgba(var(--primary-color-rgb, 89, 131, 255), 0.8),
    rgba(var(--primary-color-rgb, 89, 131, 255), 0.1)
  );
  transform-origin: left center;
  filter: blur(0.5px);
}

.career-node__glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(var(--size) * 1.2);
  height: calc(var(--size) * 1.2);
  border-radius: 50%;
  background: radial-gradient(circle, var(--color), rgba(16, 24, 48, 0));
  opacity: 0.3;
  filter: blur(8px);
  z-index: 1;
  transition: all 0.4s ease;
}

.career-node__ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(var(--size) * 1.1);
  height: calc(var(--size) * 1.1);
  border-radius: 50%;
  border: 1px solid var(--color);
  z-index: 1;
  opacity: 0.4;
  transition: all 0.4s ease;
}

.career-node__pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  border: 2px solid var(--color);
  z-index: 1;
  animation: node-pulse 2s infinite;
}

@keyframes node-pulse {
  0% {
    width: var(--size);
    height: var(--size);
    opacity: 0.7;
  }
  100% {
    width: calc(var(--size) * var(--pulse-scale, 1.5));
    height: calc(var(--size) * var(--pulse-scale, 1.5));
    opacity: 0;
  }
}

/* 匹配模式样式 */
.career-node--matchScore .career-node__content {
  background: linear-gradient(
    135deg,
    rgba(16, 24, 48, 0.7),
    rgba(52, 152, 219, calc(var(--match-score) * 0.3))
  );
}

/* 趋势模式样式 */
.career-node--trend .career-node__content {
  background: linear-gradient(135deg, rgba(16, 24, 48, 0.7), rgba(52, 152, 219, 0.3));
}

/* 高亮和选中样式 */
.career-node--highlighted .career-node__content {
  border-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 20px var(--color);
  transform: scale(1.1);
}

.career-node--highlighted .career-node__glow {
  opacity: 0.5;
  width: calc(var(--size) * 1.4);
  height: calc(var(--size) * 1.4);
}

.career-node--selected .career-node__content {
  background: rgba(var(--primary-color-rgb, 89, 131, 255), 0.3);
  border-color: rgba(255, 255, 255, 1);
  box-shadow: 0 0 25px var(--color);
  transform: scale(1.15);
}

.career-node--selected .career-node__icon {
  transform: scale(1.2);
}

.career-node--selected .career-node__glow {
  opacity: 0.6;
  width: calc(var(--size) * 1.6);
  height: calc(var(--size) * 1.6);
}

.career-node--selected .career-node__ring {
  width: calc(var(--size) * 1.3);
  height: calc(var(--size) * 1.3);
  opacity: 0.7;
}

/* 动画效果 */
.career-node:hover:not(.career-node--selected):not(.career-node--highlighted) {
  transform: translate(-50%, -50%) scale(1.05);
}

.career-node:hover:not(.career-node--selected):not(.career-node--highlighted)
  .career-node__content {
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 15px var(--color);
}

.career-node:hover:not(.career-node--selected):not(.career-node--highlighted) .career-node__glow {
  opacity: 0.4;
}
</style>
