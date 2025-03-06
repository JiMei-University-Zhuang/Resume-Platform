<template>
  <div>
    <h1>个人设置</h1>
    <el-form :model="userInfo" label-width="120px">
      <el-form-item label="用户编号" prop="id">
        <el-input v-model="userInfo.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="username">
        <el-input v-model="userInfo.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="userInfo.name"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="userInfo.sex">
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="userInfo.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="telephone">
        <el-input v-model="userInfo.telephone"></el-input>
      </el-form-item>
      <el-form-item label="角色">
        <el-input v-model="userInfo.role" disabled></el-input>
      </el-form-item>

    </el-form>
    <el-button @click="saveUserInfo">保存修改</el-button>
  </div>
</template>

<script lang="ts" setup>
import {  ref, onMounted } from 'vue';
import { getUserInfo, editUser } from '@/api/user';
import { IUser } from '@/types/user';


const userInfo = ref<IUser>({
  id: '',
  username: '',
  password: '',
  name: '',
  sex: 0,
  email: '',
  telephone: '',
  enabled: 0,
  role: '',
  createTime: ''
});
const loadUserInfo = async () => {
  try {
    const response = await getUserInfo();
    userInfo.value = response;
  } catch (error) {
    console.error('加载用户信息出错:', error);
  }
};
const saveUserInfo = async () => {
  try {
    const response = await editUser(userInfo.value);
    console.log('用户信息保存成功:', response);
  } catch (error) {
    console.error('保存用户信息出错:', error);

  }
};

onMounted(() => {
  loadUserInfo();
});


</script>

<style scoped>
h1 {
  color: #333;
  margin-bottom: 20px;
}
</style>