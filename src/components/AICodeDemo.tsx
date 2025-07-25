'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, RefreshCw, Download, Copy, Code, Terminal, Eye, Settings } from 'lucide-react'
import dynamic from 'next/dynamic'

// 动态导入Monaco Editor以避免SSR问题
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false }
)

interface AICodeDemoProps {
  codePrompts: string
  requirementDoc: any
}

interface CodeFile {
  name: string
  language: string
  content: string
  path: string
}

export default function AICodeDemo({ codePrompts, requirementDoc }: AICodeDemoProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [generatedFiles, setGeneratedFiles] = useState<CodeFile[]>([])
  const [activeFileIndex, setActiveFileIndex] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  const generateCode = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    setCurrentStep('初始化项目结构...')
    setGeneratedFiles([])
    setLogs([])
    
    addLog('开始AI代码生成')
    
    // 模拟代码生成过程
    const steps = [
      { step: '分析需求文档...', progress: 10 },
      { step: '确定技术栈...', progress: 20 },
      { step: '生成项目结构...', progress: 30 },
      { step: '创建核心组件...', progress: 50 },
      { step: '实现业务逻辑...', progress: 70 },
      { step: '添加样式和交互...', progress: 85 },
      { step: '生成配置文件...', progress: 95 },
      { step: '完成代码生成', progress: 100 }
    ]

    for (const { step, progress } of steps) {
      setCurrentStep(step)
      setGenerationProgress(progress)
      addLog(step)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 在特定步骤生成代码文件
      if (progress === 30) {
        generateProjectFiles()
      } else if (progress === 50) {
        generateComponentFiles()
      } else if (progress === 70) {
        generateLogicFiles()
      } else if (progress === 95) {
        generateConfigFiles()
      }
    }

    setIsGenerating(false)
    addLog('代码生成完成!')
  }

  const generateProjectFiles = () => {
    const files: CodeFile[] = [
      {
        name: 'package.json',
        language: 'json',
        path: '/package.json',
        content: `{
  "name": "ai-generated-project",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18",
    "react-dom": "^18",
    "typescript": "^5",
    "tailwindcss": "^3.3.0"
  }
}`
      }
    ]
    setGeneratedFiles(prev => [...prev, ...files])
    addLog(`生成了 ${files.length} 个项目配置文件`)
  }

  const generateComponentFiles = () => {
    const files: CodeFile[] = [
      {
        name: 'App.tsx',
        language: 'typescript',
        path: '/src/App.tsx',
        content: `import React, { useState } from 'react';
import './App.css';

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const [data, setData] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 核心业务逻辑
      console.log('Processing:', data);
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('操作成功!');
    } catch (error) {
      console.error('Error:', error);
      alert('操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          智能应用
        </h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              输入内容
            </label>
            <input
              type="text"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入内容..."
            />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={loading || !data.trim()}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '处理中...' : '提交'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;`
      }
    ]
    setGeneratedFiles(prev => [...prev, ...files])
    addLog(`生成了 ${files.length} 个React组件`)
  }

  const generateLogicFiles = () => {
    const files: CodeFile[] = [
      {
        name: 'utils.ts',
        language: 'typescript',
        path: '/src/utils/utils.ts',
        content: `// 工具函数库
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN');
};

export const validateInput = (input: string): boolean => {
  return input.trim().length > 0;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const apiCall = async (endpoint: string, data?: any) => {
  try {
    const response = await fetch(endpoint, {
      method: data ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    if (!response.ok) {
      throw new Error('API请求失败');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};`
      }
    ]
    setGeneratedFiles(prev => [...prev, ...files])
    addLog(`生成了 ${files.length} 个工具函数文件`)
  }

  const generateConfigFiles = () => {
    const files: CodeFile[] = [
      {
        name: 'tailwind.config.js',
        language: 'javascript',
        path: '/tailwind.config.js',
        content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [],
}`
      },
      {
        name: 'README.md',
        language: 'markdown',
        path: '/README.md',
        content: `# AI Generated Project

这是一个由AI产品经理自动生成的项目。

## 功能特性

- 🚀 现代化的React应用
- 💅 Tailwind CSS样式
- 📱 响应式设计
- ⚡ TypeScript支持
- 🔧 完整的工具链配置

## 快速开始

\`\`\`bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
\`\`\`

## 项目结构

\`\`\`
src/
├── components/     # React组件
├── utils/         # 工具函数
├── styles/        # 样式文件
└── App.tsx        # 主应用组件
\`\`\`

## 技术栈

- React 18
- TypeScript
- Tailwind CSS
- Next.js

---

由 AI产品经理 自动生成 🤖`
      }
    ]
    setGeneratedFiles(prev => [...prev, ...files])
    addLog(`生成了 ${files.length} 个配置文件`)
  }

  const downloadProject = () => {
    // 创建一个简单的项目下载
    const projectContent = generatedFiles.map(file => 
      `// ${file.path}\n${file.content}\n\n${'='.repeat(50)}\n\n`
    ).join('')
    
    const blob = new Blob([projectContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ai-generated-project.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyCode = () => {
    const currentFile = generatedFiles[activeFileIndex]
    if (currentFile) {
      navigator.clipboard.writeText(currentFile.content)
      addLog(`已复制 ${currentFile.name} 的代码`)
    }
  }

  const currentFile = generatedFiles[activeFileIndex]

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Coding 演示</h2>
        <p className="text-lg text-gray-600">
          基于生成的提示词，演示AI代码生成的完整过程
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">代码生成控制台</h3>
          <div className="flex space-x-2">
            <button
              onClick={generateCode}
              disabled={isGenerating}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                isGenerating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>生成中...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>开始生成代码</span>
                </>
              )}
            </button>
            
            {generatedFiles.length > 0 && (
              <button
                onClick={downloadProject}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>下载项目</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress */}
        {isGenerating && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">{currentStep}</span>
              <span className="text-sm text-gray-600">{generationProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* File Tabs */}
        {generatedFiles.length > 0 && (
          <div className="border-b border-gray-200 mb-4">
            <div className="flex space-x-1 overflow-x-auto">
              {generatedFiles.map((file, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFileIndex(index)}
                  className={`px-3 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap ${
                    index === activeFileIndex
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {file.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Code Editor */}
        {currentFile && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Code className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{currentFile.path}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={copyCode}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="复制代码"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="预览效果"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <MonacoEditor
                height="400px"
                language={currentFile.language}
                value={currentFile.content}
                theme="vs-light"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  fontFamily: 'Fira Code, Monaco, monospace',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Console Logs */}
      <div className="bg-gray-900 text-gray-100 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Terminal className="h-4 w-4" />
          <h4 className="text-sm font-medium">生成日志</h4>
        </div>
        <div className="bg-black rounded p-3 h-32 overflow-y-auto font-mono text-sm">
          {logs.length === 0 ? (
            <div className="text-gray-500">等待开始代码生成...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="text-green-400">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Statistics */}
      {generatedFiles.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">生成统计</h4>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{generatedFiles.length}</div>
              <div className="text-sm text-blue-800">文件数量</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {generatedFiles.reduce((acc, file) => acc + file.content.split('\n').length, 0)}
              </div>
              <div className="text-sm text-blue-800">代码行数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {new Set(generatedFiles.map(f => f.language)).size}
              </div>
              <div className="text-sm text-blue-800">编程语言</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-blue-800">完成度</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 