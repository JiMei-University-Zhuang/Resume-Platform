<template>
  <div class="learning-plan-container">
    <h1 class="page-title">个人学习计划</h1>

    <div class="plan-header">
      <div class="selected-career" v-if="selectedCareer">
        <h2>{{ selectedCareer.title }} 学习规划</h2>
        <div class="career-match">匹配度: {{ selectedCareer.matchScore }}%</div>
      </div>
      <div class="no-career" v-else>
        <div class="placeholder-message">
          请先从<router-link to="/career-planning/map">职业星图</router-link>选择一个职业
        </div>
      </div>
    </div>

    <div class="plan-content" v-if="selectedCareer">
      <div class="plan-section">
        <h3>关键学习目标</h3>
        <div class="key-objectives">
          <div class="objective-item" v-for="(objective, index) in learningObjectives" :key="index">
            <div class="objective-icon">{{ index + 1 }}</div>
            <div class="objective-details">
              <div class="objective-title">{{ objective.title }}</div>
              <div class="objective-description">{{ objective.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="plan-section">
        <h3>技能提升路径</h3>
        <div class="skill-path">
          <div class="timeline">
            <div
              class="timeline-item"
              v-for="(phase, index) in learningPath"
              :key="index"
              :class="{ active: index === currentPhase }"
            >
              <div class="timeline-phase">{{ phase.phase }}</div>
              <div class="timeline-content">
                <div class="phase-title">{{ phase.title }}</div>
                <div class="phase-duration">{{ phase.duration }}</div>
                <div class="phase-skills">
                  <div class="skill-tag" v-for="skill in phase.skills" :key="skill">
                    {{ skill }}
                  </div>
                </div>
                <div class="phase-description">{{ phase.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="plan-section">
        <h3>推荐学习资源</h3>
        <div class="resources-list">
          <div class="resource-item" v-for="(resource, index) in learningResources" :key="index">
            <div class="resource-type">{{ resource.type }}</div>
            <div class="resource-details">
              <div class="resource-title">{{ resource.title }}</div>
              <div class="resource-info">{{ resource.info }}</div>
            </div>
            <div class="resource-difficulty">{{ resource.difficulty }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Career } from './utils/careerMapData'

const route = useRoute()
const selectedCareer = ref<Career | null>(null)
const currentPhase = ref(0)

// 各职业对应的学习计划数据
type CareerPlanId = '1' | '2' | '3' | '4' | '5' | '6'
interface CareerPlanData {
  objectives: Array<{ title: string; description: string }>
  path: Array<{
    phase: string
    title: string
    duration: string
    skills: string[]
    description: string
  }>
  resources: Array<{
    type: string
    title: string
    info: string
    difficulty: string
  }>
}

const careerPlans: Record<CareerPlanId, CareerPlanData> = {
  // 前端开发工程师
  '1': {
    objectives: [
      {
        title: '掌握核心前端技术栈',
        description: '精通HTML5/CSS3/JavaScript(ES6+)，掌握主流框架如Vue.js或React'
      },
      {
        title: '构建用户体验良好的界面',
        description: '学习UI/UX设计原则，能够实现响应式、美观且易用的界面'
      },
      {
        title: '前端性能优化',
        description: '掌握前端性能优化技术，提升网站加载速度和用户体验'
      }
    ],
    path: [
      {
        phase: '1',
        title: '前端基础',
        duration: '2-3个月',
        skills: ['HTML5', 'CSS3', 'JavaScript基础'],
        description: '掌握网页开发的核心语言，理解DOM操作和网页渲染原理'
      },
      {
        phase: '2',
        title: '前端框架',
        duration: '3-4个月',
        skills: ['Vue.js', 'React', 'TypeScript'],
        description: '学习主流前端框架，了解组件化、状态管理和路由'
      },
      {
        phase: '3',
        title: '工程化与进阶',
        duration: '2-3个月',
        skills: ['Webpack', 'Vite', 'Jest'],
        description: '掌握前端工程化工具和测试方法，提高代码质量和开发效率'
      },
      {
        phase: '4',
        title: '实战项目',
        duration: '3-4个月',
        skills: ['项目实践', 'UI框架', '性能优化'],
        description: '完成多个实战项目，积累实际经验和作品集'
      }
    ],
    resources: [
      {
        type: '在线课程',
        title: '现代JavaScript教程',
        info: '全面且深入的JavaScript学习资源，从基础到高级',
        difficulty: '入门-高级'
      },
      {
        type: '技术书籍',
        title: '深入浅出React',
        info: '从基础概念到高级应用，全面介绍React开发',
        difficulty: '中级'
      },
      {
        type: '实践项目',
        title: '个人作品集网站',
        info: '使用现代前端技术栈构建一个展示自己作品的网站',
        difficulty: '中级'
      },
      {
        type: '社区资源',
        title: 'MDN Web Docs',
        info: '最全面的Web开发文档和教程',
        difficulty: '入门-高级'
      }
    ]
  },

  // 后端开发工程师
  '2': {
    objectives: [
      {
        title: '掌握服务器端编程',
        description: '精通至少一种后端语言(Java/Python/Go等)及其生态系统'
      },
      {
        title: '数据库设计与优化',
        description: '学习关系型和NoSQL数据库，掌握数据建模和性能调优技巧'
      },
      {
        title: '系统架构与API设计',
        description: '理解分布式系统架构，能设计高性能、安全的REST/GraphQL API'
      }
    ],
    path: [
      {
        phase: '1',
        title: '后端基础',
        duration: '3-4个月',
        skills: ['Java/Python/Go', '算法与数据结构', 'Linux基础'],
        description: '掌握后端编程语言基础，学习常用算法和数据结构'
      },
      {
        phase: '2',
        title: '数据库与Web服务',
        duration: '3-4个月',
        skills: ['MySQL/PostgreSQL', 'Redis', 'Spring Boot/Django/Gin'],
        description: '学习关系型数据库和缓存技术，掌握Web框架开发'
      },
      {
        phase: '3',
        title: '系统设计',
        duration: '4-5个月',
        skills: ['分布式系统', '消息队列', 'Docker'],
        description: '学习高并发系统设计，理解容器化和微服务架构'
      },
      {
        phase: '4',
        title: '高级主题',
        duration: '持续学习',
        skills: ['Kubernetes', '系统监控', '安全最佳实践'],
        description: '深入云原生技术，学习系统监控和安全防护'
      }
    ],
    resources: [
      {
        type: '在线课程',
        title: 'Spring Boot实战',
        info: '从零开始学习Spring Boot框架开发企业级应用',
        difficulty: '中级'
      },
      {
        type: '技术书籍',
        title: '数据密集型应用系统设计',
        info: '讲解大规模分布式系统设计的原理和实践',
        difficulty: '高级'
      },
      {
        type: '实践项目',
        title: '微服务博客平台',
        info: '实现一个基于微服务架构的博客发布平台',
        difficulty: '中高级'
      },
      {
        type: '社区资源',
        title: 'Stack Overflow',
        info: '解决开发中遇到的各种问题的最佳社区',
        difficulty: '不限'
      }
    ]
  },

  // 全栈开发工程师
  '3': {
    objectives: [
      {
        title: '全栈技术精通',
        description: '同时掌握前端和后端技术，能够独立完成完整应用开发'
      },
      {
        title: '构建端到端项目',
        description: '完成2-3个全栈项目，展示技术能力和解决问题的能力'
      },
      {
        title: '理解DevOps流程',
        description: '熟悉持续集成/持续部署流程，具备基础运维能力'
      }
    ],
    path: [
      {
        phase: '1',
        title: '基础夯实',
        duration: '2-3个月',
        skills: ['HTML/CSS', 'JavaScript', '计算机基础'],
        description: '巩固编程基础知识，了解Web开发核心概念'
      },
      {
        phase: '2',
        title: '前后端框架学习',
        duration: '4-5个月',
        skills: ['React/Vue', 'Node.js', 'Express/Nest.js'],
        description: '掌握主流前端框架和Node.js后端开发'
      },
      {
        phase: '3',
        title: '数据库与API',
        duration: '3-4个月',
        skills: ['MongoDB/MySQL', 'RESTful API', 'GraphQL'],
        description: '学习数据库和API设计，实现前后端数据交互'
      },
      {
        phase: '4',
        title: '全栈项目实战',
        duration: '4-6个月',
        skills: ['全栈应用', 'Docker', 'CI/CD'],
        description: '通过实际项目应用所学知识，掌握部署和运维技能'
      }
    ],
    resources: [
      {
        type: '在线课程',
        title: 'Web全栈开发实战',
        info: '覆盖前后端开发的完整课程，包含实战项目',
        difficulty: '中级'
      },
      {
        type: '技术书籍',
        title: 'JavaScript高级程序设计',
        info: 'JavaScript必读经典，深入理解语言核心',
        difficulty: '中高级'
      },
      {
        type: '实践项目',
        title: '电商平台开发',
        info: '从零构建一个完整的电商平台，包含用户管理、商品展示、购物车、订单系统等功能',
        difficulty: '中高级'
      },
      {
        type: '技术社区',
        title: 'GitHub开源项目',
        info: '参与受欢迎的开源项目，提交PR，与其他开发者协作',
        difficulty: '中高级'
      }
    ]
  },

  // 数据分析师
  '4': {
    objectives: [
      {
        title: '掌握数据分析技能',
        description: '精通数据处理、可视化和统计分析方法'
      },
      {
        title: '数据洞察和业务理解',
        description: '将数据分析结果转化为业务决策支持和有价值的洞察'
      },
      {
        title: '建立数据分析项目集',
        description: '完成多个真实场景的数据分析项目，展示解决实际问题的能力'
      }
    ],
    path: [
      {
        phase: '1',
        title: '数据分析基础',
        duration: '2-3个月',
        skills: ['Excel高级技巧', 'SQL', '统计学基础'],
        description: '掌握基础数据处理工具和统计学知识'
      },
      {
        phase: '2',
        title: '数据分析工具',
        duration: '3-4个月',
        skills: ['Python', 'Pandas', 'NumPy'],
        description: '学习Python数据分析生态系统，掌握数据处理和清洗技巧'
      },
      {
        phase: '3',
        title: '数据可视化',
        duration: '2-3个月',
        skills: ['Matplotlib', 'Seaborn', 'Tableau'],
        description: '学习数据可视化工具和技巧，提高数据展示能力'
      },
      {
        phase: '4',
        title: '高级分析与项目实战',
        duration: '4-5个月',
        skills: ['A/B测试', '业务分析', '预测建模'],
        description: '应用统计方法解决实际业务问题，完成端到端分析项目'
      }
    ],
    resources: [
      {
        type: '在线课程',
        title: 'Python数据科学与分析',
        info: '从零开始学习Python进行数据处理和分析',
        difficulty: '入门-中级'
      },
      {
        type: '技术书籍',
        title: '深入浅出数据分析',
        info: '通过实例讲解数据分析的核心概念和方法',
        difficulty: '入门-中级'
      },
      {
        type: '实践项目',
        title: '电商销售数据分析',
        info: '分析电商平台的销售数据，发现趋势和优化机会',
        difficulty: '中级'
      },
      {
        type: '数据资源',
        title: 'Kaggle竞赛平台',
        info: '参与数据科学竞赛，解决真实世界的问题',
        difficulty: '中高级'
      }
    ]
  },

  // 产品经理
  '5': {
    objectives: [
      {
        title: '理解用户需求和体验',
        description: '学习用户研究方法，能够识别并解决用户痛点'
      },
      {
        title: '产品规划与管理',
        description: '掌握产品生命周期管理，能够制定和执行产品策略'
      },
      {
        title: '跨团队协作',
        description: '提升与设计、开发和市场团队的有效协作能力'
      }
    ],
    path: [
      {
        phase: '1',
        title: '产品思维培养',
        duration: '2-3个月',
        skills: ['用户思维', '产品分析', '市场研究'],
        description: '培养产品思维，学习分析现有产品和市场'
      },
      {
        phase: '2',
        title: '需求和原型',
        duration: '3-4个月',
        skills: ['用户研究', '需求分析', 'PRD编写'],
        description: '学习用户研究方法，掌握需求文档和产品原型设计'
      },
      {
        phase: '3',
        title: '产品管理实践',
        duration: '4-5个月',
        skills: ['敏捷方法', '项目管理', '数据分析'],
        description: '学习产品开发流程管理和迭代优化方法'
      },
      {
        phase: '4',
        title: '产品策略与创新',
        duration: '持续学习',
        skills: ['商业模式', '增长策略', '产品创新'],
        description: '深入学习产品战略规划和创新方法'
      }
    ],
    resources: [
      {
        type: '在线课程',
        title: '产品经理实战课程',
        info: '从零到一全面学习产品经理所需的知识和技能',
        difficulty: '入门-中级'
      },
      {
        type: '行业书籍',
        title: '启示录：打造用户喜爱的产品',
        info: '产品管理经典著作，介绍如何创造成功的产品',
        difficulty: '中级'
      },
      {
        type: '实践项目',
        title: '产品改进方案',
        info: '选择一个现有产品，分析并提出完整的改进方案',
        difficulty: '中级'
      },
      {
        type: '社区资源',
        title: 'Product Hunt',
        info: '了解最新产品动态，学习成功产品的特点',
        difficulty: '入门'
      }
    ]
  },

  // 机器学习工程师
  '6': {
    objectives: [
      {
        title: '掌握机器学习算法',
        description: '理解并应用各类机器学习和深度学习算法'
      },
      {
        title: '数据处理与特征工程',
        description: '学习数据预处理和特征选择方法，提高模型性能'
      },
      {
        title: '模型部署与工程化',
        description: '掌握模型训练、评估和生产环境部署的完整流程'
      }
    ],
    path: [
      {
        phase: '1',
        title: '数学与编程基础',
        duration: '3-4个月',
        skills: ['Python', '线性代数', '概率统计'],
        description: '强化数学基础和Python编程能力'
      },
      {
        phase: '2',
        title: '机器学习基础',
        duration: '4-5个月',
        skills: ['Scikit-learn', '监督学习', '非监督学习'],
        description: '学习经典机器学习算法和库的使用'
      },
      {
        phase: '3',
        title: '深度学习',
        duration: '4-6个月',
        skills: ['PyTorch/TensorFlow', '神经网络', 'CNN/RNN'],
        description: '学习深度学习框架和常用模型架构'
      },
      {
        phase: '4',
        title: '高级主题与工程化',
        duration: '5-6个月',
        skills: ['MLOps', '模型部署', '强化学习'],
        description: '学习模型部署、监控和高级算法'
      }
    ],
    resources: [
      {
        type: '在线课程',
        title: '深度学习专项课程',
        info: '系统学习深度学习理论和实践',
        difficulty: '中高级'
      },
      {
        type: '技术书籍',
        title: '动手学深度学习',
        info: '通过代码实践学习深度学习原理和应用',
        difficulty: '中级'
      },
      {
        type: '实践项目',
        title: '图像识别系统',
        info: '构建一个端到端的图像识别系统，包括模型训练和部署',
        difficulty: '中高级'
      },
      {
        type: '竞赛平台',
        title: 'Kaggle竞赛',
        info: '参与数据科学竞赛，提升实战能力',
        difficulty: '中高级'
      }
    ]
  }
}

// 默认前端工程师学习计划(兼容之前的代码)
const learningObjectives = ref(careerPlans['1'].objectives)
const learningPath = ref(careerPlans['1'].path)
const learningResources = ref(careerPlans['1'].resources)

onMounted(() => {
  const careerId = route.query.careerId as string

  if (careerId) {
    // 根据careerId获取对应的职业信息
    const careerPlan = careerPlans[careerId as CareerPlanId]

    if (careerPlan) {
      // 更新学习计划数据
      learningObjectives.value = careerPlan.objectives
      learningPath.value = careerPlan.path
      learningResources.value = careerPlan.resources
    }

    // 修复类型转换问题，明确指定Career类型的所有必要字段
    // 这里仅模拟一些基本信息，实际项目中应该从API获取完整数据
    selectedCareer.value = {
      id: careerId,
      name: getCareerTitle(careerId),
      title: getCareerTitle(careerId),
      matchScore: getMatchScore(careerId),
      trend: 15,
      salaryRange: getSalaryRange(careerId),
      requiredSkills: [],
      description: getCareerDescription(careerId),
      skills: [],
      position: { x: 0, y: 0 }
    } as Career
  }
})

// 根据职业ID获取职业标题
function getCareerTitle(careerId: string): string {
  const titles = {
    '1': '前端开发工程师',
    '2': '后端开发工程师',
    '3': '全栈工程师',
    '4': '数据分析师',
    '5': '产品经理',
    '6': '机器学习工程师'
  }
  return titles[careerId as keyof typeof titles] || '未知职业'
}

// 获取职业描述
function getCareerDescription(careerId: string): string {
  const descriptions = {
    '1': '负责开发用户界面和交互体验，使用现代前端框架构建响应式网站和应用程序。',
    '2': '负责设计和实现服务器端逻辑，数据库交互，以及API开发，确保应用程序的安全性和性能。',
    '3': '同时负责前端和后端开发，能够从用户界面到服务器逻辑进行全方位开发。',
    '4': '通过分析数据，提取洞察和趋势，帮助企业做出数据驱动的决策。',
    '5': '负责定义产品需求，确定产品功能和路线图，并与开发团队协作实现产品愿景。',
    '6': '开发和实现机器学习模型和算法，解决复杂的数据问题。'
  }
  return descriptions[careerId as keyof typeof descriptions] || '暂无描述'
}

// 获取薪资范围
function getSalaryRange(careerId: string): string {
  const salaryRanges = {
    '1': '15k-25k',
    '2': '18k-28k',
    '3': '20k-35k',
    '4': '15k-25k',
    '5': '18k-30k',
    '6': '25k-45k'
  }
  return salaryRanges[careerId as keyof typeof salaryRanges] || '薪资待定'
}

// 获取匹配度(模拟数据)
function getMatchScore(careerId: string): number {
  const scores = {
    '1': 85,
    '2': 78,
    '3': 82,
    '4': 65,
    '5': 60,
    '6': 55
  }
  return scores[careerId as keyof typeof scores] || 50
}
</script>

<style scoped>
.learning-plan-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(180deg, rgba(23, 28, 49, 0.5) 0%, rgba(23, 28, 49, 0.3) 100%);
  min-height: calc(100vh - 100px);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.page-title {
  font-size: 32px;
  margin-bottom: 32px;
  text-align: center;
  font-weight: 700;
  letter-spacing: 1px;
  background: linear-gradient(135deg, #5e9eff, #83a4ff, #9f7bff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(89, 131, 255, 0.3);
  position: relative;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, #5e9eff, #9f7bff);
  border-radius: 3px;
}

.plan-header {
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(135deg, rgba(32, 41, 75, 0.8), rgba(39, 55, 107, 0.6));
  border-radius: 14px;
  border: 1px solid rgba(89, 131, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.plan-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3498db, #5983ff, #7a61ff);
  border-radius: 3px 3px 0 0;
}

.selected-career h2 {
  font-size: 28px;
  margin-bottom: 12px;
  color: #ffffff;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.career-match {
  font-size: 18px;
  color: #4cd964;
  font-weight: 500;
  display: inline-block;
  padding: 5px 12px;
  background: rgba(76, 217, 100, 0.15);
  border-radius: 20px;
  border: 1px solid rgba(76, 217, 100, 0.3);
}

.no-career {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.placeholder-message {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
}

.placeholder-message a {
  color: #5e9eff;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(94, 158, 255, 0.1);
}

.placeholder-message a:hover {
  color: #ffffff;
  background: rgba(94, 158, 255, 0.3);
  text-decoration: none;
}

.plan-section {
  margin-bottom: 40px;
  background: linear-gradient(135deg, rgba(32, 41, 75, 0.6), rgba(39, 55, 107, 0.4));
  border-radius: 14px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

.plan-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(89, 131, 255, 0.2);
}

.plan-section h3 {
  font-size: 22px;
  margin-bottom: 24px;
  color: #ffffff;
  position: relative;
  padding-left: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  display: inline-block;
}

.plan-section h3::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 24px;
  background: linear-gradient(to bottom, #3498db, #5983ff);
  border-radius: 3px;
}

/* Key Objectives Styles */
.key-objectives {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.objective-item {
  display: flex;
  gap: 18px;
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.15), rgba(89, 131, 255, 0.08));
  border-radius: 14px;
  padding: 20px;
  transition: all 0.3s;
  border: 1px solid rgba(89, 131, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.objective-item:hover {
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.2), rgba(89, 131, 255, 0.12));
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(89, 131, 255, 0.3);
}

.objective-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #3498db, #5983ff);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 18px;
  box-shadow: 0 4px 10px rgba(89, 131, 255, 0.4);
}

.objective-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.95);
}

.objective-description {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

/* Timeline Styles */
.timeline {
  position: relative;
  padding-left: 40px;
  margin-top: 15px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 19px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, rgba(89, 131, 255, 0.7), rgba(89, 131, 255, 0.1));
  border-radius: 1px;
}

.timeline-item {
  position: relative;
  margin-bottom: 40px;
  padding-bottom: 20px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-phase {
  position: absolute;
  left: -40px;
  top: 0;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #29323c, #485563);
  border: 2px solid #5983ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  z-index: 1;
  box-shadow:
    0 0 0 5px rgba(89, 131, 255, 0.1),
    0 4px 10px rgba(0, 0, 0, 0.2);
}

.timeline-content {
  background: linear-gradient(135deg, rgba(40, 50, 85, 0.6), rgba(52, 65, 107, 0.4));
  border-radius: 14px;
  padding: 20px;
  margin-left: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(89, 131, 255, 0.15);
  transition: all 0.3s ease;
}

.timeline-content:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transform: translateX(4px);
}

.phase-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #ffffff;
}

.phase-duration {
  font-size: 15px;
  color: rgba(224, 224, 255, 0.8);
  margin-bottom: 14px;
  display: inline-block;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}

.phase-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
}

.skill-tag {
  background: linear-gradient(135deg, rgba(89, 131, 255, 0.2), rgba(89, 131, 255, 0.3));
  border: 1px solid rgba(89, 131, 255, 0.4);
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(89, 131, 255, 0.2);
  transition: all 0.2s ease;
}

.skill-tag:hover {
  background: linear-gradient(135deg, rgba(89, 131, 255, 0.3), rgba(89, 131, 255, 0.4));
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(89, 131, 255, 0.3);
}

.phase-description {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.5;
}

/* Active timeline item */
.timeline-item.active .timeline-phase {
  background: linear-gradient(135deg, #3498db, #5983ff);
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow:
    0 0 15px rgba(89, 131, 255, 0.6),
    0 0 0 8px rgba(89, 131, 255, 0.2);
}

.timeline-item.active .timeline-content {
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.2), rgba(89, 131, 255, 0.1));
  border: 1px solid rgba(89, 131, 255, 0.3);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* Resources Styles */
.resources-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.resource-item {
  display: flex;
  background: linear-gradient(135deg, rgba(40, 50, 85, 0.6), rgba(52, 65, 107, 0.4));
  border-radius: 14px;
  padding: 20px;
  transition: all 0.3s;
  border: 1px solid rgba(89, 131, 255, 0.15);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.resource-item:hover {
  background: linear-gradient(135deg, rgba(40, 50, 85, 0.7), rgba(52, 65, 107, 0.5));
  transform: translateX(6px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(89, 131, 255, 0.25);
}

.resource-type {
  min-width: 110px;
  padding: 6px 14px;
  background: linear-gradient(135deg, #3498db, #5983ff);
  border-radius: 30px;
  color: white;
  font-size: 15px;
  font-weight: 500;
  text-align: center;
  align-self: flex-start;
  box-shadow: 0 4px 10px rgba(89, 131, 255, 0.3);
}

.resource-details {
  flex-grow: 1;
  margin: 0 20px;
}

.resource-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #ffffff;
}

.resource-info {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.resource-difficulty {
  align-self: center;
  font-size: 14px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.9);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .key-objectives {
    grid-template-columns: 1fr;
  }

  .plan-section {
    padding: 20px;
  }

  .timeline {
    padding-left: 30px;
  }

  .timeline-phase {
    left: -30px;
    width: 30px;
    height: 30px;
    font-size: 12px;
  }

  .resource-item {
    flex-direction: column;
    gap: 15px;
  }

  .resource-type {
    align-self: flex-start;
  }

  .resource-details {
    margin: 0;
  }

  .resource-difficulty {
    align-self: flex-start;
  }
}
</style>
