<template>
  <div class="layout">
    <LayoutSider />
    <div class="main" :class="{ 'collapsed': layoutStore.collapsed }">
      <LayoutHeader />
      <main class="content">
        <!-- 展示区 -->
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import LayoutSider from './components/Sider.vue'
import LayoutHeader from './components/Header.vue'
import { useLayoutStore } from '@/stores/useLayoutStore'

const layoutStore = useLayoutStore()
</script>

<style scoped>
.layout {
  height: 100vh;
}

.main {
  margin-left: 210px;
  position: relative;
  min-height: 100%;
  background: var(--el-bg-color);
  transition: margin-left 0.28s;
}

.main.collapsed {
  margin-left: 64px;
}

.content {
  padding: 20px;
  box-sizing: border-box;
}

html.dark .main {
  background: #f0f2f5;
}
</style> 