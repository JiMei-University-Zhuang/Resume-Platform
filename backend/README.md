# AI Chat Backend (Node.js)

这是一个使用 Express 和 LangChain.js 构建的聊天后端服务。

## 安装

1. 安装依赖：
```bash
npm install
```

2. 配置环境变量：
复制 `.env.example` 文件为 `.env` 并填写你的 OpenAI API 密钥：
```
OPENAI_API_KEY=your-api-key-here
```

## 运行

开发模式启动服务器：
```bash
npm run dev
```

生产模式：
```bash
npm run build
npm start
```

服务器将在 http://localhost:8000 运行。

## API 端点

### POST /chat
发送聊天消息并获取回复。

请求体：
```json
{
    "message": "你的问题",
    "system_message": "可选的系统消息"
}
```

响应：
```json
{
    "content": "AI的回复"
}
```

## 注意事项

1. 确保你有有效的 OpenAI API 密钥
2. 可以在 .env 文件中配置不同的模型和温度参数
3. 默认使用 gpt-3.5-turbo 模型
