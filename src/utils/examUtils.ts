import type { ChoiceQuestion, ExamPaper } from '@/types/exam'

/**
 * 计算单选题得分
 * @param questions 单选题列表
 * @param answers 用户答案
 * @returns 得分情况
 */
export function calculateChoiceScore(questions: ChoiceQuestion[], answers: string[]) {
  let totalScore = 0
  let correctCount = 0
  let wrongCount = 0
  let blankCount = 0

  questions.forEach((question, index) => {
    const userAnswer = answers[index]

    if (!userAnswer) {
      blankCount++
    } else if (userAnswer === question.correctAnswer) {
      totalScore += question.score
      correctCount++
    } else {
      wrongCount++
    }
  })

  return {
    totalScore,
    correctCount,
    wrongCount,
    blankCount,
    totalCount: questions.length,
    accuracy:
      questions.length > 0 ? ((correctCount / questions.length) * 100).toFixed(2) + '%' : '0%'
  }
}

/**
 * 按难度统计题目数量
 * @param examPaper 试卷数据
 * @returns 统计结果
 */
export function countQuestionsByDifficulty(examPaper: ExamPaper) {
  const result = {
    简单: { choice: 0, solve: 0 },
    中等: { choice: 0, solve: 0 },
    较难: { choice: 0, solve: 0 },
    困难: { choice: 0, solve: 0 }
  }

  if (examPaper.choiceVOs) {
    examPaper.choiceVOs.forEach(q => {
      if (q.difficulty in result) {
        result[q.difficulty as keyof typeof result].choice++
      }
    })
  }

  if (examPaper.solveVOs) {
    examPaper.solveVOs.forEach(q => {
      if (q.difficulty in result) {
        result[q.difficulty as keyof typeof result].solve++
      }
    })
  }

  return result
}

/**
 * 生成错题集
 * @param examPaper 试卷数据
 * @param answers 用户答案
 * @returns 错题集
 */
export function generateWrongQuestions(examPaper: ExamPaper, answers: string[]) {
  const wrongQuestions: ChoiceQuestion[] = []

  if (examPaper.choiceVOs) {
    examPaper.choiceVOs.forEach((question, index) => {
      const userAnswer = answers[index]
      if (userAnswer && userAnswer !== question.correctAnswer) {
        wrongQuestions.push({
          ...question,
          userAnswer // 添加用户的错误答案
        } as ChoiceQuestion & { userAnswer: string })
      }
    })
  }

  return wrongQuestions
}

/**
 * 格式化时间为可读字符串
 * @param seconds 秒数
 * @returns 格式化的时间字符串
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    remainingSeconds.toString().padStart(2, '0')
  ].join(':')
}

/**
 * 保存考试进度到本地存储
 * @param key 存储键名
 * @param data 要存储的数据
 */
export function saveExamProgress(key: string, data: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('保存考试进度失败:', error)
  }
}

/**
 * 从本地存储加载考试进度
 * @param key 存储键名
 * @returns 存储的数据，如果不存在则返回null
 */
export function loadExamProgress(key: string): any {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : null
  } catch (error) {
    console.error('加载考试进度失败:', error)
    return null
  }
}
