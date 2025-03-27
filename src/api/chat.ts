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

export const sendChatMessage = async (
    message: string,
    system_message?: string
) => {
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
