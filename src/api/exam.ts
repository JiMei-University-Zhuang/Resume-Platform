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
  score: number
  type: '练习' | '考试'
}

export interface ScoregetData {
  userId: number
  type: '练习' | '考试'
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

// 保存错题单个
export interface WrongQuestionRecord {
  questionId: number
  itemId: number | null
  userAnswer: string
}

// 保存错题整体
export interface SaveWrongQuestionData {
  userId: number
  type: '练习' | '考试'
  records: WrongQuestionRecord[]
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

//获取错题接口
export function getWrongQuestion(data: Question) {
  return request({
    url: '/record/restore',
    method: 'post',
    data
  })
}

//保存错题的接口
export function saveWrongQuestion(data: SaveWrongQuestionData) {
  return request({
    url: '/record/save',
    method: 'post',
    data
  })
}

// 获取错题记录数的接口
export function getWrongQuestionRecordCount(data: GetRecordData) {
  return request({
    url: '/record/getRecord',
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

export function submitProfessionalExam(data: any) {
  return request({
    url: '/exam/submitProfessionalExam',
    method: 'post',
    data
  })
}
