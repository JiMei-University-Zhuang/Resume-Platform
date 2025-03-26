# Resume-Platform

一个基于 Vue 3、TypeScript 和 Vite 构建的现代化AI教育与职业发展平台。

<details>
<summary>English Version</summary>

# Resume-Platform

A modern AI education and career development platform built with Vue 3, TypeScript, and Vite.

## 🚀 Features

- 🎯 **Vue 3 + TypeScript**: Latest Vue 3 Composition API with TypeScript for complete type support
- ⚡️ **Vite**: Lightning-fast development server and hot module replacement
- 🎨 **Element Plus**: Beautiful UI component library with rich interactive experiences
- 📑 **Professional Resume Templates**: 10+ premium resume templates designed for different industries
- 🖼️ **Resume Export**: High-quality PDF export with customizable settings
- 📸 **AI ID Photo**: Intelligent ID photo generation and editing system
- 📋 **AI Resume Builder**: Smart resume generation and optimization tools
- 🧭 **AI Career Planning**: Personalized career analysis, development planning, and recommendations
- 📚 **Exam Center**: Civil service exams, graduate school preparation, and online practice
- 💬 **AI Chat**: Intelligent conversation assistant for career guidance
- 🔐 **Permission Management**: Comprehensive role-based access control
- 📱 **Responsive Design**: Adapts to various screen sizes

## 🛠️ Technology Stack

- Core Framework: Vue 3
- Development Language: TypeScript
- Build Tool: Vite
- UI Framework: Element Plus
- State Management: Pinia
- Routing: Vue Router
- HTTP Client: Axios
- Visualization: ECharts
- Face Recognition: face-api.js
- Document Handling: html2canvas, jspdf
- Math Typesetting: KaTeX
- Code Standards: ESLint + Prettier
- Git Hooks: Husky + lint-staged

## 📦 Quick Start

Make sure your development environment meets the following requirements:

- Node.js >= 18.0.0
- pnpm >= 8.0.0

```bash
# Clone the repository
git clone https://github.com/JiMei-University-Zhuang/Resume-Platform.git

# Enter the project directory
cd Resume-Platform

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

## 📝 Development Guide

### Project Structure

```
Resume-Platform
├── src/                    # Source code
│   ├── api/                # API interfaces
│   ├── assets/             # Static assets
│   ├── components/         # Shared components
│   │   └── Template/       # Resume templates
│   ├── layout/             # Layout components
│   ├── router/             # Route configuration
│   ├── stores/             # Pinia state management
│   ├── utils/              # Utility functions
│   └── views/              # Page components
│       ├── dashboard/      # Dashboard
│       ├── id-photo/       # AI ID photo module
│       ├── resume/         # Resume builder module
│       ├── career-planning/ # AI career planning module
│       │   ├── Analysis.vue     # Career analysis
│       │   ├── Roadmap.vue      # Development planning
│       │   └── Recommendation.vue # Career recommendations
│       ├── chat/           # AI chat module
│       └── exam/           # Exam center module
│           ├── CivilService.vue # Civil service exams
│           ├── Graduate.vue     # Graduate school prep
│           └── Practice.vue     # Practice tests
├── public/                 # Public assets
│   └── models/             # AI model files for face-api.js
├── .env.*                  # Environment variables
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

### Development Commands

```bash
# Development environment
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Format code
pnpm format

# Lint code
pnpm lint
```

## 🤝 Contribution Guide

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Create a Pull Request

## 📄 License

[MIT License](LICENSE)

## 🙏 Acknowledgements

Thanks to all developers who contributed to this project!

</details>

## 🚀 特性

- 🎯 **Vue 3 + TypeScript**: 采用最新的 Vue 3 组合式 API 和 TypeScript，提供完整的类型支持
- ⚡️ **Vite**: 极速的开发服务器启动和热更新
- 🎨 **Element Plus**: 美观的 UI 组件库，提供丰富的交互体验
- 📑 **专业简历模板**: 10+ 款精心设计的简历模板，适用于不同行业需求
- 🖼️ **简历导出**: 支持高质量 PDF 导出，自定义设置
- 📸 **AI 证件照**: 智能证件照生成与编辑系统
- 📋 **AI 简历制作**: 智能简历生成与优化工具
- 🧭 **AI 职业规划**: 个性化职业分析、发展规划与推荐
- 📚 **考试中心**: 公务员考试、考研备考、在线模拟练习
- 💬 **AI 对话**: 智能对话助手，提供职业指导
- 🔐 **权限管理**: 完善的角色权限控制系统
- 📱 **响应式设计**: 自适应多种屏幕尺寸

## 🛠️ 技术栈

- 核心框架：Vue 3
- 开发语言：TypeScript
- 构建工具：Vite
- UI 框架：Element Plus
- 状态管理：Pinia
- 路由管理：Vue Router
- HTTP 客户端：Axios
- 数据可视化：ECharts
- 人脸识别：face-api.js
- 文档处理：html2canvas, jspdf
- 数学排版：KaTeX
- 代码规范：ESLint + Prettier
- Git Hook：Husky + lint-staged

## 📦 快速开始

确保你的开发环境满足以下要求：

- Node.js >= 18.0.0
- pnpm >= 8.0.0

```bash
# 克隆项目
git clone https://github.com/JiMei-University-Zhuang/Resume-Platform.git

# 进入项目目录
cd Resume-Platform

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 📝 开发指南

### 项目结构

```
Resume-Platform
├── src/                    # 源代码
│   ├── api/                # API 接口
│   ├── assets/             # 静态资源
│   ├── components/         # 公共组件
│   │   └── Template/       # 简历模板
│   ├── layout/             # 布局组件
│   ├── router/             # 路由配置
│   ├── stores/             # Pinia 状态管理
│   ├── utils/              # 工具函数
│   └── views/              # 页面组件
│       ├── dashboard/      # 仪表盘
│       ├── id-photo/       # AI证件照模块
│       ├── resume/         # 简历制作模块
│       ├── career-planning/ # AI职业规划模块
│       │   ├── Analysis.vue     # 职业分析
│       │   ├── Roadmap.vue      # 发展规划
│       │   └── Recommendation.vue # 职业推荐
│       ├── chat/           # AI对话模块
│       └── exam/           # 考试中心模块
│           ├── CivilService.vue # 公务员考试
│           ├── Graduate.vue     # 考研备考
│           └── Practice.vue     # 模拟练习
├── public/                 # 公共资源
│   └── models/             # face-api.js 的 AI 模型文件
├── .env.*                  # 环境变量配置
├── vite.config.ts          # Vite 配置
└── tsconfig.json           # TypeScript 配置
```

### 开发命令

```bash
# 开发环境
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview

# 代码格式化
pnpm format

# 代码检查
pnpm lint
```

## 📋 版本历史

查看 [CHANGELOG.md](CHANGELOG.md) 了解详细的版本更新内容。

## 🤝 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建一个 Pull Request

## 📄 许可证

[MIT License](LICENSE)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！
