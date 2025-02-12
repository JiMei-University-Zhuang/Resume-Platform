<template>
  <aside class="sidebar" :class="{ 'collapsed': layoutStore.collapsed }">
    <el-scrollbar>
      <el-menu router class="menu" :collapse="layoutStore.collapsed" :default-active="route.path"
        :background-color="layoutStore.isDark ? '#141414' : '#304156'"
        :text-color="layoutStore.isDark ? '#fff' : '#bfcbd9'" active-text-color="#409EFF" unique-opened>
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

        <el-sub-menu index="permission">
          <template #title>
            <el-icon>
              <Lock />
            </el-icon>
            <span>权限测试页</span>
          </template>
          <el-menu-item index="/permission/commandPermission">
            <span>指令权限</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="charts">
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

        <el-sub-menu index="nested">
          <template #title>
            <el-icon>
              <Operation />
            </el-icon>
            <span>路由嵌套</span>
          </template>
          <!-- 子菜单项 -->
          <el-menu-item index="/nested/page1">
            <span>page1</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="example">
          <template #title>
            <el-icon>
              <Star />
            </el-icon>
            <span>综合实例</span>
          </template>
          <!-- 子菜单项 -->
        </el-sub-menu>

        <el-sub-menu index="error">
          <template #title>
            <el-icon>
              <Warning />
            </el-icon>
            <span>错误页面</span>
          </template>
          <!-- 子菜单项 -->
          <el-menu-item index="/error401">
            <span>401</span>
          </el-menu-item>
          <el-menu-item index="/error404">
            <span>404</span>
          </el-menu-item>

        </el-sub-menu>

        <el-menu-item index="/error-log">
          <el-icon>
            <Warning />
          </el-icon>
          <template #title>错误日志</template>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </aside>
</template>

<script setup lang="ts">
import {
  HomeFilled,
  Position,
  Lock,
  TrendCharts,
  Operation,
  Star,
  Warning
} from '@element-plus/icons-vue'
import { useLayoutStore } from '@/stores/useLayoutStore'
import { useRoute } from 'vue-router'


const route = useRoute()
const layoutStore = useLayoutStore()
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

:deep(.el-menu--collapse .el-menu-item .el-icon),
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