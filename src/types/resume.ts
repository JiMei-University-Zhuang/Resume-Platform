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