<template>
  <div class="learning-ai-assistant" :class="{ expanded: expanded }">
    <div class="ai-header" @click="toggleExpanded">
      <div class="left">
        <div class="avatar">
          <div class="avatar-icon">AI</div>
        </div>
        <div class="title">
          <div class="name">学习规划助手</div>
          <div class="status" v-if="expanded">
            {{ isTyping ? '正在思考...' : '可以为您提供帮助' }}
          </div>
        </div>
      </div>
      <div class="actions">
        <button class="toggle-btn">
          <IconChevronDown v-if="expanded" />
          <IconChevronUp v-else />
        </button>
      </div>
    </div>

    <div class="content-area" v-if="expanded">
      <div class="messages" ref="messagesRef">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="message"
          :class="{ 'user-message': message.isUser, 'ai-message': !message.isUser }"
        >
          <div class="message-content">
            <div class="sender">{{ message.isUser ? '你' : 'AI助手' }}</div>
            <div class="text" v-html="formatMessage(message.text)"></div>
          </div>
        </div>

        <div v-if="isTyping" class="message ai-message">
          <div class="message-content">
            <div class="sender">AI助手</div>
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <div class="suggestions" v-if="showSuggestions">
        <button
          v-for="(suggestion, index) in suggestions"
          :key="index"
          class="suggestion-btn"
          @click="sendMessage(suggestion)"
        >
          {{ suggestion }}
        </button>
      </div>

      <div class="input-area">
        <input
          type="text"
          v-model="userInput"
          placeholder="输入您的学习问题..."
          @keyup.enter="sendMessage()"
          :disabled="isTyping"
        />
        <button class="send-btn" @click="sendMessage()" :disabled="isTyping || !userInput.trim()">
          <IconSend />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick, onUnmounted } from 'vue'
import IconChevronDown from '@/components/icons/IconChevronDown.vue'
import IconChevronUp from '@/components/icons/IconChevronUp.vue'
import IconSend from '@/components/icons/IconSend.vue'
import { connectAIChatFetch } from '@/api/chat'

const props = defineProps({
  careerName: {
    type: String,
    default: ''
  },
  userSkills: {
    type: Array as () => string[],
    default: () => []
  },
  careerSkills: {
    type: Array as () => string[],
    default: () => []
  }
})

const emit = defineEmits(['update-plan'])

const expanded = ref(false)
const userInput = ref('')
const messages = ref<{ isUser: boolean; text: string }[]>([])
const messagesRef = ref<HTMLElement | null>(null)
const isTyping = ref(false)
const showSuggestions = ref(true)
// 存储当前的API连接对象
let currentConnection: { close: () => void } | null = null

// 监听职业变化，重置对话
watch(
  () => props.careerName,
  () => {
    if (props.careerName) {
      resetConversation()
    }
  },
  { immediate: true }
)

// 计算用户技能缺口
const skillGap = computed(() => {
  if (!props.careerSkills.length || !props.userSkills.length) return []
  return props.careerSkills.filter(skill => !props.userSkills.includes(skill))
})

// 根据职业和技能差距生成建议问题
const suggestions = computed(() => {
  if (!props.careerName) return []

  const baseQuestions = [
    `我想成为${props.careerName}，应该怎么规划学习路径？`,
    `${props.careerName}需要掌握哪些核心技能？`,
    `我是初学者，如何入门${props.careerName}？`
  ]

  if (skillGap.value.length > 0) {
    baseQuestions.push(`我需要学习哪些技能来弥补与${props.careerName}的差距？`)

    // 添加关于特定技能的问题
    if (skillGap.value.length <= 3) {
      skillGap.value.forEach(skill => {
        baseQuestions.push(`如何学习和提高${skill}技能？`)
      })
    } else {
      // 如果技能差距太多，只选择前3个
      for (let i = 0; i < 3; i++) {
        baseQuestions.push(`如何学习和提高${skillGap.value[i]}技能？`)
      }
    }
  }

  return baseQuestions
})

function toggleExpanded() {
  expanded.value = !expanded.value

  if (expanded.value && messages.value.length === 0) {
    // 初始欢迎消息
    addAIMessage(
      `你好！我是你的学习规划助手。我可以帮你规划${props.careerName || '职业'}学习路径，制定学习计划，以及解答相关问题。你可以点击下方的建议或直接输入问题。`
    )
  }
}

function resetConversation() {
  // 取消当前正在进行的API请求
  if (currentConnection) {
    currentConnection.close()
    currentConnection = null
  }

  messages.value = []
  showSuggestions.value = true

  if (expanded.value) {
    addAIMessage(
      `你好！我是你的学习规划助手。我可以帮你规划${props.careerName || '职业'}学习路径，制定学习计划，以及解答相关问题。你可以点击下方的建议或直接输入问题。`
    )
  }
}

function sendMessage(text?: string) {
  const message = text || userInput.value.trim()
  if (!message || isTyping.value) return

  // 取消当前正在进行的API请求
  if (currentConnection) {
    currentConnection.close()
    currentConnection = null
  }

  // 添加用户消息
  messages.value.push({ isUser: true, text: message })
  userInput.value = ''
  showSuggestions.value = false

  // 滚动到底部
  nextTick(() => {
    scrollToBottom()
  })

  // 设置typing状态，准备接收AI回复
  isTyping.value = true

  // 构建与职业相关的上下文信息
  const careerContext = buildCareerContext()

  // 完整的用户消息，包含职业背景上下文
  const fullMessage = `${careerContext}\n\n用户问题: ${message}`

  // 使用API获取AI回复
  currentConnection = connectAIChatFetch(fullMessage, {
    model: 'qwen-max', // 使用默认的千问Max模型
    onMessage: chunk => {
      // 如果是第一个消息块，添加一个新的AI消息
      if (isTyping.value) {
        messages.value.push({ isUser: false, text: chunk })
        isTyping.value = false
      } else {
        // 追加到最后一条消息
        const lastMessage = messages.value[messages.value.length - 1]
        if (!lastMessage.isUser) {
          lastMessage.text += chunk
        }
      }

      // 滚动到底部
      nextTick(() => {
        scrollToBottom()
      })
    },
    onDone: () => {
      // 响应完成
      currentConnection = null

      // 是否应该显示建议
      if (messages.value.length >= 4) {
        showSuggestions.value = false
      } else {
        showSuggestions.value = true
      }
    },
    onError: error => {
      console.error('获取AI回复出错:', error)
      isTyping.value = false
      currentConnection = null

      // 如果发生错误，使用本地回退方案
      useLocalFallback(message)
    }
  })
}

// 构建与职业相关的上下文信息
function buildCareerContext() {
  let context = ''

  // 添加职业信息
  if (props.careerName) {
    context += `当前选择的职业: ${props.careerName}\n`
  }

  // 添加用户技能信息
  if (props.userSkills.length > 0) {
    context += `用户已掌握的技能: ${props.userSkills.join(', ')}\n`
  }

  // 添加职业所需技能信息
  if (props.careerSkills.length > 0) {
    context += `该职业所需的技能: ${props.careerSkills.join(', ')}\n`
  }

  // 添加技能差距信息
  if (skillGap.value.length > 0) {
    context += `技能差距: ${skillGap.value.join(', ')}\n`
  }

  // 添加角色指示
  context += `
你是一个专业的职业学习规划助手，专门帮助用户规划针对特定职业的学习路径。
请根据上述上下文信息，为用户提供以下方面的专业指导：
- 职业学习路径和阶段规划
- 核心技能的学习顺序和重点
- 适合不同阶段的学习资源推荐
- 项目实践和经验积累建议
- 行业认证和进阶方向
请保持专业、具体且实用的建议，避免过于笼统的回答。
`

  return context
}

// 本地回退方案，当API失败时使用
function useLocalFallback(userMessage: string) {
  let response = ''
  const career = props.careerName || '这个职业'

  // 基于用户的问题生成相应的回答
  if (userMessage.includes('规划学习路径') || userMessage.includes('怎么规划')) {
    response = `对于${career}的学习路径，我建议分为以下几个阶段：
    
1. **基础阶段**（2-3个月）：掌握核心概念和工具基础
2. **进阶阶段**（3-4个月）：深入专业技能，开始实践项目
3. **实战阶段**（4-6个月）：参与真实项目，解决实际问题
4. **专业化阶段**（持续学习）：选择专业方向深入研究

API连接暂时不可用，这是基础建议。网络恢复后可获得更详细的学习规划。`
  } else if (userMessage.includes('核心技能') || userMessage.includes('需要掌握')) {
    response = `${career}的核心技能包括：

1. 专业基础知识和理论
2. 核心工具和技术的应用能力
3. 问题分析和解决能力
4. 项目实践和团队协作能力

API连接暂时不可用，这是基础建议。网络恢复后可获得更详细的技能列表。`
  } else {
    response = `抱歉，目前无法连接到AI服务。这是一个本地生成的基础回复。

您询问的是关于"${userMessage.substring(0, 30)}..."的问题。

请稍后再试，或者尝试点击上方的建议问题获取预设回答。当网络恢复后，我可以为您提供更详细和个性化的回答。`
  }

  // 添加AI消息
  addAIMessage(response)

  // 显示建议
  showSuggestions.value = true
}

function addAIMessage(text: string) {
  messages.value.push({ isUser: false, text })

  // 滚动到底部
  nextTick(() => {
    scrollToBottom()
  })
}

function scrollToBottom() {
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

function formatMessage(text: string) {
  // 简单的格式化，可以扩展为支持更多Markdown或HTML格式
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

// 当组件卸载时，确保清理API连接
const close = () => {
  if (currentConnection) {
    currentConnection.close()
    currentConnection = null
  }
}

// 组件卸载时调用清理函数
onUnmounted(() => {
  close()
})

// 为组件提供外部调用方法
defineExpose({
  toggleExpanded,
  resetConversation
})
</script>

<style lang="scss" scoped>
.learning-ai-assistant {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 360px;
  background: rgba(15, 23, 42, 0.9);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  z-index: 999;
  border: 1px solid rgba(99, 179, 237, 0.3);
  backdrop-filter: blur(10px);
  max-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;

  &.expanded {
    height: 500px;
  }

  &:not(.expanded) {
    height: 60px;
  }

  .ai-header {
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    background: rgba(99, 179, 237, 0.2);
    border-bottom: 1px solid rgba(99, 179, 237, 0.3);

    &:hover {
      background: rgba(99, 179, 237, 0.3);
    }

    .left {
      display: flex;
      align-items: center;

      .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 12px;
        background: linear-gradient(135deg, #3182ce 0%, #63b3ed 100%);
        display: flex;
        align-items: center;
        justify-content: center;

        .avatar-icon {
          color: white;
          font-size: 14px;
          font-weight: bold;
        }
      }

      .title {
        .name {
          font-size: 15px;
          font-weight: 500;
          color: #fff;
        }

        .status {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 2px;
        }
      }
    }

    .actions {
      .toggle-btn {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        padding: 4px;
      }
    }
  }

  .content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(99, 179, 237, 0.3);
        border-radius: 3px;
      }

      .message {
        max-width: 90%;

        &.user-message {
          align-self: flex-end;

          .message-content {
            background: rgba(99, 179, 237, 0.2);
            border-radius: 12px 12px 0 12px;

            .sender {
              color: #63b3ed;
            }
          }
        }

        &.ai-message {
          align-self: flex-start;

          .message-content {
            background: rgba(15, 23, 42, 0.6);
            border-radius: 0 12px 12px 12px;
            border: 1px solid rgba(99, 179, 237, 0.2);

            .sender {
              color: #63b3ed;
            }
          }
        }

        .message-content {
          padding: 12px;

          .sender {
            font-size: 12px;
            margin-bottom: 4px;
            font-weight: 500;
          }

          .text {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.9);
            line-height: 1.5;

            strong {
              color: #fff;
              font-weight: 600;
            }
          }
        }
      }

      .typing-indicator {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 8px 0;

        span {
          display: inline-block;
          width: 8px;
          height: 8px;
          background-color: rgba(99, 179, 237, 0.6);
          border-radius: 50%;
          animation: typing 1.4s infinite;

          &:nth-child(2) {
            animation-delay: 0.2s;
          }

          &:nth-child(3) {
            animation-delay: 0.4s;
          }
        }

        @keyframes typing {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      }
    }

    .suggestions {
      padding: 10px 16px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      border-top: 1px solid rgba(99, 179, 237, 0.2);
      background: rgba(15, 23, 42, 0.6);

      .suggestion-btn {
        font-size: 13px;
        padding: 6px 12px;
        background: rgba(99, 179, 237, 0.1);
        border: 1px solid rgba(99, 179, 237, 0.3);
        color: rgba(255, 255, 255, 0.9);
        border-radius: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;

        &:hover {
          background: rgba(99, 179, 237, 0.2);
          border-color: rgba(99, 179, 237, 0.5);
        }
      }
    }

    .input-area {
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-top: 1px solid rgba(99, 179, 237, 0.2);
      background: rgba(15, 23, 42, 0.8);

      input {
        flex: 1;
        padding: 10px 12px;
        border-radius: 20px;
        border: 1px solid rgba(99, 179, 237, 0.3);
        background: rgba(15, 23, 42, 0.6);
        color: #fff;
        font-size: 14px;
        outline: none;
        transition: all 0.3s ease;

        &:focus {
          border-color: rgba(99, 179, 237, 0.6);
          box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.1);
        }

        &::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      }

      .send-btn {
        padding: 8px;
        border-radius: 50%;
        border: none;
        background: linear-gradient(135deg, #3182ce 0%, #63b3ed 100%);
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;

        &:hover:not(:disabled) {
          transform: scale(1.05);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }
  }
}
</style>
