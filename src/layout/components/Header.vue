<template>
  <header class="header">
    <div class="header-left">
      <el-icon 
        class="trigger" 
        size="24"
        @click="layoutStore.toggleCollapsed()"
      >
        <Expand v-if="!layoutStore.collapsed"/>
        <Fold v-else/>
      </el-icon>
    </div>
    <div class="header-right">
      <el-icon class="theme-switch" @click="layoutStore.toggleTheme()">
        <Sunny v-if="layoutStore.isDark"/>
        <Moon v-else/>
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
import { useRouter } from 'vue-router'
import { useLayoutStore } from '@/stores/useLayoutStore'

const router = useRouter()
const layoutStore = useLayoutStore()

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
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
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
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
</style> 