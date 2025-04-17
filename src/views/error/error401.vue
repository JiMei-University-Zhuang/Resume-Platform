<template>
  <div class="error-container">
    <a-result
      status="403"
      title="401"
      sub-title="抱歉，您没有访问此页面的权限"
    >
      <template #extra>
        <a-space>
          <a-button type="primary" @click="goHome" class="primary-btn">返回首页</a-button>
          <a-button @click="goToLogin" class="default-btn">重新登录</a-button>
        </a-space>
      </template>
      <template #icon>
        <lock-outlined class="custom-icon" />
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts" name="Error401">
import { useRouter } from 'vue-router'
import { LockOutlined } from '@ant-design/icons-vue'

const router = useRouter()

const goHome = () => {
  console.log('点击返回首页按钮')
  // 尝试不同的导航方式
  try {
    router.push({ name: 'Dashboard' }).catch(() => {
      router.push({ path: '/' }).catch(() => {
        // 如果都失败，尝试直接通过window.location导航
        window.location.href = '/'
      })
    })
  } catch (error) {
    console.error('导航错误:', error)
    // 备用导航方法
    window.location.href = '/'
  }
}

const goToLogin = () => {
  console.log('点击重新登录按钮')
  // 尝试不同的导航方式
  try {
    router.push({ name: 'Login' }).catch(() => {
      router.push({ path: '/login' }).catch(() => {
        // 如果都失败，尝试直接通过window.location导航
        window.location.href = '/login'
      })
    })
  } catch (error) {
    console.error('导航错误:', error)
    // 备用导航方法
    window.location.href = '/login'
  }
}
</script>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
  position: relative;
  z-index: 1000;
}

:deep(.ant-result) {
  position: relative;
  z-index: 1001;
}

:deep(.ant-result-extra) {
  position: relative;
  z-index: 1002;
}

.custom-icon {
  font-size: 72px;
  color: #ff4d4f;
}

:deep(.ant-result-title) {
  color: #ff4d4f;
  font-size: 72px;
  font-weight: 600;
}

:deep(.ant-result-subtitle) {
  color: rgba(0, 0, 0, 0.45);
  font-size: 20px;
  margin-top: 16px;
}

:deep(.ant-result-extra) {
  margin-top: 32px;
}

/* 强制应用按钮样式 */
:deep(.ant-btn),
.default-btn,
.primary-btn {
  height: 40px;
  padding: 0 20px;
  font-size: 16px;
  border-radius: 4px;
  position: relative;
  z-index: 1003;
}

:deep(.ant-btn-primary),
.primary-btn {
  background-color: #1890ff !important;
  border-color: #1890ff !important;
  color: #fff !important;
  position: relative;
  z-index: 1003;
}

:deep(.ant-btn-primary:hover),
.primary-btn:hover {
  background-color: #40a9ff !important;
  border-color: #40a9ff !important;
}

:deep(.ant-btn-default),
.default-btn {
  background-color: #fff !important;
  border-color: #d9d9d9 !important;
  color: rgba(0, 0, 0, 0.85) !important;
  position: relative;
  z-index: 1003;
}

:deep(.ant-btn-default:hover),
.default-btn:hover {
  color: #40a9ff !important;
  border-color: #40a9ff !important;
}

/* 暗色模式支持 */
html.dark .error-container {
  background-color: #1f1f1f;
}

html.dark :deep(.ant-result-subtitle) {
  color: rgba(255, 255, 255, 0.45);
}

html.dark .default-btn {
  background-color: #1f1f1f !important;
  color: rgba(255, 255, 255, 0.85) !important;
}
</style>
