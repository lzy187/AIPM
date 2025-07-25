'use client'

import { useState, useEffect } from 'react'
import { Code, Copy, Download, Wand2, FileCode, Sparkles, CheckCircle } from 'lucide-react'

interface CodePromptGeneratorProps {
  requirementDoc: any
  onComplete: (data: string) => void
  isLoading: boolean
}

interface PromptSection {
  id: string
  title: string
  content: string
  type: 'system' | 'functional' | 'technical' | 'structure'
}

export default function CodePromptGenerator({ 
  requirementDoc, 
  onComplete, 
  isLoading 
}: CodePromptGeneratorProps) {
  const [prompts, setPrompts] = useState<PromptSection[]>([])
  const [isGenerating, setIsGenerating] = useState(true)
  const [selectedPromptType, setSelectedPromptType] = useState<'cursor' | 'general'>('cursor')
  const [techStack, setTechStack] = useState<string[]>([])

  useEffect(() => {
    generateCodePrompts()
  }, [requirementDoc])

  const generateCodePrompts = async () => {
    setIsGenerating(true)
    
    // 模拟AI生成提示词的过程
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    const generatedPrompts = createPromptSections()
    setPrompts(generatedPrompts)
    setIsGenerating(false)
  }

  const createPromptSections = (): PromptSection[] => {
    const doc = requirementDoc?.document || []
    const requirement = doc.find((section: any) => section.id === 'overview')?.content || ''
    const functionalReqs = doc.find((section: any) => section.id === 'functional_requirements')?.content || ''
    
    // 自动检测技术栈
    const detectedTechStack = detectTechStack(requirement + functionalReqs)
    setTechStack(detectedTechStack)

    return [
      {
        id: 'system_prompt',
        title: '系统提示词',
        type: 'system',
        content: generateSystemPrompt(detectedTechStack)
      },
      {
        id: 'project_overview',
        title: '项目概述提示词',
        type: 'functional',
        content: generateProjectOverviewPrompt(requirement)
      },
      {
        id: 'functional_prompt',
        title: '功能实现提示词',
        type: 'functional',
        content: generateFunctionalPrompt(functionalReqs)
      },
      {
        id: 'technical_prompt',
        title: '技术实现提示词',
        type: 'technical',
        content: generateTechnicalPrompt(detectedTechStack, requirement)
      },
      {
        id: 'structure_prompt',
        title: '项目结构提示词',
        type: 'structure',
        content: generateStructurePrompt(detectedTechStack)
      }
    ]
  }

  const detectTechStack = (content: string): string[] => {
    const stack: string[] = []
    
    if (content.includes('插件') || content.includes('浏览器')) {
      stack.push('JavaScript', 'HTML', 'CSS', 'Web Extension API')
    } else if (content.includes('网站') || content.includes('平台')) {
      stack.push('React', 'Next.js', 'TypeScript', 'Tailwind CSS')
    } else if (content.includes('应用') || content.includes('系统')) {
      stack.push('React', 'Node.js', 'TypeScript', 'Express')
    } else {
      // 默认现代Web开发栈
      stack.push('React', 'TypeScript', 'Tailwind CSS')
    }
    
    return stack
  }

  const generateSystemPrompt = (techStack: string[]): string => {
    return `你是一位资深的全栈开发工程师，擅长使用现代技术栈开发高质量的应用程序。

**技术专长:**
${techStack.map(tech => `- ${tech}`).join('\n')}

**开发原则:**
- 编写清晰、可维护的代码
- 遵循最佳实践和设计模式
- 重视用户体验和性能优化
- 确保代码的可读性和可扩展性
- 适当添加注释和文档

**代码风格:**
- 使用TypeScript进行类型安全
- 采用函数式编程和组件化设计
- 遵循ESLint和Prettier规范
- 使用语义化的命名方式

请根据以下需求，提供完整的、可立即运行的代码实现。`
  }

  const generateProjectOverviewPrompt = (requirement: string): string => {
    return `**项目需求:**
${requirement}

**项目目标:**
- 实现上述核心功能
- 提供良好的用户体验
- 确保代码质量和可维护性
- 支持后续功能扩展

**关键要求:**
- 响应式设计，适配多种设备
- 美观的UI界面
- 流畅的交互体验
- 合理的错误处理
- 基本的性能优化

请基于以上需求，创建一个完整的项目实现。`
  }

  const generateFunctionalPrompt = (functionalReqs: string): string => {
    return `**具体功能需求:**
${functionalReqs}

**实现要求:**
- 每个功能模块都要完整实现
- 提供清晰的用户界面
- 包含必要的交互反馈
- 添加适当的加载状态
- 实现基本的错误处理

**用户体验要求:**
- 操作流程要直观明了
- 提供操作提示和帮助信息
- 确保界面响应及时
- 支持常见的用户操作习惯

请逐一实现以上功能，确保每个功能都能正常工作。`
  }

  const generateTechnicalPrompt = (techStack: string[], requirement: string): string => {
    const isPlugin = requirement.includes('插件')
    const isWebApp = requirement.includes('网站') || requirement.includes('平台')
    
    let technicalDetails = `**技术实现要求:**

**项目结构:**
- 使用模块化的代码组织方式
- 分离业务逻辑和UI组件
- 创建可复用的工具函数
- 合理划分文件和目录结构

**技术要点:**
${techStack.map(tech => `- 充分利用${tech}的特性和最佳实践`).join('\n')}
`

    if (isPlugin) {
      technicalDetails += `

**浏览器插件特定要求:**
- 创建完整的manifest.json配置
- 实现background script和content script
- 处理跨域请求和权限管理
- 提供popup界面和options页面
- 确保在不同网站上的兼容性`
    }

    if (isWebApp) {
      technicalDetails += `

**Web应用特定要求:**
- 实现路由管理和页面导航
- 添加状态管理（如需要）
- 实现数据持久化
- 添加API集成（如需要）
- 确保SEO友好性`
    }

    technicalDetails += `

**代码质量:**
- 添加TypeScript类型定义
- 实现错误边界和异常处理
- 添加必要的单元测试
- 确保代码可读性和文档完整性

请根据以上技术要求实现项目。`

    return technicalDetails
  }

  const generateStructurePrompt = (techStack: string[]): string => {
    const isReactProject = techStack.includes('React') || techStack.includes('Next.js')
    const isPlugin = techStack.includes('Web Extension API')

    if (isPlugin) {
      return `**浏览器插件项目结构要求:**

请按照以下结构创建项目文件：

\`\`\`
project/
├── manifest.json          # 插件配置文件
├── popup/
│   ├── popup.html         # 弹窗页面
│   ├── popup.js           # 弹窗逻辑
│   └── popup.css          # 弹窗样式
├── content/
│   ├── content.js         # 内容脚本
│   └── content.css        # 注入样式
├── background/
│   └── background.js      # 后台脚本
├── options/
│   ├── options.html       # 设置页面
│   ├── options.js         # 设置逻辑
│   └── options.css        # 设置样式
├── assets/
│   ├── icons/             # 图标文件
│   └── images/            # 图片资源
└── utils/
    └── common.js          # 通用工具函数
\`\`\`

**文件实现要求:**
- manifest.json必须包含完整的权限和配置
- 每个脚本文件都要有清晰的功能分工
- 样式文件要确保不影响原网页
- 工具函数要具有良好的复用性`
    }

    if (isReactProject) {
      return `**React/Next.js项目结构要求:**

请按照以下结构创建项目文件：

\`\`\`
project/
├── src/
│   ├── components/        # React组件
│   │   ├── ui/           # 基础UI组件
│   │   └── features/     # 功能组件
│   ├── pages/            # 页面组件
│   ├── hooks/            # 自定义Hook
│   ├── utils/            # 工具函数
│   ├── types/            # TypeScript类型
│   ├── styles/           # 样式文件
│   └── constants/        # 常量定义
├── public/               # 静态资源
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript配置
├── tailwind.config.js    # Tailwind配置
└── next.config.js        # Next.js配置
\`\`\`

**组件开发要求:**
- 每个组件都要有明确的职责
- 使用TypeScript进行类型约束
- 组件要具有良好的可复用性
- 添加适当的PropTypes或接口定义`
    }

    return `**通用项目结构要求:**

请创建清晰的项目文件结构，包含：
- 源代码目录
- 配置文件
- 样式资源
- 工具函数
- 文档说明

确保每个文件都有明确的用途和良好的组织方式。`
  }

  const getCombinedPrompt = (): string => {
    return prompts.map(prompt => `## ${prompt.title}\n\n${prompt.content}`).join('\n\n---\n\n')
  }

  const copyPrompt = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const copyAllPrompts = () => {
    copyPrompt(getCombinedPrompt())
  }

  const downloadPrompts = () => {
    const content = getCombinedPrompt()
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `AI_Coding_Prompts_${new Date().toISOString().split('T')[0]}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleComplete = () => {
    onComplete(getCombinedPrompt())
  }

  if (isGenerating) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">AI正在生成代码提示词</h3>
        <p className="text-gray-600">正在基于需求文档生成高质量的AI Coding提示词...</p>
        <div className="mt-4 space-y-2">
          <div className="text-sm text-gray-500">✓ 分析技术需求</div>
          <div className="text-sm text-gray-500">✓ 确定技术栈</div>
          <div className="text-sm text-gray-500 loading-dots">生成提示词模板</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Coding 提示词生成</h2>
        <p className="text-lg text-gray-600">
          已为您生成专业的代码提示词，可直接在Cursor等AI编程工具中使用
        </p>
      </div>

      {/* Tech Stack Display */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Code className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">检测到的技术栈</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech, index) => (
            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          <span className="text-sm text-gray-700">
            提示词已生成完成，您可以直接复制使用
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={copyAllPrompts}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center space-x-2"
          >
            <Copy className="h-4 w-4" />
            <span>复制全部</span>
          </button>
          <button
            onClick={downloadPrompts}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>下载</span>
          </button>
        </div>
      </div>

      {/* Prompt Sections */}
      <div className="space-y-4">
        {prompts.map((prompt, index) => (
          <div key={prompt.id} className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  prompt.type === 'system' ? 'bg-purple-500' :
                  prompt.type === 'functional' ? 'bg-blue-500' :
                  prompt.type === 'technical' ? 'bg-green-500' :
                  'bg-orange-500'
                }`}></div>
                <h3 className="text-lg font-semibold text-gray-900">{prompt.title}</h3>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {prompt.type}
                </span>
              </div>
              <button
                onClick={() => copyPrompt(prompt.content)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="复制此部分"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            
            <div className="p-4">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto custom-scrollbar">
                {prompt.content}
              </pre>
            </div>
          </div>
        ))}
      </div>

      {/* Usage Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Wand2 className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800 mb-2">🚀 使用说明</h4>
            <div className="text-sm text-yellow-700 space-y-1">
              <p><strong>在Cursor中使用：</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>复制"系统提示词"到Cursor的系统提示设置中</li>
                <li>复制其他提示词到对话框中，逐步实现功能</li>
                <li>可以分模块进行开发，每次专注一个功能</li>
                <li>根据实际需求调整和优化提示词内容</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Button */}
      <div className="flex justify-center pt-6">
        <button
          onClick={handleComplete}
          className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <CheckCircle className="h-5 w-5" />
          <span>确认提示词，进入AI演示环节</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{prompts.length}</div>
            <div className="text-sm text-blue-800">提示词模块</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{techStack.length}</div>
            <div className="text-sm text-blue-800">技术栈</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(getCombinedPrompt().length / 100)}
            </div>
            <div className="text-sm text-blue-800">百字符数</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">Ready</div>
            <div className="text-sm text-blue-800">状态</div>
          </div>
        </div>
      </div>
    </div>
  )
} 