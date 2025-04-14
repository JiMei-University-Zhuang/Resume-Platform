<template>
  <div class="chat-history-container">
    <div class="chat-history-header">
      <h2>聊天历史记录</h2>
      <div class="history-actions">
        <el-button type="primary" @click="refreshHistory" :loading="loading">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
        <el-button @click="goToChat">
          <el-icon><ChatLineRound /></el-icon>
          开始新对话
        </el-button>
      </div>
    </div>

    <div class="history-content">
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="10" animated />
      </div>

      <div v-else-if="chatSessions.length === 0" class="empty-history">
        <el-empty description="暂无聊天记录" />
        <el-button type="primary" @click="goToChat">开始新对话</el-button>
      </div>

      <template v-else>
        <div
          v-for="(session, sessionIndex) in chatSessions"
          :key="sessionIndex"
          class="session-card"
        >
          <div class="session-header">
            <div class="session-info">
              <h3>会话 #{{ session.sessionId.substring(0, 8) }}</h3>
              <p>用户: {{ session.username }}</p>
            </div>
            <div class="session-actions">
              <el-button size="small" @click="toggleSession(sessionIndex)">
                {{ expandedSessions.includes(sessionIndex) ? '收起' : '展开' }}
              </el-button>
            </div>
          </div>

          <div v-show="expandedSessions.includes(sessionIndex)" class="session-messages">
            <div
              v-for="(msg, msgIndex) in session.historyMessages"
              :key="msgIndex"
              class="message-item"
            >
              <div class="message-time">{{ formatTime(msg.timestamp) }}</div>
              <div :class="['message-content', msg.role]">
                <div class="message-sender">{{ msg.role === 'user' ? '用户' : 'AI助手' }}</div>
                <div class="message-text">{{ msg.message }}</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <div class="pagination-container" v-if="totalPages > 1">
      <el-pagination
        v-model:currentPage="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="totalItems"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { getChatHistory, ChatSession } from '@/api/chat'
import { Refresh, ChatLineRound } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const loading = ref(false)
const chatSessions = ref<ChatSession[]>([])
const expandedSessions = ref<number[]>([]) // 存储展开状态的会话索引
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const totalPages = ref(0)
const userStore = useUserStore()

// 格式化时间戳
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 展开/收起会话
const toggleSession = (index: number) => {
  const currentIndex = expandedSessions.value.indexOf(index)
  if (currentIndex === -1) {
    expandedSessions.value.push(index)
  } else {
    expandedSessions.value.splice(currentIndex, 1)
  }
}

// 获取历史对话
const fetchHistory = async () => {
  loading.value = true
  try {
    // 使用Pinia中的用户名，如果不存在则使用默认值
    const username = userStore.getUsername
    const response = await getChatHistory(
      username,
      currentPage.value.toString(),
      pageSize.value.toString()
    )

    if (response.code === 200) {
      chatSessions.value = response.data
      totalItems.value = response.total || chatSessions.value.length
      totalPages.value = Math.ceil(totalItems.value / pageSize.value)

      // 默认展开第一个会话
      if (chatSessions.value.length > 0 && expandedSessions.value.length === 0) {
        expandedSessions.value = [0]
      }
    } else {
      message.error(response.msg || '获取聊天历史失败')
    }
  } catch (error) {
    console.error('获取历史对话失败:', error)
    message.error('获取聊天历史失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 刷新历史
const refreshHistory = () => {
  fetchHistory()
}

// 处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  expandedSessions.value = []
  fetchHistory()
}

// 跳转到聊天页面
const goToChat = () => {
  router.push('/chat')
}

// 组件挂载时获取历史对话
onMounted(() => {
  fetchHistory()
})
</script>

<style scoped>
.chat-history-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.chat-history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.chat-history-header h2 {
  margin: 0;
  color: #6a5acd;
  font-size: 24px;
}

.history-actions {
  display: flex;
  gap: 12px;
}

.history-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  min-height: 500px;
}

.loading-container {
  padding: 20px;
}

.empty-history {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 20px;
}

.session-card {
  margin-bottom: 24px;
  border: 1px solid #e6e6fa;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.session-card:hover {
  box-shadow: 0 4px 12px rgba(106, 90, 205, 0.1);
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f9f6ff;
  border-bottom: 1px solid #e6e6fa;
}

.session-info h3 {
  margin: 0 0 8px 0;
  color: #6a5acd;
  font-size: 18px;
}

.session-info p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.session-messages {
  padding: 16px;
  background-color: #fff;
}

.message-item {
  margin-bottom: 16px;
}

.message-time {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 4px;
  text-align: center;
}

.message-content {
  display: flex;
  flex-direction: column;
  max-width: 80%;
  border-radius: 12px;
  padding: 12px;
  position: relative;
}

.message-content.user {
  background-color: #6a5acd;
  color: white;
  margin-left: auto;
  border-radius: 12px 12px 0 12px;
}

.message-content.assistant {
  background-color: #f3f0ff;
  color: #333;
  border: 1px solid #e6e6fa;
  margin-right: auto;
  border-radius: 12px 12px 12px 0;
}

.message-sender {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
  color: inherit;
}

.message-text {
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
}

.pagination-container {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .chat-history-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .history-actions {
    width: 100%;
  }

  .message-content {
    max-width: 90%;
  }
}
</style>
