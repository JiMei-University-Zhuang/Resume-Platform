<template>
  <header class="header">
    <div class="header-left">
      <el-icon class="trigger" size="24" @click="layoutStore.toggleCollapsed()">
        <Expand v-if="!layoutStore.collapsed" />
        <Fold v-else />
      </el-icon>
      <!-- 面包屑 -->
      <div class="breadcrumb-container">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index" :to="item.path">
            {{ item.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 标签导航 -->
      <div class="tabs-container">
        <el-tabs 
          v-model="activeTab" 
          type="card" 
          closable 
          @tab-remove="removeTab"
          @tab-click="handleTabClick">
          <el-tab-pane
            v-for="item in visitedViews"
            :key="item.path"
            :label="item.title"
            :name="item.path"
          >
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <div class="header-right">
      <el-icon class="theme-switch" @click="layoutStore.toggleTheme()">
        <Sunny v-if="layoutStore.isDark" />
        <Moon v-else />
      </el-icon>
      <el-dropdown>
        <span class="user-info">
          <el-avatar size="small" src="https://avatars.githubusercontent.com/u/1?v=4" />
          <span class="username">Admin</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人设置</el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Expand, Fold, Moon, Sunny } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { useLayoutStore } from '@/stores/useLayoutStore'
import { computed, ref, watch } from 'vue'

const router = useRouter()
const route = useRoute()
const layoutStore = useLayoutStore()

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

const breadcrumbList = computed(() => {
  const matched = route.matched.filter(item => item.meta.title)
  const breadcrumb = matched.map(item => ({
    path: item.path,
    title: item.meta.title as string
  }))
  return breadcrumb
})

const activeTab = ref('')
const visitedViews = ref<Array<{ path: string; title: string }>>([])

watch(() => route.path, (newPath) => {
  const matched = route.matched.find(item => item.path === newPath)
  if (matched && matched.meta.title) {
    const view = {
      path: newPath,
      title: matched.meta.title as string
    }
    if (!visitedViews.value.find(v => v.path === newPath)) {
      visitedViews.value.push(view)
    }
    activeTab.value = newPath
  }
}, { immediate: true })

const removeTab = (targetPath: string) => {
  const tabs = visitedViews.value
  let activePath = activeTab.value
  if (activePath === targetPath) {
    tabs.forEach((tab, index) => {
      if (tab.path === targetPath) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activePath = nextTab.path
        }
      }
    })
  }
  activeTab.value = activePath
  visitedViews.value = tabs.filter(tab => tab.path !== targetPath)
  router.push(activePath)
}

const handleTabClick = (tab: any) => {
  router.push(tab.props.name)
}
</script>

<style scoped>
.header {
  height: 64px;
  background: var(--el-bg-color);
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
}

.header-left {
  display: flex;
  align-items: center;
}

.trigger {
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #409EFF;
}

.header-right {
  display: flex;
  align-items: center;
}

.theme-switch {
  margin-right: 20px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 4px;
}

.theme-switch:hover {
  background: var(--el-fill-color-light);
}

.user-info {
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: pointer;
}

.username {
  margin-left: 8px;
  font-size: 14px;
}
.el-breadcrumb {
  font-size: 14px;
  line-height: 64px;
}

.tabs-container {
  margin-top: 8px;
  padding: 0 16px;
  background-color: var(--el-bg-color);
}

.tabs-container :deep(.el-tabs__header) {
  margin: 0;
  border-bottom: none;
}

.tabs-container :deep(.el-tabs__nav) {
  border: none;
}

.tabs-container :deep(.el-tabs__item) {
  height: 30px;
  line-height: 30px;
  border: none;
  color: var(--el-text-color-regular);
  background-color: var(--el-bg-color-overlay);
  margin: 0 2px;
  border-radius: 3px;
}

.tabs-container :deep(.el-tabs__item.is-active) {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.tabs-container :deep(.el-tabs__nav-wrap::after) {
  display: none;
}
</style>