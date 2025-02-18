<template>
  <!-- 搜索框 -->
  <el-row>
    <el-col :span="24">
      <el-input placeholder="用户名" :suffix-icon="Search" style="width: 300px;" />
      <el-button type="primary" plain :icon="Search" @click="handleSearch">搜索</el-button>
      <el-button type="primary" plain :icon="CirclePlus" @click="openAddDialog">添加</el-button>
      <el-button type="danger" plain :icon="Delete" @click="handleDelete">删除</el-button>
    </el-col>
  </el-row>

  <el-table :data="userList" style="width: 100%">
    <el-table-column prop="id" label="id" width="120"> </el-table-column>
    <el-table-column prop="username" label="用户名" width="160"> </el-table-column>
    <el-table-column prop="password" label="密码" width="160"> </el-table-column>
    <el-table-column prop="name" label="昵称" width="180"> </el-table-column>
    <el-table-column prop="sex" label="性别" width="120">
      <template #default="scope">
        {{ scope.row.sex === '1' ? '男' : '女' }}
      </template>
    </el-table-column>
    <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
    <el-table-column prop="telephone" label="电话" width="180"> </el-table-column>
    <el-table-column prop="enabled" label="状态" width="120">
      <template #default="scope">
        {{ scope.row.enabled === '1' ? '启用' : '禁用' }}
      </template>
    </el-table-column>
    <el-table-column prop="role" label="用户角色" width="120"> </el-table-column>
  </el-table>

  <!-- 添加用户弹窗 -->
  <AddUserDialog @addUser="handleAddUser" ref="addUserDialogRef" />


</template>

<script setup lang="ts">
import { Delete, Search, CirclePlus } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue';
import axios from 'axios'
import { onMounted } from 'vue';
import AddUserDialog from '@/components/createUser.vue'



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
const addUserDialogRef = ref<any>(null);

// 获取用户数据
const fetchUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `${token}`
      }
    };

    const response = await axios.get('user/getList', config);
    userList.length = 0; 
    userList.push(...response.data); // 将数据添加到数组中
    console.log(response.data);
  } catch (error) {
    console.error('获取用户数据失败:', error);
  }
}

// 初始化时获取用户数据
onMounted(() => {
  fetchUsers()
})

// 搜索处理
const handleSearch =async () => {
  
    // const searchValue = userList.value;
    // try {
    //   const response = await axios.get('user/search', {
    //     params: { keyword: searchValue },
    //   });
    //   userList.length = 0;
    //   userList.push(...response.data);
    // } catch (error) {
    //   console.error('搜索用户失败:', error);
    // }
}
// 打开添加对话框
const openAddDialog = () => {
  addUserDialogRef.value.openAddDialog();
}

// 处理添加用户
const handleAddUser = (user: User) => {
  userList.push(user); // 将新用户添加到 userList 中
}


// 删除处理
const handleDelete = async () => {
  try {
    const response = await axios.delete('/user/remove', {
      // data: { id },
    });
    if (response.status === 200) {
      fetchUsers(); // 重新获取用户数据
      alert('删除成功');
    } else {
      alert('删除失败');
    }
  } catch (error) {
    console.error('删除用户失败:', error);
    alert('删除失败');
  }
}

</script>

<style scoped></style>