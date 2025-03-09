<template>
  <aside class="sidebar" :class="{ 'collapsed': collapsed.value }">
    <el-scrollbar>
      <el-menu router class="menu" :collapse="collapsed.value" :default-active="route.path"
        :background-color="menuBackgroundColor"
        :text-color="menuTextColor" active-text-color="#409EFF" unique-opened>
        <el-menu-item index="/dashboard">
          <el-icon>
            <HomeFilled />
          </el-icon>
          <template #title>首页</template>
        </el-menu-item>



        <el-menu-item index="/guide">
          <el-icon>
            <Position />
          </el-icon>
          <template #title>引导页</template>
        </el-menu-item>

        <el-menu-item index="/user">
          <el-icon>
            <User />
          </el-icon>
          <template #title>用户管理</template>
        </el-menu-item>

        <el-sub-menu index="/permission">
          <template #title>
            <el-icon>
              <Lock />
            </el-icon>
            <span>权限测试页</span>
          </template>
          <el-menu-item index="/permission/page">
            <span>页面权限</span>
          </el-menu-item>
          <el-menu-item index="/permission/role">
            <span>角色权限</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/charts">
          <template #title>
            <el-icon>
              <TrendCharts />
            </el-icon>
            <span>图表</span>
          </template>
          <!-- 子菜单项 -->
          <el-menu-item index="/charts/lineChart">
            <span>折线图</span>
          </el-menu-item>
          <el-menu-item index="/charts/pieChart">
            <span>饼状图</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/error">
          <template #title>
            <el-icon>
              <Warning />
            </el-icon>
            <span>错误页面</span>
          </template>
          <!-- 子菜单项 -->
          <el-menu-item index="/error/error401">
            <span>401</span>
          </el-menu-item>
          <el-menu-item index="/error/error404">
            <span>404</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/resume">
          <template #title>
            <el-icon>
              <Document />
            </el-icon>
            <span>AI简历中心</span>
          </template>
          <el-menu-item index="/resume/create">
            <span>创建简历</span>
          </el-menu-item>
          <el-menu-item index="/resume/templates">
            <span>简历模板</span>
          </el-menu-item>
          <el-menu-item index="/resume/analysis">
            <span>简历分析</span>
          </el-menu-item>
          <el-menu-item index="/resume/insights">
            <span>行业洞察</span>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/personality">
          <el-icon>
            <UserFilled />
          </el-icon>
          <span>MBTI性格测试</span>
        </el-menu-item>

        <el-menu-item index="/chat">
          <el-icon>
            <User />
          </el-icon>
          <template #title>AI聊天</template>
        </el-menu-item>

        <el-menu-item index="/id-photo">
          <el-icon>
            <Camera />
          </el-icon>
          <template #title>AI证件照</template>
        </el-menu-item>

        <el-sub-menu index="/career-planning">
          <template #title>
            <el-icon>
              <Compass />
            </el-icon>
            <span>AI职业规划</span>
          </template>
          <el-menu-item index="/career-planning/analysis">
            <span>职业分析</span>
          </el-menu-item>
          <el-menu-item index="/career-planning/roadmap">
            <span>发展规划</span>
          </el-menu-item>
          <el-menu-item index="/career-planning/recommendation">
            <span>职业推荐</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/exam">
          <template #title>
            <el-icon>
              <Reading />
            </el-icon>
            <span>考试中心</span>
          </template>
          <el-menu-item index="/exam/civil-service">
            <span>公务员考试</span>
          </el-menu-item>
          <el-menu-item index="/exam/postgraduate">
            <span>考研备考</span>
          </el-menu-item>
          <el-menu-item index="/exam/practice">
            <span>模拟练习</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </aside>
</template>

<script setup lang="ts">
import {
  Document,
  UserFilled,
  HomeFilled,
  Position,
  Lock,
  TrendCharts,
  Warning,
  User,
  Camera,
  Compass,
  Reading
} from '@element-plus/icons-vue'
import { useAppStore } from '@/stores'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const route = useRoute()
const appStore = useAppStore()
const { collapsed, isDark } = storeToRefs(appStore)

// 计算属性
const menuBackgroundColor = computed(() => isDark.value ? '#141414' : '#304156')
const menuTextColor = computed(() => isDark.value ? '#fff' : '#bfcbd9')

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
  width: 210px;
  height: 100%;
  background: #304156;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  transition: width 0.28s;
  z-index: 1001;
}

.sidebar.collapsed {
  width: 64px;
}

:deep(.el-menu) {
  border-right: none;
}

:deep(.el-menu--collapse .el-menu-item .el-icon),
:deep(.el-menu--collapse .el-sub-menu__title .el-icon) {
  margin: 0;
}

:deep(.el-menu--collapse) .el-sub-menu__title .el-icon {
  margin-right: 0;
}

html.dark :deep(.el-menu-item) {
  color: #fff !important;
}

html.dark :deep(.el-sub-menu__title) {
  color: #fff !important;
}

html.dark :deep(.el-menu-item.is-active) {
  color: #409EFF !important;
}

:deep(.el-menu-item) {
  height: 56px;
  line-height: 56px;

  &.is-active {
    background-color: #263445 !important;
    color: #409EFF !important;
  }

  &:hover {
    background-color: #263445 !important;
    color: var(--el-menu-text-color) !important;
  }
}

:deep(.el-sub-menu .el-menu-item) {
  min-width: 210px !important;
  background-color: #1f2d3d !important;

  &:hover {
    background-color: #001528 !important;
  }

  &.is-active {
    color: #409EFF !important;
  }
}

:deep(.el-sub-menu__title) {
  &:hover {
    background-color: #263445 !important;
  }
}

:deep(.el-menu-item .el-icon),
:deep(.el-sub-menu__title .el-icon) {
  margin-right: 16px;
  width: 24px;
  text-align: center;
}

:deep(.el-menu--collapse) {
  width: 64px !important;
}

:deep(.el-menu--collapse .el-menu-item .el-icon) {
  margin-right: 0;
}

:deep(.el-menu--collapse) .el-sub-menu__title .el-icon {
  margin-right: 0;
}

html.dark :deep(.el-menu-item) {
  color: #fff !important;
}

html.dark :deep(.el-sub-menu__title) {
  color: #fff !important;
}

html.dark :deep(.el-menu-item.is-active) {
  color: #409EFF !important;
}
:deep(.el-menu--collapse .el-sub-menu__title .el-icon) {
  margin: 0;
}

html.dark :deep(.el-menu-item),
html.dark :deep(.el-sub-menu__title) {
  color: #fff !important;
}

html.dark :deep(.el-menu-item.is-active) {
  color: #409EFF !important;
}
</style>