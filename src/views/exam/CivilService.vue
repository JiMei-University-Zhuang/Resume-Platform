<template>
  <div class="civil-service">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>公务员考试</span>
          <el-button type="primary" :loading="loading">开始练习</el-button>
        </div>
      </template>
      <div class="exam-content">
        <el-empty description="正在建设中" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref<boolean>(false)

defineExpose({
  loading
})
</script>

<style scoped>
.civil-service {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.exam-content {
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
