import type {
  CareerAnalysisForm,
  CareerAnalysisResult,
  CareerRoadmapForm,
  CareerRoadmapResult,
  CareerRecommendationForm,
  CareerRecommendationResult,
  CareerSkill
} from '@/types/career'

// 获取职业技能列表
export const getCareerSkills = async (): Promise<CareerSkill[]> => {
  // 实际项目中应该调用API
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, name: '编程开发', category: 'tech' },
        { id: 2, name: '数据分析', category: 'tech' },
        { id: 3, name: '产品设计', category: 'design' },
        { id: 4, name: '市场营销', category: 'business' },
        { id: 5, name: '项目管理', category: 'management' },
        { id: 6, name: '沟通协作', category: 'soft' },
        { id: 7, name: '问题解决', category: 'soft' },
        { id: 8, name: '领导能力', category: 'management' },
        { id: 9, name: '创新思维', category: 'soft' },
        { id: 10, name: '用户研究', category: 'design' }
      ])
    }, 800)
  })
}

// 提交职业分析
export const submitCareerAnalysis = async (
  _data: CareerAnalysisForm
): Promise<CareerAnalysisResult> => {
  // 实际项目中应该调用后端AI API
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        recommendedCareer: '软件开发工程师',
        suitabilityScore: 92,
        strengths: ['技术能力强', '逻辑思维清晰', '学习能力佳'],
        weaknesses: ['沟通能力有待提升'],
        advantages: '具备扎实的技术基础，对编程有浓厚兴趣，适合从事技术开发工作。',
        suggestions:
          '建议继续深入学习新技术，参与开源项目，提升系统设计能力，同时加强沟通能力和团队协作能力。',
        relatedCareers: ['前端开发工程师', '后端开发工程师', '全栈工程师', '移动开发工程师']
      })
    }, 2000)
  })
}

// 提交职业发展规划
export const submitCareerRoadmap = async (
  _data: CareerRoadmapForm
): Promise<CareerRoadmapResult> => {
  // 实际项目中应该调用后端AI API
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        targetPosition: '技术总监',
        currentLevel: '高级开发工程师',
        timelineYears: 7,
        milestones: [
          {
            stage: 1,
            title: '高级开发工程师',
            duration: '现在',
            tasks: ['精通一至两个技术领域', '能够独立负责复杂模块的设计与开发', '指导初级工程师'],
            skillsToAcquire: ['系统设计', '代码审查', '技术指导']
          },
          {
            stage: 2,
            title: '技术专家',
            duration: '1-2年',
            tasks: ['主导重要项目的技术方案', '解决复杂技术难题', '负责技术评审与标准制定'],
            skillsToAcquire: ['架构设计', '技术决策', '跨团队协作']
          },
          {
            stage: 3,
            title: '架构师',
            duration: '3-5年',
            tasks: ['负责产品线的架构设计', '进行技术选型与技术规划', '指导多个团队的技术实现'],
            skillsToAcquire: ['系统架构', '技术战略', '团队建设']
          },
          {
            stage: 4,
            title: '技术总监',
            duration: '5-7年',
            tasks: ['制定技术战略与路线图', '管理多个技术团队', '参与公司级技术决策'],
            skillsToAcquire: ['技术管理', '资源规划', '业务理解']
          }
        ],
        recommendations: [
          '积极参与开源项目，提升技术影响力',
          '注重跨部门沟通与协作能力的培养',
          '学习项目管理和团队管理知识',
          '关注行业动态，保持技术敏感度'
        ]
      })
    }, 2500)
  })
}

// 获取职业推荐
export const getCareerRecommendations = async (
  _data: CareerRecommendationForm
): Promise<CareerRecommendationResult> => {
  // 实际项目中应该调用后端AI API
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        topRecommendations: [
          {
            title: '软件开发工程师',
            matchScore: 95,
            description:
              '负责设计、开发、测试和维护软件系统，使用编程语言和开发工具创建高质量的软件产品。',
            requiredSkills: ['编程语言', '算法', '数据结构', '软件设计'],
            averageSalary: '25k-45k',
            growthProspect: '高',
            workLifeBalance: '中等'
          },
          {
            title: '数据科学家',
            matchScore: 89,
            description:
              '分析和解释复杂数据，使用统计和机器学习技术提取有价值的见解，支持决策制定。',
            requiredSkills: ['统计学', '机器学习', 'Python', '数据挖掘'],
            averageSalary: '30k-50k',
            growthProspect: '高',
            workLifeBalance: '良好'
          },
          {
            title: '产品经理',
            matchScore: 82,
            description:
              '负责产品的战略规划、需求分析、功能设计和生命周期管理，协调各团队实现产品愿景。',
            requiredSkills: ['需求分析', '市场洞察', '用户体验', '项目管理'],
            averageSalary: '20k-40k',
            growthProspect: '中高',
            workLifeBalance: '一般'
          }
        ],
        industryTrends: [
          {
            industry: '人工智能',
            growthRate: '35%',
            description:
              '人工智能领域正在快速发展，对具备机器学习、深度学习和自然语言处理技能的专业人士需求旺盛。'
          },
          {
            industry: '云计算',
            growthRate: '28%',
            description:
              '随着企业数字化转型加速，云计算技术人才的需求持续增长，特别是在云架构、安全和DevOps方面。'
          },
          {
            industry: '数据分析',
            growthRate: '25%',
            description:
              '大数据时代，数据分析师的重要性日益凸显，能够从数据中提取洞察的专业人才备受追捧。'
          }
        ],
        careerAdvice:
          '基于您的背景和兴趣，技术领域是最匹配的发展方向。建议深入学习软件开发或数据科学相关技能，同时关注人工智能等新兴领域的发展动态。'
      })
    }, 2200)
  })
}
