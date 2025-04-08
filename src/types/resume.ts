/**
 * 简历相关类型定义
 */

export interface ScoreDetail {
  label: string
  value: number
}

export interface Suggestion {
  type: 'warning' | 'info' | 'success'
  priority: 'high' | 'medium' | 'low'
  title: string
  content: string
  original: string
  suggested: string
}

export interface IndustryMatch {
  industry: string
  score: number
  keywords: string[]
}

export interface AnalysisResult {
  score: number
  scoreDetails: {
    content: ScoreDetail
    format: ScoreDetail
    keywords: ScoreDetail
    experience: ScoreDetail
  }
  suggestions: Suggestion[]
  industryMatch: IndustryMatch[]
}

export interface Education {
  school: string
  major: string
  degree: string
  time: [Date, Date] // 使用字符串数组表示日期范围
}

export interface Experience {
  company: string
  position: string
  description: string
  time: [Date, Date] // 使用字符串数组表示日期范围
}

export interface ResumeForm {
  name: string
  gender: string
  jobTitle: string
  birthday: string | Date
  origin: string
  currentResidence: string
  politicalStatus: string
  contact: string
  email: string
  honors: string
  certifications: string
  education: Education[]
  experience: Experience[]
  campusExperience: string
  skills: string[]
  selfAssessment: string
  photoUrl?: string // 可选的照片URL
}

export interface SuggestionItem {
  original: string
  optimized: string
}

export interface AISection {
  title: string
  items?: SuggestionItem[]
  description?: string
}

export interface TemplateModule {
  [key: string]: any
}

export interface AISuggestions {
  summary: string
  score: number
  suggestions: string[]
  revisions: Array<{
    section: string
    suggestion: string | string[] | SuggestionItem[]
  }>
  industryMatch: Array<{
    industry: string
    score: number
  }>
}
