<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LoadingScreen from '@/components/LoadingScreen/index.vue'
import { useUserStore } from './stores/userStore'
import { getUser } from './api/user'

const loading = ref(true)
const userStore = useUserStore()

const waitForResources = () => {
  return new Promise<void>(resolve => {
    if (document.readyState === 'complete') {
      resolve()
    } else {
      window.addEventListener('load', () => resolve())
    }
  })
}

// 初始化用户信息
const initUserInfo = async () => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const response = await getUser()
      if (response.data) {
        userStore.setUserInfo(response.data)
      }
    } catch (error) {
      console.error('初始化用户信息失败:', error)
    }
  }
}

onMounted(async () => {
  await waitForResources()
  await new Promise(resolve => setTimeout(resolve, 1000))
  loading.value = false
  initUserInfo()
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
  width: 100%;
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
