<template>
  <!-- 搜索框 -->
  <el-row>
    <el-col :span="24">
      <el-input placeholder="用户名" :suffix-icon="Search" style="width: 300px;" />
      <el-button type="primary" plain :icon="Search">搜索</el-button>
      <el-button type="primary" plain :icon="CirclePlus">添加</el-button>
      <el-button type="danger" plain :icon="Delete">删除</el-button>
    </el-col>
  </el-row>

  <el-table :data="userList" style="width: 100%">
    <el-table-column prop="id" label="id" width="120"> </el-table-column>
    <el-table-column prop="username" label="用户名" width="160"> </el-table-column>
    <el-table-column prop="password" label="密码" width="160"> </el-table-column>
    <el-table-column prop="name" label="昵称" width="180"> </el-table-column>
    <el-table-column prop="sex" label="性别" width="120"> </el-table-column>
    <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
    <el-table-column prop="telephone" label="电话" width="180"> </el-table-column>
    <el-table-column prop="enabled" label="状态" width="120"> </el-table-column>
    <el-table-column prop="role" label="用户角色" width="120"> </el-table-column>
  </el-table>

</template>

<script setup lang="ts">
import { Delete, Search, CirclePlus } from '@element-plus/icons-vue'
import { reactive } from 'vue';

interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  sex: number;
  email: string;
  telephone: string;
  role: string;
  enabled: number;
}
const userList = reactive<User[]>([])



</script>

<style scoped></style>