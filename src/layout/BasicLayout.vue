<template>
  <div class="layout">
    <LayoutSider />
    <div class="main" :class="{ collapsed: collapsed }">
      <LayoutHeader />
      <main class="content">
        <!-- 使用多重保险确保组件重新渲染 -->
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component 
              :is="Component" 
              :key="$route.fullPath + '|' + refreshKey" 
            />
          </keep-alive>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'
import LayoutHeader from './components/Header.vue'
import LayoutSider from './components/Sider.vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, onUnmounted, ref, nextTick, watch } from 'vue'

const appStore = useAppStore()
const { collapsed } = storeToRefs(appStore)
const $route = useRoute()
const router = useRouter()

// 强制刷新机制
const refreshKey = ref(0)
const forceRefresh = () => {
  refreshKey.value += 1
}

// 监听路由变化
watch(() => $route.fullPath, () => {
  nextTick(() => {
    forceRefresh()
  })
}, { immediate: true })

// 监听自定义事件
onMounted(() => {
  window.addEventListener('force-route-refresh', forceRefresh)
})

onUnmounted(() => {
  window.removeEventListener('force-route-refresh', forceRefresh)
})
</script>

<style scoped>
.layout {
  height: 100vh;
  position: relative;
}

.main {
  margin-left: 210px;
  position: relative;
  min-height: 100%;
  background: var(--el-bg-color);
  transition: margin-left 0.28s;
  z-index: 2;
}

.main.collapsed {
  margin-left: 64px;
}

.content {
  padding: 20px;
  padding-top: 0;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

html.dark .main {
  background: #f0f2f5;
}
</style>
