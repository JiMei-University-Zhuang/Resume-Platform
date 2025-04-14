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

//获取练习成绩或者考试成绩接口
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

export function getPsychologyExam(examName: string) {
  return request({
    url: '/exam/getPsychologyExam',
    method: 'post',
    data: { examName }
  })
}

export function submitProfessionalExam(data: any) {
  return request({
    url: '/exam/submitProfessionalExam',
    method: 'post',
    data
  })
}
