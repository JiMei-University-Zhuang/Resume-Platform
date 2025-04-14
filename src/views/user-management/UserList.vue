<template>
  <div class="user-list-container">
    <a-card :bordered="false" class="card-container">
      <div class="page-header">
        <h1 class="page-title">用户管理</h1>
        <div class="page-actions">
          <a-button type="primary" @click="handleAddUser">
            <template #icon><plus-outlined /></template>
            添加用户
          </a-button>
        </div>
      </div>

      <!-- 搜索和筛选区域 -->
      <a-form layout="inline" :model="searchForm" class="search-form">
        <a-form-item label="用户名">
          <a-input v-model:value="searchForm.username" placeholder="请输入用户名" allow-clear />
        </a-form-item>
        <a-form-item label="角色">
          <a-select
            v-model:value="searchForm.role"
            placeholder="请选择角色"
            style="width: 150px"
            allow-clear
          >
            <a-select-option value="ADMIN">管理员</a-select-option>
            <a-select-option value="USER">普通用户</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch">
              <template #icon><search-outlined /></template>
              搜索
            </a-button>
            <a-button @click="resetSearch">
              <template #icon><redo-outlined /></template>
              重置
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>

      <!-- 用户列表表格 -->
      <a-table
        :columns="columns"
        :data-source="userList"
        :loading="loading"
        :pagination="false"
        row-key="id"
        :scroll="{ x: 1200 }"
        bordered
        size="middle"
        class="user-table"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'avatar'">
            <a-avatar :src="record.avatar" :size="40" />
          </template>

          <template v-if="column.key === 'role'">
            <a-tag :color="record.role === 'ADMIN' ? 'green' : 'blue'">
              {{ record.role === 'ADMIN' ? '管理员' : '普通用户' }}
            </a-tag>
          </template>

          <template v-if="column.key === 'action'">
            <a-space size="middle">
              <a-button @click="handleEditUser(record)">
                <template #icon><edit-outlined /></template>
                编辑
              </a-button>
              <a-popconfirm
                title="确定要删除此用户吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDeleteUser(record)"
              >
                <a-button danger>
                  <template #icon><delete-outlined /></template>
                  删除
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <a-pagination
          v-model:current="currentPage"
          v-model:pageSize="pageSize"
          :total="total"
          :show-total="(total: number) => `共 ${total} 条记录`"
          :page-size-options="['10', '20', '50', '100']"
          show-size-changer
          @change="handleCurrentChange"
          @showSizeChange="handleSizeChange"
        />
      </div>
    </a-card>

    <!-- 添加用户弹窗 -->
    <a-modal
      v-model:visible="addUserModalVisible"
      title="添加用户"
      :width="700"
      @cancel="handleAddUserCancel"
      :destroyOnClose="true"
    >
      <a-form
        ref="addFormRef"
        :model="addUserForm"
        :rules="userFormRules"
        layout="vertical"
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
      >
        <a-row :gutter="24">
          <a-col :span="12">
            <!-- 用户名 -->
            <a-form-item label="用户名" name="username">
              <a-input v-model:value="addUserForm.username" placeholder="请输入用户名" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <!-- 姓名 -->
            <a-form-item label="姓名" name="name">
              <a-input v-model:value="addUserForm.name" placeholder="请输入姓名" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <!-- 邮箱 -->
            <a-form-item label="邮箱" name="email">
              <a-input v-model:value="addUserForm.email" placeholder="请输入邮箱" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <!-- 电话 -->
            <a-form-item label="电话" name="telephone">
              <a-input v-model:value="addUserForm.telephone" placeholder="请输入电话" />
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
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码长度至少6个字符' }
              ]"
            >
              <a-input-password v-model:value="addUserForm.password" placeholder="请输入密码" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <!-- 角色 -->
            <a-form-item label="角色" name="role">
              <a-select v-model:value="addUserForm.role" placeholder="请选择角色">
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
              <a-input v-model:value="addUserForm.avatar" placeholder="请输入头像URL" />
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
                  addUserForm.avatar ||
                  'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                "
                :size="80"
              />
            </div>
          </a-col>
        </a-row>
      </a-form>

      <template #footer>
        <a-button @click="handleAddUserCancel">取消</a-button>
        <a-button type="primary" :loading="submitting" @click="handleAddUserSubmit">提交</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  PlusOutlined,
  SearchOutlined,
  RedoOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'

// 表格列定义
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    width: 120
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 120
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    key: 'avatar',
    width: 100
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    width: 180
  },
  {
    title: '电话',
    dataIndex: 'telephone',
    key: 'telephone',
    width: 130
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    width: 100
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 200
  }
]

// 模拟的用户列表数据
interface User {
  id: string
  username: string
  password?: string
  name: string
  avatar: string
  email: string
  telephone?: string
  enabled: number
  role: string
  createTime: string
}

const router = useRouter()
const loading = ref(false)
const userList = ref<User[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 搜索表单
const searchForm = reactive({
  username: '',
  role: undefined
})

// 重置搜索条件
const resetSearch = () => {
  searchForm.username = ''
  searchForm.role = undefined
  fetchUserList()
}

// 搜索用户
const handleSearch = () => {
  currentPage.value = 1 // 重置到第一页
  fetchUserList()
}

// 页码变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchUserList()
}

// 每页条数变化
const handleSizeChange = (_current: number, size: number) => {
  pageSize.value = size
  fetchUserList()
}

// 添加用户表单
const addUserModalVisible = ref(false)
const addFormRef = ref()
const submitting = ref(false)

// 添加用户表单数据
const addUserForm = reactive({
  username: '',
  password: '',
  name: '',
  avatar: '',
  email: '',
  telephone: '',
  role: 'USER'
})

// 用户表单验证规则
const userFormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

// 添加用户
const handleAddUser = () => {
  addUserModalVisible.value = true
}

// 取消添加用户
const handleAddUserCancel = () => {
  addUserModalVisible.value = false
  addFormRef.value?.resetFields()
}

// 提交添加用户表单
const handleAddUserSubmit = () => {
  addFormRef.value
    .validate()
    .then(() => {
      submitting.value = true

      // 模拟API调用
      setTimeout(() => {
        // 在实际应用中，这里应该是真实的API调用
        submitting.value = false
        message.success(`用户 ${addUserForm.username} 创建成功！`)
        addUserModalVisible.value = false
        addFormRef.value.resetFields()
        fetchUserList() // 重新加载数据
      }, 800)
    })
    .catch((errorInfo: any) => {
      console.error('表单验证错误:', errorInfo)
    })
}

// 编辑用户
const handleEditUser = (user: User) => {
  router.push(`/user-management/edit/${user.id}`)
}

// 删除用户
const handleDeleteUser = (user: User) => {
  // 这里应该调用删除用户的API
  // 模拟删除成功
  setTimeout(() => {
    message.success(`用户 "${user.username}" 已删除`)
    fetchUserList() // 重新加载数据
  }, 500)
}

// 获取用户列表数据
const fetchUserList = () => {
  loading.value = true

  // 模拟API调用
  setTimeout(() => {
    // 这里应该是真实的API调用
    // 模拟数据生成
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'admin',
        name: '管理员',
        avatar: 'https://369.taiyanyouxi.com/avatar/20250403003749.png',
        email: 'admin@example.com',
        telephone: '13800138000',
        enabled: 1,
        role: 'ADMIN',
        createTime: '2025-04-01 10:00:00'
      },
      {
        id: '2',
        username: 'user1',
        name: '张三',
        avatar: 'https://avatars.githubusercontent.com/u/10000000',
        email: 'user1@example.com',
        telephone: '13800138001',
        enabled: 1,
        role: 'USER',
        createTime: '2025-04-02 11:30:00'
      },
      {
        id: '3',
        username: 'user2',
        name: '李四',
        avatar: 'https://avatars.githubusercontent.com/u/10000001',
        email: 'user2@example.com',
        telephone: '13800138002',
        enabled: 0,
        role: 'USER',
        createTime: '2025-04-03 09:15:00'
      },
      {
        id: '4',
        username: 'user3',
        name: '王五',
        avatar: 'https://avatars.githubusercontent.com/u/10000002',
        email: 'user3@example.com',
        telephone: '13800138003',
        enabled: 1,
        role: 'USER',
        createTime: '2025-04-04 14:20:00'
      },
      {
        id: '5',
        username: 'user4',
        name: '赵六',
        avatar: 'https://avatars.githubusercontent.com/u/10000003',
        email: 'user4@example.com',
        telephone: '13800138004',
        enabled: 1,
        role: 'USER',
        createTime: '2025-04-05 16:45:00'
      }
    ]

    // 根据搜索条件筛选
    let filteredUsers = mockUsers

    if (searchForm.username) {
      filteredUsers = filteredUsers.filter(user =>
        user.username.toLowerCase().includes(searchForm.username.toLowerCase())
      )
    }

    if (searchForm.role) {
      filteredUsers = filteredUsers.filter(user => user.role === searchForm.role)
    }

    // 模拟分页
    total.value = filteredUsers.length
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    userList.value = filteredUsers.slice(start, end)

    loading.value = false
  }, 500)
}

onMounted(() => {
  fetchUserList()
})
</script>

<style scoped>
.user-list-container {
  padding: 16px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 64px);
}

.card-container {
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

.ant-form-item {
  margin-bottom: 0 !important;
}

.search-form {
  margin-bottom: 24px;
  padding: 24px;
  background-color: #fafafa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.search-form .ant-form-item {
  margin-bottom: 0;
  margin-right: 16px;
}

.search-form .ant-form-item:last-child {
  margin-right: 0;
}

.user-table {
  margin-bottom: 16px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding: 16px 0;
}

html.dark .user-list-container {
  background-color: #141414;
}

html.dark .card-container {
  background-color: #1f1f1f;
}

html.dark .page-title {
  color: rgba(255, 255, 255, 0.85);
}

html.dark .search-form {
  background-color: #2a2a2a;
}

/* 添加用户弹窗样式 */
.avatar-preview {
  display: flex;
  align-items: center;
  margin: 16px 0 8px;
}

.preview-label {
  margin-right: 16px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

html.dark .preview-label {
  color: rgba(255, 255, 255, 0.65);
}

/* Fix for Ant Design Vue and Element Plus style conflicts */
.user-list-container {
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

  .ant-table {
    font-size: 14px;
    background: #fff;
    border-radius: 2px;
  }

  .ant-form-item {
    margin-bottom: 16px;
  }
}
</style>
