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
    }
  ]

  return careers
}
