import type {
  CareerAnalysisForm,
  CareerAnalysisResult,
  CareerRoadmapForm,
  CareerRoadmapResult,
  CareerRecommendationForm,
  CareerRecommendationResult,
  CareerSkill
} from '@/types/career'
import request from '@/utils/request'

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
            workLifeBalance: '中等',
            jobLinks: [
              {
                platform: 'Boss直聘',
                url: 'https://www.zhipin.com/web/geek/job?query=软件开发工程师',
                logo: 'https://static.zhipin.com/fe-zhipin-geek/v1671784884648/h5/resource/logo-image/boss-logo.png'
              },
              {
                platform: '智联招聘',
                url: 'https://sou.zhaopin.com/?kw=软件开发工程师',
                logo: 'https://fecdn5.zhaopin.cn/fecdn4/www/assets/web/common/images/logo-a5b87b7dfd.png'
              },
              {
                platform: '实习僧',
                url: 'https://www.shixiseng.com/interns?k=软件开发工程师',
                logo: 'https://cdn.shixiseng.com/assets/logo/logo-white-f1bfd74753.png'
              }
            ]
          },
          {
            title: '数据科学家',
            matchScore: 89,
            description:
              '分析和解释复杂数据，使用统计和机器学习技术提取有价值的见解，支持决策制定。',
            requiredSkills: ['统计学', '机器学习', 'Python', '数据挖掘'],
            averageSalary: '30k-50k',
            growthProspect: '高',
            workLifeBalance: '良好',
            jobLinks: [
              {
                platform: 'Boss直聘',
                url: 'https://www.zhipin.com/web/geek/job?query=数据科学家',
                logo: 'https://static.zhipin.com/fe-zhipin-geek/v1671784884648/h5/resource/logo-image/boss-logo.png'
              },
              {
                platform: '智联招聘',
                url: 'https://sou.zhaopin.com/?kw=数据科学家',
                logo: 'https://fecdn5.zhaopin.cn/fecdn4/www/assets/web/common/images/logo-a5b87b7dfd.png'
              },
              {
                platform: '实习僧',
                url: 'https://www.shixiseng.com/interns?k=数据科学家',
                logo: 'https://cdn.shixiseng.com/assets/logo/logo-white-f1bfd74753.png'
              }
            ]
          },
          {
            title: '产品经理',
            matchScore: 82,
            description:
              '负责产品的战略规划、需求分析、功能设计和生命周期管理，协调各团队实现产品愿景。',
            requiredSkills: ['需求分析', '市场洞察', '用户体验', '项目管理'],
            averageSalary: '20k-40k',
            growthProspect: '中高',
            workLifeBalance: '一般',
            jobLinks: [
              {
                platform: 'Boss直聘',
                url: 'https://www.zhipin.com/web/geek/job?query=产品经理',
                logo: 'https://static.zhipin.com/fe-zhipin-geek/v1671784884648/h5/resource/logo-image/boss-logo.png'
              },
              {
                platform: '智联招聘',
                url: 'https://sou.zhaopin.com/?kw=产品经理',
                logo: 'https://fecdn5.zhaopin.cn/fecdn4/www/assets/web/common/images/logo-a5b87b7dfd.png'
              },
              {
                platform: '实习僧',
                url: 'https://www.shixiseng.com/interns?k=产品经理',
                logo: 'https://cdn.shixiseng.com/assets/logo/logo-white-f1bfd74753.png'
              }
            ]
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
          '基于您的背景和兴趣，技术领域是最匹配的发展方向。建议深入学习软件开发或数据科学相关技能，同时关注人工智能等新兴领域的发展动态。',
        hotJobs: [
          {
            id: 1,
            title: '高级前端开发工程师',
            company: '字节跳动',
            salary: '30k-50k',
            location: '北京',
            education: '本科及以上',
            experience: '3-5年',
            companyLogo:
              'https://img.bosszhipin.com/beijin/mcs/banner/20210329/a9998add30b5c174b665bed292c5742e90c6b8d0b473145e95ffb120fe462a4a.png',
            tags: ['六险一金', '定期体检', '团队氛围好'],
            jobLinks: [
              {
                platform: 'Boss直聘',
                url: 'https://www.zhipin.com/web/geek/job?query=高级前端',
                logo: 'https://static.zhipin.com/fe-zhipin-geek/v1671784884648/h5/resource/logo-image/boss-logo.png'
              },
              {
                platform: '智联招聘',
                url: 'https://sou.zhaopin.com/?kw=高级前端',
                logo: 'https://fecdn5.zhaopin.cn/fecdn4/www/assets/web/common/images/logo-a5b87b7dfd.png'
              }
            ]
          }
        ]
      })
    }, 2000)
  })
}

// 获取常见职位列表
export const getCommonPositions = async (): Promise<string[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        '前端开发工程师',
        '后端开发工程师',
        '全栈工程师',
        '数据科学家',
        '人工智能工程师',
        '产品经理',
        '项目经理',
        'UI/UX设计师',
        '测试工程师',
        '运维工程师',
        '架构师',
        '技术经理',
        '技术总监',
        'CTO'
      ])
    }, 800)
  })
}

// AI职业分析API
export const aiProfessionAnalysis = async (
): Promise<CareerAnalysisResult> => {
  // 实际项目中应该调用后端AI API
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        recommendedCareer: '人工智能工程师',
        suitabilityScore: 85,
        strengths: ['编程开发能力强', '数据分析经验'],
        weaknesses: ['可能缺乏特定领域的人工智能项目经验', '对最新AI技术的掌握程度未知'],
        advantages:
          '该用户拥有计算机科学本科背景，加上三年的工作经验，特别是在编程开发和数据分析方面有着扎实的基础。这些技能对于成为一名优秀的人工智能工程师来说至关重要。此外，他对人工智能的兴趣表明了他愿意在这个领域内深入学习和发展。',
        suggestions:
          '为了进一步提高在人工智能领域的竞争力，建议加强机器学习、深度学习等核心技术的学习，并尝试参与更多实际项目以积累实践经验。同时，关注行业动态和技术趋势也非常重要，可以通过参加在线课程、研讨会等方式来实现这一点。',
        relatedCareers: ['数据科学家', '机器学习工程师']
      })
    }, 2000)
  })
}

// AI职业发展规划API
export const aiProfessionRoadmap = async (
): Promise<CareerRoadmapResult> => {
  // 实际项目中应该调用后端AI API
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        targetPosition: '技术总监',
        currentLevel: '高级开发工程师',
        timelineYears: 5,
        milestones: [
          {
            stage: 1,
            title: '架构师',
            duration: '2年',
            tasks: [
              '深入参与系统架构设计与优化',
              '领导或参与重要项目的技术选型和方案制定',
              '指导初级到中级开发者'
            ],
            skillsToAcquire: ['云原生架构设计', '大规模分布式系统管理']
          },
          {
            stage: 2,
            title: '高级架构师/技术经理',
            duration: '3年',
            tasks: [
              '负责多个项目的整体技术规划',
              '团队管理和人才培养',
              '跨部门沟通协作，推动技术创新'
            ],
            skillsToAcquire: ['敏捷开发流程管理', '产品思维', '领导力与团队建设']
          }
        ],
        recommendations: [
          '积极寻找机会参与到更广泛的项目中去，尤其是那些能够锻炼你架构设计能力的项目。',
          '加强与行业内其他专业人士的交流，比如参加相关的技术论坛、会议等，以拓宽视野并建立人脉。',
          '考虑获取相关认证（如AWS Certified Solutions Architect, CNCF Kubernetes Administrator）来证明你的专业水平。',
          '主动承担更多责任，比如带领小团队完成特定任务，以此积累管理经验。',
          '持续关注最新的技术趋势和发展方向，特别是云计算、容器化等领域的新进展。'
        ]
      })
    }, 2500)
  })
}

// AI职业推荐API
export const aiProfessionRecommendation = async (
): Promise<CareerRecommendationResult> => {
  // 实际项目中应该调用后端AI API
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        topRecommendations: [
          {
            title: '数据科学家',
            matchScore: 85,
            description:
              '负责利用大数据技术分析金融市场的趋势，通过机器学习模型预测市场变化，为公司决策提供支持。',
            requiredSkills: ['数据分析', 'Python编程', '统计学知识', '机器学习'],
            averageSalary: '20,000-35,000元/月',
            growthProspect:
              '随着金融科技行业的快速发展，对于能够结合最新AI技术和金融市场洞察力的专业人才需求日益增长。',
            workLifeBalance: '良好。许多企业支持灵活的工作安排，包括远程工作选项。'
          },
          {
            title: '量化分析师',
            matchScore: 78,
            description:
              '专注于开发和实施复杂的数学模型来帮助金融机构做出投资决策。需要深入理解金融市场运作机制以及强大的编程能力。',
            requiredSkills: ['Python编程', '统计学', '金融工程'],
            averageSalary: '18,000-30,000元/月',
            growthProspect: '量化交易领域持续扩张，特别是当更多机构寻求自动化其投资策略时。',
            workLifeBalance:
              '中等至良好。虽然可能面临项目截止日期的压力，但大多数公司都提倡健康的工作与生活平衡文化。'
          }
        ],
        industryTrends: [
          {
            industry: '金融科技',
            growthRate: '年均增长约20%',
            description:
              '金融科技行业正在经历前所未有的增长期，特别是在支付解决方案、区块链应用及智能投顾等领域。该领域不断吸引着大量投资，并且对具备跨学科背景的人才有着强烈的需求。'
          }
        ],
        careerAdvice:
          '鉴于您在数据分析、Python编程及统计学方面的坚实基础，加上对人工智能的兴趣，建议进一步深化在特定领域的专业知识（如自然语言处理或深度学习），这将有助于提升您的竞争力。同时，保持对最新金融科技动态的关注，积极参与相关社区活动或在线课程，以扩大人脉网络并获取前沿信息。'
      })
    }, 2000)
  })
}

// HTTP API调用 - AI职业分析
export function getProfessionAnalysis(data: CareerAnalysisForm) {
  return request<CareerAnalysisResult>({
    url: '/ai/professionAnalysis',
    method: 'post',
    data
  })
}

// HTTP API调用 - AI职业发展规划
export function getProfessionRoadmap(data: CareerRoadmapForm) {
  return request<CareerRoadmapResult>({
    url: '/ai/professionRoadmap',
    method: 'post',
    data
  })
}

// HTTP API调用 - AI职业推荐
export function getProfessionRecommendation(data: CareerRecommendationForm) {
  return request<CareerRecommendationResult>({
    url: '/ai/professionRecommendation',
    method: 'post',
    data
  })
}
