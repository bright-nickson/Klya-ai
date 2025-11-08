'use client'

import { useState, useEffect, useRef } from 'react'
import { Globe, Sparkles, CheckCircle, AlertCircle, Loader2, History, X, RefreshCw, Copy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

// Add this helper function to provide language information
const getLanguageInfo = (languageCode: string): string => {
  const info: { [key: string]: string } = {
    'en': 'English is a West Germanic language that was first spoken in early medieval England and is now a global lingua franca. It is the third most spoken native language in the world.',
    'tw': 'Twi is a dialect of the Akan language spoken in southern and central Ghana by several million people. It is part of the Kwa language family and is written using the Latin script.',
    'ga': 'Ga is a Kwa language spoken in Ghana, in and around the capital Accra, by the Ga people. It is part of the larger Ga-Dangme language group.',
    'ew': 'Ewe is a Gbe language spoken in Togo and southeastern Ghana by approximately 4.5 million people. It is part of the Niger-Congo language family.',
    'ha': 'Hausa is a Chadic language spoken by the Hausa people, mainly in Nigeria and Niger, and in other West African countries. It is one of the most widely spoken languages in Africa.',
  }
  
  return info[languageCode] || 'This language is supported by our detection system. The text appears to be written in this language.'
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
    if (confidence >= 0.8) return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
    if (confidence >= 0.6) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
    return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
  }

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High'
    if (confidence >= 0.6) return 'Medium'
    return 'Low'
  }

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [showCopied, setShowCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)
  }

  const handleUseExample = () => {
    const examples = [
      "Akwaaba! Welcome to Ghana, the land of rich culture and warm hospitality.",
      "Me da wo ase paa! This means 'Thank you very much' in Twi.",
      "Nunya viwoe nye nuwuwu - Knowledge is power in Ewe.",
      "Ina kwana? Yaya darenku? - Common greetings in Hausa.",
      "Ga kome - This means 'It's okay' in Ga."
    ]
    const randomExample = examples[Math.floor(Math.random() * examples.length)]
    setText(randomExample)
    // Focus the textarea after setting the example
    setTimeout(() => textareaRef.current?.focus(), 100)
  }

  return (
    <div className="w-full">
      {/* Main Detection Interface */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800/80 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-500" />
                Enter Text
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleUseExample()}
                  className="text-xs px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                  Use Example
                </button>
                <button
                  onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="View history"
                >
                  <History className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type or paste your text here... (e.g., 'Akwaaba! Welcome to Ghana')"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-200 min-h-[150px] resize-none"
                  disabled={isLoading}
                />
                {text && (
                  <button
                    onClick={() => setText('')}
                    className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    aria-label="Clear text"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={detectLanguage}
                  disabled={isLoading || !text.trim() || !apiToken}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                    isLoading || !text.trim() || !apiToken
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg'
                  }`}
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
              </div>
            </div>

            {/* API Token Notice */}
            {!apiToken && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 rounded-r-lg">
                <div className="flex items-start space-x-2 text-yellow-800 dark:text-yellow-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">API Token Required</p>
                    <p className="text-sm opacity-90">Please add your API token to use this feature</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* History Panel */}
          <AnimatePresence>
            {(isHistoryOpen && recentDetections.length > 0) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white dark:bg-gray-800/80 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Recent Detections</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={clearHistory}
                        className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        title="Clear history"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setIsHistoryOpen(false)}
                        className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                        aria-label="Close history"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2 -mr-2">
                    {recentDetections.map((detection, index) => (
                      <div 
                        key={index}
                        onClick={() => {
                          setText(detection.text)
                          setResult(detection)
                          setIsHistoryOpen(false)
                        }}
                        className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {detection.text.length > 50 ? `${detection.text.substring(0, 50)}...` : detection.text}
                            </p>
                            <div className="flex items-center mt-1 space-x-2">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                                {languageFlags[detection.detectedLanguage] || '🌐'} {languageNames[detection.detectedLanguage] || detection.detectedLanguage}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getConfidenceColor(detection.confidence)}`}>
                                {Math.round(detection.confidence * 100)}% confident
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              copyToClipboard(detection.text)
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-opacity"
                            title="Copy to clipboard"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500"
              >
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">Error</p>
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Copied Notification */}
            {showCopied && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-6 right-6 px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg flex items-center space-x-2 z-50"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Copied to clipboard!</span>
              </motion.div>
            )}
          </AnimatePresence>

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
