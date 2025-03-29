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

export interface ResumeForm {
  name: string
  gender: string
  jobTitle: string
  birthday: Date | null
  origin: string
  currentResidence: string
  politicalStatus: string
  contact: string
  email: string
  honors: string
  certifications: string
  education: {
    school: string
    major: string
    degree: string
    time: [Date | null, Date | null]
  }[]
  experience: {
    company: string
    position: string
    description: string
    time: [Date | null, Date | null]
  }[]
  campusExperience: string
  skills: string[]
  selfAssessment: string
  photoUrl?: string
}
