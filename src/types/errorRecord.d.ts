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

export interface Question {
  userId: number
  type: '练习' | '考试'
  recordId: number
}
