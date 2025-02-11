<template>
  <div class="home" :class="{ 'dark': layoutStore.isDark }">
    <h2>欢迎来到后台管理系统</h2>
    <p>当前时间：{{ currentTime }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLayoutStore } from '@/stores/useLayoutStore'

const layoutStore = useLayoutStore()
const currentTime = ref(new Date().toLocaleString())

onMounted(() => {
  setInterval(() => {
    currentTime.value = new Date().toLocaleString()
  }, 1000)
})
</script>

<style scoped>
.home {
  padding: 20px;
  background: white;
  border-radius: 4px;
  transition: all 0.3s;
}

.home.dark {
  background: #141414;
  color: #fff;
}

h2 {
  margin-top: 0;
}
</style> 