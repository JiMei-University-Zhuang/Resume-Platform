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

/**
 * 使用AI分析并优化简历
 * @param data 简历表单数据
 * @returns 返回AI的优化建议
 */
export function analyzeResume(data: ResumeForm) {
  return request<{ aiSuggestions: AiSuggestions }>({
    url: '/ai/cv',
    method: 'post',
    data
  })
}