<template>
  <!-- 添加用户的弹窗 -->
  <el-dialog title="添加用户" v-model="addDialogVisible" width="50%" @close="resetForm">
    <el-form ref="addUserFormRef" :model="addUserForm" :rules="addUserRules" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addUserForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addUserForm.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="addUserForm.name" placeholder="请输入昵称"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="addUserForm.sex" placeholder="请选择性别">
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addUserForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="telephone">
        <el-input v-model="addUserForm.telephone" placeholder="请输入电话"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="enabled">
        <el-switch v-model="addUserForm.enabled" active-value="1" inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-input v-model="addUserForm.role" placeholder="请输入角色"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeAddDialog">取消</el-button>
        <el-button type="primary" @click="submitAddUser">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import axios from 'axios';
// import { useStore } from 'vuex'; // 引入 Vuex store

// // 获取 Vuex store 实例
// const store = useStore();

// // 从 Vuex 中获取 token
// const token = computed(() => store.state.user.token);

// 弹窗相关逻辑
const addDialogVisible = ref(false); // 控制弹窗显示/隐藏
const addUserFormRef = ref<any>(null); // 表单引用
const addUserForm = reactive({
  username: '',
  password: '',
  name: '',
  sex: '1',
  email: '',
  telephone: '',
  role: '',
  enabled: '1',
});

// 表单验证规则
const addUserRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  telephone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
  role: [{ required: true, message: '请输入角色', trigger: 'blur' }],
};

// 打开弹窗
const openAddDialog = () => {
  addDialogVisible.value = true;
};

// 关闭弹窗并重置表单
const closeAddDialog = () => {
  addDialogVisible.value = false;
  resetForm();
};

// 提交添加用户表单
const emit = defineEmits(['addUser']);

const submitAddUser = () => {
  addUserFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const response = await axios.post(
          '/user/add',
          addUserForm,
          {
            headers: {
              // Authorization: `Bearer ${token}`, // 确保 token 已定义
            },
          }
        );
        if (response.status === 200) {
          closeAddDialog(); // 关闭弹窗
          emit('addUser', response.data); // 触发 addUser 事件并传递新用户数据
          alert('添加成功');
        } else {
          alert('添加失败');
        }
      } catch (error) {
        console.error('添加用户失败:', error);
        alert('添加失败');
      }
    } else {
      return false;
    }
  });
};

// 重置表单
const resetForm = () => {
  addUserFormRef.value?.resetFields();
};

// 暴露方法
defineExpose({
  openAddDialog
});
</script>