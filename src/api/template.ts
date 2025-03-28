import request from '@/utils/request'

interface ResumeForm {
  name: string
  gender: string
  jobTitle: string
  birthday: string
  origin: string
  currentResidence: string
  politicalStatus: string
  contact: string
  email: string
  honors: string
  certifications: string
  education: Array<{
    school: string
    major: string
    degree: string
    time: [string, string]
  }>
  experience: Array<{
    company: string
    position: string
    description: string
    time: [string, string]
  }>
  campusExperience: string
  skills: string[]
  selfAssessment: string
}

interface AiSuggestions {
  summary: string
  score: number
  suggestions: string[]
  revisions: Array<{
    section: string
    suggestion: string
  }>
  industryMatch: Array<{
    industry: string
    score: number
  }>
}

export function Youhua(data: ResumeForm) {
  return request<AiSuggestions>({
    url: '/ai/cv',
    method: 'post',
    data
  })
}