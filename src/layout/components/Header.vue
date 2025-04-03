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
      <!-- 全屏切换 -->
      <div class="header-item" @click="toggleFullScreen" title="切换全屏">
        <el-icon :size="18">
          <FullScreen v-if="!isFullScreen" />
          <Aim v-else />
        </el-icon>
      </div>
      
      <!-- 语言切换 -->
      <div class="header-item" @click="toggleLanguage" :title="isEnglish ? '切换为中文' : 'Switch to English'">
        <span class="language-text">{{ isEnglish ? 'EN' : '中' }}</span>
      </div>
      
      <!-- 消息通知 -->
      <div class="header-item" @click="showNotifications = true" title="消息通知">
        <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="notification-badge">
          <el-icon :size="18">
            <Bell />
          </el-icon>
        </el-badge>
      </div>
      
      <!-- 文档中心 -->
      <div class="header-item" @click="openDocumentation" title="帮助文档">
        <el-icon :size="18">
          <Document />
        </el-icon>
      </div>
      
      <!-- 用户下拉菜单 -->
      <el-dropdown>
        <span class="user-info">
          <el-avatar size="small" src="https://avatars.githubusercontent.com/u/1?v=4" />
          <span class="username">Admin</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleLogout">
              <el-icon><SwitchButton /></el-icon>退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    
    <!-- 消息通知抽屉 -->
    <el-drawer
      v-model="showNotifications"
      title="消息通知"
      direction="rtl"
      size="350px"
    >
      <div class="notification-header">
        <span>{{ unreadCount }}条未读消息</span>
        <el-button type="primary" link @click="markAllAsRead">全部标为已读</el-button>
      </div>
      
      <el-tabs v-model="activeTab" class="notification-tabs">
        <el-tab-pane label="全部消息" name="all">
          <div v-if="notifications.length === 0" class="empty-notifications">
            暂无消息通知
          </div>
          <el-scrollbar height="calc(100vh - 200px)">
            <div 
              v-for="(item, index) in notifications" 
              :key="index" 
              class="notification-item"
              :class="{ 'unread': !item.read }"
              @click="readNotification(item)"
            >
              <div class="notification-icon" :class="item.type">
                <el-icon><component :is="getNotificationIcon(item.type)" /></el-icon>
              </div>
              <div class="notification-content">
                <div class="notification-title">{{ item.title }}</div>
                <div class="notification-desc">{{ item.content }}</div>
                <div class="notification-time">{{ formatTime(item.time) }}</div>
              </div>
              <div class="notification-actions">
                <el-button 
                  type="danger" 
                  link 
                  size="small"
                  @click.stop="deleteNotification(index)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="系统消息" name="system">
          <el-scrollbar height="calc(100vh - 200px)">
            <div 
              v-for="(item, index) in systemNotifications" 
              :key="index" 
              class="notification-item"
              :class="{ 'unread': !item.read }"
              @click="readNotification(item)"
            >
              <div class="notification-icon" :class="item.type">
                <el-icon><component :is="getNotificationIcon(item.type)" /></el-icon>
              </div>
              <div class="notification-content">
                <div class="notification-title">{{ item.title }}</div>
                <div class="notification-desc">{{ item.content }}</div>
                <div class="notification-time">{{ formatTime(item.time) }}</div>
              </div>
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="任务消息" name="task">
          <el-scrollbar height="calc(100vh - 200px)">
            <div 
              v-for="(item, index) in taskNotifications" 
              :key="index" 
              class="notification-item"
              :class="{ 'unread': !item.read }"
              @click="readNotification(item)"
            >
              <div class="notification-icon" :class="item.type">
                <el-icon><component :is="getNotificationIcon(item.type)" /></el-icon>
              </div>
              <div class="notification-content">
                <div class="notification-title">{{ item.title }}</div>
                <div class="notification-desc">{{ item.content }}</div>
                <div class="notification-time">{{ formatTime(item.time) }}</div>
              </div>
            </div>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Expand, Fold, FullScreen, Aim, Bell, Document, SwitchButton, 
  InfoFilled, WarningFilled, SuccessFilled, CircleCheckFilled, Calendar } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { logout } from '@/api/user'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

// 载入相对时间插件
dayjs.extend(relativeTime)

const router = useRouter()
const appStore = useAppStore()

// 全屏状态管理
const isFullScreen = ref(false)

// 语言切换
const isEnglish = ref(false)
const toggleLanguage = () => {
  isEnglish.value = !isEnglish.value
  ElMessage.success(isEnglish.value ? 'Are you OK?' : '你在搞什么我还没写好')
}

// 全屏切换功能
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      isFullScreen.value = true
    }).catch(err => {
      console.error(`全屏切换失败: ${err.message}`)
    })
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        isFullScreen.value = false
      }).catch(err => {
        console.error(`退出全屏失败: ${err.message}`)
      })
    }
  }
}

// 监听全屏状态变化
const handleFullscreenChange = () => {
  isFullScreen.value = !!document.fullscreenElement
}

// 打开文档中心
const openDocumentation = () => {
  window.open('https://example.com/documentation', '_blank')
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

// 消息通知相关功能
interface Notification {
  id: number;
  title: string;
  content: string;
  time: Date;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'task';
}

const showNotifications = ref(false)
const activeTab = ref('all')

// 模拟消息数据
const notifications = ref<Notification[]>([
  {
    id: 1,
    title: '系统更新通知',
    content: '系统将于今晚22:00-24:00进行例行维护，请提前做好准备。',
    time: new Date(Date.now() - 3600000), // 1小时前
    read: false,
    type: 'info'
  },
  {
    id: 2,
    title: '任务已分配',
    content: '新任务"季度数据分析"已分配给您，请及时处理。',
    time: new Date(Date.now() - 86400000), // 1天前
    read: false,
    type: 'task'
  },
  {
    id: 3,
    title: '安全警告',
    content: '检测到您的账号在异地登录，如非本人操作请及时修改密码。',
    time: new Date(Date.now() - 172800000), // 2天前
    read: false,
    type: 'warning'
  },
  {
    id: 4,
    title: '任务完成提醒',
    content: '您的任务"月度报表生成"已顺利完成。',
    time: new Date(Date.now() - 259200000), // 3天前
    read: true,
    type: 'success'
  }
])

// 按类型过滤通知
const systemNotifications = computed(() => {
  return notifications.value.filter(item => item.type === 'info' || item.type === 'warning')
})

const taskNotifications = computed(() => {
  return notifications.value.filter(item => item.type === 'task' || item.type === 'success')
})

// 未读消息数量
const unreadCount = computed(() => {
  return notifications.value.filter(item => !item.read).length
})

// 标记消息为已读
const readNotification = (notification: Notification) => {
  if (!notification.read) {
    notification.read = true
  }
}

// 标记所有为已读
const markAllAsRead = () => {
  notifications.value.forEach(item => {
    item.read = true
  })
  ElMessage.success('已将全部消息标为已读')
}

// 删除消息
const deleteNotification = (index: number) => {
  notifications.value.splice(index, 1)
  ElMessage.success('消息已删除')
}

// 根据类型获取图标
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'info':
      return InfoFilled
    case 'warning':
      return WarningFilled
    case 'success':
      return SuccessFilled
    case 'task':
      return Calendar
    default:
      return InfoFilled
  }
}

// 格式化时间
const formatTime = (time: Date) => {
  return dayjs(time).fromNow()
}

// 添加和移除全屏变化事件监听
onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
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
  gap: 8px;
}

.header-item {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 4px;
}

.header-item:hover {
  background: var(--el-fill-color-light);
  color: var(--el-color-primary);
}

.language-text {
  font-size: 14px;
  font-weight: bold;
}

.notification-badge :deep(.el-badge__content) {
  z-index: 1004;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: pointer;
  height: 40px;
  border-radius: 4px;
  transition: all 0.3s;
}

.user-info:hover {
  background: var(--el-fill-color-light);
}

.username {
  margin-left: 8px;
  font-size: 14px;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 5px;
}

:deep(.el-dropdown-menu__item i) {
  margin-right: 5px;
}

.el-breadcrumb {
  font-size: 14px;
  line-height: 64px;
}

/* 消息通知样式 */
.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 15px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.notification-tabs {
  margin-top: 10px;
}

.notification-item {
  display: flex;
  padding: 12px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
}

.notification-item:hover {
  background-color: var(--el-fill-color-lighter);
}

.notification-item.unread {
  background-color: rgba(var(--el-color-primary-rgb), 0.1);
}

.notification-item.unread::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: var(--el-color-primary);
}

.notification-icon {
  margin-right: 12px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.notification-icon.info {
  background-color: var(--el-color-primary);
}

.notification-icon.warning {
  background-color: var(--el-color-warning);
}

.notification-icon.success {
  background-color: var(--el-color-success);
}

.notification-icon.task {
  background-color: var(--el-color-info);
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: bold;
  margin-bottom: 4px;
}

.notification-desc {
  color: var(--el-text-color-secondary);
  font-size: 13px;
  margin-bottom: 4px;
}

.notification-time {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.notification-actions {
  display: none;
  align-items: center;
}

.notification-item:hover .notification-actions {
  display: flex;
}

.empty-notifications {
  text-align: center;
  padding: 40px 0;
  color: var(--el-text-color-secondary);
}
</style>
