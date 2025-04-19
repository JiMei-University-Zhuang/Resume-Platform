// 保存错题单个
export interface WrongQuestionRecord {
  questionId: number
  itemId?: number | null
  userAnswer: string
}

// 保存错题整体
export interface SaveWrongQuestionData {
  userId: number
  // type: '公务员练习' | '公务员考试' | '研究生练习' | '研究生考试'
  type: string
  questionInfo: string
  records: WrongQuestionRecord[]
}

export interface GetRecordData {
  userId: number
  type: '研究生' | '公务员'
}

// export interface Question {
//   userId: number
//   // type: '公务员练习' | '公务员考试' | '研究生练习' | '研究生考试'
//   type: string
//   record: number
// }
// 获取错题记录响应数据类型
export interface GetRecordResponse {
  type: '公务员练习' | '公务员考试' | '研究生练习' | '研究生考试'
  questionInfo: string
  recordId: number
  createTime: string
}

// 获取错题响应数据类型
export interface GetQuestionResponse {
  questionType: string
  score: number
  isSensitive: number
  questionId: number
  questionContent: string
  optionA?: string
  optionB?: string
  optionC?: string
  optionD?: string
  correctAnswer: string
  referenceAnswer?: string
  userAnswer: string
  questions?: {
    itemId: number
    itemContent: string
    optionA?: string
    optionB?: string
    optionC?: string
    optionD?: string
    correctAnswer: string
    userAnswer: string
    itemScore: number
  }[]
}
// 获取错题记录数接口返回数据类型
export interface RecordInfo {
  type: string
  questionInfo: string
  recordId: number
  createTime: string
}

export interface Question{
  userId?: number
  type?: string
  record?: number
}