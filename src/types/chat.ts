export interface ChatMessage {
    role: 'user' | 'ai'
    text: string
}

export interface MockData {
    [key: string]: string
}

export interface ErrorDetails {
    message?: string
    status?: number | string
    statusText?: string
    response?: any
}

export interface ErrorResponse {
    error?: string
    details?: ErrorDetails
}
