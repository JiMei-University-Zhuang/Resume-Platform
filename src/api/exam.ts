import request from '@/utils/request'

export interface CSPractice {
  subject: string
  count: number
}

export interface GSPractice {
  subject: string
  questionType: string
  count: number
}

export interface CSExam {
  examName: string
}

// 统一的响应类型
export interface ExamData {
  questions: {
    id: number
    content: string
    options: string[]
    answer?: string
  }[]
  duration: number
}

export interface ScoresaveData {
  userId: number
  userScore: number
  totalScore: number
  type: '公务员练习' | '公务员考试' | '研究生练习' | '研究生考试'
  questionInfo: string
}

export interface ScoregetData {
  userId: number
  type: '公务员' | '研究生'
  examName?: string
  subject?: string
  totalScore?: number
  accuracy?: number
  timestamp?: number
}

export interface Question {
  userId: number
  type: '练习' | '考试'
  recordId: number
}

export interface GetRecordData {
  userId: number
  type: '练习' | '考试'
}

//获取公务员考试练习
export function getCSPractice(data: CSPractice) {
  return request<ExamData>({
    url: '/practice/getCSPractice',
    method: 'post',
    data
  })
}

//获取公务员考试试卷
export function getCSExam(data: CSExam) {
  return request<ExamData>({
    url: '/exam/getCSExam',
    method: 'post',
    data
  })
}

//获取研究生考试练习
export function getGSPractice(data: GSPractice) {
  return request({
    url: '/practice/getGSPractice',
    method: 'post',
    data
  })
}

//保存成绩的接口
export function saveScore(data: ScoresaveData) {
  return request({
    url: '/score/record',
    method: 'post',
    data
  })
}

//获取成绩
export function getScore(data: ScoregetData) {
  return request({
    url: '/score/get',
    method: 'post',
    data
  })
}

/**
 * 根据卷子名称获取思想政治卷子详情
 * @param examName 卷子名称
 * @param token 可选的token参数
 * @returns
 */
export function getPoliticsPaperByName(examName: string, token?: string) {
  const data: any = { examName }
  if (token) {
    data.token = token
  }

  return request({
    url: '/exam/getPoliticalExam',
    method: 'post',
    data
  })
}

export function getEnglishExam(examName: string) {
  return request({
    url: '/exam/getEnglishExam',
    method: 'post',
    data: {
      examName
    }
  })
}

export function getProfessionalExam(examName: string) {
  return request({
    url: '/exam/getProfessionalExam',
    method: 'post',
    data: { examName }
  })
}

/**
 * 获取心理学专业课试卷
 * @param examName 试卷名称
 * @param retryCount 重试次数，默认为2
 * @returns Promise
 */
export function getPsychologyExam(examName: string, retryCount = 2) {
  return new Promise((resolve, reject) => {
    const fetchData = async (currentRetry = 0) => {
      try {
        const response = await request({
          url: '/exam/getPsychologyExam',
          method: 'post',
          data: { examName }
        })
        resolve(response)
      } catch (error: any) {
        // 如果是网络错误或服务器错误，且还有重试次数，则重试
        if (
          (error.response?.status >= 500 || error.code === 'ECONNABORTED') &&
          currentRetry < retryCount
        ) {
          console.log(`获取心理学试卷失败，准备第${currentRetry + 1}次重试...`)
          // 指数退避策略，增加重试间隔
          const retryDelay = Math.min(1000 * 2 ** currentRetry, 5000)

          setTimeout(() => {
            fetchData(currentRetry + 1)
          }, retryDelay)
        } else {
          reject(error)
        }
      }
    }

    fetchData()
  })
}

export function getHistoryExam(examName: string, retryCount = 2) {
  return new Promise((resolve, reject) => {
    const fetchData = async (currentRetry = 0) => {
      try {
        const response = await request({
          url: '/exam/getHistoryExam',
          method: 'post',
          data: { examName }
        })
        resolve(response)
      } catch (error: any) {
        // 如果是网络错误或服务器错误，且还有重试次数，则重试
        if (
          (error.response?.status >= 500 || error.code === 'ECONNABORTED') &&
          currentRetry < retryCount
        ) {
          console.log(`获取心理学试卷失败，准备第${currentRetry + 1}次重试...`)
          // 指数退避策略，增加重试间隔
          const retryDelay = Math.min(1000 * 2 ** currentRetry, 5000)

          setTimeout(() => {
            fetchData(currentRetry + 1)
          }, retryDelay)
        } else {
          reject(error)
        }
      }
    }

    fetchData()
  })
}

/**
 * 提交心理学考试答案
 * @param data 考试答案数据
 * @returns Promise
 */
export function submitPsychologyExam(data: any) {
  return request({
    url: '/exam/submitPsychologyExam',
    method: 'post',
    data
  })
}
