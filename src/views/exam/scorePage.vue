<template></template>
<script>
import { getUser } from '@/api/user' // 根据你的实际路径导入

// 调用获取用户信息函数
getUser()
  .then(response => {
    // 根据接口定义，response.data 包含用户信息
    const userId = response.data.id
    console.log('当前用户ID:', userId)
    return userId
  })
  .catch(error => {
    console.error('获取用户信息失败:', error)
  })

// 或者使用 async/await 方式
async function getCurrentUserId() {
  try {
    const response = await getUser()
    return response.data.id
  } catch (error) {
    console.error('获取用户ID失败:', error)
    return null
  }
}

// 使用示例
getCurrentUserId().then(id => {
  if (id) {
    console.log('获取到的用户ID:', id)
  }
})
</script>
