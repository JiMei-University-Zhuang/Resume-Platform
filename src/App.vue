<script setup lang="ts">
import { useLayoutStore } from '@/stores/useLayoutStore'

const layoutStore = useLayoutStore()
</script>

<template>
  <el-config-provider>
    <router-view></router-view>
  </el-config-provider>
</template>

<style>
html.dark {
  color-scheme: dark;
}

/* 添加全局样式 */
:root {
  --menu-bg-color: #001529;
  --menu-bg-color-dark: #141414;
}

html.dark {
  --el-bg-color: var(--menu-bg-color-dark);
}

body {
  margin: 0;
  padding: 0;
}
</style>
