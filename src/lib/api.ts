// AI产品经理 - API接口文件
// 集成美团内部AI基建API

export interface AIConfig {
  apiKey: string
  baseUrl: string
  model: string
  timeout?: number
  traceId?: string
}

export interface RequirementAnalysisRequest {
  requirement: string
  uploadedFiles?: File[]
  context?: any
}

export interface RequirementAnalysisResponse {
  questions: Array<{
    id: string
    type: 'single' | 'multiple' | 'text'
    category: string
    question: string
    options?: string[]
    required: boolean
  }>
  analysis: string
  confidence: number
}

export interface DocumentGenerationRequest {
  requirement: string
  questionsData: any
  documentType: 'MRD' | 'PRD'
}

export interface DocumentGenerationResponse {
  document: Array<{
    id: string
    title: string
    content: string
  }>
  metadata: {
    generatedAt: string
    version: string
    wordCount: number
  }
}

export interface CodePromptRequest {
  requirementDoc: any
  techStack?: string[]
  complexity?: 'simple' | 'medium' | 'complex'
}

export interface CodePromptResponse {
  prompts: Array<{
    id: string
    title: string
    content: string
    type: string
  }>
  techStack: string[]
  estimatedTime: string
}

// 生成唯一的TraceId
const generateTraceId = (): string => {
  return `aipm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// AI服务类
export class AIProductManagerAPI {
  private config: AIConfig

  constructor(config: AIConfig) {
    this.config = {
      ...config,
      traceId: config.traceId || generateTraceId()
    }
  }

  /**
   * 调用美团AI基建API的通用方法
   */
  private async callMeituanAI(prompt: string, systemPrompt?: string): Promise<any> {
    try {
      const messages = []
      
      if (systemPrompt) {
        messages.push({
          role: "system",
          content: systemPrompt
        })
      }
      
      messages.push({
        role: "user", 
        content: prompt
      })

      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'M-TraceId': this.config.traceId || generateTraceId(),
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 4000,
          stream: false
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('美团AI API调用失败:', error)
      throw error
    }
  }

  /**
   * 分析用户需求并生成针对性问题
   */
  async analyzeRequirement(request: RequirementAnalysisRequest): Promise<RequirementAnalysisResponse> {
    try {
      const systemPrompt = `你是一位资深的产品经理，擅长需求分析和产品设计。你的任务是分析用户需求并生成针对性的问题来完善需求细节。
      
请以JSON格式返回结果，包含questions数组和analysis字符串。每个问题应该包含id、type、category、question、options(如适用)、required字段。`

      const userPrompt = this.buildRequirementAnalysisPrompt(request)
      
      const response = await this.callMeituanAI(userPrompt, systemPrompt)
      
      try {
        const parsed = JSON.parse(response)
        return {
          questions: parsed.questions || [],
          analysis: parsed.analysis || '基于您的需求，我已生成了相关问题',
          confidence: parsed.confidence || 0.8
        }
      } catch (parseError) {
        console.warn('JSON解析失败，使用默认数据:', parseError)
        return this.getMockRequirementAnalysis(request)
      }
    } catch (error) {
      console.error('需求分析失败:', error)
      return this.getMockRequirementAnalysis(request)
    }
  }

  /**
   * 生成需求文档
   */
  async generateDocument(request: DocumentGenerationRequest): Promise<DocumentGenerationResponse> {
    try {
      const systemPrompt = `你是一位专业的产品经理，擅长编写规范的产品需求文档。请根据用户提供的信息生成结构化的${request.documentType}文档。

请以JSON格式返回，包含document数组和metadata对象。document数组中每个元素包含id、title、content字段。`

      const userPrompt = this.buildDocumentGenerationPrompt(request)
      
      const response = await this.callMeituanAI(userPrompt, systemPrompt)
      
      try {
        const parsed = JSON.parse(response)
        return {
          document: parsed.document || [],
          metadata: parsed.metadata || {
            generatedAt: new Date().toISOString(),
            version: '1.0',
            wordCount: 0
          }
        }
      } catch (parseError) {
        console.warn('JSON解析失败，使用默认数据:', parseError)
        return this.getMockDocumentGeneration(request)
      }
    } catch (error) {
      console.error('文档生成失败:', error)
      return this.getMockDocumentGeneration(request)
    }
  }

  /**
   * 生成代码提示词
   */
  async generateCodePrompts(request: CodePromptRequest): Promise<CodePromptResponse> {
    try {
      const systemPrompt = `你是一位资深的全栈开发工程师和AI编程专家，擅长为AI编程工具（如Cursor）生成高质量的提示词。

请以JSON格式返回，包含prompts数组、techStack数组和estimatedTime字符串。prompts数组中每个元素包含id、title、content、type字段。`

      const userPrompt = this.buildCodePromptGenerationPrompt(request)
      
      const response = await this.callMeituanAI(userPrompt, systemPrompt)
      
      try {
        const parsed = JSON.parse(response)
        return {
          prompts: parsed.prompts || [],
          techStack: parsed.techStack || ['React', 'TypeScript'],
          estimatedTime: parsed.estimatedTime || '2-4周'
        }
      } catch (parseError) {
        console.warn('JSON解析失败，使用默认数据:', parseError)
        return this.getMockCodePromptGeneration(request)
      }
    } catch (error) {
      console.error('代码提示词生成失败:', error)
      return this.getMockCodePromptGeneration(request)
    }
  }

  /**
   * 构建需求分析提示词
   */
  private buildRequirementAnalysisPrompt(request: RequirementAnalysisRequest): string {
    return `
请分析以下用户需求，并生成5-8个关键问题来完善需求细节：

用户需求：
${request.requirement}

${request.uploadedFiles && request.uploadedFiles.length > 0 ? 
  `用户还上传了${request.uploadedFiles.length}个相关文件，这些可能包含产品截图、需求文档等补充信息。` : ''
}

请基于以下维度生成问题：
1. 目标用户和使用场景
2. 核心功能和优先级  
3. 技术实现方式
4. 性能和体验要求
5. 项目周期和资源

每个问题都应该：
- 针对性强，能帮助澄清关键信息
- 提供选择项（如适用）
- 标明是否为必答题

请严格按照以下JSON格式返回：
{
  "questions": [
    {
      "id": "question_1",
      "type": "single|multiple|text",
      "category": "分类名称",
      "question": "问题内容",
      "options": ["选项1", "选项2"] // 仅对single和multiple类型
      "required": true|false
    }
  ],
  "analysis": "需求分析总结",
  "confidence": 0.8
}
`
  }

  /**
   * 构建文档生成提示词
   */
  private buildDocumentGenerationPrompt(request: DocumentGenerationRequest): string {
    return `
请基于以下信息生成一份专业的${request.documentType}文档：

原始需求：
${request.requirement}

问答结果：
${JSON.stringify(request.questionsData, null, 2)}

请生成包含以下章节的文档：
1. 产品概述
2. 用户场景分析  
3. 功能需求
4. 性能需求
5. 实施计划

要求：
- 内容详实、逻辑清晰
- 符合${request.documentType}文档规范
- 适合技术团队参考实现

请严格按照以下JSON格式返回：
{
  "document": [
    {
      "id": "overview",
      "title": "1. 产品概述",
      "content": "详细内容..."
    }
  ],
  "metadata": {
    "generatedAt": "${new Date().toISOString()}",
    "version": "1.0", 
    "wordCount": 1200
  }
}
`
  }

  /**
   * 构建代码提示词生成提示词
   */
  private buildCodePromptGenerationPrompt(request: CodePromptRequest): string {
    return `
请基于以下产品需求文档，生成高质量的AI Coding提示词，专门适配Cursor等AI编程工具：

需求文档：
${JSON.stringify(request.requirementDoc, null, 2)}

请生成以下类型的提示词：
1. 系统提示词 - 设定AI编程助手的角色和能力
2. 项目概述提示词 - 描述项目目标和要求
3. 功能实现提示词 - 具体功能的实现指导
4. 技术实现提示词 - 技术架构和最佳实践
5. 项目结构提示词 - 文件结构和组织方式

要求：
- 提示词要详细、专业，能指导AI生成高质量代码
- 包含具体的技术要求和最佳实践
- 适用于Cursor等AI编程工具
- 能够生成可立即运行的代码

请严格按照以下JSON格式返回：
{
  "prompts": [
    {
      "id": "system_prompt",
      "title": "系统提示词",
      "content": "详细的提示词内容...",
      "type": "system"
    }
  ],
  "techStack": ["React", "TypeScript", "Tailwind CSS"],
  "estimatedTime": "2-4周"
}
`
  }

  // Mock数据方法（用于fallback）
  private getMockRequirementAnalysis(request: RequirementAnalysisRequest): RequirementAnalysisResponse {
    const isPlugin = request.requirement.includes('插件') || request.requirement.includes('浏览器')
    const isOptimization = request.requirement.includes('优化') || request.requirement.includes('改进')
    
    let questions = [
      {
        id: 'target_users',
        type: 'multiple' as const,
        category: '用户定位',
        question: '主要目标用户是谁？',
        options: ['公司内部员工', '个人用户', '小团队', '企业用户', '开发者'],
        required: true
      },
      {
        id: 'usage_frequency', 
        type: 'single' as const,
        category: '使用场景',
        question: '预期使用频率？',
        options: ['每天多次', '每天一次', '每周几次', '偶尔使用'],
        required: true
      },
      {
        id: 'core_value',
        type: 'text' as const,
        category: '核心价值',
        question: '这个功能/产品最核心的价值是什么？',
        required: true
      }
    ]

    if (isPlugin) {
      questions.push({
        id: 'browser_support',
        type: 'multiple' as const,
        category: '技术规格',
        question: '需要支持哪些浏览器？',
        options: ['Chrome', 'Firefox', 'Safari', 'Edge'],
        required: true
      })
    }

    if (isOptimization) {
      questions.push({
        id: 'current_pain_points',
        type: 'multiple' as const,
        category: '问题分析', 
        question: '当前主要痛点有哪些？',
        options: ['响应速度慢', '操作复杂', '功能不完整', '界面不友好'],
        required: true
      })
    }

    return {
      questions,
      analysis: '基于您的需求，我识别出这是一个' + (isPlugin ? '浏览器插件' : isOptimization ? '功能优化' : '新产品开发') + '项目',
      confidence: 0.85
    }
  }

  private getMockDocumentGeneration(request: DocumentGenerationRequest): DocumentGenerationResponse {
    return {
      document: [
        {
          id: 'overview',
          title: '1. 产品概述',
          content: `### 产品名称\n基于AI的智能产品\n\n### 核心功能\n${request.requirement}\n\n### 目标用户\n待进一步确认\n\n### 核心价值\n提升用户效率，解决特定场景下的痛点问题`
        },
        {
          id: 'user_scenarios',
          title: '2. 用户场景分析',
          content: '### 主要使用场景\n- 场景一：用户需要快速完成特定任务时\n- 场景二：处理重复性工作时\n- 场景三：提升工作效率的日常操作中'
        }
      ],
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0',
        wordCount: 800
      }
    }
  }

  private getMockCodePromptGeneration(request: CodePromptRequest): CodePromptResponse {
    return {
      prompts: [
        {
          id: 'system_prompt',
          title: '系统提示词',
          content: '你是一位资深的全栈开发工程师，擅长使用React、TypeScript等现代技术栈开发高质量的应用程序...',
          type: 'system'
        },
        {
          id: 'project_overview',
          title: '项目概述提示词', 
          content: '请基于产品需求，创建一个现代化的Web应用...',
          type: 'functional'
        }
      ],
      techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
      estimatedTime: '2-3周'
    }
  }
}

// 美团AI基建配置
export const meituanAIConfig: AIConfig = {
  apiKey: '21911738743019769886', // 您的AppID
  baseUrl: 'https://aigc.sankuai.com/v1/openai/native',
  model: 'anthropic.claude-3.7-sonnet', // 您的模型ID
  timeout: 30000
}

// 创建默认API实例
export const aiAPI = new AIProductManagerAPI(meituanAIConfig)

// 工具函数
export const validateConfig = (config: AIConfig): boolean => {
  return !!(config.apiKey && config.baseUrl && config.model)
}

export const getApiStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${meituanAIConfig.baseUrl}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${meituanAIConfig.apiKey}`,
        'M-TraceId': generateTraceId(),
      },
    })
    return response.ok
  } catch (error) {
    console.error('API状态检查失败:', error)
    return false
  }
}

// 导出配置供其他模块使用
export { generateTraceId } 