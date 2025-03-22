<template>
  <div class="chat-container">
    <div class="chat-box" ref="chatboxRef">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['message', msg.role]"
      >
        <div :class="msg.role + '_inner'">
          <div v-html="md.render(msg.text)"></div>
        </div>
      </div>
      <div v-if="isTyping" class="message ai typing">AI 正在输入...</div>
    </div>
    <div class="input-area">
      <input
        v-model="userInput"
        @keyup.enter="handleSendMessage"
        placeholder="请输入消息..."
      />
      <button @click="handleSendMessage">发送</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue";
import MarkdownIt from "markdown-it";
import type { Options as MarkdownItOptions } from 'markdown-it';
import Prism from "prismjs";
import { ElMessage } from 'element-plus'
import type { ChatMessage, MockData } from '@/types/chat'

import "prismjs/themes/prism-okaidia.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markdown";
import "prismjs/plugins/toolbar/prism-toolbar.css";
import "prismjs/plugins/toolbar/prism-toolbar";
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard";
import "prismjs/plugins/show-language/prism-show-language";
import "katex/dist/katex.min.css";
import markdownItKatexGpt from "markdown-it-katex-gpt";

import { codeStr1, formulaStr1, tableStr } from "./mocks";

// 初始化变量
const chatboxRef = ref<HTMLDivElement | null>(null);
const messages = ref<ChatMessage[]>([]);
const userInput = ref("");
const isTyping = ref(false);

// 初始化 Markdown
const mdOptions: MarkdownItOptions = {
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
  highlight: (str: string, lang: string) => {
    if (lang && Prism.languages[lang]) {
      try {
        return `<pre class="code-block language-${lang}"><code class="language-${lang}">${
          Prism.highlight(str, Prism.languages[lang], lang)
        }</code></pre>`;
      } catch (__) {}
    }
    return `<pre class="code-block"><code>${str}</code></pre>`;
  }
}

const md = new MarkdownIt(mdOptions);
md.use(markdownItKatexGpt, {
  delimiters: [
    { left: "\\[", right: "\\]", display: true },
    { left: "\\(", right: "\\)", display: false },
    { left: "$$", right: "$$", display: true },
    { left: "$", right: "$", display: false },
  ],
});

// 模拟数据
const mockData: MockData = {
  代码: codeStr1,
  数学公式: formulaStr1,
  表格: tableStr,
};

// AI回复流式处理
const streamAiReply = async (fullText: string) => {
  const index = messages.value.length;
  const message: ChatMessage = { role: "ai", text: "" };
  messages.value.push(message);

  for (let i = 0; i < fullText.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, 50));

    if (messages.value[index]) {
      messages.value[index] = {
        ...messages.value[index],
        text: messages.value[index].text + fullText[i],
      };

      await nextTick();
      Prism.highlightAll();
      
      if (chatboxRef.value) {
        chatboxRef.value.scrollTop = chatboxRef.value.scrollHeight;
      }
    }
  }
};

// 消息处理函数
const handleSendMessage = async () => {
  if (!userInput.value.trim()) return;
  const userMessage = userInput.value;
  messages.value.push({ role: "user", text: userMessage });
  userInput.value = "";
  isTyping.value = true;

  try {
    if (userMessage in mockData) {
      await streamAiReply(mockData[userMessage]);
    } else {
      // 创建新的消息
      messages.value.push({ role: "ai", text: "" });
      const currentIndex = messages.value.length - 1;

      // 创建 EventSource 实例
      const eventSource = new EventSource(`http://8.130.75.193:8081/test/chat?message=${encodeURIComponent(userMessage)}`);

      // 监听消息
      eventSource.onmessage = async (event) => {
        if (messages.value[currentIndex]) {
          messages.value[currentIndex].text += event.data;
          await nextTick();
          if (chatboxRef.value) {
            chatboxRef.value.scrollTop = chatboxRef.value.scrollHeight;
          }
          Prism.highlightAll();
        }
      };

      // 监听错误
      eventSource.onerror = (error) => {
        console.error('SSE Error:', error);
        eventSource.close();
        isTyping.value = false;
        ElMessage.error('连接中断，请重试');
      };

      // 等待消息完成
      await new Promise((resolve) => {
        eventSource.addEventListener('done', () => {
          eventSource.close();
          resolve(true);
        });
        
        // 设置超时
        setTimeout(() => {
          eventSource.close();
          resolve(true);
        }, 30000); // 30秒超时
      });
    }
  } catch (error) {
    const err = error as Error;
    ElMessage.error(err.message || '发送消息失败');
    messages.value.push({
      role: 'ai',
      text: '❌ 发送消息失败，请重试'
    });
  } finally {
    isTyping.value = false;
  }
};

// 生命周期钩子
onMounted(() => {
  if (chatboxRef.value) {
    chatboxRef.value.scrollTop = chatboxRef.value.scrollHeight;
  }
});
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
}

.chat-box {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 20px;
}

.message {
  margin-bottom: 20px;
}

.user {
  text-align: right;
}

.ai {
  text-align: left;
}

.user_inner,
.ai_inner {
  display: inline-block;
  padding: 10px 15px;
  border-radius: 10px;
  max-width: 80%;
}

.user_inner {
  background-color: #007AFF;
  color: white;
}

.ai_inner {
  background-color: #f0f0f0;
  color: #333;
}

.typing {
  font-style: italic;
  color: #666;
}

.input-area {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  background-color: #007AFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.code-block {
  margin: 10px 0;
  padding: 15px;
  background-color: #1e1e1e;
  border-radius: 5px;
  overflow-x: auto;
}

.code-block code {
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  line-height: 1.5;
}
</style>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 85vh;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  margin: 20px auto;
}

.chat-box {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background: #f9f9f9;
}

.message {
  padding: 8px;
  margin: 5px;
  border-radius: 5px;
  display: flex;
}

.ai {
  text-align: left;
}
.ai_inner {
  min-width: 1px;
  flex: 1;
}

.user {
  justify-content: flex-end;
}

.user_inner {
  background: #d1e7fd;
  justify-content: flex-end;
  text-align: right;
  border-radius: 5px;
  padding: 8px;
}

.code-block {
  background: #2d2d2d;
  color: #f8f8f2;
  font-family: monospace;
  padding: 5px;
  border-radius: 5px;
  white-space: pre-wrap;
}

/* Table styles */
:deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
  background-color: white;
  border-radius: 4px;
  overflow: hidden;
}

:deep(th),
:deep(td) {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

:deep(th) {
  background-color: #f4f4f4;
  font-weight: bold;
}

:deep(tr:nth-child(even)) {
  background-color: #f8f8f8;
}

:deep(tr:hover) {
  background-color: #f5f5f5;
}

.input-area {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
  background: #fff;
}

input {
  flex: 1;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  margin-left: 10px;
  padding: 5px 10px;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}
</style>
