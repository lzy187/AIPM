'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Upload, FileText, Code, Brain, Sparkles, Download, Copy, Wifi, WifiOff } from 'lucide-react'
import RequirementCollector from '@/components/RequirementCollector'
import QuestionnaireFlow from '@/components/QuestionnaireFlow'
import RequirementDocument from '@/components/RequirementDocument'
import CodePromptGenerator from '@/components/CodePromptGenerator'
import FileUploader from '@/components/FileUploader'
import AICodeDemo from '@/components/AICodeDemo'
import { getApiStatus } from '@/lib/api'

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [userRequirement, setUserRequirement] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [questionsData, setQuestionsData] = useState<any>(null)
  const [requirementDoc, setRequirementDoc] = useState<any>(null)
  const [codePrompts, setCodePrompts] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null)
  const [apiStatus, setApiStatus] = useState<boolean | null>(null)

  const steps = [
    { id: 1, title: '需求收集', icon: FileText, description: '描述您的产品想法' },
    { id: 2, title: '智能问答', icon: Brain, description: 'AI帮您完善需求' },
    { id: 3, title: '需求文档', icon: FileText, description: '生成结构化文档' },
    { id: 4, title: '代码提示词', icon: Code, description: '生成AI Coding提示词' },
    { id: 5, title: 'AI演示', icon: Sparkles, description: '代码生成演示' },
  ]

  // 检查API状态
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const status = await getApiStatus()
        setApiStatus(status)
      } catch (error) {
        console.error('API状态检查失败:', error)
        setApiStatus(false)
      }
    }

    checkApiStatus()
  }, [])

  const handleStepComplete = (step: number, data: any) => {
    switch (step) {
      case 1:
        setUserRequirement(data.requirement)
        setUploadedFiles(data.files || [])
        setAiAnalysisResult(data.aiAnalysis || null)
        setCurrentStep(2)
        break
      case 2:
        setQuestionsData(data)
        setCurrentStep(3)
        break
      case 3:
        setRequirementDoc(data)
        setCurrentStep(4)
        break
      case 4:
        setCodePrompts(data)
        setCurrentStep(5)
        break
    }
  }

  const resetFlow = () => {
    setCurrentStep(1)
    setUserRequirement('')
    setUploadedFiles([])
    setQuestionsData(null)
    setRequirementDoc(null)
    setCodePrompts('')
    setAiAnalysisResult(null)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI产品经理</h1>
                <p className="text-sm text-gray-600">智能需求分析与代码生成</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* API状态指示器 */}
              <div className="flex items-center space-x-2 text-sm">
                {apiStatus === null ? (
                  <div className="flex items-center space-x-1 text-gray-500">
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400"></div>
                    <span>检查中</span>
                  </div>
                ) : apiStatus ? (
                  <div className="flex items-center space-x-1 text-green-600">
                    <Wifi className="h-4 w-4" />
                    <span>Friday平台已连接</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-orange-600">
                    <WifiOff className="h-4 w-4" />
                    <span>离线模式</span>
                  </div>
                )}
              </div>
              <button
                onClick={resetFlow}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
              >
                重新开始
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${
                  currentStep >= step.id
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="text-center mt-2">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* AI Status Banner */}
        {aiAnalysisResult && currentStep >= 2 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="text-sm font-medium text-green-900">AI分析已完成</h4>
                <p className="text-sm text-green-700">
                  Friday平台基建已分析您的需求，置信度: {Math.round((aiAnalysisResult.confidence || 0.8) * 100)}%
                  {aiAnalysisResult.questions && ` | 生成了${aiAnalysisResult.questions.length}个个性化问题`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {currentStep === 1 && (
            <RequirementCollector
              onComplete={(data) => handleStepComplete(1, data)}
              isLoading={isLoading}
            />
          )}

          {currentStep === 2 && (
            <QuestionnaireFlow
              requirement={userRequirement}
              uploadedFiles={uploadedFiles}
              onComplete={(data) => handleStepComplete(2, data)}
              isLoading={isLoading}
              aiAnalysis={aiAnalysisResult}
            />
          )}

          {currentStep === 3 && (
            <RequirementDocument
              requirement={userRequirement}
              questionsData={questionsData}
              onComplete={(data) => handleStepComplete(3, data)}
              isLoading={isLoading}
            />
          )}

          {currentStep === 4 && (
            <CodePromptGenerator
              requirementDoc={requirementDoc}
              onComplete={(data) => handleStepComplete(4, data)}
              isLoading={isLoading}
            />
          )}

          {currentStep === 5 && (
            <AICodeDemo
              codePrompts={codePrompts}
              requirementDoc={requirementDoc}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>© 2024 AI产品经理 - 让每个想法都能成为现实</p>
            <p className="text-sm mt-2">
              基于Friday平台基建技术驱动的智能产品需求分析平台
              {apiStatus && (
                <span className="ml-2 text-green-600">✓ AI服务已连接</span>
              )}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 