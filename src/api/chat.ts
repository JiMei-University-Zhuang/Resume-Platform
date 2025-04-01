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
}

export const sendChatMessage = async (message: string, system_message?: string) => {
  console.log('Sending chat message:', { message, system_message })

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

  console.log('Got response:', response)
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  let content = ''

  if (!reader) {
    throw new Error('No reader available')
  }

  try {
    while (true) {
      const { done, value } = await reader.read()
      console.log('Read chunk:', {
        done,
        value: value ? decoder.decode(value) : null
      })

      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        console.log('Processing line:', line)
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          console.log('Data content:', data)
          if (data === '[DONE]') {
            console.log('Received DONE signal')
            return { content }
          }
          try {
            const jsonData = JSON.parse(data)
            console.log('Parsed JSON:', jsonData)
            if (jsonData.content) {
              content += jsonData.content
              console.log('Updated content:', content)
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

// 定义一个简单的错误重试函数
const retry = async <T>(
  fn: () => Promise<T>,
  retries = 2,
  delay = 500,
  onRetry?: (attempt: number, error: Error) => void
): Promise<T> => {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (attempt < retries) {
        if (onRetry) onRetry(attempt + 1, lastError)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}

// 添加简单的回退消息生成函数
const generateFallbackResponse = (message: string): string => {
  // 简单的关键词匹配
  if (message.includes('你好') || message.includes('hi') || message.includes('hello')) {
    return '你好！我是AI助手。很抱歉，服务器目前不可用，我只能提供有限的回应。请稍后再试。'
  }

  if (message.includes('时间') || message.includes('日期')) {
    const now = new Date()
    return `现在的时间是：${now.toLocaleString()}。（注意：服务器连接失败，这是本地生成的响应）`
  }

  if (message.includes('天气')) {
    return '很抱歉，由于服务器连接问题，我无法获取实时天气信息。请稍后再试。'
  }

  // 提示用户服务器连接失败
  return '抱歉，AI服务器连接失败。这是一个本地生成的回复。请稍后再试，或者联系系统管理员检查服务器状态。'
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
  let isFallbackMode = false

  // 尝试创建连接
  const createConnection = () => {
    // 如果已经尝试过所有重试，使用回退模式
    if (retryCount > MAX_RETRIES) {
      isFallbackMode = true

      console.log('使用本地回退模式')
      const fallbackResponse = generateFallbackResponse(message)

      // 模拟流式返回
      let isCancelled = false

      simulateStreamResponse(
        fallbackResponse,
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
