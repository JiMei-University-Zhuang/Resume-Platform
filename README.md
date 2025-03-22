# Z-Admin

一个基于 Vue 3、TypeScript 和 Vite 构建的现代化AI教育与职业发展平台。

## 🚀 特性

- 🎯 **Vue 3 + TypeScript**: 采用最新的 Vue 3 组合式 API 和 TypeScript，提供完整的类型支持
- ⚡️ **Vite**: 极速的开发服务器启动和热更新
- 🎨 **Element Plus**: 美观的 UI 组件库，提供丰富的交互体验
- 📸 **AI 证件照**: 智能证件照生成与编辑系统
- 📋 **AI 简历制作**: 智能简历生成与优化工具
- 🧭 **AI 职业规划**: 个性化职业分析、发展规划与推荐
- 📚 **考试中心**: 公务员考试、考研备考、在线模拟练习
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
- 代码规范：ESLint + Prettier
- Git Hook：Husky + lint-staged

## 📦 快速开始

确保你的开发环境满足以下要求：
- Node.js >= 16.0.0
- pnpm >= 8.0.0

```bash
# 克隆项目
git clone <https://github.com/JiMei-University-Zhuang/Z-Admin>

# 进入项目目录
cd z-admin

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 📝 开发指南

### 项目结构
```
z-admin
├── src/                    # 源代码
│   ├── api/               # API 接口
│   ├── assets/            # 静态资源
│   ├── components/        # 公共组件
│   ├── layout/           # 布局组件
│   ├── router/           # 路由配置
│   ├── store/            # Pinia 状态管理
│   ├── styles/           # 全局样式
│   ├── utils/            # 工具函数
│   └── views/            # 页面组件
│       ├── id-photo/     # AI证件照模块
│       ├── career-planning/ # AI职业规划模块
│       │   ├── Analysis.vue    # 职业分析
│       │   ├── Roadmap.vue     # 发展规划
│       │   └── Recommendation.vue # 职业推荐
│       └── exam/        # 考试中心模块
│           ├── CivilService.vue # 公务员考试
│           ├── Graduate.vue    # 考研备考
│           └── Practice.vue    # 模拟练习
├── public/                # 公共资源
├── .env.*                 # 环境变量配置
├── vite.config.ts        # Vite 配置
└── tsconfig.json         # TypeScript 配置
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
