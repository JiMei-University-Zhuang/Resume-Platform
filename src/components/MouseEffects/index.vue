<template>
  <div class="mouse-effects">
    <!-- 鼠标拖尾效果容器 -->
    <canvas
      ref="trailCanvas"
      class="trail-canvas"
      :style="{ display: showTrail ? 'block' : 'none' }"
    ></canvas>

    <!-- 礼物特效容器 -->
    <canvas
      ref="confettiCanvas"
      class="confetti-canvas"
      :style="{ display: showConfetti ? 'block' : 'none' }"
    ></canvas>

    <!-- 点击效果容器 -->
    <canvas
      ref="clickCanvas"
      class="click-canvas"
      :style="{ display: showTrail ? 'block' : 'none' }"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import confetti from 'canvas-confetti'

// 控制特效的显示
const showTrail = ref(true)
const showConfetti = ref(true)

// 画布元素引用
const trailCanvas = ref<HTMLCanvasElement | null>(null)
const confettiCanvas = ref<HTMLCanvasElement | null>(null)
const clickCanvas = ref<HTMLCanvasElement | null>(null)

// 拖尾效果的配置
const particles: Array<{
  x: number
  y: number
  dx: number
  dy: number
  size: number
  color: string
  alpha: number
  life: number
}> = []

// 点击效果配置
const clickEffects: Array<{
  x: number
  y: number
  radius: number
  color: string
  alpha: number
  maxRadius: number
}> = []

// 鼠标位置
let mouseX = 0
let mouseY = 0
let lastTriggerTime = 0 // 上次触发时间
const TRIGGER_INTERVAL = 80 // 触发间隔(毫秒)，降低到80ms使拖尾更加流畅

// 礼物特效实例
let confettiInstance: ReturnType<typeof confetti.create> | null = null

// 记录当前动画帧
let animFrameId: number | null = null
let clickAnimFrameId: number | null = null

// 初始化拖尾特效
function initTrailCanvas() {
  if (!trailCanvas.value) return

  const canvas = trailCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 设置画布尺寸
  const setCanvasSize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  setCanvasSize()
  window.addEventListener('resize', setCanvasSize)

  // 鼠标移动处理
  const handleMouseMove = (e: globalThis.MouseEvent) => {
    const prevX = mouseX
    const prevY = mouseY

    mouseX = e.clientX
    mouseY = e.clientY

    // 计算鼠标移动速度
    const speedX = Math.abs(mouseX - prevX)
    const speedY = Math.abs(mouseY - prevY)
    const speed = speedX + speedY

    const now = Date.now()
    const timeSinceLastTrigger = now - lastTriggerTime

    // 如果移动速度足够快，且距离上次触发有足够间隔，才触发特效
    if (speed > 80 && showConfetti.value && timeSinceLastTrigger > 800) {
      triggerConfetti(mouseX, mouseY)
      lastTriggerTime = now
    }

    // 只有在速度超过阈值且间隔足够时才添加新粒子
    if (speed > 5 && timeSinceLastTrigger > TRIGGER_INTERVAL && showTrail.value) {
      // 适当增加粒子数量，让拖尾更充实
      const particleCount = Math.min(5, Math.floor(speed / 20)) + 2

      // 更新触发时间
      lastTriggerTime = now

      for (let i = 0; i < particleCount; i++) {
        addParticle(mouseX, mouseY)
      }
    }
  }

  // 添加粒子
  const addParticle = (x: number, y: number) => {
    // 使用更丰富的配色，包括渐变色
    const colors = [
      '#5EC8AD',
      '#409EFF',
      '#67C23A',
      '#FFD6A5',
      '#A0C4FF',
      '#E98EAD',
      '#F56C6C',
      '#909399',
      '#E6A23C',
      '#DCDFE6',
      '#8E44AD',
      '#16A085'
    ]

    particles.push({
      x,
      y,
      dx: (Math.random() - 0.5) * 3, // 增加横向移动速度
      dy: (Math.random() - 0.5) * 3, // 增加纵向移动速度
      size: Math.random() * 6 + 2, // 增加粒子大小范围
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 0.9, // 增加初始透明度
      life: Math.random() * 60 + 80 // 增加生命周期
    })
  }

  // 动画循环
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 限制粒子总数，但增加上限
    if (particles.length > 150) {
      particles.splice(0, particles.length - 150)
    }

    // 更新并绘制粒子
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]

      p.life--
      p.alpha = p.life / 100 // 调整透明度变化速率

      if (p.alpha <= 0) {
        particles.splice(i, 1)
        i--
        continue
      }

      p.x += p.dx
      p.y += p.dy

      // 添加轻微重力效果
      p.dy += 0.02

      // 绘制粒子 - 使用更漂亮的渐变圆
      ctx.save()
      ctx.globalAlpha = p.alpha

      // 创建径向渐变
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
      gradient.addColorStop(0, p.color)
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    animFrameId = window.requestAnimationFrame(animate)
  }

  window.addEventListener('mousemove', handleMouseMove)
  animate()

  // 返回清理函数
  return () => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('resize', setCanvasSize)
    if (animFrameId !== null) {
      window.cancelAnimationFrame(animFrameId)
    }
  }
}

// 初始化点击特效
function initClickCanvas() {
  if (!clickCanvas.value) return

  const canvas = clickCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 设置画布尺寸
  const setCanvasSize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  setCanvasSize()
  window.addEventListener('resize', setCanvasSize)

  // 点击事件处理
  const handleMouseClick = (e: globalThis.MouseEvent) => {
    // 为点击添加涟漪效果
    addClickEffect(e.clientX, e.clientY)

    // 同时触发礼物特效
    if (showConfetti.value) {
      triggerConfetti(e.clientX, e.clientY, true) // 传入true表示这是点击触发的
    }
  }

  // 添加点击效果
  const addClickEffect = (x: number, y: number) => {
    // 使用明亮的颜色
    const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#8E44AD']

    clickEffects.push({
      x,
      y,
      radius: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 0.6, // 降低初始透明度
      maxRadius: 60 + Math.random() * 20 // 最大半径缩小到60-80之间
    })
  }

  // 点击效果动画
  const animateClicks = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < clickEffects.length; i++) {
      const effect = clickEffects[i]

      // 半径增长
      effect.radius += 2
      // 透明度随半径增大而减小
      effect.alpha = 1 - effect.radius / effect.maxRadius

      if (effect.radius >= effect.maxRadius) {
        clickEffects.splice(i, 1)
        i--
        continue
      }

      // 绘制圆环
      ctx.save()
      ctx.globalAlpha = effect.alpha
      ctx.strokeStyle = effect.color
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2)
      ctx.stroke()

      // 添加内部填充
      const gradient = ctx.createRadialGradient(
        effect.x,
        effect.y,
        0,
        effect.x,
        effect.y,
        effect.radius
      )
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)')
      gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0)')

      ctx.fillStyle = gradient
      ctx.fill()
      ctx.restore()
    }

    clickAnimFrameId = window.requestAnimationFrame(animateClicks)
  }

  window.addEventListener('click', handleMouseClick)
  animateClicks()

  // 返回清理函数
  return () => {
    window.removeEventListener('click', handleMouseClick)
    window.removeEventListener('resize', setCanvasSize)
    if (clickAnimFrameId !== null) {
      window.cancelAnimationFrame(clickAnimFrameId)
    }
  }
}

// 初始化礼物特效
function initConfetti() {
  if (!confettiCanvas.value) return

  const canvas = confettiCanvas.value

  // 设置画布尺寸
  const setCanvasSize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  setCanvasSize()
  window.addEventListener('resize', setCanvasSize)

  // 创建礼物特效实例
  confettiInstance = confetti.create(canvas, {
    resize: true,
    useWorker: true
  })

  // 返回清理函数
  return () => {
    window.removeEventListener('resize', setCanvasSize)
  }
}

// 触发礼物特效
function triggerConfetti(x: number, y: number, isClick = false) {
  if (!confettiInstance) return

  // 点击触发的特效粒子数量，显著减少
  const count = isClick ? 3 + Math.floor(Math.random() * 2) : 2 + Math.floor(Math.random() * 2)

  // 将坐标转换为相对于窗口大小的比例
  const xRatio = x / window.innerWidth
  const yRatio = y / window.innerHeight

  confettiInstance({
    particleCount: count,
    spread: isClick ? 60 : 30, // 减小扩散范围
    origin: { x: xRatio, y: yRatio },
    colors: ['#5EC8AD', '#409EFF', '#67C23A', '#FFD6A5', '#A0C4FF', '#F56C6C', '#E6A23C'],
    shapes: ['circle', 'square', 'star'], // 增加形状种类
    zIndex: 100,
    scalar: isClick ? 1.0 : 0.6, // 微调粒子尺寸
    gravity: isClick ? 1.5 : 1.2, // 增大重力，加快下落速度
    ticks: isClick ? 130 : 80 // 减少持续时间
  })
}

onMounted(() => {
  const cleanupTrail = initTrailCanvas()
  const cleanupConfetti = initConfetti()
  const cleanupClicks = initClickCanvas()

  // 组件卸载时的清理函数
  onUnmounted(() => {
    if (cleanupTrail) cleanupTrail()
    if (cleanupConfetti) cleanupConfetti()
    if (cleanupClicks) cleanupClicks()
  })
})
</script>

<style scoped>
.mouse-effects {
  position: relative;
  z-index: 10;
}

.trail-canvas,
.confetti-canvas,
.click-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}
</style>
