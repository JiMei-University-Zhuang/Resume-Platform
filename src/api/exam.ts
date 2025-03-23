import request from '@/utils/request'

export interface CSPractice {
  subject: string
  count: number
}
export interface CSExam {
  examName: string
}

//获取公务员考试练习
export function getCSPractice(data: CSPractice) {
  return request({
    url: '/practice/getCSPractice',
    method: 'post',
    data
  })
}

//获取公务员考试试卷
export function getCSExam(data: CSExam) {
  return request({
    url: '/exam/getCSExam',
    method: 'post',
    data
  })
}
