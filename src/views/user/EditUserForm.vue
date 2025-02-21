<template>
  <el-dialog v-model="visible" title="编辑用户">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex">
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="电话" prop="telephone">
        <el-input v-model="form.telephone" />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="form.role">
          <el-option label="管理员" value="admin" />
          <el-option label="普通用户" value="USER" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'
import { editUser } from '@/api/user'
import type { IUser } from '@/types/user'

const props = defineProps(['user'])
const emits = defineEmits(['submit'])
const visible = ref(false)
const form = ref<IUser>(props.user)

import { watch } from 'vue'

watch(visible, (newVal) => {
  if (!newVal) {
    form.value = { ...props.user }
  }
})
const rules = {
  // 可根据需求添加表单验证规则
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  sex: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' }
  ],
  telephone: [
    { required: true, message: '请输入电话', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

const submitForm = async () => {
  try {
    await editUser(form)
    ElMessage.success('用户编辑成功')
    visible.value = false
    emits('submit')
  } catch (error) {
    console.error('编辑用户失败:', error)
    ElMessage.error('用户编辑失败')
  }
}

props.user && (visible.value = true)
</script>