import request from '@/utils/request'
import { SaveWrongQuestionData, GetRecordData, Question } from '@/types/errorRecord'

// 保存错题的接口
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

// 获取错题接口
export function getWrongQuestion(data: Question) {
  return request({
    url: '/record/restore',
    method: 'post',
    data
  })
}
