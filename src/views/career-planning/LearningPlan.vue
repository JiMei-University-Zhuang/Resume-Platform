<template>
  <div class="learning-plan">
    <div class="star-background">
      <div
        v-for="i in 100"
        :key="`star-${i}`"
        class="star"
        :style="{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 3 + 1}px`,
          height: `${Math.random() * 3 + 1}px`,
          animationDelay: `${Math.random() * 5}s`
        }"
      ></div>
      <div
        v-for="i in 20"
        :key="`line-${i}`"
        class="constellation-line"
        :style="{
          left: `${Math.random() * 90}%`,
          top: `${Math.random() * 90}%`,
          width: `${Math.random() * 100 + 50}px`,
          transform: `rotate(${Math.random() * 360}deg)`,
          animationDelay: `${Math.random() * 3}s`
        }"
      ></div>
    </div>

    <div v-if="!selectedCareer" class="no-career">
      <div class="stars-background">
        <div
          v-for="i in 100"
          :key="`empty-star-${i}`"
          class="star"
          :style="{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            animationDelay: `${Math.random() * 5}s`
          }"
        ></div>
      </div>

      <div class="constellation">
        <!-- 模拟星座连线 -->
        <div
          v-for="i in 15"
          :key="`c-line-${i}`"
          class="c-line"
          :style="{
            left: `${30 + Math.random() * 40}%`,
            top: `${30 + Math.random() * 40}%`,
            width: `${Math.random() * 80 + 20}px`,
            transform: `rotate(${Math.random() * 360}deg)`,
            '--i': i
          }"
        ></div>
        <div
          v-for="i in 10"
          :key="`c-star-${i}`"
          class="c-star"
          :style="{
            left: `${35 + Math.random() * 30}%`,
            top: `${35 + Math.random() * 30}%`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            '--i': i
          }"
        ></div>
      </div>

      <div class="orbit"></div>
      <div class="orbit"></div>
      <div class="orbit"></div>

      <div class="tech-circles">
        <div class="circle c1"></div>
        <div class="circle c2"></div>
        <div class="circle c3"></div>
        <div class="circle c4"></div>
      </div>

      <div class="content">
        <div class="grid-background"></div>
        <h2 class="title">探索你的职业学习路径</h2>
        <p class="message">
          请从星图中选择一个职业，查看详细的学习规划和发展路径。你可以在星图中探索各种职业选项，并找到适合自己的发展方向。
        </p>
        <button @click="goToCareers" class="explore-button">探索职业星图</button>
      </div>
    </div>

    <div v-else class="learning-container">
      <div class="header">
        <h1>{{ selectedCareer?.name }}</h1>
        <div class="career-path">
          <span class="icon">
            <IconRocketLaunch :size="16" />
          </span>
          <span>学习路径规划</span>
        </div>
        <button @click="toggleAIAssistant" class="ai-button">
          <span class="icon">
            <IconBrain :size="16" />
          </span>
          <span>AI学习助手</span>
        </button>
      </div>

      <div class="objectives">
        <h2>
          <span class="icon">
            <IconTarget :size="18" />
          </span>
          学习目标
        </h2>
        <div class="objective-list">
          <div
            v-for="(objective, index) in careerPlan.objectives"
            :key="index"
            class="objective-item"
          >
            <div class="title">{{ objective.title }}</div>
            <div class="description">{{ objective.description }}</div>
          </div>
        </div>
      </div>

      <div class="learning-path">
        <h2>
          <span class="icon">
            <IconRoad :size="18" />
          </span>
          学习路径
        </h2>
        <div class="path-timeline">
          <div v-for="phase in careerPlan.path" :key="phase.phase" class="phase">
            <div class="phase-header">
              <div class="phase-number">阶段 {{ phase.phase }}</div>
              <div class="title">{{ phase.title }}</div>
              <div class="duration">{{ phase.duration }}</div>
            </div>
            <div class="description">{{ phase.description }}</div>
            <div class="skills-container">
              <div v-for="(skill, index) in phase.skills" :key="index" class="skill">
                {{ skill }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="resources">
        <h2>
          <span class="icon">
            <IconBook :size="18" />
          </span>
          学习资源
        </h2>
        <div class="resource-grid">
          <div v-for="(resource, index) in careerPlan.resources" :key="index" class="resource-card">
            <div class="resource-type">{{ resource.type }}</div>
            <div class="resource-title">{{ resource.title }}</div>
            <div class="resource-info">{{ resource.info }}</div>
            <div class="resource-difficulty">难度: {{ resource.difficulty }}</div>
          </div>
        </div>
      </div>

      <!-- 个性化学习计划 -->
      <PersonalizedLearningPlan
        :career-name="selectedCareer?.name"
        :user-skills="userSkills"
        :career-skills="careerSkills"
      />
    </div>

    <!-- AI学习规划助手 -->
    <LearningPlanAI
      ref="aiAssistantRef"
      :career-name="selectedCareer?.name"
      :user-skills="userSkills"
      :career-skills="careerSkills"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Career } from './utils/careerMapData'
import IconRocketLaunch from '@/components/icons/IconRocketLaunch.vue'
import IconTarget from '@/components/icons/IconTarget.vue'
import IconRoad from '@/components/icons/IconRoad.vue'
import IconBook from '@/components/icons/IconBook.vue'
import IconBrain from '@/components/icons/IconBrain.vue'
import LearningPlanAI from './components/LearningPlanAI.vue'
import PersonalizedLearningPlan from './components/PersonalizedLearningPlan.vue'

const route = useRoute()
const router = useRouter()
const selectedCareer = ref<Career | null>(null)
const aiAssistantRef = ref(null)

// 各职业对应的学习计划数据
type CareerPlanId =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '20'
  | '21'
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
  },

  // 人工智能研究员
  '7': {
    objectives: [
      {
        title: '深度掌握AI算法理论',
        description: '精通各类机器学习、深度学习理论和前沿算法研究'
      },
      {
        title: '设计创新AI模型',
        description: '能够设计和实现原创性的人工智能模型和解决方案'
      },
      {
        title: '发表高质量研究成果',
        description: '在顶级AI会议和期刊上发表研究论文，推动学术进步'
      }
    ],
    path: [
      {
        phase: '1',
        title: '理论基础强化',
        duration: '4-6个月',
        skills: ['高等数学', '概率论', '凸优化', 'Python科学计算'],
        description: '夯实AI研究所需的数学和理论基础，熟练掌握科学计算工具'
      },
      {
        phase: '2',
        title: '经典算法研究',
        duration: '5-7个月',
        skills: ['机器学习理论', '深度学习基础', '强化学习', '概率图模型'],
        description: '深入研究经典AI算法的理论基础和实现细节，理解其优劣'
      },
      {
        phase: '3',
        title: '前沿领域探索',
        duration: '6-8个月',
        skills: ['大型语言模型', '生成对抗网络', '自监督学习', '神经架构搜索'],
        description: '关注并深入研究AI领域的前沿进展，复现最新论文成果'
      },
      {
        phase: '4',
        title: '研究创新与发表',
        duration: '持续进行',
        skills: ['论文写作', '实验设计', '研究方法论', '开源贡献'],
        description: '提出原创性研究问题，设计实验验证，撰写高质量研究论文'
      }
    ],
    resources: [
      {
        type: '学术课程',
        title: 'CS231n: 深度学习与计算机视觉',
        info: '斯坦福大学经典课程，全面讲解深度学习与视觉算法',
        difficulty: '高级'
      },
      {
        type: '技术书籍',
        title: '深度学习（Ian Goodfellow等著）',
        info: '被誉为深度学习"圣经"，系统介绍理论和应用',
        difficulty: '高级'
      },
      {
        type: '学术资源',
        title: 'arXiv.org',
        info: '最新AI研究论文预印本平台，了解学术前沿',
        difficulty: '研究级'
      },
      {
        type: '实验工具',
        title: 'Weights & Biases',
        info: '实验跟踪和模型调优平台，支持复杂实验设计',
        difficulty: '中高级'
      }
    ]
  },

  // 云计算工程师
  '8': {
    objectives: [
      {
        title: '掌握云服务架构',
        description: '精通主流云平台（AWS/Azure/GCP）的核心服务和架构设计'
      },
      {
        title: '实现云基础设施自动化',
        description: '通过基础设施即代码（IaC）工具实现云资源的自动化部署和管理'
      },
      {
        title: '构建高可用云应用',
        description: '设计和实现具有高可用性、可扩展性和安全性的云原生应用'
      }
    ],
    path: [
      {
        phase: '1',
        title: '云服务基础',
        duration: '3-4个月',
        skills: ['AWS/Azure/GCP基础', 'Linux系统管理', '网络基础'],
        description: '学习主流云平台的核心服务，理解虚拟化和容器技术基础'
      },
      {
        phase: '2',
        title: '云基础设施自动化',
        duration: '4-5个月',
        skills: ['Terraform', 'CloudFormation', 'Ansible', 'Docker'],
        description: '学习基础设施即代码工具，实现云资源的自动化部署和配置'
      },
      {
        phase: '3',
        title: '云原生应用开发',
        duration: '3-4个月',
        skills: ['Kubernetes', '微服务架构', '服务网格', 'CI/CD'],
        description: '掌握容器编排和微服务架构，实现持续集成和部署流程'
      },
      {
        phase: '4',
        title: '云安全和优化',
        duration: '3-4个月',
        skills: ['云安全最佳实践', '成本优化', '性能监控', '高可用架构'],
        description: '学习云环境的安全防护、性能优化和成本控制技术'
      }
    ],
    resources: [
      {
        type: '在线课程',
        title: 'AWS Certified Solutions Architect',
        info: 'AWS官方认证课程，全面介绍云架构设计',
        difficulty: '中级'
      },
      {
        type: '技术书籍',
        title: '云原生模式：设计高可用性云应用',
        info: '详解云原生架构模式和最佳实践',
        difficulty: '中高级'
      },
      {
        type: '实践项目',
        title: '多区域高可用架构部署',
        info: '使用Terraform构建跨区域的高可用应用架构',
        difficulty: '高级'
      },
      {
        type: '社区资源',
        title: 'KubeCon + CloudNativeCon',
        info: '云原生技术社区顶级会议视频和资料',
        difficulty: '中级-高级'
      }
    ]
  },

  // UI/UX设计师
  '9': {
    objectives: [
      {
        title: '掌握设计基础理论',
        description: '精通色彩理论、排版、网格系统和视觉层次结构等设计基础'
      },
      {
        title: '用户体验研究与设计',
        description: '学习用户研究方法，能够设计以用户为中心的交互和界面'
      },
      {
        title: '熟练使用设计工具',
        description: '精通Figma、Adobe XD等主流设计工具，建立完整的设计系统'
      }
    ],
    path: [
      {
        phase: '1',
        title: '设计基础',
        duration: '2-3个月',
        skills: ['设计原则', '色彩理论', '排版', '视觉层次'],
        description: '掌握基本设计理论和原则，培养设计美感和审美能力'
      },
      {
        phase: '2',
        title: '工具与界面设计',
        duration: '3-4个月',
        skills: ['Figma', 'Adobe XD', 'UI组件设计', '响应式设计'],
        description: '学习专业设计工具，掌握界面设计方法和技巧'
      },
      {
        phase: '3',
        title: '用户体验设计',
        duration: '3-4个月',
        skills: ['用户研究', '用户旅程', '原型设计', '可用性测试'],
        description: '学习用户体验设计流程和方法，以用户为中心进行设计'
      },
      {
        phase: '4',
        title: '设计系统与高级主题',
        duration: '4-5个月',
        skills: ['设计系统', '交互设计模式', 'Design Tokens', '动效设计'],
        description: '构建完整的设计系统，掌握高级交互设计技巧'
      }
    ],
    resources: [
      {
        type: '在线课程',
        title: 'UI/UX设计入门到精通',
        info: '涵盖设计基础、工具使用到实际项目的完整课程',
        difficulty: '入门-中级'
      },
      {
        type: '专业书籍',
        title: '设计心理学：日常的设计',
        info: '探讨如何设计出符合人类心理和行为模式的产品',
        difficulty: '中级'
      },
      {
        type: '设计资源',
        title: 'Design System Repo',
        info: '世界顶级公司的设计系统集合和案例研究',
        difficulty: '中高级'
      },
      {
        type: '实践项目',
        title: 'App重设计项目',
        info: '选取一个现有App进行重新设计，改进用户体验',
        difficulty: '中级-高级'
      }
    ]
  },

  // DevOps工程师
  '10': {
    objectives: [
      {
        title: '自动化流程建设',
        description: '构建自动化的开发、测试、部署和监控流程，实现持续集成/持续部署'
      },
      {
        title: '容器化与编排',
        description: '掌握容器技术和容器编排平台，实现应用的高效部署和管理'
      },
      {
        title: '系统监控与故障排除',
        description: '建立完善的监控系统，能够及时发现和解决生产环境中的问题'
      }
    ],
    path: [
      {
        phase: '1',
        title: '系统与网络基础',
        duration: '2-3个月',
        skills: ['Linux基础', '网络协议', 'Shell脚本', 'Git'],
        description: '强化操作系统和网络基础知识，掌握基本自动化脚本编写'
      },
      {
        phase: '2',
        title: '容器与CI/CD',
        duration: '3-4个月',
        skills: ['Docker', 'Jenkins', 'GitLab CI', 'GitHub Actions'],
        description: '学习容器技术和持续集成工具，构建自动化流水线'
      },
      {
        phase: '3',
        title: '编排与云平台',
        duration: '4-5个月',
        skills: ['Kubernetes', 'Helm', 'Terraform', 'AWS/Azure/GCP'],
        description: '掌握容器编排技术和云平台，实现基础设施即代码'
      },
      {
        phase: '4',
        title: '监控与SRE实践',
        duration: '3-4个月',
        skills: ['Prometheus', 'Grafana', 'ELK Stack', '可观测性'],
        description: '学习系统监控和站点可靠性工程实践，提高系统稳定性'
      }
    ],
    resources: [
      {
        type: '在线课程',
        title: 'DevOps工程师完全指南',
        info: '从基础到高级的DevOps实践和工具全面介绍',
        difficulty: '中级'
      },
      {
        type: '技术书籍',
        title: '凤凰项目：一个IT革命的小说',
        info: '通过小说形式讲述DevOps理念和实践的经典之作',
        difficulty: '入门'
      },
      {
        type: '实践项目',
        title: 'CI/CD流水线构建',
        info: '为一个Web应用构建完整的CI/CD流水线，实现自动测试和部署',
        difficulty: '中高级'
      },
      {
        type: '社区资源',
        title: 'DevOps Days大会',
        info: 'DevOps社区最重要的会议，包含大量实践案例和分享',
        difficulty: '不限'
      }
    ]
  },

  // 数据科学家
  '14': {
    objectives: [
      {
        title: '掌握数据科学方法论',
        description: '熟练运用数据科学流程和方法解决复杂问题，从数据获取到模型部署'
      },
      {
        title: '高级机器学习技能',
        description: '精通各类机器学习和深度学习算法，能够针对不同场景选择合适的模型'
      },
      {
        title: '业务价值转化',
        description: '能够将数据分析和模型结果转化为业务价值，支持决策制定'
      }
    ],
    path: [
      {
        phase: '1',
        title: '数据科学基础',
        duration: '3-4个月',
        skills: ['Python', '统计学', '数据处理', 'Pandas', 'NumPy'],
        description: '建立数据科学和统计学基础，掌握数据处理和分析工具'
      },
      {
        phase: '2',
        title: '机器学习基础',
        duration: '4-5个月',
        skills: ['监督学习', '非监督学习', 'Scikit-learn', '特征工程', '模型评估'],
        description: '学习机器学习算法和应用，掌握模型训练和评估方法'
      },
      {
        phase: '3',
        title: '高级机器学习与深度学习',
        duration: '4-6个月',
        skills: ['深度学习', 'TensorFlow/PyTorch', '自然语言处理', '计算机视觉'],
        description: '学习深度学习技术和框架，解决复杂的机器学习问题'
      },
      {
        phase: '4',
        title: '实战项目与模型部署',
        duration: '3-4个月',
        skills: ['大规模数据处理', '模型部署', 'MLOps', '端到端项目'],
        description: '进行实战项目，掌握模型部署和大规模应用的技术'
      }
    ],
    resources: [
      {
        type: '在线课程',
        title: '数据科学与机器学习训练营',
        info: '从统计基础到高级机器学习算法的系统性课程',
        difficulty: '中级-高级'
      },
      {
        type: '技术书籍',
        title: '机器学习实战：基于Scikit-learn和TensorFlow',
        info: '通过实例讲解如何应用机器学习解决实际问题',
        difficulty: '中级'
      },
      {
        type: '实践项目',
        title: '预测分析系统开发',
        info: '开发一个端到端的预测分析系统，包括数据处理、模型训练和部署',
        difficulty: '高级'
      },
      {
        type: '竞赛平台',
        title: 'Kaggle竞赛',
        info: '参与数据科学竞赛，提升实战技能和创新能力',
        difficulty: '中高级'
      }
    ]
  },

  // 网络安全专家
  '15': {
    objectives: [
      {
        title: '掌握安全基础知识',
        description: '全面了解网络安全领域的核心概念、攻防技术和安全框架'
      },
      {
        title: '安全评估与漏洞管理',
        description: '能够进行系统安全评估，发现漏洞并制定有效的修复方案'
      },
      {
        title: '安全架构设计',
        description: '设计和实现安全的网络架构和应用系统，遵循安全最佳实践'
      }
    ],
    path: [
      {
        phase: '1',
        title: '网络安全基础',
        duration: '3-4个月',
        skills: ['网络协议', '操作系统安全', '密码学基础', '安全模型'],
        description: '掌握网络安全的基础知识，理解常见的安全威胁和防护措施'
      },
      {
        phase: '2',
        title: '安全测试与评估',
        duration: '4-5个月',
        skills: ['渗透测试', '漏洞扫描', '安全审计', 'OWASP Top 10'],
        description: '学习安全测试方法和工具，能够发现和评估系统漏洞'
      },
      {
        phase: '3',
        title: '安全防御与监控',
        duration: '3-4个月',
        skills: ['防火墙配置', '入侵检测', 'SIEM', '安全事件响应'],
        description: '学习安全防御技术和安全监控系统的部署与使用'
      },
      {
        phase: '4',
        title: '高级安全技术',
        duration: '4-6个月',
        skills: ['威胁情报', '恶意代码分析', '安全架构', '云安全'],
        description: '掌握高级安全技术和方法，应对复杂的安全挑战'
      }
    ],
    resources: [
      {
        type: '安全认证',
        title: 'CompTIA Security+',
        info: '网络安全基础认证，涵盖核心安全概念和实践',
        difficulty: '入门-中级'
      },
      {
        type: '技术书籍',
        title: '黑客攻防技术宝典：Web实战篇',
        info: '详细介绍Web应用安全测试和防护的经典之作',
        difficulty: '中高级'
      },
      {
        type: '实践平台',
        title: 'HackTheBox',
        info: '提供真实的渗透测试环境，提升实战技能',
        difficulty: '中级-高级'
      },
      {
        type: '社区资源',
        title: 'DEFCON会议',
        info: '全球最大的黑客和安全会议，前沿技术和研究分享',
        difficulty: '不限'
      }
    ]
  },

  // AI产品经理
  '11': {
    objectives: [
      {
        title: '理解AI技术基础',
        description: '掌握人工智能和机器学习的核心概念和应用场景，能与技术团队有效沟通'
      },
      {
        title: 'AI产品规划与管理',
        description: '能够规划和管理AI产品的全生命周期，从构思到上线及迭代'
      },
      {
        title: '数据策略与伦理考量',
        description: '制定有效的数据策略，并将伦理考量融入AI产品的开发过程'
      }
    ],
    path: [
      {
        phase: '1',
        title: '产品管理基础',
        duration: '2-3个月',
        skills: ['产品思维', '需求分析', '用户故事', '敏捷方法论'],
        description: '掌握产品管理的核心方法和技能，建立产品思维'
      },
      {
        phase: '2',
        title: 'AI技术理解',
        duration: '3-4个月',
        skills: ['机器学习基础', 'AI应用场景', '自然语言处理', '计算机视觉'],
        description: '学习AI技术基础知识，理解不同AI技术的应用场景和局限性'
      },
      {
        phase: '3',
        title: 'AI产品规划',
        duration: '3-4个月',
        skills: ['AI产品策略', '数据策略', '模型评估指标', 'AI产品原型'],
        description: '学习AI产品的规划方法，制定数据策略和评估标准'
      },
      {
        phase: '4',
        title: 'AI产品实战',
        duration: '4-5个月',
        skills: ['AI产品落地', '团队协作', 'AI产品迭代', 'AI伦理与合规'],
        description: '通过实际项目应用AI产品管理知识，考虑伦理和合规问题'
      }
    ],
    resources: [
      {
        type: '在线课程',
        title: 'AI产品管理专项课程',
        info: '专为产品经理设计的AI技术和产品管理课程',
        difficulty: '中级'
      },
      {
        type: '行业书籍',
        title: '人工智能产品经理手册',
        info: '详解AI产品的规划、设计和管理的实践指南',
        difficulty: '中级-高级'
      },
      {
        type: '案例研究',
        title: 'AI产品成功案例分析',
        info: '分析市场上成功的AI产品案例，总结经验和教训',
        difficulty: '中级'
      },
      {
        type: '社区资源',
        title: 'AI产品管理论坛',
        info: 'AI产品经理交流社区，分享经验和最佳实践',
        difficulty: '不限'
      }
    ]
  },

  // 游戏开发工程师
  '12': {
    objectives: [
      {
        title: '掌握游戏开发技术',
        description: '精通游戏引擎和编程语言，能够实现复杂的游戏功能和系统'
      },
      {
        title: '游戏设计与用户体验',
        description: '理解游戏设计原则，能够创造有趣且吸引人的游戏体验'
      },
      {
        title: '性能优化与多平台支持',
        description: '掌握游戏性能优化技术，支持多平台发布和运行'
      }
    ],
    path: [
      {
        phase: '1',
        title: '编程基础',
        duration: '3-4个月',
        skills: ['C++/C#', '面向对象编程', '数据结构', '算法基础'],
        description: '掌握游戏开发所需的编程语言和基础知识'
      },
      {
        phase: '2',
        title: '游戏引擎学习',
        duration: '4-5个月',
        skills: ['Unity/Unreal Engine', '2D/3D图形', '物理系统', '动画系统'],
        description: '学习主流游戏引擎，理解游戏开发的核心系统'
      },
      {
        phase: '3',
        title: '游戏系统开发',
        duration: '3-4个月',
        skills: ['游戏逻辑', 'AI系统', '网络多人', '音频系统'],
        description: '学习开发各类游戏系统，实现复杂的游戏功能'
      },
      {
        phase: '4',
        title: '游戏优化与发布',
        duration: '3-4个月',
        skills: ['性能优化', '内存管理', '多平台支持', '发布流程'],
        description: '掌握游戏优化技术，学习游戏的测试和发布流程'
      }
    ],
    resources: [
      {
        type: '在线课程',
        title: 'Unity/Unreal完全指南',
        info: '从基础到高级的游戏引擎使用教程，包含多个实战项目',
        difficulty: '入门-高级'
      },
      {
        type: '技术书籍',
        title: '游戏编程模式',
        info: '介绍游戏开发中常用的设计模式和最佳实践',
        difficulty: '中级'
      },
      {
        type: '实践项目',
        title: '小型游戏开发',
        info: '从头开发一个小型游戏，涵盖所有游戏开发环节',
        difficulty: '中级-高级'
      },
      {
        type: '社区资源',
        title: 'GDC大会资料',
        info: '游戏开发者大会的技术讲座和分享资料',
        difficulty: '中高级'
      }
    ]
  },

  // 云计算架构师
  '13': {
    objectives: [
      {
        title: '掌握云服务架构',
        description: '深入理解各大云平台的服务和架构，能够设计和实现云基础设施'
      },
      {
        title: '云迁移与多云战略',
        description: '能够规划和执行应用系统的云迁移，制定多云和混合云策略'
      },
      {
        title: '云安全与成本优化',
        description: '确保云环境的安全性和合规性，同时优化云资源使用和成本'
      }
    ],
    path: [
      {
        phase: '1',
        title: '云计算基础',
        duration: '3-4个月',
        skills: ['AWS/Azure/GCP服务', '计算资源', '存储服务', '网络配置'],
        description: '全面了解主流云平台的核心服务和基础架构'
      },
      {
        phase: '2',
        title: '云架构设计',
        duration: '4-5个月',
        skills: ['高可用设计', '可扩展架构', '微服务', '无服务器计算'],
        description: '学习云环境下的架构设计原则和最佳实践'
      },
      {
        phase: '3',
        title: '自动化与DevOps',
        duration: '3-4个月',
        skills: ['Terraform', 'CloudFormation', 'CI/CD', '监控与日志'],
        description: '掌握云资源的自动化部署和管理技术，融合DevOps实践'
      },
      {
        phase: '4',
        title: '高级主题',
        duration: '4-5个月',
        skills: ['多云策略', '混合云', '云原生架构', '云迁移'],
        description: '学习高级云架构主题，解决复杂的云计算场景和挑战'
      }
    ],
    resources: [
      {
        type: '认证课程',
        title: 'AWS/Azure解决方案架构师',
        info: '云平台官方认证课程，系统学习云架构设计',
        difficulty: '中高级'
      },
      {
        type: '技术书籍',
        title: '云原生架构设计模式',
        info: '详解云原生环境下的架构模式和最佳实践',
        difficulty: '高级'
      },
      {
        type: '实践项目',
        title: '企业应用云迁移',
        info: '将一个企业级应用迁移到云平台，重构为云原生架构',
        difficulty: '高级'
      },
      {
        type: '技术社区',
        title: 'AWS/Azure架构中心',
        info: '云平台官方提供的架构参考和最佳实践文档',
        difficulty: '中高级'
      }
    ]
  },

  // 区块链开发者
  '16': {
    objectives: [
      {
        title: '掌握区块链基础',
        description: '深入理解区块链技术的工作原理、共识机制和加密算法'
      },
      {
        title: '智能合约开发',
        description: '能够设计和开发安全、高效的智能合约，实现业务逻辑'
      },
      {
        title: '区块链应用架构',
        description: '设计和实现基于区块链的应用系统，解决实际业务问题'
      }
    ],
    path: [
      {
        phase: '1',
        title: '区块链基础',
        duration: '2-3个月',
        skills: ['区块链原理', '密码学', '分布式系统', '共识机制'],
        description: '学习区块链技术的基础知识和理论，理解其工作原理'
      },
      {
        phase: '2',
        title: '智能合约开发',
        duration: '3-4个月',
        skills: ['Solidity', '以太坊', 'Web3.js', '智能合约测试'],
        description: '学习智能合约开发语言和框架，掌握合约开发流程'
      },
      {
        phase: '3',
        title: '区块链应用开发',
        duration: '4-5个月',
        skills: ['DApp开发', '区块链架构', 'IPFS', '去中心化金融'],
        description: '学习开发去中心化应用，理解区块链在不同领域的应用'
      },
      {
        phase: '4',
        title: '高级主题',
        duration: '3-4个月',
        skills: ['区块链扩容', '跨链技术', '隐私保护', '治理机制'],
        description: '探索区块链技术的前沿领域和高级主题'
      }
    ],
    resources: [
      {
        type: '在线课程',
        title: '区块链开发者训练营',
        info: '从区块链基础到DApp开发的系统课程',
        difficulty: '中级'
      },
      {
        type: '技术书籍',
        title: '精通以太坊',
        info: '全面介绍以太坊平台和智能合约开发的权威指南',
        difficulty: '中高级'
      },
      {
        type: '实践项目',
        title: 'NFT交易平台开发',
        info: '开发一个支持NFT铸造和交易的去中心化应用',
        difficulty: '高级'
      },
      {
        type: '开发社区',
        title: 'Ethereum.org开发者资源',
        info: '以太坊官方提供的开发文档、教程和工具',
        difficulty: '不限'
      }
    ]
  },

  // 嵌入式系统工程师
  '21': {
    objectives: [
      {
        title: '掌握嵌入式开发技术',
        description: '精通嵌入式系统的硬件和软件开发，能够设计和实现完整的嵌入式解决方案'
      },
      {
        title: '嵌入式软件优化',
        description: '能够优化嵌入式软件性能，满足实时性、低功耗和资源受限的要求'
      },
      {
        title: '嵌入式系统集成',
        description: '能够将嵌入式系统与外部设备和系统集成，实现完整的应用场景'
      }
    ],
    path: [
      {
        phase: '1',
        title: '嵌入式基础',
        duration: '3-4个月',
        skills: ['C/C++编程', '数字电路', '微控制器原理', '嵌入式Linux'],
        description: '掌握嵌入式开发的基础知识，包括硬件和软件基础'
      },
      {
        phase: '2',
        title: '嵌入式软件开发',
        duration: '4-5个月',
        skills: ['实时操作系统', '驱动开发', '中断处理', '存储管理'],
        description: '学习嵌入式软件开发技术，掌握系统底层编程'
      },
      {
        phase: '3',
        title: '硬件接口与通信',
        duration: '3-4个月',
        skills: ['I2C/SPI/UART', 'USB', '无线通信', '传感器接口'],
        description: '学习各种硬件接口和通信协议，实现设备互联'
      },
      {
        phase: '4',
        title: '嵌入式系统集成',
        duration: '3-4个月',
        skills: ['物联网应用', '系统集成', '安全性', '电源管理'],
        description: '掌握嵌入式系统与外部系统的集成技术，构建完整应用'
      }
    ],
    resources: [
      {
        type: '在线课程',
        title: '嵌入式系统开发实战',
        info: '从基础到高级的嵌入式系统开发完整课程',
        difficulty: '中级'
      },
      {
        type: '技术书籍',
        title: '嵌入式系统设计与实现',
        info: '全面介绍嵌入式系统的设计原则和实现方法',
        difficulty: '中高级'
      },
      {
        type: '开发板',
        title: 'Arduino/树莓派/STM32开发套件',
        info: '适合学习和项目开发的嵌入式硬件平台',
        difficulty: '入门-高级'
      },
      {
        type: '实践项目',
        title: '智能家居控制系统',
        info: '开发一个基于嵌入式技术的智能家居控制系统',
        difficulty: '中高级'
      }
    ]
  },

  // 移动应用开发工程师
  '20': {
    objectives: [
      {
        title: '掌握移动平台开发',
        description: '精通iOS或Android平台的开发技术，能够开发高质量的原生应用'
      },
      {
        title: '跨平台开发能力',
        description: '掌握主流跨平台框架，能够高效开发适用于多平台的应用'
      },
      {
        title: '移动用户体验优化',
        description: '设计并实现流畅、直观的移动应用界面和交互，提升用户体验'
      }
    ],
    path: [
      {
        phase: '1',
        title: '移动开发基础',
        duration: '2-3个月',
        skills: ['Swift/Kotlin', '移动UI基础', '应用生命周期', '基本组件'],
        description: '学习移动平台的开发语言和基础组件，理解应用架构'
      },
      {
        phase: '2',
        title: '高级特性与框架',
        duration: '3-4个月',
        skills: ['数据存储', '网络通信', '地理位置', '推送通知'],
        description: '学习移动应用的高级特性和常用框架，提升开发能力'
      },
      {
        phase: '3',
        title: '跨平台开发',
        duration: '3-4个月',
        skills: ['React Native', 'Flutter', '混合应用', '跨平台架构'],
        description: '学习跨平台开发技术，能够高效开发多平台应用'
      },
      {
        phase: '4',
        title: '应用优化与发布',
        duration: '2-3个月',
        skills: ['性能优化', 'UI/UX优化', '应用安全', '应用发布'],
        description: '学习应用优化技术和发布流程，提升应用质量'
      }
    ],
    resources: [
      {
        type: '在线课程',
        title: 'iOS/Android开发专项课程',
        info: '系统学习移动平台开发技术，从基础到高级',
        difficulty: '入门-高级'
      },
      {
        type: '技术书籍',
        title: '移动应用架构设计模式',
        info: '介绍移动应用开发中的架构模式和最佳实践',
        difficulty: '中级'
      },
      {
        type: '实践项目',
        title: '社交媒体应用开发',
        info: '开发一个包含核心功能的社交媒体应用',
        difficulty: '中高级'
      },
      {
        type: '开发资源',
        title: '移动UI设计套件',
        info: '专为移动应用设计的UI组件和设计资源',
        difficulty: '中级'
      }
    ]
  }
}

// 当前选择的职业
const currentCareer = computed(() => selectedCareer.value)

// 当前职业的学习计划
const careerPlan = computed(() => {
  if (!currentCareer.value)
    return {
      objectives: [],
      path: [],
      resources: []
    }

  return (
    careerPlans[currentCareer.value.id as CareerPlanId] || {
      objectives: [],
      path: [],
      resources: []
    }
  )
})

// 模拟用户技能数据
const userSkills = ref<string[]>(['JavaScript', 'HTML5', 'CSS3', 'React基础', 'Git版本控制'])

// 计算出当前职业需要的技能
const careerSkills = computed(() => {
  if (!currentCareer.value) return []

  // 从学习路径中提取所有技能
  const skills: string[] = []
  const plan = careerPlans[currentCareer.value.id as CareerPlanId]

  if (plan && plan.path) {
    plan.path.forEach(phase => {
      skills.push(...phase.skills)
    })
  }

  // 去重
  return [...new Set(skills)]
})

// 切换AI助手显示状态
function toggleAIAssistant() {
  if (aiAssistantRef.value) {
    ;(aiAssistantRef.value as any).toggleExpanded()
  }
}

function goToCareers() {
  router.push({ name: 'CareerMap' })
}

// 加载职业数据的函数
function loadCareerData(careerId: string) {
  // 这里模拟从后端或数据源获取职业数据
  // 实际应用中，这里可能需要调用API获取详细数据
  selectedCareer.value = {
    id: careerId,
    name: getCareerNameById(careerId),
    title: getCareerNameById(careerId),
    description: getCareerDescriptionById(careerId),
    matchScore: 0.75, // 默认匹配度
    trend: 5, // 默认趋势
    salaryRange: '15k-30k', // 默认薪资范围
    skills: ['JavaScript', 'HTML', 'CSS'], // 默认技能列表
    requiredSkills: [
      { id: '1', name: '编程基础', requiredLevel: 80 },
      { id: '2', name: '前端开发', requiredLevel: 70 }
    ], // 所需技能
    position: { x: 50, y: 50 },
    positionX: 50,
    positionY: 50,
    positionZ: 0,
    size: 1
  } as Career

  console.log('已加载职业ID:', careerId, '职业名称:', selectedCareer.value.name)
}

// 根据ID获取职业名称
function getCareerNameById(id: string): string {
  const careerNames: Record<string, string> = {
    '1': '前端开发工程师',
    '2': '后端开发工程师',
    '3': '全栈开发工程师',
    '4': '数据分析师',
    '5': '产品经理',
    '6': '机器学习工程师',
    '7': 'UI/UX设计师',
    '8': 'DevOps工程师',
    '9': '数据科学家',
    '10': '网络安全专家',
    '11': 'AI产品经理',
    '12': '游戏开发工程师',
    '13': '云计算架构师',
    '14': '区块链开发者',
    '15': '嵌入式系统工程师',
    '16': '移动应用开发工程师'
  }
  return careerNames[id] || '未知职业'
}

// 根据ID获取职业描述
function getCareerDescriptionById(id: string): string {
  const careerDescriptions: Record<string, string> = {
    '1': '负责网站和应用程序的用户界面开发，使用HTML、CSS和JavaScript等技术创建交互式体验。',
    '2': '负责服务器端应用程序逻辑，开发和维护处理数据、API和业务逻辑的系统。',
    '3': '同时掌握前端和后端技术的开发者，能够独立完成完整的应用程序开发。',
    '4': '从数据中提取有价值的信息和洞察，帮助企业做出数据驱动的决策。',
    '5': '负责产品的规划、开发和管理，确保产品符合用户需求并达成业务目标。',
    '6': '开发能够从数据中学习并改进的算法和模型，应用于各种问题解决场景。',
    '7': '设计用户界面和用户体验，创造美观且易用的数字产品，优化用户交互流程。',
    '8': '负责自动化部署流程，确保软件开发和运维的无缝集成，提高交付效率和系统稳定性。',
    '9': '利用统计学和机器学习等方法分析复杂数据集，挖掘价值并解决业务问题。',
    '10': '保护计算机系统和网络免受威胁，实施安全措施，及时发现和应对安全漏洞。',
    '11': '专注于人工智能产品的规划和开发，结合技术和业务需求，打造创新AI解决方案。',
    '12': '设计和开发电子游戏，负责游戏逻辑、物理引擎、渲染系统等核心功能实现。',
    '13': '设计和管理基于云的系统架构，优化资源配置，保障系统性能、可扩展性和安全性。',
    '14': '开发基于区块链的应用和智能合约，研究和实现分布式账本技术解决方案。',
    '15': '设计和开发运行在嵌入式硬件上的软件系统，为物联网设备和其他嵌入式设备编程。',
    '16': '专注于移动平台（iOS/Android）应用程序开发，提供流畅的用户体验和功能实现。'
  }
  return careerDescriptions[id] || '暂无描述'
}

// 页面加载时处理
onMounted(() => {
  // 从路由参数获取职业ID
  const careerId = route.query.careerId as string

  if (careerId) {
    console.log('从路由获取到职业ID:', careerId)
    loadCareerData(careerId)
  } else {
    console.log('没有找到职业ID参数')
    // 如果没有职业ID，则显示空状态
    selectedCareer.value = null

    // 创建星空背景效果
    createStarryBackground()
  }
})

// 创建动态星空背景
function createStarryBackground() {
  if (typeof window === 'undefined') return

  // 添加闪烁星星
  const addStar = () => {
    const starsContainer = document.querySelector('.stars-background')
    if (!starsContainer) return

    const star = document.createElement('div')
    star.classList.add('star')

    const size = Math.random() * 2 + 1
    const posX = Math.random() * window.innerWidth
    const posY = Math.random() * window.innerHeight

    star.style.width = `${size}px`
    star.style.height = `${size}px`
    star.style.left = `${posX}px`
    star.style.top = `${posY}px`
    star.style.animationDelay = `${Math.random() * 5}s`

    starsContainer.appendChild(star)

    setTimeout(() => {
      star.remove()
    }, 6000)
  }

  // 添加流星效果
  const addShootingStar = () => {
    const starsContainer = document.querySelector('.stars-background')
    if (!starsContainer) return

    const star = document.createElement('div')
    star.classList.add('shooting-star')

    const posX = Math.random() * window.innerWidth
    const posY = Math.random() * (window.innerHeight / 2)
    const angle = Math.random() * 60 - 30

    star.style.left = `${posX}px`
    star.style.top = `${posY}px`
    star.style.transform = `rotate(${angle}deg)`

    starsContainer.appendChild(star)

    setTimeout(() => {
      star.remove()
    }, 1000)
  }

  // 每200毫秒添加一个新星星
  const starInterval = setInterval(() => {
    addStar()
  }, 200)

  // 每5秒添加一个流星
  const shootingStarInterval = setInterval(() => {
    addShootingStar()
  }, 5000)

  return () => {
    clearInterval(starInterval)
    clearInterval(shootingStarInterval)
  }
}
</script>

<style lang="scss" scoped>
.learning-plan {
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  background: rgb(14, 21, 37);
  color: #fff;

  .star-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
    pointer-events: none;

    .star {
      position: absolute;
      background-color: rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      width: 2px;
      height: 2px;
      animation: twinkle 4s infinite;
    }

    @keyframes twinkle {
      0% {
        opacity: 0.3;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0.3;
      }
    }

    .constellation-line {
      position: absolute;
      height: 1px;
      background: linear-gradient(
        90deg,
        rgba(99, 179, 237, 0),
        rgba(99, 179, 237, 0.4),
        rgba(99, 179, 237, 0)
      );
      transform-origin: left center;
      animation: fade-in 2s ease-out forwards;
    }

    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  }

  .learning-container {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 24px;
    overflow: auto;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      h1 {
        font-size: 28px;
        color: #fff;
        text-shadow: 0 0 10px rgba(99, 179, 237, 0.5);
        margin: 0;
        flex: 1;
      }

      .career-path {
        display: flex;
        align-items: center;
        background: rgba(99, 179, 237, 0.1);
        padding: 6px 12px;
        border-radius: 20px;
        margin-right: 16px;

        .icon {
          color: #63b3ed;
          margin-right: 6px;
        }

        span {
          font-size: 14px;
          color: #edf2f7;
        }
      }

      .ai-button {
        display: flex;
        align-items: center;
        background: linear-gradient(
          135deg,
          rgba(66, 153, 225, 0.8) 0%,
          rgba(49, 130, 206, 0.8) 100%
        );
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 0 15px rgba(99, 179, 237, 0.3);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 20px rgba(99, 179, 237, 0.5);
        }

        .icon {
          color: #fff;
          margin-right: 8px;
        }

        span {
          color: #fff;
          font-size: 14px;
          font-weight: 500;
        }
      }
    }

    .objectives {
      margin-bottom: 32px;
      background: rgba(15, 23, 42, 0.6);
      border-radius: 8px;
      padding: 20px;
      border: 1px solid rgba(99, 179, 237, 0.3);
      box-shadow: 0 0 20px rgba(99, 179, 237, 0.1);

      h2 {
        font-size: 20px;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        color: #63b3ed;

        .icon {
          margin-right: 8px;
        }
      }

      .objective-list {
        .objective-item {
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);

          &:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
          }

          .title {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 8px;
            color: #fff;
          }

          .description {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.5;
          }
        }
      }
    }

    .learning-path {
      margin-bottom: 32px;

      h2 {
        font-size: 20px;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        color: #63b3ed;

        .icon {
          margin-right: 8px;
        }
      }

      .path-timeline {
        position: relative;
        padding-left: 32px;

        &::before {
          content: '';
          position: absolute;
          left: 7px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, #63b3ed 0%, rgba(99, 179, 237, 0.3) 100%);
        }

        .phase {
          position: relative;
          margin-bottom: 28px;
          background: rgba(15, 23, 42, 0.6);
          border-radius: 8px;
          padding: 20px;
          border: 1px solid rgba(99, 179, 237, 0.3);
          box-shadow: 0 0 20px rgba(99, 179, 237, 0.1);
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(99, 179, 237, 0.2);
          }

          &::before {
            content: '';
            position: absolute;
            left: -33px;
            top: 20px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #63b3ed;
            box-shadow: 0 0 10px #63b3ed;
            z-index: 1;
          }

          &::after {
            content: '';
            position: absolute;
            left: -32px;
            top: 14px;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: rgba(99, 179, 237, 0.2);
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          }

          @keyframes ping {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            75%,
            100% {
              transform: scale(2);
              opacity: 0;
            }
          }

          .phase-header {
            display: flex;
            align-items: center;
            margin-bottom: 12px;

            .phase-number {
              font-size: 16px;
              font-weight: 600;
              margin-right: 12px;
              padding: 4px 10px;
              background: rgba(99, 179, 237, 0.2);
              border-radius: 4px;
              color: #63b3ed;
            }

            .title {
              font-size: 18px;
              font-weight: 500;
              margin-right: auto;
              color: #fff;
            }

            .duration {
              font-size: 14px;
              color: rgba(255, 255, 255, 0.7);
              background: rgba(99, 179, 237, 0.1);
              padding: 4px 8px;
              border-radius: 4px;
            }
          }

          .description {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 16px;
            line-height: 1.5;
          }

          .skills-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;

            .skill {
              font-size: 12px;
              padding: 4px 10px;
              background: rgba(99, 179, 237, 0.1);
              border: 1px solid rgba(99, 179, 237, 0.3);
              border-radius: 16px;
              color: rgba(255, 255, 255, 0.9);
              display: flex;
              align-items: center;

              &::before {
                content: '';
                display: inline-block;
                width: 6px;
                height: 6px;
                background-color: #63b3ed;
                border-radius: 50%;
                margin-right: 6px;
              }
            }
          }
        }
      }
    }

    .resources {
      margin-bottom: 32px;

      h2 {
        font-size: 20px;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        color: #63b3ed;

        .icon {
          margin-right: 8px;
        }
      }

      .resource-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;

        .resource-card {
          background: rgba(15, 23, 42, 0.6);
          border-radius: 8px;
          padding: 16px;
          border: 1px solid rgba(99, 179, 237, 0.3);
          box-shadow: 0 0 20px rgba(99, 179, 237, 0.1);
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(99, 179, 237, 0.2);
          }

          .resource-type {
            font-size: 12px;
            color: #63b3ed;
            text-transform: uppercase;
            margin-bottom: 8px;
            letter-spacing: 1px;
          }

          .resource-title {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 8px;
            color: #fff;
          }

          .resource-info {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 12px;
            line-height: 1.5;
          }

          .resource-difficulty {
            font-size: 12px;
            padding: 2px 8px;
            background: rgba(99, 179, 237, 0.1);
            border-radius: 4px;
            color: rgba(255, 255, 255, 0.9);
            display: inline-block;
          }
        }
      }
    }
  }

  .no-career {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;

    .stars-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .constellation {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;

      .c-line {
        position: absolute;
        height: 1px;
        background: linear-gradient(
          90deg,
          rgba(99, 179, 237, 0),
          rgba(99, 179, 237, 0.5),
          rgba(99, 179, 237, 0)
        );
        transform-origin: left center;
        opacity: 0;
        animation: fade-in 1.5s ease-out forwards;
        animation-delay: calc(var(--i) * 0.2s);
      }

      .c-star {
        position: absolute;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: #fff;
        box-shadow: 0 0 8px #63b3ed;
        opacity: 0;
        animation: star-appear 1.5s ease-out forwards;
        animation-delay: calc(var(--i) * 0.15s);
      }

      @keyframes star-appear {
        0% {
          opacity: 0;
          transform: scale(0);
        }
        50% {
          opacity: 1;
          transform: scale(1.5);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
    }

    .content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      max-width: 500px;
      padding: 20px;
      background: rgba(15, 23, 42, 0.6);
      border-radius: 12px;
      border: 1px solid rgba(99, 179, 237, 0.3);
      box-shadow: 0 0 30px rgba(99, 179, 237, 0.15);

      .title {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 16px;
        color: #fff;
        text-shadow: 0 0 10px rgba(99, 179, 237, 0.5);
      }

      .message {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 24px;
        line-height: 1.5;
      }

      .grid-background {
        position: absolute;
        width: 110%;
        height: 110%;
        top: -5%;
        left: -5%;
        z-index: -1;
        background-image:
          linear-gradient(rgba(99, 179, 237, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99, 179, 237, 0.1) 1px, transparent 1px);
        background-size: 20px 20px;
        background-position: center center;
        animation: grid-move 60s linear infinite;
        opacity: 0.5;
        pointer-events: none;
      }

      @keyframes grid-move {
        0% {
          transform: translate(0, 0) rotate(0deg);
        }
        100% {
          transform: translate(-20px, -20px) rotate(1deg);
        }
      }

      .explore-button {
        padding: 10px 20px;
        background: linear-gradient(90deg, #3182ce 0%, #63b3ed 100%);
        border: none;
        border-radius: 4px;
        color: white;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: 0.5s;
        }

        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(49, 130, 206, 0.3);

          &::before {
            left: 100%;
          }
        }
      }
    }

    .orbit {
      position: absolute;
      border: 1px solid rgba(99, 179, 237, 0.2);
      border-radius: 50%;
      pointer-events: none;

      &:nth-child(1) {
        width: 300px;
        height: 300px;
        animation: orbit-rotate 30s linear infinite;
      }

      &:nth-child(2) {
        width: 500px;
        height: 500px;
        animation: orbit-rotate 60s linear infinite reverse;
      }

      &:nth-child(3) {
        width: 700px;
        height: 700px;
        animation: orbit-rotate 90s linear infinite;
      }

      @keyframes orbit-rotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    }
  }

  .tech-circles {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;

    .circle {
      position: absolute;
      border-radius: 50%;
      border: 1px solid rgba(99, 179, 237, 0.3);
      animation: pulse-fade 5s infinite ease-in-out;

      &.c1 {
        width: 200px;
        height: 200px;
        top: -100px;
        left: -100px;
        animation-delay: 0s;
      }

      &.c2 {
        width: 150px;
        height: 150px;
        bottom: -75px;
        right: -75px;
        animation-delay: 1s;
      }

      &.c3 {
        width: 300px;
        height: 300px;
        bottom: 20%;
        left: -150px;
        animation-delay: 2s;
      }

      &.c4 {
        width: 250px;
        height: 250px;
        top: 10%;
        right: -125px;
        animation-delay: 3s;
      }
    }

    @keyframes pulse-fade {
      0% {
        transform: scale(1);
        opacity: 0.3;
      }
      50% {
        transform: scale(1.2);
        opacity: 0.6;
      }
      100% {
        transform: scale(1);
        opacity: 0.3;
      }
    }
  }
}

.stars-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;

  .star {
    position: absolute;
    background: #fff;
    border-radius: 50%;
    animation: twinkle 5s infinite ease-in-out;
  }

  .shooting-star {
    position: absolute;
    width: 100px;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.8), transparent);
    animation: shooting 1s linear both;
    z-index: 1;
  }

  @keyframes twinkle {
    0%,
    100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }

  @keyframes shooting {
    0% {
      transform: translateX(0) translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateX(300px) translateY(300px);
      opacity: 0;
    }
  }
}

.constellation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;

  .c-line {
    position: absolute;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(99, 179, 237, 0.2), transparent);
    animation: pulseLine 3s infinite ease-in-out;
    animation-delay: calc(var(--i) * 0.2s);
    transform-origin: left center;
  }

  .c-star {
    position: absolute;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(99, 179, 237, 0.5);
    animation: pulseNode 3s infinite ease-in-out;
    animation-delay: calc(var(--i) * 0.3s);
  }

  @keyframes pulseLine {
    0%,
    100% {
      opacity: 0.2;
    }
    50% {
      opacity: 0.7;
    }
  }

  @keyframes pulseNode {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.7;
    }
    50% {
      transform: scale(1.3);
      opacity: 1;
    }
  }
}

.orbit {
  position: absolute;
  border: 1px solid rgba(99, 179, 237, 0.1);
  border-radius: 50%;
  animation: rotate 20s linear infinite;

  &:nth-child(1) {
    width: 200px;
    height: 200px;
    top: calc(50% - 100px);
    left: calc(50% - 100px);
  }

  &:nth-child(2) {
    width: 300px;
    height: 300px;
    top: calc(50% - 150px);
    left: calc(50% - 150px);
    animation-direction: reverse;
    animation-duration: 30s;
  }

  &:nth-child(3) {
    width: 400px;
    height: 400px;
    top: calc(50% - 200px);
    left: calc(50% - 200px);
    animation-duration: 40s;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}

.tech-circles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  .circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.2;
    animation: float 10s infinite ease-in-out;

    &.c1 {
      width: 60px;
      height: 60px;
      top: 20%;
      left: 20%;
      background: radial-gradient(circle, rgba(66, 153, 225, 0.6) 0%, transparent 70%);
      animation-delay: 0s;
    }

    &.c2 {
      width: 80px;
      height: 80px;
      top: 60%;
      left: 30%;
      background: radial-gradient(circle, rgba(236, 201, 75, 0.6) 0%, transparent 70%);
      animation-delay: 1s;
    }

    &.c3 {
      width: 50px;
      height: 50px;
      top: 30%;
      left: 70%;
      background: radial-gradient(circle, rgba(72, 187, 120, 0.6) 0%, transparent 70%);
      animation-delay: 2s;
    }

    &.c4 {
      width: 70px;
      height: 70px;
      top: 70%;
      left: 60%;
      background: radial-gradient(circle, rgba(237, 100, 166, 0.6) 0%, transparent 70%);
      animation-delay: 3s;
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
}

.grid-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(99, 179, 237, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 179, 237, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: -1;
  animation: fadeIn 1s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}
</style>
