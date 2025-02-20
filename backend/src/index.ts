import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios, { AxiosResponse } from 'axios';
import { Readable } from 'stream';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

interface ZhipuAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
    finish_reason: string;
    index: number;
  }>;
}

interface StreamResponse extends AxiosResponse {
  data: Readable;
}

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true,
}));

app.post('/chat', async (req, res) => {
  try {
    const { message: userMessage, system_message = "你是一个有帮助的AI助手。" } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }


    if (!process.env.ZHIPU_API_KEY) {
      return res.status(500).json({ 
        error: 'Configuration Error',
        details: {
          message: 'Zhipu AI API key is not configured',
          status: 500,
          statusText: 'Internal Server Error'
        }
      });
    }

    try {
      const apiUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
      const requestPayload = {
        model: process.env.MODEL_NAME || 'glm-4',
        messages: [
          {
            role: 'system',
            content: system_message
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.7,
        top_p: 0.7,
        stream: true,
        request_id: Date.now().toString()
      };
      
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      let noDataReceived = true;
      const requestTimeout = setTimeout(() => {
        if (noDataReceived && !res.writableEnded) {
          console.error('No data received from Zhipu AI within timeout');
          res.write(`data: ${JSON.stringify({ error: 'Timeout waiting for Zhipu AI response' })}\n\n`);
          res.write('data: [DONE]\n\n');
          res.end();
        }
      }, 10000); 

      const response = await axios.post<any, StreamResponse>(
        apiUrl,
        requestPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}`,
            'Accept': 'text/event-stream'
          },
          responseType: 'stream',
          timeout: 30000 
        }
      );

      response.data.on('data', (chunk: Buffer) => {
        noDataReceived = false;
        const chunkStr = chunk.toString();
        try {
          const errorCheck = JSON.parse(chunkStr);
          if (errorCheck.error) {
            console.error('Error from Zhipu AI:', errorCheck);
            res.write(`data: ${JSON.stringify({ error: errorCheck.error })}\n\n`);
            res.write('data: [DONE]\n\n');
            res.end();
            return;
          }
        } catch (e) {
        }

        const lines = chunkStr.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              res.write('data: [DONE]\n\n');
              res.end();
              return;
            }
            try {
              const jsonData = JSON.parse(data);
              if (jsonData.choices?.[0]?.delta?.content) {
                const content = jsonData.choices[0].delta.content;
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
              }
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        }
      });

      response.data.on('end', () => {
        clearTimeout(requestTimeout);
        if (!res.writableEnded) {
          res.write('data: [DONE]\n\n');
          res.end();
        }
      });

      response.data.on('error', (error: Error) => {
        clearTimeout(requestTimeout);
        console.error('Stream error:', error);
        if (!res.writableEnded) {
          res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
          res.write('data: [DONE]\n\n');
          res.end();
        }
      });

    } catch (apiError: any) {
      console.error('Zhipu AI API Error:', {
        message: apiError.message,
        code: apiError.code,
        name: apiError.name,
        stack: apiError.stack,
        response: {
          data: apiError.response?.data,
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          headers: apiError.response?.headers,
        },
        request: {
          method: apiError.config?.method,
          url: apiError.config?.url,
          data: apiError.config?.data,
          headers: apiError.config?.headers,
        }
      });

      if (!res.writableEnded) {
        res.status(apiError.response?.status || 500).json({ 
          error: 'Zhipu AI API Error',
          details: {
            message: apiError.message,
            status: apiError.response?.status,
            statusText: apiError.response?.statusText,
            response: apiError.response?.data
          }
        });
      }
    }
  } catch (error: any) {
    console.error('Server Error:', {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack
    });

    if (!res.writableEnded) {
      res.status(500).json({ 
        error: 'Server Error',
        details: {
          message: error.message,
          status: 500,
          statusText: 'Internal Server Error',
          code: error.code
        }
      });
    }
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
