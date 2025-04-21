export interface Skill {
  id: string | number
  name: string
  level: number
  color: string
}

export interface Career {
  id: string | number
  title: string
  name: string
  description: string
  matchScore: number
  trend: number
  salaryRange: string
  skills: string[]
  requiredSkills: {
    id: string | number
    name: string
    requiredLevel: number
  }[]
  position?: {
    x: number
    y: number
  }
  icon?: string
  positionX?: number
  positionY?: number
  positionZ?: number
  size?: number
}

export interface Connection {
  target: Career
  strength: number
}

export interface User {
  id: string | number
  name: string
  avatar: string
  level: number
  careerGoal: string
  currentTitle?: string
  completedLearningHours?: number
  assessmentsCompleted?: number
  skillsMastered?: number
  interests: string[]
  education: {
    degree: string
    major: string
    school: string
    year: number
  }
}

export const fetchUserCareerData = async (): Promise<{ user: User; skills: Skill[] }> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  const user: User = {
    id: 1,
    name: '张明',
    avatar: '/avatars/user1.jpg',
    level: 3,
    careerGoal: '软件工程师',
    interests: ['编程', '人工智能', '数据分析'],
    education: {
      degree: '本科',
      major: '计算机科学',
      school: '浙江大学',
      year: 2024
    }
  }

  const skills: Skill[] = [
    { id: 1, name: '编程基础', level: 4, color: '#4287f5' },
    { id: 2, name: '算法设计', level: 3, color: '#42aaf5' },
    { id: 3, name: '数据结构', level: 3.5, color: '#42d1f5' },
    { id: 4, name: '前端开发', level: 4, color: '#42f5d1' },
    { id: 5, name: '后端开发', level: 3, color: '#42f5aa' },
    { id: 6, name: '数据库', level: 2.5, color: '#42f587' },
    { id: 7, name: '机器学习', level: 2, color: '#87f542' },
    { id: 8, name: '沟通能力', level: 3.5, color: '#f5d142' },
    { id: 9, name: '团队协作', level: 4, color: '#f5aa42' },
    { id: 10, name: '项目管理', level: 2, color: '#f57842' }
  ]

  return { user, skills }
}

export const fetchCareerOptions = async (_user: User, _skills: Skill[]): Promise<Career[]> => {
  await new Promise(resolve => setTimeout(resolve, 1200))

  const careers: Career[] = [
    {
      id: 1,
      title: '前端开发工程师',
      name: '前端开发工程师',
      matchScore: 0.85,
      trend: 12,
      salaryRange: '15k-25k',
      description: '负责开发用户界面和交互体验，使用现代前端框架构建响应式网站和应用程序。',
      skills: ['JavaScript', 'HTML/CSS', 'React', 'Vue', 'WebPack'],
      requiredSkills: [
        { id: 1, name: '编程基础', requiredLevel: 80 },
        { id: 4, name: '前端开发', requiredLevel: 80 },
        { id: 8, name: '沟通能力', requiredLevel: 60 }
      ],
      position: { x: 35, y: 40 },
      icon: 'code',
      positionX: 35,
      positionY: 40,
      positionZ: 0
    },
    {
      id: 2,
      title: '后端开发工程师',
      name: '后端开发工程师',
      matchScore: 0.78,
      trend: 8,
      salaryRange: '18k-28k',
      description:
        '负责设计和实现服务器端逻辑，数据库交互，以及API开发，确保应用程序的安全性和性能。',
      skills: ['Java', 'Python', 'Node.js', 'SQL', 'API设计'],
      requiredSkills: [
        { id: 1, name: '编程基础', requiredLevel: 80 },
        { id: 5, name: '后端开发', requiredLevel: 80 },
        { id: 6, name: '数据库', requiredLevel: 60 }
      ],
      position: { x: 65, y: 45 },
      icon: 'code',
      positionX: 65,
      positionY: 45,
      positionZ: 0
    },
    {
      id: 3,
      title: '全栈开发工程师',
      name: '全栈开发工程师',
      matchScore: 0.82,
      trend: 15,
      salaryRange: '20k-35k',
      description: '同时负责前端和后端开发，能够从用户界面到服务器逻辑进行全方位开发。',
      skills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB'],
      requiredSkills: [
        { id: 1, name: '编程基础', requiredLevel: 80 },
        { id: 4, name: '前端开发', requiredLevel: 70 },
        { id: 5, name: '后端开发', requiredLevel: 70 }
      ],
      position: { x: 50, y: 30 },
      icon: 'code',
      positionX: 50,
      positionY: 30,
      positionZ: 0
    },
    {
      id: 4,
      title: '数据分析师',
      name: '数据分析师',
      matchScore: 0.65,
      trend: 5,
      salaryRange: '15k-25k',
      description: '通过分析数据，提取洞察和趋势，帮助企业做出数据驱动的决策。',
      skills: ['SQL', 'Excel', 'Python', 'R', '统计分析'],
      requiredSkills: [
        { id: 2, name: '算法设计', requiredLevel: 60 },
        { id: 6, name: '数据库', requiredLevel: 70 },
        { id: 7, name: '机器学习', requiredLevel: 40 }
      ],
      position: { x: 25, y: 60 },
      icon: 'chart-line',
      positionX: 25,
      positionY: 60,
      positionZ: 0
    },
    {
      id: 5,
      title: '产品经理',
      name: '产品经理',
      matchScore: 0.6,
      trend: 0,
      salaryRange: '18k-30k',
      description: '负责定义产品需求，确定产品功能和路线图，并与开发团队协作实现产品愿景。',
      skills: ['产品规划', '用户研究', '原型设计', '敏捷开发', '市场分析'],
      requiredSkills: [
        { id: 8, name: '沟通能力', requiredLevel: 80 },
        { id: 9, name: '团队协作', requiredLevel: 80 },
        { id: 10, name: '项目管理', requiredLevel: 70 }
      ],
      position: { x: 75, y: 25 },
      icon: 'briefcase',
      positionX: 75,
      positionY: 25,
      positionZ: 0
    },
    {
      id: 6,
      title: '机器学习工程师',
      name: '机器学习工程师',
      matchScore: 0.55,
      trend: 18,
      salaryRange: '25k-45k',
      description: '开发和实现机器学习模型和算法，解决复杂的数据问题。',
      skills: ['Python', 'TensorFlow', 'PyTorch', '机器学习算法', '数据预处理'],
      requiredSkills: [
        { id: 2, name: '算法设计', requiredLevel: 80 },
        { id: 3, name: '数据结构', requiredLevel: 70 },
        { id: 7, name: '机器学习', requiredLevel: 80 }
      ],
      position: { x: 45, y: 70 },
      icon: 'microscope',
      positionX: 45,
      positionY: 70,
      positionZ: 0
    },
    {
      id: 7,
      title: 'UI/UX设计师',
      name: 'UI/UX设计师',
      matchScore: 0.72,
      trend: 10,
      salaryRange: '15k-30k',
      description: '设计用户界面和用户体验，创造美观且易用的数字产品，优化用户交互流程。',
      skills: ['UI设计', 'UX设计', 'Figma', 'Adobe XD', '交互设计', '原型设计'],
      requiredSkills: [
        { id: 11, name: '设计基础', requiredLevel: 80 },
        { id: 12, name: '用户研究', requiredLevel: 70 },
        { id: 8, name: '沟通能力', requiredLevel: 75 }
      ],
      position: { x: 30, y: 20 },
      icon: 'layout',
      positionX: 30,
      positionY: 20,
      positionZ: 0
    },
    {
      id: 8,
      title: 'DevOps工程师',
      name: 'DevOps工程师',
      matchScore: 0.68,
      trend: 15,
      salaryRange: '20k-40k',
      description: '负责自动化部署流程，确保软件开发和运维的无缝集成，提高交付效率和系统稳定性。',
      skills: ['Docker', 'Kubernetes', 'CI/CD', 'Linux', 'AWS/云服务', '监控工具'],
      requiredSkills: [
        { id: 1, name: '编程基础', requiredLevel: 70 },
        { id: 13, name: '系统运维', requiredLevel: 80 },
        { id: 14, name: '自动化工具', requiredLevel: 85 }
      ],
      position: { x: 70, y: 60 },
      icon: 'server',
      positionX: 70,
      positionY: 60,
      positionZ: 0
    },
    {
      id: 9,
      title: '数据科学家',
      name: '数据科学家',
      matchScore: 0.59,
      trend: 20,
      salaryRange: '25k-50k',
      description: '利用统计学和机器学习等方法分析复杂数据集，挖掘价值并解决业务问题。',
      skills: ['Python', 'R', '统计分析', '机器学习', '数据可视化', '大数据技术'],
      requiredSkills: [
        { id: 2, name: '算法设计', requiredLevel: 85 },
        { id: 7, name: '机器学习', requiredLevel: 85 },
        { id: 15, name: '统计学', requiredLevel: 80 }
      ],
      position: { x: 35, y: 80 },
      icon: 'database',
      positionX: 35,
      positionY: 80,
      positionZ: 0
    },
    {
      id: 10,
      title: '网络安全专家',
      name: '网络安全专家',
      matchScore: 0.62,
      trend: 16,
      salaryRange: '22k-45k',
      description: '保护计算机系统和网络免受威胁，实施安全措施，及时发现和应对安全漏洞。',
      skills: ['网络安全', '渗透测试', '安全审计', '密码学', '风险评估', 'SIEM'],
      requiredSkills: [
        { id: 16, name: '网络基础', requiredLevel: 80 },
        { id: 17, name: '安全知识', requiredLevel: 85 },
        { id: 1, name: '编程基础', requiredLevel: 60 }
      ],
      position: { x: 80, y: 75 },
      icon: 'shield',
      positionX: 80,
      positionY: 75,
      positionZ: 0
    },
    {
      id: 11,
      title: 'AI产品经理',
      name: 'AI产品经理',
      matchScore: 0.58,
      trend: 22,
      salaryRange: '25k-45k',
      description: '专注于人工智能产品的规划和开发，结合技术和业务需求，打造创新AI解决方案。',
      skills: ['产品管理', 'AI技术理解', '需求分析', '市场调研', '项目管理', 'AI伦理'],
      requiredSkills: [
        { id: 10, name: '项目管理', requiredLevel: 75 },
        { id: 18, name: 'AI知识', requiredLevel: 70 },
        { id: 8, name: '沟通能力', requiredLevel: 85 }
      ],
      position: { x: 60, y: 15 },
      icon: 'cpu',
      positionX: 60,
      positionY: 15,
      positionZ: 0
    },
    {
      id: 12,
      title: '游戏开发工程师',
      name: '游戏开发工程师',
      matchScore: 0.75,
      trend: 10,
      salaryRange: '18k-35k',
      description: '设计和开发电子游戏，负责游戏逻辑、物理引擎、渲染系统等核心功能实现。',
      skills: ['C++', 'Unity', 'Unreal Engine', '游戏设计', '3D数学', '物理引擎'],
      requiredSkills: [
        { id: 1, name: '编程基础', requiredLevel: 85 },
        { id: 19, name: '游戏引擎', requiredLevel: 80 },
        { id: 20, name: '图形学', requiredLevel: 70 }
      ],
      position: { x: 20, y: 35 },
      icon: 'gamepad',
      positionX: 20,
      positionY: 35,
      positionZ: 0
    },
    {
      id: 13,
      title: '云计算架构师',
      name: '云计算架构师',
      matchScore: 0.64,
      trend: 18,
      salaryRange: '30k-60k',
      description: '设计和管理基于云的系统架构，优化资源配置，保障系统性能、可扩展性和安全性。',
      skills: ['AWS/Azure/GCP', '系统架构', '微服务', '容器化', '云安全', 'IaC'],
      requiredSkills: [
        { id: 21, name: '云技术', requiredLevel: 85 },
        { id: 22, name: '架构设计', requiredLevel: 80 },
        { id: 5, name: '后端开发', requiredLevel: 70 }
      ],
      position: { x: 85, y: 45 },
      icon: 'cloud',
      positionX: 85,
      positionY: 45,
      positionZ: 0
    },
    {
      id: 14,
      title: '区块链开发者',
      name: '区块链开发者',
      matchScore: 0.56,
      trend: 14,
      salaryRange: '25k-50k',
      description: '开发基于区块链的应用和智能合约，研究和实现分布式账本技术解决方案。',
      skills: ['区块链技术', 'Solidity', '智能合约', '密码学', 'Web3.js', '分布式系统'],
      requiredSkills: [
        { id: 1, name: '编程基础', requiredLevel: 80 },
        { id: 23, name: '区块链', requiredLevel: 85 },
        { id: 17, name: '安全知识', requiredLevel: 70 }
      ],
      position: { x: 15, y: 75 },
      icon: 'link',
      positionX: 15,
      positionY: 75,
      positionZ: 0
    },
    {
      id: 15,
      title: '嵌入式系统工程师',
      name: '嵌入式系统工程师',
      matchScore: 0.61,
      trend: 8,
      salaryRange: '18k-35k',
      description: '设计和开发运行在嵌入式硬件上的软件系统，为物联网设备和其他嵌入式设备编程。',
      skills: ['C/C++', '嵌入式Linux', '单片机', 'RTOS', '硬件接口', '电路设计'],
      requiredSkills: [
        { id: 1, name: '编程基础', requiredLevel: 85 },
        { id: 24, name: '硬件知识', requiredLevel: 75 },
        { id: 25, name: '系统编程', requiredLevel: 80 }
      ],
      position: { x: 40, y: 15 },
      icon: 'cpu',
      positionX: 40,
      positionY: 15,
      positionZ: 0
    },
    {
      id: 16,
      title: '移动应用开发工程师',
      name: '移动应用开发工程师',
      matchScore: 0.79,
      trend: 9,
      salaryRange: '16k-30k',
      description: '专注于移动平台（iOS/Android）应用程序开发，提供流畅的用户体验和功能实现。',
      skills: ['Swift/Kotlin', 'React Native', 'Flutter', '移动UI设计', 'App架构', '性能优化'],
      requiredSkills: [
        { id: 1, name: '编程基础', requiredLevel: 75 },
        { id: 26, name: '移动开发', requiredLevel: 85 },
        { id: 4, name: '前端开发', requiredLevel: 70 }
      ],
      position: { x: 55, y: 55 },
      icon: 'smartphone',
      positionX: 55,
      positionY: 55,
      positionZ: 0
    }
  ]

  return careers
}
