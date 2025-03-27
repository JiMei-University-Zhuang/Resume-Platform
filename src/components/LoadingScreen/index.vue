<template>
    <div v-if="visible" class="loading-screen">
        <div class="loading-content">
            <div class="loading-logo">
                <div class="hexagon-container">
                    <div class="hexagon"></div>
                    <div class="hexagon"></div>
                    <div class="hexagon"></div>
                </div>
                <h1>AI管理平台</h1>
                <div class="loading-text">
                    <span>System</span>
                    <span class="dots">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </span>
                    <span>Loading</span>
                </div>
            </div>
        </div>
        <canvas v-if="initialized" :id="id"></canvas>
        <div class="cyber-lines">
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Container, tsParticles } from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'

const props = defineProps<{
    visible: boolean
    id?: string
}>()

const initialized = ref(false)
const container = ref<Container | null>(null)

const particlesOptions = {
    fpsLimit: 60,
    particles: {
        color: {
            value: '#00ffff'
        },
        links: {
            color: '#00ffff',
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1
        },
        move: {
            direction: 'none',
            enable: true,
            outModes: {
                default: 'bounce'
            },
            random: false,
            speed: 2,
            straight: false
        },
        number: {
            density: {
                enable: true,
                area: 800
            },
            value: 50
        },
        opacity: {
            value: 0.3
        },
        shape: {
            type: 'circle'
        },
        size: {
            value: { min: 1, max: 3 }
        }
    },
    detectRetina: true,
    background: {
        color: 'transparent'
    }
} as const

const init = async () => {
    await loadSlim(tsParticles)
    const particlesContainer = await tsParticles.load({
        id: props.id || 'loading-particles',
        options: particlesOptions
    })
    if (particlesContainer) {
        container.value = particlesContainer
        initialized.value = true
    }
}

onMounted(() => {
    init()
})

onBeforeUnmount(() => {
    if (container.value) {
        container.value.destroy()
    }
})
</script>

<style scoped>
.loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #000428 0%, #004e92 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    overflow: hidden;
}

.loading-content {
    position: relative;
    z-index: 1;
    text-align: center;
    color: #00ffff;
}

.loading-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.loading-logo h1 {
    font-size: 2.5rem;
    margin: 1rem 0;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
    font-family: 'Arial', sans-serif;
    letter-spacing: 2px;
    position: relative;
}

.loading-logo h1::after {
    content: 'AI管理平台';
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    color: transparent;
    text-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
    animation: glow 2s ease-in-out infinite alternate;
}

.loading-text {
    font-family: monospace;
    font-size: 1.2rem;
    display: flex;
    gap: 0.5rem;
    color: #00ffff;
    text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
}

.dots span {
    display: inline-block;
    animation: dots 1.5s infinite;
    opacity: 0;
}

.dots span:nth-child(2) {
    animation-delay: 0.5s;
}

.dots span:nth-child(3) {
    animation-delay: 1s;
}

.hexagon-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100px;
    height: 100px;
}

.hexagon {
    position: absolute;
    width: 60px;
    height: 35px;
    background-color: transparent;
    border: 2px solid #00ffff;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
    animation: rotate 3s linear infinite;
}

.hexagon:before,
.hexagon:after {
    content: '';
    position: absolute;
    width: 0;
    border-left: 30px solid transparent;
    border-right: 30px solid transparent;
}

.hexagon:before {
    bottom: 100%;
    border-bottom: 17.5px solid #00ffff;
}

.hexagon:after {
    top: 100%;
    border-top: 17.5px solid #00ffff;
}

.hexagon:nth-child(2) {
    animation-delay: -1s;
}

.hexagon:nth-child(3) {
    animation-delay: -2s;
}

.cyber-lines {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.line {
    position: absolute;
    background: linear-gradient(90deg, transparent, #00ffff, transparent);
    height: 1px;
    width: 100%;
    opacity: 0;
}

.line:nth-child(1) {
    top: 20%;
    animation: line-animation 3s infinite;
}

.line:nth-child(2) {
    top: 50%;
    animation: line-animation 3s infinite 1s;
}

.line:nth-child(3) {
    top: 80%;
    animation: line-animation 3s infinite 2s;
}

canvas {
    position: absolute !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

@keyframes rotate {
    0% {
        transform: rotate(0deg) scale(1);
    }
    50% {
        transform: rotate(180deg) scale(1.2);
    }
    100% {
        transform: rotate(360deg) scale(1);
    }
}

@keyframes dots {
    0%,
    20% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

@keyframes glow {
    from {
        text-shadow:
            0 0 5px #00ffff,
            0 0 10px #00ffff,
            0 0 15px #00ffff;
    }
    to {
        text-shadow:
            0 0 10px #00ffff,
            0 0 20px #00ffff,
            0 0 30px #00ffff;
    }
}

@keyframes line-animation {
    0% {
        transform: translateX(-100%);
        opacity: 0;
    }
    50% {
        opacity: 0.5;
    }
    100% {
        transform: translateX(100%);
        opacity: 0;
    }
}
</style>
