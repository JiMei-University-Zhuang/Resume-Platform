import request from '@/utils/request'

export interface CSPractice {
  subject: string
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
