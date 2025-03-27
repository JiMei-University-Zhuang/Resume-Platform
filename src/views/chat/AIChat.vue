<template>
  <div class="chat-container">
    <div class="chat-main">
      <div class="chat-header">
        <h2>智能对话</h2>
        <div class="actions">
          <button class="action-button new-chat-btn" @click="startNewChat" title="新对话">
            <i class="el-icon-plus"></i>
            <span>新对话</span>
          </button>
          <el-tooltip content="清空对话">
            <button class="action-button" @click="clearMessages">
              <i class="el-icon-delete"></i>
            </button>
          </el-tooltip>
        </div>
      </div>

      <div class="chat-messages" ref="chatboxRef">
        <div v-if="messages.length === 0" class="welcome-message">
          <div class="welcome-icon">
            <img src="@/assets/robot.svg" alt="AI Robot" />
          </div>
          <h3>欢迎使用智航AI助手</h3>
          <p>有任何问题都可以向我提问，我会尽力为您解答。</p>
          <div class="suggestion-chips">
            <div class="suggestion-chip" @click="useSuggestion('代码')">编写JavaScript代码</div>
            <div class="suggestion-chip" @click="useSuggestion('数学公式')">解释数学公式</div>
            <div class="suggestion-chip" @click="useSuggestion('表格')">创建表格</div>
          </div>
        </div>
        
        <!-- 消息气泡 -->
        <div v-for="(msg, index) in messages" :key="index" :class="['message-container', msg.role]">
          <div class="avatar">
            <div v-if="msg.role === 'user'" class="user-avatar">User</div>
            <div v-else class="ai-avatar">AI</div>
          </div>
          <div class="message-content">
            <div class="message-bubble" v-html="md.render(msg.text)"></div>
            <div class="message-actions" v-if="msg.role === 'ai'">
              <button class="action-btn copy" @click="copyToClipboard(msg.text)" title="复制内容">
                <i class="el-icon-document-copy"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="isTyping" class="message-container ai typing">
          <div class="avatar">
            <div class="ai-avatar">AI</div>
          </div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-input-container">
        <div class="input-wrapper">
          <textarea 
            v-model="userInput" 
            @keydown.enter.prevent="handleEnterPress"
            placeholder="输入您的问题..." 
            rows="1"
            ref="inputRef"
          ></textarea>
          <button 
            class="send-button" 
            @click="handleSendMessage" 
            :disabled="!userInput.trim() || isTyping"
          >
            <i class="el-icon-s-promotion"></i>
          </button>
        </div>
        <div class="disclaimer">
          智航AI助手可能会生成不准确的信息，请自行核实重要内容
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/// <reference lib="dom" />

import { ref, nextTick, onMounted, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import type { Options as MarkdownItOptions } from 'markdown-it'
import Prism from 'prismjs'
import { ElMessage } from 'element-plus'
import type { ChatMessage, MockData } from '@/types/chat'

import 'prismjs/themes/prism-tomorrow.css' 
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-css'
import 'prismjs/plugins/toolbar/prism-toolbar.css'
import 'prismjs/plugins/toolbar/prism-toolbar'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard'
import 'prismjs/plugins/show-language/prism-show-language'
import 'katex/dist/katex.min.css'
import markdownItKatexGpt from 'markdown-it-katex-gpt'

import { codeStr1, formulaStr1, tableStr } from './mocks'

// 初始化变量
const chatboxRef = ref<HTMLDivElement | null>(null)
const inputRef = ref<any>(null)
const messages = ref<ChatMessage[]>([])
const userInput = ref('')
const isTyping = ref(false)

// 调整文本区域高度
const adjustTextareaHeight = () => {
  if (!inputRef.value) return
  
  inputRef.value.style.height = 'auto'
  const newHeight = Math.min(inputRef.value.scrollHeight, 150) // 最大高度为150px
  inputRef.value.style.height = `${newHeight}px`
}

watch(userInput, () => {
  nextTick(() => {
    adjustTextareaHeight()
  })
})

// 处理Enter键按下
const handleEnterPress = (e: any) => { // 使用 any 类型暂时解决 KeyboardEvent 类型错误
  if (e.shiftKey) {
    // Shift+Enter换行，不发送
    return
  }
  handleSendMessage()
}

// 复制到剪贴板
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      ElMessage.success('已复制到剪贴板')
    })
    .catch(err => {
      console.error('复制失败:', err)
      ElMessage.error('复制失败，请重试')
    })
}

// 清空对话
const clearMessages = () => {
  messages.value = []
  scrollToBottom()
}

// 开始新对话
const startNewChat = () => {
  clearMessages()
  userInput.value = ''
}

// 使用建议
const useSuggestion = (suggestion: string) => {
  userInput.value = suggestion
  handleSendMessage()
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (chatboxRef.value) {
      chatboxRef.value.scrollTop = chatboxRef.value.scrollHeight
    }
  })
}

// 初始化 Markdown
const mdOptions: MarkdownItOptions = {
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
  highlight: (str: string, lang: string) => {
    if (lang && Prism.languages[lang]) {
      try {
        return `<pre class="code-block language-${lang}"><code class="language-${lang}">${Prism.highlight(
          str,
          Prism.languages[lang],
          lang
        )}</code></pre>`
      } catch (__) {}
    }
    return `<pre class="code-block"><code>${str}</code></pre>`
  }
}

const md = new MarkdownIt(mdOptions)
md.use(markdownItKatexGpt, {
  delimiters: [
    { left: '\\[', right: '\\]', display: true },
    { left: '\\(', right: '\\)', display: false },
    { left: '$$', right: '$$', display: true },
    { left: '$', right: '$', display: false }
  ]
})

// 模拟数据
const mockData: MockData = {
  代码: codeStr1,
  数学公式: formulaStr1,
  表格: tableStr
}

// AI回复流式处理
const streamAiReply = async (fullText: string) => {
  const index = messages.value.length
  const message: ChatMessage = { role: 'ai', text: '' }
  messages.value.push(message)
  isTyping.value = true

  for (let i = 0; i < fullText.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 20))

    if (messages.value[index]) {
      messages.value[index] = {
        ...messages.value[index],
        text: messages.value[index].text + fullText[i]
      }

      await nextTick()
      Prism.highlightAll()
      scrollToBottom()
    }
  }
  
  isTyping.value = false
}

// 消息处理函数
const handleSendMessage = async () => {
  if (!userInput.value.trim() || isTyping.value) return
  const userMessage = userInput.value
  messages.value.push({ role: 'user', text: userMessage })
  userInput.value = ''
  adjustTextareaHeight()
  scrollToBottom()
  isTyping.value = true

  try {
    if (userMessage in mockData) {
      await streamAiReply(mockData[userMessage])
    } else {
      // 创建新的消息
      messages.value.push({ role: 'ai', text: '' })
      const currentIndex = messages.value.length - 1

      // 创建 EventSource 实例
      const eventSource = new EventSource(
        `http://8.130.75.193:8081/ai/chat?message=${encodeURIComponent(userMessage)}`
      )

      // 监听消息
      eventSource.onmessage = async event => {
        if (messages.value[currentIndex]) {
          messages.value[currentIndex].text += event.data
          await nextTick()
          scrollToBottom()
          Prism.highlightAll()
        }
      }

      // 监听错误
      eventSource.onerror = error => {
        console.error('SSE Error:', error)
        eventSource.close()
        isTyping.value = false
        ElMessage.error('连接中断，请重试')
      }

      // 等待消息完成
      await new Promise(resolve => {
        eventSource.addEventListener('done', () => {
          eventSource.close()
          isTyping.value = false
          resolve(true)
        })

        // 设置超时
        setTimeout(() => {
          eventSource.close()
          isTyping.value = false
          resolve(true)
        }, 30000) // 30秒超时
      })
    }
  } catch (error) {
    const err = error as Error
    ElMessage.error(err.message || '发送消息失败')
    messages.value.push({
      role: 'ai',
      text: '❌ 发送消息失败，请重试'
    })
  } finally {
    isTyping.value = false
    scrollToBottom()
    Prism.highlightAll() // 确保代码高亮
  }
}

// 生命周期钩子
onMounted(() => {
  scrollToBottom()
  
  // 确保输入框调整高度
  if (inputRef.value) {
    adjustTextareaHeight()
    inputRef.value.focus()
  }
})
</script>

<style scoped>
.chat-container {
  display: flex;
  height: calc(100vh - 84px);
  background-color: #f9f9fa;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}

.chat-header {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.action-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 6px;
  border-radius: 4px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
}

.action-button:hover {
  background-color: #f3f4f6;
  color: #dc2626;
}

.action-button.new-chat-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #dc2626;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
}

.action-button.new-chat-btn:hover {
  background-color: #b91c1c;
  color: white;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.welcome-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 16px;
  text-align: center;
  margin: auto 0;
}

.welcome-icon {
  width: 64px;
  height: 64px;
  background-color: #fee2e2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-icon img {
  width: 32px;
  height: 32px;
}

.welcome-message h3 {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.welcome-message p {
  font-size: 16px;
  color: #6b7280;
  max-width: 500px;
  margin: 0;
}

.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  justify-content: center;
}

.suggestion-chip {
  padding: 8px 16px;
  background-color: #fee2e2;
  color: #dc2626;
  border-radius: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
}

.suggestion-chip:hover {
  background-color: #fecaca;
}

/* 消息气泡样式 */
.message-container {
  display: flex;
  gap: 16px;
  max-width: 100%;
}

.avatar {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.user-avatar,
.ai-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 14px;
}

.user-avatar {
  background-color: #fee2e2;
  color: #dc2626;
}

.ai-avatar {
  background-color: #dc2626;
  color: white;
}

.message-content {
  flex: 1;
  max-width: calc(100% - 52px);
}

.message-bubble {
  border-radius: 12px;
  padding: 12px 16px;
  position: relative;
  overflow-wrap: break-word;
  line-height: 1.5;
}

.user .message-bubble {
  background-color: #fee2e2;
  color: #111827;
}

.ai .message-bubble {
  background-color: #f9fafb;
  color: #111827;
  border: 1px solid #f0f0f0;
}

.message-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.message-content:hover .message-actions {
  opacity: 1;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #f3f4f6;
  color: #dc2626;
}

/* 打字指示器 */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  background-color: #f9fafb;
  border-radius: 12px;
  width: fit-content;
  border: 1px solid #f0f0f0;
}

.typing-indicator span {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #dc2626;
  border-radius: 50%;
  opacity: 0.6;
  animation: typing 1.5s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
}

/* 输入区域样式 */
.chat-input-container {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  background-color: #ffffff;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 12px;
  transition: border-color 0.2s;
}

.input-wrapper:focus-within {
  border-color: #dc2626;
  box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.1);
}

textarea {
  flex: 1;
  border: none;
  padding: 8px 0;
  resize: none;
  background-color: transparent;
  font-family: inherit;
  font-size: 15px;
  line-height: 1.5;
  max-height: 150px;
  min-height: 24px;
  outline: none;
}

.send-button {
  background-color: #dc2626;
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.send-button:hover:not(:disabled) {
  background-color: #b91c1c;
}

.send-button:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.disclaimer {
  margin-top: 12px;
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
}

:deep(.code-block) {
  border-radius: 8px;
  margin: 16px 0;
  position: relative;
  background-color: #1e1e1e;
}

:deep(.code-block code) {
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
}

:deep(.token.comment),
:deep(.token.prolog),
:deep(.token.doctype),
:deep(.token.cdata) {
  color: #6a9955;
}

:deep(.token.punctuation) {
  color: #d4d4d4;
}

:deep(.token.property),
:deep(.token.tag),
:deep(.token.boolean),
:deep(.token.number),
:deep(.token.constant),
:deep(.token.symbol) {
  color: #b5cea8;
}

:deep(.token.selector),
:deep(.token.string),
:deep(.token.char),
:deep(.token.builtin) {
  color: #ce9178;
}

:deep(.token.operator),
:deep(.token.entity),
:deep(.token.url),
:deep(.language-css .token.string),
:deep(.style .token.string) {
  color: #d4d4d4;
}

:deep(.token.atrule),
:deep(.token.attr-value),
:deep(.token.keyword) {
  color: #c586c0;
}

:deep(.token.function) {
  color: #dcdcaa;
}

:deep(.token.regex),
:deep(.token.important),
:deep(.token.variable) {
  color: #d16969;
}

:deep(.token.important),
:deep(.token.bold) {
  font-weight: bold;
}

:deep(.token.italic) {
  font-style: italic;
}

:deep(.token.entity) {
  cursor: help;
}

:deep(p) {
  margin: 0 0 16px;
}

:deep(h1),
:deep(h2),
:deep(h3),
:deep(h4),
:deep(h5),
:deep(h6) {
  margin: 24px 0 16px;
  font-weight: 600;
  line-height: 1.25;
}

:deep(h1) {
  font-size: 2em;
}

:deep(h2) {
  font-size: 1.5em;
}

:deep(h3) {
  font-size: 1.25em;
}

:deep(ul),
:deep(ol) {
  padding-left: 24px;
  margin: 16px 0;
}

:deep(li) {
  margin: 8px 0;
}

:deep(a) {
  color: #dc2626;
  text-decoration: none;
}

:deep(a:hover) {
  text-decoration: underline;
}

:deep(blockquote) {
  margin: 16px 0;
  padding: 0 16px;
  color: #6b7280;
  border-left: 4px solid #e5e7eb;
}

:deep(img) {
  max-width: 100%;
  border-radius: 8px;
}

:deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
}

:deep(table th),
:deep(table td) {
  border: 1px solid #e5e7eb;
  padding: 8px 12px;
}

:deep(table th) {
  background-color: #f9fafb;
  font-weight: 600;
}

:deep(table tr:nth-child(even)) {
  background-color: #f9fafb;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-messages {
    padding: 16px;
  }
  
  .chat-input-container {
    padding: 12px 16px;
  }
  
  .action-button.new-chat-btn span {
    display: none;
  }
}
</style>
