'use client'

import { useState, useEffect } from 'react'
import { FileText, Download, Edit, Check, X, Copy, Sparkles, AlertCircle } from 'lucide-react'
import { aiAPI } from '@/lib/api'

interface RequirementDocumentProps {
  requirement: string
  questionsData: any
  onComplete: (data: any) => void
  isLoading: boolean
}

interface DocumentSection {
  id: string
  title: string
  content: string
  editable: boolean
}

export default function RequirementDocument({ 
  requirement, 
  questionsData, 
  onComplete, 
  isLoading 
}: RequirementDocumentProps) {
  const [document, setDocument] = useState<DocumentSection[]>([])
  const [isGenerating, setIsGenerating] = useState(true)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [documentType, setDocumentType] = useState<'MRD' | 'PRD'>('MRD')
  const [apiError, setApiError] = useState<string>('')
  const [isUsingAI, setIsUsingAI] = useState(false)

  useEffect(() => {
    generateDocument()
  }, [requirement, questionsData])

  const generateDocument = async () => {
    setIsGenerating(true)
    setApiError('')
    
    try {
      // 尝试调用Friday平台 API生成文档
      setIsUsingAI(true)
      const aiResult = await aiAPI.generateDocument({
        requirement,
        questionsData,
        documentType
      })

      if (aiResult.document && aiResult.document.length > 0) {
        // 使用AI生成的文档
        const formattedDoc = aiResult.document.map((section: any) => ({
          ...section,
          editable: true
        }))
        setDocument(formattedDoc)
      } else {
        // 如果AI返回空结果，使用默认生成
        throw new Error('AI返回空文档')
      }
    } catch (error) {
      console.error('AI文档生成失败:', error)
      setApiError('AI文档生成失败，使用默认模板生成')
      setIsUsingAI(false)
      
      // 使用本地生成逻辑作为fallback
      await new Promise(resolve => setTimeout(resolve, 1000))
      const generatedDoc = generateDocumentSections()
      setDocument(generatedDoc)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateDocumentSections = (): DocumentSection[] => {
    const answers = questionsData?.answers || {}
    
    return [
      {
        id: 'overview',
        title: '1. 产品概述',
        content: `
### 产品名称
${extractProductName(requirement)}

### 核心功能
${requirement}

### 目标用户
${Array.isArray(answers.target_users) ? answers.target_users.join('、') : '待确定'}

### 核心价值
${answers.core_value || '提升用户效率，解决特定场景下的痛点问题'}
        `,
        editable: true
      },
      {
        id: 'user_scenarios',
        title: '2. 用户场景分析',
        content: `
### 使用频率
${answers.usage_frequency || '待确定'}

### 主要使用场景
- 场景一：用户需要快速获取相关信息时
- 场景二：处理重复性工作任务时
- 场景三：提升工作效率的日常操作中

### 用户痛点
${Array.isArray(answers.current_pain_points) ? 
  answers.current_pain_points.map((point: string) => `- ${point}`).join('\n') : 
  '- 当前解决方案效率低下\n- 操作流程复杂\n- 缺乏有效工具支持'
}
        `,
        editable: true
      },
      {
        id: 'functional_requirements',
        title: '3. 功能需求',
        content: `
### 核心功能模块
${generateFunctionalRequirements(requirement, answers)}

### 优先级排序
${answers.priority_features ? 
  answers.priority_features.split(/[,，\n]/).map((feature: string, index: number) => 
    `${index + 1}. ${feature.trim()}`
  ).join('\n') : 
  '1. 核心功能实现\n2. 用户界面优化\n3. 性能提升'
}

### 技术规格要求
${generateTechnicalSpecs(answers)}
        `,
        editable: true
      },
      {
        id: 'performance_requirements',
        title: '4. 性能需求',
        content: `
### 响应时间要求
${answers.performance_target || '页面加载时间 < 3秒，操作响应时间 < 1秒'}

### 并发处理能力
- 支持同时在线用户数：${answers.target_users?.includes('企业用户') ? '1000+' : '100+'}
- 数据处理能力：满足日常业务需求

### 兼容性要求
${answers.browser_support ? 
  `支持浏览器：${answers.browser_support.join('、')}` : 
  '支持主流浏览器和操作系统'
}
        `,
        editable: true
      },
      {
        id: 'implementation_plan',
        title: '5. 实施计划',
        content: `
### 开发周期
${answers.budget_timeline || '2-4周'}

### 里程碑规划
- 第1周：需求分析和技术方案设计
- 第2周：核心功能开发
- 第3周：测试和优化
- 第4周：部署上线

### 风险评估
- 技术风险：中等（可控）
- 时间风险：低
- 资源风险：低

### 成功标准
- 核心功能完整实现
- 用户体验良好
- 性能指标达标
        `,
        editable: true
      }
    ]
  }

  const extractProductName = (req: string): string => {
    if (req.includes('插件')) return '浏览器插件工具'
    if (req.includes('平台')) return '数据分析平台'
    if (req.includes('系统')) return '管理系统'
    return '智能工具产品'
  }

  const generateFunctionalRequirements = (req: string, answers: any): string => {
    const features = []
    
    if (req.includes('插件')) {
      features.push('- 浏览器插件核心功能')
      features.push('- 数据获取和处理')
      features.push('- 用户界面展示')
      if (answers.data_source) {
        features.push(`- 数据来源：${answers.data_source}`)
      }
    } else if (req.includes('优化')) {
      features.push('- 性能优化模块')
      features.push('- 用户体验改进')
      features.push('- 系统稳定性提升')
    } else {
      features.push('- 核心业务功能')
      features.push('- 用户管理模块')
      features.push('- 数据处理模块')
    }
    
    return features.join('\n')
  }

  const generateTechnicalSpecs = (answers: any): string => {
    const specs = []
    
    if (answers.browser_support) {
      specs.push(`浏览器支持：${answers.browser_support.join('、')}`)
    }
    if (answers.data_source) {
      specs.push(`数据来源：${answers.data_source}`)
    }
    specs.push('前端技术：HTML5/CSS3/JavaScript')
    specs.push('后端技术：Node.js/Python（可选）')
    
    return specs.map(spec => `- ${spec}`).join('\n')
  }

  const handleSectionEdit = (sectionId: string, newContent: string) => {
    setDocument(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, content: newContent }
        : section
    ))
  }

  const handleComplete = () => {
    onComplete({
      document,
      documentType,
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0',
        requirement,
        questionsData,
        generatedBy: isUsingAI ? 'AI' : 'Template'
      }
    })
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const downloadDocument = () => {
    const fullContent = document.map(section => 
      `${section.title}\n${'='.repeat(section.title.length)}\n${section.content}\n\n`
    ).join('')
    
    const blob = new Blob([fullContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${documentType}_${new Date().toISOString().split('T')[0]}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isGenerating) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {isUsingAI ? 'Friday平台正在生成需求文档' : 'AI正在生成需求文档'}
        </h3>
        <p className="text-gray-600">正在分析您的需求和回答，生成结构化的产品文档...</p>
        <div className="mt-4 space-y-2">
          <div className="text-sm text-gray-500">✓ 分析用户需求</div>
          <div className="text-sm text-gray-500">✓ 整理问答内容</div>
          <div className="text-sm text-gray-500 loading-dots">
            {isUsingAI ? '调用Friday平台基建' : '生成文档结构'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">需求文档生成</h2>
        <p className="text-lg text-gray-600">
          {isUsingAI ? 'Friday平台基建' : 'AI'}已为您生成结构化的产品需求文档，您可以查看、编辑和下载
        </p>
      </div>

      {/* API状态提示 */}
      {apiError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center space-x-2 mb-6">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <span className="text-yellow-800">{apiError}</span>
        </div>
      )}

      {/* AI生成状态 */}
      {isUsingAI && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-green-600" />
            <div>
              <h4 className="text-sm font-medium text-green-900">AI文档生成成功</h4>
              <p className="text-sm text-green-700">
                文档由Friday平台基建智能生成，内容更加专业和个性化
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Document Type Selector */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setDocumentType('MRD')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              documentType === 'MRD'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            MRD (市场需求文档)
          </button>
          <button
            onClick={() => setDocumentType('PRD')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              documentType === 'PRD'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            PRD (产品需求文档)
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          <span className="text-sm text-gray-700">
            文档已生成完成，您可以编辑任意部分
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={downloadDocument}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>下载文档</span>
          </button>
        </div>
      </div>

      {/* Document Sections */}
      <div className="space-y-6">
        {document.map((section, index) => (
          <div key={section.id} className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(section.content)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="复制内容"
                >
                  <Copy className="h-4 w-4" />
                </button>
                {section.editable && (
                  <button
                    onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {editingSection === section.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Edit className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-4">
              {editingSection === section.id ? (
                <textarea
                  value={section.content}
                  onChange={(e) => handleSectionEdit(section.id, e.target.value)}
                  className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                />
              ) : (
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                    {section.content}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Complete Button */}
      <div className="flex justify-center pt-6">
        <button
          onClick={handleComplete}
          className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <FileText className="h-5 w-5" />
          <span>确认文档，继续生成代码提示词</span>
        </button>
      </div>

      {/* Document Stats */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{document.length}</div>
            <div className="text-sm text-blue-800">文档章节</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {document.reduce((acc, section) => acc + section.content.length, 0)}
            </div>
            <div className="text-sm text-blue-800">字符数</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{documentType}</div>
            <div className="text-sm text-blue-800">文档类型</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {isUsingAI ? 'AI生成' : '模板'}
            </div>
            <div className="text-sm text-blue-800">生成方式</div>
          </div>
        </div>
      </div>
    </div>
  )
} 