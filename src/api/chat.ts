export interface ChatMessage {
  role: 'user' | 'ai'
  content: string
}

export interface ChatRequest {
  message: string
  system_message?: string
}

export interface ChatResponse {
  content: string
}

export interface EventSourceOptions {
  onMessage: (data: string) => void
  onDone: () => void
  onError: (error: Event) => void
  timeout?: number
  model?: string
}

export const sendChatMessage = async (message: string, system_message?: string) => {
  const response = await fetch('/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message,
      system_message
    })
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  let content = ''

  if (!reader) {
    throw new Error('No reader available')
  }

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') {
            return { content }
          }
          try {
            const jsonData = JSON.parse(data)
            if (jsonData.content) {
              content += jsonData.content
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e)
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }

  return { content }
}

// 模拟流式返回文本
const simulateStreamResponse = async (
  text: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void
) => {
  const words = text.split('')
  const chunkSize = 1 // 每次发送一个字符

  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join('')
    await new Promise(resolve => setTimeout(resolve, 50)) // 模拟网络延迟
    onChunk(chunk)
  }

  // 完成
  setTimeout(onComplete, 500)
}

/**
 * 使用SSE（Server-Sent Events）方式连接AI聊天接口
 * @param message 用户消息
 * @param options 事件处理配置项
 * @returns 一个包含close方法的对象，用于手动关闭连接
 */
export const connectAIChatSSE = (message: string, options: EventSourceOptions) => {
  let retryCount = 0
  const MAX_RETRIES = 1 // 最多重试1次

  // 更友好的本地回复
  const generateBetterResponse = (message: string): string => {
    // 常见问题回复
    if (
      message.toLowerCase().includes('你好') ||
      message.toLowerCase().includes('hi') ||
      message.toLowerCase().includes('hello')
    ) {
      return '你好！我是智航AI助手。很高兴为您服务。请问有什么我可以帮助您的吗？'
    }

    if (message.toLowerCase().includes('介绍') && message.toLowerCase().includes('自己')) {
      return '我是智航AI助手，一个设计用来帮助您解决问题的智能助手。我可以回答各种问题，提供职业规划建议，帮助优化简历，以及提供学习和考试的指导。有什么我可以帮您的吗？'
    }

    if (message.toLowerCase().includes('职业') || message.toLowerCase().includes('工作')) {
      return '关于职业规划，我建议您可以从以下几个方面考虑：\n\n1. 分析自己的兴趣、专长和价值观\n2. 了解行业趋势和就业市场情况\n3. 设定短期和长期的职业目标\n4. 制定具体的提升计划，包括技能学习、经验积累等\n5. 定期评估和调整您的职业规划\n\n我还可以根据您的具体情况提供更有针对性的建议。'
    }

    if (message.toLowerCase().includes('简历')) {
      return '优化简历的几个关键点：\n\n1. 突出您的成就和量化结果，而不仅仅是列出职责\n2. 针对目标职位定制简历内容\n3. 使用清晰的结构和专业的排版\n4. 包含行业关键词以通过ATS系统筛选\n5. 避免拼写和语法错误\n\n如果您需要，我可以帮您详细分析简历的具体部分。'
    }

    if (message.toLowerCase().includes('考试') || message.toLowerCase().includes('学习')) {
      return '关于提高学习效率和考试表现，我有以下建议：\n\n1. 制定结构化的学习计划，合理分配时间\n2. 使用番茄工作法等技巧提高专注度\n3. 尝试主动回忆和教授他人等深度学习方法\n4. 定期复习，使用间隔重复技术\n5. 保持充足的休息和良好的生活习惯\n\n希望这些建议对您有所帮助！'
    }

    // 默认回复
    return `我理解您提到了"${message.substring(0, 15)}${message.length > 15 ? '...' : ''}"。作为智航AI助手，我很乐意提供帮助。请告诉我您想了解什么具体内容，比如职业规划、简历优化、考试准备等，我会尽力提供有用的信息和建议。`
  }

  // 尝试创建连接
  const createConnection = () => {
    // 如果已经尝试过所有重试，使用本地模拟模式
    if (retryCount > MAX_RETRIES) {
      console.log('使用本地模拟模式')
      // 使用改进的本地回复函数
      const simulatedResponse = generateBetterResponse(message)

      // 模拟流式返回
      let isCancelled = false

      simulateStreamResponse(
        simulatedResponse,
        chunk => {
          if (!isCancelled) options.onMessage(chunk)
        },
        () => {
          if (!isCancelled) options.onDone()
        }
      )

      return {
        close: () => {
          isCancelled = true
        }
      }
    }

    // 创建 EventSource 实例 - 优先使用代理，如果失败则直接连接
    let eventSourceUrl =
      retryCount === 0
        ? `/api/ai/chat?message=${encodeURIComponent(message)}`
        : `http://8.130.75.193:8081/ai/chat?message=${encodeURIComponent(message)}`

    console.log(`尝试连接AI聊天 (尝试 ${retryCount + 1}/${MAX_RETRIES + 1}): ${eventSourceUrl}`)

    // 在创建连接前先增加重试计数，避免服务器响应慢时短时间内创建多个连接
    retryCount++

    const eventSource = new EventSource(eventSourceUrl)

    // 状态标记
    let connectionClosed = false
    let streamCompleted = false
    let hasReceivedData = false

    // 监听消息
    eventSource.onmessage = event => {
      hasReceivedData = true
      options.onMessage(event.data)
    }

    // 监听"完成"事件
    eventSource.addEventListener('done', () => {
      streamCompleted = true
      closeConnection(true)
    })

    // 设置超时ID
    let timeoutId: number | null = null

    // 关闭连接并清理的函数
    const closeConnection = (isCompleted: boolean) => {
      // 只在连接尚未关闭时执行
      if (!connectionClosed) {
        connectionClosed = true

        // 清除超时计时器
        if (timeoutId !== null) {
          window.clearTimeout(timeoutId)
          timeoutId = null
        }

        // 关闭EventSource连接
        eventSource.close()

        // 如果完成则调用完成回调
        if (isCompleted) {
          options.onDone()
        }
      }
    }

    // 监听错误
    eventSource.onerror = error => {
      // 如果已经收到'done'事件或连接已关闭，忽略错误
      if (streamCompleted || connectionClosed) {
        return
      }

      console.error(`SSE Error (尝试 ${retryCount + 1}/${MAX_RETRIES + 1}):`, error)

      // 如果已经收到数据，不重试，返回部分数据
      if (hasReceivedData) {
        options.onError(error)
        closeConnection(false)
        return
      }

      // 否则关闭当前连接
      closeConnection(false)

      // 增加重试计数
      retryCount++

      // 如果还有重试次数，尝试重试
      if (retryCount <= MAX_RETRIES) {
        const newConnection = createConnection()
        connectionControl = newConnection
      } else {
        // 尝试使用本地回退
        const fallbackConnection = createConnection() // 将再次调用并启用回退模式
        connectionControl = fallbackConnection
      }
    }

    // 设置超时
    if (options.timeout !== undefined) {
      timeoutId = window.setTimeout(() => {
        // 只有在连接仍然开着且流未完成的情况下才认为超时
        if (!connectionClosed && !streamCompleted) {
          closeConnection(false)

          // 增加重试计数
          retryCount++

          // 如果还有重试次数，尝试重试
          if (retryCount <= MAX_RETRIES) {
            const newConnection = createConnection()
            connectionControl = newConnection
          } else {
            // 尝试使用本地回退
            const fallbackConnection = createConnection() // 将再次调用并启用回退模式
            connectionControl = fallbackConnection
          }
        }
      }, options.timeout) // 默认30秒超时
    }

    // 返回控制对象
    return {
      close: () => closeConnection(false)
    }
  }

  // 创建初始连接
  let connectionControl = createConnection()

  // 返回控制对象
  return {
    close: () => connectionControl.close()
  }
}

// 使用fetch API的流式响应方案，可以正确携带认证头
export const connectAIChatFetch = (message: string, options: EventSourceOptions) => {
  console.log('=== connectAIChatFetch started ===')
  // 使用any类型来解决类型定义问题
  const abortController = new (window as any).AbortController()
  let isCancelled = false

  // 优先从localStorage获取token，更全面的token获取方式
  const getToken = () => {
    // 尝试从localStorage获取
    const tokenFromStorage = localStorage.getItem('token')
    if (tokenFromStorage) return tokenFromStorage

    return ''
  }

  // 获取token
  const token = getToken()
  console.log('Token retrieved:', token ? 'Present' : 'Not found')

  // API URL 需要添加 message 和 token 参数
  let apiUrl = `/api/ai/chat?message=${encodeURIComponent(message)}`

  // 添加模型参数，如果指定了模型
  if (options.model) {
    apiUrl += `&model=${encodeURIComponent(options.model)}`
  }

  if (token) {
    apiUrl += `&token=${encodeURIComponent(token)}`
  }

  console.log('API URL:', apiUrl)

  const fetchData = async () => {
    console.log('Starting fetchData function')
    try {
      const headers: Record<string, string> = {
        Accept: 'text/event-stream'
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
        headers['token'] = token
      }

      console.log('Request headers:', headers)
      console.log('Sending fetch request...')

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers,
        signal: abortController.signal
      })

      console.log('Fetch response received, status:', response.status)

      // 检查错误状态
      if (response.status === 500) {
        throw new Error('服务器内部错误，请联系管理员或稍后再试')
      } else if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No reader available')
      }

      console.log('Reader obtained from response')
      const decoder = new TextDecoder()

      try {
        console.log('Starting to read stream')
        while (!isCancelled) {
          console.log('Reading chunk from stream...')
          const { done, value } = await reader.read()

          if (done) {
            console.log('Stream reading complete')
            options.onDone()
            break
          }

          console.log('Chunk received, size:', value ? value.length : 0)
          const chunk = decoder.decode(value, { stream: true })
          console.log('Decoded chunk:', chunk)
          const lines = chunk.split('\n')
          console.log('Lines after splitting:', lines.length)

          for (const line of lines) {
            if (line.startsWith('data:')) {
              const data = line.slice(5).trim() // Remove 'data:' prefix and trim whitespace
              console.log('Data extracted from line:', data)
              if (data === '[DONE]') {
                console.log('Received [DONE] marker')
                options.onDone()
                return
              }

              // Send the raw text directly to the message handler
              // Do NOT try to parse as JSON since each chunk is a small piece of text
              options.onMessage(data)
            }
          }
        }
      } finally {
        console.log('Releasing reader')
        reader.releaseLock()
      }
    } catch (error) {
      console.error('Fetch streaming error details:', error)
      if (!isCancelled) {
        console.error('Fetch streaming error, calling onError')
        options.onError(error as Event)
      }
    }
  }

  // 执行异步获取数据函数
  console.log('Calling fetchData function')
  fetchData()

  // 返回控制对象
  return {
    close: () => {
      console.log('Closing connection')
      isCancelled = true
      abortController.abort()
    }
  }
}

// 历史对话消息类型定义
export interface HistoryMessage {
  timestamp: number
  role: 'user' | 'assistant'
  message: string
}

// 聊天会话类型定义
export interface ChatSession {
  username: string
  sessionId: string
  historyMessages: HistoryMessage[]
}

// 获取历史对话接口
export const getChatHistory = async (username: string, page: string = '1', size: string = '10') => {
  try {
    const response = await fetch(
      `/api/ai/chat/getHistory?username=${encodeURIComponent(username)}&page=${page}&size=${size}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          token: localStorage.getItem('token') || ''
        }
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('获取聊天历史失败:', error)
    throw error
  }
}
