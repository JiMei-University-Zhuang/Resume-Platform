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
</template>

<script setup lang="ts">
import { Expand, Fold, Moon, Sunny } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { logout } from '@/api/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const appStore = useAppStore()

//个人设置页面
const handleUserinfo = () => {
  router.push('/user-settings')
}

// 处理登出的函数
const handleLogout = async () => {
  try {
    await logout()
    localStorage.removeItem('token')
    ElMessage.success('成功退出登录')
    router.push('/login')
  } catch (error) {
    console.error('登出失败:', error)
    ElMessage.error('登出失败，请稍后重试')
  }
}
</script>

<style scoped>
.header {
  height: 59px;
  background: var(--el-bg-color);
  padding: 1px 16px;
  padding-left: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
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
</style>
