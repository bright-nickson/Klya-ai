'use client'

import { useState, useEffect } from 'react'
import { LanguageDetection } from '@/components/language-detection'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Key, Eye, EyeOff } from 'lucide-react'

export default function DetectPage() {
  const [apiToken, setApiToken] = useState('')
  const [showToken, setShowToken] = useState(false)
  const [tokenFromStorage, setTokenFromStorage] = useState(false)

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('klya_token')
    if (savedToken) {
      setApiToken(savedToken)
      setTokenFromStorage(true)
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
      
      <main className="pt-20">
        {/* API Token Section */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="card p-6 mb-8 animate-fade-in-up">
            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>API Authentication</span>
            </h2>
            
            <div className="space-y-4">
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                    placeholder="Enter your JWT token here..."
                    className="input pr-10 focus-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {apiToken && (
                  <button
                    onClick={clearToken}
                    className="btn-outline px-4 py-2 hover-scale"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p>🔐 Your token is stored locally and used for API authentication.</p>
                <p>💡 Get your token by logging in to the KLYA AI platform.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Language Detection Component */}
        <LanguageDetection apiToken={apiToken} />
      </main>
      
      <Footer />
    </div>
  )
}
