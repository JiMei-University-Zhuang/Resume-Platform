<template>
  <div class="skill-radar-container">
    <canvas ref="radarCanvas" width="300" height="300"></canvas>
    <div class="skill-legend">
      <div
        v-for="skill in skills"
        :key="skill.id"
        class="legend-item"
        :style="{ '--color': skill.color }"
      >
        <div class="legend-color"></div>
        <div class="legend-name">{{ skill.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { Skill } from '../utils/careerMapData'

const props = defineProps<{
  skills: Skill[]
}>()

const radarCanvas = ref<HTMLCanvasElement | null>(null)

const drawRadarChart = () => {
  const canvas = radarCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height
  const center = { x: width / 2, y: height / 2 }
  const radius = Math.min(width, height) / 2 - 20

  // 清除画布
  ctx.clearRect(0, 0, width, height)

  // 绘制背景网格
  const levels = 5
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'

  for (let i = levels; i > 0; i--) {
    const levelRadius = (radius / levels) * i
    ctx.beginPath()

    props.skills.forEach((_, index) => {
      const angle = (Math.PI * 2 * index) / props.skills.length - Math.PI / 2
      const x = center.x + levelRadius * Math.cos(angle)
      const y = center.y + levelRadius * Math.sin(angle)

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.closePath()
    ctx.stroke()
    if (i === levels) ctx.fill()
  }

  // 绘制轴线
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'

  props.skills.forEach((_, index) => {
    const angle = (Math.PI * 2 * index) / props.skills.length - Math.PI / 2
    const x = center.x + radius * Math.cos(angle)
    const y = center.y + radius * Math.sin(angle)

    ctx.beginPath()
    ctx.moveTo(center.x, center.y)
    ctx.lineTo(x, y)
    ctx.stroke()

    // 绘制轴标签
    const labelX = center.x + (radius + 15) * Math.cos(angle)
    const labelY = center.y + (radius + 15) * Math.sin(angle)

    ctx.fillStyle = 'rgba(224, 224, 255, 0.7)'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(props.skills[index].name, labelX, labelY)
  })

  // 绘制数据区域
  ctx.beginPath()
  props.skills.forEach((skill, index) => {
    const angle = (Math.PI * 2 * index) / props.skills.length - Math.PI / 2
    const skillRadius = (radius * skill.level) / 100 // 假设技能等级是0-100
    const x = center.x + skillRadius * Math.cos(angle)
    const y = center.y + skillRadius * Math.sin(angle)

    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })

  ctx.closePath()
  ctx.fillStyle = 'rgba(52, 152, 219, 0.2)'
  ctx.fill()

  ctx.strokeStyle = 'rgba(89, 131, 255, 0.8)'
  ctx.lineWidth = 2
  ctx.stroke()

  // 绘制数据点
  props.skills.forEach((skill, index) => {
    const angle = (Math.PI * 2 * index) / props.skills.length - Math.PI / 2
    const skillRadius = (radius * skill.level) / 100
    const x = center.x + skillRadius * Math.cos(angle)
    const y = center.y + skillRadius * Math.sin(angle)

    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fillStyle = skill.color || '#5983ff'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.lineWidth = 1
    ctx.stroke()
  })
}

onMounted(() => {
  drawRadarChart()
})

watch(
  () => props.skills,
  () => {
    drawRadarChart()
  },
  { deep: true }
)
</script>

<style scoped>
.skill-radar-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.skill-legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  /* background-color: var(--color, #5983ff); */
}

.legend-name {
  font-size: 11px;
  color: rgba(224, 224, 255, 0.7);
}
</style>
