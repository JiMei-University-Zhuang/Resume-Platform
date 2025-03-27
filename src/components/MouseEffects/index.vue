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

// 鼠标位置
let mouseX = 0
let mouseY = 0

// 礼物特效实例
let confettiInstance: ReturnType<typeof confetti.create> | null = null

// 记录当前动画帧
let animFrameId: number | null = null

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

    // 如果移动速度足够快，触发礼物特效
    if (speed > 50 && showConfetti.value) {
      triggerConfetti(mouseX, mouseY)
    }

    // 添加新的粒子
    const particleCount = Math.min(5, Math.floor(speed / 10)) + 1
    for (let i = 0; i < particleCount; i++) {
      if (showTrail.value) {
        addParticle(mouseX, mouseY)
      }
    }
  }

  // 添加粒子
  const addParticle = (x: number, y: number) => {
    // 选择随机颜色
    const colors = [
      '#FF577F',
      '#FF884B',
      '#FFCD38',
      '#A6CF98',
      '#3D84A8',
      '#ABCDEF',
      '#E98EAD',
      '#FFC8A2'
    ]

    particles.push({
      x,
      y,
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 0.5) * 2,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      life: Math.random() * 60 + 60
    })
  }

  // 动画循环
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 更新并绘制粒子
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]

      p.life--
      p.alpha = p.life / 120

      if (p.alpha <= 0) {
        particles.splice(i, 1)
        i--
        continue
      }

      p.x += p.dx
      p.y += p.dy

      // 绘制粒子
      ctx.save()
      ctx.globalAlpha = p.alpha
      ctx.fillStyle = p.color
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
function triggerConfetti(x: number, y: number) {
  if (!confettiInstance) return

  const count = 10 + Math.floor(Math.random() * 20)

  // 将坐标转换为相对于窗口大小的比例
  const xRatio = x / window.innerWidth
  const yRatio = y / window.innerHeight

  confettiInstance({
    particleCount: count,
    spread: 70,
    origin: { x: xRatio, y: yRatio },
    colors: [
      '#FFADAD',
      '#FFD6A5',
      '#FDFFB6',
      '#CAFFBF',
      '#9BF6FF',
      '#A0C4FF',
      '#BDB2FF',
      '#FFC6FF'
    ],
    shapes: ['star', 'circle', 'square'],
    zIndex: 100,
    scalar: 0.7
  })
}

onMounted(() => {
  const cleanupTrail = initTrailCanvas()
  const cleanupConfetti = initConfetti()

  // 组件卸载时的清理函数
  onUnmounted(() => {
    if (cleanupTrail) cleanupTrail()
    if (cleanupConfetti) cleanupConfetti()
  })
})
</script>

<style scoped>
.mouse-effects {
  position: relative;
  z-index: 10;
}

.trail-canvas,
.confetti-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
}
</style>
