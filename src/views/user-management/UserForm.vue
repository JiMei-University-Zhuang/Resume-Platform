<template>
  <div class="user-form-container">
    <a-card :bordered="false" class="form-card">
      <div class="page-header">
        <h1 class="page-title">{{ isEdit ? '编辑用户' : '添加用户' }}</h1>
        <div class="page-actions">
          <a-button @click="goBack">
            <template #icon><arrow-left-outlined /></template>
            返回
          </a-button>
        </div>
      </div>

      <a-form
        ref="formRef"
        :model="userForm"
        :rules="rules"
        layout="vertical"
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
      >
        <a-row :gutter="24">
          <a-col :span="12">
            <!-- 用户名 -->
            <a-form-item label="账号" name="username">
              <a-input v-model:value="userForm.username" placeholder="请输入账号" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <!-- 姓名 -->
            <a-form-item label="昵称" name="name">
              <a-input v-model:value="userForm.name" placeholder="请输入昵称" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <!-- 邮箱 -->
            <a-form-item label="邮箱" name="email">
              <a-input v-model:value="userForm.email" placeholder="请输入邮箱" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <!-- 电话 -->
            <a-form-item label="电话" name="telephone">
              <a-input v-model:value="userForm.telephone" placeholder="请输入电话" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <!-- 性别 -->
            <a-form-item label="性别" name="sex">
              <a-radio-group v-model:value="userForm.sex">
                <a-radio :value="1">男</a-radio>
                <a-radio :value="0">女</a-radio>
                <a-radio :value="2">保密</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <!-- 状态 -->
            <a-form-item label="状态" name="enabled">
              <a-radio-group v-model:value="userForm.enabled">
                <a-radio :value="1">启用</a-radio>
                <a-radio :value="0">禁用</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <!-- 密码 -->
            <a-form-item
              label="密码"
              name="password"
              :rules="[
                { required: !isEdit, message: '请输入密码' },
                { min: 6, message: '密码长度至少6个字符' }
              ]"
            >
              <a-input-password
                v-model:value="userForm.password"
                :placeholder="isEdit ? '留空表示不修改密码' : '请输入密码'"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <!-- 角色 -->
            <a-form-item label="角色" name="role">
              <a-select v-model:value="userForm.role" placeholder="请选择角色">
                <a-select-option value="ADMIN">管理员</a-select-option>
                <a-select-option value="USER">普通用户</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="24">
            <!-- 头像 -->
            <a-form-item label="头像" name="avatar">
              <a-input v-model:value="userForm.avatar" placeholder="请输入头像URL" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 头像预览 -->
        <a-row>
          <a-col :span="24">
            <div class="avatar-preview">
              <span class="preview-label">头像预览：</span>
              <a-avatar
                :src="
                  userForm.avatar ||
                  'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                "
                :size="80"
              />
            </div>
          </a-col>
        </a-row>

        <!-- 表单操作 -->
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="submitForm" :loading="loading">保存</a-button>
            <a-button @click="resetForm">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { editUser, getUserList } from '@/api/user'
import type { IUserQueryParams } from '@/types/user'

// 表单引用
const formRef = ref()

// 路由
const router = useRouter()
const route = useRoute()

// 判断是新增还是编辑
const isEdit = computed(() => route.params.id !== undefined)

// 加载状态
const loading = ref(false)

// 表单数据
const userForm = reactive({
  id: '',
  username: '',
  password: '',
  name: '',
  avatar: '',
  email: '',
  telephone: '',
  role: 'USER',
  sex: 0, // 默认性别值
  enabled: 1, // 默认启用状态
  createTime: ''
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  enabled: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 获取用户信息
const fetchUserInfo = (id: string) => {
  loading.value = true

  // 由于没有根据ID查找的接口，我们使用getUserList并从结果中查找目标用户
  const params: IUserQueryParams = {
    pageNum: 1,
    pageSize: 100 // 设置较大的页面大小，确保能获取到目标用户
  }

  // 尝试通过URL中的用户信息进行更精确的查询
  const userInfo = router.currentRoute.value.query
  if (userInfo && userInfo.username) {
    params.username = userInfo.username as string
  }

  getUserList(params)
    .then(res => {
      // 从返回的用户列表中筛选ID匹配的用户
      const targetUser = res.data.records.find(user => user.id === id)

      if (targetUser) {
        // 找到目标用户，填充表单
        Object.assign(userForm, targetUser)
        console.log('获取用户数据成功:', targetUser)
      } else {
        // 没有找到目标用户
        message.error(`未找到ID为 ${id} 的用户数据`)
      }
    })
    .catch(error => {
      message.error(`获取用户信息失败: ${error.message || '未知错误'}`)
    })
    .finally(() => {
      loading.value = false
    })
}

// 提交表单
const submitForm = () => {
  formRef.value
    .validate()
    .then(() => {
      loading.value = true

      // 如果密码为空，并且是编辑模式，则不提交密码字段
      const submitData = { ...userForm }
      if (isEdit.value && !submitData.password) {
        // 直接从对象中删除密码属性，而不是设置为undefined或空字符串
        const { password, ...dataWithoutPassword } = submitData
        // 调用真实的API更新用户
        editUser(dataWithoutPassword)
          .then(() => {
            message.success(`用户 ${userForm.username} 更新成功！`)
            goBack()
          })
          .catch(error => {
            message.error(`更新用户失败: ${error.message || '未知错误'}`)
          })
          .finally(() => {
            loading.value = false
          })
      } else {
        // 密码不为空或者是新增用户，提交所有数据
        editUser(submitData)
          .then(() => {
            message.success(`用户 ${userForm.username} ${isEdit.value ? '更新' : '创建'}成功！`)
            goBack()
          })
          .catch(error => {
            message.error(
              `${isEdit.value ? '更新' : '创建'}用户失败: ${error.message || '未知错误'}`
            )
          })
          .finally(() => {
            loading.value = false
          })
      }
    })
    .catch((errorInfo: any) => {
      console.error('表单验证错误:', errorInfo)
    })
}

// 重置表单
const resetForm = () => {
  formRef.value.resetFields()

  // 如果是编辑模式，重新获取用户信息
  if (isEdit.value && route.params.id) {
    fetchUserInfo(route.params.id as string)
  }
}

// 返回上一页
const goBack = () => {
  router.push('/user-management/list')
}

// 组件挂载时
onMounted(() => {
  // 如果是编辑模式，获取用户信息
  if (isEdit.value && route.params.id) {
    fetchUserInfo(route.params.id as string)
  }
})
</script>

<style scoped>
.user-form-container {
  padding: 16px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 64px);
}

.form-card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin: 0;
}

.avatar-preview {
  display: flex;
  align-items: center;
  margin: 16px 0 24px;
}

.preview-label {
  margin-right: 16px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

html.dark .user-form-container {
  background-color: #141414;
}

html.dark .form-card {
  background-color: #1f1f1f;
}

html.dark .page-title {
  color: rgba(255, 255, 255, 0.85);
}

html.dark .preview-label {
  color: rgba(255, 255, 255, 0.65);
}

html.dark .card-container {
  background-color: #1f1f1f;
}

/* Fix for Ant Design Vue and Element Plus style conflicts */
.user-form-container {
  /* Reset Element Plus styles */
  .ant-btn {
    line-height: 1.5715;
    position: relative;
    display: inline-block;
    font-weight: 400;
    white-space: nowrap;
    text-align: center;
    background-image: none;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    user-select: none;
    touch-action: manipulation;
    height: auto;
    padding: 4px 15px;
    font-size: 14px;
    border-radius: 2px;
    color: rgba(0, 0, 0, 0.85);
    background: #fff;
    border-color: #d9d9d9;
  }

  .ant-btn-primary {
    color: #fff;
    background: #1890ff;
    border-color: #1890ff;
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
  }

  .ant-form {
    font-size: 14px;
  }

  .ant-form-item {
    margin-bottom: 24px;
  }

  .ant-radio-group {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 1.5715;
    list-style: none;
    display: inline-block;
  }
}
</style>
