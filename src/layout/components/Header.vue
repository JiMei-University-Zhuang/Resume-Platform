<template>
  <header class="header">
    <div class="header-left">
      <div class="trigger" @click="appStore.toggleCollapsed()">
        <el-icon :size="24">
          <Expand v-if="!appStore.collapsed" />
          <Fold v-else />
        </el-icon>
      </div>
      <!-- 面包屑 -->
      <Breadcrumb />
    </div>

    <div class="header-right">
      <div class="theme-switch" @click="appStore.toggleTheme()">
        <el-icon :size="24">
          <Sunny v-if="appStore.isDark" />
          <Moon v-else />
        </el-icon>
      </div>
      <el-dropdown>
        <span class="user-info">
          <el-avatar size="small" src="https://avatars.githubusercontent.com/u/1?v=4" />
          <span class="username">Admin</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleUserinfo">个人设置</el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
  <div class="header-bottom">
    <!-- 标签导航 -->
    <div class="tabs-container">
      <el-tabs v-model="activeTab" type="card" closable @tab-remove="removeTab" @tab-click="handleTabClick">
        <el-tab-pane v-for="item in visitedViews" :key="item.path" :label="item.title" :name="item.path">
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>




</template>

<script setup lang="ts">
import { Expand, Fold, Moon, Sunny } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores'
import { ref, watch } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()


//个人设置页面
const handleUserinfo = () => {
  router.push('/user-settings')
}


const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

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

const removeTab = (targetPath: string | number) => {
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
  padding: 1px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
  position: relative;
  z-index: 1003;
}

.header-left {
  display: flex;
  align-items: center;
}

.trigger {
  padding: 0 12px;
  cursor: pointer;
  transition: color 0.3s;
  display: flex !important;
  align-items: center !important;
  font-size: 24px !important;
  visibility: visible !important;
  width: auto !important;
  height: auto !important;
}

:deep(.trigger .el-icon) {
  display: flex !important;
  align-items: center !important;
  font-size: 24px !important;
  visibility: visible !important;
}

.trigger:hover {
  color: var(--el-color-primary);
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
  margin-top: 0px;
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
  margin: 0 1px;
  border-radius: 3px;
}

.tabs-container :deep(.el-tabs__item.is-active) {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.tabs-container :deep(.el-tabs__nav-wrap::after) {
  display: none;
}


.header-bottom {
  box-shadow: 0 1px 5px rgba(0, 21, 41, 0.08);
}
</style>