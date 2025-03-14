<template>
  <div class="user-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="queryParams.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="queryParams.name" placeholder="请输入昵称" clearable />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="queryParams.role" placeholder="请选择角色" value-key="label" clearable>
            <el-option label="管理员" value="ADMIN" />
            <el-option label="普通用户" value="USER" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon>
              <Search />
            </el-icon>
            搜索
          </el-button>
          <el-button @click="resetQuery">
            <el-icon>
              <Refresh />
            </el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon>
              <Plus />
            </el-icon>
            新增用户
          </el-button>
        </div>
      </template>

      <el-table v-loading="loading" :data="userList" border stripe>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="username" label="用户名" align="center" min-width="120" show-overflow-tooltip />
        <el-table-column prop="name" label="昵称" align="center" min-width="100" show-overflow-tooltip />
        <el-table-column prop="sex" label="性别" width="80" align="center">
          <template #default="{ row }">
            {{ row.sex === 1 ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="160" align="center" show-overflow-tooltip />
        <el-table-column prop="telephone" label="电话" min-width="120" align="center" show-overflow-tooltip />
        <el-table-column prop="role" label="角色" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'success'">
              {{ row.role === 'USER' ? '普通用户' : '管理员' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" align="center" label="创建时间" min-width="160" show-overflow-tooltip />
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">
              <el-icon>
                <Edit />
              </el-icon>
              编辑
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">
              <el-icon>
                <Delete />
              </el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination v-model:current-page="queryParams.pageNum" v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 30, 50]" :total="total" layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>

    <!-- 新增用户弹窗 -->
    <AddUserForm v-model="dialogVisible" @submit="handleSubmit" />

    <!-- 编辑用户弹窗 -->
    <EditUserForm v-model:visible="editDialogVisible" :formData="editUserInfo" @submit="handleEditSubmit" />

    <!-- 删除用户弹窗 -->
    <el-dialog v-model="isDeleteDialogVisible" title="删除确认" @close="handleDeleteDialogClose">
      <p>确定要删除用户 {{ deleteRow.username }} 吗？</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleDeleteDialogCancel">取消</el-button>
          <el-button type="danger" @click="handleDeleteConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>



  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { getUserList, removeUser, editUser } from '@/api/user'
import AddUserForm from '@/views/user/AddUserForm.vue'
import type { IUser, IUserQueryParams } from '@/types/user'
import { ElMessage } from 'element-plus'
import EditUserForm from '@/views/user/EditUserForm.vue'



const loading = ref(false)
const total = ref(0)
const userList = ref<IUser[]>([])
const dialogVisible = ref(false)
const editDialogVisible = ref(false);
const editUserInfo = ref<IUser | null>(null);

const queryParams = ref<IUserQueryParams>({
  pageNum: 1,
  pageSize: 20,
  username: '',
  name: '',
  role: ''
})

const getList = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: queryParams.value.pageNum,
      pageSize: queryParams.value.pageSize
    }
    if (queryParams.value.username) params.username = queryParams.value.username
    if (queryParams.value.name) params.name = queryParams.value.name
    if (queryParams.value.role) params.role = queryParams.value.role

    const data = await getUserList(params)

    userList.value = data?.records || []
    total.value = data?.total || 0
  } catch (error) {
    console.error('获取用户列表失败:', error)
    userList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  queryParams.value.pageNum = 1
  getList()
}

const resetQuery = () => {
  queryParams.value = {
    pageNum: 1,
    pageSize: 20,
    username: '',
    name: '',
    role: ''
  }
  getList()
}

const handleSizeChange = (val: number) => {
  queryParams.value.pageSize = val
  getList()
}

const handleCurrentChange = (val: number) => {
  queryParams.value.pageNum = val
  getList()
}

const handleAdd = () => {
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    await getList()
    ElMessage.success('用户添加成功')
  } catch (error) {
    // 错误已在子组件处理
  }
}

const handleEdit = (row: IUser) => {
  editUserInfo.value = { ...row };
  editDialogVisible.value = true;
};

const handleEditSubmit = async (formData: IUser) => {
  try {
    const token = getToken();
    if (!token) {
      ElMessage.error('未检测到有效的登录信息，请重新登录');
      return;
    }
    const response = await editUser(formData);
    if (response.code === 200) {
      await getList();
      editDialogVisible.value = false;
      ElMessage.success('用户信息编辑成功');
    } else {
      ElMessage.error(`用户信息编辑失败: ${response.message || '未知错误'}`);
    }
  } catch (error) {
    console.error('编辑用户失败:', error);
    ElMessage.error('编辑用户失败，请稍后重试');
  }
};



const isDeleteDialogVisible = ref(false)
const deleteRow = ref<IUser | null>(null)

// 删除用户
const handleDelete = (row: IUser) => {
  deleteRow.value = row
  isDeleteDialogVisible.value = true
}

// 删除弹窗取消
const handleDeleteDialogCancel = () => {
  isDeleteDialogVisible.value = false
}

// 删除弹窗关闭
const handleDeleteDialogClose = () => {
  deleteRow.value = null
}

// 删除确认
const handleDeleteConfirm = async () => {
  if (!deleteRow.value || !deleteRow.value.id) {
    ElMessage.warning('请选择要删除的用户')
    return
  }

  try {
    const token = getToken()
    if (!token) {
      ElMessage.error('未检测到有效的登录信息，请重新登录')
      return
    }
    const response = await removeUser(deleteRow.value.id)
    if (response.code === 200) {
      const index = userList.value.findIndex(item => item.id === deleteRow.value.id)
      if (index !== -1) {
        userList.value.splice(index, 1)
      }
      total.value--
      isDeleteDialogVisible.value = false
      ElMessage.success('用户删除成功')
    } else {
      ElMessage.error(`用户删除失败: ${response.message || '未知错误'}`)
    }
  } catch (error) {
    console.error('删除用户失败:', error)
    ElMessage.error('删除用户失败，请稍后重试')
  }
}

// 获取 token 的方法
const getToken = () => {
  return localStorage.getItem('token')
}



onMounted(() => {
  getList()
})
</script>

<style scoped>
.user-container {
  padding: 20px;
}

.el-table .el-table__cell {
  text-align: center;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.table-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-card__header) {
  padding: 15px 20px;
}

:deep(.el-table) {
  margin: 15px 0;
}

:deep(.el-tag) {
  margin: 0 2px;
}
</style>
