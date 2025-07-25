'use client'

import { useState, useRef } from 'react'
import { Send, Upload, FileText, Lightbulb, Mic, Image, AlertCircle } from 'lucide-react'
import { aiAPI } from '@/lib/api'

interface RequirementCollectorProps {
  onComplete: (data: { requirement: string; files?: File[]; aiAnalysis?: any }) => void
  isLoading: boolean
}

export default function RequirementCollector({ onComplete, isLoading }: RequirementCollectorProps) {
  const [requirement, setRequirement] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [apiError, setApiError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const exampleRequirements = [
    {
      title: '浏览器插件',
      description: '我想做个浏览器插件，在淘宝、京东等购物网站上显示商品的历史价格走势，帮助用户判断是否为最低价',
      type: '个人工具'
    },
    {
      title: '功能优化',
      description: '我们的数据分析平台查询速度很慢，希望优化查询功能，支持更快的数据检索和可视化展示',
      type: '功能改进'
    },
    {
      title: '新产品',
      description: '开发一个团队协作工具，支持项目管理、文档共享、实时聊天，类似于Slack和Notion的结合',
      type: '新产品开发'
    }
  ]

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files)
      setUploadedFiles(prev => [...prev, ...newFiles])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setUploadedFiles(prev => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!requirement.trim()) return

    setIsAnalyzing(true)
    setApiError('')

    try {
      // 调用Friday平台 API进行需求分析
      const analysisResult = await aiAPI.analyzeRequirement({
        requirement: requirement.trim(),
        uploadedFiles: uploadedFiles
      })

      onComplete({
        requirement: requirement.trim(),
        files: uploadedFiles,
        aiAnalysis: analysisResult
      })
    } catch (error) {
      console.error('AI分析失败:', error)
      setApiError('AI分析失败，将使用默认问题流程')
      
      // 即使API失败，也继续流程，使用mock数据
      onComplete({
        requirement: requirement.trim(),
        files: uploadedFiles
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const useExample = (example: string) => {
    setRequirement(example)
  }

  const currentIsLoading = isLoading || isAnalyzing

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">描述您的产品想法</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          用大白话告诉我您想要实现的功能或解决的问题，AI产品经理会帮您完善需求细节
        </p>
      </div>

      {/* API错误提示 */}
      {apiError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <span className="text-yellow-800">{apiError}</span>
        </div>
      )}

      {/* Examples */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {exampleRequirements.map((example, index) => (
          <div
            key={index}
            onClick={() => useExample(example.description)}
            className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all"
          >
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {example.type}
              </span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">{example.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-3">{example.description}</p>
          </div>
        ))}
      </div>

      {/* Main Input */}
      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            placeholder="请详细描述您的想法或需求..."
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={currentIsLoading}
          />
          <div className="absolute bottom-3 right-3 flex space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" disabled={currentIsLoading}>
              <Mic className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              onChange={handleFileSelect}
              className="hidden"
              disabled={currentIsLoading}
            />
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 mb-2">
              拖拽文件到此处或
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-500 hover:text-blue-600 underline ml-1"
                disabled={currentIsLoading}
              >
                点击上传
              </button>
            </p>
            <p className="text-sm text-gray-500">
              支持 PDF、Word、图片等格式 (现有产品截图、PRD文档等)
            </p>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">已上传文件:</h4>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                    disabled={currentIsLoading}
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleSubmit}
            disabled={!requirement.trim() || currentIsLoading}
            className={`px-8 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
              requirement.trim() && !currentIsLoading
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>AI分析中...</span>
              </>
            ) : currentIsLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>处理中...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>开始AI分析</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">💡 使用提示</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 尽量描述具体的使用场景和期望效果</li>
              <li>• 如果是现有产品优化，可以上传相关截图或文档</li>
              <li>• 不用担心描述不够专业，AI会帮您完善细节</li>
              <li>• 系统已接入Friday平台基建，将为您提供专业的需求分析</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 