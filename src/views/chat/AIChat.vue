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
          <button class="action-button history-btn" @click="viewChatHistory" title="历史记录">
            <i class="el-icon-time"></i>
            <span>历史记录</span>
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
            <div class="suggestion-chip" @click="useSuggestion('如何优化我的简历？')">
              如何优化我的简历？
            </div>
            <div class="suggestion-chip" @click="useSuggestion('适合计算机专业毕业生的职业方向')">
              适合计算机专业毕业生的职业方向
            </div>
            <div class="suggestion-chip" @click="useSuggestion('面试常见问题及回答技巧')">
              面试常见问题及回答技巧
            </div>
            <div class="suggestion-chip" @click="useSuggestion('如何提升职场软技能')">
              如何提升职场软技能
            </div>
          </div>
        </div>

        <!-- 消息气泡 -->
        <div v-for="(msg, index) in messages" :key="index" :class="['message-container', msg.role]">
          <template v-if="msg.role === 'user'">
            <div class="message-content user-message">
              <div class="message-bubble" v-html="md.render(msg.text)"></div>
            </div>
            <div class="avatar">
              <div class="user-avatar">User</div>
            </div>
          </template>
          <template v-else>
            <div class="avatar">
              <div class="ai-avatar">AI</div>
            </div>
            <div class="message-content ai-message">
              <div class="message-bubble" v-html="md.render(msg.text)"></div>
              <div class="message-actions">
                <button class="action-btn copy" @click="copyToClipboard(msg.text)" title="复制内容">
                  <i class="el-icon-document-copy"></i>
                </button>
              </div>
            </div>
          </template>
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
        <div class="model-selector-container">
          <div class="model-selector-wrapper">
            <div class="model-name" @click="toggleModelList">
              <span>当前模型:</span>
              <div class="model-badge" :class="selectedModel">
                {{ getModelDisplayName(selectedModel) }}
              </div>
              <i class="model-selector-icon">{{ showModelList ? '▲' : '▼' }}</i>
            </div>

            <!-- 添加一个主题选择器 -->
            <div class="theme-selector">
              <select class="theme-select" title="选择对话主题" v-model="selectedTheme">
                <option value="general">通用对话</option>
                <option value="code">代码助手</option>
                <option value="career">职业规划</option>
                <option value="study">学习辅导</option>
                <option value="creative">创意写作</option>
              </select>
            </div>
          </div>

          <!-- 模型下拉列表 -->
          <div class="model-dropdown" v-if="showModelList">
            <div
              v-for="model in availableModels"
              :key="model.value"
              class="model-option"
              :class="{ active: selectedModel === model.value }"
              @click="selectModel(model.value)"
            >
              <div class="model-option-inner">
                <span class="model-label">{{ model.label }}</span>
                <span class="model-description">{{ model.description }}</span>
              </div>
            </div>
          </div>
        </div>

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
        <div class="disclaimer">智航AI助手可能会生成不准确的信息，请自行核实重要内容</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/// <reference lib="dom" />

import { ref, nextTick, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import type { Options as MarkdownItOptions } from 'markdown-it'
import Prism from 'prismjs'
import type { MockData } from '@/types/chat'
import { connectAIChatFetch } from '@/api/chat'

import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-jsx'
import 'prismjs/plugins/toolbar/prism-toolbar.css'
import 'prismjs/plugins/toolbar/prism-toolbar'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard'
import 'prismjs/plugins/show-language/prism-show-language'
import 'katex/dist/katex.min.css'
import markdownItKatexGpt from 'markdown-it-katex-gpt'

interface LocalChatMessage {
  role: 'user' | 'ai'
  text: string
}

// 初始化变量
const chatboxRef = ref<HTMLDivElement | null>(null)
const inputRef = ref<any>(null)
const messages = ref<LocalChatMessage[]>([])
const userInput = ref('')
const isTyping = ref(false)
const router = useRouter()
const selectedModel = ref('qwen-max') // 默认选择千问模型
const showModelList = ref(false) // 控制模型选择器显示状态
const selectedTheme = ref('general') // 添加主题选择状态

// 可用模型列表
const availableModels = [
  {
    label: '千问-Max',
    value: 'qwen-max',
    description: '通用型AI助手，擅长中文交流和创意写作'
  },
  {
    label: 'DeepSeek-R1',
    value: 'deepseek-r1',
    description: '专注于数学、编程和理工科问题的解决'
  },
  {
    label: 'DeepSeek-V3',
    value: 'deepseek-v3',
    description: '强大的推理和思考能力，精准解决复杂问题'
  },
  {
    label: '百川2-7B',
    value: 'baichuan2-7b-chat-v1',
    description: '轻量级模型，响应速度快，适合日常使用'
  }
]

// 获取模型显示名称
const getModelDisplayName = (modelValue: string) => {
  const model = availableModels.find(m => m.value === modelValue)
  return model ? model.label : '未知模型'
}

// 选择模型
const selectModel = (modelValue: string) => {
  selectedModel.value = modelValue
  showModelList.value = false
}

// 调整文本区域高度
const adjustTextareaHeight = () => {
  if (!inputRef.value) return

  // 重置高度以便准确计算
  inputRef.value.style.height = 'auto'

  // 根据内容长度计算合适的高度
  const contentLength = userInput.value.length
  let newHeight

  if (contentLength === 0) {
    // 当没有内容时，设置为最小高度
    newHeight = 24
  } else if (contentLength < 50) {
    // 短内容时，适当增加一点高度来容纳一行文本
    newHeight = Math.max(24, Math.min(36, inputRef.value.scrollHeight))
  } else {
    // 长内容时，允许更多高度但不超过最大值
    newHeight = Math.min(inputRef.value.scrollHeight, 150)
  }

  inputRef.value.style.height = `${newHeight}px`
}

watch(userInput, () => {
  nextTick(() => {
    adjustTextareaHeight()
  })
})

// 处理Enter键按下
const handleEnterPress = (e: any) => {
  // 使用 any 类型暂时解决 KeyboardEvent 类型错误
  if (e.shiftKey) {
    // Shift+Enter换行，不发送
    return
  }
  handleSendMessage()
}

// 复制到剪贴板
const copyToClipboard = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      // 成功复制后可以选择不显示消息
      // ElMessage.success('已复制到剪贴板')
    })
    .catch(err => {
      console.error('复制失败:', err)
      // 即使复制失败也不显示错误消息
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

// 查看聊天历史
const viewChatHistory = () => {
  router.push('/chat/history')
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
  '如何优化我的简历？': `# 简历优化建议

要打造一份出色的简历，请注意以下几点：

1. **突出关键成就**：用数据和结果展示你的成就，如"提升销售额20%"而非"负责销售"。

2. **针对职位定制**：根据目标职位调整简历内容，突出相关技能和经验。

3. **清晰的结构与排版**：
   - 使用简洁、专业的模板
   - 保持一致的字体和格式
   - 充分利用白色空间
   - 重要信息放在首页上半部分

4. **避免常见错误**：
   - 检查拼写和语法错误
   - 避免使用过时或过度花哨的模板
   - 不要填充无关经历
   - 简历长度控制在1-2页

5. **突出关键词**：包含行业和职位相关的关键词，有助于通过ATS系统筛选。

需要更具体的建议，可以告诉我你的目标职位和行业！`,

  适合计算机专业毕业生的职业方向: `# 计算机专业毕业生职业方向指南

计算机专业毕业生有多种职业选择，以下是几个热门方向：

## 软件开发方向
- **前端开发工程师**：构建用户界面，技术栈包括HTML/CSS/JavaScript, React, Vue等
- **后端开发工程师**：开发服务器端逻辑，使用Java, Python, Go, Node.js等
- **全栈开发工程师**：同时负责前端和后端开发
- **移动应用开发**：iOS/Android应用开发

## 数据方向
- **数据分析师**：分析和解读数据，提供业务洞察
- **数据工程师**：构建数据管道和基础设施
- **机器学习工程师**：开发和部署AI模型
- **数据科学家**：结合统计学和编程解决复杂问题

## 云计算与DevOps
- **云解决方案架构师**：设计云基础设施
- **DevOps工程师**：构建自动化部署流程
- **SRE（站点可靠性工程师）**：确保系统稳定性和性能

## 网络安全
- **安全分析师**：识别和应对安全威胁
- **渗透测试工程师**：测试系统安全漏洞
- **安全架构师**：设计安全解决方案

## 新兴领域
- **区块链开发**：开发区块链应用和智能合约
- **AR/VR开发**：开发增强现实和虚拟现实应用
- **量子计算研究**：研究量子算法和应用

选择职业方向时，考虑个人兴趣、技能和市场需求，初期可以尝试不同方向的项目或实习，找到最适合自己的发展路径。`,

  面试常见问题及回答技巧: `# 面试常见问题及回答技巧

## 自我介绍类
**问题**：简单介绍一下自己
**技巧**：
- 准备30-60秒的简洁介绍
- 包含教育背景、工作经验和相关技能
- 强调与职位相关的经历
- 表达对公司/职位的兴趣

## 经历类问题
**问题**：描述一个你面临的挑战以及如何解决的
**技巧**：使用STAR法则回答：
- **Situation**：简述背景
- **Task**：说明你的任务和责任
- **Action**：详细描述你采取的行动
- **Result**：强调取得的结果和学到的经验

## 专业技能问题
**问题**：你如何跟上行业最新技术发展？
**技巧**：
- 提及专业社区、博客或论坛
- 讨论曾参加的培训或课程
- 展示持续学习的态度和实例

## 个人性格问题
**问题**：你的主要优点和缺点是什么？
**技巧**：
- 优点：与职位相关的积极品质，附带简短例子
- 缺点：展示自我认知，选择非致命缺点，强调改进方法

## 职业规划问题
**问题**：你对未来五年的职业规划是什么？
**技巧**：
- 表现长期发展承诺
- 提及具体学习目标和里程碑
- 将个人目标与公司发展结合

## 离职原因问题
**问题**：为什么离开上一份工作？
**技巧**：
- 保持积极态度，不贬低前雇主
- 强调寻求新挑战和成长机会
- 说明对新职位更感兴趣的原因

## 薪资问题
**问题**：你对薪资的期望是多少？
**技巧**：
- 事先研究行业和职位的薪资范围
- 提供一个合理的范围而非具体数字
- 表示愿意基于整体福利待遇进行协商

## 最后问题
**问题**：你有什么问题要问我们吗？
**技巧**：
- 准备2-3个有见地的问题
- 询问团队文化、发展机会或公司未来规划
- 避免首先询问薪资、假期等福利问题`,

  如何提升职场软技能: `# 如何提升职场软技能

职场软技能对于职业发展至关重要，以下是几个关键软技能及提升方法：

## 沟通能力
**提升方法**：
- 积极练习公开演讲，可加入演讲俱乐部
- 学习倾听技巧，避免打断他人
- 培养简明扼要表达复杂问题的能力
- 请求反馈并持续改进

## 团队协作
**提升方法**：
- 主动参与跨部门项目
- 学会尊重不同观点和工作风格
- 发展冲突解决能力
- 认可并赞赏团队成员的贡献

## 时间管理
**提升方法**：
- 学习使用时间管理技巧如"番茄工作法"
- 每天列出优先任务清单
- 学会拒绝不必要的请求
- 定期评估和调整时间分配

## 适应能力
**提升方法**：
- 主动接受新挑战和任务
- 培养积极面对变化的心态
- 持续学习新技能和知识
- 从挫折中学习并迅速调整

## 领导力
**提升方法**：
- 在不是正式领导的情况下也展现领导特质
- 主动承担责任和引导项目
- 向优秀领导者学习
- 培养激励和影响他人的能力

## 情绪智力
**提升方法**：
- 练习识别和管理自己的情绪
- 发展换位思考的能力
- 在压力下保持冷静的技巧
- 学习如何给予和接受建设性反馈

## 解决问题能力
**提升方法**：
- 培养系统思考能力
- 学习不同问题解决框架
- 练习创造性思考
- 寻求多角度分析问题

## 职业发展建议
- 寻找导师指导
- 参加专业研讨会和工作坊
- 阅读相关书籍和文章
- 设定具体的软技能发展目标
- 定期自我评估进步情况

持续提升软技能是一个长期过程，需要有意识地练习和反思。选择1-2个领域开始，制定具体计划并持续实践。`
}

// AI回复流式处理
const streamAiReply = async (fullText: string) => {
  const index = messages.value.length
  const message: LocalChatMessage = { role: 'ai', text: '' }
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
  console.log('=== handleSendMessage started ===')
  if (!userInput.value.trim() || isTyping.value) return
  const userMessage = userInput.value
  console.log('User message:', userMessage)
  messages.value.push({ role: 'user', text: userMessage })
  userInput.value = ''
  adjustTextareaHeight()
  scrollToBottom()
  isTyping.value = true

  try {
    // 首先检查是否有预定义的回复
<<<<<<< HEAD
=======
    console.log('Checking for predefined replies')
>>>>>>> c8346fa7250863ef362aec3501fcfef9213b2d93
    if (
      Object.keys(mockData).some(
        key =>
          userMessage.toLowerCase().includes(key.toLowerCase()) ||
          key.toLowerCase() === userMessage.toLowerCase()
      )
    ) {
      // 找到最匹配的预定义回复
      const bestMatch =
        Object.keys(mockData).find(key => key.toLowerCase() === userMessage.toLowerCase()) ||
        Object.keys(mockData).find(key => userMessage.toLowerCase().includes(key.toLowerCase()))

      if (bestMatch) {
<<<<<<< HEAD
=======
        console.log('Using mock reply for:', bestMatch)
>>>>>>> c8346fa7250863ef362aec3501fcfef9213b2d93
        await streamAiReply(mockData[bestMatch])
        return
      }
    }

    // 如果没有预定义回复，尝试使用API
    console.log('No mock reply found, using API')
    // 创建新的消息
    messages.value.push({ role: 'ai', text: '' })
    const currentIndex = messages.value.length - 1
    console.log('Created empty AI message at index:', currentIndex)

    // 使用Promise来处理Fetch API事件
    await new Promise((resolve, reject) => {
      let hasReceivedData = false
      let retryCount = 0
      const MAX_RETRIES = 1

      const tryConnect = () => {
        console.log('Trying to connect to AI chat API with model:', selectedModel.value)
        // 使用带认证的连接函数，并传递选中的模型
        connectAIChatFetch(userMessage, {
          model: selectedModel.value, // 传递选中的模型
          onMessage: async data => {
            hasReceivedData = true
            console.log('Raw data received:', data)
            console.log('Type of data:', typeof data)

            if (messages.value[currentIndex]) {
              // Simply append the chunk to the existing message text
              messages.value[currentIndex].text += data
              console.log('Added text chunk to message')

              // Update UI
              await nextTick()
              scrollToBottom()
              Prism.highlightAll()
            } else {
              console.log('No message at index:', currentIndex)
            }
          },
          onDone: () => {
            isTyping.value = false
            console.log('Message streaming complete')
            resolve(true)
          },
          onError: async error => {
            console.error('Fetch API Error:', error)

            // 如果在错误发生前已经接收到一些数据，则附加错误信息
            if (hasReceivedData && messages.value[currentIndex]) {
              messages.value[currentIndex].text += '\n\n> ⚠️ 连接中断，部分回复可能丢失。'
              resolve(true) // 仍然解析为成功，因为已经接收到部分数据
            } else {
              // 如果是第一次尝试且未收到数据，尝试重试
              if (retryCount < MAX_RETRIES) {
                retryCount++
                console.log(`尝试重新连接... (${retryCount}/${MAX_RETRIES})`)
                // 短暂延迟后重试
                setTimeout(tryConnect, 1000)
              } else {
                // 超过重试次数，尝试使用本地模拟回复
                console.log('Max retries reached, using fallback')
                if (messages.value[currentIndex]) {
                  // 生成一个友好的错误响应
                  const errorMsg = error instanceof Error ? error.message : '未知错误'
                  if (errorMsg.includes('500') || errorMsg.includes('服务器内部错误')) {
                    messages.value[currentIndex].text =
                      '很抱歉，服务器暂时遇到了问题。我会尽力提供一些帮助：\n\n'

                    // 基于用户消息内容生成一个相关回复
                    if (userMessage.toLowerCase().includes('简历')) {
                      messages.value[currentIndex].text +=
                        '关于简历，建议您注意以下几点：\n1. 确保信息清晰、准确且相关\n2. 突出您的成就和技能\n3. 针对申请的职位定制内容\n4. 使用简洁专业的语言\n5. 检查拼写和语法错误'
                    } else if (
                      userMessage.toLowerCase().includes('职业') ||
                      userMessage.toLowerCase().includes('工作')
                    ) {
                      messages.value[currentIndex].text +=
                        '关于职业规划，您可以考虑：\n1. 评估自己的兴趣、技能和价值观\n2. 研究行业趋势和就业前景\n3. 设定短期和长期目标\n4. 寻找相关学习和发展机会\n5. 构建专业网络和寻找导师'
                    } else {
                      messages.value[currentIndex].text +=
                        '我理解您可能在寻找一些信息或帮助。一旦服务恢复，我将能够更好地回答您的问题。如有紧急需求，请尝试使用其他功能或稍后再试。'
                    }
                  } else {
                    messages.value[currentIndex].text =
                      `❌ 连接失败：${errorMsg}\n\n请稍后再试或者尝试刷新页面。`
                  }
                  resolve(true)
                } else {
                  reject(new Error('Connection failed'))
                }
              }
            }
            isTyping.value = false
          },
          timeout: 30000 // 30秒超时
        })
      }

      // 开始第一次尝试
      tryConnect()
    }).catch(err => {
      console.error('处理流出错:', err)
      // 错误已经在前面处理，这里不需要显示任何提示
    })
  } catch (error) {
    const err = error as Error
    console.error('发送消息失败:', err)

    // 如果消息还没有被添加（一般不会），添加错误消息
    if (messages.value[messages.value.length - 1]?.role !== 'ai') {
      messages.value.push({
        role: 'ai',
        text: `❌ 连接失败：${err.message || '服务暂时不可用'}\n\n请稍后再试或者尝试刷新页面。`
      })
    } else {
      // 如果已经有AI消息，在消息中添加错误提示
      const lastMessage = messages.value[messages.value.length - 1]
      if (lastMessage.text.trim() === '') {
        lastMessage.text = `❌ 连接失败：${err.message || '服务暂时不可用'}\n\n请稍后再试或者尝试刷新页面。`
      }
    }

    // 不显示任何弹窗消息提示
  } finally {
    isTyping.value = false
    scrollToBottom()
    Prism.highlightAll() // 确保代码高亮
  }
}

// 切换模型列表显示状态
const toggleModelList = () => {
  showModelList.value = !showModelList.value
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
  height: calc(100vh - 40px);
  background: linear-gradient(135deg, #f6f8fd 0%, #f0f2fa 100%);
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    sans-serif;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 0 20px rgba(106, 90, 205, 0.08);
  border-radius: 12px;
  justify-content: space-between;
}

.chat-header {
  padding: 18px 24px;
  border-bottom: 1px solid rgba(106, 90, 205, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #f9f6ff 0%, #f5f2ff 100%);
  border-radius: 12px 12px 0 0;
}

.chat-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #5a49c0;
  letter-spacing: 0.5px;
  position: relative;
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
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.action-button:hover {
  background-color: rgba(106, 90, 205, 0.08);
  color: #6a5acd;
  transform: translateY(-1px);
}

.action-button.new-chat-btn {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #6a5acd 0%, #8a74dd 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(106, 90, 205, 0.3);
}

.action-button.new-chat-btn:hover {
  background: linear-gradient(135deg, #7b68ee 0%, #9a84ee 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(106, 90, 205, 0.4);
  color: white;
}

.action-button.history-btn {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #8a74dd 0%, #a594e8 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  margin-left: 8px;
  box-shadow: 0 2px 6px rgba(138, 116, 221, 0.3);
}

.action-button.history-btn:hover {
  background: linear-gradient(135deg, #9a84ee 0%, #b5a4f8 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(138, 116, 221, 0.4);
  color: white;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  justify-content: flex-start;
  scroll-behavior: smooth;
}

/* Custom scrollbar for chat messages */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.03);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(106, 90, 205, 0.3);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(106, 90, 205, 0.5);
}

.welcome-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 24px;
  text-align: center;
  margin: auto;
  height: 100%;
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #e9e3ff 0%, #f2eeff 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px rgba(106, 90, 205, 0.15);
  margin-bottom: 8px;
}

.welcome-icon img {
  width: 42px;
  height: 42px;
  filter: invert(32%) sepia(13%) saturate(3907%) hue-rotate(217deg) brightness(87%) contrast(98%);
}

.welcome-message h3 {
  font-size: 28px;
  font-weight: 600;
  color: #5a49c0;
  margin: 0;
  background: linear-gradient(90deg, #6a5acd 0%, #8a74dd 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.5px;
}

.welcome-message p {
  font-size: 16px;
  color: #6b7280;
  max-width: 500px;
  margin: 0;
  line-height: 1.6;
}

.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
  justify-content: center;
  max-width: 600px;
}

.suggestion-chip {
  padding: 10px 18px;
  background: linear-gradient(135deg, rgba(106, 90, 205, 0.08) 0%, rgba(138, 116, 221, 0.12) 100%);
  color: #5a49c0;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  border: 1px solid rgba(106, 90, 205, 0.15);
  box-shadow: 0 2px 4px rgba(106, 90, 205, 0.05);
  backdrop-filter: blur(5px);
}

.suggestion-chip:hover {
  background: linear-gradient(135deg, rgba(106, 90, 205, 0.15) 0%, rgba(138, 116, 221, 0.25) 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(106, 90, 205, 0.1);
}

/* Message bubbles with improved styling */
.message-container {
  display: flex;
  gap: 16px;
  max-width: 100%;
  justify-content: flex-start;
  animation: messageSlideIn 0.3s ease-out;
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-container.user {
  justify-content: flex-end;
}

.avatar {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.user-avatar,
.ai-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.message-container:hover .user-avatar,
.message-container:hover .ai-avatar {
  transform: scale(1.05);
}

.user-avatar {
  background: linear-gradient(135deg, #e6e6fa 0%, #d8d0ff 100%);
  color: #5a49c0;
}

.ai-avatar {
  background: linear-gradient(135deg, #6a5acd 0%, #8a74dd 100%);
  color: white;
}

.message-content {
  flex: 1;
  max-width: 75%;
}

.user-message {
  text-align: right;
  display: flex;
  justify-content: flex-end;
}

.message-bubble {
  border-radius: 16px;
  padding: 14px 18px;
  position: relative;
  overflow-wrap: break-word;
  line-height: 1.6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.user .message-bubble {
  background: linear-gradient(135deg, #6a5acd 0%, #8a74dd 100%);
  color: white;
  border-radius: 16px 16px 0 16px;
  width: fit-content;
  max-width: 100%;
  margin-left: auto;
}

.user .message-bubble:hover {
  box-shadow: 0 4px 12px rgba(106, 90, 205, 0.2);
  transform: translateY(-1px);
}

.ai .message-bubble {
  background: linear-gradient(135deg, #f8f6ff 0%, #f3f0ff 100%);
  color: #111827;
  border: 1px solid rgba(106, 90, 205, 0.1);
  border-radius: 16px 16px 16px 0;
  width: auto;
}

.ai .message-bubble:hover {
  box-shadow: 0 4px 12px rgba(106, 90, 205, 0.1);
  transform: translateY(-1px);
}

.message-actions {
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  margin-top: 6px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.message-content:hover .message-actions {
  opacity: 1;
}

.action-btn {
  background: rgba(106, 90, 205, 0.08);
  border: none;
  cursor: pointer;
  color: #6a5acd;
  padding: 6px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: rgba(106, 90, 205, 0.15);
  transform: translateY(-1px);
}

/* Typing indicator */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 14px 18px;
  background: linear-gradient(135deg, #f8f6ff 0%, #f3f0ff 100%);
  border-radius: 16px 16px 16px 0;
  width: fit-content;
  border: 1px solid rgba(106, 90, 205, 0.1);
  box-shadow: 0 2px 8px rgba(106, 90, 205, 0.05);
}

.typing-indicator span {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #6a5acd 0%, #8a74dd 100%);
  border-radius: 50%;
  opacity: 0.7;
  animation: typing 1.4s infinite ease-in-out;
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
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-6px);
  }
}

/* Input container with tech-focused styling */
.chat-input-container {
  padding: 20px 24px;
  border-top: 1px solid rgba(106, 90, 205, 0.1);
  background: linear-gradient(180deg, #ffffff 0%, #f9f6ff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0 0 12px 12px;
}

.model-selector-container {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  position: relative;
}

.model-selector-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.theme-selector {
  position: relative;
}

.theme-select {
  appearance: none;
  background: linear-gradient(135deg, rgba(106, 90, 205, 0.08) 0%, rgba(138, 116, 221, 0.12) 100%);
  border: 1px solid rgba(106, 90, 205, 0.15);
  border-radius: 10px;
  padding: 6px 30px 6px 12px;
  font-size: 14px;
  color: #5a49c0;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  outline: none;
  box-shadow: 0 2px 4px rgba(106, 90, 205, 0.08);
  width: auto;
  min-width: 140px;
  text-align: left;
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    sans-serif;
}

.theme-select:hover {
  background: linear-gradient(135deg, rgba(106, 90, 205, 0.12) 0%, rgba(138, 116, 221, 0.18) 100%);
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(106, 90, 205, 0.12);
}

.theme-select:focus {
  border-color: rgba(106, 90, 205, 0.5);
  box-shadow: 0 0 0 2px rgba(106, 90, 205, 0.2);
}

/* 让select下拉框向上展开 */
.theme-selector::after {
  content: '▲';
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #5a49c0;
  pointer-events: none;
  font-size: 10px;
}

/* 下拉框样式 */
.theme-select option {
  background-color: white;
  color: #303133;
  padding: 10px;
}

.model-name {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  user-select: none;
  padding: 6px 10px;
  border-radius: 10px;
  transition: all 0.2s ease;
  border: 1px solid rgba(106, 90, 205, 0.1);
  background: rgba(106, 90, 205, 0.03);
}

.model-name:hover {
  background: rgba(106, 90, 205, 0.08);
  transform: translateY(-1px);
}

.model-name span {
  margin-right: 8px;
  font-weight: 500;
}

.model-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  margin-right: 8px;
  background: linear-gradient(135deg, rgba(106, 90, 205, 0.1) 0%, rgba(123, 104, 238, 0.15) 100%);
  color: #5a49c0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(106, 90, 205, 0.08);
  position: relative;
  overflow: hidden;
}

.model-badge::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.model-badge.deepseek-r1 {
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(41, 121, 255, 0.15) 100%);
  color: #1976d2;
}

.model-badge.deepseek-v3 {
  background: linear-gradient(135deg, rgba(0, 150, 136, 0.1) 0%, rgba(38, 166, 154, 0.15) 100%);
  color: #009688;
}

.model-badge.baichuan2-7b-chat-v1 {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(239, 83, 80, 0.15) 100%);
  color: #f44336;
}

.model-selector-icon {
  font-size: 12px;
  color: #909399;
  transition: transform 0.3s;
}

.model-dropdown {
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 100%;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 6px 24px rgba(106, 90, 205, 0.15);
  margin-bottom: 8px;
  z-index: 10;
  max-height: 300px;
  overflow-y: auto;
  animation: dropdownSlideUp 0.3s ease;
  border: 1px solid rgba(106, 90, 205, 0.1);
  backdrop-filter: blur(10px);
}

@keyframes dropdownSlideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 更新模型选择器图标样式，使向上箭头表示向上展开 */
.model-name .model-selector-icon {
  font-size: 10px;
  color: #5a49c0;
  transition: transform 0.3s;
}

.model-option {
  padding: 14px 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(106, 90, 205, 0.05);
}

.model-option:last-child {
  border-bottom: none;
}

.model-option:hover {
  background: linear-gradient(135deg, rgba(106, 90, 205, 0.03) 0%, rgba(138, 116, 221, 0.08) 100%);
  transform: translateX(4px);
}

.model-option.active {
  background: linear-gradient(135deg, rgba(106, 90, 205, 0.08) 0%, rgba(138, 116, 221, 0.12) 100%);
  border-left: 3px solid #6a5acd;
}

.model-option-inner {
  display: flex;
  flex-direction: column;
}

.model-label {
  font-weight: 600;
  font-size: 14px;
  color: #303133;
  margin-bottom: 6px;
}

.model-description {
  font-size: 12px;
  color: #606266;
  line-height: 1.5;
}

.input-wrapper {
  width: 100%;
  max-width: 800px;
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(106, 90, 205, 0.15);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(106, 90, 205, 0.08);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  gap: 10px;
}

.input-wrapper:focus-within {
  border-color: #6a5acd;
  box-shadow: 0 6px 16px rgba(106, 90, 205, 0.12);
  transform: translateY(-2px);
}

textarea {
  flex: 1;
  border: none;
  resize: none;
  background-color: transparent;
  font-family: inherit;
  font-size: 15px;
  line-height: 1.6;
  max-height: 150px;
  min-height: 40px;
  outline: none;
  transition: all 0.2s ease;
  padding: 8px 0;
  color: #303133;
}

textarea::placeholder {
  color: #909399;
  opacity: 0.8;
}

.send-button {
  background: linear-gradient(135deg, #6a5acd 0%, #8a74dd 100%);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(106, 90, 205, 0.3);
}

.send-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #7b68ee 0%, #9a84ee 100%);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 10px rgba(106, 90, 205, 0.4);
}

.send-button:disabled {
  background: linear-gradient(135deg, #e6e6fa 0%, #f0f0ff 100%);
  color: #9ca3af;
  cursor: not-allowed;
  box-shadow: none;
}

.disclaimer {
  margin-top: 14px;
  font-size: 12px;
  color: #909399;
  text-align: center;
  width: 100%;
  max-width: 800px;
  padding: 8px;
}

:deep(.code-block) {
  border-radius: 12px;
  margin: 16px 0;
  position: relative;
  background-color: #1e1e1e;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

:deep(.code-block::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30px;
  background: #2d2d2d;
  border-bottom: 1px solid #3d3d3d;
  border-radius: 12px 12px 0 0;
}

:deep(.code-block code) {
  font-family: 'Fira Code', 'JetBrains Mono', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  margin-top: 30px;
  display: block;
  padding: 16px;
}

/* Further enhance the code syntax highlighting */
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

/* Markdown content styling */
:deep(h1),
:deep(h2),
:deep(h3),
:deep(h4),
:deep(h5),
:deep(h6) {
  margin: 24px 0 16px;
  font-weight: 600;
  line-height: 1.25;
  color: #303133;
}

:deep(h1) {
  font-size: 2em;
  background: linear-gradient(90deg, #5a49c0 0%, #8a74dd 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

:deep(h2) {
  font-size: 1.5em;
  border-bottom: 2px solid rgba(106, 90, 205, 0.1);
  padding-bottom: 8px;
}

:deep(h3) {
  font-size: 1.25em;
  color: #5a49c0;
}

:deep(ul),
:deep(ol) {
  padding-left: 24px;
  margin: 16px 0;
}

:deep(li) {
  margin: 8px 0;
  line-height: 1.6;
}

:deep(a) {
  color: #6a5acd;
  text-decoration: none;
  background: linear-gradient(180deg, transparent 70%, rgba(106, 90, 205, 0.2) 0);
  transition: all 0.2s ease;
}

:deep(a:hover) {
  color: #8a74dd;
  background: linear-gradient(180deg, transparent 60%, rgba(106, 90, 205, 0.3) 0);
}

:deep(blockquote) {
  margin: 16px 0;
  padding: 12px 24px;
  color: #606266;
  border-left: 4px solid #6a5acd;
  background: rgba(106, 90, 205, 0.05);
  border-radius: 0 8px 8px 0;
}

:deep(img) {
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(106, 90, 205, 0.1);
}

:deep(table th),
:deep(table td) {
  border: 1px solid rgba(106, 90, 205, 0.1);
  padding: 10px 14px;
}

:deep(table th) {
  background: linear-gradient(135deg, rgba(106, 90, 205, 0.08) 0%, rgba(138, 116, 221, 0.12) 100%);
  font-weight: 600;
  color: #5a49c0;
}

:deep(table tr:nth-child(even)) {
  background-color: rgba(106, 90, 205, 0.02);
}

/* Responsive design */
@media (max-width: 768px) {
  .chat-container {
    height: calc(100vh - 68px);
  }

  .chat-main {
    margin: 0;
    border-radius: 0;
  }

  .chat-header {
    padding: 14px 16px;
    border-radius: 0;
  }

  .chat-messages {
    padding: 16px;
  }

  .welcome-icon {
    width: 64px;
    height: 64px;
  }

  .welcome-message h3 {
    font-size: 24px;
  }

  .suggestion-chips {
    max-width: 100%;
  }

  .chat-input-container {
    padding: 12px 16px;
    border-radius: 0;
  }

  .input-wrapper {
    padding: 8px 12px;
  }

  .model-selector-container {
    max-width: 100%;
  }

  .model-name {
    font-size: 13px;
  }

  .model-badge {
    font-size: 12px;
    padding: 3px 8px;
  }

  .model-dropdown {
    position: fixed;
    top: auto;
    bottom: 70px;
    left: 16px;
    right: 16px;
    width: auto;
    margin-bottom: 0;
  }

  .send-button {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 640px) {
  .model-selector-wrapper {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }

  .theme-select {
    width: 100%;
  }
}
</style>
