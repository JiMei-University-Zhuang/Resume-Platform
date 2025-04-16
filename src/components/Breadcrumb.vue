<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
useI18n()

const breadcrumbs = ref<any[]>([])

// 更新面包屑
const getBreadcrumb = () => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  breadcrumbs.value = matched
}

// 监听路由变化
watch(
  () => route.path,
  () => {
    getBreadcrumb()
  }
)

// 初始化
getBreadcrumb()

// 面包屑点击处理
const handleLink = (item: any) => {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect)
    return
  }
  router.push(path)
}
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/dashboard' }" style="cursor: pointer">{{
      $t('breadcrumb.home')
    }}</el-breadcrumb-item>
    <el-breadcrumb-item
      v-for="item in breadcrumbs"
      :key="item.path"
      class="bold-text"
      @click="handleLink(item)"
      style="cursor: pointer"
    >
      {{ item.meta.i18n ? $t(item.meta.i18n) : item.meta.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped>
.el-breadcrumb {
  line-height: 50px;
  padding: 0 16px;
  background-color: #fff;
  /* box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08); */
}
.bold-text {
  font-weight: bold;
  color: black;
}
</style>
