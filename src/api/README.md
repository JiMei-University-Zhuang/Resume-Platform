# Z-Admin 职业分析 API 接口文档

本文档详细说明职业分析模块所需的后端 API 接口，包括请求参数和响应结构。

## 职业分析模块

### 1. 获取职业技能列表

**接口路径：** `/api/career/skills`

**请求方法：** `GET`

**响应参数：**

```typescript
interface CareerSkill {
  id: number
  name: string
  category: string // 'tech' | 'design' | 'management' | 'soft' | 'business'
}
```

**响应示例：**

```json
[
  { "id": 1, "name": "编程开发", "category": "tech" },
  { "id": 2, "name": "数据分析", "category": "tech" },
  { "id": 3, "name": "产品设计", "category": "design" },
  { "id": 4, "name": "市场营销", "category": "business" },
  { "id": 5, "name": "项目管理", "category": "management" },
  { "id": 6, "name": "沟通协作", "category": "soft" }
]
```

### 2. 提交职业分析

**接口路径：** `/api/ai/professionAnalysis`

**请求方法：** `POST`

**请求参数：**

```typescript
interface CareerAnalysisForm {
  education: string // 'high_school' | 'college' | 'bachelor' | 'master' | 'phd'
  major: string
  skills: string[]
  interests: string[]
  workExperience: number // 工作年限
}
```

**请求示例：**

```json
{
  "education": "bachelor",
  "major": "计算机科学",
  "skills": ["编程开发", "数据分析", "产品设计"],
  "interests": ["tech_research", "data_analysis", "creative_design"],
  "workExperience": 3
}
```

**响应参数：**

```typescript
interface CareerAnalysisResult {
  recommendedCareer: string
  suitabilityScore: number
  strengths: string[]
  weaknesses: string[]
  advantages: string
  suggestions: string
  relatedCareers: string[]
}
```

**响应示例：**

```json
{
  "recommendedCareer": "软件开发工程师",
  "suitabilityScore": 92,
  "strengths": ["技术能力强", "逻辑思维清晰", "学习能力佳"],
  "weaknesses": ["沟通能力有待提升", "项目管理经验不足"],
  "advantages": "具备扎实的技术基础，对编程有浓厚兴趣，适合从事技术开发工作。",
  "suggestions": "建议继续深入学习新技术，参与开源项目，提升系统设计能力，同时加强沟通能力和团队协作能力。",
  "relatedCareers": ["前端开发工程师", "后端开发工程师", "全栈工程师", "移动开发工程师"]
}
```

### 3. 职业发展路径分析

**接口路径：** `/api/ai/professionRoadmap`

**请求方法：** `POST`

**请求参数：**

```typescript
interface CareerRoadmapForm {
  currentPosition: string
  targetPosition: string
  yearsOfExperience: number
  skills: string[]
  interests: string[]
  education: string
  preferredIndustry?: string
}
```

**请求示例：**

```json
{
  "currentPosition": "初级开发工程师",
  "targetPosition": "技术总监",
  "yearsOfExperience": 2,
  "skills": ["Javascript", "React", "Node.js"],
  "interests": ["技术架构", "团队管理"],
  "education": "bachelor",
  "preferredIndustry": "互联网"
}
```

**响应参数：**

```typescript
interface CareerMilestone {
  stage: number
  title: string
  duration: string
  tasks: string[]
  skillsToAcquire: string[]
}

interface CareerRoadmapResult {
  targetPosition: string
  currentLevel: string
  timelineYears: number
  milestones: CareerMilestone[]
  recommendations: string[]
}
```

**响应示例：**

```json
{
  "targetPosition": "技术总监",
  "currentLevel": "初级开发工程师",
  "timelineYears": 8,
  "milestones": [
    {
      "stage": 1,
      "title": "中级开发工程师",
      "duration": "1-2年",
      "tasks": ["独立负责模块开发", "编写技术文档", "代码审查"],
      "skillsToAcquire": ["系统设计", "性能优化", "单元测试"]
    },
    {
      "stage": 2,
      "title": "高级开发工程师",
      "duration": "2-4年",
      "tasks": ["负责核心功能开发", "技术难题攻关", "指导初级工程师"],
      "skillsToAcquire": ["架构设计", "团队协作", "技术选型"]
    },
    {
      "stage": 3,
      "title": "技术专家/架构师",
      "duration": "4-6年",
      "tasks": ["系统架构设计", "技术方案评审", "跨团队协作"],
      "skillsToAcquire": ["分布式系统", "技术管理", "项目规划"]
    },
    {
      "stage": 4,
      "title": "技术总监",
      "duration": "6-8年",
      "tasks": ["技术战略规划", "团队建设与管理", "技术创新"],
      "skillsToAcquire": ["组织管理", "业务理解", "资源规划"]
    }
  ],
  "recommendations": [
    "深入学习系统设计原则和架构模式",
    "参与跨部门项目，提升沟通与协作能力",
    "逐步承担团队管理职责，培养领导力",
    "关注行业前沿技术，保持技术敏感度"
  ]
}
```

### 4. 获取职业推荐

**接口路径：** `/api/ai/professionRecommendation`

**请求方法：** `POST`

**请求参数：**

```typescript
interface CareerRecommendationForm {
  skills: string[]
  interests: string[]
  education: string
  experience: number
  preferredWorkStyle?: string
  preferredIndustry?: string
  preferredLocation?: string
  currentPosition?: string
}
```

**请求示例：**

```json
{
  "skills": ["编程开发", "数据分析", "产品设计"],
  "interests": ["tech_research", "data_analysis"],
  "education": "master",
  "experience": 3,
  "preferredWorkStyle": "灵活办公",
  "preferredIndustry": "互联网",
  "preferredLocation": "北京",
  "currentPosition": "前端开发工程师"
}
```

**响应参数：**

```typescript
interface JobLink {
  platform: string
  url: string
  logo: string
}

interface CareerRecommendation {
  title: string
  matchScore: number
  description: string
  requiredSkills: string[]
  averageSalary: string
  growthProspect: string
  workLifeBalance: string
  jobLinks?: JobLink[]
}

interface IndustryTrend {
  industry: string
  growthRate: string
  description: string
}

interface CareerRecommendationResult {
  topRecommendations: CareerRecommendation[]
  industryTrends: IndustryTrend[]
  careerAdvice: string
}
```

**响应示例：**

```json
{
  "topRecommendations": [
    {
      "title": "全栈开发工程师",
      "matchScore": 92,
      "description": "负责前后端系统的设计与开发，构建高性能、可扩展的应用程序。",
      "requiredSkills": ["JavaScript", "React", "Node.js", "数据库设计"],
      "averageSalary": "25k-45k",
      "growthProspect": "高速增长",
      "workLifeBalance": "良好",
      "jobLinks": [
        {
          "platform": "Boss直聘",
          "url": "https://www.zhipin.com/web/geek/job?query=全栈开发",
          "logo": "https://static.zhipin.com/fe-zhipin-geek/v1671784884648/h5/resource/logo-image/boss-logo.png"
        }
      ]
    }
  ],
  "industryTrends": [
    {
      "industry": "人工智能",
      "growthRate": "35%",
      "description": "人工智能领域正在快速发展，对具备机器学习、深度学习和自然语言处理技能的专业人士需求旺盛。"
    }
  ],
  "careerAdvice": "基于您的技术背景和兴趣，全栈开发工程师是最适合的发展方向。建议继续加强前后端技术的学习，特别是云原生和微服务架构知识，以适应未来技术发展趋势。"
}
```

## 注意事项

1. 所有接口返回的HTTP状态码为200表示成功，其他状态码表示请求失败
2. 接口调用失败时，会返回一个包含错误信息的JSON对象：
   ```json
   {
     "code": 400,
     "message": "请求参数错误",
     "details": "education字段不能为空"
   }
   ```
3. 在生产环境中，可能需要为接口添加认证机制，确保数据安全
4. 建议在响应头中添加适当的缓存控制，以优化性能

# 智航系统 API 文档

本文档提供智航系统后端 API 的详细说明，帮助前端开发人员理解和使用后端提供的接口。

## 通知管理 API

通知系统允许用户接收系统通知、任务通知和其他重要信息。

### 获取通知列表

获取当前用户的所有通知列表。

**请求方法**：GET

**请求路径**：`/notice/getNoticeList`

**请求参数**：

| 参数名 | 类型   | 是否必须 | 描述                       |
|--------|--------|----------|----------------------------|
| token  | string | 是       | 用户令牌（通过请求体传递） |

**响应结构**：

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": [
    {
      "noticeId": "1",
      "isRead": 1,
      "content": "欢迎来到智航，今天是你注册的第7天"
    },
    {
      "noticeId": "2",
      "userId": "1",
      "icon": "",
      "publishTime": 1744071310000,
      "isRead": 1,
      "title": "测试标题",
      "content": "测试通知消息内容"
    },
    {
      "noticeId": "8",
      "userId": "1",
      "icon": "",
      "publishTime": 1744168459000,
      "isRead": 0,
      "title": "测试标题111",
      "content": "测试通知消息内容222"
    }
  ]
}
```

### 标记通知为已读

将指定通知标记为已读状态。

**请求方法**：POST

**请求路径**：`/notice/markAsRead`

**请求参数**：

| 参数名   | 类型   | 是否必须 | 描述     |
|----------|--------|----------|----------|
| noticeId | string | 是       | 通知ID   |

**响应结构**：

```json
{
  "code": 200,
  "msg": "操作成功"
}
```

### 标记所有通知为已读

将用户的所有未读通知标记为已读状态。

**请求方法**：POST

**请求路径**：`/notice/markAllAsRead`

**响应结构**：

```json
{
  "code": 200,
  "msg": "操作成功"
}
```

### 删除通知

删除指定的通知。

**请求方法**：GET

**请求路径**：`/notice/delete`

**请求参数**：

| 参数名   | 类型   | 是否必须 | 描述     |
|----------|--------|----------|----------|
| noticeId | string | 是       | 通知ID   |

**响应结构**：

```json
{
  "code": 200,
  "msg": "操作成功"
}
```

## 通知类型说明

系统会根据通知内容自动推断通知类型：

1. **系统通知 (info)**：一般性系统消息
2. **警告通知 (warning)**：包含"警告"或"warning"关键词的通知
3. **成功通知 (success)**：包含"成功"、"完成"、"success"或"complete"关键词的通知
4. **任务通知 (task)**：包含"任务"或"task"关键词的通知

前端会根据这些类型使用不同的图标和样式展示通知。

## 注意事项

1. 尽管 `getNoticeList` 使用 GET 方法，但是需要在请求体中传递 token，而不是通过 URL 参数或请求头。
2. 通知系统会根据通知内容自动推断类型，所以在创建通知时，建议在标题或内容中包含相关关键词。
3. 通知的 `isRead` 字段使用数值表示：0 表示未读，1 表示已读。
