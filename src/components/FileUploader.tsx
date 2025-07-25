'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, Image, X, AlertCircle, CheckCircle } from 'lucide-react'

interface FileUploaderProps {
  onFilesChange: (files: File[]) => void
  maxFiles?: number
  acceptedTypes?: string[]
  maxFileSize?: number // in MB
}

interface UploadedFile {
  file: File
  id: string
  status: 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

export default function FileUploader({ 
  onFilesChange, 
  maxFiles = 5, 
  acceptedTypes = ['.pdf', '.doc', '.docx', '.txt', '.png', '.jpg', '.jpeg'],
  maxFileSize = 10 
}: FileUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    
    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (files: File[]) => {
    if (uploadedFiles.length + files.length > maxFiles) {
      alert(`最多只能上传${maxFiles}个文件`)
      return
    }

    files.forEach(file => {
      // 验证文件类型
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      if (!acceptedTypes.includes(fileExtension)) {
        alert(`不支持的文件类型: ${file.name}`)
        return
      }

      // 验证文件大小
      if (file.size > maxFileSize * 1024 * 1024) {
        alert(`文件过大: ${file.name} (最大${maxFileSize}MB)`)
        return
      }

      const fileId = Math.random().toString(36).substr(2, 9)
      const uploadFile: UploadedFile = {
        file,
        id: fileId,
        status: 'uploading',
        progress: 0
      }

      setUploadedFiles(prev => [...prev, uploadFile])

      // 模拟文件上传过程
      simulateUpload(fileId)
    })
  }

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadedFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = Math.min(file.progress + Math.random() * 30, 100)
          
          if (newProgress >= 100) {
            clearInterval(interval)
            return { ...file, status: 'success' as const, progress: 100 }
          }
          
          return { ...file, progress: newProgress }
        }
        return file
      }))
    }, 200)

    // 模拟可能的错误
    if (Math.random() < 0.1) { // 10% 错误率
      setTimeout(() => {
        clearInterval(interval)
        setUploadedFiles(prev => prev.map(file => 
          file.id === fileId 
            ? { ...file, status: 'error' as const, error: '上传失败，请重试' }
            : file
        ))
      }, 1000)
    }
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const newFiles = prev.filter(file => file.id !== fileId)
      onFilesChange(newFiles.map(f => f.file))
      return newFiles
    })
  }

  const retryUpload = (fileId: string) => {
    setUploadedFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, status: 'uploading' as const, progress: 0, error: undefined }
        : file
    ))
    simulateUpload(fileId)
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    if (['png', 'jpg', 'jpeg', 'gif'].includes(extension || '')) {
      return <Image className="h-4 w-4 text-blue-500" />
    }
    return <FileText className="h-4 w-4 text-gray-500" />
  }

  // 通知父组件文件变化
  const successFiles = uploadedFiles.filter(f => f.status === 'success').map(f => f.file)
  if (successFiles.length !== uploadedFiles.filter(f => f.status === 'success').length) {
    onFilesChange(successFiles)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
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
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 mb-2">
          拖拽文件到此处或
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-500 hover:text-blue-600 underline ml-1"
          >
            点击上传
          </button>
        </p>
        <p className="text-sm text-gray-500">
          支持 {acceptedTypes.join(', ')} 格式，最大 {maxFileSize}MB
        </p>
        <p className="text-xs text-gray-400 mt-1">
          最多上传 {maxFiles} 个文件
        </p>
      </div>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            已上传文件 ({uploadedFiles.filter(f => f.status === 'success').length}/{uploadedFiles.length})
          </h4>
          
          {uploadedFiles.map((uploadedFile) => (
            <div key={uploadedFile.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1">
                  {getFileIcon(uploadedFile.file.name)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 truncate">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Status Icon */}
                  {uploadedFile.status === 'success' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {uploadedFile.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  {uploadedFile.status === 'uploading' && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  )}

                  {/* Actions */}
                  {uploadedFile.status === 'error' && (
                    <button
                      onClick={() => retryUpload(uploadedFile.id)}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      重试
                    </button>
                  )}
                  
                  <button
                    onClick={() => removeFile(uploadedFile.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              {uploadedFile.status === 'uploading' && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadedFile.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    上传中... {Math.round(uploadedFile.progress)}%
                  </p>
                </div>
              )}

              {/* Error Message */}
              {uploadedFile.status === 'error' && uploadedFile.error && (
                <div className="mt-2 text-sm text-red-600 bg-red-50 rounded p-2">
                  {uploadedFile.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* File Type Help */}
      {uploadedFiles.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-800 mb-2">💡 建议上传的文件类型</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>产品文档：</strong> PRD、MRD、需求文档 (PDF, Word)</p>
            <p><strong>设计稿：</strong> UI设计图、原型图 (PNG, JPG)</p>
            <p><strong>现有功能：</strong> 产品截图、功能说明 (图片格式)</p>
          </div>
        </div>
      )}
    </div>
  )
} 