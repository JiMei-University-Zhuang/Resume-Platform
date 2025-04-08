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
import MarkdownIt from 'markdown-it'
import type { Options as MarkdownItOptions } from 'markdown-it'
import Prism from 'prismjs'
import type { ChatMessage, MockData } from '@/types/chat'
import { connectAIChatSSE } from '@/api/chat'

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

// 初始化变量
const chatboxRef = ref<HTMLDivElement | null>(null)
const inputRef = ref<any>(null)
const messages = ref<ChatMessage[]>([])
const userInput = ref('')
const isTyping = ref(false)

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

      // 使用Promise来处理EventSource事件
      await new Promise((resolve, reject) => {
        let hasReceivedData = false

        const connection = connectAIChatSSE(userMessage, {
          onMessage: async data => {
            hasReceivedData = true
            if (messages.value[currentIndex]) {
              messages.value[currentIndex].text += data
              await nextTick()
              scrollToBottom()
              Prism.highlightAll()
            }
          },
          onDone: () => {
            isTyping.value = false
            resolve(true)
          },
          onError: error => {
            console.error('SSE Error:', error)
            isTyping.value = false

            // 如果在错误发生前已经接收到一些数据，则附加错误信息
            if (hasReceivedData && messages.value[currentIndex]) {
              messages.value[currentIndex].text += '\n\n> ⚠️ 连接中断，部分回复可能丢失。'
              resolve(true) // 仍然解析为成功，因为已经接收到部分数据
            } else {
              // 如果完全没有接收到数据，则标记为错误
              reject(new Error('Connection failed'))
            }
          },
          timeout: 30000 // 30秒超时
        })

        // 添加一个清理函数到Promise的catch中
        Promise.allSettled([]).catch(() => {
          connection.close()
        })
      }).catch(err => {
        console.error('处理流出错:', err)
        // 错误已经在前面处理，这里不需要显示任何提示
      })
    }
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
  background-color: #f9f6ff;
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
  justify-content: space-between; /* 确保内容垂直均匀分布 */
}

.chat-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e6e6fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #6a5acd;
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
  color: #6a5acd;
}

.action-button.new-chat-btn {
  display: flex;
  align-items: center;
  background-color: #6a5acd;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
}

.action-button.new-chat-btn:hover {
  background-color: #7b68ee;
  color: white;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  justify-content: flex-start; /* 消息从顶部开始 */
}

.welcome-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 16px;
  text-align: center;
  margin: auto; /* 在空聊天时垂直居中 */
  height: 100%;
}

.welcome-icon {
  width: 64px;
  height: 64px;
  background-color: #e6e6fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-icon img {
  width: 36px;
  height: 36px;
  filter: invert(32%) sepia(13%) saturate(3907%) hue-rotate(217deg) brightness(87%) contrast(98%); /* 使SVG图标变为紫色 */
}

.welcome-message h3 {
  font-size: 24px;
  font-weight: 600;
  color: #6a5acd;
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
  background-color: #e6e6fa;
  color: #6a5acd;
  border-radius: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
}

.suggestion-chip:hover {
  background-color: #d8bfd8;
}

/* 消息气泡样式 - 修改为左右布局 */
.message-container {
  display: flex;
  gap: 16px;
  max-width: 100%;
  justify-content: flex-start;
}

.message-container.user {
  justify-content: flex-end;
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
  background-color: #e6e6fa;
  color: #6a5acd;
}

.ai-avatar {
  background-color: #6a5acd;
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
  border-radius: 12px;
  padding: 12px 16px;
  position: relative;
  overflow-wrap: break-word;
  line-height: 1.5;
}

.user .message-bubble {
  background-color: #6a5acd;
  color: white;
  border-radius: 12px 12px 0 12px;
  width: fit-content; /* 根据内容自适应宽度 */
  max-width: 100%; /* 最大宽度限制 */
  margin-left: auto; /* 确保短消息靠右对齐 */
}

.ai .message-bubble {
  background-color: #f3f0ff;
  color: #111827;
  border: 1px solid #e6e6fa;
  border-radius: 12px 12px 12px 0;
  width: auto; /* 恢复默认宽度 */
}

.message-actions {
  display: flex;
  justify-content: flex-start;
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
  color: #6a5acd;
}

/* 打字指示器 */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  background-color: #f3f0ff;
  border-radius: 12px 12px 12px 0;
  width: fit-content;
  border: 1px solid #e6e6fa;
}

.typing-indicator span {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #6a5acd;
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
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
}

/* 输入区域样式 */
.chat-input-container {
  padding: 16px 24px;
  border-top: 1px solid #e6e6fa;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中 */
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: center; /* 垂直居中对齐文本和按钮 */
  background-color: #f9f6ff;
  border: 1px solid #e6e6fa;
  border-radius: 8px;
  padding: 8px 12px;
  transition:
    border-color 0.2s,
    height 0.2s ease;
  width: 100%;
  max-width: 800px; /* 限制最大宽度 */
}

.input-wrapper:focus-within {
  border-color: #6a5acd;
  box-shadow: 0 0 0 2px rgba(106, 90, 205, 0.1);
}

textarea {
  flex: 1;
  border: none;
  resize: none;
  background-color: transparent;
  font-family: inherit;
  font-size: 15px;
  line-height: 1.5;
  max-height: 150px;
  min-height: 24px;
  outline: none;
  align-self: center; /* 垂直居中 */
  transition: height 0.2s ease;
  padding: 0;
}

.send-button {
  background-color: #6a5acd;
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
  background-color: #7b68ee;
}

.send-button:disabled {
  background-color: #e6e6fa;
  color: #9ca3af;
  cursor: not-allowed;
}

.disclaimer {
  margin-top: 12px;
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  width: 100%;
  max-width: 800px; /* 与输入框保持一致 */
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
  color: #6a5acd;
  text-decoration: none;
}

:deep(a:hover) {
  text-decoration: underline;
}

:deep(blockquote) {
  margin: 16px 0;
  padding: 0 16px;
  color: #6b7280;
  border-left: 4px solid #e6e6fa;
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
  border: 1px solid #e6e6fa;
  padding: 8px 12px;
}

:deep(table th) {
  background-color: #f9f6ff;
  font-weight: 600;
}

:deep(table tr:nth-child(even)) {
  background-color: #f9f6ff;
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

  .message-content {
    max-width: 85%;
  }

  .input-wrapper,
  .disclaimer {
    max-width: 100%; /* 在移动设备上占满宽度 */
  }
}
</style>
