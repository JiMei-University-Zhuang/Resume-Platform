export interface CareerAnalysis {
  recommendedCareer: string
  advantages: string
  suggestions: string
}

export interface CareerPlanningForm {
  education: string
  experience: string
  interests: string[]
  skills: string[]
  goals: string
}

// 职业技能
export interface CareerSkill {
  id: number
  name: string
  category: string
}

// 职业分析表单
export interface CareerAnalysisForm {
  education: string
  major: string
  skills: string[]
  interests: string[]
  workExperience: number
}

// 职业分析结果
export interface CareerAnalysisResult {
  recommendedCareer: string
  suitabilityScore: number
  strengths: string[]
  weaknesses: string[]
  advantages: string
  suggestions: string
  relatedCareers: string[]
}

// 职业发展规划表单
export interface CareerRoadmapForm {
  currentPosition: string
  targetPosition: string
  yearsOfExperience: number
  skills: string[]
  interests: string[]
  education: string
  preferredIndustry?: string
}

// 职业发展里程碑
export interface CareerMilestone {
  stage: number
  title: string
  duration: string
  tasks: string[]
  skillsToAcquire: string[]
}

// 职业发展规划结果
export interface CareerRoadmapResult {
  targetPosition: string
  currentLevel: string
  timelineYears: number
  milestones: CareerMilestone[]
  recommendations: string[]
}

// 职业推荐表单
export interface CareerRecommendationForm {
  skills: string[]
  interests: string[]
  education: string
  experience: number
  preferredWorkStyle?: string
  preferredIndustry?: string
  preferredLocation?: string
  currentPosition?: string
}

// 职业推荐
export interface CareerRecommendation {
  title: string
  matchScore: number
  description: string
  requiredSkills: string[]
  averageSalary: string
  growthProspect: string
  workLifeBalance: string
  jobLinks?: JobLink[]
}

// 新增：招聘网站链接
export interface JobLink {
  platform: string
  url: string
  logo: string
}

// 新增：热门职位
export interface HotJob {
  id: number
  title: string
  company: string
  salary: string
  location: string
  education: string
  experience: string
  companyLogo: string
  tags: string[]
  jobLinks: JobLink[]
}

// 行业趋势
export interface IndustryTrend {
  industry: string
  growthRate: string
  description: string
}

// 职业推荐结果
export interface CareerRecommendationResult {
  topRecommendations: CareerRecommendation[]
  industryTrends: IndustryTrend[]
  careerAdvice: string
  hotJobs?: HotJob[]
}
