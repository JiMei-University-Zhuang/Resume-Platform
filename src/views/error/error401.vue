<template>
    <div class="error-container">
        <div class="error-content">
            <img src="@/assets/vue.svg" alt="401" class="error-image" />
            <h1>🔒 未授权访问</h1>
            <p>抱歉，您没有访问此页面的权限。</p>
            <div class="button-group">
                <router-link to="/" class="home-button">返回首页</router-link>
                <router-link to="/login" class="login-button"
                    >前往登录</router-link
                >
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="Error401"></script>

<style scoped>
.error-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
    background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%);
    text-align: center;
}

.error-content {
    background: rgba(255, 255, 255, 0.95);
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
    color: #e67e22;
}

.error-content p {
    font-size: 1.1rem;
    margin-bottom: 25px;
    color: #555;
}

.button-group {
    display: flex;
    justify-content: center;
    gap: 20px;
}

.home-button,
.login-button {
    display: inline-block;
    padding: 12px 24px;
    background-color: #3498db;
    color: white;
    border-radius: 25px;
    text-decoration: none;
    font-weight: bold;
    transition:
        background-color 0.3s ease,
        transform 0.3s ease;
}

.home-button:hover,
.login-button:hover {
    background-color: #2980b9;
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
