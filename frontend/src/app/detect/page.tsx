'use client'

import { useState, useEffect } from 'react'
import { LanguageDetection } from '@/components/language-detection'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Key, Eye, EyeOff, Info, Sparkles, Globe } from 'lucide-react'

export default function DetectPage() {
  const [apiToken, setApiToken] = useState('')
  const [showToken, setShowToken] = useState(false)
  const [tokenFromStorage, setTokenFromStorage] = useState(false)
  const [showTokenSection, setShowTokenSection] = useState(true)

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('klya_token')
    if (savedToken) {
      setApiToken(savedToken)
      setTokenFromStorage(true)
      setShowTokenSection(false)
    }
  }, [])

  // Save token to localStorage when changed
  useEffect(() => {
    if (apiToken && !tokenFromStorage) {
      localStorage.setItem('klya_token', apiToken)
    }
  }, [apiToken, tokenFromStorage])

  const clearToken = () => {
    setApiToken('')
    localStorage.removeItem('klya_token')
    setTokenFromStorage(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
              <Globe className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              Language Detection
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Instantly detect the language of any text with high accuracy using our AI-powered language detection.
            </p>
          </div>

          {/* API Token Section */}
          {showTokenSection && (
            <div className="max-w-3xl mx-auto mb-16 transition-all duration-300">
              <div className="bg-white dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700/50">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center space-x-2">
                    <Key className="w-5 h-5 text-primary" />
                    <span>API Authentication</span>
                  </h2>
                  <button
                    onClick={() => setShowTokenSection(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    aria-label="Close"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <input
                        type={showToken ? 'text' : 'password'}
                        value={apiToken}
                        onChange={(e) => setApiToken(e.target.value)}
                        placeholder="Enter your JWT token here..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowToken(!showToken)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        aria-label={showToken ? 'Hide token' : 'Show token'}
                      >
                        {showToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    {apiToken ? (
                      <button
                        onClick={clearToken}
                        className="px-6 py-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors flex-shrink-0"
                      >
                        Clear Token
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowTokenSection(false)}
                        className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex-shrink-0"
                      >
                        Skip for now
                      </button>
                    )}
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex">
                      <Info className="flex-shrink-0 w-5 h-5 text-blue-500 mt-0.5 mr-2" />
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        <p className="font-medium">How to get your API token</p>
                        <ol className="list-decimal list-inside mt-1 space-y-1">
                          <li>Log in to your KLYA AI account</li>
                          <li>Navigate to API Settings</li>
                          <li>Generate a new token or copy an existing one</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!showTokenSection && (
            <div className="text-center mb-12">
              <button
                onClick={() => setShowTokenSection(true)}
                className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <Key className="w-4 h-4 mr-2" />
                {apiToken ? 'Update API Token' : 'Add API Token'}
              </button>
            </div>
          )}

          {/* Language Detection Component */}
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700/50">
            <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600">
              <div className="bg-white dark:bg-gray-800 p-1 rounded-t-xl">
                <div className="bg-gray-50 dark:bg-gray-800/80 p-6 rounded-t-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Language Detection</h2>
                      <p className="text-gray-500 dark:text-gray-400">Enter text to detect its language</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <span className="w-2 h-2 mr-1.5 bg-green-500 rounded-full"></span>
                        {apiToken ? 'API Connected' : 'Using Demo Mode'}
                      </span>
                    </div>
                  </div>
                </div>
                <LanguageDetection apiToken={apiToken} />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
