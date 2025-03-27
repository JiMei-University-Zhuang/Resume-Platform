<template>
    <div class="error-container">
        <div class="error-content">
            <img src="@/assets/vue.svg" alt="404" class="error-image" />
            <h1>😞 页面未找到</h1>
            <p>抱歉，您访问的页面不存在或已被移除。</p>
            <el-button type="primary" class="home-button" @click="goHome"
                >返回首页</el-button
            >
        </div>
    </div>
</template>

<script setup lang="ts" name="Error404">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
    router.push({ name: 'Dashboard' })
}
</script>

<style scoped>
.error-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
    text-align: center;
}

.error-content {
    position: relative;
    z-index: 1;
    background: rgba(255, 255, 255, 0.9);
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    animation: fadeIn 1s ease-in-out;
}

.error-image {
    width: 150px;
    margin-bottom: 20px;
    animation: bounce 2s infinite;
}

.error-content h1 {
    font-size: 2.5rem;
    margin-bottom: 15px;
    color: #e74c3c;
}

.error-content p {
    font-size: 1.1rem;
    margin-bottom: 25px;
    color: #555;
}

.home-button {
    position: relative;
    z-index: 1;
    font-size: 16px !important;
    padding: 12px 24px !important;
    border-radius: 25px !important;
    font-weight: bold;
    transition: transform 0.3s ease !important;
}

.home-button:hover {
    transform: translateY(-2px);
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-10px);
    }
    60% {
        transform: translateY(-5px);
    }
}
</style>
