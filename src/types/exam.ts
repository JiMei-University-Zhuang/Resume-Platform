// 考试相关类型定义

// 单选题类型
export interface ChoiceQuestion {
  questionId: string
  questionContent: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: string
  score: number
  difficulty: '简单' | '中等' | '较难' | '困难'
  [key: string]: string | number | '简单' | '中等' | '较难' | '困难'
}

// 解答题类型
export interface SolveQuestion {
  questionId: string
  questionContent: string
  score: number
  difficulty: '简单' | '中等' | '较难' | '困难'
  referenceAnswer: string
}

// 试卷数据类型
export interface ExamPaper {
  choiceVOs?: ChoiceQuestion[]
  solveVOs?: SolveQuestion[]
}

// AI解析结果状态
export enum AIAnalysisStatus {
  NOT_STARTED = 0,
  LOADING = 1,
  COMPLETED = 2,
  ERROR = 500
}

// 考试设置
export interface ExamSettings {
  timeLimit: number // 考试时间限制(秒)
  showDifficulty: boolean // 是否显示题目难度
  showAIAnalysis: boolean // 是否显示AI解析
  filterByDifficulty: boolean // 是否按难度筛选题目
}
