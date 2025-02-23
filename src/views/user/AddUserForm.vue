<template>
  <el-dialog v-model="dialogVisible" title="新增用户" width="50%">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码" type="password" show-password />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="电话" prop="telephone">
        <el-input v-model="form.telephone" placeholder="请输入电话" />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="form.role" placeholder="请选择角色">
          <el-option label="管理员" value="ADMIN" />
          <el-option label="普通用户" value="USER" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, watch } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { addUser } from '@/api/user'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue', 'submit'])

const dialogVisible = ref(props.modelValue)
const formRef = ref<FormInstance>()

const form = reactive({
  username: '',
  name: '',
  password: '',
  sex: 1,
  email: '',
  telephone: '',
  role: '',
  enabled: 1
})

const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,18}$/
        if (!regex.test(value)) {
          callback(new Error('密码必须包含英文和数字，且长度在 6 - 18 位之间'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  telephone: [{ required: true, message: '请输入电话', trigger: 'blur' }]
})

watch(() => props.modelValue, (newValue) => {
  dialogVisible.value = newValue
})

const closeDialog = () => {
  emit('update:modelValue', false)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 假设这里有一个 API 来添加用户
        await addUser(form)
        ElMessage.success('用户添加成功')
        emit('submit')
        closeDialog()
      } catch (error) {
        ElMessage.error(error.response?.data?.message || '用户添加失败')
      }
    }
  })
}
</script>