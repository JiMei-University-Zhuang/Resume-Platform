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
// 新增统一的响应类型
export interface ExamData {
  questions: {
    id: number
    content: string
    options: string[]
    answer?: string
  }[]
  duration: number
  mode: 'practice' | 'real' // 新增模式标识
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
    url: '/graduate/practice',
    method: 'post',
    data
  })
}

/**
 * 根据卷子名称获取思想政治卷子详情
 * @param examName 卷子名称
 * @returns
 */
export function getPoliticsPaperByName(examName: string) {
  return request({
    url: '/exam/getPoliticalExam',
    method: 'post',
    data: {
      examName
    }
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