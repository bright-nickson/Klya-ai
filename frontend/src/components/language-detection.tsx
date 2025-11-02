'use client'

import { useState, useEffect } from 'react'
import { Globe, Sparkles, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface DetectionResult {
  text: string
  detectedLanguage: string
  confidence: number
  metadata: {
    processedAt: string
    processingTime: number
  }
}

interface LanguageDetectionProps {
  apiToken?: string
}

const languageNames: { [key: string]: string } = {
  'en': 'English',
  'tw': 'Twi (Akan)',
  'ga': 'Ga',
  'ew': 'Ewe',
  'ha': 'Hausa'
}

const languageFlags: { [key: string]: string } = {
  'en': '🇬🇧',
  'tw': '🇬🇭',
  'ga': '🇬🇭',
  'ew': '🇬🇭',
  'ha': '🇳🇬'
}

export function LanguageDetection({ apiToken }: LanguageDetectionProps) {
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [recentDetections, setRecentDetections] = useState<DetectionResult[]>([])

  // Load recent detections from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('languageDetections')
    if (saved) {
      setRecentDetections(JSON.parse(saved))
    }
  }, [])

  const detectLanguage = async () => {
    if (!text.trim()) {
      setError('Please enter some text to detect')
      return
    }

    if (!apiToken) {
      setError('Please provide an API token to use this feature')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('https://klya-ai.vercel.app/api/ai/detect-language', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        },
        body: JSON.stringify({ text })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to detect language')
      }

      if (data.success) {
        setResult(data.data)
        const newDetection = data.data
        const updatedDetections = [newDetection, ...recentDetections.slice(0, 4)]
        setRecentDetections(updatedDetections)
        localStorage.setItem('languageDetections', JSON.stringify(updatedDetections))
      } else {
        throw new Error(data.error || 'Detection failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const clearAll = () => {
    setText('')
    setResult(null)
    setError(null)
  }

  const clearHistory = () => {
    setRecentDetections([])
    localStorage.removeItem('languageDetections')
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100'
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High'
    if (confidence >= 0.6) return 'Medium'
    return 'Low'
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in-up">
        <div className="flex items-center justify-center space-x-3">
          <Globe className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gradient">Language Detection</h1>
          <Sparkles className="w-6 h-6 text-purple-600 animate-pulse-slow" />
        </div>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Detect the language of any text with AI-powered analysis. Supports English, Twi, Ga, Ewe, and Hausa languages.
        </p>
      </div>

      {/* Main Detection Interface */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="card p-6 hover-lift">
            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Enter Text</span>
            </h2>
            
            <div className="space-y-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here... (e.g., 'Akwaaba! Welcome to Ghana')"
                className="input min-h-[120px] resize-none focus-ring"
                disabled={isLoading}
              />
              
              <div className="flex space-x-3">
                <button
                  onClick={detectLanguage}
                  disabled={isLoading || !text.trim() || !apiToken}
                  className="btn-primary btn-enhanced flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Detecting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Detect Language</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={clearAll}
                  className="btn-outline px-4 py-2 hover-scale"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* API Token Notice */}
            {!apiToken && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Please provide an API token to use this feature</span>
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="card p-4 border-red-200 bg-red-50 dark:bg-red-900/20 animate-fade-in-up">
              <div className="flex items-center space-x-2 text-red-800 dark:text-red-200">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className="card p-6 border-green-200 bg-green-50 dark:bg-green-900/20 animate-scale-in">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                  Detection Result
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{languageFlags[result.detectedLanguage] || '🌐'}</span>
                  <div>
                    <div className="font-semibold text-lg">
                      {languageNames[result.detectedLanguage] || result.detectedLanguage.toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Code: {result.detectedLanguage}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Confidence:</span>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                    {getConfidenceText(result.confidence)} ({Math.round(result.confidence * 100)}%)
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <div>Processed: {new Date(result.metadata.processedAt).toLocaleString()}</div>
                  <div>Processing time: {result.metadata.processingTime}ms</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Detections */}
        <div className="space-y-6">
          <div className="card p-6 hover-lift">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>Recent Detections</span>
              </h2>
              {recentDetections.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                  Clear History
                </button>
              )}
            </div>
            
            {recentDetections.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No recent detections</p>
                <p className="text-sm">Your language detection history will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentDetections.map((detection, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover-scale cursor-pointer"
                    onClick={() => {
                      setText(detection.text)
                      setResult(detection)
                    }}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg">{languageFlags[detection.detectedLanguage] || '🌐'}</span>
                      <span className="font-medium">{languageNames[detection.detectedLanguage] || detection.detectedLanguage}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(detection.confidence)}`}>
                        {Math.round(detection.confidence * 100)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {detection.text}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(detection.metadata.processedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Language Support Info */}
          <div className="card p-6 hover-lift">
            <h3 className="text-lg font-semibold mb-4">Supported Languages</h3>
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(languageNames).map(([code, name]) => (
                <div key={code} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-xl">{languageFlags[code]}</span>
                  <div>
                    <div className="font-medium">{name}</div>
                    <div className="text-sm text-gray-500">{code.toUpperCase()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
