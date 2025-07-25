# AI产品经理 Demo

> 智能需求分析与代码生成平台 - 集成美团AI基建

一个基于美团AI基建技术的AI产品经理demo，能够将模糊的业务想法转化为精确的产品需求和可执行的AI coding提示词。

## 🚀 项目简介

AI产品经理是一个创新的产品工具，旨在降低产品需求定义的门槛，让任何人都能通过AI技术快速实现产品想法。

### 核心功能

- **智能需求收集**: 支持自然语言输入和文件上传
- **AI驱动问答**: 美团AI基建生成个性化问题完善需求细节
- **智能文档生成**: AI自动生成标准的MRD/PRD文档
- **代码提示词生成**: 输出高质量的AI coding提示词
- **实时代码演示**: 展示AI代码生成的完整过程

### 技术特性

- ⚡ **现代化技术栈**: Next.js 14 + React 18 + TypeScript
- 💅 **优雅UI设计**: Tailwind CSS + 响应式设计
- 🤖 **美团AI基建集成**: 已接入美团内部AI服务
- 📱 **多模态交互**: 支持文件上传和图像识别
- 🔧 **完整工具链**: ESLint + Prettier + Monaco Editor
- 🎯 **智能分析**: AI置信度评估和错误处理

## 📦 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn
- 现代浏览器

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd ai-product-manager-demo
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **配置环境变量**
```bash
# 复制环境变量示例文件
cp env.example .env.local

# 编辑 .env.local 文件
# 美团AI基建配置已预设，您也可以配置其他AI服务
```

默认配置（美团AI基建）：
```env
NEXT_PUBLIC_AI_API_KEY=21911738743019769886
NEXT_PUBLIC_AI_BASE_URL=https://aigc.sankuai.com/v1/openai/native
NEXT_PUBLIC_AI_MODEL=anthropic.claude-3.7-sonnet
```

4. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

5. **访问应用**
打开浏览器访问 http://localhost:3000

## 🏗️ 项目结构

```
ai-product-manager-demo/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── globals.css      # 全局样式
│   │   ├── layout.tsx       # 根布局
│   │   └── page.tsx         # 主页面
│   ├── components/          # React组件
│   │   ├── RequirementCollector.tsx    # 需求收集
│   │   ├── QuestionnaireFlow.tsx       # 智能问答
│   │   ├── RequirementDocument.tsx     # 文档生成
│   │   ├── CodePromptGenerator.tsx     # 提示词生成
│   │   ├── FileUploader.tsx            # 文件上传
│   │   └── AICodeDemo.tsx              # 代码演示
│   └── lib/                 # 工具库
│       ├── api.ts           # 美团AI API接口
│       └── utils.ts         # 通用工具函数
├── public/                  # 静态资源
├── env.example             # 环境变量示例
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript配置
├── tailwind.config.js      # Tailwind配置
├── next.config.js          # Next.js配置
└── README.md               # 项目文档
```

## 🔧 功能详解

### 1. 智能需求收集模块

- **自然语言输入**: 支持大白话描述需求
- **示例引导**: 提供常见需求模板
- **文件上传**: 支持PRD、截图等多种格式
- **AI实时分析**: 美团AI基建实时分析需求内容

### 2. AI驱动问答模块

- **智能问题生成**: 美团AI基建根据需求内容生成针对性问题
- **多种问题类型**: 单选、多选、文本输入
- **置信度评估**: 显示AI分析的置信度
- **智能分类**: 按业务维度组织问题

### 3. AI文档生成模块

- **智能内容生成**: 美团AI基建生成专业文档内容
- **标准格式**: 支持MRD/PRD等标准文档格式
- **在线编辑**: 支持实时编辑和预览
- **一键导出**: 支持Markdown格式下载

### 4. 代码提示词生成

- **AI优化提示词**: 美团AI基建生成高质量提示词
- **智能技术栈检测**: 自动识别适合的技术方案
- **分层提示词**: 系统、功能、技术、结构等多层次
- **Cursor优化**: 专门适配Cursor等AI编程工具

### 5. AI代码演示

- **实时代码生成**: 模拟AI编程过程
- **多文件支持**: 展示完整项目结构
- **语法高亮**: Monaco Editor提供专业编辑体验
- **项目下载**: 支持生成代码的打包下载

## 🔌 AI服务集成

### 美团AI基建配置

项目已集成美团内部AI基建服务：

```typescript
// 配置信息
const config = {
  apiKey: "21911738743019769886",  // 您的AppID
  baseUrl: "https://aigc.sankuai.com/v1/openai/native",
  model: "anthropic.claude-3.7-sonnet",  // Claude-3.7模型
  timeout: 30000
}
```

### 支持的AI功能

- **需求分析**: 智能分析用户需求并生成问题
- **文档生成**: 自动生成结构化产品文档
- **提示词生成**: 生成高质量的AI编程提示词
- **置信度评估**: 评估AI分析结果的可信度
- **错误处理**: 智能fallback机制

### API调用示例

```typescript
import { aiAPI } from '@/lib/api'

// 需求分析
const analysisResult = await aiAPI.analyzeRequirement({
  requirement: "用户需求描述",
  uploadedFiles: files
})

// 文档生成
const documentResult = await aiAPI.generateDocument({
  requirement: "需求内容",
  questionsData: questionsData,
  documentType: "MRD"
})

// 代码提示词生成
const promptResult = await aiAPI.generateCodePrompts({
  requirementDoc: requirementDoc
})
```

## 🎨 使用流程

### 完整工作流程

1. **需求输入** → 用户描述产品想法，可上传相关文件
2. **AI分析** → 美团AI基建分析需求，生成置信度评估
3. **智能问答** → AI生成个性化问题，用户逐一回答
4. **文档生成** → AI自动生成结构化的MRD/PRD文档
5. **提示词生成** → 输出高质量的AI coding提示词
6. **代码演示** → 展示完整的AI编程过程

### 最佳实践

- **详细描述**: 尽量详细描述使用场景和期望效果
- **文件上传**: 上传现有产品截图有助于AI理解
- **认真回答**: 仔细回答AI生成的问题，提供准确信息
- **文档检查**: 查看AI生成的文档并适当修改
- **提示词调优**: 根据实际需要调整提示词内容

## 🚀 AI服务特性

### 智能化程度

- **自然语言理解**: 准确理解用户的模糊需求描述
- **上下文分析**: 结合文件上传内容进行综合分析
- **个性化问题**: 根据需求类型生成针对性问题
- **专业文档**: 生成符合行业标准的产品文档
- **技术适配**: 智能匹配合适的技术栈和实现方案

### 错误处理机制

- **API状态检测**: 实时检测美团AI服务状态
- **智能降级**: API失败时自动使用本地模板
- **错误提示**: 友好的错误信息和处理建议
- **数据备份**: 确保用户输入数据不丢失

## 📈 性能监控

### API调用监控

- **TraceId追踪**: 每个请求都有唯一的追踪ID
- **置信度评估**: 显示AI分析结果的可信度
- **响应时间**: 监控API调用的响应时间
- **错误率统计**: 统计API调用的成功率

### 用户体验优化

- **加载状态**: 详细的加载进度提示
- **实时反馈**: 即时显示AI分析结果
- **离线支持**: API不可用时的降级方案
- **数据持久化**: 用户数据的本地保存

## 🛠️ 开发部署

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 启动生产服务器
npm start
```

### 环境配置

确保正确配置以下环境变量：

```env
# 必需配置
NEXT_PUBLIC_AI_API_KEY=your_app_id
NEXT_PUBLIC_AI_BASE_URL=https://aigc.sankuai.com/v1/openai/native
NEXT_PUBLIC_AI_MODEL=anthropic.claude-3.7-sonnet

# 可选配置
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_LOG_LEVEL=info
```

### 部署选项

- **Vercel**: 推荐用于快速部署
- **Docker**: 支持容器化部署
- **传统服务器**: 支持Node.js环境部署

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 开发规范

- 使用TypeScript进行类型安全开发
- 遵循ESLint和Prettier代码规范
- 编写有意义的提交信息
- 添加必要的错误处理

### API扩展

如需扩展其他AI服务，可参考`src/lib/api.ts`中的实现：

```typescript
// 添加新的AI服务配置
export const customAIConfig: AIConfig = {
  apiKey: "your-api-key",
  baseUrl: "your-api-base-url",
  model: "your-model",
  timeout: 30000
}
```

## 📄 许可证

MIT License

## 🔗 相关链接

- [Next.js文档](https://nextjs.org/docs)
- [React文档](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- [美团AI基建](https://aigc.sankuai.com)

## 💬 联系方式

如有问题或建议，请通过以下方式联系：

- 提交Issue: [GitHub Issues](https://github.com/your-repo/issues)
- 技术交流: 欢迎在Issue中讨论技术问题
- 功能建议: 通过Issue提交新功能建议

---

**基于美团AI基建，让每个想法都能成为现实** 🚀

### 🎯 演示亮点

- **真实AI集成**: 实际接入美团AI基建服务
- **智能化程度高**: 从需求分析到代码生成的全流程AI支持
- **用户体验优秀**: 现代化UI设计和流畅的交互体验
- **技术栈先进**: 使用最新的前端技术和最佳实践
- **功能完整性**: 覆盖产品经理工作的完整流程
- **实用性强**: 生成的文档和代码提示词可直接使用

适合用于AI创意大赛展示、技术分享和实际业务场景应用。 