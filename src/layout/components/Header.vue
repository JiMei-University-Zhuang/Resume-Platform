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
      <div
        id="header-fullscreen"
        class="header-item"
        @click="toggleFullScreen"
        :title="t('header.fullscreen')"
      >
        <el-icon :size="18">
          <FullScreen v-if="!isFullScreen" />
          <Aim v-else />
        </el-icon>
      </div>
      <!-- 语言切换 -->
      <div
        id="header-language"
        class="header-item"
        @click="toggleLanguage"
        :title="isEnglish ? t('header.language') : 'Switch to English'"
      >
        <span class="language-text">{{ isEnglish ? 'EN' : '中' }}</span>
      </div>

      <!-- 消息通知 -->
      <div
        id="header-notification"
        class="header-item"
        @click="showNotifications = true"
        :title="t('header.notifications')"
      >
        <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="notification-badge">
          <el-icon :size="18">
            <Bell />
          </el-icon>
        </el-badge>
      </div>

      <!-- 文档中心 -->
      <div
        id="header-documentation"
        class="header-item"
        @click="openDocumentation"
        :title="t('header.documentation')"
      >
        <el-icon :size="18">
          <Document />
        </el-icon>
      </div>

      <!-- 用户下拉菜单 -->
      <el-dropdown id="header-user">
        <span class="user-info">
          <el-avatar size="small" :src="userAvatar" />
          <span class="username">{{ userName }}</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleLogout">
              <el-icon><SwitchButton /></el-icon>{{ t('header.logout') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 消息通知抽屉 -->
    <el-drawer
      v-model="showNotifications"
      :title="t('header.notifications')"
      direction="rtl"
      size="350px"
    >
      <div class="notification-header">
        <span>{{ unreadCount }}{{ t('header.unread', { count: unreadCount }) }}</span>
        <el-button type="primary" link @click="markAllAsRead">{{
          t('header.markAllRead')
        }}</el-button>
      </div>

      <el-tabs v-model="activeTab" class="notification-tabs">
        <el-tab-pane :label="t('header.allMessages')" name="all">
          <div v-if="isLoadingNotices" class="loading-notifications">
            <el-icon class="loading-icon"><Loading /></el-icon>
            <span>{{ t('header.loading') }}</span>
          </div>
          <div v-else-if="notifications.length === 0" class="empty-notifications">
            {{ t('header.empty') }}
          </div>
          <el-scrollbar height="calc(100vh - 200px)" v-else>
            <div
              v-for="item in notifications"
              :key="item.noticeId"
              class="notification-item"
              :class="{ unread: item.isRead === 0 }"
              @click="readNotification(item)"
            >
              <div class="notification-icon" :class="item.type">
                <el-icon><component :is="getNotificationIcon(item.type)" /></el-icon>
              </div>
              <div class="notification-content">
                <div class="notification-title">{{ item.title || t('header.systemNotice') }}</div>
                <div class="notification-desc">{{ item.content }}</div>
                <div class="notification-time">{{ formatTime(item.publishTime) }}</div>
              </div>
              <div class="notification-actions">
                <el-button
                  type="danger"
                  link
                  size="small"
                  @click.stop="deleteNotification(item.noticeId)"
                >
                  {{ t('header.deleteMessage') }}
                </el-button>
              </div>
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane :label="t('header.systemMessages')" name="system">
          <div v-if="isLoadingNotices" class="loading-notifications">
            <el-icon class="loading-icon"><Loading /></el-icon>
            <span>加载消息中...</span>
          </div>
          <div v-else-if="systemNotifications.length === 0" class="empty-notifications">
            暂无系统消息
          </div>
          <el-scrollbar height="calc(100vh - 200px)" v-else>
            <div
              v-for="item in systemNotifications"
              :key="item.noticeId"
              class="notification-item"
              :class="{ unread: item.isRead === 0 }"
              @click="readNotification(item)"
            >
              <div class="notification-icon" :class="item.type">
                <el-icon><component :is="getNotificationIcon(item.type)" /></el-icon>
              </div>
              <div class="notification-content">
                <div class="notification-title">{{ item.title || '系统通知' }}</div>
                <div class="notification-desc">{{ item.content }}</div>
                <div class="notification-time">{{ formatTime(item.publishTime) }}</div>
              </div>
              <div class="notification-actions">
                <el-button
                  type="danger"
                  link
                  size="small"
                  @click.stop="deleteNotification(item.noticeId)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane :label="t('header.taskMessages')" name="task">
          <div v-if="isLoadingNotices" class="loading-notifications">
            <el-icon class="loading-icon"><Loading /></el-icon>
            <span>加载消息中...</span>
          </div>
          <div v-else-if="taskNotifications.length === 0" class="empty-notifications">
            暂无任务消息
          </div>
          <el-scrollbar height="calc(100vh - 200px)" v-else>
            <div
              v-for="item in taskNotifications"
              :key="item.noticeId"
              class="notification-item"
              :class="{ unread: item.isRead === 0 }"
              @click="readNotification(item)"
            >
              <div class="notification-icon" :class="item.type">
                <el-icon><component :is="getNotificationIcon(item.type)" /></el-icon>
              </div>
              <div class="notification-content">
                <div class="notification-title">{{ item.title || '任务通知' }}</div>
                <div class="notification-desc">{{ item.content }}</div>
                <div class="notification-time">{{ formatTime(item.publishTime) }}</div>
              </div>
              <div class="notification-actions">
                <el-button
                  type="danger"
                  link
                  size="small"
                  @click.stop="deleteNotification(item.noticeId)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>

    <!-- 引导按钮，只在首页显示 -->
    <el-button
      v-if="showGuideButton"
      class="tour-button"
      type="success"
      size="small"
      @click="startTour"
    >
      <el-icon><Guide /></el-icon>
      {{ t('dashboard.guidedTour') }}
    </el-button>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import {
  Expand,
  Fold,
  FullScreen,
  Aim,
  Bell,
  Document,
  SwitchButton,
  InfoFilled,
  WarningFilled,
  SuccessFilled,
  Calendar,
  Loading,
  Guide
} from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { logout, getUser, type GetUserResult } from '@/api/user'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  getNoticeList,
  markNoticeAsRead,
  markAllNoticesAsRead,
  deleteNotice,
  type Notice
} from '@/api/notification'
import { useLanguage } from '@/composables/useLanguage'
import { useUserStore } from '@/stores/userStore'
import { useI18n } from 'vue-i18n'

// 载入相对时间插件
dayjs.extend(relativeTime)

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()

// 判断是否显示引导按钮
const showGuideButton = computed(() => {
  return route.path === '/dashboard' || route.path === '/'
})

// 全屏状态管理
const isFullScreen = ref(false)

// 用户信息相关
const userInfo = ref<GetUserResult | null>(null)
const userAvatar = computed(() => userStore.userInfo?.avatar || userInfo.value?.avatar)
const userName = computed(() => userStore.userInfo?.name || userInfo.value?.name || 'Admin')

// 使用语言组合式函数
const { isEnglish, toggleLanguage } = useLanguage()

// 全屏切换功能
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement
      .requestFullscreen()
      .then(() => {
        isFullScreen.value = true
      })
      .catch(err => {
        console.error(`全屏切换失败: ${err.message}`)
      })
  } else {
    if (document.exitFullscreen) {
      document
        .exitFullscreen()
        .then(() => {
          isFullScreen.value = false
        })
        .catch(err => {
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
  window.open('http://net.yinhenx.cn/', '_blank')
}

// 处理登出的函数
const handleLogout = async () => {
  try {
    await logout()
    localStorage.removeItem('token')
    // 清空用户 store，确保角色权限被重置
    userStore.clearUserInfo()

    message.success(t('header.logoutSuccess'))
    router.push('/login')
  } catch (error) {
    console.error('登出失败:', error)
    message.error(t('header.logoutFailed'))
  }
}

const fetchUserInfo = async () => {
  try {
    const response = await getUser()
    if (response.data) {
      userInfo.value = response.data
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 消息通知相关功能
const showNotifications = ref(false)
const activeTab = ref('all')
const isLoadingNotices = ref(false)
const notifications = ref<Notice[]>([])

// 按类型过滤通知
const systemNotifications = computed(() => {
  return notifications.value.filter(
    item =>
      getNotificationTypeForBackend(item) === 'info' ||
      getNotificationTypeForBackend(item) === 'warning'
  )
})

const taskNotifications = computed(() => {
  return notifications.value.filter(
    item =>
      getNotificationTypeForBackend(item) === 'task' ||
      getNotificationTypeForBackend(item) === 'success'
  )
})

// 未读消息数量
const unreadCount = computed(() => {
  return notifications.value.filter(item => item.isRead === 0).length
})

// 获取通知数据
const fetchNotifications = async () => {
  isLoadingNotices.value = true
  try {
    const token = localStorage.getItem('token') || ''
    if (!token) {
      console.error('获取通知失败: Token不存在')
      return
    }

    const response = await getNoticeList(token)

    const responseData = response.data

    if (responseData) {
      notifications.value = responseData.data.map((notice: Notice) => {
        return {
          ...notice,
          type: getNotificationTypeForBackend(notice)
        }
      })
    }
  } catch (error) {
    console.error('获取通知失败:', error)
    message.error('获取通知失败，请稍后重试')
  } finally {
    isLoadingNotices.value = false
  }
}

const getNotificationTypeForBackend = (
  notification: Notice
): 'info' | 'warning' | 'success' | 'task' => {
  const content = notification.content?.toLowerCase() || ''
  const title = notification.title?.toLowerCase() || ''

  if (
    title.includes('警告') ||
    content.includes('警告') ||
    title.includes('warning') ||
    content.includes('warning')
  ) {
    return 'warning'
  } else if (
    title.includes('任务') ||
    content.includes('任务') ||
    title.includes('task') ||
    content.includes('task')
  ) {
    return 'task'
  } else if (
    title.includes('成功') ||
    content.includes('成功') ||
    title.includes('完成') ||
    title.includes('success') ||
    content.includes('success') ||
    content.includes('complete')
  ) {
    return 'success'
  } else {
    return 'info' // 默认类型
  }
}

// 标记消息为已读
const readNotification = async (notification: Notice) => {
  if (notification.isRead === 0) {
    try {
      const response = await markNoticeAsRead(notification.noticeId)
      console.log(response, 'response')
      // Axios将响应数据封装在data属性中
      const responseData = response.data

      if (responseData) {
        notification.isRead = 1
        message.success(t('header.marked'))
      } else {
        message.error(t('header.markFailed'))
      }
    } catch (error) {
      console.error('标记已读失败:', error)
      message.error(t('header.markFailed'))
    }
  }
}

// 标记所有为已读
const markAllAsRead = async () => {
  try {
    const response = await markAllNoticesAsRead()
    // Axios将响应数据封装在data属性中
    const responseData = response.data

    if (responseData.code === 200) {
      notifications.value.forEach(item => {
        item.isRead = 1
      })
      message.success(t('header.markAllSuccess'))
    } else {
      message.error(responseData.msg || t('header.markAllFailed'))
    }
  } catch (error) {
    console.error('标记全部已读失败:', error)
    message.error(t('header.markAllFailed'))
  }
}

// 删除某条通知
const deleteNotification = async (noticeId: string) => {
  try {
    const response = await deleteNotice(noticeId)
    // Axios将响应数据封装在data属性中
    const responseData = response.data

    if (responseData.code === 200) {
      // 从数组中找到并删除这条通知
      const index = notifications.value.findIndex(item => item.noticeId === noticeId)
      if (index !== -1) {
        notifications.value.splice(index, 1)
        message.success(t('header.deleteSuccess'))
      }
    } else {
      message.error(responseData.msg || t('header.deleteFailed'))
    }
  } catch (error) {
    console.error('删除消息失败:', error)
    message.error(t('header.deleteFailed'))
  }
}

// 根据类型获取图标
const getNotificationIcon = (type: string | undefined) => {
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
const formatTime = (time: number | string | Date | undefined) => {
  if (!time) return ''
  return dayjs(time).fromNow()
}

// 引导功能实现
const startTour = () => {
  // 改为触发全局事件，让dashboard页面的引导启动
  if (route.path === '/dashboard' || route.path === '/') {
    // 在dashboard页面上，直接通过URL参数触发引导
    router.push({
      path: '/dashboard',
      query: { ...route.query, tour: 'true' }
    })
  } else {
    // 如果不在dashboard页面，先跳转到dashboard，然后触发引导
    router.push({
      path: '/dashboard',
      query: { tour: 'true' }
    })
  }
}

// 添加和移除全屏变化事件监听
onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)

  // 添加自定义事件监听器，用于从其他组件触发头部引导
  window.addEventListener('start-header-tour', startTour)

  // 获取用户信息
  fetchUserInfo()

  // 获取通知消息
  fetchNotifications()
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  window.removeEventListener('start-header-tour', startTour)
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
  line-height: 59px;
}

/* Tour 按钮样式 */
.tour-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1005;
  padding: 8px 15px;
  display: flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: linear-gradient(90deg, #67c23a, #95d475);
  border: none;
}

.tour-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
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

/* 消息通知样式 */
.loading-notifications {
  text-align: center;
  padding: 40px 0;
  color: var(--el-text-color-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.loading-icon {
  font-size: 24px;
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 修改driver.js默认样式，确保与我们的UI风格一致 */
:global(.driver-popover) {
  border-radius: 12px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
}

:global(.driver-popover-title) {
  font-family: var(--el-font-family) !important;
  font-weight: 600 !important;
  font-size: 1.2rem !important;
  color: #303133 !important;
}

:global(.driver-popover-description) {
  font-family: var(--el-font-family) !important;
  color: #606266 !important;
  font-size: 1rem !important;
  line-height: 1.6 !important;
}

:global(.driver-popover-footer button) {
  border-radius: 6px !important;
  padding: 8px 16px !important;
  font-weight: 500 !important;
  transition: all 0.3s !important;
}

:global(.driver-popover-footer .driver-next-btn) {
  background-color: #409eff !important;
}

:global(.driver-popover-footer .driver-prev-btn) {
  color: #606266 !important;
  background-color: #f2f3f5 !important;
}

:global(.driver-popover-footer .driver-close-btn) {
  color: #606266 !important;
  background-color: #f2f3f5 !important;
}
</style>
