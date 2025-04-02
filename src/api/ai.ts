import request from '@/utils/request'
import type {
  CareerAnalysisForm,
  CareerAnalysisResult,
  CareerRoadmapForm,
  CareerRoadmapResult,
  CareerRecommendationForm,
  CareerRecommendationResult
} from '@/types/career'

// 职业分析 - 根据用户的教育背景、技能和兴趣分析适合的职业
export function getProfessionAnalysis(data: CareerAnalysisForm) {
  // 开发环境使用mock数据
  if (import.meta.env.DEV) {
    return new Promise<{data: CareerAnalysisResult}>(resolve => {
      setTimeout(() => {
        resolve({
          data: {
            recommendedCareer: "人工智能工程师",
            suitabilityScore: 85,
            strengths: [
              "编程开发能力强",
              "数据分析经验"
            ],
            weaknesses: [
              "可能缺乏特定领域的人工智能项目经验",
              "对最新AI技术的掌握程度未知"
            ],
            advantages: "该用户拥有计算机科学本科背景，加上三年的工作经验，特别是在编程开发和数据分析方面有着扎实的基础。这些技能对于成为一名优秀的人工智能工程师来说至关重要。此外，他对人工智能的兴趣表明了他愿意在这个领域内深入学习和发展。",
            suggestions: "为了进一步提高在人工智能领域的竞争力，建议加强机器学习、深度学习等核心技术的学习，并尝试参与更多实际项目以积累实践经验。同时，关注行业动态和技术趋势也非常重要，可以通过参加在线课程、研讨会等方式来实现这一点。",
            relatedCareers: [
              "数据科学家",
              "机器学习工程师"
            ]
          }
        })
      }, 1500)
    })
  }
  
  // 生产环境使用真实请求
  return request<CareerAnalysisResult>({
    url: '/ai/professionAnalysis',
    method: 'post',
    data
  })
}

// 职业发展规划 - 从当前职位到目标职位的发展路径
export function getProfessionRoadmap(data: CareerRoadmapForm) {
  // 开发环境使用mock数据
  if (import.meta.env.DEV) {
    return new Promise<{data: CareerRoadmapResult}>(resolve => {
      setTimeout(() => {
        resolve({
          data: {
            targetPosition: "技术总监",
            currentLevel: "高级开发工程师",
            timelineYears: 5,
            milestones: [
              {
                stage: 1,
                title: "架构师",
                duration: "2年",
                tasks: [
                  "深入参与系统架构设计与优化",
                  "领导或参与重要项目的技术选型和方案制定",
                  "指导初级到中级开发者"
                ],
                skillsToAcquire: [
                  "云原生架构设计",
                  "大规模分布式系统管理"
                ]
              },
              {
                stage: 2,
                title: "高级架构师/技术经理",
                duration: "3年",
                tasks: [
                  "负责多个项目的整体技术规划",
                  "团队管理和人才培养",
                  "跨部门沟通协作，推动技术创新"
                ],
                skillsToAcquire: [
                  "敏捷开发流程管理",
                  "产品思维",
                  "领导力与团队建设"
                ]
              }
            ],
            recommendations: [
              "积极寻找机会参与到更广泛的项目中去，尤其是那些能够锻炼你架构设计能力的项目。",
              "加强与行业内其他专业人士的交流，比如参加相关的技术论坛、会议等，以拓宽视野并建立人脉。",
              "考虑获取相关认证（如AWS Certified Solutions Architect, CNCF Kubernetes Administrator）来证明你的专业水平。",
              "主动承担更多责任，比如带领小团队完成特定任务，以此积累管理经验。",
              "持续关注最新的技术趋势和发展方向，特别是云计算、容器化等领域的新进展。"
            ]
          }
        })
      }, 1500)
    })
  }

  // 生产环境使用真实请求
  return request<CareerRoadmapResult>({
    url: '/ai/professionRoadmap',
    method: 'post',
    data
  })
}

// 职业推荐 - 基于用户技能和兴趣推荐合适的职业
export function getProfessionRecommendation(data: CareerRecommendationForm) {
  // 开发环境使用mock数据
  if (import.meta.env.DEV) {
    return new Promise<{data: CareerRecommendationResult}>(resolve => {
      setTimeout(() => {
        resolve({
          data: {
            topRecommendations: [
              {
                title: "数据科学家",
                matchScore: 85,
                description: "负责利用大数据技术分析金融市场的趋势，通过机器学习模型预测市场变化，为公司决策提供支持。",
                requiredSkills: [
                  "数据分析",
                  "Python编程",
                  "统计学知识",
                  "机器学习"
                ],
                averageSalary: "20,000-35,000元/月",
                growthProspect: "随着金融科技行业的快速发展，对于能够结合最新AI技术和金融市场洞察力的专业人才需求日益增长。",
                workLifeBalance: "良好。许多企业支持灵活的工作安排，包括远程工作选项。"
              },
              {
                title: "量化分析师",
                matchScore: 78,
                description: "专注于开发和实施复杂的数学模型来帮助金融机构做出投资决策。需要深入理解金融市场运作机制以及强大的编程能力。",
                requiredSkills: [
                  "Python编程",
                  "统计学",
                  "金融工程"
                ],
                averageSalary: "18,000-30,000元/月",
                growthProspect: "量化交易领域持续扩张，特别是当更多机构寻求自动化其投资策略时。",
                workLifeBalance: "中等至良好。虽然可能面临项目截止日期的压力，但大多数公司都提倡健康的工作与生活平衡文化。"
              }
            ],
            industryTrends: [
              {
                industry: "金融科技",
                growthRate: "年均增长约20%",
                description: "金融科技行业正在经历前所未有的增长期，特别是在支付解决方案、区块链应用及智能投顾等领域。该领域不断吸引着大量投资，并且对具备跨学科背景的人才有着强烈的需求。"
              }
            ],
            careerAdvice: "鉴于您在数据分析、Python编程及统计学方面的坚实基础，加上对人工智能的兴趣，建议进一步深化在特定领域的专业知识（如自然语言处理或深度学习），这将有助于提升您的竞争力。同时，保持对最新金融科技动态的关注，积极参与相关社区活动或在线课程，以扩大人脉网络并获取前沿信息。"
          }
        })
      }, 1500)
    })
  }

  // 生产环境使用真实请求
  return request<CareerRecommendationResult>({
    url: '/ai/professionRecommendation',
    method: 'post',
    data
  })
}

// 以下是原始的mock函数，可以删除或保留用于参考
/* 
export const mockProfessionAnalysis = async (data: CareerAnalysisForm): Promise<CareerAnalysisResult> => {
  console.log('模拟AI职业分析API调用：', data)
  // 模拟API响应延迟
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        recommendedCareer: "人工智能工程师",
        suitabilityScore: 85,
        strengths: [
          "编程开发能力强",
          "数据分析经验"
        ],
        weaknesses: [
          "可能缺乏特定领域的人工智能项目经验",
          "对最新AI技术的掌握程度未知"
        ],
        advantages: "该用户拥有计算机科学本科背景，加上三年的工作经验，特别是在编程开发和数据分析方面有着扎实的基础。这些技能对于成为一名优秀的人工智能工程师来说至关重要。此外，他对人工智能的兴趣表明了他愿意在这个领域内深入学习和发展。",
        suggestions: "为了进一步提高在人工智能领域的竞争力，建议加强机器学习、深度学习等核心技术的学习，并尝试参与更多实际项目以积累实践经验。同时，关注行业动态和技术趋势也非常重要，可以通过参加在线课程、研讨会等方式来实现这一点。",
        relatedCareers: [
          "数据科学家",
          "机器学习工程师"
        ]
      })
    }, 2000)
  })
}
*/ 