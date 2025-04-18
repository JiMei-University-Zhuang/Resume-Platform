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
            @change="handleRoleChange"
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

      <!-- 筛选条件标签 -->
      <div v-if="hasActiveFilters" class="filter-tags">
        <span class="filter-label">筛选条件:</span>
        <a-space>
          <a-tag v-if="searchForm.username" closable @close="clearUsernameFilter" color="blue">
            <template #icon><user-outlined /></template>
            用户名: {{ searchForm.username }}
          </a-tag>
          <a-tag
            v-if="searchForm.role"
            closable
            @close="clearRoleFilter"
            :color="getRoleTagColor(searchForm.role)"
          >
            <template #icon><team-outlined /></template>
            角色: {{ getRoleDisplayName(searchForm.role) }}
          </a-tag>
          <a-button type="link" @click="resetSearch" size="small"> 清除全部 </a-button>
        </a-space>
      </div>

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

        <!-- 空状态展示 -->
        <template #emptyText>
          <div class="empty-wrapper">
            <inbox-outlined style="font-size: 48px; color: #bfbfbf" />
            <p v-if="hasActiveFilters">没有符合筛选条件的用户</p>
            <p v-else>暂无用户数据</p>
            <a-button v-if="hasActiveFilters" @click="resetSearch">清除筛选条件</a-button>
          </div>
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
            <!-- 性别 -->
            <a-form-item label="性别" name="sex">
              <a-radio-group v-model:value="addUserForm.sex">
                <a-radio :value="1">男</a-radio>
                <a-radio :value="0">女</a-radio>
                <a-radio :value="2">保密</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <!-- 状态 -->
            <a-form-item label="状态" name="enabled">
              <a-radio-group v-model:value="addUserForm.enabled">
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
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  PlusOutlined,
  SearchOutlined,
  RedoOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  TeamOutlined,
  InboxOutlined
} from '@ant-design/icons-vue'
import { getUserList, addUser, removeUser } from '@/api/user'
import type { IUserQueryParams, IUser } from '@/types/user'

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
    width: 100,
    filters: [
      { text: '管理员', value: 'ADMIN' },
      { text: '普通用户', value: 'USER' }
    ],
    onFilter: (value: string, record: User) => record.role === value
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

// 用户列表数据
interface User extends IUser {
  avatar: string // 确保头像字段存在并必选
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
  role: 'USER',
  sex: 0, // 默认性别值
  enabled: 1 // 默认启用状态
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
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  enabled: [{ required: true, message: '请选择状态', trigger: 'change' }]
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

      // 使用真实API添加用户
      addUser(addUserForm)
        .then(() => {
          message.success(`用户 ${addUserForm.username} 创建成功！`)
          addUserModalVisible.value = false
          addFormRef.value.resetFields()
          fetchUserList() // 重新加载数据
        })
        .catch(error => {
          message.error(`创建用户失败: ${error.message || '未知错误'}`)
        })
        .finally(() => {
          submitting.value = false
        })
    })
    .catch((errorInfo: any) => {
      console.error('表单验证错误:', errorInfo)
    })
}

// 编辑用户
const handleEditUser = (user: User) => {
  router.push({
    path: `/user-management/edit/${user.id}`,
    query: {
      username: user.username
    }
  })
}

// 删除用户
const handleDeleteUser = (user: User) => {
  loading.value = true

  // 处理可能的undefined情况
  const userId = user.id || ''

  // 使用真实API删除用户
  removeUser(userId)
    .then(() => {
      message.success(`用户 "${user.username}" 已删除`)
      fetchUserList() // 重新加载数据
    })
    .catch(error => {
      message.error(`删除用户失败: ${error.message || '未知错误'}`)
      loading.value = false
    })
}

// 判断是否有激活的筛选条件
const hasActiveFilters = computed(() => {
  return !!searchForm.username || !!searchForm.role
})

// 获取角色显示名称
const getRoleDisplayName = (role: string): string => {
  return role === 'ADMIN' ? '管理员' : '普通用户'
}

// 获取角色标签颜色
const getRoleTagColor = (role: string): string => {
  return role === 'ADMIN' ? 'green' : 'blue'
}

// 角色变更处理
const handleRoleChange = () => {
  // 如果需要立即触发搜索，取消下面的注释
  // handleSearch()
}

// 清除用户名筛选
const clearUsernameFilter = () => {
  searchForm.username = ''
  handleSearch()
}

// 清除角色筛选
const clearRoleFilter = () => {
  searchForm.role = undefined
  handleSearch()
}

// 获取用户列表数据
const fetchUserList = () => {
  loading.value = true

  // 构建查询参数
  const queryParams: IUserQueryParams = {
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    username: searchForm.username || undefined,
    role: searchForm.role // 确保传递角色参数
  }

  // 使用真实API获取用户列表
  getUserList(queryParams)
    .then(res => {
      let filteredRecords = res.data.records

      // 前端再次过滤以确保角色筛选生效
      if (searchForm.role) {
        filteredRecords = filteredRecords.filter(user => user.role === searchForm.role)
      }

      // 使用类型断言解决类型不匹配问题
      userList.value = filteredRecords as User[]

      // 更新总数以反映过滤后的实际数量
      if (searchForm.role && filteredRecords.length !== res.data.records.length) {
        total.value = filteredRecords.length
      } else {
        total.value = res.data.total
      }

      // 如果没有数据且有筛选条件
      if (filteredRecords.length === 0 && (!!searchForm.username || !!searchForm.role)) {
        message.info('没有符合筛选条件的用户数据')
      }
    })
    .catch(error => {
      message.error(`获取用户列表失败: ${error.message || '未知错误'}`)
      userList.value = []
      total.value = 0
    })
    .finally(() => {
      loading.value = false
    })
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

.filter-tags {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.filter-label {
  margin-right: 8px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}

.empty-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
}

.empty-wrapper p {
  margin: 16px 0;
  color: rgba(0, 0, 0, 0.45);
}

html.dark .filter-label {
  color: rgba(255, 255, 255, 0.45);
}

html.dark .empty-wrapper p {
  color: rgba(255, 255, 255, 0.45);
}
</style>
