'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Circle, ArrowRight, Brain, MessageCircle, Sparkles, AlertCircle } from 'lucide-react'

interface QuestionnaireFlowProps {
  requirement: string
  uploadedFiles: File[]
  onComplete: (data: any) => void
  isLoading: boolean
  aiAnalysis?: any // 从需求收集步骤传入的AI分析结果
}

interface Question {
  id: string
  type: 'single' | 'multiple' | 'text' | 'range'
  category: string
  question: string
  description?: string
  options?: string[]
  required: boolean
  answer?: any
}

export default function QuestionnaireFlow({ 
  requirement, 
  uploadedFiles, 
  onComplete, 
  isLoading,
  aiAnalysis
}: QuestionnaireFlowProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(true)
  const [aiAnalysisText, setAiAnalysisText] = useState('')

  // 使用AI分析结果或生成默认问题
  useEffect(() => {
    const initializeQuestions = async () => {
      setIsGeneratingQuestions(true)
      
      if (aiAnalysis && aiAnalysis.questions && aiAnalysis.questions.length > 0) {
        // 使用AI分析的结果
        setAiAnalysisText(aiAnalysis.analysis || 'AI已为您生成个性化问题')
        setQuestions(aiAnalysis.questions)
        setIsGeneratingQuestions(false)
      } else {
        // 使用默认问题生成逻辑
        setAiAnalysisText('正在分析您的需求，生成针对性问题...')
        
        // 模拟AI生成延迟
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const generatedQuestions = getQuestionsBasedOnRequirement(requirement)
        setQuestions(generatedQuestions)
        setAiAnalysisText('已为您生成个性化问题，请逐一回答以完善需求细节')
        setIsGeneratingQuestions(false)
      }
    }

    initializeQuestions()
  }, [requirement, aiAnalysis])

  const getQuestionsBasedOnRequirement = (req: string): Question[] => {
    const isPlugin = req.includes('插件') || req.includes('浏览器')
    const isOptimization = req.includes('优化') || req.includes('改进')
    const isNewProduct = req.includes('开发') || req.includes('新')

    let baseQuestions: Question[] = [
      {
        id: 'target_users',
        type: 'multiple',
        category: '用户定位',
        question: '主要目标用户是谁？',
        description: '选择所有适用的用户群体',
        options: ['公司内部员工', '个人用户', '小团队', '企业用户', '开发者', '普通消费者'],
        required: true
      },
      {
        id: 'usage_frequency',
        type: 'single',
        category: '使用场景',
        question: '预期使用频率？',
        options: ['每天多次', '每天一次', '每周几次', '偶尔使用'],
        required: true
      },
      {
        id: 'core_value',
        type: 'text',
        category: '核心价值',
        question: '这个功能/产品最核心的价值是什么？',
        description: '用一句话概括用户从中获得的最大收益',
        required: true
      }
    ]

    if (isPlugin) {
      baseQuestions.push(
        {
          id: 'browser_support',
          type: 'multiple',
          category: '技术规格',
          question: '需要支持哪些浏览器？',
          options: ['Chrome', 'Firefox', 'Safari', 'Edge'],
          required: true
        },
        {
          id: 'data_source',
          type: 'single',
          category: '数据来源',
          question: '数据从哪里获取？',
          options: ['爬取网站数据', '调用第三方API', '用户手动输入', '本地数据库'],
          required: true
        }
      )
    }

    if (isOptimization) {
      baseQuestions.push(
        {
          id: 'current_pain_points',
          type: 'multiple',
          category: '问题分析',
          question: '当前主要痛点有哪些？',
          options: ['响应速度慢', '操作复杂', '功能不完整', '界面不友好', '稳定性差'],
          required: true
        },
        {
          id: 'performance_target',
          type: 'text',
          category: '性能目标',
          question: '期望的性能改进目标是什么？',
          description: '例如：响应时间从5秒降低到1秒',
          required: true
        }
      )
    }

    if (isNewProduct) {
      baseQuestions.push(
        {
          id: 'similar_products',
          type: 'text',
          category: '竞品分析',
          question: '有哪些类似的产品？它们的不足之处是什么？',
          required: true
        },
        {
          id: 'unique_features',
          type: 'text',
          category: '差异化',
          question: '您的产品相比现有方案有什么独特之处？',
          required: true
        }
      )
    }

    // 通用结尾问题
    baseQuestions.push(
      {
        id: 'budget_timeline',
        type: 'single',
        category: '项目规划',
        question: '期望的开发周期？',
        options: ['1周内', '2-4周', '1-2个月', '3个月以上'],
        required: true
      },
      {
        id: 'priority_features',
        type: 'text',
        category: '优先级',
        question: '如果只能实现3个最重要的功能，会是哪些？',
        description: '按重要性排序',
        required: true
      }
    )

    return baseQuestions
  }

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const canProceedToNext = () => {
    const currentQuestion = questions[currentQuestionIndex]
    if (!currentQuestion) return false
    return !currentQuestion.required || answers[currentQuestion.id]
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      // 完成问卷
      onComplete({
        questions,
        answers,
        analysis: aiAnalysisText,
        confidence: aiAnalysis?.confidence || 0.8
      })
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const renderQuestionInput = (question: Question) => {
    const currentAnswer = answers[question.id]

    switch (question.type) {
      case 'single':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={currentAnswer === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="text-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'multiple':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  value={option}
                  checked={currentAnswer?.includes(option) || false}
                  onChange={(e) => {
                    const newAnswer = currentAnswer ? [...currentAnswer] : []
                    if (e.target.checked) {
                      newAnswer.push(option)
                    } else {
                      const index = newAnswer.indexOf(option)
                      if (index > -1) newAnswer.splice(index, 1)
                    }
                    handleAnswerChange(question.id, newAnswer)
                  }}
                  className="text-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'text':
        return (
          <textarea
            value={currentAnswer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="请输入您的回答..."
            className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        )

      default:
        return null
    }
  }

  if (isGeneratingQuestions) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {aiAnalysis ? 'AI正在处理分析结果' : 'AI正在分析您的需求'}
        </h3>
        <p className="text-gray-600">{aiAnalysisText}</p>
        {aiAnalysis && (
          <div className="mt-4 text-sm text-green-600">
            ✓ 已接收到AI分析结果，置信度: {Math.round((aiAnalysis.confidence || 0.8) * 100)}%
          </div>
        )}
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">完善需求细节</h2>
        <p className="text-lg text-gray-600">
          {aiAnalysis ? 'AI' : '系统'}为您生成了{questions.length}个关键问题，请逐一回答以完善需求
        </p>
        {aiAnalysis && (
          <div className="mt-2 text-sm text-blue-600 bg-blue-50 rounded-lg p-2 inline-block">
            🤖 由Friday平台基建智能生成，置信度: {Math.round((aiAnalysis.confidence || 0.8) * 100)}%
          </div>
        )}
      </div>

      {/* AI Analysis Summary */}
      {aiAnalysisText && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <Sparkles className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">AI分析结果</h4>
              <p className="text-sm text-blue-800">{aiAnalysisText}</p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question Progress */}
      <div className="flex items-center justify-center space-x-2 mb-6">
        <MessageCircle className="h-5 w-5 text-blue-500" />
        <span className="text-sm text-gray-600">
          问题 {currentQuestionIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Current Question */}
      {currentQuestion && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {currentQuestion.category}
              </span>
              {currentQuestion.required && (
                <span className="text-red-500 text-sm">*</span>
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {currentQuestion.question}
            </h3>
            {currentQuestion.description && (
              <p className="text-gray-600 text-sm">{currentQuestion.description}</p>
            )}
          </div>

          <div className="mb-6">
            {renderQuestionInput(currentQuestion)}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentQuestionIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              上一题
            </button>

            <div className="text-sm text-gray-500">
              {Object.keys(answers).length} / {questions.filter(q => q.required).length} 必答题已完成
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceedToNext()}
              className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                canProceedToNext()
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>
                {currentQuestionIndex === questions.length - 1 ? '完成问答' : '下一题'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Question Overview */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">问题概览</h4>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((q, index) => (
            <div
              key={q.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs cursor-pointer transition-colors ${
                index === currentQuestionIndex
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : answers[q.id]
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'bg-white border-gray-300 text-gray-400 hover:border-gray-400'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 