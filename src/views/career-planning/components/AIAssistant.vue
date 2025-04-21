<template>
  <div class="ai-assistant-container" :class="{ 'is-expanded': expanded }">
    <div class="assistant-header">
      <div class="assistant-avatar">
        <div class="ai-icon">AI</div>
      </div>
      <div class="assistant-title">职业规划助手</div>
      <div class="header-actions">
        <button v-if="expanded" class="minimize-btn" @click="toggleExpanded">
          <span>—</span>
        </button>
        <button class="close-btn" @click="close">
          <span>×</span>
        </button>
      </div>
    </div>

    <div v-if="expanded" class="assistant-content">
      <div class="messages-container" ref="messagesContainer">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.role === 'assistant' ? 'assistant-message' : 'user-message']"
        >
          <div v-if="message.role === 'assistant'" class="assistant-bubble">
            <div class="message-text" v-html="formatMessage(message.content)"></div>
          </div>
          <div v-else class="user-bubble">
            <div class="message-text">{{ message.content }}</div>
          </div>
        </div>

        <div v-if="isTyping" class="assistant-message">
          <div class="assistant-bubble typing">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <div class="input-container">
        <input
          type="text"
          v-model="userInput"
          placeholder="输入问题，了解职业规划..."
          @keyup.enter="sendMessage"
        />
        <button class="send-btn" @click="sendMessage" :disabled="!userInput.trim()">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>

      <div class="suggestion-chips">
        <button
          v-for="(suggestion, index) in suggestions"
          :key="index"
          class="suggestion-chip"
          @click="useSuggestion(suggestion)"
        >
          {{ suggestion }}
        </button>
      </div>
    </div>

    <div v-else class="assistant-collapsed" @click="toggleExpanded">
      <span>点击展开职业助手</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { connectAIChatFetch } from '@/api/chat'
import MarkdownIt from 'markdown-it'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-java'

interface Message {
  role: 'assistant' | 'user'
  content: string
}

interface CareerContext {
  career: any | null
  userSkills: any[]
  gapAnalysis: any[]
}

const props = defineProps<{
  context: CareerContext
}>()

const emit = defineEmits(['close'])

const expanded = ref(true)
const messages = ref<Message[]>([
  {
    role: 'assistant',
    content:
      '👋 我是您的职业规划助手，可以帮您分析职业路径、技能提升和就业市场。有什么我可以帮您的吗？'
  }
])
const userInput = ref('')
const isTyping = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

// 初始化Markdown解析器
const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string): string {
    if (lang && Prism.languages[lang]) {
      try {
        return `<pre class="language-${lang}"><code>${Prism.highlight(str, Prism.languages[lang], lang)}</code></pre>`
      } catch (e) {}
    }
    return `<pre class="language-plaintext"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 添加助手消息
const addAssistantMessage = (content: string) => {
  messages.value.push({
    role: 'assistant',
    content
  })
  scrollToBottom()
}

// 根据上下文生成建议问题
const suggestions = computed(() => {
  if (props.context.career) {
    return [
      `如何成为${props.context.career.title}？`,
      `${props.context.career.title}的职业前景如何？`,
      `我需要学习哪些技能？`
    ]
  }
  return ['哪些职业适合我的技能？', '如何制定职业发展计划？', '如何提升我的核心竞争力？']
})

// 监听上下文变化，添加相关信息
watch(
  () => props.context.career,
  newCareer => {
    if (newCareer) {
      addAssistantMessage(
        `我看到您对"${newCareer.title}"感兴趣。您的技能匹配度为${newCareer.matchScore}%。有什么具体问题我可以回答吗？`
      )
    }
  },
  { immediate: true }
)

// 发送消息
const sendMessage = async () => {
  if (!userInput.value.trim()) return

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: userInput.value
  })

  // 清空输入框
  const sentMessage = userInput.value
  userInput.value = ''

  // 滚动到底部
  await scrollToBottom()

  // 显示AI正在输入
  isTyping.value = true

  try {
    // 构建带有职业上下文的消息内容
    let contextMessage = sentMessage

    // 如果有职业上下文，添加到消息中
    if (props.context.career) {
      contextMessage = `[职业规划上下文：用户正在查看"${props.context.career.title}"职业，技能匹配度为${props.context.career.matchScore}%] ${sentMessage}`
    }

    // 创建空的AI回复
    messages.value.push({ role: 'assistant', content: '' })
    const currentIndex = messages.value.length - 1

    // 使用API获取回复
    await new Promise<boolean>(resolve => {
      connectAIChatFetch(contextMessage, {
        model: 'qwen-max', // 可以根据需要选择模型
        onMessage: async data => {
          if (messages.value[currentIndex]) {
            // 将接收到的数据追加到消息内容
            messages.value[currentIndex].content += data

            // 更新UI
            await nextTick()
            scrollToBottom()
            // 对新添加的代码应用语法高亮
            Prism.highlightAll()
          }
        },
        onDone: () => {
          isTyping.value = false
          resolve(true)
        },
        onError: error => {
          console.error('AI回复出错:', error)
          if (messages.value[currentIndex]) {
            messages.value[currentIndex].content += '\n\n> ⚠️ 连接中断，请稍后重试。'
          }
          isTyping.value = false
          resolve(false)
        },
        timeout: 30000 // 30秒超时
      })
    })
  } catch (error) {
    console.error('发送消息失败:', error)
    addAssistantMessage('很抱歉，我无法连接到服务器。请稍后再试。')
  } finally {
    isTyping.value = false
    scrollToBottom()
  }
}

// 格式化消息
const formatMessage = (text: string): string => {
  return md.render(text)
}

// 使用建议问题
const useSuggestion = (suggestion: string) => {
  userInput.value = suggestion
  sendMessage()
}

// 切换展开/折叠状态
const toggleExpanded = () => {
  expanded.value = !expanded.value
}

// 关闭助手
const close = () => {
  emit('close')
}

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.ai-assistant-container {
  position: fixed;
  bottom: 20px;
  right: 40px;
  width: 350px;
  background: rgba(26, 32, 58, 0.95);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  color: #e0e0ff;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  transition: all 0.3s ease;
}

.is-expanded {
  height: 500px;
}

.assistant-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.assistant-avatar {
  margin-right: 10px;
}

.ai-icon {
  background: linear-gradient(135deg, #3498db, #5983ff);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: white;
}

.assistant-title {
  flex-grow: 1;
  font-weight: 600;
  font-size: 16px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.minimize-btn,
.close-btn {
  background: none;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  font-size: 18px;
  transition: background 0.2s;
}

.minimize-btn:hover,
.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.close-btn:hover {
  color: #ff4d4f;
}

.assistant-content {
  display: flex;
  flex-direction: column;
  height: calc(100% - 55px);
}

.messages-container {
  flex-grow: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  margin-bottom: 8px;
}

.assistant-message {
  align-self: flex-start;
}

.user-message {
  align-self: flex-end;
}

.assistant-bubble,
.user-bubble {
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
}

.assistant-bubble {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-bottom-left-radius: 4px;
}

.user-bubble {
  background: linear-gradient(135deg, #3498db, #5983ff);
  color: white;
  border-bottom-right-radius: 4px;
}

.typing {
  width: 70px;
}

.typing-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  display: inline-block;
  animation: typing 1.3s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

.input-container {
  display: flex;
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.input-container input {
  flex-grow: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 8px 16px;
  color: #e0e0ff;
  outline: none;
  font-size: 14px;
}

.input-container input::placeholder {
  color: rgba(224, 224, 255, 0.5);
}

.input-container input:focus {
  border-color: rgba(89, 131, 255, 0.5);
}

.send-btn {
  width: 36px;
  height: 36px;
  margin-left: 8px;
  background: linear-gradient(135deg, #3498db, #5983ff);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s;
}

.send-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(89, 131, 255, 0.3);
}

.send-btn:disabled {
  background: rgba(255, 255, 255, 0.1);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  color: rgba(255, 255, 255, 0.3);
}

.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 16px 16px;
}

.suggestion-chip {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 12px;
  color: rgba(224, 224, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.suggestion-chip:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

.assistant-collapsed {
  padding: 12px 16px;
  text-align: center;
  font-size: 14px;
  color: rgba(224, 224, 255, 0.7);
  cursor: pointer;
}

.message-text :deep(b) {
  color: #5ac8fa;
  font-weight: 600;
}

/* 添加对Markdown代码块的样式 */
.message-text :deep(pre) {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 12px;
  overflow-x: auto;
  margin: 10px 0;
}

.message-text :deep(code) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
}

.message-text :deep(p) {
  margin: 8px 0;
}

.message-text :deep(ul),
.message-text :deep(ol) {
  padding-left: 20px;
  margin: 8px 0;
}

.message-text :deep(li) {
  margin: 4px 0;
}

.message-text :deep(a) {
  color: #5ac8fa;
  text-decoration: none;
}

.message-text :deep(a:hover) {
  text-decoration: underline;
}
</style>
