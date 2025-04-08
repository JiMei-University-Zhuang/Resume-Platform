// sseAnalysis.ts
export const analyzeAnswer = (questionId: string, answer: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const eventSource = new EventSource(
      `http://8.130.75.193/ai/analysis?questionId=${questionId}&answer=${encodeURIComponent(answer)}`
    )
    let analysisResult = ''

    eventSource.onmessage = function (event) {
      analysisResult += event.data
    }

    eventSource.onerror = function (err) {
      console.error('SSE 连接错误:', err)
      eventSource.close()
      reject(err)
    }

    eventSource.onopen = function () {
      console.log('SSE 连接已打开')
    }

    eventSource.addEventListener('close', function () {
      eventSource.close()
      resolve(analysisResult)
    })
  })
}
