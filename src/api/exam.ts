import request from '@/utils/request'

export interface CSPractice {
  subject: string
  count: number
}

//获取公务员考试练习
export function getCSPractice(data: CSPractice) {
  return request({
    url: '/practice/getCSPractice',
    method: 'post',
    data
  })
}
