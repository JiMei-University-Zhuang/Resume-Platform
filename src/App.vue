<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LoadingScreen from '@/components/LoadingScreen/index.vue'

const loading = ref(true)

const waitForResources = () => {
  return new Promise<void>((resolve) => {
    if (document.readyState === 'complete') {
      resolve()
    } else {
      window.addEventListener('load', () => resolve())
    }
  })
}

onMounted(async () => {
  await waitForResources()
  await new Promise(resolve => setTimeout(resolve, 1000))
  loading.value = false
})
</script>

<template>
  <el-config-provider>
    <LoadingScreen :visible="loading" id="app-loading" />
    <router-view v-show="!loading"></router-view>
  </el-config-provider>
</template>

<style>
html.dark {
  color-scheme: dark;
}

:root {
  --menu-bg-color: #001529;
  --menu-bg-color-dark: #141414;
}

html.dark {
  --el-bg-color: var(--menu-bg-color-dark);
}

#app {
  width: 100vw;
  height: 100vh;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  width: 100%;
  overflow-x: hidden;
  
} 
</style>
