export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

export interface MockData {
  [key: string]: string;
} 