<template>
  <aside class="sidebar" :class="{ collapsed: collapsed }">
    <div class="sidebar-header">
      <a href="#" class="logo-link">
        <img src="@/assets/logo.svg" alt="Logo" class="logo-image" />
        <span class="logo-text" v-if="!collapsed">Career Platform</span>
      </a>
    </div>

    <el-scrollbar>
      <div class="categories-section" v-if="!collapsed">
        <h2 class="categories-title">功能导航</h2>

        <div class="category-list">
          <router-link
            to="/dashboard"
            class="category-item"
            :class="{ active: route.path === '/dashboard' }"
          >
            <div class="category-icon">
              <el-icon><HomeFilled /></el-icon>
            </div>
            <span class="category-label">首页</span>
          </router-link>

          <router-link
            to="/datascreen"
            class="category-item"
            :class="{ active: route.path === '/datascreen' }"
          >
            <div class="category-icon">
              <el-icon><DataLine /></el-icon>
            </div>
            <span class="category-label">数据大屏</span>
          </router-link>

          <div class="category-section">
            <h3 class="section-title">AI工具</h3>
          </div>

          <router-link to="/chat" class="category-item" :class="{ active: route.path === '/chat' }">
            <div class="category-icon">
              <el-icon><ChatDotRound /></el-icon>
            </div>
            <span class="category-label">AI助手</span>
          </router-link>

          <router-link
            to="/personality"
            class="category-item"
            :class="{ active: route.path === '/personality' }"
          >
            <div class="category-icon">
              <el-icon><UserFilled /></el-icon>
            </div>
            <span class="category-label">AI性格测试</span>
          </router-link>

          <router-link
            to="/id-photo"
            class="category-item"
            :class="{ active: route.path === '/id-photo' }"
          >
            <div class="category-icon">
              <el-icon><Camera /></el-icon>
            </div>
            <span class="category-label">AI证件照</span>
          </router-link>

          <div class="category-section">
            <h3 class="section-title">简历与职业</h3>
          </div>

          <router-link
            to="/resume/create"
            class="category-item"
            :class="{ active: route.path.startsWith('/resume/create') }"
          >
            <div class="category-icon">
              <el-icon><Document /></el-icon>
            </div>
            <span class="category-label">创建简历</span>
          </router-link>

          <router-link
            to="/resume/templates"
            class="category-item"
            :class="{ active: route.path === '/resume/templates' }"
          >
            <div class="category-icon">
              <el-icon><CopyDocument /></el-icon>
            </div>
            <span class="category-label">简历模板</span>
          </router-link>

          <router-link
            to="/resume/analysis"
            class="category-item"
            :class="{ active: route.path === '/resume/analysis' }"
          >
            <div class="category-icon">
              <el-icon><DataAnalysis /></el-icon>
            </div>
            <span class="category-label">简历分析</span>
          </router-link>

          <router-link
            to="/resume/insights"
            class="category-item"
            :class="{ active: route.path === '/resume/insights' }"
          >
            <div class="category-icon">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <span class="category-label">行业洞察</span>
          </router-link>

          <div class="category-section">
            <h3 class="section-title">职业规划</h3>
          </div>

          <router-link
            to="/career-planning/analysis"
            class="category-item"
            :class="{ active: route.path === '/career-planning/analysis' }"
          >
            <div class="category-icon">
              <el-icon><Aim /></el-icon>
            </div>
            <span class="category-label">职业分析</span>
          </router-link>

          <router-link
            to="/career-planning/roadmap"
            class="category-item"
            :class="{ active: route.path === '/career-planning/roadmap' }"
          >
            <div class="category-icon">
              <el-icon><Compass /></el-icon>
            </div>
            <span class="category-label">发展规划</span>
          </router-link>

          <router-link
            to="/career-planning/recommendation"
            class="category-item"
            :class="{ active: route.path === '/career-planning/recommendation' }"
          >
            <div class="category-icon">
              <el-icon><StarFilled /></el-icon>
            </div>
            <span class="category-label">职业推荐</span>
          </router-link>

          <div class="category-section">
            <h3 class="section-title">考试中心</h3>
          </div>

          <router-link
            to="/exam/civil-service"
            class="category-item"
            :class="{ active: route.path === '/exam/civil-service' }"
          >
            <div class="category-icon">
              <el-icon><Reading /></el-icon>
            </div>
            <span class="category-label">公务员考试</span>
          </router-link>

          <router-link
            to="/exam/postgraduate"
            class="category-item"
            :class="{ active: route.path === '/exam/postgraduate' }"
          >
            <div class="category-icon">
              <el-icon><Collection /></el-icon>
            </div>
            <span class="category-label">考研备考</span>
          </router-link>
        </div>
      </div>

      <!-- 折叠模式下只显示图标 -->
      <div class="collapsed-icons" v-if="collapsed">
        <router-link
          to="/dashboard"
          class="category-icon-collapsed"
          :class="{ active: route.path === '/dashboard' }"
        >
          <el-icon><HomeFilled /></el-icon>
        </router-link>
        <router-link
          to="/datascreen"
          class="category-icon-collapsed"
          :class="{ active: route.path === '/datascreen' }"
        >
          <el-icon><DataLine /></el-icon>
        </router-link>
        <router-link
          to="/chat"
          class="category-icon-collapsed"
          :class="{ active: route.path === '/chat' }"
        >
          <el-icon><ChatDotRound /></el-icon>
        </router-link>
        <router-link
          to="/personality"
          class="category-icon-collapsed"
          :class="{ active: route.path === '/personality' }"
        >
          <el-icon><UserFilled /></el-icon>
        </router-link>
        <router-link
          to="/id-photo"
          class="category-icon-collapsed"
          :class="{ active: route.path === '/id-photo' }"
        >
          <el-icon><Camera /></el-icon>
        </router-link>
        <router-link
          to="/resume/create"
          class="category-icon-collapsed"
          :class="{ active: route.path.startsWith('/resume') }"
        >
          <el-icon><Document /></el-icon>
        </router-link>
        <router-link
          to="/career-planning/analysis"
          class="category-icon-collapsed"
          :class="{ active: route.path.startsWith('/career-planning') }"
        >
          <el-icon><Compass /></el-icon>
        </router-link>
        <router-link
          to="/exam/civil-service"
          class="category-icon-collapsed"
          :class="{ active: route.path.startsWith('/exam') }"
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
  TrendCharts,
  Aim,
  Compass,
  StarFilled,
  Reading,
  Collection
} from '@element-plus/icons-vue'
import { useAppStore } from '@/stores'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const route = useRoute()
const appStore = useAppStore()
const { collapsed, isDark } = storeToRefs(appStore)

// 计算属性
const menuBackgroundColor = computed(() => (isDark.value ? '#141414' : '#304156'))
const menuTextColor = computed(() => (isDark.value ? '#fff' : '#bfcbd9'))

defineExpose({
  route,
  collapsed,
  isDark,
  menuBackgroundColor,
  menuTextColor
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

.categories-section {
  padding: 16px;
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
  background-color: #f0f7ff;
  color: #1a73e8;
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
  color: #1a73e8;
}

.category-label {
  font-size: 14px;
  color: #333;
}

.category-item.active .category-label {
  color: #1a73e8;
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
  background-color: #f0f7ff;
  color: #1a73e8;
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
  background-color: #1a2033;
}

html.dark .category-icon-collapsed {
  color: #ccc;
}

html.dark .category-icon-collapsed:hover {
  background-color: #2c2c2c;
}

html.dark .category-icon-collapsed.active {
  background-color: #1a2033;
}
</style>
