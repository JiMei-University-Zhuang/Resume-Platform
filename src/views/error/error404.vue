<template>
  <div class="error-container">
    <a-result status="404" title="404" sub-title="抱歉，您访问的页面不存在或已被移除">
      <template #extra>
        <a-button type="primary" @click="goHome" class="primary-btn">返回首页</a-button>
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts" name="Error404">
import { useRouter } from 'vue-router'

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

:deep(.ant-result-image) {
  margin-bottom: 24px;
}

:deep(.ant-result-title) {
  color: #1890ff;
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
:deep(.ant-btn) {
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

/* 暗色模式支持 */
html.dark .error-container {
  background-color: #1f1f1f;
}

html.dark :deep(.ant-result-subtitle) {
  color: rgba(255, 255, 255, 0.45);
}
</style>
