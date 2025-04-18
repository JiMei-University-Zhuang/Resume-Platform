<template>
  <aside class="sidebar" :class="{ collapsed: collapsed }">
    <div class="sidebar-header">
      <a href="#" class="logo-link">
        <img src="@/assets/logo.svg" alt="Logo" class="logo-image" />
        <span class="logo-text" v-if="!collapsed">{{ t('dashboard.careerPlatform') }}</span>
      </a>
    </div>

    <el-scrollbar height="100%">
      <div class="categories-section" v-if="!collapsed">
        <h2 class="categories-title">{{ t('sider.navigation') }}</h2>

        <div class="category-list">
          <router-link
            to="/dashboard"
            class="category-item"
            :class="{ active: route.path === '/dashboard' }"
            @click="navigateTo('/dashboard')"
          >
            <div class="category-icon">
              <el-icon><HomeFilled /></el-icon>
            </div>
            <span class="category-label">{{ t('sider.home') }}</span>
          </router-link>

          <!-- 管理员专属功能 - 数据大屏 -->
          <router-link
            v-if="userStore.userInfo.role === 'ADMIN'"
            to="/datascreen"
            class="category-item"
            :class="{ active: route.path === '/datascreen' }"
            @click="navigateTo('/datascreen')"
          >
            <div class="category-icon">
              <el-icon><DataLine /></el-icon>
            </div>
            <span class="category-label">{{ t('sider.dataScreen') }}</span>
          </router-link>

          <!-- 管理员专属功能 - 用户管理 -->
          <template v-if="userStore.userInfo.role === 'ADMIN'">
            <div class="category-section">
              <h3 class="section-title">{{ t('sider.systemManagement') }}</h3>
            </div>

            <router-link
              to="/user-management/list"
              class="category-item"
              :class="{ active: route.path.startsWith('/user-management') }"
              @click="navigateTo('/user-management/list')"
            >
              <div class="category-icon">
                <el-icon><User /></el-icon>
              </div>
              <span class="category-label">{{ t('sider.userManagement') }}</span>
            </router-link>
          </template>

          <div class="category-section">
            <h3 class="section-title">{{ t('sider.resumeModule') }}</h3>
          </div>
          <router-link
            to="/resume/create"
            class="category-item"
            :class="{ active: route.path.startsWith('/resume/create') }"
            @click="navigateTo('/resume/create')"
          >
            <div class="category-icon">
              <el-icon><Document /></el-icon>
            </div>
            <span class="category-label">{{ t('sider.createResume') }}</span>
          </router-link>

          <router-link
            to="/resume/templates"
            class="category-item"
            :class="{ active: route.path === '/resume/templates' }"
            @click="navigateTo('/resume/templates')"
          >
            <div class="category-icon">
              <el-icon><CopyDocument /></el-icon>
            </div>
            <span class="category-label">{{ t('sider.resumeTemplates') }}</span>
          </router-link>

          <router-link
            to="/resume/analysis"
            class="category-item"
            :class="{ active: route.path === '/resume/analysis' }"
            @click="navigateTo('/resume/analysis')"
          >
            <div class="category-icon">
              <el-icon><DataAnalysis /></el-icon>
            </div>
            <span class="category-label">{{ t('sider.resumeAnalysis') }}</span>
          </router-link>
          <div class="category-exam">
            <div class="category-section">
              <h3 class="section-title">{{ t('sider.examCenter') }}</h3>
            </div>

            <!-- 公务员考试 -->
            <router-link
              to="/exam/civil-service"
              class="category-item"
              :class="{ active: route.path === '/exam/civil-service' }"
              @click="navigateTo('/exam/civil-service')"
            >
              <div class="category-icon">
                <el-icon><Reading /></el-icon>
              </div>
              <span class="category-label">{{ t('sider.civilServiceExam') }}</span>
            </router-link>

            <router-link
              to="/exam/postgraduate"
              class="category-item"
              :class="{ active: route.path === '/exam/postgraduate' }"
              @click="navigateTo('/exam/postgraduate')"
            >
              <div class="category-icon">
                <el-icon><Collection /></el-icon>
              </div>
              <span class="category-label">{{ t('sider.postgraduatePrep') }}</span>
            </router-link>
          </div>

          <div class="category-AI">
            <div class="category-section">
              <h3 class="section-title">{{ t('sider.aiTools') }}</h3>
            </div>

            <router-link
              to="/chat"
              class="category-item"
              :class="{ active: route.path === '/chat' }"
              @click="navigateTo('/chat')"
            >
              <div class="category-icon">
                <el-icon><ChatDotRound /></el-icon>
              </div>
              <span class="category-label">{{ t('sider.aiAssistant') }}</span>
            </router-link>

            <router-link
              to="/id-photo"
              class="category-item"
              :class="{ active: route.path === '/id-photo' }"
            >
              <div class="category-icon">
                <el-icon><Camera /></el-icon>
              </div>
              <span class="category-label">{{ t('sider.aiIDPhoto') }}</span>
            </router-link>
          </div>

          <div class="category-job">
            <div class="category-section">
              <h3 class="section-title">{{ t('sider.careerPlanning') }}</h3>
            </div>

            <!-- <router-link
              to="/career-planning/map"
              class="category-item"
              :class="{ active: route.path === '/career-planning/map' }"
              @click="navigateTo('/career-planning/map')"
            >
              <div class="category-icon">
                <el-icon><Compass /></el-icon>
              </div>
              <span class="category-label">{{ t('sider.careerMap') }}</span>
            </router-link> -->

            <router-link
              to="/career-star-map"
              class="category-item"
              :class="{ active: route.path === '/career-star-map' }"
              @click="navigateTo('/career-star-map')"
            >
              <div class="category-icon">
                <el-icon><Compass /></el-icon>
              </div>
              <span class="category-label">{{ t('sider.careerMap') }}</span>
            </router-link>

            <router-link
              to="/career-planning/learning-plan"
              class="category-item"
              :class="{ active: route.path === '/career-planning/learning-plan' }"
              @click="navigateTo('/career-planning/learning-plan')"
            >
              <div class="category-icon">
                <el-icon><List /></el-icon>
              </div>
              <span class="category-label">{{ t('sider.learningPlan') }}</span>
            </router-link>

            <router-link
              to="/career-planning/recommendation"
              class="category-item"
              :class="{ active: route.path === '/career-planning/recommendation' }"
              @click="navigateTo('/career-planning/recommendation')"
            >
              <div class="category-icon">
                <el-icon><StarFilled /></el-icon>
              </div>
              <span class="category-label">{{ t('sider.careerRecommendation') }}</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- 折叠模式下只显示图标 -->
      <div class="collapsed-icons" v-if="collapsed">
        <router-link
          to="/dashboard"
          class="category-icon-collapsed"
          :class="{ active: route.path === '/dashboard' }"
          @click="navigateTo('/dashboard')"
          :title="t('sider.home')"
        >
          <el-icon><HomeFilled /></el-icon>
        </router-link>

        <!-- 折叠模式下的管理员专属功能 -->
        <template v-if="userStore.userInfo.role === 'ADMIN'">
          <router-link
            to="/datascreen"
            class="category-icon-collapsed"
            :class="{ active: route.path === '/datascreen' }"
            @click="navigateTo('/datascreen')"
            :title="t('sider.dataScreen')"
          >
            <el-icon><DataLine /></el-icon>
          </router-link>

          <router-link
            to="/user-management/list"
            class="category-icon-collapsed"
            :class="{ active: route.path.startsWith('/user-management') }"
            @click="navigateTo('/user-management/list')"
            :title="t('sider.userManagement')"
          >
            <el-icon><User /></el-icon>
          </router-link>
        </template>

        <router-link
          to="/chat"
          class="category-icon-collapsed"
          :class="{ active: route.path === '/chat' }"
          @click="navigateTo('/chat')"
          :title="t('sider.aiAssistant')"
        >
          <el-icon><ChatDotRound /></el-icon>
        </router-link>
        <router-link
          to="/personality"
          class="category-icon-collapsed"
          :class="{ active: route.path === '/personality' }"
          :title="t('sider.aiTools')"
        >
          <el-icon><UserFilled /></el-icon>
        </router-link>
        <router-link
          to="/id-photo"
          class="category-icon-collapsed"
          :class="{ active: route.path === '/id-photo' }"
          :title="t('sider.aiIDPhoto')"
        >
          <el-icon><Camera /></el-icon>
        </router-link>
        <router-link
          to="/resume/create"
          class="category-icon-collapsed"
          :class="{ active: route.path.startsWith('/resume') }"
          @click="navigateTo('/resume/create')"
          :title="t('sider.resumeModule')"
        >
          <el-icon><Document /></el-icon>
        </router-link>
        <div
          class="category-icon-collapsed dropdown-trigger"
          :class="{ active: route.path.startsWith('/career-planning') }"
          @mouseenter="showCareerDropdown = true"
          @mouseleave="showCareerDropdown = false"
          :title="t('sider.careerPlanning')"
        >
          <el-icon><Compass /></el-icon>
          <div v-if="showCareerDropdown" class="dropdown-menu">
            <router-link
              to="/career-planning/map"
              class="dropdown-item"
              :class="{ active: route.path === '/career-planning/map' }"
              @click="navigateTo('/career-planning/map')"
            >
              {{ t('sider.careerMap') }}
            </router-link>
            <router-link
              to="/career-star-map"
              class="dropdown-item"
              :class="{ active: route.path === '/career-star-map' }"
              @click="navigateTo('/career-star-map')"
            >
              {{ t('sider.careerMap') }} (全屏)
            </router-link>
            <router-link
              to="/career-planning/learning-plan"
              class="dropdown-item"
              :class="{ active: route.path === '/career-planning/learning-plan' }"
              @click="navigateTo('/career-planning/learning-plan')"
            >
              {{ t('sider.learningPlan') }}
            </router-link>
            <router-link
              to="/career-planning/recommendation"
              class="dropdown-item"
              :class="{ active: route.path === '/career-planning/recommendation' }"
              @click="navigateTo('/career-planning/recommendation')"
            >
              {{ t('sider.careerRecommendation') }}
            </router-link>
          </div>
        </div>
        <router-link
          to="/exam/civil-service"
          class="category-icon-collapsed"
          :class="{ active: route.path.startsWith('/exam') }"
          @click="navigateTo('/exam/civil-service')"
          :title="t('sider.examCenter')"
        >
          <el-icon><Reading /></el-icon>
        </router-link>
      </div>
    </el-scrollbar>
  </aside>
</template>

<script setup lang="ts">
import {
  HomeFilled,
  DataLine,
  ChatDotRound,
  UserFilled,
  Camera,
  Document,
  CopyDocument,
  DataAnalysis,
  Compass,
  StarFilled,
  Reading,
  Collection,
  User,
  List
} from '@element-plus/icons-vue'
import { useAppStore } from '@/stores'
import { useUserStore } from '@/stores/userStore'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// 获取i18n实例
const { t } = useI18n()

const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()
const { collapsed, isDark } = storeToRefs(appStore)
const showCareerDropdown = ref(false)

// 计算属性
const menuBackgroundColor = computed(() => (isDark.value ? '#141414' : '#304156'))
const menuTextColor = computed(() => (isDark.value ? '#bfcbd9' : '#fff'))

// 优雅地处理导航，确保路由切换时页面总是更新
const navigateTo = (path: string) => {
  // 判断是否完全相同的路径（精确匹配）
  const isExactSamePath = route.path === path
  // 只有在完全相同的路径时才强制刷新
  // 同一模块下的不同路径不需要强制刷新
  if (isExactSamePath) {
    // 触发全局事件告知布局组件需要刷新
    if (typeof window !== 'undefined') {
      const event = document.createEvent('Event')
      event.initEvent('force-route-refresh', true, true)
      window.dispatchEvent(event)
    }
  }
  // 不再添加时间戳查询参数，除非确定在完全相同的路径上需要强制刷新特定内容
  // router.replace({
  //   path,
  //   query: {
  //     ...route.query,
  //     _r: Date.now().toString()
  //   }
  // })
}

defineExpose({
  route,
  collapsed,
  isDark,
  menuBackgroundColor,
  menuTextColor,
  navigateTo
})
</script>

<style scoped>
.sidebar {
  width: 240px;
  height: 100%;
  background: #ffffff;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  transition: width 0.28s;
  z-index: 1001;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  height: 60px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-image {
  width: 30px;
  height: 30px;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-left: 10px;
}

.el-scrollbar {
  flex: 1;
  height: calc(100% - 60px);
}

.categories-section {
  padding: 16px;
  padding-bottom: 15px;
}

.categories-title {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 16px;
  letter-spacing: 1px;
}

.category-section {
  margin-top: 16px;
  margin-bottom: 8px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #999;
  margin: 0;
  padding: 8px 12px;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.category-item:hover {
  background-color: #f5f5f5;
}

.category-item.active {
  background-color: #f0f0f0;
  color: #4b4b4b;
}

.category-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  margin-right: 10px;
}

.category-item.active .category-icon {
  color: #4b4b4b;
}

.category-label {
  font-size: 14px;
  color: #333;
}

.category-item.active .category-label {
  color: #4b4b4b;
  font-weight: 500;
}

.collapsed-icons {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  gap: 16px;
}

.category-icon-collapsed {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.category-icon-collapsed:hover {
  background-color: #f5f5f5;
}

.category-icon-collapsed.active {
  background-color: #f0f0f0;
  color: #4b4b4b;
}

.dropdown-trigger {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 45px;
  left: 0;
  width: 140px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  z-index: 1000;
}

.dropdown-item {
  display: block;
  padding: 10px 16px;
  text-decoration: none;
  color: #333;
  font-size: 14px;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item.active {
  background-color: #f0f0f0;
  color: #4b4b4b;
  font-weight: 500;
}

html.dark .sidebar {
  background: #1e1e1e;
  border-right: 1px solid #333;
}

html.dark .sidebar-header {
  border-bottom: 1px solid #333;
}

html.dark .logo-text {
  color: #fff;
}

html.dark .categories-title,
html.dark .section-title {
  color: #aaa;
}

html.dark .category-label {
  color: #f0f0f0;
}

html.dark .category-icon {
  color: #ccc;
}

html.dark .category-item:hover {
  background-color: #2c2c2c;
}

html.dark .category-item.active {
  background-color: #404040;
}

html.dark .category-item.active .category-icon,
html.dark .category-item.active .category-label {
  color: #e0e0e0;
}

html.dark .category-icon-collapsed {
  color: #ccc;
}

html.dark .category-icon-collapsed:hover {
  background-color: #2c2c2c;
}

html.dark .category-icon-collapsed.active {
  background-color: #404040;
  color: #e0e0e0;
}

html.dark .dropdown-menu {
  background-color: #1e1e1e;
  border: 1px solid #333;
}

html.dark .dropdown-item {
  color: #f0f0f0;
}

html.dark .dropdown-item:hover {
  background-color: #2c2c2c;
}

html.dark .dropdown-item.active {
  background-color: #404040;
  color: #e0e0e0;
}
</style>
