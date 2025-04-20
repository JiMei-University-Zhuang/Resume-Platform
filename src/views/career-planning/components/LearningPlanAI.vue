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
import { ref, watch, computed, nextTick } from 'vue'
import IconChevronDown from '@/components/icons/IconChevronDown.vue'
import IconChevronUp from '@/components/icons/IconChevronUp.vue'
import IconSend from '@/components/icons/IconSend.vue'

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

  // 添加用户消息
  messages.value.push({ isUser: true, text: message })
  userInput.value = ''
  showSuggestions.value = false

  // 滚动到底部
  nextTick(() => {
    scrollToBottom()
  })

  // 模拟AI思考
  isTyping.value = true
  setTimeout(() => {
    generateAIResponse(message)
  }, 1000)
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

// 生成AI回复
function generateAIResponse(userMessage: string) {
  // 基于用户的问题生成相应的回答
  let response = ''

  if (userMessage.includes('规划学习路径') || userMessage.includes('怎么规划')) {
    response = generateLearningPathResponse()
  } else if (userMessage.includes('核心技能') || userMessage.includes('需要掌握')) {
    response = generateCoreSkillsResponse()
  } else if (userMessage.includes('初学者') || userMessage.includes('入门')) {
    response = generateBeginnerAdviceResponse()
  } else if (userMessage.includes('弥补') || userMessage.includes('差距')) {
    response = generateSkillGapResponse()
  } else if (userMessage.includes('学习和提高') || userMessage.includes('如何学习')) {
    response = generateSpecificSkillAdvice(userMessage)
  } else if (
    userMessage.includes('薪资') ||
    userMessage.includes('工资') ||
    userMessage.includes('待遇')
  ) {
    response = generateSalaryInfoResponse(userMessage)
  } else if (
    userMessage.includes('趋势') ||
    userMessage.includes('前景') ||
    userMessage.includes('未来发展')
  ) {
    response = generateIndustryTrendResponse()
  } else if (userMessage.includes('证书') || userMessage.includes('认证')) {
    response = generateCertificationAdvice()
  } else {
    response = generateGeneralResponse(userMessage)
  }

  // 添加AI消息
  setTimeout(() => {
    isTyping.value = false
    addAIMessage(response)

    // 是否应该显示建议
    if (messages.value.length >= 4) {
      showSuggestions.value = false
    } else {
      showSuggestions.value = true
    }
  }, 1000)
}

// 生成学习路径规划回复
function generateLearningPathResponse() {
  const career = props.careerName || '这个职业'

  // 根据不同职业提供更具体的学习路径建议
  let specificPath = ''

  if (career.includes('前端')) {
    specificPath = `
**前端开发的关键学习阶段**
* 阶段一：HTML/CSS/JavaScript基础 (2-3个月)
* 阶段二：前端框架与工具 (Vue/React, 3-4个月)
* 阶段三：现代前端工程化实践 (2-3个月)
* 阶段四：性能优化与高级特性 (持续学习)`
  } else if (career.includes('后端')) {
    specificPath = `
**后端开发的关键学习阶段**
* 阶段一：编程语言与数据结构基础 (2-3个月)
* 阶段二：数据库与API设计 (2-3个月)
* 阶段三：框架与中间件应用 (3-4个月)
* 阶段四：分布式系统与高并发 (持续学习)`
  } else if (career.includes('数据科学')) {
    specificPath = `
**数据科学的关键学习阶段**
* 阶段一：数学基础与编程工具 (3-4个月)
* 阶段二：数据处理与可视化 (2-3个月)
* 阶段三：机器学习算法实践 (4-6个月)
* 阶段四：深度学习与领域应用 (持续学习)`
  } else if (career.includes('UI/UX')) {
    specificPath = `
**UI/UX设计的关键学习阶段**
* 阶段一：设计基础与工具入门 (2-3个月)
* 阶段二：用户研究与交互设计 (2-3个月)
* 阶段三：设计系统与高保真原型 (3-4个月)
* 阶段四：用户测试与设计优化 (持续学习)`
  } else if (career.includes('DevOps')) {
    specificPath = `
**DevOps工程的关键学习阶段**
* 阶段一：Linux与基础网络知识 (2-3个月)
* 阶段二：容器化与CI/CD实践 (3-4个月)
* 阶段三：云平台与基础设施即代码 (3-4个月)
* 阶段四：监控、日志与自动化运维 (持续学习)`
  } else if (career.includes('安全')) {
    specificPath = `
**网络安全的关键学习阶段**
* 阶段一：网络与系统基础知识 (2-3个月)
* 阶段二：安全工具与渗透测试基础 (3-4个月)
* 阶段三：漏洞发现与安全加固 (3-4个月)
* 阶段四：安全架构与高级防御策略 (持续学习)`
  } else if (career.includes('云计算')) {
    specificPath = `
**云计算架构的关键学习阶段**
* 阶段一：云服务基础与网络知识 (2-3个月)
* 阶段二：云平台核心服务应用 (3-4个月)
* 阶段三：多云架构与迁移策略 (3-4个月)
* 阶段四：云原生架构与高可用设计 (持续学习)`
  } else if (career.includes('游戏')) {
    specificPath = `
**游戏开发的关键学习阶段**
* 阶段一：编程基础与游戏数学 (3-4个月)
* 阶段二：游戏引擎工具应用 (3-4个月)
* 阶段三：游戏系统与玩法设计 (3-4个月)
* 阶段四：优化与特效实现 (持续学习)`
  } else if (career.includes('区块链')) {
    specificPath = `
**区块链开发的关键学习阶段**
* 阶段一：区块链原理与密码学基础 (2-3个月)
* 阶段二：智能合约开发 (3-4个月)
* 阶段三：DApp与Web3应用开发 (3-4个月)
* 阶段四：高级协议与扩展性解决方案 (持续学习)`
  }

  const basePath = `为了成为一名成功的**${career}**，我建议你按照以下学习路径进行规划：

**第一阶段：基础知识学习（3-6个月）**
* 掌握核心概念和基础理论
* 熟悉行业术语和基本工具
* 完成入门级项目和练习

**第二阶段：实践能力提升（6-12个月）**
* 深入学习专业技能和工具
* 参与实际项目或模拟项目
* 建立个人作品集

**第三阶段：专业化发展（1-2年）**
* 选择专业方向深入研究
* 参与开源项目或行业实践
* 持续学习新技术和行业动态

**第四阶段：进阶专家（2年以上）**
* 解决复杂问题和挑战
* 分享知识和经验
* 引领创新和最佳实践`

  return specificPath
    ? `${basePath}\n\n${specificPath}\n\n你当前处于哪个阶段？我可以根据你的情况提供更具体的建议。`
    : `${basePath}\n\n你当前处于哪个阶段？我可以根据你的情况提供更具体的建议。`
}

// 生成核心技能回复
function generateCoreSkillsResponse() {
  const career = props.careerName || '这个职业'
  let skillsList = ''
  let specialSkills = ''

  // 为不同职业提供特定的核心技能描述
  if (career.includes('前端')) {
    specialSkills = `
**前端开发核心技能详解**
* **HTML/CSS基础** - 网页结构与样式的基础，语义化HTML、CSS布局系统
* **JavaScript深入理解** - ES6+特性、异步编程、DOM操作
* **前端框架掌握** - Vue/React等组件化开发，状态管理
* **现代构建工具** - Webpack/Vite，模块化开发，性能优化
* **响应式设计** - 适配不同设备的UI界面实现`
  } else if (career.includes('后端')) {
    specialSkills = `
**后端开发核心技能详解**
* **服务端语言** - Java/Python/Go等语言深入掌握
* **数据库设计** - 关系型/非关系型数据库，SQL优化
* **API设计** - RESTful接口、GraphQL，安全与性能
* **服务架构** - 微服务、分布式系统设计模式
* **中间件应用** - 缓存、消息队列、搜索引擎集成`
  } else if (career.includes('数据科学')) {
    specialSkills = `
**数据科学核心技能详解**
* **数据分析工具** - Python (Pandas, NumPy)、SQL、R
* **统计学基础** - 概率论、假设检验、回归分析
* **机器学习算法** - 监督/无监督学习、模型评估
* **数据可视化** - 数据图表、仪表盘、结果呈现
* **大数据处理** - Spark、分布式计算框架`
  } else if (career.includes('UI/UX')) {
    specialSkills = `
**UI/UX设计核心技能详解**
* **设计工具掌握** - Figma/Adobe XD/Sketch
* **UI设计原则** - 色彩理论、排版、视觉层次
* **用户研究方法** - 用户访谈、用户画像、旅程图
* **交互设计模式** - 信息架构、原型设计、可用性
* **设计系统建立** - 组件库、设计规范、多平台适配`
  } else if (career.includes('DevOps')) {
    specialSkills = `
**DevOps核心技能详解**
* **容器化技术** - Docker、Kubernetes、服务编排
* **CI/CD流水线** - Jenkins、GitLab CI、自动化测试
* **基础设施即代码** - Terraform、Ansible、配置管理
* **监控与日志** - Prometheus、ELK、可观测性
* **云服务应用** - AWS/Azure/GCP主要服务与最佳实践`
  } else if (career.includes('游戏')) {
    specialSkills = `
**游戏开发核心技能详解**
* **游戏引擎应用** - Unity/Unreal引擎工具链
* **游戏数学与物理** - 向量计算、碰撞检测、物理模拟
* **图形学基础** - 渲染管线、着色器编程、3D数学
* **游戏系统设计** - 玩法系统、关卡设计、AI行为
* **优化与性能** - 内存管理、帧率优化、资源加载`
  }

  if (props.careerSkills.length > 0) {
    skillsList = props.careerSkills.map(skill => `* **${skill}**`).join('\n')
  } else {
    // 默认技能列表（如果没有提供职业技能）
    skillsList = `* **核心技能1**\n* **核心技能2**\n* **核心技能3**\n* **核心技能4**\n* **核心技能5**`
  }

  const baseResponse = `作为**${career}**，你需要掌握以下核心技能：

${skillsList}

除了技术技能外，以下软技能也很重要：
* **解决问题能力** - 分析问题并找到解决方案
* **持续学习** - 跟进行业最新发展和技术
* **沟通协作** - 有效与团队成员和其他部门协作
* **时间管理** - 高效管理任务和期限`

  return specialSkills
    ? `${baseResponse}\n\n${specialSkills}\n\n你想了解哪个技能的详细学习建议？`
    : `${baseResponse}\n\n你想了解哪个技能的详细学习建议？`
}

// 生成初学者建议回复
function generateBeginnerAdviceResponse() {
  const career = props.careerName || '这个职业'
  let specificAdvice = ''

  // 针对不同职业提供更具体的入门建议
  if (career.includes('前端')) {
    specificAdvice = `
**前端开发入门建议**
* 先建立HTML/CSS/JavaScript基础，通过小型网页项目练习
* 选择一个主流框架（Vue/React）深入学习，避免同时学习多个框架
* 使用CodePen/JSFiddle等平台尝试前端代码片段
* 参与GitHub上的开源项目，阅读优质前端代码`
  } else if (career.includes('后端')) {
    specificAdvice = `
**后端开发入门建议**
* 选择一门后端语言深入学习（Java/Python/Go等）
* 掌握基本的数据库操作（SQL基础和一种ORM工具）
* 学习RESTful API设计并构建简单的API服务
* 了解基本的系统架构和设计模式`
  } else if (career.includes('数据科学')) {
    specificAdvice = `
**数据科学入门建议**
* 强化数学基础（线性代数、概率统计）
* 学习Python及其数据科学库（Pandas, NumPy, Matplotlib）
* 通过Kaggle平台的入门竞赛实践数据分析
* 选择一个垂直领域（如金融、医疗）进行专项学习`
  } else if (career.includes('UI/UX')) {
    specificAdvice = `
**UI/UX设计入门建议**
* 学习设计基础理论（色彩、排版、布局）
* 掌握一款主流设计工具（Figma/Adobe XD）
* 临摹优秀设计作品，分析设计决策
* 进行用户研究和可用性测试的基本方法学习`
  } else if (career.includes('DevOps')) {
    specificAdvice = `
**DevOps入门建议**
* 掌握Linux基础命令和系统管理
* 学习Docker容器基础及简单编排
* 了解CI/CD概念并配置简单的自动化流水线
* 学习基础的监控和日志收集方法`
  } else if (career.includes('游戏')) {
    specificAdvice = `
**游戏开发入门建议**
* 选择一个适合初学者的游戏引擎（如Unity）
* 从2D游戏开始，学习基本的游戏循环和逻辑
* 学习面向游戏的数学和物理基础
* 通过修改现有游戏模板来理解游戏系统`
  } else if (career.includes('区块链')) {
    specificAdvice = `
**区块链开发入门建议**
* 了解区块链基本原理和共识机制
* 学习以太坊基础和简单智能合约
* 掌握Solidity语言基础语法
* 使用Remix等工具部署和测试简单合约`
  } else if (career.includes('安全')) {
    specificAdvice = `
**网络安全入门建议**
* 掌握网络和操作系统基础知识
* 学习常见的漏洞类型和攻击手段
* 在合法环境中进行基础的渗透测试练习
* 了解安全合规和基本防护措施`
  }

  const baseAdvice = `作为**${career}**的初学者，以下是我给你的入门建议：

**1. 打好基础**
* 学习该领域的基础概念和理论
* 掌握入门级工具和技术
* 完成简单的练习和小项目

**2. 实践学习**
* 跟随教程完成实际项目
* 参与开源项目或社区活动
* 创建自己的作品集项目

**3. 学习资源**
* 在线课程: Coursera, Udemy, 慕课网
* 技术文档和教程
* 行业博客和视频教程
* 社区论坛和问答网站

**4. 建立习惯**
* 每天保持学习
* 记录学习笔记和问题
* 与其他学习者交流讨论`

  return specificAdvice
    ? `${baseAdvice}\n\n${specificAdvice}\n\n需要我推荐一些具体的学习资源吗？`
    : `${baseAdvice}\n\n需要我推荐一些具体的学习资源吗？`
}

// 生成技能差距回复
function generateSkillGapResponse() {
  const career = props.careerName || '这个职业'
  let gapList = ''

  if (skillGap.value.length > 0) {
    gapList = skillGap.value.map(skill => `* **${skill}**`).join('\n')
  } else {
    gapList =
      '根据你的技能分析，你已经掌握了该职业所需的大部分核心技能，可以考虑进一步提升现有技能的深度。'
  }

  return `根据你的技能分析，要成为一名合格的**${career}**，你需要学习以下技能：

${gapList}

我建议你按照优先级逐步学习这些技能，每学习一个技能后通过小项目来巩固所学知识。

需要我为某个具体技能制定学习计划吗？`
}

// 生成特定技能建议
function generateSpecificSkillAdvice(message: string) {
  // 尝试从消息中提取技能名称
  const skillMatches =
    message.match(/学习和提高(.*?)技能/) ||
    message.match(/如何学习(.*?)[?？]/) ||
    message.match(/如何提高(.*?)[?？]/)
  let skill = skillMatches ? skillMatches[1].trim() : ''

  if (!skill) {
    // 如果无法提取特定技能，使用第一个技能差距
    skill = skillGap.value.length > 0 ? skillGap.value[0] : '这项技能'
  }

  // 根据职业和技能提供更具体的建议
  const career = props.careerName || '这个职业'
  let specificAdvice = ''

  // 根据不同职业和技能组合提供专门的建议
  if (career.includes('前端') && (skill.includes('JavaScript') || skill.includes('前端框架'))) {
    specificAdvice = `
**前端开发框架学习路径**
* 首先掌握JavaScript ES6+核心概念
* 学习React或Vue的基础组件和状态管理
* 实践项目：构建响应式个人作品集网站
* 进阶学习：性能优化、SSR、微前端架构`
  } else if (career.includes('后端') && (skill.includes('数据库') || skill.includes('API'))) {
    specificAdvice = `
**后端数据库与API设计学习路径**
* 学习SQL基础和数据库设计原则
* 掌握ORM工具和数据建模
* 设计RESTful API和GraphQL接口
* 进阶学习：数据库优化、缓存策略、分布式数据存储`
  } else if (career.includes('UI/UX') && (skill.includes('设计') || skill.includes('Figma'))) {
    specificAdvice = `
**UI/UX设计工具学习路径**
* 学习Figma/Adobe XD基础操作
* 掌握组件设计和原型交互
* 构建完整的设计系统
* 进阶学习：高保真原型、动效设计、用户测试`
  } else if (
    career.includes('数据科学') &&
    (skill.includes('机器学习') || skill.includes('Python'))
  ) {
    specificAdvice = `
**数据科学与机器学习路径**
* 掌握Python数据分析库(Pandas, NumPy)
* 学习机器学习算法原理与实现
* 实践项目：预测分析和分类问题
* 进阶学习：深度学习、自然语言处理、计算机视觉`
  } else if (career.includes('云') && (skill.includes('AWS') || skill.includes('架构'))) {
    specificAdvice = `
**云计算架构学习路径**
* 学习AWS/Azure/GCP核心服务
* 掌握IaC工具如Terraform
* 设计高可用云架构
* 进阶学习：多云策略、云成本优化、云安全防护`
  } else if (career.includes('DevOps') && (skill.includes('CI/CD') || skill.includes('容器'))) {
    specificAdvice = `
**DevOps工程实践路径**
* 学习Docker容器技术基础
* 掌握CI/CD流水线构建
* 实践Kubernetes编排技术
* 进阶学习：GitOps、可观测性、混沌工程`
  } else if (career.includes('安全') && (skill.includes('渗透') || skill.includes('网络安全'))) {
    specificAdvice = `
**网络安全实践路径**
* 学习网络安全基础和威胁模型
* 掌握渗透测试方法和工具
* 实践安全漏洞检测与修复
* 进阶学习：红队蓝队演练、安全运营中心`
  }

  // 如果有特定建议，附加到通用回复中
  const baseResponse = `要学习和提高**${skill}**技能，我建议以下学习路径：

**入门阶段**
* 学习基础概念和原理
* 完成简单练习和示例
* 使用入门级教程和资源

**进阶阶段**
* 深入学习高级特性和技术
* 解决实际问题和案例研究
* 阅读技术文档和专业书籍

**实践阶段**
* 参与实际项目应用该技能
* 解决复杂问题和边界情况
* 学习最佳实践和优化技巧`

  const recommendedResources = getSkillResources(skill, career)

  return specificAdvice
    ? `${baseResponse}

**针对${career}的专项建议**${specificAdvice}

${recommendedResources}

你目前处于哪个学习阶段？我可以提供更具体的建议。`
    : `${baseResponse}

${recommendedResources}

你目前处于哪个学习阶段？我可以提供更具体的建议。`
}

// 根据技能和职业获取推荐资源
function getSkillResources(skill: string, career: string): string {
  // 默认资源
  let resources = `
**推荐学习资源**
* 在线课程: [相关课程名称]
* 技术书籍: [推荐书籍]
* 实践项目: [项目示例]
* 社区和论坛: [相关社区]`

  // 为常见技能和职业组合提供具体资源
  if (skill.includes('JavaScript') || skill.includes('前端')) {
    resources = `
**推荐学习资源**
* 在线课程: JavaScript.info、MDN Web Docs、Vue Mastery
* 技术书籍: 《JavaScript高级程序设计》、《深入浅出Vue.js》
* 实践项目: 个人作品集网站、Todo应用、天气应用
* 社区和论坛: Stack Overflow、Github、Vue/React社区`
  } else if (skill.includes('Python') || skill.includes('数据分析')) {
    resources = `
**推荐学习资源**
* 在线课程: Kaggle Learn、DataCamp、Coursera数据科学专项
* 技术书籍: 《Python数据科学手册》、《利用Python进行数据分析》
* 实践项目: 数据可视化仪表板、预测分析模型、电商数据分析
* 社区和论坛: Kaggle、Github、Python数据科学社区`
  } else if (skill.includes('设计') || skill.includes('UI')) {
    resources = `
**推荐学习资源**
* 在线课程: Figma官方教程、Udemy UI/UX设计课程、设计师学院
* 技术书籍: 《设计心理学》、《不要让我思考》、《Web界面设计》
* 实践项目: 应用界面重设计、设计系统构建、交互原型
* 社区和论坛: Dribbble、Behance、UI设计师社区`
  } else if (skill.includes('云') || skill.includes('DevOps')) {
    resources = `
**推荐学习资源**
* 在线课程: AWS/Azure官方培训、A Cloud Guru、Linux Academy
* 技术书籍: 《云原生架构模式》、《DevOps实践指南》
* 实践项目: CI/CD流水线构建、容器化应用部署、云架构设计
* 社区和论坛: StackOverflow、DevOps社区、云计算论坛`
  } else if (skill.includes('游戏') || skill.includes('Unity')) {
    resources = `
**推荐学习资源**
* 在线课程: Unity Learn、Unreal Engine文档、Udemy游戏开发课程
* 技术书籍: 《Unity游戏开发实战》、《游戏编程模式》
* 实践项目: 2D平台游戏、小型3D游戏、移动休闲游戏
* 社区和论坛: Unity论坛、GameDev.net、知乎游戏开发专栏`
  } else if (skill.includes('安全') || skill.includes('渗透')) {
    resources = `
**推荐学习资源**
* 在线课程: HackTheBox、TryHackMe、OWASP资源
* 技术书籍: 《白帽子讲Web安全》、《网络安全实战》
* 实践项目: 漏洞扫描工具、安全审计系统、CTF比赛
* 社区和论坛: 先知社区、FreeBuf、安全客`
  } else if (skill.includes('区块链') || skill.includes('智能合约')) {
    resources = `
**推荐学习资源**
* 在线课程: Ethereum开发者文档、Web3 University、DApp开发课程
* 技术书籍: 《精通以太坊》、《区块链原理与应用》
* 实践项目: DeFi应用原型、NFT交易平台、DAO治理系统
* 社区和论坛: Ethereum Research、区块链中文社区、BUIDL社区`
  } else if (career.includes('游戏') && skill) {
    resources = `
**游戏开发学习资源**
* 在线课程: Unity Learn、Unreal Engine文档、游戏设计基础课程
* 技术书籍: 《游戏引擎架构》、《3D数学基础》、《游戏编程模式》
* 实践项目: 简单2D游戏、物理模拟Demo、游戏AI系统
* 社区和论坛: Unity中文社区、虚幻引擎论坛、游戏蛮牛`
  } else if (career.includes('区块链') && skill) {
    resources = `
**区块链开发学习资源**
* 在线课程: Solidity官方文档、以太坊开发课程、Web3.js教程
* 技术书籍: 《区块链：技术驱动金融》、《智能合约开发》
* 实践项目: ERC20代币合约、NFT市场、DeFi应用原型
* 社区和论坛: Ethereum Stack Exchange、链闻社区、CryptoZombies`
  }

  return resources
}

// 生成通用回复
function generateGeneralResponse(message: string) {
  const career = props.careerName || '这个职业'

  // 基于关键词生成回复
  if (message.includes('学习资源') || message.includes('推荐')) {
    // 针对不同职业提供具体的学习资源建议
    let careerSpecificResources = ''

    if (career.includes('前端')) {
      careerSpecificResources = `
**前端开发特定资源**
* 框架学习: Vue.js官方文档、React官方教程
* 实战项目: 掘金教程、慕课网前端实战
* 技术社区: 前端早读课、CSS-Tricks`
    } else if (career.includes('后端')) {
      careerSpecificResources = `
**后端开发特定资源**
* 框架学习: Spring Boot官方指南、Node.js中文网
* 微服务: Spring Cloud Alibaba、微服务架构实战
* 技术社区: Java技术栈、后端技术杂谈`
    } else if (career.includes('数据')) {
      careerSpecificResources = `
**数据分析/科学特定资源**
* 数据分析: 《精通数据分析》、Tableau可视化教程
* 机器学习: 吴恩达机器学习课程、PyTorch官方教程
* 技术社区: TowardsDataScience、数据分析与挖掘`
    } else if (career.includes('设计')) {
      careerSpecificResources = `
**UI/UX设计特定资源**
* 设计工具: Figma学院、Adobe XD教程集
* 设计系统: Material Design、Ant Design原则
* 灵感社区: Dribbble、优设网、UI中国`
    } else if (career.includes('DevOps') || career.includes('云')) {
      careerSpecificResources = `
**DevOps/云计算特定资源**
* 云平台: AWS解决方案架构、Azure架构中心
* 容器技术: K8s中文文档、Docker实战课程
* 自动化: Jenkins pipeline教程、GitLab CI实践`
    }

    return `以下是我为**${career}**推荐的学习资源：

**在线课程**
* Coursera上的专业课程
* Udemy上的实践项目课程
* 国内平台如慕课网、极客时间的相关课程

**技术书籍**
* 入门级: 快速入门指南、实战教程
* 进阶级: 原理与实践、高级编程
* 专家级: 架构设计、性能优化

**社区资源**
* GitHub上的开源项目
* Stack Overflow问答
* 技术博客和论坛

**实践项目**
* 初级项目: 个人博客、工具应用
* 中级项目: 团队协作项目、功能复杂应用
* 高级项目: 大型系统设计与实现

${careerSpecificResources}

希望这些资源对你有所帮助！你想了解哪方面的具体资源？`
  } else if (message.includes('职业前景') || message.includes('发展方向')) {
    // 针对不同职业提供特定的职业发展路径
    let careerPathSpecific = ''

    if (career.includes('前端') || career.includes('后端') || career.includes('全栈')) {
      careerPathSpecific = `
**软件开发特定路径**
* 技术专家: 框架核心贡献者、技术架构师
* 垂直领域: 金融科技、医疗健康、教育科技
* 创新方向: WebAssembly、元宇宙开发、AI辅助编程`
    } else if (career.includes('数据')) {
      careerPathSpecific = `
**数据科学特定路径**
* 算法专家: 机器学习研究员、算法工程师
* 应用领域: 金融风控、智能医疗、智慧城市
* 新兴方向: 因果推断、强化学习、联邦学习`
    } else if (career.includes('设计')) {
      careerPathSpecific = `
**设计领域特定路径**
* 设计专家: 设计系统架构师、交互设计总监
* 垂直领域: 企业级产品设计、消费类应用设计
* 创新方向: 沉浸式体验设计、AI生成设计`
    } else if (career.includes('云') || career.includes('DevOps')) {
      careerPathSpecific = `
**云计算/DevOps特定路径**
* 基础设施专家: 云平台架构师、SRE专家
* 垂直领域: 金融云、医疗云、政务云
* 创新方向: 边缘计算、Serverless架构、GitOps`
    }

    return `作为**${career}**，你有以下几个主要的职业发展方向：

**1. 技术专家路线**
* 深入专业技术领域，成为技术专家
* 解决复杂技术问题，提供技术指导
* 可能的职位: 高级开发、架构师、技术专家

**2. 管理路线**
* 从技术转向团队和项目管理
* 负责资源规划、人员管理和项目交付
* 可能的职位: 技术主管、项目经理、部门经理

**3. 产品路线**
* 结合技术和业务知识，专注产品开发
* 负责产品规划、需求分析和用户体验
* 可能的职位: 产品经理、产品专家、解决方案架构师

**4. 创业/独立顾问**
* 利用专业技能创办企业或作为独立顾问
* 提供专业服务或开发创新产品
* 可能的角色: 创始人、技术顾问、自由职业者

${careerPathSpecific}

不同方向需要不同的技能组合和经验。你对哪个方向更感兴趣？`
  } else if (message.includes('工作内容') || message.includes('日常工作')) {
    // 提供关于职业日常工作的信息
    let dailyWork = ''

    if (career.includes('前端')) {
      dailyWork = `作为**前端开发工程师**，你的日常工作主要包括：

* 开发用户界面和交互功能
* 与设计师合作实现UI/UX设计
* 优化网站性能和加载速度
* 解决浏览器兼容性问题
* 参与产品需求讨论和技术方案设计
* 编写单元测试和文档`
    } else if (career.includes('后端')) {
      dailyWork = `作为**后端开发工程师**，你的日常工作主要包括：

* 开发和维护服务器端应用程序
* 设计和实现API接口
* 处理数据库查询和优化
* 确保系统性能、安全和可扩展性
* 与前端团队配合实现完整功能
* 监控系统运行状态和故障排查`
    } else if (career.includes('数据科学')) {
      dailyWork = `作为**数据科学家**，你的日常工作主要包括：

* 收集和清洗数据集
* 开发机器学习模型解决业务问题
* 分析数据趋势和模式
* 向非技术人员展示分析结果
* 与工程团队合作部署模型
* 持续优化算法和模型性能`
    } else if (career.includes('UI/UX')) {
      dailyWork = `作为**UI/UX设计师**，你的日常工作主要包括：

* 创建用户界面设计和原型
* 进行用户研究和需求分析
* 设计用户流程和交互模式
* 与开发团队合作实现设计
* 收集和分析用户反馈
* 维护和优化设计系统`
    } else if (career.includes('DevOps')) {
      dailyWork = `作为**DevOps工程师**，你的日常工作主要包括：

* 维护和优化CI/CD流水线
* 管理容器化环境和编排
* 监控系统性能和资源使用
* 自动化部署和发布流程
* 故障排查和系统稳定性保障
* 实施安全最佳实践`
    } else {
      dailyWork = `作为**${career}**，你的日常工作主要包括：

* 专业技术工作和问题解决
* 与团队成员协作完成项目
* 技术文档编写和知识共享
* 参与需求分析和技术设计
* 持续学习新技术和工具
* 代码审查和质量保障`
    }

    return dailyWork
  } else {
    // 默认回复
    return `感谢你的问题！作为学习规划助手，我可以帮你规划**${career}**的学习路径，推荐学习资源，以及解答相关技能和职业发展问题。

你可以问我以下类型的问题：
* 如何规划学习路径
* 核心技能和学习重点
* 推荐的学习资源和工具
* 如何从初学者成长为专业人士
* 职业发展方向和前景
* 日常工作内容和职责
* 薪资水平和行业趋势

有什么具体问题我可以帮你解答？`
  }
}

// 生成更多领域的薪资水平函数
function generateSalaryInfoResponse(_message: string) {
  const career = props.careerName || '这个职业'
  let salaryInfo = ''

  // 根据不同职业提供薪资信息
  if (career.includes('前端')) {
    salaryInfo = `**前端开发工程师薪资结构**
* 初级(0-2年): 8k-18k/月
* 中级(2-5年): 15k-30k/月
* 高级(5年+): 25k-50k+/月
* 技术专家/架构师: 40k-60k+/月

**加分技能**: 跨端开发、性能优化、工程化体系、设计系统构建`
  } else if (career.includes('后端')) {
    salaryInfo = `**后端开发工程师薪资结构**
* 初级(0-2年): 10k-20k/月
* 中级(2-5年): 18k-35k/月
* 高级(5年+): 30k-60k+/月
* 架构师/技术专家: 45k-80k+/月

**加分技能**: 高并发系统设计、微服务架构、数据库优化、云原生技术`
  } else if (career.includes('全栈')) {
    salaryInfo = `**全栈开发工程师薪资结构**
* 初级(0-2年): 10k-20k/月
* 中级(2-5年): 18k-35k/月
* 高级(5年+): 30k-60k+/月
* 技术负责人: 45k-80k+/月

**加分技能**: 跨端开发、DevOps流程、系统设计、云服务应用`
  } else if (career.includes('数据分析')) {
    salaryInfo = `**数据分析师薪资结构**
* 初级(0-2年): 8k-18k/月
* 中级(2-5年): 15k-30k/月
* 高级(5年+): 25k-45k+/月
* 数据总监: 40k-70k+/月

**加分技能**: 高级统计分析、业务洞察能力、数据可视化、行业知识`
  } else if (career.includes('数据科学')) {
    salaryInfo = `**数据科学家薪资结构**
* 初级(0-2年): 15k-25k/月
* 中级(2-5年): 20k-40k/月
* 高级(5年+): 35k-70k+/月
* 算法专家/AI科学家: 50k-100k+/月

**加分技能**: 深度学习、NLP/CV专项技能、研究论文发表、算法优化`
  } else if (career.includes('UI/UX')) {
    salaryInfo = `**UI/UX设计师薪资结构**
* 初级(0-2年): 8k-16k/月
* 中级(2-5年): 15k-28k/月
* 高级(5年+): 25k-45k+/月
* 设计总监: 35k-60k+/月

**加分技能**: 设计系统建设、用户研究方法、交互原型设计、前端实现能力`
  } else if (career.includes('DevOps')) {
    salaryInfo = `**DevOps工程师薪资结构**
* 初级(0-2年): 12k-22k/月
* 中级(2-5年): 20k-35k/月
* 高级(5年+): 30k-55k+/月
* 技术专家/架构师: 45k-80k+/月

**加分技能**: 云原生技术栈、安全运维、自动化工具开发、SRE实践`
  } else if (career.includes('安全')) {
    salaryInfo = `**网络安全专家薪资结构**
* 初级(0-2年): 10k-20k/月
* 中级(2-5年): 18k-35k/月
* 高级(5年+): 30k-60k+/月
* 安全总监/CISO: 50k-100k+/月

**加分技能**: 渗透测试专业技能、安全合规知识、安全架构设计、应急响应`
  } else if (career.includes('游戏')) {
    salaryInfo = `**游戏开发工程师薪资结构**
* 初级(0-2年): 8k-18k/月
* 中级(2-5年): 15k-30k/月
* 高级(5年+): 25k-50k+/月
* 技术总监/主程: 40k-80k+/月

**加分技能**: 引擎定制能力、图形学专业知识、优化技术、跨平台开发`
  } else if (career.includes('产品经理') || career.includes('AI产品')) {
    salaryInfo = `**AI产品经理薪资结构**
* 初级(0-2年): 10k-20k/月
* 中级(2-5年): 18k-35k/月
* 高级(5年+): 30k-60k+/月
* 产品总监/CPO: 50k-100k+/月

**加分技能**: 深入的AI技术理解、垂直行业知识、数据分析能力、产品设计思维`
  } else if (career.includes('云计算')) {
    salaryInfo = `**云计算架构师薪资结构**
* 初级(0-2年): 15k-25k/月
* 中级(2-5年): 25k-45k/月
* 高级(5年+): 40k-80k+/月
* 专家/总监级: 60k-120k+/月

**加分技能**: 多云架构设计、大规模系统优化、云安全专业知识、成本优化能力`
  } else if (career.includes('区块链')) {
    salaryInfo = `**区块链开发者薪资结构**
* 初级(0-2年): 15k-25k/月
* 中级(2-5年): 25k-50k/月
* 高级(5年+): 40k-80k+/月
* 架构师/技术专家: 60k-120k+/月

**加分技能**: Layer 2解决方案、跨链技术、智能合约安全审计、密码学知识`
  } else {
    salaryInfo = `**${career}薪资结构**
* 初级(0-2年): 8k-20k/月
* 中级(2-5年): 15k-35k/月
* 高级(5年+): 30k-60k+/月
* 专家/总监级: 50k-100k+/月

**加分技能**: 专业深度技术、跨领域知识、管理能力、行业经验`
  }

  return `## ${career}薪资水平与行业趋势

${salaryInfo}

**薪资影响因素**:
* 公司规模和类型（互联网大厂>中型公司>创业公司，但有例外）
* 地域差异（一线城市>新一线>二线城市）
* 学历背景（名校硕博士有一定溢价）
* 行业领域（金融、医疗等垂直领域通常薪资较高）

**行业发展趋势**:
* 技术融合：跨领域技能组合更加重要
* 专业深度：特定领域专家需求增加
* AI应用：人工智能在各领域的应用能力成为加分项
* 远程工作：灵活工作模式带来更多可能性

需要了解更多关于职业发展路径或技能提升建议吗？`
}

// 生成行业趋势分析
function generateIndustryTrendResponse() {
  const career = props.careerName || '这个职业'
  let trendAnalysis = ''

  // 根据不同职业提供趋势分析
  if (career.includes('前端')) {
    trendAnalysis = `**前端开发未来趋势**
* WebAssembly将实现更复杂的前端应用
* 低代码/无代码平台与AI辅助开发将改变开发模式
* 边缘计算与本地优先应用成为新方向
* 前端与AR/VR/XR技术融合创造新体验场景
* 微前端架构应对复杂业务场景的需求增加`
  } else if (career.includes('后端')) {
    trendAnalysis = `**后端开发未来趋势**
* 无服务器架构(Serverless)继续简化部署和扩展
* 事件驱动架构在微服务系统中普及
* 低代码API平台提升开发效率
* 多语言架构成为常态，Go和Rust等语言应用增加
* 分布式系统与数据一致性解决方案更加成熟`
  } else if (career.includes('数据科学')) {
    trendAnalysis = `**数据科学未来趋势**
* 从模型驱动转向数据驱动与混合方法
* 可解释AI和伦理AI成为必要考量
* 联邦学习等隐私保护技术获得更多关注
* AutoML工具使更多人能进入数据科学领域
* 专业领域知识（如医疗、金融）与AI结合更加紧密`
  } else if (career.includes('UI/UX')) {
    trendAnalysis = `**UI/UX设计未来趋势**
* AI辅助设计工具改变设计流程
* 沉浸式体验设计(AR/VR/XR)需求增加
* 个性化用户体验成为标准
* 无障碍设计成为必备考量
* 设计系统与组件化设计更加系统化`
  } else if (career.includes('DevOps')) {
    trendAnalysis = `**DevOps未来趋势**
* GitOps实践成为标准工作流
* 平台工程(Platform Engineering)角色崛起
* 混沌工程实践提升系统韧性
* FinOps优化云资源成本管理
* 安全左移(DevSecOps)成为标准实践`
  } else if (career.includes('安全')) {
    trendAnalysis = `**网络安全未来趋势**
* 零信任架构成为企业安全基础
* 身份与访问管理更加重要
* AI驱动的威胁检测与响应系统普及
* 物联网与5G安全挑战增加
* 云原生安全实践成为专业方向`
  } else if (career.includes('云计算')) {
    trendAnalysis = `**云计算未来趋势**
* 多云与混合云策略成为主流
* 边缘计算与云边协同发展
* 云原生应用开发成为标准路径
* 可观测性平台整合监控、日志和跟踪
* 绿色云计算与可持续发展受到关注`
  } else if (career.includes('游戏')) {
    trendAnalysis = `**游戏开发未来趋势**
* 跨平台开发工具生态更加成熟
* 实时光线追踪技术普及
* 程序化内容生成降低开发成本
* 云游戏与流媒体平台改变游戏分发
* AI生成内容应用于游戏开发流程`
  } else if (career.includes('区块链')) {
    trendAnalysis = `**区块链开发未来趋势**
* Layer 2扩展解决方案成熟应用
* DeFi与Web3应用场景扩展
* 企业区块链解决方案标准化
* 跨链技术实现不同生态互通
* 监管合规成为发展关键因素`
  } else if (career.includes('产品经理') || career.includes('AI产品')) {
    trendAnalysis = `**AI产品经理未来趋势**
* AI驱动的个性化产品体验成为重点
* 负责任AI设计与伦理考量不可或缺
* 多模态AI产品创新空间巨大
* 企业AI应用需求持续增长
* AI与传统产业深度融合`
  } else {
    trendAnalysis = `**${career}未来趋势**
* 技术与业务深度融合
* 跨领域知识需求增加
* 自动化与AI辅助工作方式普及
* 持续学习能力成为核心竞争力
* 远程协作与全球化团队成为常态`
  }

  return `## ${career}行业趋势与未来发展

${trendAnalysis}

**市场需求变化**:
* 专业技能与软技能的平衡更加重要
* T型人才（既有专业深度又有跨领域广度）更受欢迎
* 解决复杂业务问题的能力日益关键
* 持续学习与适应变化的能力成为必备素质

**建议发展方向**:
* 紧跟技术前沿，定期更新技能库
* 参与开源项目或社区贡献，建立专业影响力
* 关注行业痛点，培养解决实际问题的能力
* 建立个人品牌和专业网络

你对哪个趋势方向特别感兴趣？我可以提供更具体的学习建议。`
}

// 生成证书与认证建议
function generateCertificationAdvice() {
  const career = props.careerName || '这个职业'
  let certificationInfo = ''

  // 根据不同职业提供认证建议
  if (career.includes('前端')) {
    certificationInfo = `**前端开发推荐认证**
* 微软认证：Microsoft Certified: JavaScript Developer
* Google认证：Mobile Web Specialist
* Vue.js认证开发者
* React开发认证
* AWS认证开发者助理（前端云开发）`
  } else if (career.includes('后端')) {
    certificationInfo = `**后端开发推荐认证**
* Oracle认证Java专家(OCJP)
* 微软认证：Azure Developer Associate
* AWS认证开发者助理
* Spring专业认证
* Kubernetes应用开发者认证(CKAD)`
  } else if (career.includes('数据科学') || career.includes('数据分析')) {
    certificationInfo = `**数据科学/分析推荐认证**
* Microsoft认证：Azure数据科学家助理
* IBM数据科学专业认证
* Google认证专业数据工程师
* TensorFlow开发者认证
* SAS认证数据科学家`
  } else if (career.includes('UI/UX')) {
    certificationInfo = `**UI/UX设计推荐认证**
* Certified User Experience Professional (CUXP)
* Nielsen Norman Group UX认证
* Adobe认证专家(ACE) - XD
* Interaction Design Foundation认证
* Google UX设计专业证书`
  } else if (career.includes('DevOps')) {
    certificationInfo = `**DevOps推荐认证**
* AWS认证DevOps工程师 - 专业级
* Docker认证助理(DCA)
* Kubernetes管理员认证(CKA)
* Azure DevOps工程师专家
* GitLab认证专业DevOps工程师`
  } else if (career.includes('安全')) {
    certificationInfo = `**网络安全推荐认证**
* Certified Information Systems Security Professional (CISSP)
* Certified Ethical Hacker (CEH)
* Offensive Security Certified Professional (OSCP)
* CompTIA Security+
* AWS认证安全 - 专业级`
  } else if (career.includes('云计算')) {
    certificationInfo = `**云计算推荐认证**
* AWS解决方案架构师 - 专业级
* Google Cloud专业云架构师
* Microsoft Azure解决方案架构师专家
* 阿里云专业架构师认证
* Certified Kubernetes Administrator (CKA)`
  } else if (career.includes('游戏')) {
    certificationInfo = `**游戏开发推荐认证**
* Unity认证专家
* Unreal Engine认证
* Autodesk 3ds Max认证专家
* Professional C++ Programmer认证
* CRYENGINE认证开发者`
  } else if (career.includes('区块链')) {
    certificationInfo = `**区块链开发推荐认证**
* Certified Blockchain Developer (CBD)
* Ethereum开发者认证
* Hyperledger Fabric开发者认证
* Certified Blockchain Solution Architect (CBSA)
* ConsenSys区块链开发者启动营证书`
  } else {
    certificationInfo = `**${career}推荐认证**
* 行业专业认证
* 主流技术平台认证
* 项目管理相关认证
* 软技能与管理能力认证
* 国际通用职业资格证书`
  }

  return `## ${career}相关证书与认证指南

${certificationInfo}

**认证选择建议**:
* 根据职业阶段选择合适难度的认证
* 优先选择业内认可度高的权威认证
* 认证内容应匹配你的职业发展方向
* 注意认证的有效期和更新要求

**认证价值分析**:
* 初级阶段：认证可以证明基本技能掌握程度，有助于求职
* 中级阶段：专业认证展示系统性知识和实践能力
* 高级阶段：高级认证体现专业深度和解决复杂问题的能力

需要注意的是，认证只是能力证明的一种方式，实际项目经验和解决问题的能力同样重要。对于具体认证的学习路径，你有什么问题吗？`
}

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
